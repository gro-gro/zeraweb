"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLiquidGlass, type LiquidGlassOptions } from "@/hooks/useLiquidGlass";

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

const GLASS_DEFAULTS: Required<LiquidGlassOptions> = {
  ior: 3, scale: 50, specular: 0,
  lightAngle: 360, lightIntensity: 0.3, bevelWidth: 1,
  frost: 1.5, tint: 0, borderOpacity: 0.08,
};

/* ── Dev-only tuning panel ────────────────────────────────────────── */

type Slider = { key: keyof LiquidGlassOptions; label: string; min: number; max: number; step: number };

const SLIDERS: { group: string; items: Slider[] }[] = [
  {
    group: "Refraction",
    items: [
      { key: "ior",        label: "IOR",        min: 1,   max: 3,    step: 0.05 },
      { key: "scale",      label: "Scale",      min: 0,   max: 200,  step: 1 },
      { key: "bevelWidth", label: "Bevel W",    min: 0.05, max: 1,   step: 0.01 },
      { key: "frost",      label: "Frost",      min: 0,   max: 20,   step: 0.5 },
    ],
  },
  {
    group: "Specular",
    items: [
      { key: "specular",       label: "Opacity",    min: 0,   max: 1,   step: 0.01 },
      { key: "lightAngle",     label: "Angle",      min: 0,   max: 360, step: 1 },
      { key: "lightIntensity", label: "Intensity",  min: 0,   max: 5,   step: 0.1 },
    ],
  },
  {
    group: "Style",
    items: [
      { key: "tint",          label: "Tint",       min: 0, max: 0.5, step: 0.005 },
      { key: "borderOpacity", label: "Border",     min: 0, max: 0.5, step: 0.005 },
    ],
  },
];

function GlassDebugPanel({ values, onChange }: {
  values: Required<LiquidGlassOptions>;
  onChange: (v: Required<LiquidGlassOptions>) => void;
}) {
  const [open, setOpen] = useState(true);

  if (process.env.NODE_ENV !== "development") return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-[99999] rounded-xl bg-black/80 p-3 text-[11px] text-white/80 backdrop-blur-sm font-mono select-none"
      style={{ width: open ? 240 : "auto" }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-[10px] uppercase tracking-wider text-white/40 hover:text-white/70 transition-colors"
      >
        <span>Liquid Glass</span>
        <span>{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="mt-2 space-y-3">
          {SLIDERS.map(({ group, items }) => (
            <div key={group}>
              <span className="block text-[9px] uppercase tracking-widest text-white/25 mb-1">{group}</span>
              <div className="space-y-1.5">
                {items.map(({ key, label, min, max, step }) => (
                  <label key={key} className="flex items-center justify-between gap-2">
                    <span className="w-16 shrink-0 text-white/50">{label}</span>
                    <input
                      type="range" min={min} max={max} step={step}
                      value={values[key]}
                      onChange={(e) => onChange({ ...values, [key]: parseFloat(e.target.value) })}
                      className="flex-1 h-1 accent-white cursor-pointer"
                    />
                    <span className="w-10 text-right tabular-nums">{values[key]}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button
            onClick={() => onChange(GLASS_DEFAULTS)}
            className="w-full mt-1 py-1 rounded text-[10px] uppercase tracking-wider text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Cycling badge ─────────────────────────────────────────────── */

function CyclingBadge({ glassOpts }: { glassOpts: Required<LiquidGlassOptions> }) {
  const [currentWord, setCurrentWord] = useState(0);
  const [wordWidths, setWordWidths] = useState<number[]>([]);
  const measureRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useLiquidGlass(badgeRef, glassOpts);

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

      {/* Visible badge — liquid glass via SVG feDisplacementMap */}
      <div
        ref={badgeRef}
        className="relative overflow-hidden rounded-full border border-solid"
      >
        {/* Content sits above the canvas injected by useLiquidGlass */}
        <div className="absolute inset-0 z-[1] rounded-full bg-black/30 pointer-events-none" />
        <div className="relative z-[2] flex items-center gap-[6px] px-3 py-[6px]">
          {/* Live dot */}
          <span className="relative block w-[6px] h-[6px] shrink-0">
            <span className="absolute inset-0 rounded-full bg-red-500" />
            <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75" />
          </span>

          {/* "Creando" + cycling word */}
          <span className="text-[11px] text-white whitespace-nowrap lg:text-[12px] leading-normal">
            <span className="font-normal">Creando </span>
            <span
              className="relative inline-block align-top"
              style={{ overflowX: 'visible', overflowY: 'clip' }}
            >
              <motion.span
                className="font-extrabold invisible whitespace-nowrap block"
                animate={{ width: currentWidth ? currentWidth + 1 : "auto" }}
                transition={{ type: "spring", stiffness: 320, damping: 30 }}
                aria-hidden="true"
              >
                {words[currentWord]}
              </motion.span>
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
          </span>
        </div>
      </div>
    </>
  );
}

/* ── Hero section ──────────────────────────────────────────────── */

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [glassOpts, setGlassOpts] = useState<Required<LiquidGlassOptions>>(GLASS_DEFAULTS);
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
    <section id="hero" data-navbar-theme="dark" className="relative h-screen w-full bg-white p-[15px]">
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
            crossOrigin="anonymous"
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
        {/* Glass badge */}
        <div className="mb-6">
          <CyclingBadge glassOpts={glassOpts} />
        </div>

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

      <GlassDebugPanel values={glassOpts} onChange={setGlassOpts} />
    </section>
  );
}
