import { Suspense, lazy, useState, createContext, useContext } from "react";
import { useRoutes, Routes, Route, Outlet, Navigate } from "react-router-dom";
import Home from "./components/home";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import FloatingWhatsApp from "./components/ui/FloatingWhatsApp";

import routes from "tempo-routes";

// Theme context for carrosserie effects
type CarrosserieTheme = "glossy" | "matte";

const CarrosserieContext = createContext<{
  theme: CarrosserieTheme;
  setTheme: (theme: CarrosserieTheme) => void;
}>({ theme: "glossy", setTheme: () => {} });

// Lazy load components for better performance
const VehicleDetail = lazy(() => import("./components/vehicles/VehicleDetail"));
const VehicleDetailPage = lazy(
  () => import("./components/vehicles/VehicleDetailPage"),
);
const VehicleListing = lazy(
  () => import("./components/vehicles/VehicleListing"),
);
const VehiclePage = lazy(() => import("./pages/VehiclePage"));

const AdminLayout = lazy(() => import("./pages/admin/_layout"));
const Dashboard = lazy(() => import("./pages/admin/dashboard"));
const VehiclesAdmin = lazy(() => import("./pages/admin/vehicles"));
const VehicleForm = lazy(() => import("./pages/admin/vehicle-form"));

export const useCarrosserie = () => useContext(CarrosserieContext);

function App() {
  const [carrosserieTheme, setCarrosserieTheme] =
    useState<CarrosserieTheme>("glossy");

  return (
    <CarrosserieContext.Provider
      value={{ theme: carrosserieTheme, setTheme: setCarrosserieTheme }}
    >
      <Suspense
        fallback={
          <div className="w-screen h-screen flex items-center justify-center bg-black text-white">
            Loading...
          </div>
        }
      >
        <Routes>
          {/* HOME */}
          <Route
            path="/"
            element={
              <div
                className={`flex flex-col min-h-screen bg-black ${carrosserieTheme}`}
              >
                <Navbar />
                <main className="flex-grow pt-20">
                  <Home />
                </main>
                <Footer />
              </div>
            }
          />

          {/* LISTE PUBLIC */}
          <Route
            path="/vehicules"
            element={
              <div
                className={`flex flex-col min-h-screen bg-black ${carrosserieTheme}`}
              >
                <Navbar />
                <main className="flex-grow pt-20">
                  <VehicleListing />
                </main>
                <Footer />
              </div>
            }
          />

          {/* FICHE DÉTAIL */}
          <Route
            path="/vehicules/:slug"
            element={
              <div
                className={`flex flex-col min-h-screen bg-black ${carrosserieTheme}`}
              >
                <Navbar />
                <main className="flex-grow pt-20">
                  <VehiclePage />
                </main>
                <Footer />
              </div>
            }
          />

          {/* redirection legacy /vehicles → /vehicules */}
          <Route
            path="/vehicles"
            element={<Navigate to="/vehicules" replace />}
          />
          <Route
            path="/vehicles/:slug"
            element={
              <Navigate
                to={({ params }) => `/vehicules/${params!.slug}`}
                replace
              />
            }
          />

          {/* Admin routes */}
          <Route path="/admin/*" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="vehicles" element={<VehiclesAdmin />} />
            <Route path="vehicles/:id" element={<VehicleForm />} />
            <Route path="new" element={<VehicleForm />} />
            <Route path="edit/:id" element={<VehicleForm />} />
          </Route>

          {/* Tempo routes */}
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" element={<div />} />
          )}

          {/* Fallback 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        <FloatingWhatsApp />
      </Suspense>
    </CarrosserieContext.Provider>
  );
}

export default App;
