"use client";

import { useRef, useState, useEffect, useLayoutEffect } from "react";
import {
  motion,
  useScroll, useMotionValue, useSpring, useTransform, useMotionValueEvent,
  animate,
} from "framer-motion";
import { Eye, Heart, Users } from "lucide-react";
import NumberFlow from "@number-flow/react";
import { lenisInstance } from "./SmoothScroll";

const easeOut   = [0.16, 1, 0.3, 1] as const;
const easeInOut = [0.4, 0, 0.6, 1]  as const;

const NUMBER_TIMING = { duration: 2000, easing: "cubic-bezier(0.16, 1, 0.3, 1)" };

const OPENING_WORDS = ["Construimos", "narrativa", "desde", "temáticas", "+", "personas"];
const CLOSING_WORDS = ["que", "genera", "impacto", "real."];

const VIDEO_SRC = "https://assets.mixkit.co/videos/29982/29982-1080.mp4";

/*
 * Build a clip-path with three rounded rectangles whose positions match
 * the three card slots. The video sitting under this clip-path always
 * shows the same continuous frame; the clip just exposes the regions
 * the cards occupy. At gap=0 the inner corners are sharp so the three
 * pieces read as ONE rounded block; as the gap opens, both the gap
 * itself and the inner corner radii grow, and the block visibly
 * fractures into three independent rounded cards.
 */
function buildVideoClipPath(w: number, c1: number, c2: number, g: number): string {
  if (!w || !c1 || !c2) return "none";

  const r  = Math.min(g * 2, 20); // inner-corner radius
  const w2 = Math.max((w - g) / 2, 0);
  const w3 = (w + g) / 2;

  const rect = (
    x: number, y: number, ww: number, hh: number,
    rTL: number, rTR: number, rBR: number, rBL: number,
  ) =>
    `M ${x + rTL} ${y} ` +
    `H ${x + ww - rTR} ` +
    `A ${rTR} ${rTR} 0 0 1 ${x + ww} ${y + rTR} ` +
    `V ${y + hh - rBR} ` +
    `A ${rBR} ${rBR} 0 0 1 ${x + ww - rBR} ${y + hh} ` +
    `H ${x + rBL} ` +
    `A ${rBL} ${rBL} 0 0 1 ${x} ${y + hh - rBL} ` +
    `V ${y + rTL} ` +
    `A ${rTL} ${rTL} 0 0 1 ${x + rTL} ${y} ` +
    `Z`;

  const r1 = rect(0,  0,        w,  c1, 20, 20, r,  r);
  const r2 = rect(0,  c1 + g,   w2, c2, r,  r,  r,  20);
  const r3 = rect(w3, c1 + g,   w2, c2, r,  r,  20, r);

  return `path("${r1} ${r2} ${r3}")`;
}

export default function VideoSplitSection() {
  const sectionRef    = useRef<HTMLElement>(null);
  const phase2Ref     = useRef<HTMLDivElement>(null);
  const cardsRef      = useRef<HTMLDivElement>(null);
  const card1Ref      = useRef<HTMLDivElement>(null);
  const bottomRowRef  = useRef<HTMLDivElement>(null);

  const showCardsRef  = useRef(false);
  const textTriggered = useRef(false);

  const [textVisible, setTextVisible] = useState(false);
  const [showCards,   setShowCards]   = useState(false);
  const [statsActive, setStatsActive] = useState(false);
  const [done,        setDone]        = useState(false);

  /* ── Magnetic spring on the whole block ── */
  const rawY     = useMotionValue(0);
  const rawScale = useMotionValue(1);
  const magneticY     = useSpring(rawY,     { stiffness: 120, damping: 14, mass: 0.7 });
  const magneticScale = useSpring(rawScale, { stiffness: 120, damping: 14, mass: 0.7 });
  const clampedScale  = useTransform(magneticScale, (v) => Math.min(v, 1));
  const textMagneticY = useTransform(magneticY, (v) => v * 0.35);

  /* ── Gap drives the split (0 → 10px) ── */
  const gapPx  = useMotionValue(0);
  const rowGap = useTransform(gapPx, (v) => `${v}px`);
  const colGap = rowGap;

  /*
   * Inner corners animate 0 → 20px alongside the gap.
   * At gap=0 the block reads as ONE rounded rectangle (no internal seams);
   * as gap opens, each piece grows its own four rounded corners.
   */
  const innerRadius = useTransform(gapPx, [0, 10], [0, 20]);

  /* ── Bounding-box measurements drive the per-piece video offsets ── */
  const containerW = useMotionValue(0);
  const card1H     = useMotionValue(0);
  const bottomRowH = useMotionValue(0);

  useLayoutEffect(() => {
    const cardsEl  = cardsRef.current;
    const card1El  = card1Ref.current;
    const bottomEl = bottomRowRef.current;
    if (!cardsEl || !card1El || !bottomEl) return;

    const measure = () => {
      containerW.set(cardsEl.offsetWidth);
      card1H.set(card1El.offsetHeight);
      bottomRowH.set(bottomEl.offsetHeight);
    };
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(cardsEl);
    ro.observe(card1El);
    ro.observe(bottomEl);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /*
   * A SINGLE video sits absolutely over the cards block, always showing
   * one continuous frame. A clip-path with three rounded rectangles
   * exposes only the regions the cards occupy. At gap=0 the inner
   * corners are 0, so the three regions read as one rounded block; as
   * the gap opens, both the literal gap and the inner radii grow.
   */
  const videoClipPath = useTransform(
    [containerW, card1H, bottomRowH, gapPx],
    ([w, c1, c2, g]: number[]) => buildVideoClipPath(w, c1, c2, g),
  );

  /*
   * Video opacity is driven by the gap itself, not a separate timeline.
   * The pieces stay solid while the split is opening, then dissolve to
   * reveal the stat content underneath.
   */
  const videoOpacity = useTransform(gapPx, [0, 4, 10], [1, 0.85, 0]);

  useEffect(() => { showCardsRef.current = showCards; }, [showCards]);

  /* ── Early text trigger ── */
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

  /* ── Magnetic feedback ── */
  /*
   * progress = 0 at the moment the sticky engages (section top hits viewport
   * top). The video sits centered at its original size for a beat before
   * the user can start scaling it down — no early pull while the section
   * is still entering the viewport.
   */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (showCardsRef.current) return;
    const t     = Math.min(1, Math.max(0, v / 0.45));
    const eased = Math.pow(t, 1.8);
    rawY.set(eased * 40);
    rawScale.set(1 - eased * 0.045);
  });

  /* ── Phase 2 ── */
  useEffect(() => {
    if (!showCards) return;

    animate(rawY,     0, { duration: 0.9, ease: easeInOut });
    animate(rawScale, 1, { duration: 0.9, ease: easeInOut });

    const ctrl = animate(gapPx, 10, {
      type: "spring",
      stiffness: 160,
      damping: 14,
      delay: 0.25,
    });
    return () => ctrl.stop();
  }, [showCards]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Trigger ── */
  useEffect(() => {
    const el = phase2Ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowCards(true);
          setTimeout(() => setStatsActive(true), 350);
          setTimeout(() => setDone(true), 3400);
          obs.disconnect();
        }
      },
      { threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /*
   * ── Commit-or-rewind ──
   *   While the user is still actively scrolling, the magnet "loads".
   *   The moment the scroll settles (no scroll event for ~120ms) and
   *   the conversion trigger hasn't fired yet, the scroll is dragged
   *   back to where the magnet hasn't engaged. The springs follow
   *   scrollYProgress, so the block visually unwinds to its original
   *   size on its own. To advance, the user must commit one continuous
   *   scroll all the way through the trigger.
   */
  useEffect(() => {
    if (done) return;

    let stopTimer: ReturnType<typeof setTimeout> | null = null;
    let rewinding = false;

    const rewind = () => {
      if (showCardsRef.current || !sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const vh = window.innerHeight;
      const magnetStart       = sectionTop;            // useScroll progress = 0 (sticky just engaged)
      const conversionTrigger = sectionTop + vh * 0.5; // phase2Ref enters viewport
      const scrollY = window.scrollY;

      if (scrollY <= magnetStart + 4 || scrollY >= conversionTrigger - 4) return;

      rewinding = true;
      const finish = () => { rewinding = false; };

      if (lenisInstance) {
        lenisInstance.scrollTo(magnetStart, {
          duration: 0.55,
          easing: (t: number) => 1 - Math.pow(1 - t, 3),
          onComplete: finish,
        });
      } else {
        window.scrollTo({ top: magnetStart, behavior: "smooth" });
        setTimeout(finish, 600);
      }
    };

    const onScroll = () => {
      if (rewinding) return; // don't re-arm during the rewind itself
      if (stopTimer) clearTimeout(stopTimer);
      stopTimer = setTimeout(rewind, 120);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (stopTimer) clearTimeout(stopTimer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [done]);


  const contentTransition = { duration: 0.55, delay: 0.55, ease: easeOut } as const;

  return (
    <motion.section
      ref={sectionRef}
      className="relative"
      initial={{ height: "200vh" }}
      animate={{ height: showCards ? "150vh" : "200vh" }}
      transition={{ duration: 0.7, ease: easeInOut }}
    >
      {!showCards && (
        <div
          ref={phase2Ref}
          aria-hidden="true"
          className="absolute w-px h-px"
          style={{ top: "150vh" }}
        />
      )}

      {/*
       * Sticky during the magnet/conversion phase. Once the cards are open,
       * we drop sticky and place the block in normal flow with margin-top:
       * 50vh — the conversion fires at scrollY = sectionTop + 50vh, which
       * is exactly where the sticky was pinning the block (viewport top).
       * Same docY before and after, so the cards don't teleport. With sticky
       * gone, forward scroll moves the cards out of viewport naturally
       * instead of pinning them — no more "trabado" feeling.
       */}
      <div
        className={
          showCards
            ? "h-screen flex flex-col justify-center"
            : "sticky top-0 h-screen flex flex-col justify-center"
        }
        style={showCards ? { marginTop: "50vh" } : undefined}
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

              <motion.div ref={cardsRef} className="relative flex flex-col" style={{ rowGap }}>

                {/* Card 1 — top, full width */}
                <motion.div
                  ref={card1Ref}
                  className="bg-violet overflow-hidden min-h-[158px] relative"
                  style={{
                    borderTopLeftRadius:     20,
                    borderTopRightRadius:    20,
                    borderBottomLeftRadius:  innerRadius,
                    borderBottomRightRadius: innerRadius,
                  }}
                >
                  <motion.div
                    className="relative p-6"
                    initial={{ opacity: 0 }}
                    animate={showCards ? { opacity: 1 } : { opacity: 0 }}
                    transition={contentTransition}
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
                </motion.div>

                {/* Bottom row — cards 2 and 3 */}
                <motion.div ref={bottomRowRef} className="flex" style={{ columnGap: colGap }}>

                  {/* Card 2 — bottom-left */}
                  <motion.div
                    className="flex-1 bg-violet overflow-hidden min-h-[158px] relative"
                    style={{
                      borderTopLeftRadius:     innerRadius,
                      borderTopRightRadius:    innerRadius,
                      borderBottomLeftRadius:  20,
                      borderBottomRightRadius: innerRadius,
                    }}
                  >
                    <motion.div
                      className="relative p-6"
                      initial={{ opacity: 0 }}
                      animate={showCards ? { opacity: 1 } : { opacity: 0 }}
                      transition={contentTransition}
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
                  </motion.div>

                  {/* Card 3 — bottom-right */}
                  <motion.div
                    className="flex-1 bg-violet overflow-hidden min-h-[158px] relative"
                    style={{
                      borderTopLeftRadius:     innerRadius,
                      borderTopRightRadius:    innerRadius,
                      borderBottomLeftRadius:  innerRadius,
                      borderBottomRightRadius: 20,
                    }}
                  >
                    <motion.div
                      className="relative p-6"
                      initial={{ opacity: 0 }}
                      animate={showCards ? { opacity: 1 } : { opacity: 0 }}
                      transition={contentTransition}
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
                 * One video covering the whole cards block. The clip-path
                 * exposes the three card regions; at gap=0 they read as
                 * one continuous rounded block, then visibly fracture as
                 * the gap opens. Opacity fades to reveal the stat
                 * content beneath.
                 */}
                <motion.video
                  autoPlay muted loop playsInline preload="auto"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  style={{
                    clipPath:        videoClipPath,
                    WebkitClipPath:  videoClipPath,
                    opacity:         videoOpacity,
                  }}
                >
                  <source src={VIDEO_SRC} type="video/mp4" />
                </motion.video>
              </motion.div>

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
    </motion.section>
  );
}
