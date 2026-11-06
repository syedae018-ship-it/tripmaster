import { NextRequest, NextResponse } from "next/server";
import { uploadToSupabaseStorage, STORAGE_BUCKETS } from "@/lib/supabase/storage";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const bucket = (formData.get("bucket") as string) || STORAGE_BUCKETS.PACKAGES;
    const folder = (formData.get("folder") as string) || "general";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to ArrayBuffer then Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate safe file name
    const timestamp = Date.now();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filePath = `${folder}/${timestamp}_${cleanFileName}`;

    const { url, error } = await uploadToSupabaseStorage(
      bucket,
      filePath,
      buffer,
      file.type || "application/octet-stream"
    );

    if (error || !url) {
      return NextResponse.json({ error: error || "Upload failed" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      url,
      path: filePath,
      bucket,
      fileName: file.name,
      fileSize: file.size,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

