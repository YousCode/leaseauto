import { useVehicles } from "@/hooks/useVehicles";
import { Car, FileText, Archive, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const { data: published = [] } = useVehicles("published");
  const { data: drafts = [] } = useVehicles("draft");
  const { data: archived = [] } = useVehicles("archived");
  const { data: allVehicles = [] } = useVehicles();

  const totalValue = allVehicles.reduce(
    (sum: number, vehicle: any) => sum + (vehicle.price || 0),
    0,
  );

  return (
    <div className="p-8 space-y-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tableau de bord
        </h1>
        <p className="text-gray-600">
          Vue d'ensemble de votre inventaire véhicules
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Stat
          title="Publiés"
          count={published.length}
          icon={<Car className="h-8 w-8 text-green-600" />}
          color="green"
          description="Véhicules en ligne"
        />
        <Stat
          title="Brouillons"
          count={drafts.length}
          icon={<FileText className="h-8 w-8 text-yellow-600" />}
          color="yellow"
          description="En attente de publication"
        />
        <Stat
          title="Archivés"
          count={archived.length}
          icon={<Archive className="h-8 w-8 text-gray-600" />}
          color="gray"
          description="Véhicules archivés"
        />
        <Stat
          title="Valeur totale"
          count={totalValue}
          icon={<TrendingUp className="h-8 w-8 text-blue-600" />}
          color="blue"
          description="Inventaire total"
          isPrice
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Répartition par statut
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Publiés</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${allVehicles.length > 0 ? (published.length / allVehicles.length) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{published.length}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Brouillons</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{
                      width: `${allVehicles.length > 0 ? (drafts.length / allVehicles.length) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{drafts.length}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Archivés</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gray-500 h-2 rounded-full"
                    style={{
                      width: `${allVehicles.length > 0 ? (archived.length / allVehicles.length) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{archived.length}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Actions rapides
          </h3>
          <div className="space-y-3">
            <a
              href="/admin/vehicles/new"
              className="block w-full text-left p-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
            >
              <div className="font-medium text-red-900">Nouvelle annonce</div>
              <div className="text-sm text-red-600">
                Ajouter un véhicule à l'inventaire
              </div>
            </a>
            <a
              href="/admin/vehicles"
              className="block w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <div className="font-medium text-blue-900">
                Gérer les annonces
              </div>
              <div className="text-sm text-blue-600">
                Modifier, publier ou supprimer
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({
  title,
  count,
  icon,
  color,
  description,
  isPrice = false,
}: {
  title: string;
  count: number;
  icon: React.ReactNode;
  color: string;
  description: string;
  isPrice?: boolean;
}) {
  const colorClasses = {
    green: "bg-green-50 border-green-200",
    yellow: "bg-yellow-50 border-yellow-200",
    gray: "bg-gray-50 border-gray-200",
    blue: "bg-blue-50 border-blue-200",
  };

  return (
    <div
      className={`bg-white p-6 rounded-lg shadow-sm border-l-4 ${colorClasses[color as keyof typeof colorClasses]}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            {title}
          </h2>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {isPrice ? `${count.toLocaleString()}€` : count.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
        <div className="flex-shrink-0">{icon}</div>
      </div>
    </div>
  );
}
