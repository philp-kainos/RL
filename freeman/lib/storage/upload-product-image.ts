import type { SupabaseClient } from "@supabase/supabase-js";

const BUCKET = "product-images";

const CONTENT_TYPE_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/svg+xml": "svg",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function uploadProductImage(
  supabase: SupabaseClient,
  slug: string,
  data: Buffer | Uint8Array,
  contentType: string,
): Promise<string> {
  const ext = CONTENT_TYPE_TO_EXT[contentType] ?? "bin";
  const filePath = `${slug}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, data, { contentType, upsert: true });

  if (error) throw new Error(`Failed to upload ${filePath}: ${error.message}`);

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(filePath);

  return publicUrl;
}
