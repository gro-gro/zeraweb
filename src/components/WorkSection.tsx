"use client";

import { useState } from "react";
import { projects, filters } from "@/lib/projects";
import ProjectCard from "./ProjectCard";

export default function WorkSection() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filteredProjects = projects.filter((p) => {
    return !activeFilter || p.category === activeFilter.toLowerCase();
  });

  return (
    <section id="work">
      <div className="mx-auto max-w-[1600px] px-[30px] pt-24 lg:px-[60px] lg:pt-32 xl:px-[120px]">
      {/* Section label */}
      <p className="text-[13px] font-bold opacity-50 mb-4 uppercase">
        MEDIOS
      </p>

      {/* Category filters */}
      <div className="flex flex-wrap gap-[9px] mb-4">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(activeFilter === filter ? null : filter)}
            className={`text-[20px] font-normal transition-colors duration-200 cursor-pointer
              ${activeFilter === filter ? "text-black font-semibold" : "text-black/40 hover:text-black"}
            `}
          >
            {filter}
          </button>
        ))}
      </div>
      </div>

      {/* Project grid */}
      <div>
        <div className="grid grid-cols-1 gap-0 lg:grid-cols-2">
          {filteredProjects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
