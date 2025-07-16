import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  uploadVehicleImages,
  uploadFile,
  removeFile,
} from "@/lib/uploadVehicleImages";
import { v4 as uuid } from "uuid";
import Stepper from "@/components/ui/Stepper";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Upload, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const steps = ["Détails", "Photos", "Tarifs", "Résumé"];

export default function VehicleWizard() {
  const nav = useNavigate();
  const { id } = useParams(); // mode édition ?
  const editing = !!id;
  const queryClient = useQueryClient();

  /* ----------  état global du formulaire ---------- */
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [publishNow, setPublishNow] = useState(false);
  const [form, setForm] = useState<any>({
    title: "",
    brand: "",
    model: "",
    year: "",
    mileage: "",
    energy: "",
    gearbox: "",
    color: "",
    description: "",
    price: "",
    monthly: "",
    images: [] as File[],
    existingImages: [] as string[], // URLs des images déjà uploadées
    status: "draft",
  });

  /* ----------  si édition on charge ---------- */
  useEffect(() => {
    if (editing) {
      supabase
        .from("vehicles")
        .select("*")
        .eq("id", id)
        .single()
        .then(({ data }) => {
          if (data) {
            setForm({
              ...data,
              images: [], // Nouveaux fichiers à uploader
              existingImages: data.images || [], // Images déjà uploadées
            });
          }
        });
    }
  }, [editing, id]);

  /* ----------  navigation ---------- */
  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  /* ----------  helpers ---------- */
  const update = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));
  const canNext = () => {
    if (step === 0) return form.title && form.brand && form.model && form.year;
    if (step === 1)
      return form.images.length > 0 || form.existingImages.length > 0;
    if (step === 2) return form.price && form.monthly;
    return true;
  };

  /* ----------  submit ---------- */
  const handleSubmit = async () => {
    try {
      setSaving(true);

      /* 1️⃣ on crée (ou récupère) l'entrée vehicule pour obtenir son UUID */
      let vehicleId = id as string;

      if (!editing) {
        vehicleId = uuid();
        const { error } = await supabase.from("vehicles").insert([
          {
            id: vehicleId,
            title: form.title,
            brand: form.brand,
            model: form.model,
            year: Number(form.year),
            mileage: Number(form.mileage),
            energy: form.energy,
            gearbox: form.gearbox,
            color: form.color,
            description: form.description,
            price: Number(form.price),
            monthly: Number(form.monthly),
            status: publishNow ? "published" : "draft",
            images: form.existingImages, // Garde les images existantes temporairement
          },
        ]);
        if (error) throw error;
      }

      /* 2️⃣ upload des nouveaux fichiers — renvoie les URLs publiques */
      let newImageUrls: string[] = [];
      if (form.images.length > 0) {
        newImageUrls = await uploadVehicleImages(vehicleId, form.images);
      }

      /* 3️⃣ combine existing + new images */
      const allImageUrls = [...form.existingImages, ...newImageUrls];

      /* 4️⃣ mise à jour finale (images + statut éventuel) */
      const { error: upErr } = await supabase
        .from("vehicles")
        .update({
          title: form.title,
          brand: form.brand,
          model: form.model,
          year: Number(form.year),
          mileage: Number(form.mileage),
          energy: form.energy,
          gearbox: form.gearbox,
          color: form.color,
          description: form.description,
          price: Number(form.price),
          monthly: Number(form.monthly),
          images: allImageUrls,
          status: publishNow ? "published" : "draft",
        })
        .eq("id", vehicleId);
      if (upErr) throw upErr;

      /* 5️⃣ Invalider le cache React Query */
      await queryClient.invalidateQueries({ queryKey: ["vehicles"] });

      nav("/admin/vehicles");
    } catch (e: any) {
      alert("Erreur lors de la publication : " + e.message);
    } finally {
      setSaving(false);
    }
  };

  /* ----------  UI par étape ---------- */
  const StepDetail = (
    <div className="space-y-4">
      <input
        placeholder="Titre de l'annonce *"
        value={form.title}
        onChange={(e) => update("title", e.target.value)}
        className="border w-full p-2 rounded"
      />
      <div className="grid sm:grid-cols-2 gap-4">
        <input
          placeholder="Marque *"
          value={form.brand}
          onChange={(e) => update("brand", e.target.value)}
          className="border p-2 rounded"
        />
        <input
          placeholder="Modèle *"
          value={form.model}
          onChange={(e) => update("model", e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Année *"
          value={form.year}
          onChange={(e) => update("year", e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Kilométrage"
          value={form.mileage}
          onChange={(e) => update("mileage", e.target.value)}
          className="border p-2 rounded"
        />
      </div>
      <textarea
        placeholder="Description *"
        rows={5}
        value={form.description}
        onChange={(e) => update("description", e.target.value)}
        className="border w-full p-2 rounded resize-none"
      />
    </div>
  );

  const handleRemoveExistingImage = async (imageUrl: string, index: number) => {
    try {
      // Supprimer du storage
      await removeFile(imageUrl);
      // Supprimer de l'état local
      const newExistingImages = form.existingImages.filter(
        (_: string, idx: number) => idx !== index,
      );
      update("existingImages", newExistingImages);
    } catch (error) {
      console.error("Erreur lors de la suppression de l'image:", error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/"),
    );

    const totalImages = form.images.length + form.existingImages.length;
    const remainingSlots = 12 - totalImages;
    const filesToAdd = files.slice(0, remainingSlots);

    if (filesToAdd.length > 0) {
      update("images", [...form.images, ...filesToAdd]);
    }
  };

  const StepPhotos = (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Ajoutez jusqu'à 12 photos (JPG/PNG)
      </label>

      {/* Zone de drag & drop */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-600 mb-2">Glissez-déposez vos images ici</p>
        <p className="text-sm text-gray-500 mb-4">ou</p>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            const totalImages = form.images.length + form.existingImages.length;
            const remainingSlots = 12 - totalImages;
            const filesToAdd = files.slice(0, remainingSlots);
            update("images", [...form.images, ...filesToAdd]);
          }}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Choisir des fichiers
        </label>
      </div>

      {/* Images existantes */}
      {form.existingImages.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Images actuelles
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {form.existingImages.map((url: string, i: number) => (
              <div key={`existing-${i}`} className="relative group">
                <img
                  src={url}
                  alt={`Image existante ${i + 1}`}
                  className="h-24 w-full object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveExistingImage(url, i)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Nouvelles images */}
      {form.images.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Nouvelles images
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {form.images.map((f: File, i: number) => (
              <div key={`new-${i}`} className="relative group">
                <img
                  src={URL.createObjectURL(f)}
                  alt={`Nouvelle image ${i + 1}`}
                  className="h-24 w-full object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() =>
                    update(
                      "images",
                      form.images.filter((_: File, idx: number) => idx !== i),
                    )
                  }
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-sm text-gray-500">
        {form.images.length + form.existingImages.length}/12 images
      </p>
    </div>
  );

  const StepPrice = (
    <div className="grid sm:grid-cols-2 gap-4">
      <input
        type="number"
        placeholder="Prix comptant (€) *"
        value={form.price}
        onChange={(e) => update("price", e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="number"
        placeholder="Loyer mensuel (€) *"
        value={form.monthly}
        onChange={(e) => update("monthly", e.target.value)}
        className="border p-2 rounded"
      />
    </div>
  );

  const StepSummary = (
    <div className="space-y-4">
      <h3 className="font-semibold">Aperçu :</h3>
      <p className="text-lg font-medium">{form.title}</p>
      <p>
        {form.brand} {form.model} • {form.year} • {form.mileage} km
      </p>
      <p className="text-red-600 text-xl">{form.price} €</p>
      <p>{form.description.slice(0, 200)}…</p>
      <div className="grid grid-cols-3 gap-2">
        {/* Images existantes */}
        {form.existingImages.slice(0, 3).map((url: string, i: number) => (
          <img
            key={`existing-preview-${i}`}
            src={url}
            alt={`Preview ${i + 1}`}
            className="h-20 w-full object-cover rounded"
          />
        ))}
        {/* Nouvelles images */}
        {form.images
          .slice(0, 3 - form.existingImages.length)
          .map((f: File, i: number) => (
            <img
              key={`new-preview-${i}`}
              src={URL.createObjectURL(f)}
              alt={`New preview ${i + 1}`}
              className="h-20 w-full object-cover rounded"
            />
          ))}
      </div>

      {/* Choix brouillon / publier */}
      <label className="flex items-center space-x-2 pt-4">
        <input
          type="checkbox"
          checked={publishNow}
          onChange={(e) => setPublishNow(e.target.checked)}
        />
        <span className="text-sm">
          Publier immédiatement (sinon&nbsp;brouillon)
        </span>
      </label>
    </div>
  );

  const views = [StepDetail, StepPhotos, StepPrice, StepSummary];

  /* ----------  RENDER ---------- */
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Stepper steps={steps} current={step} />
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.25 }}
        >
          {views[step]}
        </motion.div>
      </AnimatePresence>

      {/* footer navigation */}
      <div className="flex justify-between items-center mt-10">
        {step > 0 ? (
          <button
            onClick={prev}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={16} className="mr-1" /> Retour
          </button>
        ) : (
          <span />
        )}
        {step < steps.length - 1 ? (
          <button
            onClick={next}
            disabled={!canNext()}
            className="flex items-center bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Suivant <ArrowRight size={16} className="ml-1" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="bg-green-600 text-white px-6 py-2 rounded w-full sm:w-auto"
          >
            {saving
              ? "Enregistrement…"
              : editing
                ? "Mettre à jour"
                : "Publier l'annonce"}
          </button>
        )}
      </div>
    </div>
  );
}
