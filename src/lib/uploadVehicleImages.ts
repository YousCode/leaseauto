import { supabase } from "./supabase";

/**
 * Upload all files to the configured bucket with safe upload pattern
 * Returns an array of public URLs.
 */
const configuredBucket = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET;
const STORAGE_BUCKET =
  configuredBucket && configuredBucket.trim().length > 0
    ? configuredBucket.trim()
    : "vehicle-images";
const PUBLIC_OBJECT_PREFIX = "/storage/v1/object/public/";

const normalizeAscii = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[^\x00-\x7F]/g, "")
    .trim();

const sanitizePathSegment = (value: string, fallback: string) => {
  const ascii = normalizeAscii(value);
  const safe = ascii
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "");
  return safe.length > 0 ? safe : fallback;
};

const sanitizeFileName = (name: string) => {
  const ascii = normalizeAscii(name);
  const parts = ascii.split(".");
  if (parts.length === 1) {
    return sanitizePathSegment(ascii, "image");
  }
  const ext = sanitizePathSegment(parts.pop() || "", "");
  const base = sanitizePathSegment(parts.join("."), "image");
  return ext ? `${base}.${ext}` : base;
};

export async function uploadVehicleImages(
  vehicleId: string,
  files: File[],
): Promise<string[]> {
  const urls: string[] = [];
  const safeVehicleId = sanitizePathSegment(vehicleId, "vehicule");

  for (const file of files) {
    try {
      // File validation
      if (!file.type.startsWith("image/")) {
        throw new Error(`Le fichier ${file.name} n'est pas une image valide`);
      }

      if (file.size > 6 * 1024 * 1024) { // 6MB limit
        throw new Error(`Le fichier ${file.name} est trop volumineux (max 6MB)`);
      }

      // Use unique path without leading slash
      const safeName = sanitizeFileName(file.name);
      const path = `${safeVehicleId}/${crypto.randomUUID()}-${safeName}`;
      
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(path, file, {
          contentType: file.type || 'application/octet-stream',
          cacheControl: "3600",
          upsert: true, // Prevents "resource already exists" errors
        });

      if (error) {
        console.error('SUPABASE UPLOAD ERROR:', error);
        throw error;
      }

      const { data: publicUrlData } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(path);
      urls.push(publicUrlData.publicUrl);
    } catch (error: any) {
      console.error('SUPABASE UPLOAD ERROR:', error);
      throw new Error(error?.message || `Upload failed for ${file.name}`);
    }
  }
  return urls;
}

/**
 * Upload a single file to the configured bucket with safe pattern
 * Returns the public URL
 */
export async function uploadFile(
  file: File,
  vehicleId: string,
): Promise<string> {
  try {
    // File validation
    if (!file.type.startsWith("image/")) {
      throw new Error(`Le fichier ${file.name} n'est pas une image valide`);
    }

    if (file.size > 6 * 1024 * 1024) { // 6MB limit
      throw new Error(`Le fichier ${file.name} est trop volumineux (max 6MB)`);
    }

    // Use unique path without leading slash
    const safeVehicleId = sanitizePathSegment(vehicleId, "vehicule");
    const safeName = sanitizeFileName(file.name);
    const path = `${safeVehicleId}/${crypto.randomUUID()}-${safeName}`;

    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, file, {
        contentType: file.type || 'application/octet-stream',
        cacheControl: "3600",
        upsert: true, // Prevents "resource already exists" errors
      });

    if (error) {
      console.error('SUPABASE UPLOAD ERROR:', error);
      throw error;
    }

    const { data: publicUrlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(path);
    return publicUrlData.publicUrl;
  } catch (error: any) {
    console.error('SUPABASE UPLOAD ERROR:', error);
    throw new Error(error?.message || `Upload failed for ${file.name}`);
  }
}

/**
 * Remove a file from storage using its public URL
 */
export async function removeFile(publicUrl: string): Promise<void> {
  try {
    const cleanUrl = publicUrl.split("?")[0];
    const marker = `${PUBLIC_OBJECT_PREFIX}${STORAGE_BUCKET}/`;
    let bucket = STORAGE_BUCKET;
    let path: string | undefined;

    if (cleanUrl.includes(marker)) {
      path = cleanUrl.split(marker)[1];
    } else if (cleanUrl.includes(PUBLIC_OBJECT_PREFIX)) {
      const [, rest] = cleanUrl.split(PUBLIC_OBJECT_PREFIX);
      const [bucketFromUrl, ...restParts] = rest.split("/");
      if (bucketFromUrl && restParts.length > 0) {
        bucket = bucketFromUrl;
        path = restParts.join("/");
      }
    }

    if (!path) {
      throw new Error("Invalid public URL format");
    }

    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;
  } catch (error) {
    console.error("Error removing file:", error);
    // Don't throw here to avoid blocking the UI if file removal fails
  }
}
