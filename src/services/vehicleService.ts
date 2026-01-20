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

    const trySoftDeleteFirst = async (column: "id" | "slug", value: string) => {
      const { data, error, status } = await supabase
        .from("vehicles")
        .update({ status: "archived" })
        .eq(column, value)
        .select("id");
      // 404 when row not visible due to RLS or already gone; ignore
      if (error && status !== 404) throw error;
      return Array.isArray(data) && data.length > 0;
    };

    const attempt = async (column: "id" | "slug", value: string) => {
      // Soft delete only: mark archived to hide everywhere without hitting Supabase delete 404s
      const softDeleted = await trySoftDeleteFirst(column, value).catch(() => false);
      if (!softDeleted) {
        throw new Error("Suppression non autorisée ou véhicule introuvable.");
      }
    };

    if (id) {
      await attempt("id", id);
      return;
    }

    if (slug) {
      await attempt("slug", slug);
      return;
    }

    throw new Error("Aucun véhicule correspondant à supprimer ou droits insuffisants (RLS).");
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
