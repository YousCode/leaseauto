import { Outlet, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Car, Home, Plus, Settings } from "lucide-react";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                Admin LeaseAuto
              </h1>
            </div>
            <nav className="flex space-x-4">
              <NavLink
                to="/admin"
                end
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? "bg-red-100 text-red-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`
                }
              >
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </NavLink>
              <NavLink
                to="/admin/vehicles"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? "bg-red-100 text-red-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`
                }
              >
                <Car className="w-4 h-4 mr-2" />
                Véhicules
              </NavLink>
              <NavLink
                to="/admin/vehicles/new"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? "bg-red-100 text-red-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`
                }
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouveau
              </NavLink>
            </nav>
            <Button
              variant="outline"
              size="sm"
              onClick={() => (window.location.href = "/")}
            >
              Retour au site
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
