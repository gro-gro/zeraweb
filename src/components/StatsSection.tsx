"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Eye, Heart, Users } from "lucide-react";

const easeOut = [0.16, 1, 0.3, 1] as const;

export default function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="mx-auto max-w-[1600px] px-[30px] py-12 lg:px-[60px] xl:px-[120px]">
      {/* Stats grid */}
      <div className="flex flex-col gap-[10px] lg:max-w-[800px]">
        {/* Top wide card */}
        <motion.div
          className="bg-violet rounded-[20px] p-6 relative overflow-hidden min-h-[158px]"
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.7, ease: easeOut }}
        >
          <Eye className="w-5 h-5 text-white/50 mb-4" />
          <p className="text-white font-black text-[76px] leading-[1.2] tracking-[-6px] lg:text-[96px]">
            3.3B
          </p>
          <p className="text-white/50 text-[10px] tracking-[-0.8px] lg:text-[12px]">
            Impresiones totales
          </p>
        </motion.div>

        {/* Bottom two cards */}
        <div className="flex gap-[10px]">
          <motion.div
            className="flex-1 bg-violet rounded-[20px] p-6 relative overflow-hidden min-h-[158px]"
            initial={{ y: 30, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.7, ease: easeOut, delay: 0.1 }}
          >
            <Heart className="w-5 h-5 text-white/50 mb-4" />
            <p className="text-white font-black text-[50px] leading-[1.2] tracking-[-4px] lg:text-[64px]">
              16.6M
            </p>
            <p className="text-white/50 text-[10px] tracking-[-0.8px] lg:text-[12px]">
              Seguidores combinados
            </p>
          </motion.div>

          <motion.div
            className="flex-1 bg-violet rounded-[20px] p-6 relative overflow-hidden min-h-[158px]"
            initial={{ y: 30, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.7, ease: easeOut, delay: 0.2 }}
          >
            <Users className="w-5 h-5 text-white/50 mb-4" />
            <p className="text-white font-black text-[50px] leading-[1.2] tracking-[-4px] lg:text-[64px]">
              29
            </p>
            <p className="text-white/50 text-[10px] tracking-[-0.8px] lg:text-[12px]">
              Creadores únicos
            </p>
          </motion.div>
        </div>
      </div>

      {/* "que genera impacto real." */}
      <motion.p
        className="text-[46px] leading-none mt-12 lg:text-[64px] xl:text-[72px] lg:max-w-[700px]"
        initial={{ y: 30, opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.7, ease: easeOut, delay: 0.3 }}
      >
        que genera impacto real.
      </motion.p>
    </section>
  );
}
