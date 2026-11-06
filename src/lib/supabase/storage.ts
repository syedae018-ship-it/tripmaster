import { supabaseAdmin } from "./admin";

export const STORAGE_BUCKETS = {
  PACKAGES: "packages",
  HOTELS: "hotels",
  CUSTOMER_DOCS: "customer-documents",
  CMS: "cms-media",
} as const;

/**
 * Ensures that a storage bucket exists with public access.
 */
export async function ensureBucketExists(bucketName: string, isPublic = true) {
  try {
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
    if (listError) {
      console.warn("Could not list buckets:", listError.message);
      return false;
    }

    const exists = buckets?.some((b) => b.name === bucketName);
    if (!exists) {
      const { error: createError } = await supabaseAdmin.storage.createBucket(bucketName, {
        public: isPublic,
      });
      if (createError) {
        console.warn(`Could not create bucket '${bucketName}':`, createError.message);
        return false;
      }
    }
    return true;
  } catch (err) {
    console.error("ensureBucketExists error:", err);
    return false;
  }
}

/**
 * Uploads a file buffer to a Supabase storage bucket and returns its public URL.
 */
export async function uploadToSupabaseStorage(
  bucket: string,
  filePath: string,
  fileBuffer: Buffer | Uint8Array,
  contentType: string
): Promise<{ url: string | null; error: string | null }> {
  try {
    await ensureBucketExists(bucket, true);

    const { error: uploadError } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filePath, fileBuffer, {
        contentType,
        upsert: true,
      });

    if (uploadError) {
      return { url: null, error: uploadError.message };
    }

    const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(filePath);
    return { url: data.publicUrl, error: null };
  } catch (err: any) {
    return { url: null, error: err?.message || "Upload failed" };
  }
}
