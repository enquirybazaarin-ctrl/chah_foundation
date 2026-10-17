"use client";

import { useState, useRef, FormEvent, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Building2,
  GraduationCap,
  HeartPulse,
  Users,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Apple,
  Sparkles,
  ShieldCheck,
  FileText,
  HeartHandshake,
  Loader2,
  Send,
  AlertCircle,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";
import { cn } from "cn";
import { submitPartnershipEnquiry } from "@/lib/api";

const PARTNERSHIP_TYPES = [
  "Corporate / CSR",
  "School / Educational Institution",
  "Healthcare Organisation",
  "NGO / Community Organisation",
  "Individual Volunteer",
  "Other",
] as const;

const AREAS_OF_INTEREST = [
  "Education & Child Welfare",
  "Healthcare",
  "Nutrition & Hunger Relief",
  "Women Empowerment",
  "Elder Care",
  "Volunteering",
  "Other",
] as const;

function PartnerPageContent() {
  const searchParams = useSearchParams();
  const formRef = useRef<HTMLDivElement>(null);
  const opportunitiesRef = useRef<HTMLDivElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    organisation: "",
    email: "",
    phone: "",
    partnershipType: "Corporate / CSR",
    areaOfInterest: "Education & Child Welfare",
    message: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Read URL query parameter if present, e.g. ?type=csr
  useEffect(() => {
    const typeParam = searchParams.get("type");
    if (typeParam === "csr") setFormData((prev) => ({ ...prev, partnershipType: "Corporate / CSR" }));
    if (typeParam === "education") setFormData((prev) => ({ ...prev, partnershipType: "School / Educational Institution" }));
    if (typeParam === "healthcare") setFormData((prev) => ({ ...prev, partnershipType: "Healthcare Organisation" }));
    if (typeParam === "volunteer") setFormData((prev) => ({ ...prev, partnershipType: "Individual Volunteer" }));
  }, [searchParams]);

  // Smooth scroll helper
  const scrollToTarget = (targetRef: React.RefObject<HTMLDivElement | null>) => {
    if (!targetRef.current) return;
    targetRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSelectOpportunity = (type: string) => {
    setFormData((prev) => ({ ...prev, partnershipType: type }));
    scrollToTarget(formRef);
  };

  // Field validation
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Full name is required";
    if (!formData.organisation.trim()) errors.organisation = "Organisation or affiliation is required";
    if (!formData.email.trim()) {
      errors.email = "Work email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = "Please enter a valid work email address";
    }
    if (!formData.message.trim()) errors.message = "Please provide details on how you wish to collaborate";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await submitPartnershipEnquiry({
        name: formData.name.trim(),
        organisation: formData.organisation.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        partnershipType: formData.partnershipType,
        areaOfInterest: formData.areaOfInterest,
        message: formData.message.trim(),
      });

      setSubmitSuccess(true);
      setFormData({
        name: "",
        organisation: "",
        email: "",
        phone: "",
        partnershipType: "Corporate / CSR",
        areaOfInterest: "Education & Child Welfare",
        message: "",
      });
      setFormErrors({});
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Submission failed. Please try again.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white pt-28 pb-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb / Back Link */}
        <div className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* ========================================================= */}
        {/* 1. HERO SECTION                                           */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center mb-24">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-lime-50 border border-lime-200/80 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-lime-500 animate-pulse" />
              <span className="text-[11px] font-bold tracking-[0.14em] text-lime-800 uppercase">
                PARTNER WITH CHAH FOUNDATION
              </span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#003399] tracking-tight leading-[1.15]">
              Together, We Can Create <span className="text-[#95c718]">Lasting Change.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              Your expertise, resources and commitment can help us build a healthier, better-educated and more hopeful future for communities in need.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => scrollToTarget(formRef)}
                className="px-7 py-3.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold text-sm transition-all shadow-sm hover:shadow-md cursor-pointer flex items-center gap-2"
              >
                <span>Become a Partner</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => scrollToTarget(opportunitiesRef)}
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100/80 border border-slate-300 text-slate-800 font-semibold text-sm transition-all shadow-xs cursor-pointer"
              >
                Explore Opportunities
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-slate-200/90 bg-white">
              <img
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1200&auto=format&fit=crop"
                alt="CHAH Foundation community volunteers and partners working together"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-3.5 border border-white/60 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">Direct Grassroots Collaboration</p>
                  <p className="text-[11px] text-slate-500">Impacting communities across 6 Indian states</p>
                </div>
                <span className="text-[11px] font-bold text-lime-700 bg-lime-50 border border-lime-200 px-2.5 py-1 rounded-full">
                  Verified NGO
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* 2. PARTNERSHIP OPPORTUNITIES                              */}
        {/* ========================================================= */}
        <div ref={opportunitiesRef} id="opportunities" className="scroll-mt-28 mb-24">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-lime-700 uppercase tracking-wider">
              Collaboration Tracks
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#003399] tracking-tight mt-1">
              Choose How You Want to Make a Difference
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
              Every partnership brings unique strengths. Find a meaningful way to contribute to our mission.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: Corporate & CSR Partners */}
            <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs hover:shadow-lg hover:border-lime-400 transition-all duration-300">
              <div>
                <div className="w-12 h-12 rounded-xl bg-lime-50 border border-lime-200/80 text-lime-700 flex items-center justify-center mb-5">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-lg font-bold text-[#003399] mb-2">
                  Corporate & CSR Partners
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Collaborate on CSR initiatives, employee volunteering, community development, and social impact programmes.
                </p>
              </div>
              <button
                onClick={() => handleSelectOpportunity("Corporate / CSR")}
                className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 hover:border-lime-500 hover:bg-lime-50/60 text-slate-900 hover:text-lime-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer group"
              >
                <span>Explore CSR Partnerships</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Card 2: Education Partners */}
            <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs hover:shadow-lg hover:border-lime-400 transition-all duration-300">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200/80 text-blue-700 flex items-center justify-center mb-5">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-lg font-bold text-[#003399] mb-2">
                  Education Partners
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Support learning resources, educational opportunities, school initiatives, and child development.
                </p>
              </div>
              <button
                onClick={() => handleSelectOpportunity("School / Educational Institution")}
                className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 hover:border-lime-500 hover:bg-lime-50/60 text-slate-900 hover:text-lime-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer group"
              >
                <span>Partner for Education</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Card 3: Healthcare Partners */}
            <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs hover:shadow-lg hover:border-lime-400 transition-all duration-300">
              <div>
                <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-700 flex items-center justify-center mb-5">
                  <HeartPulse className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-lg font-bold text-[#003399] mb-2">
                  Healthcare Partners
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Collaborate on medical camps, health awareness programmes, preventive care, and community wellbeing.
                </p>
              </div>
              <button
                onClick={() => handleSelectOpportunity("Healthcare Organisation")}
                className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 hover:border-lime-500 hover:bg-lime-50/60 text-slate-900 hover:text-lime-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer group"
              >
                <span>Partner for Healthcare</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Card 4: Volunteers & Community Partners */}
            <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs hover:shadow-lg hover:border-lime-400 transition-all duration-300">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-700 flex items-center justify-center mb-5">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-lg font-bold text-[#003399] mb-2">
                  Volunteers & Community
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Contribute your time, professional skills, resources, or local community connections.
                </p>
              </div>
              <button
                onClick={() => handleSelectOpportunity("Individual Volunteer")}
                className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 hover:border-lime-500 hover:bg-lime-50/60 text-slate-900 hover:text-lime-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer group"
              >
                <span>Get Involved</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. IMPACT AREAS                                           */}
        {/* ========================================================= */}
        <div className="mb-24 bg-slate-50/70 rounded-3xl border border-slate-200/80 p-8 sm:p-10 shadow-xs">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-bold text-lime-700 uppercase tracking-wider">
              Strategic Domains
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#003399] tracking-tight mt-1">
              Where Your Partnership Drives Tangible Change
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Align your resources directly with CHAH Foundation’s active, verified core domains.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            
            <div className="p-5 rounded-2xl bg-white border border-slate-200/70 space-y-2.5 shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-[#003399] text-sm">Child Education</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Rural learning centers, solar computer labs, and digital kits for underprivileged students.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/70 space-y-2.5 shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                <HeartPulse className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-[#003399] text-sm">Healthcare</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mobile clinical camps, cataract surgeries, diagnostics, and essential medicine drives.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/70 space-y-2.5 shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Apple className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-[#003399] text-sm">Hunger Relief</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mission Annapurna hot meals and monthly dry ration kits for impoverished families.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/70 space-y-2.5 shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-[#003399] text-sm">Women Empowerment</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Vocational tailoring centers and livelihood skill sets fostering self-reliance.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/70 space-y-2.5 shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-[#003399] text-sm">Elder Care</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dignified shelter, compassionate care, and winter warmth for destitute seniors.
              </p>
            </div>

          </div>
        </div>

        {/* ========================================================= */}
        {/* 4. TRUST & CREDIBILITY STRIP                              */}
        {/* ========================================================= */}
        <div className="mb-24 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-lime-100 text-lime-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[#003399] text-sm">80G Tax Exemption</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Donations and CSR partnerships are eligible for tax deductions under the Income Tax Act.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[#003399] text-sm">Complete Financial Audit</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Detailed utilization certificates and photographic ground reports provided for every rupee.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-[#003399] text-sm">Verified Project Outcomes</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Explore our track record of ground deployments across Indian districts.
              </p>
              <Link
                href="/#projects"
                className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-blue-900 hover:text-lime-700 transition-colors"
              >
                <span>View Completed Projects</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 5. PARTNERSHIP ENQUIRY FORM                               */}
        {/* ========================================================= */}
        <div
          ref={formRef}
          id="enquiry"
          className="scroll-mt-28 rounded-3xl bg-slate-50/60 border border-slate-200/90 p-4 sm:p-8 md:p-12 shadow-sm max-w-4xl mx-auto"
        >
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold text-lime-700 uppercase tracking-wider">
              Enquiry Portal
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#003399] tracking-tight mt-1">
              Let&apos;s Build Something Meaningful Together.
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-slate-600 leading-relaxed">
              Tell us about your organisation and how you would like to collaborate with CHAH Foundation.
            </p>
          </div>

          {/* Success Screen */}
          {submitSuccess ? (
            <div className="p-8 rounded-2xl bg-lime-50 border border-lime-200 text-center space-y-4 animate-in fade-in zoom-in-95">
              <div className="w-14 h-14 rounded-full bg-lime-500 text-slate-950 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="font-heading text-xl font-bold text-[#003399]">
                Thank You for Reaching Out!
              </h3>
              <p className="text-sm text-slate-700 max-w-md mx-auto leading-relaxed">
                Your partnership enquiry has been submitted directly to the CHAH Foundation leadership team. We will review your proposal and get in touch shortly.
              </p>
              <button
                onClick={() => setSubmitSuccess(false)}
                className="mt-2 px-6 py-2.5 rounded-xl bg-lime-500 text-slate-950 font-bold text-xs hover:bg-lime-400 transition-colors cursor-pointer"
              >
                Submit Another Enquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              
              {/* Submission Error Banner */}
              {submitError && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
                  <div>
                    <p className="font-bold">Submission Notice</p>
                    <p className="text-xs mt-0.5">{submitError}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Full Name */}
                <div>
                  <label htmlFor="partner-name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="partner-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ramesh Sharma"
                    className={cn(
                      "w-full px-4 py-3 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:outline-none focus:ring-2",
                      formErrors.name
                        ? "border-rose-300 focus:ring-rose-400/40 bg-rose-50/20"
                        : "border-slate-200 focus:border-lime-500 focus:ring-lime-500/30 bg-white"
                    )}
                  />
                  {formErrors.name && (
                    <p className="text-xs text-rose-600 mt-1.5 font-medium">{formErrors.name}</p>
                  )}
                </div>

                {/* Organisation Name */}
                <div>
                  <label htmlFor="partner-org" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Organisation Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="partner-org"
                    type="text"
                    value={formData.organisation}
                    onChange={(e) => setFormData({ ...formData, organisation: e.target.value })}
                    placeholder="e.g. TechCorp India / Green Valley School"
                    className={cn(
                      "w-full px-4 py-3 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:outline-none focus:ring-2",
                      formErrors.organisation
                        ? "border-rose-300 focus:ring-rose-400/40 bg-rose-50/20"
                        : "border-slate-200 focus:border-lime-500 focus:ring-lime-500/30 bg-white"
                    )}
                  />
                  {formErrors.organisation && (
                    <p className="text-xs text-rose-600 mt-1.5 font-medium">{formErrors.organisation}</p>
                  )}
                </div>

                {/* Work Email */}
                <div>
                  <label htmlFor="partner-email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Work Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="partner-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@company.org"
                    className={cn(
                      "w-full px-4 py-3 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:outline-none focus:ring-2",
                      formErrors.email
                        ? "border-rose-300 focus:ring-rose-400/40 bg-rose-50/20"
                        : "border-slate-200 focus:border-lime-500 focus:ring-lime-500/30 bg-white"
                    )}
                  />
                  {formErrors.email && (
                    <p className="text-xs text-rose-600 mt-1.5 font-medium">{formErrors.email}</p>
                  )}
                </div>

                {/* Phone Number (Optional) */}
                <div>
                  <label htmlFor="partner-phone" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Phone Number <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    id="partner-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-lime-500 focus:ring-2 focus:ring-lime-500/30 text-sm text-slate-900 placeholder:text-slate-400 bg-white focus:outline-none transition-all"
                  />
                </div>

                {/* Partnership Type */}
                <div>
                  <label htmlFor="partner-type" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Partnership Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="partner-type"
                    value={formData.partnershipType}
                    onChange={(e) => setFormData({ ...formData, partnershipType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-lime-500 focus:ring-2 focus:ring-lime-500/30 text-sm text-slate-900 bg-white focus:outline-none transition-all cursor-pointer"
                  >
                    {PARTNERSHIP_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Area of Interest */}
                <div>
                  <label htmlFor="partner-area" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Area of Interest <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="partner-area"
                    value={formData.areaOfInterest}
                    onChange={(e) => setFormData({ ...formData, areaOfInterest: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-lime-500 focus:ring-2 focus:ring-lime-500/30 text-sm text-slate-900 bg-white focus:outline-none transition-all cursor-pointer"
                  >
                    {AREAS_OF_INTEREST.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Message */}
              <div>
                <label htmlFor="partner-message" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Collaboration Proposal / Message <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="partner-message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share a brief overview of your proposed partnership, goals, or questions..."
                  className={cn(
                    "w-full px-4 py-3 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:outline-none focus:ring-2 resize-none",
                    formErrors.message
                      ? "border-rose-300 focus:ring-rose-400/40 bg-rose-50/20"
                      : "border-slate-200 focus:border-lime-500 focus:ring-lime-500/30 bg-white"
                  )}
                />
                {formErrors.message && (
                  <p className="text-xs text-rose-600 mt-1.5 font-medium">{formErrors.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-xl bg-lime-500 hover:bg-lime-400 disabled:opacity-60 disabled:cursor-not-allowed text-slate-950 font-bold text-sm sm:text-base transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Submitting Enquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Partnership Enquiry</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-center text-xs text-slate-400 pt-1">
                Your contact details are encrypted and will only be used to respond to this partnership enquiry.
              </p>

            </form>
          )}

        </div>

      </div>
    </main>
  );
}

export default function PartnerWithUsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white pt-32 text-center text-slate-500">Loading partnership portal...</div>}>
      <PartnerPageContent />
    </Suspense>
  );
}
