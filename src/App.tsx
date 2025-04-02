import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import routes from "tempo-routes";

// Lazy load components for better performance
const VehicleDetail = lazy(() => import("./components/vehicles/VehicleDetail"));
const VehicleListing = lazy(
  () => import("./components/vehicles/VehicleListing"),
);
const AdminLogin = lazy(() => import("./components/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./components/admin/AdminDashboard"));

function App() {
  return (
    <Suspense
      fallback={
        <div className="w-screen h-screen flex items-center justify-center bg-black text-white">
          Loading...
        </div>
      }
    >
      <div className="flex flex-col min-h-screen bg-black">
        <Navbar />
        <main className="flex-grow pt-20">
          {" "}
          {/* Add padding-top to account for fixed navbar */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/vehicules" element={<VehicleListing />} />
            <Route path="/vehicules/:vehicleId" element={<VehicleDetail />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            {import.meta.env.VITE_TEMPO === "true" && (
              <Route path="/tempobook/*" />
            )}
          </Routes>
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        </main>
        <Footer />
      </div>
    </Suspense>
  );
}

export default App;
