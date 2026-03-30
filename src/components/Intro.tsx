"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ease = [0.4, 0, 0.2, 1] as const;

interface IntroProps {
  onComplete: () => void;
  /** True once critical assets (fonts, first video) have loaded */
  assetsReady: boolean;
}

export default function Intro({ onComplete, assetsReady }: IntroProps) {
  const [phase, setPhase] = useState<"black" | "logo" | "exit" | "done">("black");
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
      setPhase("exit");
    }
  }, [phase, minTimePassed, assetsReady]);

  // Exit phase: fire onComplete immediately, unmount after fade
  useEffect(() => {
    if (phase !== "exit") return;
    if (!completeCalled.current) {
      completeCalled.current = true;
      onComplete();
    }
    const t = setTimeout(() => {
      document.body.classList.remove("intro-active");
      setPhase("done");
    }, 950);
    return () => clearTimeout(t);
  }, [phase, onComplete]);

  if (phase === "done") return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      animate={phase === "exit" ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.9, ease }}
    >
      {/* Logo */}
      <AnimatePresence>
        {(phase === "logo" || phase === "black") && (
          <motion.span
            className="relative z-10 text-[24px] font-bold tracking-[-0.5px] text-white lg:text-[32px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "logo" ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease }}
          >
            Zeratype
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
