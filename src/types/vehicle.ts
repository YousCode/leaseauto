import type { Database } from "./supabase";

export type VehicleRow = Database["public"]["Tables"]["vehicles"]["Row"];

export type Vehicle = VehicleRow & {
  category?: string | null;
  energy?: string | null;
  transmission?: string | null;
  price_loa?: number | null;
  price_lld?: number | null;
  monthly_price?: number | null;
  deposit_required?: boolean | null;
  availability?: string | null;
  features?: string[] | null;
  images?: string[] | null;
  description?: string | null;
  featured?: boolean | null;
  new_arrival?: boolean | null;
  highlight?: "nouveau" | "dispo" | "promo" | null;
};

export type VehicleSort = "featured" | "price-asc" | "price-desc" | "year-desc" | "mileage-asc";

export interface VehicleFilters {
  search: string;
  category: string[];
  brand: string[];
  energy: string[];
  transmission: string[];
  priceMin: number;
  priceMax: number;
  mileageMax: number;
  availability: string[];
  noDeposit: boolean;
  sort: VehicleSort;
}

export interface VehicleStats {
  total: number;
  available: number;
}
