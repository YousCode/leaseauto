import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const allowedOrigins = [
  "https://canvas-nifty-feistel1-nqt3j.tempo.build",
  "https://nifty-feistel1-nqt3j.view-3.tempo-dev.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

function cors(origin?: string | null) {
  const allowedOrigin = allowedOrigins.includes(origin || "") ? origin : "*";
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers":
      "authorization,content-type,x-client-info,apikey",
    "Content-Type": "application/json",
  };
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");

  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors(origin) });
  }

  // Check origin for security
  if (!allowedOrigins.includes(origin || "")) {
    return new Response("Forbidden", {
      status: 403,
      headers: cors(origin),
    });
  }

  try {
    const { id } = await req.json();
    if (!id) throw new Error("Missing id");

    // delete images in bucket
    const { data: veh } = await supabase
      .from("vehicles")
      .select("images")
      .eq("id", id)
      .single();
    if (veh?.images?.length) {
      await supabase.storage
        .from("vehicle-images")
        .remove(
          veh.images.map((u: string) => u.replace(/^.+\/vehicle-images\//, "")),
        );
    }

    await supabase.from("vehicles").delete().eq("id", id);
    return new Response(JSON.stringify({ ok: true }), {
      headers: cors(origin),
      status: 200,
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      headers: cors(origin),
      status: 400,
    });
  }
});
