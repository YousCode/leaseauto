import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useRoutes } from "react-router-dom";
import routes from "tempo-routes";
import Home from "@/components/home";
import Navbar from "@/components/layout/Navbar";
import VehicleListing from "@/components/vehicles/VehicleListing";
import VehicleDetailPage from "@/components/vehicles/VehicleDetailPage";
import Dashboard from "@/pages/admin/dashboard";
import VehiclesAdmin from "@/pages/admin/vehicles";
import VehicleForm from "@/pages/admin/vehicle-form";
import FloatingWhatsApp from "@/components/ui/FloatingWhatsApp";

function App() {
  return (
    <Suspense
      fallback={
        <div className="w-screen h-screen flex items-center justify-center bg-gray-50 text-gray-900">
          Loading...
        </div>
      }
    >
      <Routes>
        {/* HOME */}
        <Route
          path="/"
          element={
            <div className="flex flex-col min-h-screen bg-gray-50">
              <Navbar />
              <main className="flex-grow pt-20">
                <Home />
              </main>
            </div>
          }
        />

        {/* LISTE PUBLIC */}
        <Route
          path="/vehicules"
          element={
            <div className="flex flex-col min-h-screen bg-gray-50">
              <Navbar />
              <main className="flex-grow pt-20">
                <VehicleListing />
              </main>
            </div>
          }
        />

        {/* FICHE DÉTAIL */}
        <Route
          path="/vehicules/:slug"
          element={
            <div className="flex flex-col min-h-screen bg-gray-50">
              <Navbar />
              <main className="flex-grow pt-20">
                <VehicleDetailPage />
              </main>
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

        {/* Admin routes - temporarily disabled */}
        <Route path="/admin" element={<div>Admin section temporarily unavailable</div>} />

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
  );
}

export default App;