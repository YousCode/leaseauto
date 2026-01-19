import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Lock, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

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
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-900 border-gray-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-white">
            Lease<span className="text-[#DA1212]">Auto</span> Admin
          </CardTitle>
          <CardDescription className="text-center text-gray-400">
            Connectez-vous pour accéder au panneau d'administration
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-900/30 border border-red-800 text-red-300 px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  size={18}
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white"
                  required
                />
              </div>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  size={18}
                />
                <Input
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white"
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-[#DA1212] hover:bg-[#B50F0F] text-white"
              disabled={isLoading}
            >
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
