import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { DURATION, EASE, DISTANCE } from "@/lib/motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import VehicleForm from "./VehicleForm";

const VehicleFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const handleClose = () => {
    navigate("/admin");
  };

  const handleSubmit = (payload: Record<string, any>) => {
    console.info("Vehicle form payload", payload);
    navigate("/admin");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: DISTANCE }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION, ease: EASE}}
      className="min-h-screen bg-slate-950 py-10 text-white"
    >
      <div className="mx-auto max-w-5xl px-4">
        <Button
          variant="ghost"
          className="mb-6 text-slate-300 hover:text-white transition-colors"
          onClick={handleClose}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au panneau
        </Button>
        <Card className="border border-slate-800 bg-slate-900 text-white shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              {id ? "Modifier le véhicule" : "Nouvelle annonce véhicule"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <VehicleForm
              vehicle={undefined}
              onSubmit={handleSubmit}
              onCancel={handleClose}
            />
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default VehicleFormPage;
