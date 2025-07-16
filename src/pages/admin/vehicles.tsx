import { useVehicles } from "@/hooks/useVehicles";
import { supabase } from "@/lib/supabase";
import { removeFile } from "@/lib/uploadVehicleImages";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Edit,
  Trash2,
  Archive,
  CheckCircle,
  Clock,
  Plus,
  Search,
  Filter,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AdminVehicles() {
  const { data: vehicles = [], isLoading } = useVehicles();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const setStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("vehicles")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      alert("Erreur lors de la mise à jour du statut");
    }
  };

  const deleteVehicle = async (id: string) => {
    try {
      setDeletingId(id);

      // Get vehicle data to delete associated images
      const { data: vehicle } = await supabase
        .from("vehicles")
        .select("images")
        .eq("id", id)
        .single();

      // Delete vehicle from database
      const { error } = await supabase.from("vehicles").delete().eq("id", id);

      if (error) throw error;

      // Delete associated images from storage
      if (vehicle?.images && vehicle.images.length > 0) {
        for (const imageUrl of vehicle.images) {
          try {
            await removeFile(imageUrl);
          } catch (imgError) {
            console.warn("Erreur lors de la suppression de l'image:", imgError);
          }
        }
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Erreur lors de la suppression du véhicule");
    } finally {
      setDeletingId(null);
    }
  };

  // Filter vehicles based on search and status
  const filteredVehicles = vehicles.filter((v: any) => {
    const matchesSearch =
      !searchTerm ||
      v.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.model?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || v.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle size={12} className="mr-1" />
            Publié
          </Badge>
        );
      case "draft":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock size={12} className="mr-1" />
            Brouillon
          </Badge>
        );
      case "archived":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            <Archive size={12} className="mr-1" />
            Archivé
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Gestion des annonces
            </h1>
            <p className="text-gray-600">Gérez votre inventaire de véhicules</p>
          </div>
          <Link to="/admin/new">
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              <Plus size={16} className="mr-2" />
              Nouvelle annonce
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <Input
              placeholder="Rechercher par titre, marque ou modèle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48 bg-white">
              <Filter size={16} className="mr-2" />
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="published">Publiés</SelectItem>
              <SelectItem value="draft">Brouillons</SelectItem>
              <SelectItem value="archived">Archivés</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          {filteredVehicles.length} véhicule
          {filteredVehicles.length !== 1 ? "s" : ""} trouvé
          {filteredVehicles.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Véhicule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVehicles.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    {searchTerm || statusFilter !== "all"
                      ? "Aucun véhicule ne correspond aux critères de recherche."
                      : "Aucun véhicule dans l'inventaire. Créez votre première annonce !"}
                  </td>
                </tr>
              ) : (
                filteredVehicles.map((v: any) => (
                  <tr key={v.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-16">
                          <img
                            className="h-12 w-16 rounded object-cover"
                            src={
                              v.images?.[0] ||
                              "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=100&q=80"
                            }
                            alt={v.title}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 line-clamp-1">
                            {v.title || "Sans titre"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {v.brand} {v.model} • {v.year}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(v.status)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="font-medium">
                        {v.price?.toLocaleString() || 0}€
                      </div>
                      <div className="text-gray-500">
                        {v.monthly || 0}€/mois
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(v.created_at).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {v.status === "published" && (
                          <a
                            href={`/vehicules/${v.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="Voir sur le site"
                          >
                            <Eye size={16} />
                          </a>
                        )}

                        <Link
                          to={`/admin/edit/${v.id}`}
                          className="text-gray-600 hover:text-gray-900 p-1"
                          title="Éditer"
                        >
                          <Edit size={16} />
                        </Link>

                        {v.status !== "published" &&
                          v.status !== "archived" && (
                            <button
                              onClick={() => setStatus(v.id, "published")}
                              className="text-green-600 hover:text-green-900 p-1"
                              title="Publier"
                            >
                              <CheckCircle size={16} />
                            </button>
                          )}

                        {v.status === "published" && (
                          <button
                            onClick={() => setStatus(v.id, "draft")}
                            className="text-yellow-600 hover:text-yellow-900 p-1"
                            title="Dépublier"
                          >
                            <Clock size={16} />
                          </button>
                        )}

                        {v.status !== "archived" && (
                          <button
                            onClick={() => setStatus(v.id, "archived")}
                            className="text-gray-600 hover:text-gray-900 p-1"
                            title="Archiver"
                          >
                            <Archive size={16} />
                          </button>
                        )}

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              className="text-red-600 hover:text-red-900 p-1"
                              title="Supprimer"
                              disabled={deletingId === v.id}
                            >
                              <Trash2 size={16} />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Confirmer la suppression
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Êtes-vous sûr de vouloir supprimer ce véhicule ?
                                Cette action est irréversible et supprimera
                                également toutes les images associées.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteVehicle(v.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Supprimer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
