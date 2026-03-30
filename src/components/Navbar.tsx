"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ZIcon } from "./ZeratypeLogo";
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
      <nav
        className="fixed top-[15px] left-[15px] right-[15px] z-40"
        style={{ mixBlendMode: "difference", pointerEvents: "none" }}
      >
        <div
          className="relative mx-auto flex max-w-[1600px] items-center justify-between h-[56px] px-[30px] lg:px-[60px] xl:px-[120px] text-white"
          style={{ pointerEvents: "auto" }}
        >
          <Link href="/">
            <ZIcon className="w-[28px] h-[22px]" color="currentColor" />
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[14px] font-medium no-underline hover:opacity-60 transition-opacity"
                style={{ color: "inherit" }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col justify-center gap-[5px] w-[28px] h-[22px] cursor-pointer lg:hidden"
            aria-label="Toggle menu"
          >
            <motion.span
              className="block w-full h-[2px] origin-center bg-white"
              animate={{
                rotate: menuOpen ? 45 : 0,
                y: menuOpen ? 7 : 0,
              }}
              transition={{ duration: 0.3, ease: easeOut }}
            />
            <motion.span
              className="block w-full h-[2px] bg-white"
              animate={{
                opacity: menuOpen ? 0 : 1,
              }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="block w-full h-[2px] origin-center bg-white"
              animate={{
                rotate: menuOpen ? -45 : 0,
                y: menuOpen ? -7 : 0,
              }}
              transition={{ duration: 0.3, ease: easeOut }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-30 bg-white pt-[80px] lg:hidden"
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
                    className="text-[40px] font-extralight uppercase tracking-tight text-black no-underline block"
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
