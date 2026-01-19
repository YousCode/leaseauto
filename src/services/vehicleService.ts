// @ts-nocheck
import { supabase } from "@/lib/supabase";
import type { Vehicle } from "@/types/vehicle";

export const vehicleService = {
  async getAll(): Promise<Vehicle[]> {
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data ?? []) as Vehicle[];
  },

  async getFeatured(limit = 6): Promise<Vehicle[]> {
    const vehicles = await this.getAll();
    const featured = vehicles.filter((v) => Boolean((v as Vehicle).featured));
    return featured.slice(0, limit);
  },

  async getBySlug(slug: string): Promise<Vehicle | null> {
    const { data, error } = await supabase.from("vehicles").select("*").eq("slug", slug).maybeSingle();
    if (error) throw error;
    return (data as Vehicle) || null;
  },

  async getSimilar(vehicleId: string, category?: string | null, limit = 4): Promise<Vehicle[]> {
    const vehicles = await this.getAll();
    const filtered = vehicles.filter(
      (v) => v.id !== vehicleId && (!category || (v.category || "").toLowerCase() === category.toLowerCase()),
    );
    return filtered.slice(0, limit);
  },

  async create(vehicle: Partial<Vehicle>): Promise<Vehicle> {
    const { data, error } = await supabase.from("vehicles").insert(vehicle).select().maybeSingle();
    if (error) throw error;
    if (!data) throw new Error("Vehicle creation failed");
    return data as Vehicle;
  },

  async update(id: string, updates: Partial<Vehicle>): Promise<Vehicle> {
    const { data, error } = await supabase.from("vehicles").update(updates).eq("id", id).select().maybeSingle();
    if (error) throw error;
    if (!data) throw new Error("Vehicle update failed");
    return data as Vehicle;
  },

  async delete(
    identifier: string | { id?: string | null; slug?: string | null },
  ): Promise<void> {
    const id = typeof identifier === "string" ? identifier : identifier.id;
    const slug = typeof identifier === "string" ? undefined : identifier.slug;
    if (!id && !slug) throw new Error("Identifiant ou slug manquant pour la suppression");

    const tryDelete = async (column: "id" | "slug", value: string) => {
      const { data, error } = await supabase
        .from("vehicles")
        .delete()
        .eq(column, value)
        .select("id");
      if (error) throw error;
      return Array.isArray(data) && data.length > 0;
    };

    if (id) {
      const deleted = await tryDelete("id", id);
      if (deleted) return;
    }

    if (slug) {
      const deleted = await tryDelete("slug", slug);
      if (deleted) return;
    }

    throw new Error("Aucun véhicule correspondant à supprimer");
  },

  async getStats() {
    const { count } = await supabase.from("vehicles").select("*", { count: "exact", head: true });
    const { count: availableCount } = await supabase
      .from("vehicles")
      .select("*", { count: "exact", head: true })
      .eq("availability", "immediate");

    return {
      total: count || 0,
      available: availableCount || 0,
    };
  },
};
