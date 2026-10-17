"use client";

import { useState, FormEvent, useEffect } from "react";
import { Smile, X, CheckCircle2, Loader2, HeartHandshake, Sparkles, Send, Phone, Mail, MapPin, User } from "lucide-react";
import { cn } from "cn";
import { submitVolunteerLead } from "@/lib/api";

interface JoinVolunteerBannerProps {
  title?: string;
  description?: string;
  buttonText?: string;
  defaultInterest?: string;
  className?: string;
}

const INTEREST_AREAS = [
  "Child Education & Teaching",
  "Healthcare & Mobile Camps",
  "Elder Care & Companionship",
  "Hunger & Nutrition Relief",
  "Skill Development & Digital Literacy",
  "Winter Survival & Blanket Drives",
  "General Volunteering & Field Ops",
] as const;

export function JoinVolunteerBanner({
  title = "Join Our Volunteer Team",
  description = "Make a real impact in your community by volunteering with CHAH Foundation. Whether you can give your time, skills, or resources, every effort counts in creating a better future for those less fortunate.",
  buttonText = "Join As Volunteer",
  defaultInterest = "Child Education & Teaching",
  className,
}: JoinVolunteerBannerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    areaOfInterest: defaultInterest,
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = "Full name is required";
    if (!formData.email.trim()) {
      errs.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim()) {
      errs.phone = "Phone number is required";
    } else if (!/^[0-9+ -]{10,15}$/.test(formData.phone.trim())) {
      errs.phone = "Please enter a valid 10-digit phone number";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await submitVolunteerLead({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        city: formData.city.trim() || undefined,
        areaOfInterest: formData.areaOfInterest,
        message: formData.message.trim() || undefined,
      });
      setIsSuccess(true);
    } catch (err: any) {
      setServerError(err.message || "Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      city: "",
      areaOfInterest: defaultInterest,
      message: "",
    });
    setErrors({});
    setServerError(null);
    setIsSuccess(false);
    setIsOpen(false);
  };

  return (
    <>
      {/* ─── BANNER CONTAINER (Matching User Design) ────────────────────── */}
      <div
        className={cn(
          "w-full bg-[#e9edf2] border border-slate-200/90 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-9 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all",
          className
        )}
      >
        {/* Left Section: Icon + Heading + Description */}
        <div className="flex items-start gap-4 sm:gap-5 max-w-4xl text-left">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-center shrink-0 mt-0.5">
            <Smile className="w-5 h-5 sm:w-6 sm:h-6 text-[#003399]" strokeWidth={2.2} />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#003399] tracking-tight">
              {title}
            </h3>
            <p className="mt-2 text-xs sm:text-sm md:text-[15px] text-slate-600 leading-relaxed font-normal">
              {description}
            </p>
          </div>
        </div>

        {/* Right Section: Brand Color Action Button */}
        <div className="shrink-0 self-start md:self-center">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="inline-flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-[#95c718] hover:bg-[#85b514] active:bg-[#77a310] text-slate-950 font-black text-sm sm:text-base shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            <span>{buttonText}</span>
          </button>
        </div>
      </div>

      {/* ─── VOLUNTEER LEAD CAPTURE MODAL ─────────────────────────────── */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/65 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 sm:p-7 border-b border-slate-100 bg-[#f8fafc] flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center shrink-0">
                  <Smile className="w-5 h-5 text-[#003399]" />
                </div>
                <div>
                  <h4 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                    Join Our Volunteer Team
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Share your details to volunteer with CHAH Foundation
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors shrink-0"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-7 overflow-y-auto">
              {isSuccess ? (
                /* Success State */
                <div className="py-8 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-lime-100 text-lime-700 mx-auto flex items-center justify-center shadow-xs">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h5 className="text-xl font-bold text-slate-900">
                    Application Received!
                  </h5>
                  <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    Thank you for stepping up, <span className="font-semibold text-slate-900">{formData.name}</span>! Our volunteer coordination team has captured your application and will contact you via email/phone soon.
                  </p>
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-6 py-2.5 rounded-xl bg-[#95c718] hover:bg-[#85b514] text-slate-950 text-sm font-black transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                /* Application Form */
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  {serverError && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
                      {serverError}
                    </div>
                  )}

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Ramesh Sharma"
                        className={cn(
                          "w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all",
                          errors.name
                            ? "border-red-300 focus:ring-red-200"
                            : "border-slate-200 focus:ring-blue-200 focus:border-[#003399]"
                        )}
                      />
                    </div>
                    {errors.name && <p className="text-[11px] text-red-600 mt-1">{errors.name}</p>}
                  </div>

                  {/* Email & Phone Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="name@example.com"
                          className={cn(
                            "w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all",
                            errors.email
                              ? "border-red-300 focus:ring-red-200"
                              : "border-slate-200 focus:ring-blue-200 focus:border-[#003399]"
                          )}
                        />
                      </div>
                      {errors.email && <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Phone className="w-4 h-4" />
                        </div>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="10-digit mobile"
                          className={cn(
                            "w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all",
                            errors.phone
                              ? "border-red-300 focus:ring-red-200"
                              : "border-slate-200 focus:ring-blue-200 focus:border-[#003399]"
                          )}
                        />
                      </div>
                      {errors.phone && <p className="text-[11px] text-red-600 mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  {/* City / State & Area of Interest */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        City / State
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          placeholder="e.g. Mumbai, Delhi"
                          className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-[#003399] transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Preferred Cause
                      </label>
                      <select
                        value={formData.areaOfInterest}
                        onChange={(e) => setFormData({ ...formData, areaOfInterest: e.target.value })}
                        className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-[#003399] transition-all cursor-pointer"
                      >
                        {INTEREST_AREAS.map((area) => (
                          <option key={area} value={area}>
                            {area}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Skills / Availability Message */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Your Skills or Availability (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="e.g. Free on weekends, interested in teaching or photography..."
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-[#003399] transition-all"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 rounded-xl bg-[#95c718] hover:bg-[#85b514] active:bg-[#77a310] text-slate-950 text-xs sm:text-sm font-black shadow-xs flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Application</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
