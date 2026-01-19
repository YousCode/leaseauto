import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Euro } from "lucide-react";

interface FinanceSectionProps {
  apport: number;
  setApport: (v: number) => void;
  duree: number;
  setDuree: (v: number) => void;
  valeurRes: number;
  setValeurRes: (v: number) => void;
  showVR: boolean;
  extendedWarranty: string;
  setExtendedWarranty: (v: string) => void;
}

export function FinanceSection({
  apport,
  setApport,
  duree,
  setDuree,
  valeurRes,
  setValeurRes,
  showVR,
  extendedWarranty,
  setExtendedWarranty,
}: FinanceSectionProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center">
        <Euro className="mr-2" size={20} />
        Financement
      </h3>

      <div className="space-y-8">
        {/* Apport */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Apport — {apport.toLocaleString()} €
          </label>
          <div className="px-2">
            <Slider
              value={[apport]}
              onValueChange={([v]) => setApport(v)}
              min={0}
              max={10000}
              step={500}
              className="w-full [&_.slider-track]:h-1.5 [&_.slider-track]:bg-gray-200 [&_.slider-range]:bg-[#E50914] [&_.slider-thumb]:h-4 [&_.slider-thumb]:w-4 [&_.slider-thumb]:bg-[#E50914] [&_.slider-thumb]:border-2 [&_.slider-thumb]:border-white [&_.slider-thumb]:shadow-md"
            />
          </div>
        </div>

        {/* Durée */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Durée — {duree} mois
          </label>
          <div className="px-2">
            <Slider
              value={[duree]}
              onValueChange={([v]) => setDuree(v)}
              min={12}
              max={72}
              step={6}
              className="w-full [&_.slider-track]:h-1.5 [&_.slider-track]:bg-gray-200 [&_.slider-range]:bg-[#E50914] [&_.slider-thumb]:h-4 [&_.slider-thumb]:w-4 [&_.slider-thumb]:bg-[#E50914] [&_.slider-thumb]:border-2 [&_.slider-thumb]:border-white [&_.slider-thumb]:shadow-md"
            />
          </div>
        </div>

        {/* Valeur résiduelle - s'affiche seulement si LOA/LLD */}
        {showVR && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Valeur résiduelle — {valeurRes.toLocaleString()} €
            </label>
            <div className="px-2">
              <Slider
                value={[valeurRes]}
                onValueChange={([v]) => setValeurRes(v)}
                min={0}
                max={12000}
                step={100}
                className="w-full [&_.slider-track]:h-1.5 [&_.slider-track]:bg-gray-200 [&_.slider-range]:bg-[#E50914] [&_.slider-thumb]:h-4 [&_.slider-thumb]:w-4 [&_.slider-thumb]:bg-[#E50914] [&_.slider-thumb]:border-2 [&_.slider-thumb]:border-white [&_.slider-thumb]:shadow-md"
              />
            </div>
          </div>
        )}

        {/* Extension de garantie - reste en input texte */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Extension de garantie
          </label>
          <Input
            type="text"
            placeholder="ex: 24 mois supplémentaires"
            value={extendedWarranty}
            onChange={(e) => setExtendedWarranty(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
