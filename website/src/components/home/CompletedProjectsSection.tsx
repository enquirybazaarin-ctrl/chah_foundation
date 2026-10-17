"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { MapPin, CheckCircle2, ArrowRight, FolderOpen, Check, ChevronDown } from "lucide-react";
import { cn } from "cn";
import type { ProjectItem } from "@/lib/api";

interface CompletedProjectsSectionProps {
  projects: ProjectItem[];
}

// Ordered standard categories requested by the client
const ORDERED_CATEGORIES = [
  "Women Empowerment",
  "Elder Care",
  "Hunger Relief",
  "Healthcare",
  "Child Education",
];

// Fallback images strictly mapped by category so no two categories or projects share a generic placeholder
const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  "women empowerment": "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop",
  "elder care": "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=800&auto=format&fit=crop",
  "hunger relief": "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop",
  "healthcare": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop",
  "child education": "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop",
};

export function CompletedProjectsSection({ projects }: CompletedProjectsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState<number>(6);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Determine available categories while preserving preferred order
  const categories = useMemo(() => {
    const presentCategories = new Set(
      projects
        .map((p) => p.category?.trim())
        .filter((cat): cat is string => Boolean(cat))
    );

    // Order according to prompt first, then append any extras
    const ordered: string[] = [];
    ORDERED_CATEGORIES.forEach((cat) => {
      const match = Array.from(presentCategories).find(
        (c) => c.toLowerCase() === cat.toLowerCase()
      );
      if (match) {
        ordered.push(match);
        presentCategories.delete(match);
      }
    });

    return [...ordered, ...Array.from(presentCategories)];
  }, [projects]);

  // Main 4 categories for mobile + remaining into Other dropdown
  const { mainCategories, otherCategories } = useMemo(() => {
    const main: string[] = [];
    const other: string[] = [];
    const mainTargets = ["women empowerment", "elder care", "hunger relief", "healthcare"];

    categories.forEach((cat) => {
      const isMain = mainTargets.includes(cat.toLowerCase().trim());
      if (isMain) {
        main.push(cat);
      } else {
        other.push(cat);
      }
    });

    return { mainCategories: main, otherCategories: other };
  }, [categories]);

  const isOtherActive = useMemo(() => {
    return otherCategories.some(
      (cat) => cat.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [otherCategories, selectedCategory]);

  // Filter projects based on active pill
  const filteredProjects = useMemo(() => {
    if (selectedCategory === "all") return projects;
    return projects.filter(
      (p) => p.category?.trim().toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [projects, selectedCategory]);

  const displayedProjects = useMemo(() => {
    return filteredProjects.slice(0, visibleCount);
  }, [filteredProjects, visibleCount]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setVisibleCount(6); // Reset to 6 by default
  };

  return (
    <section id="projects" className="py-20 md:py-28 bg-white border-t border-slate-100 relative scroll-mt-20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-14 text-center max-w-3xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-lime-50 border border-lime-200/80 shadow-xs mb-4">
            <span className="w-2 h-2 rounded-full bg-lime-500 animate-pulse" />
            <span className="text-[11px] font-bold tracking-[0.14em] text-lime-800 uppercase">
              OUR IMPACT
            </span>
          </div>

          <h2 className="font-heading text-2xl sm:text-4xl lg:text-[42px] font-bold text-[#003399] tracking-tight leading-tight">
            Projects That Make a <span className="text-[#95c718]">Difference</span>
          </h2>

          <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed max-w-2xl">
            Explore the initiatives completed by CHAH Foundation and the communities we&apos;ve worked to support across India.
          </p>

          {/* Category Filter Tabs */}
          <div className="mt-8 sm:mt-10 grid grid-cols-3 gap-1.5 sm:gap-3 sm:flex sm:flex-wrap sm:justify-center w-full">
            {/* All Projects Pill */}
            <button
              onClick={() => {
                handleCategoryChange("all");
                setDropdownOpen(false);
              }}
              className={cn(
                "w-full h-full min-h-[44px] sm:min-h-0 sm:w-auto px-1.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-sm font-semibold transition-all duration-200 border flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-lime-500/40",
                selectedCategory === "all"
                  ? "bg-lime-500 border-lime-500 text-slate-950 shadow-xs shadow-lime-500/20"
                  : "bg-white border-slate-200/90 text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50/60"
              )}
            >
              <span className="truncate max-w-full text-center sm:text-left">All Projects</span>
              <span
                className={cn(
                  "text-[9px] sm:text-xs px-1.5 sm:px-2 py-0.2 sm:py-0.5 rounded-full font-bold transition-colors shrink-0",
                  selectedCategory === "all"
                    ? "bg-slate-950/15 text-slate-950"
                    : "bg-slate-100 text-slate-500"
                )}
              >
                {projects.length}
              </span>
            </button>

            {/* Main 4 Categories (Visible on both Mobile and Desktop) */}
            {mainCategories.map((cat) => {
              const count = projects.filter(
                (p) => p.category?.trim().toLowerCase() === cat.toLowerCase()
              ).length;
              const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();

              return (
                <button
                  key={cat}
                  onClick={() => {
                    handleCategoryChange(cat);
                    setDropdownOpen(false);
                  }}
                  className={cn(
                    "w-full h-full min-h-[44px] sm:min-h-0 sm:w-auto px-1.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-sm font-semibold transition-all duration-200 border flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-lime-500/40",
                    isActive
                      ? "bg-lime-500 border-lime-500 text-slate-950 shadow-xs shadow-lime-500/20"
                      : "bg-white border-slate-200/90 text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50/60"
                  )}
                >
                  <span className="truncate max-w-full text-center sm:text-left">{cat}</span>
                  <span
                    className={cn(
                      "text-[9px] sm:text-xs px-1.5 sm:px-2 py-0.2 sm:py-0.5 rounded-full font-bold transition-colors shrink-0",
                      isActive
                        ? "bg-slate-950/15 text-slate-950"
                        : "bg-slate-100 text-slate-500"
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}

            {/* Other Categories Dropdown Button (Visible on BOTH Mobile and Desktop) */}
            <div className="relative w-full sm:w-auto h-full" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={cn(
                  "w-full h-full min-h-[44px] sm:min-h-0 sm:w-auto px-2 sm:px-5 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-sm font-semibold transition-all duration-200 border flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-lime-500/40",
                  isOtherActive
                    ? "bg-lime-500 border-lime-500 text-slate-950 shadow-xs shadow-lime-500/20"
                    : dropdownOpen
                    ? "bg-slate-100 border-slate-300 text-slate-900"
                    : "bg-white border-slate-200/90 text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50/60"
                )}
              >
                <span className="truncate max-w-[65px] sm:max-w-none text-center sm:text-left">
                  {isOtherActive ? selectedCategory : "Other Causes"}
                </span>
                {isOtherActive ? (
                  <span className="text-[9px] sm:text-xs px-1.5 sm:px-2 py-0.2 sm:py-0.5 rounded-full font-bold bg-slate-950/15 text-slate-950 shrink-0">
                    {projects.filter(p => p.category?.trim().toLowerCase() === selectedCategory.toLowerCase()).length}
                  </span>
                ) : (
                  <span className="text-[9px] sm:text-xs px-1.5 sm:px-2 py-0.2 sm:py-0.5 rounded-full font-bold bg-slate-100 text-slate-500 shrink-0">
                    {otherCategories.length}
                  </span>
                )}
                <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200 shrink-0", dropdownOpen && "rotate-180")} />
              </button>

              {/* Dropdown Menu Panel (Works on Mobile & Desktop) */}
              {dropdownOpen && (
                <div className="absolute top-full mt-2 right-0 sm:right-0 sm:left-auto w-[280px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-xl border border-slate-200 z-50 p-2 max-h-[360px] overflow-y-auto animate-in fade-in slide-in-from-top-1 text-left">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                    Other Categories ({otherCategories.length})
                  </div>
                  {otherCategories.map((cat) => {
                    const count = projects.filter(
                      (p) => p.category?.trim().toLowerCase() === cat.toLowerCase()
                    ).length;
                    const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();

                    return (
                      <button
                        key={cat}
                        onClick={() => {
                          handleCategoryChange(cat);
                          setDropdownOpen(false);
                        }}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-between transition-colors",
                          isActive
                            ? "bg-lime-50 text-lime-900 font-bold"
                            : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                        )}
                      >
                        <span className="truncate pr-2">{cat}</span>
                        <span
                          className={cn(
                            "text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-bold shrink-0",
                            isActive
                              ? "bg-lime-200 text-lime-900"
                              : "bg-slate-100 text-slate-500"
                          )}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Project Cards: Responsive 3-column Grid (6 cards shown by default) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayedProjects.map((project) => {
            const catKey = (project.category || "").trim().toLowerCase();
            const fallbackImage =
              CATEGORY_FALLBACK_IMAGES[catKey] ||
              "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop";
            const projectImg = project.featured_image_url || fallbackImage;

            const projectUrl = `/projects/${project.slug}`;

            return (
              <article
                key={project.id}
                className="group flex flex-col rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs hover:shadow-xl hover:border-lime-400 transition-all duration-300 hover:-translate-y-1"
              >
                {/* 1. Large High-Quality Project Cover Photograph (4:3 ratio) */}
                <Link
                  href={projectUrl}
                  className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden block"
                  aria-label={`View details for ${project.title}`}
                >
                  <img
                    src={projectImg}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Subtle edge vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-60 pointer-events-none" />

                  {/* 2. Small Category Label over the image */}
                  {project.category && (
                    <div className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-sm text-lime-800 text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full shadow-xs border border-slate-100">
                      {project.category}
                    </div>
                  )}
                </Link>

                {/* Card Editorial Content Body */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    {/* 4. Project Location with subtle location icon */}
                    {project.location && (
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-2">
                        <MapPin className="w-3.5 h-3.5 text-lime-600 shrink-0" />
                        <span>{project.location}</span>
                      </div>
                    )}

                    {/* 3. Project Title with consistent typography */}
                    <h3 className="font-heading text-lg sm:text-[19px] font-bold text-[#003399] group-hover:text-[#95c718] transition-colors line-clamp-2 leading-snug mb-2.5">
                      <Link href={projectUrl} className="hover:underline">
                        {project.title}
                      </Link>
                    </h3>

                    {/* 5. Short, meaningful project description */}
                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 mb-4">
                      {project.short_description ||
                        project.description ||
                        "Ground-level community transformation project directly implemented by CHAH Foundation."}
                    </p>
                  </div>

                  <div>
                    {/* 6. Verified Impact Metric */}
                    {project.impact_summary && (
                      <div className="mb-4 bg-lime-50/80 border border-lime-200/70 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 text-lime-900 text-xs font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-lime-600 shrink-0" />
                        <span className="line-clamp-1">{project.impact_summary}</span>
                      </div>
                    )}

                    {/* 7. Subtle "View Project" link with arrow & status */}
                    <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between">
                      <Link
                        href={projectUrl}
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-[#003399] group-hover:text-[#95c718] transition-colors"
                      >
                        <span>View Project</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Link>

                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        <Check className="w-3 h-3 text-lime-600 stroke-[3]" />
                        Completed
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Load More / Expand Button when filtered projects exceed 6 */}
        {filteredProjects.length > 6 && (
          <div className="mt-12 text-center">
            {visibleCount < filteredProjects.length ? (
              <button
                onClick={() => setVisibleCount(filteredProjects.length)}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 hover:border-lime-500 text-slate-900 text-sm font-bold transition-all shadow-xs cursor-pointer group"
              >
                <span>View More Projects ({filteredProjects.length - visibleCount} more)</span>
                <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-lime-600 transition-colors" />
              </button>
            ) : (
              <button
                onClick={() => setVisibleCount(6)}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-sm font-semibold transition-all cursor-pointer"
              >
                <span>Show Less</span>
              </button>
            )}
          </div>
        )}

        {/* Empty state if no projects in category */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16 bg-slate-50/60 rounded-2xl border border-slate-200 my-8">
            <FolderOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h4 className="text-lg font-bold text-slate-800">No projects found in this category</h4>
            <p className="text-slate-500 text-sm mt-1">Please select another category or show all projects.</p>
            <button
              onClick={() => setSelectedCategory("all")}
              className="mt-4 px-5 py-2 rounded-xl bg-lime-500 text-slate-950 font-bold text-sm hover:bg-lime-400 transition-colors cursor-pointer"
            >
              Show All Projects
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
