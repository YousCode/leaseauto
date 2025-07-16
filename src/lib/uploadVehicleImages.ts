import { supabase } from "./supabase";

/**
 * Upload all files to the "vehicle-images" bucket under <vehicleId>/<timestamp>_<i>.<ext>
 * Returns an array of public URLs.
 */
export async function uploadVehicleImages(
  vehicleId: string,
  files: File[],
): Promise<string[]> {
  const urls: string[] = [];

  for (const [i, file] of files.entries()) {
    // Vérification du type de fichier
    if (!file.type.startsWith("image/")) {
      throw new Error(`Le fichier ${file.name} n'est pas une image valide`);
    }

    // Vérification de la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error(`Le fichier ${file.name} est trop volumineux (max 5MB)`);
    }

    const ext = file.name.split(".").pop() || "jpg";
    const path = `${vehicleId}/${Date.now()}_${i}.${ext}`;
    const { error } = await supabase.storage
      .from("vehicle-images")
      .upload(path, file, {
        contentType: file.type,
        cacheControl: "43200", // 12 heures
        upsert: false, // évite l'écrasement
      });

    if (error) throw error;

    const { data } = supabase.storage.from("vehicle-images").getPublicUrl(path);
    urls.push(data.publicUrl);
  }
  return urls;
}

/**
 * Upload a single file to the vehicle-images bucket
 * Returns the public URL
 */
export async function uploadFile(
  file: File,
  vehicleId: string,
): Promise<string> {
  // Vérification du type de fichier
  if (!file.type.startsWith("image/")) {
    throw new Error(`Le fichier ${file.name} n'est pas une image valide`);
  }

  // Vérification de la taille (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error(`Le fichier ${file.name} est trop volumineux (max 5MB)`);
  }

  const ext = file.name.split(".").pop() || "jpg";
  const path = `${vehicleId}/${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from("vehicle-images")
    .upload(path, file, {
      contentType: file.type,
      cacheControl: "43200", // 12 heures
      upsert: false,
    });

  if (error) throw error;

  const { data } = supabase.storage.from("vehicle-images").getPublicUrl(path);
  return data.publicUrl;
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
