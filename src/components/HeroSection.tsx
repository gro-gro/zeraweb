"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const easeOut = [0.16, 1, 0.3, 1] as const;
const ease = [0.4, 0, 0.2, 1] as const;

const words = ["contenidos", "audiencias", "comunidades"];

const slides = [
  {
    src: "https://assets.mixkit.co/videos/921/921-1080.mp4",
    name: "Cero Miligramos\u00B0",
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
    name: "En Teor\u00EDa",
    type: "Ciencia & Emprendimiento",
    maxDuration: 2000,
  },
  {
    src: "https://assets.mixkit.co/videos/48390/48390-720.mp4",
    name: "El Sue\u00F1o de la Vida Propia",
    type: "Emprendimiento & Lifestyle",
    maxDuration: 2000,
  },
  {
    src: "https://assets.mixkit.co/videos/50600/50600-1080.mp4",
    name: "Cero Miligramos\u00B0",
    type: "Salud Mental",
    maxDuration: 2000,
  },
];

/* ── Cycling badge ─────────────────────────────────────────────── */

function CyclingBadge() {
  const [currentWord, setCurrentWord] = useState(0);
  const [wordWidths, setWordWidths] = useState<number[]>([]);
  const measureRef = useRef<HTMLDivElement>(null);

  // Measure each word's pixel width once on mount
  useEffect(() => {
    if (!measureRef.current) return;
    const spans = measureRef.current.querySelectorAll<HTMLSpanElement>("[data-measure]");
    setWordWidths(Array.from(spans).map((s) => s.getBoundingClientRect().width));
  }, []);

  // Cycle every 2s
  useEffect(() => {
    const id = setInterval(() => setCurrentWord((p) => (p + 1) % words.length), 2000);
    return () => clearInterval(id);
  }, []);

  const currentWidth = wordWidths[currentWord];

  return (
    <>
      {/* Hidden measurement (same font styles, off-screen) */}
      <div
        ref={measureRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-[-9999px] top-0 flex gap-4 text-[11px] lg:text-[12px]"
      >
        {words.map((w) => (
          <span key={w} data-measure className="font-extrabold whitespace-nowrap">
            {w}
          </span>
        ))}
      </div>

      {/* Visible badge */}
      <motion.div
        className="liquid-glass relative flex items-center gap-[6px] rounded-full px-3 py-[6px] backdrop-blur-[16px] backdrop-saturate-[1.6] backdrop-brightness-[1.1] bg-white/[0.12] border border-white/30 shadow-[0_2px_16px_rgba(0,0,0,0.08),inset_0_0.5px_0_rgba(255,255,255,0.45),inset_0_-0.5px_0_rgba(0,0,0,0.08)]"
        layout
        transition={{ layout: { type: "spring", stiffness: 320, damping: 30 } }}
      >
        {/* Live dot */}
        <motion.span layout className="relative block w-[6px] h-[6px] shrink-0">
          <span className="absolute inset-0 rounded-full bg-red-500" />
          <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75" />
        </motion.span>

        {/* "Creando" + cycling word — single text line */}
        <motion.span
          layout
          className="text-[11px] text-white whitespace-nowrap lg:text-[12px] leading-none"
        >
          <span className="font-normal">Creando </span>
          {/* Word slot — ghost sets width, visible word absolute on top */}
          <span className="relative inline-block overflow-hidden align-top">
            {/* Invisible ghost — determines width via spring */}
            <motion.span
              className="font-extrabold invisible whitespace-nowrap block"
              animate={{ width: currentWidth || "auto" }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              aria-hidden="true"
            >
              {words[currentWord]}
            </motion.span>
            {/* Visible sliding word */}
            <AnimatePresence initial={false}>
              <motion.span
                key={words[currentWord]}
                className="font-extrabold whitespace-nowrap absolute left-0 top-0"
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "-110%", opacity: 0 }}
                transition={{ duration: 0.38, ease }}
              >
                {words[currentWord]}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.span>
      </motion.div>
    </>
  );
}

/* ── Hero section ──────────────────────────────────────────────── */

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const currentIndexRef = useRef(0);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => {
      const next = (prev + 1) % slides.length;
      currentIndexRef.current = next;
      return next;
    });
  }, []);

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

  useEffect(() => {
    const { maxDuration } = slides[currentIndex];
    if (!maxDuration) return;
    const timer = setTimeout(goNext, maxDuration);
    return () => clearTimeout(timer);
  }, [currentIndex, goNext]);

  const current = slides[currentIndex];

  return (
    <section data-navbar-theme="dark" className="relative h-screen w-full bg-white p-[15px]">
      {/* Inner frame with rounded corners */}
      <div className="relative w-full h-full rounded-[20px] overflow-hidden">

      {/* Video background */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: easeOut, delay: 0.1 }}
      >
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

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center justify-start h-full pt-[15vh]">
        {/* Cycling badge with liquid glass */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease }}
        >
          <CyclingBadge />
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-[52px] leading-[0.89] uppercase text-white text-center lg:text-[60px] xl:text-[75px]"
          style={{ fontFamily: "'PP Telegraf', sans-serif", fontWeight: 800 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease }}
        >
          <span className="lg:hidden">SOMOS<br />MEDIA<br />BUILDERS</span>
          <span className="hidden lg:inline">SOMOS MEDIA<br />BUILDERS</span>
        </motion.h1>

      </div>

      {/* Bottom overlay info */}
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

      </div>
    </section>
  );
}
