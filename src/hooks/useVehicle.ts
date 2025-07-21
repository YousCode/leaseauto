import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useVehicle = (slug: string) =>
  useQuery({
    queryKey: ["vehicle", slug],
    queryFn: async () =>
      (
        await supabase
          .from("vehicles")
          .select("*")
          .eq("slug", slug)
          .eq("status", "published")
          .single()
      ).data,
    enabled: !!slug,
  });
