"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const easeOut = [0.16, 1, 0.3, 1] as const;

const navLinks = [
  { label: "Portfolio", href: "/portfolio" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Contacto", href: "/contacto" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="pointer-events-none fixed top-[18px] left-0 right-0 z-40 flex justify-center px-[15px]">
        <div
          className="pointer-events-auto relative flex w-full max-w-[540px] items-center justify-between rounded-full bg-black/[0.04] py-[14px] pl-[24px] pr-[28px] backdrop-blur-[8px] lg:pl-[32px] lg:pr-[36px] dark:bg-white/[0.08]"
        >
          <Link href="/" className="flex items-center text-foreground no-underline">
            <span
              className="text-[17px] font-bold leading-none"
              style={{ fontFamily: "var(--font-sans), sans-serif", letterSpacing: "-0.02em" }}
            >
              Zeratype
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-[28px]">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[15px] font-normal text-foreground no-underline transition-opacity hover:opacity-60"
                style={{ fontFamily: "var(--font-sans), sans-serif", letterSpacing: "-0.01em" }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-[22px] w-[26px] flex-col justify-center gap-[5px] cursor-pointer lg:hidden"
            aria-label="Toggle menu"
          >
            <motion.span
              className="block h-[2px] w-full origin-center bg-foreground"
              animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 7 : 0 }}
              transition={{ duration: 0.3, ease: easeOut }}
            />
            <motion.span
              className="block h-[2px] w-full bg-foreground"
              animate={{ opacity: menuOpen ? 0 : 1 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="block h-[2px] w-full origin-center bg-foreground"
              animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -7 : 0 }}
              transition={{ duration: 0.3, ease: easeOut }}
            />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-30 bg-background pt-[80px] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: easeOut }}
          >
            <div className="flex flex-col items-start gap-8 px-[30px] pt-12">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1, duration: 0.4, ease: easeOut }}
                >
                  <Link
                    href={link.href}
                    className="block text-[40px] font-extralight uppercase tracking-tight text-foreground no-underline"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
