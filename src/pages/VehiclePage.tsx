import { useParams, Navigate } from "react-router-dom";
import { useVehicleBySlug } from "@/hooks/useVehicleBySlug";
import VehicleGallery from "@/components/vehicles/VehicleGallery";
import { Helmet } from "react-helmet-async";
import { Car, Fuel, GaugeCircle, MapPin, Calendar } from "lucide-react";
import FloatingWhatsApp from "@/components/ui/FloatingWhatsApp";
import WhatsAppShare from "@/components/ui/WhatsAppShare";

export default function VehiclePage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading } = useVehicleBySlug(slug!);

  if (isLoading) return <Skeleton />;
  if (!data) return <Navigate to="/vehicules" replace />;

  return (
    <>
      <Helmet>
        <title>{data.title} • Lease Auto</title>
        <meta property="og:title" content={data.title} />
        <meta
          property="og:description"
          content={data.description?.slice(0, 120)}
        />
        <meta property="og:image" content={data.images?.[0]} />
        <meta property="og:url" content={location.href} />
      </Helmet>

      <section className="max-w-6xl mx-auto px-4 py-10 space-y-10">
        <header className="flex flex-col lg:flex-row gap-6">
          <VehicleGallery imgs={data.images} />

          <div className="flex-1 space-y-6">
            <h1 className="text-2xl font-bold leading-tight">{data.title}</h1>

            <div className="flex items-center gap-4 text-lg">
              <span className="text-red-600 font-semibold">{data.price} €</span>
              <span className="text-gray-500">|</span>
              <span>{data.monthly} €/mois</span>
            </div>

            <ul className="grid grid-cols-2 gap-4 text-sm">
              <Spec icon={Calendar} label="Année" val={data.year} />
              <Spec
                icon={GaugeCircle}
                label="Km"
                val={data.mileage?.toLocaleString()}
              />
              <Spec icon={Fuel} label="Énergie" val={data.energy} />
              <Spec icon={Car} label="Boîte" val={data.gearbox} />
              <Spec icon={MapPin} label="Ville" val={data.city} />
            </ul>

            <WhatsAppShare url={location.href} title={data.title} />
          </div>
        </header>

        <article className="prose max-w-none leading-relaxed">
          {data.description}
        </article>

        {data.options?.length && (
          <details className="bg-gray-50 p-5 rounded-lg">
            <summary className="cursor-pointer font-medium">
              Équipements
            </summary>
            <ul className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 list-disc list-inside text-sm">
              {data.options.map((opt: string) => (
                <li key={opt}>{opt}</li>
              ))}
            </ul>
          </details>
        )}
      </section>

      <FloatingWhatsApp />
    </>
  );
}

function Spec({ icon: Icon, label, val }: any) {
  return (
    <li className="flex items-center gap-2">
      <Icon size={16} className="text-red-600 flex-shrink-0" />
      <span className="text-gray-500">{label}</span>
      <span className="ml-auto font-medium">{val}</span>
    </li>
  );
}

function Skeleton() {
  return (
    <div className="max-w-6xl mx-auto p-8 animate-pulse space-y-4">
      <div className="h-64 bg-gray-200 rounded" />
      <div className="h-6 w-2/3 bg-gray-200 rounded" />
      <div className="h-4 w-1/3 bg-gray-200 rounded" />
    </div>
  );
}
