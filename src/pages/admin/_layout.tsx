import { Outlet, Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function AdminLayout() {
  const loc = useLocation();
  const menu = [
    { to: "/admin", label: "Dashboard" },
    { to: "/admin/vehicles", label: "Annonces" },
    { to: "/admin/new", label: "Nouvelle annonce" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-60 bg-white border-r flex flex-col">
        <div className="px-6 py-4 text-2xl font-bold">
          Lease<span className="text-red-600">Auto</span>
        </div>
        <nav className="flex-1">
          {menu.map((m) => (
            <Link
              key={m.to}
              to={m.to}
              className={cn(
                "block px-4 py-2 text-sm",
                loc.pathname === m.to
                  ? "bg-red-50 text-red-600 font-medium"
                  : "text-gray-700 hover:bg-gray-100",
              )}
            >
              {m.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
