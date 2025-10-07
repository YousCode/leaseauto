import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useRoutes } from "react-router-dom";
import routes from "tempo-routes";
import Home from "@/components/home";
import VehicleListing from "@/components/vehicles/VehicleListing";
import VehicleDetailPage from "@/components/vehicles/VehicleDetailPage";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminVehicleManager from "@/components/admin/AdminVehicleManager";
import VehicleForm from "@/components/admin/VehicleForm";
import FloatingWhatsApp from "@/components/ui/FloatingWhatsApp";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Suspense
        fallback={
          <div className="w-screen h-screen flex items-center justify-center bg-white">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        }
      >
        <Routes>
          {/* HOME */}
          <Route path="/" element={<Home />} />

          {/* LISTE PUBLIC */}
          <Route path="/vehicules" element={<VehicleListing />} />

          {/* FICHE DÉTAIL - Utilise le bon composant */}
          <Route path="/vehicules/:slug" element={<VehicleDetailPage />} />

          {/* redirection legacy /vehicles → /vehicules */}
          <Route path="/vehicles" element={<Navigate to="/vehicules" replace />} />
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
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/vehicles" element={<AdminVehicleManager />} />
          <Route path="/admin/vehicles/new" element={<VehicleForm />} />
          <Route path="/admin/vehicles/:id/edit" element={<VehicleForm />} />

          {/* Fallback 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        {/* Tempo routes for storyboards */}
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        
        <FloatingWhatsApp />
        <Toaster />
      </Suspense>
    </div>
  );
}

export default App;