import { Suspense, memo } from "react";
import { Canvas } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Html,
  OrbitControls,
  Stage,
  useGLTF,
  useProgress,
} from "@react-three/drei";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ViewerProps = {
  src?: string;
  className?: string;
  autoRotate?: boolean;
};

type ModelProps = {
  url: string;
};

const FALLBACK_MESSAGE =
  "Modèle 3D en cours d'import. Ajoutez un .glb dans le formulaire admin.";

const Model = memo(({ url }: ModelProps) => {
  const { scene } = useGLTF(url, true);
  return <primitive object={scene} dispose={null} />;
});
Model.displayName = "VehicleGLBModel";

const CanvasLoader = () => {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center rounded-full bg-black/60 px-4 py-3 text-white">
        <Loader2 className="mb-1 h-5 w-5 animate-spin" />
        <span className="text-xs font-medium">
          {Math.round(progress)}% chargé
        </span>
      </div>
    </Html>
  );
};

export const VehicleModelViewer = ({
  src,
  className,
  autoRotate = true,
}: ViewerProps) => {
  if (!src) {
    return (
      <div
        className={cn(
          "flex h-64 w-full items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-5 text-center text-sm text-neutral-500",
          className,
        )}
      >
        {FALLBACK_MESSAGE}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative isolate h-64 w-full overflow-hidden rounded-2xl border border-neutral-200 bg-[#04060b]",
        className,
      )}
    >
      <Canvas camera={{ position: [3.1, 1.5, 2.6], fov: 42 }}>
        <color attach="background" args={["#04060b"]} />
        <Suspense fallback={<CanvasLoader />}>
          <Stage intensity={0.8} environment="city" preset="rembrandt">
            <Model url={src} />
          </Stage>
          <Environment preset="city" />
        </Suspense>
        <ContactShadows
          opacity={0.6}
          scale={10}
          blur={2}
          far={10}
          resolution={1024}
          color="#050505"
        />
        <OrbitControls
          makeDefault
          enablePan={false}
          enableZoom={false}
          autoRotate={autoRotate}
          autoRotateSpeed={0.8}
          minPolarAngle={Math.PI / 3.5}
          maxPolarAngle={(Math.PI / 2) * 0.95}
        />
      </Canvas>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />
      <div className="absolute right-3 top-3 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur">
        Vue 3D
      </div>
    </div>
  );
};

const DEFAULT_MODELS = ["/models/sedan.glb", "/models/suv.glb", "/models/city.glb"];
DEFAULT_MODELS.forEach((url) => {
  try {
    useGLTF.preload(url);
  } catch {
    // ignore preload errors in dev
  }
});

export default VehicleModelViewer;
