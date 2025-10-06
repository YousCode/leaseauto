import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Car } from "lucide-react";

interface PhotoCarouselProps {
  imgs: string[];
  make?: string;
  model?: string;
}

export default function PhotoCarousel({
  imgs,
  make = "",
  model = "",
}: PhotoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!imgs || imgs.length === 0) {
    return (
      <div className="w-full aspect-video bg-surface-card rounded-2xl flex items-center justify-center">
        <Car className="w-16 h-16 text-gray-400" />
        <span className="text-gray-500 ml-2">Aucune image</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Carousel
          className="w-full"
          onSelect={(api) => setCurrentIndex(api?.selectedScrollSnap() || 0)}
        >
          <CarouselContent>
            {imgs.map((src, i) => (
              <CarouselItem key={i}>
                <div className="relative aspect-video bg-surface-alt rounded-2xl overflow-hidden">
                  <img
                    src={src}
                    className="w-full h-full object-cover"
                    alt={`${make} ${model} - Photo ${i + 1}`}
                  />
                  <div className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
                    {i + 1}/{imgs.length}
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-accent text-white">
                      PRO
                    </Badge>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {imgs.map((src, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-colors ${
              i === currentIndex ? "border-accent" : "border-transparent"
            }`}
          >
            <img
              src={src}
              alt={`Thumbnail ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
