import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { careers } from "@/lib/careers";

export default function CarrerasPage() {
  const active = careers.filter((c) => c.active);
  const closed = careers.filter((c) => !c.active);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-[56px]">
        <div className="mx-auto max-w-[1600px] px-[30px] pt-24 pb-24 lg:px-[60px] lg:pt-32 lg:pb-32 xl:px-[120px]">
          <p className="text-[13px] font-bold opacity-50 mb-4 uppercase">
            Carreras
          </p>
          <h1 className="text-[48px] lg:text-[72px] font-bold leading-[0.92] uppercase mb-6">
            Sumate al
            <br />
            equipo
          </h1>
          <p className="text-[18px] leading-[1.7] text-black/70 max-w-2xl mb-16">
            Estamos buscando personas con talento y pasion por los medios
            digitales. Si crees que podes sumar, este es tu lugar.
          </p>

          {/* Active positions */}
          {active.length > 0 ? (
            <div className="space-y-4 mb-16">
              <p className="text-[11px] font-bold uppercase text-black/40 mb-6 tracking-wide">
                Posiciones abiertas ({active.length})
              </p>
              {active.map((career) => (
                <div
                  key={career.id}
                  className="border border-black/10 rounded-2xl p-6 lg:p-8 hover:border-black/25 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-[22px] font-semibold leading-tight">
                        {career.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="px-3 py-1 rounded-full bg-black/5 text-[12px] font-medium text-black/60">
                          {career.department}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-black/5 text-[12px] font-medium text-black/60">
                          {career.location}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-black/5 text-[12px] font-medium text-black/60 capitalize">
                          {career.type.replace("-", " ")}
                        </span>
                      </div>
                    </div>
                    <a
                      href={`mailto:hola@zeratype.com?subject=Postulacion: ${career.title}`}
                      className="shrink-0 px-6 py-2.5 bg-black text-white rounded-full text-[14px] font-medium hover:bg-black/80 transition-colors text-center"
                    >
                      Postularme
                    </a>
                  </div>
                  <p className="text-[15px] text-black/65 leading-[1.6] mb-4">
                    {career.description}
                  </p>
                  <div>
                    <p className="text-[11px] font-bold uppercase text-black/40 mb-2 tracking-wide">
                      Requisitos
                    </p>
                    <ul className="space-y-1.5">
                      {career.requirements.map((req, i) => (
                        <li
                          key={i}
                          className="text-[14px] text-black/60 leading-[1.5] flex gap-2"
                        >
                          <span className="text-black/30 shrink-0">&mdash;</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center mb-16">
              <p className="text-[18px] text-black/40">
                No hay posiciones abiertas en este momento.
              </p>
              <p className="text-[15px] text-black/30 mt-2">
                Pero siempre podes escribirnos a{" "}
                <a
                  href="mailto:hola@zeratype.com"
                  className="text-black/50 underline"
                >
                  hola@zeratype.com
                </a>
              </p>
            </div>
          )}

          {/* Closed positions */}
          {closed.length > 0 && (
            <div>
              <p className="text-[11px] font-bold uppercase text-black/40 mb-6 tracking-wide">
                Posiciones cerradas
              </p>
              <div className="space-y-3">
                {closed.map((career) => (
                  <div
                    key={career.id}
                    className="border border-black/5 rounded-2xl p-6 opacity-50"
                  >
                    <h3 className="text-[18px] font-semibold leading-tight">
                      {career.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="px-3 py-1 rounded-full bg-black/5 text-[12px] font-medium text-black/60">
                        {career.department}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-black/5 text-[12px] font-medium text-black/60">
                        {career.location}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Spontaneous application */}
        <div className="border-t border-black/10">
          <div className="mx-auto max-w-[1600px] px-[30px] py-16 lg:px-[60px] xl:px-[120px] text-center">
            <p className="text-[18px] text-black/70 mb-4">
              No encontras lo que buscas?
            </p>
            <p className="text-[15px] text-black/50 mb-6 max-w-lg mx-auto">
              Envianos tu CV y portfolio a nuestro email. Siempre estamos
              abiertos a conocer gente talentosa.
            </p>
            <a
              href="mailto:hola@zeratype.com?subject=Postulacion espontanea"
              className="inline-block px-8 py-3 border-2 border-black text-black rounded-full text-[15px] font-medium hover:bg-black hover:text-white transition-colors"
            >
              Enviar postulacion
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
