"use client";

import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from "swiper/modules";

// Swiper styles
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import "swiper/css";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import "swiper/css/navigation";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import "swiper/css/pagination";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import "swiper/css/scrollbar";

// Tipado de Props
interface CarrouselProps {
  slides: string[]; // URLs de las imágenes
  isProfile?: boolean; // Si es para mostrar imagen tipo avatar
  autoplay?: boolean; // Activar autoplay
  className?: string; // Clases adicionales para imagen
}

const Carrousel: React.FC<CarrouselProps> = ({
  slides,
  isProfile = false,
  autoplay = false,
  className = "",
}) => {
  const imageType = useMemo(() => {
    return {
      profile: isProfile
        ? "h-36 w-36 rounded-full"
        : // : "h-[30vh] md:h-auto sm:rounded-2xl w-[100vw] aspect-[3368/6000]",
          "h-[33vh] md:h-auto sm:rounded-lg w-[100vw] aspect-[2100/1280]",
    };
  }, [isProfile]);

  return (
    <Swiper
      modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
      spaceBetween={200}
      slidesPerView={2}
      navigation
      autoplay={
        autoplay
          ? {
              delay: 3000,
              disableOnInteraction: false,
            }
          : undefined
      }
      pagination={{ clickable: true }}
      scrollbar={{ draggable: true }}
    >
      {slides?.map((src, index) => {
        return (
          <SwiperSlide key={`image-${index}`}>
            <img
              fetchPriority="high"
              className={`${imageType.profile} ${className}`}
              src={src}
              alt={`Slide ${index + 1}`}
            />
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

Carrousel.displayName = "Carrousel";
export default Carrousel;
