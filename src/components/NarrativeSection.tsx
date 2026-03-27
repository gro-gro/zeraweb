"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView } from "framer-motion";

const easeOut = [0.16, 1, 0.3, 1] as const;

/*
 * Positions exported from /dev/layout-builder at 72px base.
 * Scale is calculated dynamically from container width.
 */
const ELEMENTS = [
  { id: "construimos", text: "Construimos", x: 0, y: 0, fontSize: 72 },
  { id: "narrativa", text: "narrativa", x: 0, y: 80, fontSize: 72 },
  { id: "desde", text: "desde", x: 339, y: 80, fontSize: 72 },
  { id: "emoji-puzzle", text: "🧩", x: 315, y: 133, fontSize: 140 },
  { id: "tematicas", text: "temáticas", x: 0, y: 163, fontSize: 72 },
  { id: "plus", text: "+", x: 490, y: 163, fontSize: 72 },
  { id: "emoji-people", text: "👥", x: -23, y: 187, fontSize: 140 },
  { id: "personas", text: "personas", x: 180, y: 240, fontSize: 72 },
] as const;

/* Base dimensions of the layout (designed at 72px) */
const BASE_W = 550;
const BASE_H = 340;

export default function NarrativeSection() {
  const ref = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const isInView = useInView(ref, { once: true, margin: "0px" });

  const updateScale = useCallback(() => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth;
    setScale(Math.min(0.75, width / BASE_W));
  }, []);

  useEffect(() => {
    updateScale();
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(updateScale);
    observer.observe(el);
    return () => observer.disconnect();
  }, [updateScale]);

  return (
    <section ref={ref} className="mx-auto max-w-[1600px] px-[30px] pt-24 pb-2 lg:px-[60px] lg:pb-4 xl:px-[120px]">
      {/* Text — each element animates independently at fixed speed (not scroll-dependent) */}
      <div className="mb-2 lg:mb-4">
        <div ref={containerRef} className="relative" style={{ height: BASE_H * scale }}>
          <div
            className="absolute top-0 left-0"
            style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}
          >
            {ELEMENTS.map((el, i) => (
              <motion.span
                key={el.id}
                className="absolute leading-none whitespace-nowrap select-none font-normal"
                style={{ left: el.x, top: el.y, fontSize: el.fontSize }}
                initial={{ y: 16, opacity: 0 }}
                animate={isInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.65, ease: easeOut, delay: 0.05 + i * 0.09 }}
              >
                {el.text}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
