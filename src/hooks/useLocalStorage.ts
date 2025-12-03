import { useEffect, useState } from "react";

type Initializer<T> = T | (() => T);

const getInitialValue = <T,>(key: string, defaultValue: Initializer<T>): T => {
  if (typeof window === "undefined") return typeof defaultValue === "function" ? (defaultValue as () => T)() : defaultValue;
  try {
    const stored = window.localStorage.getItem(key);
    if (stored !== null) {
      return JSON.parse(stored) as T;
    }
  } catch (error) {
    console.warn(`Failed to read localStorage key "${key}"`, error);
  }
  return typeof defaultValue === "function" ? (defaultValue as () => T)() : defaultValue;
};

/**
 * Sync a stateful value with localStorage while keeping SSR compatibility.
 */
export const useLocalStorage = <T,>(key: string, defaultValue: Initializer<T>) => {
  const [value, setValue] = useState<T>(() => getInitialValue(key, defaultValue));

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Failed to write localStorage key "${key}"`, error);
    }
  }, [key, value]);

  return [value, setValue] as const;
};
