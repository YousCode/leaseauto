import { supabase } from "./supabase";

/**
 * Upload all files to the "vehicle-images" bucket with safe upload pattern
 * Returns an array of public URLs.
 */
export async function uploadVehicleImages(
  vehicleId: string,
  files: File[],
): Promise<string[]> {
  const urls: string[] = [];

  for (const [i, file] of files.entries()) {
    try {
      // File validation
      if (!file.type.startsWith("image/")) {
        throw new Error(`Le fichier ${file.name} n'est pas une image valide`);
      }

      if (file.size > 6 * 1024 * 1024) { // 6MB limit
        throw new Error(`Le fichier ${file.name} est trop volumineux (max 6MB)`);
      }

      // Use unique path without leading slash
      const path = `${vehicleId}/${crypto.randomUUID()}-${file.name}`;
      
      const { data, error } = await supabase.storage
        .from("vehicle-images")
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
        .from("vehicle-images")
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
 * Upload a single file to the vehicle-images bucket with safe pattern
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
    const path = `${vehicleId}/${crypto.randomUUID()}-${file.name}`;

    const { data, error } = await supabase.storage
      .from("vehicle-images")
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
      .from("vehicle-images")
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
    // Extract the path from the public URL
    const urlParts = publicUrl.split(
      "/storage/v1/object/public/vehicle-images/",
    );
    if (urlParts.length !== 2) {
      throw new Error("Invalid public URL format");
    }

    const path = urlParts[1];
    const { error } = await supabase.storage
      .from("vehicle-images")
      .remove([path]);

    if (error) throw error;
  } catch (error) {
    console.error("Error removing file:", error);
    // Don't throw here to avoid blocking the UI if file removal fails
  }
}