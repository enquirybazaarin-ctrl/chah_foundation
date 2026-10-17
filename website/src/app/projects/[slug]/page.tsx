import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  CheckCircle2,
  Users,
  ShieldCheck,
  HeartHandshake,
} from "lucide-react";
import { getProjectBySlug, getProjects, type ProjectItem } from "@/lib/api";

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return { title: "Project | CHAH Foundation" };
  }

  return {
    title: `${project.title} | Completed Impact Project | CHAH Foundation`,
    description:
      project.short_description ||
      project.impact_summary ||
      `Learn about ${project.title} completed by CHAH Foundation.`,
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;

  let project: ProjectItem | null = await getProjectBySlug(slug);

  // Fallback: search in getProjects list if slug lookup returned null
  if (!project) {
    const allProjects = await getProjects(1, 50).catch(() => []);
    project = allProjects.find((p) => p.slug === slug) || null;
  }

  if (!project) {
    notFound();
  }

  const projectImg =
    project.featured_image_url ||
    "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop";

  return (
    <main className="min-h-screen bg-white pt-28 pb-20">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb / Back Link */}
        <div className="mb-8">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to All Completed Projects</span>
          </Link>
        </div>

        {/* Header Metadata */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-wrap items-center gap-2.5">
            {project.category && (
              <span className="bg-lime-50 border border-lime-200/80 text-lime-800 text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full">
                {project.category}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-lime-600" />
              Verified Completed Project
            </span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#003399] tracking-tight leading-tight">
            {project.title}
          </h1>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-slate-500 pt-1">
            {project.location && (
              <div className="flex items-center gap-1.5 font-medium">
                <MapPin className="w-4 h-4 text-lime-600 shrink-0" />
                <span>{project.location}</span>
              </div>
            )}
            {project.project_date && (
              <div className="flex items-center gap-1.5 font-medium">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <span>
                  {new Date(project.project_date).toLocaleDateString("en-IN", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Verified Impact Callout Banner */}
        {project.impact_summary && (
          <div className="mb-10 bg-lime-50/90 border border-lime-200/80 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-lime-500 text-slate-950 flex items-center justify-center shrink-0 shadow-xs">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-lime-900 uppercase tracking-wider">
                  Verified On-Ground Impact Delivered
                </p>
                <p className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                  {project.impact_summary}
                </p>
              </div>
            </div>
            {project.beneficiary_info && (
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 sm:border-l sm:border-lime-200/80 sm:pl-6 shrink-0">
                <Users className="w-4 h-4 text-lime-600" />
                <span>{project.beneficiary_info}</span>
              </div>
            )}
          </div>
        )}

        {/* Hero Cover Photograph (Editorial 16:9 / 4:3 container) */}
        <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200/80 mb-12">
          <img
            src={projectImg}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Project Overview and Details */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="font-heading text-2xl font-bold text-[#003399] mb-4">
                Project Overview & Execution
              </h2>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4 text-base">
                <p>
                  {project.description ||
                    project.short_description ||
                    "This initiative was directly funded by compassionate donors and executed by the on-ground teams of CHAH Foundation to foster lasting grassroots transformation."}
                </p>
                {project.short_description && project.description && (
                  <p>{project.short_description}</p>
                )}
              </div>
            </div>

            {/* Activities Completed Section (if available) */}
            {project.activities && project.activities.length > 0 && (
              <div className="pt-6 border-t border-slate-100">
                <h3 className="font-heading text-xl font-bold text-[#003399] mb-4">
                  Milestones & Activities Conducted
                </h3>
                <div className="space-y-4">
                  {project.activities.map((act) => (
                    <div
                      key={act.id}
                      className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col gap-1"
                    >
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                        {act.title}
                      </h4>
                      {act.description && (
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {act.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Authentic Project Gallery (if available) */}
            {project.gallery_images && project.gallery_images.length > 0 && (
              <div className="pt-6 border-t border-slate-100">
                <h3 className="font-heading text-xl font-bold text-[#003399] mb-4">
                  Field Photo Documentation
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {project.gallery_images.map((g) => (
                    <div
                      key={g.id}
                      className="aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200"
                    >
                      {g.url && (
                        <img
                          src={g.url}
                          alt={g.alt_text || project.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Project Sidebar Metrics & Support Card */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl border border-slate-200/90 bg-slate-50/60 space-y-5">
              <h3 className="font-heading font-bold text-[#003399] text-lg">
                Project Key Facts
              </h3>

              <div className="space-y-4 text-sm divide-y divide-slate-200/70">
                <div className="pt-2 flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Domain</span>
                  <span className="font-bold text-slate-900">{project.category || "General"}</span>
                </div>

                <div className="pt-3 flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Location</span>
                  <span className="font-bold text-slate-900 text-right">{project.location || "India"}</span>
                </div>

                <div className="pt-3 flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Status</span>
                  <span className="inline-flex items-center gap-1 font-bold text-lime-800 text-xs bg-lime-100 px-2.5 py-0.5 rounded-full">
                    Completed
                  </span>
                </div>

                {project.beneficiary_info && (
                  <div className="pt-3 flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Beneficiaries</span>
                    <span className="font-bold text-slate-900 text-right">{project.beneficiary_info}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Support Further Initiatives Card */}
            <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md">
              <div className="w-10 h-10 rounded-xl bg-lime-500 text-slate-950 flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h4 className="font-heading text-lg font-bold">
                Fuel More Transformations
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your contribution empowers CHAH Foundation to scale education drives, hunger relief, and elderly shelter across more communities.
              </p>
              <Link
                href="/donate"
                className="block text-center w-full py-3 px-4 rounded-xl bg-lime-500 text-slate-950 font-bold text-sm hover:bg-lime-400 transition-colors shadow-sm cursor-pointer"
              >
                Donate to Active Causes
              </Link>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
