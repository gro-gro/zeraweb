"use client";

import { useRef, useState } from "react";
import { motion, useInView, useScroll, useMotionValueEvent } from "framer-motion";
import { Eye, Heart, Users } from "lucide-react";
import NumberFlow from "@number-flow/react";

const easeOut  = [0.16, 1, 0.3, 1]    as const;
const smooth   = [0.4, 0, 0.2, 1]     as const;

const NUMBER_TIMING = { duration: 1800, easing: "cubic-bezier(0.16, 1, 0.3, 1)" };

const OPENING_WORDS = ["Construimos", "narrativa", "desde", "temáticas", "+", "personas"];
const CLOSING_WORDS = ["que", "genera", "impacto", "real."];

type Phase = "idle" | "zoom-out" | "split";

export default function VideoSplitSection() {
  const openingRef = useRef<HTMLParagraphElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const [phase,         setPhase]         = useState<Phase>("idle");
  const [statsActive,   setStatsActive]   = useState(false);
  const [closingVisible,setClosingVisible] = useState(false);
  const phaseRef = useRef<Phase>("idle");

  const isOpeningInView = useInView(openingRef, { once: true, margin: "-80px" });
  const isBlockInView   = useInView(sectionRef, { once: true, margin: "-40%" });

  // Trackea el scroll de la sección completa (sin sticky).
  // offset ["start end","end start"]: v=0 cuando el top entra por abajo, v=1 cuando el bottom sale por arriba.
  // Disparamos al 55% — el video ya ha sido visible un buen rato.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v > 0.45 && phase === "idle") setPhase("zoom-out");
  });

  function onZoomOutComplete() {
    setPhase(prev => {
      const next = prev === "zoom-out" ? "split" : prev;
      phaseRef.current = next;
      return next;
    });
  }

  // Usamos phaseRef para evitar stale closure — solo actúa si el split ya terminó
  function onCardsComplete() {
    if (phaseRef.current !== "split" || statsActive) return;
    setStatsActive(true);
    setTimeout(() => setClosingVisible(true), 50);
  }

  const isSplit = phase === "split";

  return (
    <section ref={sectionRef} className="mx-auto max-w-[1600px] px-[30px] pt-20 pb-24 lg:px-[60px] lg:pt-28 lg:pb-36 xl:px-[120px] xl:pt-32">

      {/* Opening text */}
      <p
        ref={openingRef}
        className="text-[42px] leading-[1.15] font-normal mb-8 lg:text-[48px] lg:mb-10 xl:text-[56px]"
      >
        {OPENING_WORDS.map((word, i) => (
          <motion.span
            key={i}
            className="inline-block mr-[0.22em]"
            initial={{ y: 18, opacity: 0 }}
            animate={isOpeningInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.95, ease: easeOut, delay: 0.4 + i * 0.14 }}
          >
            {word}
          </motion.span>
        ))}
      </p>

      {/* Stats block — aparece de abajo a arriba cuando termina el opening text */}
      <motion.div
        className="relative mb-8 lg:mb-10"
        initial={{ y: 30, opacity: 0 }}
        animate={isBlockInView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: easeOut }}
      >
        <motion.div
          style={{ transformOrigin: "center center" }}
          animate={{ scale: phase === "zoom-out" ? 0.88 : 1 }}
          transition={{
            duration: phase === "zoom-out" ? 0.5 : 0.75,
            ease: smooth,
          }}
          onAnimationComplete={onZoomOutComplete}
        >
          {/* Video — se desvanece al dividirse */}
          <motion.div
            className="absolute inset-0 z-10 rounded-[20px] overflow-hidden bg-violet"
            animate={{ opacity: isSplit ? 0 : 1 }}
            transition={{ duration: 0.55, ease: smooth }}
          >
            <video autoPlay muted loop playsInline className="w-full h-full object-cover">
              <source src="https://assets.mixkit.co/videos/29982/29982-1080.mp4" type="video/mp4" />
            </video>
          </motion.div>

          {/* Cards: aparecen primero, luego los gaps se abren */}
          <motion.div
            className="flex flex-col"
            animate={{ opacity: isSplit ? 1 : 0, rowGap: isSplit ? "10px" : "0px" }}
            transition={{
              opacity: { duration: 0.45, ease: smooth },
              rowGap:  { duration: 0.55, ease: smooth, delay: 0.3 },
            }}
            onAnimationComplete={onCardsComplete}
          >
            <div className="bg-violet rounded-[20px] p-6 overflow-hidden min-h-[158px]">
              <Eye className="w-5 h-5 text-white/50 mb-4" />
              <p className="text-white font-black text-[76px] leading-[1.2] tracking-[-6px] lg:text-[96px]">
                <NumberFlow
                  value={statsActive ? 3300000000 : 3100000000}
                  format={{ notation: "compact", maximumFractionDigits: 1 }}
                  transformTiming={NUMBER_TIMING}
                  spinTiming={NUMBER_TIMING}
                  opacityTiming={NUMBER_TIMING}
                />
              </p>
              <p className="text-white/50 text-[10px] tracking-[-0.8px] lg:text-[12px]">Impresiones totales</p>
            </div>

            <motion.div
              className="flex"
              animate={{ columnGap: isSplit ? "10px" : "0px" }}
              transition={{ duration: 0.55, ease: smooth, delay: 0.3 }}
            >
              <div className="flex-1 bg-violet rounded-[20px] p-6 overflow-hidden min-h-[158px]">
                <Heart className="w-5 h-5 text-white/50 mb-4" />
                <p className="text-white font-black text-[50px] leading-[1.2] tracking-[-4px] lg:text-[64px]">
                  <NumberFlow
                    value={statsActive ? 16600000 : 16200000}
                    format={{ notation: "compact", maximumFractionDigits: 1 }}
                    transformTiming={NUMBER_TIMING}
                    spinTiming={NUMBER_TIMING}
                    opacityTiming={NUMBER_TIMING}
                  />
                </p>
                <p className="text-white/50 text-[10px] tracking-[-0.8px] lg:text-[12px]">Seguidores combinados</p>
              </div>

              <div className="flex-1 bg-violet rounded-[20px] p-6 overflow-hidden min-h-[158px]">
                <Users className="w-5 h-5 text-white/50 mb-4" />
                <p className="text-white font-black text-[50px] leading-[1.2] tracking-[-4px] lg:text-[64px]">
                  <NumberFlow
                    value={statsActive ? 29 : 15}
                    transformTiming={NUMBER_TIMING}
                    spinTiming={NUMBER_TIMING}
                    opacityTiming={NUMBER_TIMING}
                  />
                </p>
                <p className="text-white/50 text-[9px] tracking-[-0.8px] lg:text-[12px]">Creadores únicos</p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* "que genera impacto real." — solo aparece después del split */}
      <p className="text-[42px] leading-[1.15] font-normal text-right lg:text-[48px] xl:text-[56px]">
        {CLOSING_WORDS.map((word, i) => (
          <motion.span
            key={i}
            className="inline-block mr-[0.22em] last:mr-0"
            initial={{ y: 18, opacity: 0 }}
            animate={closingVisible ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.95, ease: easeOut, delay: i * 0.18 }}
          >
            {word}
          </motion.span>
        ))}
      </p>

    </section>
  );
}
