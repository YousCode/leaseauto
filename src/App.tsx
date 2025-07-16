import { Suspense, lazy, useState, createContext, useContext } from "react";
import { useRoutes, Routes, Route, Outlet, Navigate } from "react-router-dom";
import Home from "./components/home";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

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
          {/* Public routes with layout */}
          <Route
            path="/"
            element={
              <div
                className={`flex flex-col min-h-screen bg-black ${carrosserieTheme}`}
              >
                <Navbar />
                <main className="flex-grow pt-20">
                  <Outlet />
                </main>
                <Footer />
              </div>
            }
          >
            <Route index element={<Home />} />
            <Route path="vehicules" element={<VehicleListing />} />
            <Route
              path="vehicules/:vehicleId"
              element={<VehicleDetailPage />}
            />
            {/* Redirection de l'ancienne route anglaise vers la route française */}
            <Route
              path="vehicles"
              element={<Navigate to="/vehicules" replace />}
            />
            <Route
              path="vehicles/:vehicleId"
              element={
                <Navigate
                  to={(location) =>
                    `/vehicules/${location.pathname.split("/")[2]}`
                  }
                  replace
                />
              }
            />
          </Route>

          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="vehicles" element={<VehiclesAdmin />} />
            <Route path="new" element={<VehicleForm />} />
            <Route path="edit/:id" element={<VehicleForm />} />
          </Route>

          {/* Tempo routes */}
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </Suspense>
    </CarrosserieContext.Provider>
  );
}

export default App;
