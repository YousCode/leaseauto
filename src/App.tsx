import { Suspense, lazy } from "react";
import { Routes, Route, Navigate, useParams, Outlet } from "react-router-dom";
import FloatingWhatsApp from "@/components/ui/FloatingWhatsApp";
import { Toaster } from "@/components/ui/toaster";
import ComingSoon from "@/pages/ComingSoon";
import { AuthProvider } from "@/providers/AuthProvider";
import HeaderSection from "@/components/sections/HeaderSection";

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
const AdminDashboard = lazy(() => import("@/admin/AdminDashboard"));
const AdminVehicleManager = lazy(() => import("@/admin/AdminVehicleManager"));
const AdminVehicleFormPage = lazy(() => import("@/admin/VehicleFormPage"));
const AdminLogin = lazy(() => import("@/admin/AdminLogin"));
const TempoBooking = lazy(() => import("@/components/booking/TempoBooking"));
const ContactPage = lazy(() => import("@/pages/Contact"));
const ServicesPage = lazy(() => import("@/pages/Services"));
const DossierPage = lazy(() => import("@/pages/Dossier"));
const DossierTrackingPage = lazy(() => import("@/pages/DossierTracking"));
const FinancementPage = lazy(() => import("@/pages/Financement"));
const MentionsLegalesPage = lazy(() => import("@/pages/MentionsLegales"));
const PolitiqueConfidentialitePage = lazy(() => import("@/pages/PolitiqueConfidentialite"));
const ConditionsGeneralesPage = lazy(() => import("@/pages/ConditionsGenerales"));
const CookiesPage = lazy(() => import("@/pages/Cookies"));

const PublicLayout = () => (
  <>
    <HeaderSection />
    {/* Décale le contenu sous le header fixe */}
    <div className="pt-24">
      <Outlet />
    </div>
  </>
);

function App() {
  if (MAINTENANCE_MODE) {
    return <ComingSoon />;
  }

  return (
    <AuthProvider>
      <div className="min-h-screen bg-white">
      <Suspense
        fallback={
          <div className="w-screen h-screen flex items-center justify-center bg-white">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        }
      >
        <Routes>
          {/* Public avec header global */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/reservation" element={<TempoBooking />} />
            <Route path="/booking" element={<TempoBooking />} />
            <Route path="/vehicules" element={<VehicleListing />} />
            <Route path="/vehicules/:slug" element={<VehicleDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/financement" element={<FinancementPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/dossier" element={<DossierPage />} />
            <Route path="/dossier/mon-dossier" element={<DossierTrackingPage />} />
            <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
            <Route path="/politique-de-confidentialite" element={<PolitiqueConfidentialitePage />} />
            <Route path="/conditions-generales" element={<ConditionsGeneralesPage />} />
            <Route path="/cookies" element={<CookiesPage />} />
          </Route>

          {/* Redirections EN -> FR */}
          <Route path="/vehicles" element={<Navigate to="/vehicules" replace />} />
          <Route path="/vehicles/:slug" element={<RedirectVehicleSlug />} />

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
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
    </AuthProvider>
  );
}

export default App;
