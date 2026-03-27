import { notFound } from "next/navigation";
import Link from "next/link";
import { projects, getProjectBySlug, getRelatedProjects } from "@/lib/projects";
import { getParticipantsByIds } from "@/lib/creators";
import ScrollToTop from "@/components/ScrollToTop";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

function SocialIcon({ platform }: { platform: string }) {
  switch (platform) {
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    case "x":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    default:
      return null;
  }
}

const socialBaseUrls: Record<string, string> = {
  instagram: "https://instagram.com/",
  tiktok: "https://tiktok.com/@",
  youtube: "https://youtube.com/@",
  x: "https://x.com/",
};

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  const participants = getParticipantsByIds(project.participantIds);
  const socialEntries = Object.entries(project.socials).filter(
    ([, handle]) => handle
  ) as [string, string][];
  const related = getRelatedProjects(slug, 4);

  return (
    <main className="min-h-screen bg-white">
      <ScrollToTop />
      {/* Hero — full width */}
      <div
        className="relative w-full aspect-[3/1] lg:aspect-[4/1] bg-cover bg-center"
        style={{
          backgroundImage: `url(${project.bgImage})`,
          backgroundColor: project.bgColor || "#333",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex items-end justify-center">
          <div className="w-full max-w-3xl mx-auto px-[30px] pb-8 lg:pb-12">
            {project.status === "inactive" && (
              <span className="inline-block mb-3 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white/80 text-[11px] font-medium border border-white/20">
                Proyecto inactivo
              </span>
            )}
            <h1 className="text-white text-[36px] leading-[1.05] font-bold lg:text-[56px]">
              {project.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Content — centered */}
      <div className="w-full max-w-3xl mx-auto px-[30px] py-10 lg:py-16">
        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="px-3 py-1.5 rounded-full bg-black text-white text-[12px] font-medium capitalize">
            {project.category}
          </span>
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 rounded-full border border-black/15 text-black/70 text-[12px] font-medium capitalize"
            >
              {tag.replace(/-/g, " ")}
            </span>
          ))}
        </div>

        {/* Social links */}
        {socialEntries.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-10">
            {socialEntries.map(([platform, handle]) => (
              <a
                key={platform}
                href={`${socialBaseUrls[platform]}${handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-black/10 text-black/70 text-[13px] font-medium hover:bg-black hover:text-white hover:border-black transition-colors duration-200"
              >
                <SocialIcon platform={platform} />
                <span>@{handle}</span>
              </a>
            ))}
          </div>
        )}

        {/* Participants */}
        {participants.length > 0 && (
          <div className="mb-10 pb-10 border-b border-black/10">
            <p className="text-[11px] font-bold uppercase text-black/40 mb-3 tracking-wide">
              {project.category === "organizaciones" ? "Organizacion" : "Creadores"}
            </p>
            <div className="flex flex-wrap gap-3">
              {participants.map((p) => (
                <div key={p.id} className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center overflow-hidden shrink-0">
                    {p.photo ? (
                      <img
                        src={p.photo}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-black/50 text-[13px] font-bold">
                        {p.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-black leading-tight">
                      {p.name}
                    </p>
                    {p.instagram && (
                      <a
                        href={p.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[12px] text-black/40 hover:text-black transition-colors"
                      >
                        @{p.instagram}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Long description */}
        <div className="space-y-6">
          {project.longDescription.map((paragraph, i) => (
            <p
              key={i}
              className="text-[17px] leading-[1.7] text-black/75 lg:text-[18px]"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Related projects */}
      {related.length > 0 && (
        <div className="border-t border-black/10">
          <div className="w-full max-w-3xl mx-auto px-[30px] py-16">
            <p className="text-[11px] font-bold uppercase text-black/40 mb-6 tracking-wide">
              Otros proyectos
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/projects/${r.slug}`}
                  className="group block relative aspect-[16/10] rounded-2xl overflow-hidden"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-105"
                    style={{
                      backgroundImage: `url(${r.bgImage})`,
                      backgroundColor: r.bgColor || "#333",
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-5">
                    <span className="text-white font-bold text-[15px] leading-tight">
                      {r.name}
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {r.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-full bg-white/15 text-white/70 text-[10px] font-medium capitalize"
                        >
                          {tag.replace(/-/g, " ")}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
