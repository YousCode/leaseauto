import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { vehicleService } from "@/services/vehicleService";
import type { Vehicle, VehicleFilters } from "@/types/vehicle";

const DEFAULT_MAX_PRICE = 1000;
const DEFAULT_MAX_MILEAGE = 200000;

export const useVehicleFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState<VehicleFilters>({
    search: searchParams.get("search") || "",
    category: searchParams.getAll("category"),
    brand: searchParams.getAll("brand"),
    energy: searchParams.getAll("energy"),
    transmission: searchParams.getAll("transmission"),
    priceMin: Number(searchParams.get("priceMin")) || 0,
    priceMax: Number(searchParams.get("priceMax")) || DEFAULT_MAX_PRICE,
    mileageMax: Number(searchParams.get("mileageMax")) || DEFAULT_MAX_MILEAGE,
    availability: searchParams.getAll("availability"),
    noDeposit: searchParams.get("noDeposit") === "true",
    sort: (searchParams.get("sort") as VehicleFilters["sort"]) || "featured",
  });

  useEffect(() => {
    const fetchVehicles = async () => {
      setIsLoading(true);
      try {
        const data = await vehicleService.getAll();
        setVehicles(data);
      } catch (error) {
        console.error("Erreur chargement véhicules:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  const filteredVehicles = useMemo(() => {
    let filtered = [...vehicles];

    if (filters.search.trim()) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter((v) => {
        const brand = (v.brand || "").toLowerCase();
        const model = (v.model || "").toLowerCase();
        const title = (v.title || "").toLowerCase();
        return brand.includes(search) || model.includes(search) || title.includes(search);
      });
    }

    if (filters.category.length > 0) {
      filtered = filtered.filter((v) => filters.category.includes(String(v.category || "")));
    }

    if (filters.brand.length > 0) {
      filtered = filtered.filter((v) => filters.brand.includes(String(v.brand || "")));
    }

    if (filters.energy.length > 0) {
      filtered = filtered.filter((v) => filters.energy.includes(String(v.energy || "")));
    }

    if (filters.transmission.length > 0) {
      filtered = filtered.filter((v) => {
        const transmission = String(v.transmission || v.gearbox || "");
        return filters.transmission.includes(transmission);
      });
    }

    filtered = filtered.filter((v) => {
      const price =
        (typeof v.price_loa === "number" && v.price_loa) ??
        (typeof v.monthly === "number" && v.monthly) ??
        (typeof v.price === "number" && v.price) ??
        0;
      return price >= filters.priceMin && price <= filters.priceMax;
    });

    if (filters.mileageMax) {
      filtered = filtered.filter((v) => (v.mileage ?? 0) <= filters.mileageMax);
    }

    if (filters.availability.length > 0) {
      filtered = filtered.filter((v) => filters.availability.includes(String(v.availability || "")));
    }

    if (filters.noDeposit) {
      filtered = filtered.filter((v) => !v.deposit_required);
    }

    switch (filters.sort) {
      case "price-asc":
        filtered.sort((a, b) => (a.price_loa ?? a.monthly ?? 0) - (b.price_loa ?? b.monthly ?? 0));
        break;
      case "price-desc":
        filtered.sort((a, b) => (b.price_loa ?? b.monthly ?? 0) - (a.price_loa ?? a.monthly ?? 0));
        break;
      case "year-desc":
        filtered.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
        break;
      case "mileage-asc":
        filtered.sort((a, b) => (a.mileage ?? 0) - (b.mileage ?? 0));
        break;
      case "featured":
      default:
        filtered.sort((a, b) => (Number(b.featured) || 0) - (Number(a.featured) || 0));
    }

    return filtered;
  }, [vehicles, filters]);

  const updateFilter = (key: keyof VehicleFilters, value: VehicleFilters[keyof VehicleFilters]) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (Array.isArray(v) && v.length > 0) {
        v.forEach((item) => params.append(k, String(item)));
      } else if (typeof v === "boolean") {
        if (v) params.set(k, "true");
      } else if (v !== "" && v !== null && v !== undefined) {
        params.set(k, String(v));
      }
    });
    setSearchParams(params);
  };

  const resetFilters = () => {
    const defaults: VehicleFilters = {
      search: "",
      category: [],
      brand: [],
      energy: [],
      transmission: [],
      priceMin: 0,
      priceMax: DEFAULT_MAX_PRICE,
      mileageMax: DEFAULT_MAX_MILEAGE,
      availability: [],
      noDeposit: false,
      sort: "featured",
    };
    setFilters(defaults);
    setSearchParams(new URLSearchParams());
  };

  return {
    vehicles,
    filteredVehicles,
    filters,
    updateFilter,
    resetFilters,
    isLoading,
  };
};
