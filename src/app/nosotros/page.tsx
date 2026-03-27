import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Team from "@/components/shadcn-studio/blocks/team-section-01/team-section-01";
import { team } from "@/lib/team";

export default function NosotrosPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-[56px]">
        {/* Hero */}
        <section className="mx-auto max-w-[1600px] px-[30px] pt-24 pb-16 lg:px-[60px] lg:pt-32 xl:px-[120px]">
          <p className="text-[13px] font-bold opacity-50 mb-4 uppercase">
            Nosotros
          </p>
          <h1 className="text-[48px] lg:text-[72px] font-bold leading-[0.92] uppercase mb-10">
            Somos media
            <br />
            builders
          </h1>
          <div className="max-w-3xl space-y-6">
            <p className="text-[18px] leading-[1.7] text-black/70 lg:text-[20px]">
              Zeratype es un estudio de medios digitales que construye narrativa
              desde tematicas y personas. Creemos que el mejor contenido nace
              cuando alguien tiene algo genuino que decir y encuentra la forma
              correcta de decirlo.
            </p>
            <p className="text-[18px] leading-[1.7] text-black/70 lg:text-[20px]">
              Trabajamos con creadores, organizaciones y marcas para desarrollar
              proyectos de contenido que generan impacto real: podcasts, medios
              digitales, comunidades y formatos experimentales que conectan con
              audiencias que importan.
            </p>
            <p className="text-[18px] leading-[1.7] text-black/70 lg:text-[20px]">
              Desde Buenos Aires para el mundo, nuestro equipo combina
              estrategia, creatividad y produccion para convertir ideas en
              proyectos que perduran.
            </p>
          </div>
        </section>

        {/* Divider */}
        <div className="mx-auto max-w-[1600px] px-[30px] lg:px-[60px] xl:px-[120px]">
          <div className="border-t border-black/10" />
        </div>

        {/* Team — shadcn block */}
        <Team teamMembers={team} />
      </main>
      <Footer />
    </>
  );
}
