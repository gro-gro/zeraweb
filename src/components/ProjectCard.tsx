import Link from "next/link";
import type { Project } from "@/lib/projects";
import { getParticipantsByIds, type Participant } from "@/lib/creators";

interface ProjectCardProps {
  project: Project;
  index: number;
}

function ParticipantAvatars({ participants }: { participants: Participant[] }) {
  if (participants.length === 0) return null;
  const first = participants[0];
  const extra = participants.length - 1;

  return (
    <div className="flex items-center shrink-0">
      <div className="w-7 h-7 rounded-full border-2 border-white/80 overflow-hidden bg-neutral-500 shrink-0">
        {first.photo ? (
          <img
            src={first.photo}
            alt={first.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-white/25">
            <span className="text-white text-[10px] font-bold leading-none">
              {first.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {extra > 0 && (
        <div className="-ml-2 w-7 h-7 rounded-full border-2 border-white/80 bg-white flex items-center justify-center shrink-0">
          <span className="text-black text-[9px] font-bold leading-none">
            +{extra}
          </span>
        </div>
      )}
    </div>
  );
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const isLeft = index % 2 === 0;
  const participants = getParticipantsByIds(project.participantIds);

  const topPositionClasses = isLeft
    ? "left-[var(--page-margin)] right-[var(--page-margin)] lg:right-6"
    : "left-[var(--page-margin)] right-[var(--page-margin)] lg:left-6";

  const bottomPaddingClasses = isLeft
    ? "pl-[var(--page-margin)] pr-[var(--page-margin)] lg:pr-6"
    : "pl-[var(--page-margin)] pr-[var(--page-margin)] lg:pl-6";

  return (
    <div>
      <Link
        href={`/projects/${project.slug}`}
        className="block relative aspect-[4/3] overflow-hidden group rounded-none"
      >
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-105"
          style={{
            backgroundImage: `url(${project.bgImage})`,
            backgroundColor: project.bgColor || "#333",
          }}
        />

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />

        {/* Inactive badge */}
        {project.status === "inactive" && (
          <div className="absolute top-4 right-4 z-10">
            <span className="text-white/60 text-[10px] font-medium uppercase tracking-wide">
              Inactivo
            </span>
          </div>
        )}

        {/* Logo or name */}
        <div className={`absolute top-4 z-10 ${topPositionClasses}`}>
          {project.logo ? (
            <img
              src={project.logo}
              alt={project.name}
              className="h-7 w-auto max-w-[140px] object-contain drop-shadow"
            />
          ) : (
            <span className="text-white font-bold text-[14px] leading-tight drop-shadow">
              {project.name}
            </span>
          )}
        </div>

        {/* Bottom row */}
        <div className={`absolute bottom-0 left-0 right-0 z-10 pb-4 flex items-end justify-between gap-3 ${bottomPaddingClasses}`}>
          {project.tags.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 min-w-0">
              {project.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center text-white/70 text-[10px] sm:text-[11px] font-medium capitalize"
                >
                  {tag.replace(/-/g, " ")}
                </span>
              ))}
            </div>
          ) : (
            <div />
          )}

          {participants.length > 0 && (
            <ParticipantAvatars participants={participants} />
          )}
        </div>
      </Link>
    </div>
  );
}
