"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import HeroAsciiBackground from "./HeroAsciiBackground";

const IS_DEV = process.env.NODE_ENV === "development";

// Lazy-load leva only in dev so it never ships to production bundles.
const HeroAsciiDevPanel = IS_DEV
  ? dynamic(() => import("./HeroAsciiDevPanel"), { ssr: false })
  : null;

const easeOut = [0.16, 1, 0.3, 1] as const;
const ease = [0.4, 0, 0.2, 1] as const;

const words = ["contenidos", "audiencias", "comunidades"];

const HEADING_FONT = `var(--font-inter-tight), "Inter Tight", Inter, sans-serif`;

/* ── Cycling badge ─────────────────────────────────────────────── */

function CyclingBadge() {
  const [currentWord, setCurrentWord] = useState(0);
  const [wordWidths, setWordWidths] = useState<number[]>([]);
  const measureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!measureRef.current) return;
    const spans = measureRef.current.querySelectorAll<HTMLSpanElement>("[data-measure]");
    setWordWidths(Array.from(spans).map((s) => s.getBoundingClientRect().width));
  }, []);

  useEffect(() => {
    const id = setInterval(() => setCurrentWord((p) => (p + 1) % words.length), 2000);
    return () => clearInterval(id);
  }, []);

  const currentWidth = wordWidths[currentWord];

  return (
    <>
      <div
        ref={measureRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-[-9999px] top-0 flex gap-4 text-[13px]"
      >
        {words.map((w) => (
          <span key={w} data-measure className="font-bold whitespace-nowrap">
            {w}
          </span>
        ))}
      </div>

      <div className="relative inline-flex items-center gap-[8px] rounded-full bg-black/[0.04] px-4 py-[4px] backdrop-blur-[6px] dark:bg-white/[0.08]">
        <span className="relative block w-[7px] h-[7px] shrink-0">
          <span className="absolute inset-0 rounded-full bg-red-500" />
          <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75" />
        </span>

        <span className="text-[13px] text-foreground whitespace-nowrap leading-normal">
          <span className="font-normal">Creando </span>
          <span
            className="relative inline-block align-top"
            style={{ overflowX: "visible", overflowY: "clip" }}
          >
            <motion.span
              className="font-bold invisible whitespace-nowrap block"
              animate={{ width: currentWidth ? currentWidth + 1 : "auto" }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              aria-hidden="true"
            >
              {words[currentWord]}
            </motion.span>
            <AnimatePresence initial={false}>
              <motion.span
                key={words[currentWord]}
                className="font-bold whitespace-nowrap absolute left-0 top-0"
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
    </>
  );
}

/* ── Hero section ──────────────────────────────────────────────── */

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative h-screen w-full bg-background p-[15px]"
      style={{
        // Skip paint/composite (including the canvas's blur + radial mask
        // layers) whenever the hero scrolls out of the viewport. Paired with
        // contain-intrinsic-size so the browser reserves the right space.
        contentVisibility: "auto",
        containIntrinsicSize: "100vh",
      }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[20px] bg-background">
        {HeroAsciiDevPanel ? <HeroAsciiDevPanel /> : <HeroAsciiBackground />}

        <motion.div
          className="relative z-10 flex h-full flex-col items-center justify-center text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: easeOut, delay: 0.1 }}
        >
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease }}
          >
            <CyclingBadge />
          </motion.div>

          <motion.h1
            className="whitespace-nowrap px-[30px] text-[40px] leading-[0.95] text-foreground md:text-[65px] lg:text-[86px] xl:text-[108px]"
            style={{ fontFamily: HEADING_FONT, fontWeight: 400, letterSpacing: "-0.02em" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease }}
          >
            Somos <span style={{ fontWeight: 700 }}>media builders</span>
          </motion.h1>

          <motion.p
            className="mt-6 max-w-[620px] px-[30px] text-[15px] font-medium leading-[1.3] text-foreground lg:text-[17px]"
            style={{ fontFamily: `var(--font-sans), sans-serif`, letterSpacing: "-0.01em" }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease }}
          >
            Conectamos marcas, creadores y audiencias para construir comunidades
            auténticas y conversaciones relevantes.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
