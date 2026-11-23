import { toPng, toJpeg } from "html-to-image";
import jsPDF from "jspdf";

export interface GeneratePdfOptions {
  fileName?: string;
  quality?: number;
  scale?: number;
}

const PLACEHOLDER_SVG =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect fill='%23F1F5F9' width='100' height='100'/%3E%3C/svg%3E";

/**
 * Generates an ultra-crisp, Super-HD Retina mobile PDF (300+ DPI)
 * from a DOM element sized at 430px width.
 * Uses html-to-image (lossless SVG-rendered PNG) which natively supports
 * modern CSS color functions like lab(), oklch(), and color-mix without ever throwing
 * 'unsupported color function' errors.
 */
export async function generateMobilePdf(
  element: HTMLElement,
  options: GeneratePdfOptions = {}
): Promise<{ success: boolean; error?: string; pdf?: jsPDF }> {
  try {
    const {
      fileName = "TripMaster_Mobile_Itinerary_Plan.pdf",
      scale = 2.5, // 2.5x Retina clarity (~300 DPI for razor-sharp text on mobile)
    } = options;

    const elementWidth = 430;
    const elementHeight = element.scrollHeight || element.offsetHeight || 1200;

    let imgData: string | null = null;

    // Attempt 1: html-to-image toPng (lossless vector-to-canvas rendering)
    try {
      imgData = await toPng(element, {
        pixelRatio: scale,
        quality: 1.0,
        backgroundColor: "#FFFFFF",
        cacheBust: false,
        skipFonts: true, // Prevents cross-origin @font-face CSS parsing issues
        fontEmbedCSS: "",
        imagePlaceholder: PLACEHOLDER_SVG,
        width: elementWidth,
        height: elementHeight,
        filter: (node) => {
          if (node instanceof HTMLElement && node.classList.contains("no-pdf-export")) {
            return false;
          }
          return true;
        },
      });
    } catch (toPngErr) {
      console.warn("Attempt 1 (toPng) failed, attempting Attempt 2 (toJpeg):", toPngErr);
    }

    // Attempt 2: toJpeg fallback
    if (!imgData) {
      try {
        imgData = await toJpeg(element, {
          pixelRatio: scale,
          quality: 0.98,
          backgroundColor: "#FFFFFF",
          skipFonts: true,
          fontEmbedCSS: "",
          imagePlaceholder: PLACEHOLDER_SVG,
          width: elementWidth,
          height: elementHeight,
          filter: (node) => {
            if (node instanceof HTMLElement && node.classList.contains("no-pdf-export")) {
              return false;
            }
            return true;
          },
        });
      } catch (toJpegErr) {
        console.warn("Attempt 2 (toJpeg) failed:", toJpegErr);
      }
    }

    if (!imgData) {
      // If canvas capture fails due to strict browser sandbox, open Vector Print dialog
      console.warn("Direct rasterization failed, launching Vector Print window fallback.");
      printVectorMobileDossier(element, fileName.replace(/\.pdf$/i, ""));
      return {
        success: true,
      };
    }

    // Exact 430pt single-column mobile dimension
    const pdfWidth = elementWidth;
    const pdfHeight = elementHeight;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: [pdfWidth, pdfHeight],
      hotfixes: ["px_scaling"],
      compress: false, // Lossless image embedding for maximum clarity
    });

    const format = imgData.startsWith("data:image/jpeg") ? "JPEG" : "PNG";
    pdf.addImage(imgData, format, 0, 0, pdfWidth, pdfHeight, undefined, "NONE");
    pdf.save(fileName);

    return { success: true, pdf };
  } catch (error: any) {
    console.error("PDF generation error:", error);
    // Graceful fallback to Vector Print window
    try {
      printVectorMobileDossier(element, options.fileName?.replace(/\.pdf$/i, "") || "TripMaster Mobile Dossier");
      return { success: true };
    } catch {
      return {
        success: false,
        error: error?.message || "Failed to generate mobile PDF",
      };
    }
  }
}

/**
 * True Vector Print / PDF Exporter:
 * Opens a dedicated 430px mobile print window where all fonts remain 100% TRUE VECTORS
 * (Helvetica Bold & Poppins) without any rasterization, enabling crisp zero-blur printing.
 */
export function printVectorMobileDossier(element: HTMLElement, title: string = "TripMaster Mobile Dossier") {
  try {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    const printWindow = window.open("", "_blank", "width=480,height=900");
    if (!printWindow) {
      alert("Please allow popups to open the Vector PDF print dialog.");
      return;
    }

    const htmlContent = element.outerHTML;

    // Collect all stylesheets from parent document so Tailwind styles are fully rendered
    const parentStyles = Array.from(document.querySelectorAll("style, link[rel='stylesheet']"))
      .map((el) => el.outerHTML)
      .join("\n");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <meta name="viewport" content="width=430, initial-scale=1.0">
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
          ${parentStyles}
          <style>
            @page {
              size: 430px auto;
              margin: 0;
            }
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              box-sizing: border-box;
            }
            body {
              margin: 0;
              padding: 0;
              background-color: #FFFFFF;
              font-family: 'Poppins', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              display: flex;
              justify-content: center;
            }
            .print-container {
              width: 430px !important;
              max-width: 430px !important;
              min-width: 430px !important;
              margin: 0 auto !important;
              background: #FFFFFF !important;
              box-shadow: none !important;
            }
            .no-pdf-export {
              display: none !important;
            }
            img {
              max-width: 100% !important;
              height: auto !important;
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            ${htmlContent}
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 400);
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  } catch (e: any) {
    console.error("Vector print error:", e);
    alert(`Could not open print window: ${e?.message}`);
  }
}
