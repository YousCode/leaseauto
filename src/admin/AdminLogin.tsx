import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DURATION, EASE, DISTANCE } from "@/lib/motion";
import { ArrowRight, Lock, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const logoWhite = `${import.meta.env.BASE_URL}logo-lease-auto-white.png`;

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { signIn } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const mappedEmail = email.trim().toLowerCase() === "belha"
      ? "belha@leaseauto.dev"
      : email.trim();

    const { error: signInError } = await signIn(mappedEmail, password);

    if (signInError) {
      setError(signInError);
      setIsLoading(false);
      return;
    }

    window.location.href = "/admin/vehicles";
  };

  return (
    <div className="grain relative flex min-h-screen items-center justify-center overflow-hidden bg-night px-4 py-12 text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-brand-ink/60 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-52 -left-32 h-[420px] w-[420px] rounded-full bg-brand-primary/25 blur-[130px]"
      />

      <motion.div
        initial={{ opacity: 0, y: DISTANCE }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION, ease: EASE }}
        className="relative z-10 w-full max-w-md"
      >
        <img
          src={logoWhite}
          alt="Lease Auto"
          width={457}
          height={86}
          className="mx-auto mb-8 h-8 w-auto"
        />

        <div className="surface p-6 text-slate-900 sm:p-10">
          <motion.div
            initial={{ opacity: 0, y: DISTANCE }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION, ease: EASE, delay: 0.15 }}
          >
            <p className="eyebrow">Accès réservé</p>
            <h1 className="display-md mt-3 text-night">Administration</h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Connectez-vous pour accéder au panneau d'administration
            </p>
          </motion.div>

          <div className="mt-8">
            <AnimatePresence>
              {error && (
                <motion.div
                  role="alert"
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: DURATION, ease: EASE }}
                  className="overflow-hidden rounded-2xl border border-red-500/30 bg-red-50 text-sm text-red-600"
                >
                  <p className="px-4 py-3">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>
            <form onSubmit={handleLogin} className="space-y-6">
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: DISTANCE }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: DURATION, ease: EASE, delay: 0.22 }}
              >
                <label className="block text-sm">
                  <span className="font-medium text-slate-700">Email</span>
                  <span className="relative mt-2 block">
                    <User
                      aria-hidden
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      autoComplete="username"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="field pl-11 text-base"
                      required
                    />
                  </span>
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-slate-700">Mot de passe</span>
                  <span className="relative mt-2 block">
                    <Lock
                      aria-hidden
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      type="password"
                      placeholder="Mot de passe"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="field pl-11 text-base"
                      required
                    />
                  </span>
                </label>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: DURATION, ease: EASE, delay: 0.32 }}
              >
                <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span
                        aria-hidden
                        className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                      />
                      Connexion…
                    </>
                  ) : (
                    <>
                      Se connecter
                      <ArrowRight />
                    </>
                  )}
                </button>
              </motion.div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
