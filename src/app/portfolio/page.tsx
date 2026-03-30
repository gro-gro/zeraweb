"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { projects, filters as categoryFilters } from "@/lib/projects";
import { getParticipantsByIds, participants } from "@/lib/creators";

/* ── Dropdown multiselect ─────────────────────────────────────────────── */

function FilterDropdown({
  label,
  options,
  selected,
  onToggle,
  onClear,
}: {
  label: string;
  options: { value: string; label: string }[];
  selected: string[];
  onToggle: (value: string) => void;
  onClear: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (open) {
      setSearch("");
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  const filtered = search
    ? options.filter((o) =>
        o.label.toLowerCase().includes(search.toLowerCase())
      )
    : options;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 text-[15px] font-normal transition-colors duration-200 cursor-pointer
          ${selected.length > 0 ? "text-black font-semibold" : "text-black/40 hover:text-black"}
        `}
      >
        {label}
        {selected.length > 0 && (
          <span className="text-[12px] font-semibold text-black/40">
            {selected.length}
          </span>
        )}
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 bg-white border border-black/10 rounded-xl shadow-lg z-50 min-w-[260px] max-h-[360px] flex flex-col">
          {/* Search + clear */}
          <div className="sticky top-0 bg-white border-b border-black/5 px-3 py-2 flex items-center gap-2">
            <svg
              className="w-4 h-4 text-black/30 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar..."
              className="flex-1 text-[13px] outline-none bg-transparent placeholder:text-black/30"
            />
            {selected.length > 0 && (
              <button
                onClick={onClear}
                className="text-[11px] text-black/40 hover:text-black transition-colors cursor-pointer shrink-0"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Options */}
          <div className="p-2 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="px-3 py-2 text-[13px] text-black/30">
                Sin resultados
              </p>
            ) : (
              filtered.map((opt) => {
                const isSelected = selected.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    onClick={() => onToggle(opt.value)}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-left text-[14px] transition-colors cursor-pointer
                      ${isSelected ? "bg-black/5 text-black font-medium" : "text-black/60 hover:bg-black/[0.03]"}
                    `}
                  >
                    <span className="capitalize">{opt.label}</span>
                    {isSelected && (
                      <svg
                        className="w-4 h-4 text-black shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────────────────── */

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCreators, setSelectedCreators] = useState<string[]>([]);

  // Extract unique individual tags from all projects
  const allTags = useMemo(() => {
    const tagSet = new Set(projects.flatMap((p) => p.tags));
    return [...tagSet]
      .sort()
      .map((t) => ({ value: t, label: t.replace(/-/g, " ") }));
  }, []);

  // Extract unique creators that appear in projects
  const projectCreators = useMemo(() => {
    const ids = new Set(projects.flatMap((p) => p.participantIds));
    return participants
      .filter((p) => ids.has(p.id))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((p) => ({ value: p.id, label: p.name }));
  }, []);

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function toggleCreator(id: string) {
    setSelectedCreators((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  const filteredProjects = projects.filter((p) => {
    if (activeCategory && p.category !== activeCategory.toLowerCase())
      return false;
    if (
      selectedTags.length > 0 &&
      !selectedTags.some((t) => p.tags.includes(t))
    )
      return false;
    if (
      selectedCreators.length > 0 &&
      !selectedCreators.some((c) => p.participantIds.includes(c))
    )
      return false;
    return true;
  });

  const hasFilters =
    activeCategory || selectedTags.length > 0 || selectedCreators.length > 0;

  function clearAll() {
    setActiveCategory(null);
    setSelectedTags([]);
    setSelectedCreators([]);
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-[56px]">
        <div className="mx-auto max-w-[1600px] px-[30px] pt-24 lg:px-[60px] lg:pt-32 xl:px-[120px]">
          <p className="text-[13px] font-bold opacity-50 mb-4 uppercase">
            Portfolio
          </p>
          <h1 className="text-[48px] lg:text-[72px] font-bold leading-[0.92] uppercase mb-10">
            Nuestros
            <br />
            proyectos
          </h1>

          {/* Filters row */}
          <div className="flex flex-wrap items-center gap-[9px] mb-8">
            {/* Category pills */}
            {categoryFilters.map((filter) => (
              <button
                key={filter}
                onClick={() =>
                  setActiveCategory(
                    activeCategory === filter ? null : filter
                  )
                }
                className={`text-[15px] font-normal transition-colors duration-200 cursor-pointer
                  ${activeCategory === filter ? "text-black font-semibold" : "text-black/40 hover:text-black"}
                `}
              >
                {filter}
              </button>
            ))}

            {/* Spacer pushes dropdowns to the right */}
            <div className="flex-1" />

            {/* Tag dropdown */}
            <FilterDropdown
              label="Tematicas"
              options={allTags}
              selected={selectedTags}
              onToggle={toggleTag}
              onClear={() => setSelectedTags([])}
            />

            {/* Creator dropdown */}
            <FilterDropdown
              label="Creadores"
              options={projectCreators}
              selected={selectedCreators}
              onToggle={toggleCreator}
              onClear={() => setSelectedCreators([])}
            />
          </div>

          {/* Results count + clear */}
          <div className="flex items-center gap-4 mb-6">
            <p className="text-[13px] text-black/40">
              {filteredProjects.length}{" "}
              {filteredProjects.length === 1 ? "proyecto" : "proyectos"}
            </p>
            {hasFilters && (
              <button
                onClick={clearAll}
                className="text-[13px] text-black/40 underline hover:text-black transition-colors cursor-pointer"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>

        {/* Grid */}
        <div className="mx-auto max-w-[1600px] px-[30px] pb-24 lg:px-[60px] lg:pb-32 xl:px-[120px]">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {filteredProjects.map((project) => {
              const ppl = getParticipantsByIds(project.participantIds);
              return (
                <Link
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  className="group block"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/5] rounded-xl overflow-hidden mb-3">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-105"
                      style={{
                        backgroundImage: `url(${project.bgImage})`,
                        backgroundColor: project.bgColor || "#333",
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

                    {project.status === "inactive" && (
                      <div className="absolute top-3 right-3 z-10">
                        <span className="text-white/60 text-[9px] font-medium uppercase tracking-wide">
                          Inactivo
                        </span>
                      </div>
                    )}

                    <div className="absolute bottom-3 left-3 right-3 z-10">
                      <span className="text-white font-bold text-[14px] leading-tight drop-shadow block">
                        {project.name}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <p className="text-[13px] text-black/65 leading-[1.5] line-clamp-2">
                    {project.description}
                  </p>
                  {ppl.length > 0 && (
                    <p className="text-[12px] text-black/40 mt-2">
                      {ppl.map((p) => p.name).join(", ")}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full bg-black/5 text-black/50 text-[10px] font-medium capitalize"
                      >
                        {tag.replace(/-/g, " ")}
                      </span>
                    ))}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
