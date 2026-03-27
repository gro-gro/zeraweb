"use client";

import Link from "next/link";

const linkClass = "text-white hover:text-white/50 transition-colors duration-200";

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-[1600px] px-[40px] py-24 lg:px-[80px] lg:py-32 xl:px-[120px]">

        {/* Columns */}
        <div className="grid grid-cols-2 gap-y-14 gap-x-8 mb-24 lg:mb-28">
          <div>
            <h4 className="text-white/40 text-[12px] tracking-[1.5px] uppercase mb-6">
              Zeratype
            </h4>
            <ul className="space-y-3 text-[18px] font-light">
              <li>
                <Link href="/portfolio" className={linkClass}>Portfolio</Link>
              </li>
              <li>
                <Link href="/nosotros" className={linkClass}>Nosotros</Link>
              </li>
              <li>
                <Link href="/carreras" className={linkClass}>Carreras</Link>
              </li>
              <li>
                <Link href="/blog" className={linkClass}>Blog</Link>
              </li>
              <li>
                <Link href="/contacto" className={linkClass}>Contacto</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white/40 text-[12px] tracking-[1.5px] uppercase mb-6">
              Socials
            </h4>
            <ul className="space-y-3 text-[18px] font-light">
              <li>
                <a href="#" className={linkClass}>Instagram</a>
              </li>
              <li>
                <a href="#" className={linkClass}>LinkedIn</a>
              </li>
              <li>
                <a href="#" className={linkClass}>X</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <p className="text-[13px] text-white/30">
          &copy; {new Date().getFullYear()} Zeratype
        </p>
      </div>
    </footer>
  );
}
