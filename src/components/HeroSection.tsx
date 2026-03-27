"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const easeOut = [0.16, 1, 0.3, 1] as const;

// maxDuration: corta el video a los N ms aunque no haya terminado.
// Sin maxDuration: espera a que el video termine solo (onEnded).
const slides = [
  {
    src: "https://assets.mixkit.co/videos/921/921-1080.mp4",
    name: "Cero Miligramos°",
    type: "Salud Mental",
    maxDuration: 2000,
  },
  {
    src: "https://assets.mixkit.co/videos/29982/29982-1080.mp4",
    name: "Pausa Activa",
    type: "Fitness & Lifestyle",
    maxDuration: 2000,
  },
  {
    src: "https://assets.mixkit.co/videos/13231/13231-720.mp4",
    name: "En Teoría",
    type: "Ciencia & Emprendimiento",
    maxDuration: 2000,
  },
  {
    src: "https://assets.mixkit.co/videos/48390/48390-720.mp4",
    name: "El Sueño de la Vida Propia",
    type: "Emprendimiento & Lifestyle",
    maxDuration: 2000,
  },
  {
    src: "https://assets.mixkit.co/videos/50600/50600-1080.mp4",
    name: "Cero Miligramos°",
    type: "Salud Mental",
    maxDuration: 2000,
  },
];

export default function HeroSection({ titleVisible = false }: { titleVisible?: boolean }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const currentIndexRef = useRef(0);

  function goNext() {
    setCurrentIndex((prev) => {
      const next = (prev + 1) % slides.length;
      currentIndexRef.current = next;
      return next;
    });
  }

  // Al cambiar de slide: resetea y reproduce el actual, pausa los demás
  useEffect(() => {
    currentIndexRef.current = currentIndex;
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === currentIndex) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [currentIndex]);

  // Timer de corte si hay maxDuration
  useEffect(() => {
    const { maxDuration } = slides[currentIndex];
    if (!maxDuration) return;
    const timer = setTimeout(goNext, maxDuration);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const current = slides[currentIndex];

  return (
    <section data-navbar-theme="dark" className="relative h-screen w-full overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: easeOut, delay: 0.1 }}
      >
        {/* Todos los videos en el DOM con preload="auto" — solo el actual es visible */}
        {slides.map((slide, i) => (
          <video
            key={slide.src}
            ref={(el) => { videoRefs.current[i] = el; }}
            src={slide.src}
            preload="auto"
            muted
            playsInline
            onEnded={() => {
              if (i === currentIndexRef.current) goNext();
            }}
            className={`absolute inset-0 w-full h-full object-cover${i === currentIndex ? "" : " invisible"}`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-[70%] to-black" />
      </motion.div>

      {/* SOMOS MEDIA BUILDERS — sin pb para que el h1 se centre igual que el elemento fixed */}
      <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col px-[30px] pt-[calc(56px+30px)] lg:px-[60px] lg:pt-[calc(56px+48px)] xl:px-[120px]">
        <div className="flex flex-1 items-center -mt-[15%]">
          <h1 className={`text-[60px] leading-[0.89] uppercase text-white lg:text-[100px] xl:text-[130px] transition-opacity duration-[250ms]${titleVisible ? "" : " opacity-0"}`}>
            <span className="font-extralight block">Somos</span>
            <span className="font-bold block">media</span>
            <span className="font-bold block">builders</span>
          </h1>
        </div>
      </div>

      {/* Bottom overlay info — absolute para no afectar el layout del h1 */}
      <motion.div
        className="absolute bottom-[30px] left-0 right-0 z-10 lg:bottom-[40px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, ease: easeOut, delay: 0.6 }}
      >
        <div className="mx-auto max-w-[1600px] flex items-center justify-between px-[30px] text-[12px] text-white lg:px-[60px] lg:text-[14px] xl:px-[120px]">
          <span className="font-bold uppercase">{current.name}</span>
          <span className="font-normal">{current.type}</span>
        </div>
      </motion.div>
    </section>
  );
}
