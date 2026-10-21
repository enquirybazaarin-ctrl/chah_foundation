"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { MapPin, CheckCircle2, ArrowRight, FolderOpen, Check, ChevronDown, X } from "lucide-react";
import { cn } from "cn";
import type { ProjectItem } from "@/lib/api";
import { CELEBRATION_ITEMS } from "@/components/layout/Header";

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
  const [mounted, setMounted] = useState(false);
  const [isCelebrationsExpanded, setIsCelebrationsExpanded] = useState(false);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuCoords, setMenuCoords] = useState<{ top: number; right: number }>({ top: 0, right: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateCoords = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const rightOffset = Math.max(16, window.innerWidth - rect.right);
      setMenuCoords({
        top: rect.bottom + 8,
        right: rightOffset,
      });
    }
  };

  const handleToggleDropdown = () => {
    if (dropdownOpen) {
      setDropdownOpen(false);
    } else {
      updateCoords();
      setDropdownOpen(true);
    }
  };

  useEffect(() => {
    if (!dropdownOpen) return;

    const onScrollOrResize = () => {
      updateCoords();
    };

    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setDropdownOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDropdownOpen(false);
      }
    };

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [dropdownOpen]);

  useEffect(() => {
    if (dropdownOpen && typeof window !== "undefined" && window.innerWidth < 640) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [dropdownOpen]);

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

  // Matching logic for Health Support Drive and Education Support Drive
  const isHealth = (p: ProjectItem) => {
    const cat = (p.category || "").toLowerCase();
    const title = (p.title || "").toLowerCase();
    const slug = (p.slug || "").toLowerCase();
    return cat.includes("health") || title.includes("health") || slug.includes("health");
  };

  const isEducation = (p: ProjectItem) => {
    const cat = (p.category || "").toLowerCase();
    const title = (p.title || "").toLowerCase();
    const slug = (p.slug || "").toLowerCase();
    return cat.includes("educat") || title.includes("educat") || slug.includes("educat");
  };

  const healthCount = useMemo(() => projects.filter(isHealth).length, [projects]);
  const educationCount = useMemo(() => projects.filter(isEducation).length, [projects]);

  // Distinct categories for the "Others" dropdown
  const otherCategories = useMemo(() => {
    const present = new Set<string>();
    projects.forEach((p) => {
      if (!isHealth(p) && !isEducation(p) && p.category?.trim()) {
        present.add(p.category.trim());
      }
    });
    return Array.from(present);
  }, [projects]);

  const othersTotalCount = useMemo(() => {
    return projects.filter((p) => !isHealth(p) && !isEducation(p)).length;
  }, [projects]);

  const isOtherActive = useMemo(() => {
    return (
      selectedCategory === "others" ||
      otherCategories.some(
        (cat) => cat.toLowerCase() === selectedCategory.toLowerCase()
      )
    );
  }, [otherCategories, selectedCategory]);

  // Filter projects based on active pill
  const filteredProjects = useMemo(() => {
    if (selectedCategory === "all") return projects;
    if (selectedCategory === "health") return projects.filter(isHealth);
    if (selectedCategory === "education") return projects.filter(isEducation);
    if (selectedCategory === "others") return projects.filter((p) => !isHealth(p) && !isEducation(p));
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
        </div>

        {/* Category Filter Tabs - Exactly 4 Buttons in 1 Single Row (No Border Cropping) */}
        <div className="mt-8 sm:mt-10 mb-12 sm:mb-14 w-full flex justify-center">
          <div className="flex flex-nowrap items-center justify-start sm:justify-center gap-2 sm:gap-3.5 max-w-full overflow-x-auto sm:overflow-visible hide-scrollbar py-2.5 px-4 sm:px-6">
            {/* 1. All Projects Pill */}
            <button
              type="button"
              onClick={() => {
                handleCategoryChange("all");
                setDropdownOpen(false);
              }}
              className={cn(
                "shrink-0 whitespace-nowrap px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 border flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-lime-500/40",
                selectedCategory === "all"
                  ? "bg-lime-500 border-lime-500 text-slate-950 shadow-xs shadow-lime-500/20 font-bold"
                  : "bg-white border-slate-200/90 text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50/60"
              )}
            >
              <span>All Projects</span>
              <span
                className={cn(
                  "text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-bold transition-colors shrink-0",
                  selectedCategory === "all"
                    ? "bg-slate-950/15 text-slate-950"
                    : "bg-slate-100 text-slate-500"
                )}
              >
                {projects.length}
              </span>
            </button>

            {/* 2. Health Support Drive Pill */}
            <button
              type="button"
              onClick={() => {
                handleCategoryChange("health");
                setDropdownOpen(false);
              }}
              className={cn(
                "shrink-0 whitespace-nowrap px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 border flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-lime-500/40",
                selectedCategory === "health"
                  ? "bg-lime-500 border-lime-500 text-slate-950 shadow-xs shadow-lime-500/20 font-bold"
                  : "bg-white border-slate-200/90 text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50/60"
              )}
            >
              <span>Health Support Drive</span>
              <span
                className={cn(
                  "text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-bold transition-colors shrink-0",
                  selectedCategory === "health"
                    ? "bg-slate-950/15 text-slate-950"
                    : "bg-slate-100 text-slate-500"
                )}
              >
                {healthCount}
              </span>
            </button>

            {/* 3. Education Support Drive Pill */}
            <button
              type="button"
              onClick={() => {
                handleCategoryChange("education");
                setDropdownOpen(false);
              }}
              className={cn(
                "shrink-0 whitespace-nowrap px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 border flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-lime-500/40",
                selectedCategory === "education"
                  ? "bg-lime-500 border-lime-500 text-slate-950 shadow-xs shadow-lime-500/20 font-bold"
                  : "bg-white border-slate-200/90 text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50/60"
              )}
            >
              <span>Education Support Drive</span>
              <span
                className={cn(
                  "text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-bold transition-colors shrink-0",
                  selectedCategory === "education"
                    ? "bg-slate-950/15 text-slate-950"
                    : "bg-slate-100 text-slate-500"
                )}
              >
                {educationCount}
              </span>
            </button>

            {/* 4. Others Dropdown Pill */}
            <div className="relative shrink-0">
              <button
                ref={triggerRef}
                type="button"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
                onClick={handleToggleDropdown}
                className={cn(
                  "shrink-0 whitespace-nowrap px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 border flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-lime-500/40",
                  isOtherActive
                    ? "bg-lime-500 border-lime-500 text-slate-950 shadow-xs shadow-lime-500/20 font-bold"
                    : dropdownOpen
                    ? "bg-slate-100 border-slate-300 text-slate-900"
                    : "bg-white border-slate-200/90 text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50/60"
                )}
              >
                <span className="max-w-[120px] sm:max-w-[150px] truncate">
                  {selectedCategory !== "others" && isOtherActive ? selectedCategory : "Others"}
                </span>
                <span
                  className={cn(
                    "text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-bold shrink-0",
                    isOtherActive
                      ? "bg-slate-950/15 text-slate-950"
                      : "bg-slate-100 text-slate-500"
                  )}
                >
                  {selectedCategory !== "others" && isOtherActive
                    ? projects.filter(
                        (p) => p.category?.trim().toLowerCase() === selectedCategory.toLowerCase()
                      ).length
                    : othersTotalCount}
                </span>
                <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200 shrink-0", dropdownOpen && "rotate-180")} />
              </button>
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

      {/* Portaled Dropdown Menu & Mobile Drawer (Escapes all overflow clipping) */}
      {mounted && dropdownOpen && typeof document !== "undefined" && createPortal(
        <>
          {/* DESKTOP / TABLET FLOATING DROPDOWN (sm and up) */}
          <div
            ref={menuRef}
            style={{
              top: `${menuCoords.top}px`,
              right: `${menuCoords.right}px`,
            }}
            className="hidden sm:block fixed z-[9999] w-[300px] bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-2.5 animate-in fade-in zoom-in-95 duration-150 text-left"
          >
            <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1.5 flex items-center justify-between">
              <span>Other Causes</span>
              <span className="text-[10px] font-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                {otherCategories.length} Categories
              </span>
            </div>

            <div className="max-h-[340px] overflow-y-auto space-y-1 pr-1">
              {/* All Other Causes */}
              <button
                type="button"
                onClick={() => {
                  handleCategoryChange("others");
                  setDropdownOpen(false);
                }}
                className={cn(
                  "w-full text-left px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-between transition-colors cursor-pointer group",
                  selectedCategory === "others"
                    ? "bg-lime-50 text-lime-900 font-bold"
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  {selectedCategory === "others" ? (
                    <Check className="w-3.5 h-3.5 text-lime-600 shrink-0" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-slate-400 shrink-0" />
                  )}
                  <span className="truncate">All Other Causes</span>
                </div>
                <span
                  className={cn(
                    "text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-bold shrink-0",
                    selectedCategory === "others"
                      ? "bg-lime-200 text-lime-900"
                      : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                  )}
                >
                  {othersTotalCount}
                </span>
              </button>

              <div className="border-t border-slate-100 my-1" />

              {otherCategories.map((cat) => {
                const count = projects.filter(
                  (p) => p.category?.trim().toLowerCase() === cat.toLowerCase()
                ).length;
                const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
                const isCelebrationCat = cat.toLowerCase().includes("celebrat") || cat.toLowerCase().includes("occasion");

                if (isCelebrationCat) {
                  return (
                    <div key={cat} className="rounded-xl border border-slate-100 bg-slate-50/60 overflow-hidden my-1">
                      <div className="flex items-center justify-between px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            handleCategoryChange(cat);
                            setDropdownOpen(false);
                          }}
                          className={cn(
                            "flex-1 text-left text-xs sm:text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer",
                            isActive ? "text-lime-900 font-bold" : "text-slate-700 hover:text-slate-900"
                          )}
                        >
                          {isActive ? (
                            <Check className="w-3.5 h-3.5 text-lime-600 shrink-0" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                          )}
                          <span className="truncate">{cat}</span>
                        </button>
                        <div className="flex items-center gap-1.5 shrink-0">
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
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsCelebrationsExpanded(!isCelebrationsExpanded);
                            }}
                            className="p-1 rounded hover:bg-slate-200/80 text-slate-400 hover:text-slate-700 cursor-pointer"
                            aria-label="Toggle Celebrations dropdown"
                          >
                            <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", isCelebrationsExpanded && "rotate-180")} />
                          </button>
                        </div>
                      </div>

                      {isCelebrationsExpanded && (
                        <div className="flex flex-col pl-3 pr-2 py-1.5 space-y-1 bg-lime-50/60 border-t border-slate-100">
                          <div className="px-2 py-0.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                            Festivals ({CELEBRATION_ITEMS.length})
                          </div>
                          {CELEBRATION_ITEMS.map((item) => (
                            <Link
                              key={item.slug}
                              href={item.href}
                              onClick={() => setDropdownOpen(false)}
                              className="px-2.5 py-1.5 text-xs text-slate-700 hover:text-[#003399] font-medium transition-colors flex items-center justify-between rounded-lg hover:bg-white"
                            >
                              <span>{item.title}</span>
                              <span className="text-slate-400 text-[10px]">&rarr;</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      handleCategoryChange(cat);
                      setDropdownOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-between transition-colors cursor-pointer group",
                      isActive
                        ? "bg-lime-50 text-lime-900 font-bold"
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      {isActive ? (
                        <Check className="w-3.5 h-3.5 text-lime-600 shrink-0" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-slate-400 shrink-0" />
                      )}
                      <span className="truncate">{cat}</span>
                    </div>
                    <span
                      className={cn(
                        "text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-bold shrink-0",
                        isActive
                          ? "bg-lime-200 text-lime-900"
                          : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                      )}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}

              {otherCategories.length === 0 && (
                <div className="py-4 text-center text-xs text-slate-400">
                  No additional categories available.
                </div>
              )}
            </div>
          </div>

          {/* MOBILE BOTTOM SHEET DRAWER (< sm) */}
          <div className="sm:hidden fixed inset-0 z-[9999] flex flex-col justify-end">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
              onClick={() => setDropdownOpen(false)}
            />

            {/* Drawer */}
            <div className="relative bg-white rounded-t-3xl shadow-2xl p-5 max-h-[80vh] flex flex-col z-10 animate-in slide-in-from-bottom duration-200">
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4 shrink-0" />

              <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
                <div>
                  <h3 className="font-heading font-bold text-base text-[#003399]">Select Other Cause</h3>
                  <p className="text-xs text-slate-500">Filter initiatives by community focus</p>
                </div>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 active:bg-slate-200 flex items-center justify-center text-slate-500 active:text-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="overflow-y-auto mt-3 space-y-1.5 pb-6">
                {/* All Other Causes */}
                <button
                  type="button"
                  onClick={() => {
                    handleCategoryChange("others");
                    setDropdownOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-3.5 py-3 rounded-xl text-sm font-medium flex items-center justify-between transition-colors",
                    selectedCategory === "others"
                      ? "bg-lime-50 text-lime-900 font-bold border border-lime-300"
                      : "text-slate-700 bg-slate-50 active:bg-slate-100"
                  )}
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    {selectedCategory === "others" && <Check className="w-4 h-4 text-lime-600 shrink-0" />}
                    <span className="truncate">All Other Causes</span>
                  </div>
                  <span
                    className={cn(
                      "text-xs px-2.5 py-0.5 rounded-full font-bold shrink-0",
                      selectedCategory === "others"
                        ? "bg-lime-200 text-lime-900"
                        : "bg-slate-200 text-slate-600"
                    )}
                  >
                    {othersTotalCount}
                  </span>
                </button>

                <div className="border-t border-slate-100 my-2" />

                {otherCategories.map((cat) => {
                  const count = projects.filter(
                    (p) => p.category?.trim().toLowerCase() === cat.toLowerCase()
                  ).length;
                  const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
                  const isCelebrationCat = cat.toLowerCase().includes("celebrat") || cat.toLowerCase().includes("occasion");

                  if (isCelebrationCat) {
                    return (
                      <div key={cat} className="rounded-xl border border-slate-200 bg-slate-50 overflow-hidden my-1">
                        <div className="flex items-center justify-between px-3.5 py-3">
                          <button
                            type="button"
                            onClick={() => {
                              handleCategoryChange(cat);
                              setDropdownOpen(false);
                            }}
                            className={cn(
                              "flex-1 text-left text-sm font-medium flex items-center gap-2",
                              isActive ? "text-lime-900 font-bold" : "text-slate-700"
                            )}
                          >
                            {isActive && <Check className="w-4 h-4 text-lime-600 shrink-0" />}
                            <span className="truncate">{cat}</span>
                          </button>
                          <div className="flex items-center gap-2 shrink-0">
                            <span
                              className={cn(
                                "text-xs px-2.5 py-0.5 rounded-full font-bold shrink-0",
                                isActive
                                  ? "bg-lime-200 text-lime-900"
                                  : "bg-slate-200 text-slate-600"
                              )}
                            >
                              {count}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsCelebrationsExpanded(!isCelebrationsExpanded);
                              }}
                              className="p-1 rounded hover:bg-slate-200 text-slate-500 cursor-pointer"
                              aria-label="Toggle Celebrations dropdown"
                            >
                              <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", isCelebrationsExpanded && "rotate-180")} />
                            </button>
                          </div>
                        </div>

                        {isCelebrationsExpanded && (
                          <div className="flex flex-col pl-3 pr-2 py-2 space-y-1 bg-lime-50/60 border-t border-slate-200">
                            <div className="px-2 py-0.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              Festivals ({CELEBRATION_ITEMS.length})
                            </div>
                            {CELEBRATION_ITEMS.map((item) => (
                              <Link
                                key={item.slug}
                                href={item.href}
                                onClick={() => setDropdownOpen(false)}
                                className="px-2.5 py-2 text-xs text-slate-700 hover:text-[#003399] font-medium transition-colors flex items-center justify-between rounded-lg bg-white border border-slate-100"
                              >
                                <span>{item.title}</span>
                                <span className="text-slate-400 text-xs">&rarr;</span>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        handleCategoryChange(cat);
                        setDropdownOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-3.5 py-3 rounded-xl text-sm font-medium flex items-center justify-between transition-colors",
                        isActive
                          ? "bg-lime-50 text-lime-900 font-bold border border-lime-300"
                          : "text-slate-700 bg-slate-50 active:bg-slate-100"
                      )}
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        {isActive && <Check className="w-4 h-4 text-lime-600 shrink-0" />}
                        <span className="truncate">{cat}</span>
                      </div>
                      <span
                        className={cn(
                          "text-xs px-2.5 py-0.5 rounded-full font-bold shrink-0",
                          isActive
                            ? "bg-lime-200 text-lime-900"
                            : "bg-slate-200 text-slate-600"
                        )}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </section>
  );
}
