"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactoPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-[56px]">
        <div className="mx-auto max-w-[1600px] px-[30px] pt-24 pb-24 lg:px-[60px] lg:pt-32 lg:pb-32 xl:px-[120px]">
          <p className="text-[13px] font-bold opacity-50 mb-4 uppercase">
            Contacto
          </p>
          <h1 className="text-[48px] lg:text-[72px] font-bold leading-[0.92] uppercase mb-10">
            Hablemos
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Form */}
            <div>
              <p className="text-[18px] leading-[1.7] text-black/70 mb-8">
                Si tenes un proyecto, una idea o simplemente queres conocernos,
                escribinos. Vamos a responderte lo antes posible.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[13px] font-medium text-black/50 mb-2 uppercase tracking-wide">
                    Nombre
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-black/15 rounded-xl text-[16px] focus:outline-none focus:border-black/40 transition-colors"
                    placeholder="Tu nombre"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-black/50 mb-2 uppercase tracking-wide">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-black/15 rounded-xl text-[16px] focus:outline-none focus:border-black/40 transition-colors"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-black/50 mb-2 uppercase tracking-wide">
                    Mensaje
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-black/15 rounded-xl text-[16px] focus:outline-none focus:border-black/40 transition-colors resize-none"
                    placeholder="Contanos sobre tu proyecto o idea..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="px-8 py-3 bg-black text-white rounded-full text-[15px] font-medium hover:bg-black/80 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {status === "sending" ? "Enviando..." : "Enviar mensaje"}
                </button>

                {status === "sent" && (
                  <p className="text-[14px] text-green-600 mt-2">
                    Mensaje enviado. Te responderemos pronto.
                  </p>
                )}
                {status === "error" && (
                  <p className="text-[14px] text-red-600 mt-2">
                    Hubo un error. Intenta de nuevo o escribinos directamente
                    por email.
                  </p>
                )}
              </form>
            </div>

            {/* Contact info */}
            <div className="space-y-12">
              <div>
                <h3 className="text-[11px] font-bold uppercase text-black/40 mb-4 tracking-wide">
                  Email
                </h3>
                <a
                  href="mailto:hola@zeratype.com"
                  className="text-[20px] lg:text-[24px] font-light text-black hover:text-black/50 transition-colors"
                >
                  hola@zeratype.com
                </a>
              </div>

              <div>
                <h3 className="text-[11px] font-bold uppercase text-black/40 mb-4 tracking-wide">
                  Telefono
                </h3>
                <a
                  href="tel:+5491100000000"
                  className="text-[20px] lg:text-[24px] font-light text-black hover:text-black/50 transition-colors"
                >
                  +54 9 11 0000-0000
                </a>
              </div>

              <div>
                <h3 className="text-[11px] font-bold uppercase text-black/40 mb-4 tracking-wide">
                  Ubicacion
                </h3>
                <p className="text-[20px] lg:text-[24px] font-light text-black/70">
                  Buenos Aires, Argentina
                </p>
              </div>

              <div>
                <h3 className="text-[11px] font-bold uppercase text-black/40 mb-4 tracking-wide">
                  Socials
                </h3>
                <div className="flex gap-4">
                  <a
                    href="#"
                    className="text-[16px] text-black hover:text-black/50 transition-colors"
                  >
                    Instagram
                  </a>
                  <a
                    href="#"
                    className="text-[16px] text-black hover:text-black/50 transition-colors"
                  >
                    LinkedIn
                  </a>
                  <a
                    href="#"
                    className="text-[16px] text-black hover:text-black/50 transition-colors"
                  >
                    X
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alternative contact methods */}
        <div className="border-t border-black/10">
          <div className="mx-auto max-w-[1600px] px-[30px] py-16 lg:px-[60px] xl:px-[120px]">
            <div className="text-center">
              <p className="text-[13px] text-black/40 uppercase tracking-wide font-medium">
                Tambien podes contactarnos por
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-6">
                <a
                  href="mailto:hola@zeratype.com"
                  className="flex items-center gap-3 px-6 py-4 border border-black/10 rounded-2xl hover:border-black/30 transition-colors group"
                >
                  <svg
                    className="w-6 h-6 text-black/40 group-hover:text-black transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    />
                  </svg>
                  <div className="text-left">
                    <p className="text-[14px] font-medium text-black">Email</p>
                    <p className="text-[13px] text-black/40">
                      hola@zeratype.com
                    </p>
                  </div>
                </a>

                <a
                  href="tel:+5491100000000"
                  className="flex items-center gap-3 px-6 py-4 border border-black/10 rounded-2xl hover:border-black/30 transition-colors group"
                >
                  <svg
                    className="w-6 h-6 text-black/40 group-hover:text-black transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                    />
                  </svg>
                  <div className="text-left">
                    <p className="text-[14px] font-medium text-black">
                      Telefono
                    </p>
                    <p className="text-[13px] text-black/40">
                      +54 9 11 0000-0000
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
