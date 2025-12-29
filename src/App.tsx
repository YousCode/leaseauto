import { Suspense, lazy } from "react";
import { Routes, Route, Navigate, useParams } from "react-router-dom";
import FloatingWhatsApp from "@/components/ui/FloatingWhatsApp";
import { Toaster } from "@/components/ui/toaster";
import ComingSoon from "@/pages/ComingSoon";

/** Wrapper pour rediriger /vehicles/:slug -> /vehicules/:slug */
function RedirectVehicleSlug() {
  const { slug } = useParams();
  return <Navigate to={`/vehicules/${slug}`} replace />;
}

const MAINTENANCE_MODE = false;

/** (Optionnel) Lazy-load pour tirer parti de <Suspense> */
const Home = lazy(() => import("@/components/home"));
const VehicleListing = lazy(() => import("@/components/vehicles/VehicleListing"));
const VehicleDetailPage = lazy(() => import("@/components/vehicles/VehicleDetailPage"));
const AdminDashboard = lazy(() => import("@/components/admin/AdminDashboard"));
const AdminVehicleManager = lazy(() => import("@/components/admin/AdminVehicleManager"));
const AdminVehicleFormPage = lazy(() => import("@/components/admin/VehicleFormPage"));
const TempoBooking = lazy(() => import("@/components/booking/TempoBooking"));
const ContactPage = lazy(() => import("@/pages/Contact"));
const ServicesPage = lazy(() => import("@/pages/Services"));
const DossierPage = lazy(() => import("@/pages/Dossier"));
const DossierTrackingPage = lazy(() => import("@/pages/DossierTracking"));

function App() {
  if (MAINTENANCE_MODE) {
    return <ComingSoon />;
  }

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
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/reservation" element={<TempoBooking />} />
          <Route path="/booking" element={<TempoBooking />} />
          <Route path="/vehicules" element={<VehicleListing />} />
          <Route path="/vehicules/:slug" element={<VehicleDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/dossier" element={<DossierPage />} />
          <Route path="/dossier/mon-dossier" element={<DossierTrackingPage />} />

          {/* Redirections EN -> FR */}
          <Route path="/vehicles" element={<Navigate to="/vehicules" replace />} />
          <Route path="/vehicles/:slug" element={<RedirectVehicleSlug />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/vehicles" element={<AdminVehicleManager />} />
          <Route path="/admin/vehicles/new" element={<AdminVehicleFormPage />} />
          <Route path="/admin/vehicles/:id/edit" element={<AdminVehicleFormPage />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <FloatingWhatsApp />
        <Toaster />
      </Suspense>
    </div>
  );
}

export default App;
