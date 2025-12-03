import { useLocalStorage } from "./useLocalStorage";

/**
 * Simple wishlist backed by localStorage.
 */
export const useWishlist = () => {
  const [wishlist, setWishlist] = useLocalStorage<string[]>("lease-auto-wishlist", []);

  const addToWishlist = (vehicleId: string) => {
    setWishlist((current) => (current.includes(vehicleId) ? current : [...current, vehicleId]));
  };

  const removeFromWishlist = (vehicleId: string) => {
    setWishlist((current) => current.filter((id) => id !== vehicleId));
  };

  const toggleWishlist = (vehicleId: string) => {
    setWishlist((current) =>
      current.includes(vehicleId) ? current.filter((id) => id !== vehicleId) : [...current, vehicleId],
    );
  };

  const isInWishlist = (vehicleId: string) => wishlist.includes(vehicleId);

  const clearWishlist = () => setWishlist([]);

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
    count: wishlist.length,
  };
};
