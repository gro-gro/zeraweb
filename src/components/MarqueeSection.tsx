"use client";

import { motion } from "framer-motion";

const topics = [
  "🧠 Salud Mental",
  "🔬 Ciencia",
  "👶 Crianza",
  "🚀 Emprendimiento",
  "📰 Periodismo",
  "💰 Finanzas",
  "😂 Humor",
  "💪 Fitness",
  "✨ Lifestyle",
];

function MarqueeRow() {
  return (
    <div className="flex gap-[5px] shrink-0">
      {topics.map((topic) => (
        <span
          key={topic}
          className="shrink-0 inline-flex items-center justify-center h-[28px] px-[12px] rounded-[20px] bg-violet-light border border-violet-border text-[11px] tracking-[-0.8px] whitespace-nowrap lg:h-[34px] lg:text-[13px] lg:px-[16px]"
        >
          {topic}
        </span>
      ))}
    </div>
  );
}

export default function MarqueeSection() {
  return (
    <section className="py-6 overflow-hidden">
      <motion.div
        className="flex gap-[5px] w-max"
        animate={{ x: ["0%", "-33.33%"] }}
        transition={{
          x: {
            duration: 25,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
          },
        }}
      >
        <MarqueeRow />
        <MarqueeRow />
        <MarqueeRow />
      </motion.div>
    </section>
  );
}
