import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const ADMIN_FALLBACK_FLAG = "isAdmin";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!active) return;
      if (error) {
        console.warn("Supabase session error", error);
      }
      setSession(data.session ?? null);
      setLoading(false);
    };
    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setLoading(false);
      if (!newSession) localStorage.removeItem(ADMIN_FALLBACK_FLAG);
    });

    return () => {
      active = false;
      listener?.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    setSession(data.session ?? null);
    setLoading(false);

    if (error) {
      return { error: error.message };
    }

    // Allow a manual override when user_metadata lacks role during staging
    const role =
      data.session?.user.user_metadata?.role ||
      data.session?.user.app_metadata?.role ||
      null;
    if (role === "admin") {
      localStorage.setItem(ADMIN_FALLBACK_FLAG, "true");
    }
    return {};
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    localStorage.removeItem(ADMIN_FALLBACK_FLAG);
    setSession(null);
  }, []);

  const isAdmin = useMemo(() => {
    const metaRole =
      session?.user.user_metadata?.role || session?.user.app_metadata?.role;
    if (metaRole === "admin") return true;
    return localStorage.getItem(ADMIN_FALLBACK_FLAG) === "true";
  }, [session]);

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      loading,
      isAdmin,
      signIn,
      signOut,
    }),
    [session, loading, isAdmin, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}
