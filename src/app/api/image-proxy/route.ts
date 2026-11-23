import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const targetUrl = searchParams.get("url");
    const returnBase64 = searchParams.get("base64") === "true";

    if (!targetUrl) {
      return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
    }

    // Decode URL if needed
    const decodedUrl = decodeURIComponent(targetUrl);

    // If local path starting with /, construct local URL
    let fetchUrl = decodedUrl;
    if (decodedUrl.startsWith("/")) {
      const host = req.headers.get("host") || "localhost:3000";
      const protocol = req.headers.get("x-forwarded-proto") || "http";
      fetchUrl = `${protocol}://${host}${decodedUrl}`;
    }

    const response = await fetch(fetchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; TripMasterProxy/1.0)",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch image: ${response.statusText}` },
        { status: response.status }
      );
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (returnBase64) {
      const base64Data = buffer.toString("base64");
      return NextResponse.json({
        success: true,
        dataUrl: `data:${contentType};base64,${base64Data}`,
      });
    }

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error: any) {
    console.error("Image proxy error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to proxy image" },
      { status: 500 }
    );
  }
}

