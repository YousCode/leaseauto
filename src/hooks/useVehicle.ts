import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

export function useVehicle(slug: string) {
  const qc = useQueryClient();
  const qKey = ["vehicle", slug];

  const query = useQuery({
    queryKey: qKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  useEffect(() => {
    const ch = supabase
      .channel("rt-veh-detail")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "vehicles" },
        () => {
          qc.invalidateQueries({ queryKey: ["vehicles"] });
          qc.invalidateQueries({ queryKey: ["vehicle", slug] });
        },
      )
      .subscribe();
    return () => {
      ch.unsubscribe();
    };
  }, [qc, slug]);

  return query;
}