import html2canvasPro from "html2canvas-pro";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

export interface GeneratePdfOptions {
  fileName?: string;
  quality?: number;
  scale?: number;
}

/**
 * Generates an ultra-crisp, mobile-optimized continuous single-column PDF
 * from a DOM element (sized at 430px width).
 * Supports modern CSS colors (lab, oklch, p3) with dual-engine reliability.
 */
export async function generateMobilePdf(
  element: HTMLElement,
  options: GeneratePdfOptions = {}
): Promise<{ success: boolean; error?: string; pdf?: jsPDF }> {
  try {
    const {
      fileName = "TripMaster_Mobile_Itinerary_Plan.pdf",
      scale = 2.5, // 2.5x retina clarity for phone screens
    } = options;

    let imgData: string;
    let width = 430;
    let height = element.offsetHeight || 1200;

    try {
      // Primary: html2canvas-pro (full support for lab(), oklch(), modern CSS Color 4)
      const canvas = await (html2canvasPro as any)(element, {
        scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#FBFBFA",
        logging: false,
        windowWidth: 430,
      });

      imgData = canvas.toDataURL("image/png", 0.95);
      width = canvas.width;
      height = canvas.height;
    } catch (primaryErr: any) {
      console.warn("Primary canvas renderer error, falling back to html-to-image:", primaryErr);

      // Fallback: html-to-image (uses native browser SVG ForeignObject, 100% color immune)
      imgData = await toPng(element, {
        pixelRatio: scale,
        backgroundColor: "#FBFBFA",
        cacheBust: true,
      });

      const elementHeight = element.scrollHeight || element.offsetHeight || 1200;
      height = elementHeight * scale;
      width = 430 * scale;
    }

    // Calculate mobile PDF dimensions (430pt width by dynamic continuous height)
    const pdfWidth = 430;
    const pdfHeight = (height * pdfWidth) / width;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: [pdfWidth, pdfHeight],
      hotfixes: ["px_scaling"],
    });

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
    pdf.save(fileName);

    return { success: true, pdf };
  } catch (error: any) {
    console.error("PDF generation error:", error);
    return {
      success: false,
      error: error?.message || "Failed to generate mobile PDF",
    };
  }
}
