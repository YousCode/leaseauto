import { useState } from "react";
import clsx from "clsx";

export default function VehicleGallery({ imgs }: { imgs: string[] }) {
  const [idx, setIdx] = useState(0);
  return (
    <div className="w-full">
      <figure className="relative pb-[56.25%] bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={imgs[idx]}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      </figure>

      <div className="mt-3 grid grid-cols-4 gap-2">
        {imgs.slice(0, 8).map((url, i) => (
          <button
            key={url}
            onClick={() => setIdx(i)}
            className={clsx(
              "h-16 rounded overflow-hidden border-2",
              i === idx ? "border-red-600" : "border-transparent",
            )}
          >
            <img src={url} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
