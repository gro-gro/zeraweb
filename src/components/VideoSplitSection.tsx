"use client";

import { useRef, useState, useEffect, useLayoutEffect } from "react";
import {
  motion, AnimatePresence,
  useScroll, useMotionValue, useSpring, useTransform, useMotionValueEvent,
  animate,
} from "framer-motion";
import { Eye, Heart, Users } from "lucide-react";
import NumberFlow from "@number-flow/react";
import { lenisInstance } from "./SmoothScroll";

const easeOut   = [0.16, 1, 0.3, 1] as const;
const easeIn    = [0.4, 0, 1, 1]    as const;
const easeInOut = [0.4, 0, 0.6, 1]  as const;

const NUMBER_TIMING = { duration: 2000, easing: "cubic-bezier(0.4, 0, 0.6, 1)" };

const OPENING_WORDS = ["Construimos", "narrativa", "desde", "temáticas", "+", "personas"];
const CLOSING_WORDS = ["que", "genera", "impacto", "real."];

export default function VideoSplitSection() {
  const sectionRef    = useRef<HTMLElement>(null);
  const phase2Ref     = useRef<HTMLDivElement>(null);
  const showCardsRef  = useRef(false);
  const textTriggered = useRef(false);

  const [textVisible, setTextVisible] = useState(false);
  const [showCards,   setShowCards]   = useState(false);
  const [statsActive, setStatsActive] = useState(false);
  const [done,        setDone]        = useState(false);

  /* ── Single spring-driven magnetic system ── */
  const rawY     = useMotionValue(0);
  const rawScale = useMotionValue(1);

  /*
   * Underdamped springs: elastic overshoot on build-up and snap-back.
   * One pipeline — scroll drives raw values, springs smooth them.
   */
  const magneticY     = useSpring(rawY,     { stiffness: 120, damping: 14, mass: 0.7 });
  const magneticScale = useSpring(rawScale, { stiffness: 120, damping: 14, mass: 0.7 });

  /* Clamp scale so spring overshoot never exceeds 1.0 (stays within container) */
  const clampedScale  = useTransform(magneticScale, (v) => Math.min(v, 1));
  const textMagneticY = useTransform(magneticY, (v) => v * 0.35);

  /*
   * gapPx drives the split: starts at 0 (one solid block),
   * springs open to 10 after the video dissolves.
   */
  const gapPx  = useMotionValue(0);
  const rowGap = useTransform(gapPx, (v) => `${v}px`);
  const colGap = rowGap;

  useEffect(() => { showCardsRef.current = showCards; }, [showCards]);

  /* ── Early tracker: text fires before sticky zone ── */
  const { scrollYProgress: earlyProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end end"],
  });

  useMotionValueEvent(earlyProgress, "change", (v) => {
    if (v > 0.12 && !textTriggered.current) {
      textTriggered.current = true;
      setTextVisible(true);
    }
  });

  /* ── Main tracker: magnetic feedback (bidirectional) ── */
  /*
   * Offset starts at "start 40%" — the magnetic pull begins building
   * while the section is still scrolling naturally into view.
   * One continuous motion: scroll drives rawY + rawScale → springs
   * add elastic overshoot → if you let go, everything springs back.
   */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 40%", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (showCardsRef.current) return;
    const t     = Math.min(1, Math.max(0, v / 0.45));
    const eased = Math.pow(t, 1.8);
    rawY.set(eased * 40);
    rawScale.set(1 - eased * 0.045);
  });

  /* ── Phase 2 fires ── */
  useEffect(() => {
    if (!showCards) return;

    /*
     * Smooth ease-out return instead of a hard set(0).
     * This prevents the "sudden stop" — the block drifts back
     * gently while the transition starts, maintaining scroll vibe.
     */
    animate(rawY,     0, { duration: 0.9, ease: easeInOut });
    animate(rawScale, 1, { duration: 0.9, ease: easeInOut });

    /*
     * Gap springs open with slight overshoot — feels physical,
     * like the block is cracking apart rather than sliding.
     * Delay = ~video fade duration so it reads as "splits after dissolve".
     */
    const ctrl = animate(gapPx, 10, {
      type: "spring",
      stiffness: 160,
      damping: 14,
      delay: 0.6,
    });
    return () => ctrl.stop();
  }, [showCards]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Trigger 2 ── */
  useEffect(() => {
    const el = phase2Ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowCards(true);
          setTimeout(() => setStatsActive(true), 700);
          setTimeout(() => setDone(true), 3400);
          obs.disconnect();
        }
      },
      { threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* ── Collapse ── */
  useLayoutEffect(() => {
    if (!done || !sectionRef.current) return;
    const targetY = sectionRef.current.offsetTop;
    if (lenisInstance) {
      lenisInstance.scrollTo(targetY, { immediate: true });
    } else {
      window.scrollTo(0, targetY);
    }
  }, [done]);

  /* ── Card split configs: each piece has its own spring personality ── */
  const cardSplitProps = [
    /* Card 1 — peels up */
    {
      initial: { opacity: 0, y: -22, scale: 0.92, rotate: -0.4 },
      exit:    { opacity: 0, y: -22, scale: 0.92, rotate: -0.4 },
      spring:  { type: "spring" as const, stiffness: 240, damping: 24, delay: 0.06 },
    },
    /* Card 2 — swings bottom-left */
    {
      initial: { opacity: 0, y: 26, x: -14, scale: 0.91, rotate: 1.1 },
      exit:    { opacity: 0, y: 26, x: -14, scale: 0.91, rotate: 1.1 },
      spring:  { type: "spring" as const, stiffness: 190, damping: 21, delay: 0.14 },
    },
    /* Card 3 — swings bottom-right, slightly stiffer */
    {
      initial: { opacity: 0, y: 26, x: 14, scale: 0.91, rotate: -1.1 },
      exit:    { opacity: 0, y: 26, x: 14, scale: 0.91, rotate: -1.1 },
      spring:  { type: "spring" as const, stiffness: 210, damping: 22, delay: 0.10 },
    },
  ] as const;

  const cardVisible   = { opacity: 1, y: 0, x: 0, scale: 1, rotate: 0 };
  const cardInvisible = (i: 0 | 1 | 2) => cardSplitProps[i].initial;

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={done ? undefined : { height: "200vh" }}
    >
      {!done && (
        <div
          ref={phase2Ref}
          aria-hidden="true"
          className="absolute w-px h-px"
          style={{ top: "150vh" }}
        />
      )}

      <div
        className={
          done
            ? "min-h-screen flex flex-col justify-center"
            : "sticky top-0 h-screen flex flex-col justify-center"
        }
      >
        <div className="mx-auto max-w-[1600px] px-[30px] lg:px-[60px] xl:px-[120px] w-full">

          {/* ── Opening text ── */}
          <motion.div style={{ y: textMagneticY }}>
            <p className="text-[42px] leading-[1.15] font-normal mb-6 lg:text-[48px] lg:mb-8 xl:text-[56px]">
              {OPENING_WORDS.map((word, i) => (
                <motion.span
                  key={word + i}
                  className="inline-block mr-[0.22em]"
                  initial={{ opacity: 0, y: 18 }}
                  animate={textVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.65, ease: easeOut, delay: i * 0.09 }}
                >
                  {word}
                </motion.span>
              ))}
            </p>
          </motion.div>

          {/* ── Video / Cards block ── */}
          <div className="relative mb-6 lg:mb-8">
            <motion.div style={{ y: magneticY, scale: clampedScale }}>

              {/* Cards at final position from the start */}
              <motion.div className="flex flex-col" style={{ rowGap }}>

                {/* Card 1 */}
                <motion.div
                  className="bg-violet rounded-[20px] p-6 overflow-hidden min-h-[158px]"
                  initial={cardSplitProps[0].initial}
                  animate={showCards ? cardVisible : cardInvisible(0)}
                  transition={cardSplitProps[0].spring}
                >
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
                  <p className="text-white/50 text-[10px] tracking-[-0.8px] lg:text-[12px]">
                    Impresiones totales
                  </p>
                </motion.div>

                <motion.div className="flex" style={{ columnGap: colGap }}>

                  {/* Card 2 */}
                  <motion.div
                    className="flex-1 bg-violet rounded-[20px] p-6 overflow-hidden min-h-[158px]"
                    initial={cardSplitProps[1].initial}
                    animate={showCards ? cardVisible : cardInvisible(1)}
                    transition={cardSplitProps[1].spring}
                  >
                    <Heart className="w-5 h-5 text-white/50 mb-4" />
                    <p className="text-white font-black text-[clamp(32px,9vw,50px)] leading-[1.2] tracking-[-3px] lg:text-[64px] lg:tracking-[-4px]">
                      <NumberFlow
                        value={statsActive ? 16600000 : 16200000}
                        format={{ notation: "compact", maximumFractionDigits: 1 }}
                        transformTiming={NUMBER_TIMING}
                        spinTiming={NUMBER_TIMING}
                        opacityTiming={NUMBER_TIMING}
                      />
                    </p>
                    <p className="text-white/50 text-[10px] tracking-[-0.8px] lg:text-[12px]">
                      Seguidores combinados
                    </p>
                  </motion.div>

                  {/* Card 3 */}
                  <motion.div
                    className="flex-1 bg-violet rounded-[20px] p-6 overflow-hidden min-h-[158px]"
                    initial={cardSplitProps[2].initial}
                    animate={showCards ? cardVisible : cardInvisible(2)}
                    transition={cardSplitProps[2].spring}
                  >
                    <Users className="w-5 h-5 text-white/50 mb-4" />
                    <p className="text-white font-black text-[clamp(32px,9vw,50px)] leading-[1.2] tracking-[-3px] lg:text-[64px] lg:tracking-[-4px]">
                      <NumberFlow
                        value={statsActive ? 29 : 15}
                        transformTiming={NUMBER_TIMING}
                        spinTiming={NUMBER_TIMING}
                        opacityTiming={NUMBER_TIMING}
                      />
                    </p>
                    <p className="text-white/50 text-[9px] tracking-[-0.8px] lg:text-[12px]">
                      Creadores únicos
                    </p>
                  </motion.div>

                </motion.div>
              </motion.div>

              {/*
               * Video: pure opacity + blur exit.
               * Blur expands as it fades → "dissolves into light" rather
               * than cleanly disappearing, reinforcing the split feeling.
               */}
              <AnimatePresence>
                {!showCards && (
                  <motion.div
                    key="video"
                    className="absolute inset-0 z-10 rounded-[20px] overflow-hidden"
                    initial={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{
                      opacity: 0,
                      filter: "blur(10px)",
                      transition: { duration: 0.75, ease: easeIn },
                    }}
                  >
                    <video autoPlay muted loop playsInline className="w-full h-full object-cover">
                      <source src="https://assets.mixkit.co/videos/29982/29982-1080.mp4" type="video/mp4" />
                    </video>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          </div>

          {/* ── Closing text ── */}
          <p className="text-[42px] leading-[1.15] font-normal text-right lg:text-[48px] xl:text-[56px]">
            {CLOSING_WORDS.map((word, i) => (
              <motion.span
                key={word + i}
                className="inline-block mr-[0.22em] last:mr-0"
                initial={{ opacity: 0, y: 18 }}
                animate={showCards ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                transition={{ duration: 0.65, ease: easeOut, delay: 0.60 + i * 0.10 }}
              >
                {word}
              </motion.span>
            ))}
          </p>

        </div>
      </div>
    </section>
  );
}
