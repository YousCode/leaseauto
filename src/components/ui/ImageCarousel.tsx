import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function ImageCarousel({ images }: { images: string[] }) {
  if (!images?.length) return null;
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      navigation
      pagination={{ clickable: true }}
      className="rounded-lg overflow-hidden"
    >
      {images.map((url) => (
        <SwiperSlide key={url}>
          <img
            src={url}
            alt=""
            className="w-full h-80 md:h-[30rem] object-cover"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
