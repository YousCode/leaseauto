import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ➊– service-role → bypass RLS
const sb = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

// ➋– autoriser l'origine de votre front (pas * en prod)
const CORS = {
  "Access-Control-Allow-Origin": Deno.env.get("ALLOWED_ORIGIN") ?? "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "content-type, authorization, apikey, x-client-info",
};

Deno.serve(async (req) => {
  // Pré-flight
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    const { id } = await req.json();
    if (!id) throw new Error("missing id");

    // Récupération des images pour les nettoyer
    const { data, error } = await sb
      .from("vehicles")
      .select("images,status")
      .eq("id", id)
      .single();

    if (error) throw error;
    if (data.status === "archived")
      return new Response("already archived", { headers: CORS });

    // Archivage de l'annonce
    await sb.from("vehicles").update({ status: "archived" }).eq("id", id);

    // Suppression physiques des fichiers
    if (data.images?.length) {
      const paths = data.images.map(
        (u: string) => u.split("/object/public/")[1],
      );
      await sb.storage.from("vehicle-images").remove(paths);
    }

    return new Response("archived", { headers: CORS });
  } catch (e) {
    return new Response((e as Error).message, {
      status: 400,
      headers: CORS,
    });
  }
});
