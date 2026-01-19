import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

export function useVehicles(
  status?: "draft" | "published" | "archived",
  opts?: { includeArchived?: boolean },
) {
  const qc = useQueryClient();
  const qKey = ["vehicles", status ?? "all"];

  const query = useQuery({
    queryKey: qKey,
    queryFn: async () => {
      let q = supabase
        .from("vehicles")
        .select("*")
        .order("created_at", { ascending: false });
      if (status) {
        q = q.eq("status", status);
      } else if (!opts?.includeArchived) {
        q = q.neq("status", "archived");
      }
      const { data } = await q;
      return data ?? [];
    },
  });

  useEffect(() => {
    const ch = supabase
      .channel("rt-veh")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "vehicles" },
        () => qc.invalidateQueries({ queryKey: ["vehicles"], exact: false }),
      )
      .subscribe();
    return () => {
      ch.unsubscribe();
    };
  }, [qc]);

  return query;
}
