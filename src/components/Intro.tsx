"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const words = ["contenidos", "audiencias", "comunidades"];
const ease = [0.4, 0, 0.2, 1] as const;

interface IntroProps {
  onComplete: () => void;
  onTagline?: () => void;
  /** True once critical assets (fonts, first video) have loaded */
  assetsReady: boolean;
}

export default function Intro({ onComplete, onTagline, assetsReady }: IntroProps) {
  const [phase, setPhase] = useState<"black" | "logo" | "white" | "words" | "tagline" | "exit" | "done">("black");
  const [currentWord, setCurrentWord] = useState(0);
  const [minTimePassed, setMinTimePassed] = useState(false);
  const completeCalled = useRef(false);

  // black → logo (400ms), then set minimum display time (1700ms from mount)
  useEffect(() => {
    document.body.classList.add("intro-active");
    const t0 = setTimeout(() => setPhase("logo"), 400);
    const t1 = setTimeout(() => setMinTimePassed(true), 1700);
    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
    };
  }, []);

  // Gate: only leave the logo screen when BOTH min time AND assets are ready
  useEffect(() => {
    if (phase === "logo" && minTimePassed && assetsReady) {
      setPhase("white");
    }
  }, [phase, minTimePassed, assetsReady]);

  // white → words (900ms after white — same relative gap as original)
  useEffect(() => {
    if (phase !== "white") return;
    const t = setTimeout(() => setPhase("words"), 900);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "words") return;
    if (currentWord < words.length - 1) {
      const t = setTimeout(() => setCurrentWord((p) => p + 1), 1200);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setPhase("tagline"), 1100);
      return () => clearTimeout(t);
    }
  }, [phase, currentWord]);

  useEffect(() => {
    if (phase !== "tagline") return;
    onTagline?.();
    const t = setTimeout(() => setPhase("exit"), 1800);
    return () => clearTimeout(t);
  }, [phase, onTagline]);

  useEffect(() => {
    if (phase !== "exit") return;
    // Disparar onComplete inmediatamente para que la landing renderice
    // mientras la overlay hace fade — así ocurren en paralelo.
    if (!completeCalled.current) {
      completeCalled.current = true;
      onComplete();
    }
    // Desbloquear scroll y desmontar overlay cuando el fade termina.
    const t = setTimeout(() => {
      document.body.classList.remove("intro-active");
      setPhase("done");
    }, 950);
    return () => clearTimeout(t);
  }, [phase, onComplete]);

  if (phase === "done") return null;

  const isBlack = phase === "black" || phase === "logo";
  const showWords = phase === "words" || phase === "tagline";

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      animate={phase === "exit" ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.9, ease }}
    >
      {/* Background color */}
      <motion.div
        className="absolute inset-0"
        initial={{ backgroundColor: "#000000" }}
        animate={{ backgroundColor: isBlack ? "#000000" : "#ffffff" }}
        transition={{ duration: 1.1, ease }}
      />

      {/* Logo */}
      <AnimatePresence>
        {phase === "logo" && (
          <motion.span
            className="relative z-10 text-[24px] font-bold tracking-[-0.5px] text-white lg:text-[32px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease }}
          >
            Zeratype
          </motion.span>
        )}
      </AnimatePresence>

      {showWords && (
        <motion.div
          layout="position"
          layoutDependency={currentWord}
          className="relative z-10"
          animate={{ opacity: phase === "tagline" ? 0 : 1 }}
          transition={{ layout: { type: "tween", duration: 0.5, ease }, opacity: { duration: 0.3, ease } }}
        >
          <motion.div
            className="text-[20px] text-black lg:text-[28px]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease }}
          >
            <div className="flex items-baseline gap-[0.3em]">
              <span className="font-normal">Creamos</span>

              {/*
               * El slot siempre tiene el ancho de la palabra más larga.
               * El centro de "Creamos [palabra]" nunca cambia → sin layout
               * animation → sin bug de posición en el exit.
               */}
              <div
                className="relative overflow-hidden"
                style={{
                  WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)",
                  maskImage: "linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)",
                }}
              >
                {/* Define el ancho del slot — invisible, activa el layout animation */}
                <span
                  className="font-bold whitespace-nowrap opacity-0 select-none pointer-events-none"
                  aria-hidden="true"
                >
                  {words[currentWord]}
                </span>

                <AnimatePresence>
                  <motion.span
                    key={words[currentWord]}
                    className="absolute inset-0 flex items-center font-bold whitespace-nowrap"
                    // First word: no slide animation — reveals together with
                    // the container fade so "Creamos contenidos" appears as a unit.
                    initial={
                      currentWord === 0
                        ? { y: 0, opacity: 1 }
                        : { y: "100%", opacity: 0 }
                    }
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{ duration: 0.5, ease }}
                  >
                    {words[currentWord]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
