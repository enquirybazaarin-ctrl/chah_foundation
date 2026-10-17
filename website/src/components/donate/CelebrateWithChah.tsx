"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Cake, 
  Heart, 
  Sparkles, 
  GraduationCap, 
  Feather, 
  Gift, 
  ArrowRight, 
  Share2, 
  Users, 
  CheckCircle2, 
  Calendar,
  X,
  Copy,
  Check,
  ExternalLink
} from "lucide-react";

export interface OccasionItem {
  id: string;
  type: "Birthday" | "Anniversary" | "Festival" | "Personal milestone" | "In honour or memory" | "Other";
  icon: any;
  label: string;
  tagline: string;
  defaultDedication: string;
}

export const OCCASIONS: OccasionItem[] = [
  {
    id: "birthday",
    type: "Birthday",
    icon: Cake,
    label: "Birthday",
    tagline: "Celebrate another year by gifting nutrition and education to children.",
    defaultDedication: "In celebration of my Birthday",
  },
  {
    id: "anniversary",
    type: "Anniversary",
    icon: Heart,
    label: "Anniversary",
    tagline: "Mark your love and partnership with lasting community impact.",
    defaultDedication: "In celebration of our Anniversary",
  },
  {
    id: "festival",
    type: "Festival",
    icon: Sparkles,
    label: "Festival",
    tagline: "Spread festive cheer, warm meals, and smiles to underserved families.",
    defaultDedication: "Festive Giving",
  },
  {
    id: "milestone",
    type: "Personal milestone",
    icon: GraduationCap,
    label: "Personal Milestone",
    tagline: "Celebrate a new job, graduation, or personal achievement with gratitude.",
    defaultDedication: "In celebration of a Personal Milestone",
  },
  {
    id: "in_honour",
    type: "In honour or memory",
    icon: Feather,
    label: "In Honour or Memory",
    tagline: "Pay tribute to someone special through acts of lasting compassion.",
    defaultDedication: "In loving memory / In honour of",
  },
  {
    id: "other",
    type: "Other",
    icon: Gift,
    label: "Other Moments",
    tagline: "Any moment, big or small, can bring hope to lives in need.",
    defaultDedication: "Special Occasion Giving",
  },
];

interface CelebrateWithChahProps {
  onSelectOccasion?: (occasion: OccasionItem) => void;
}

export function CelebrateWithChah({ onSelectOccasion }: CelebrateWithChahProps) {
  const [selectedOccasion, setSelectedOccasion] = useState<OccasionItem>(OCCASIONS[0]);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);

  // Campaign creation draft state
  const [campaignTitle, setCampaignTitle] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [creatorEmail, setCreatorEmail] = useState("");
  const [targetGoal, setTargetGoal] = useState("10000");
  const [cause, setCause] = useState("Child Nutrition & Healthcare");
  const [dedicationNote, setDedicationNote] = useState("");
  const [createdCampaignUrl, setCreatedCampaignUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Direct Occasion Donation handler: smooth scrolls to form and selects occasion
  const handleDirectOccasionDonate = (occasion: OccasionItem) => {
    setSelectedOccasion(occasion);
    if (onSelectOccasion) {
      onSelectOccasion(occasion);
    }
    const el = document.getElementById("donation-form-card");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // Launch campaign creation modal
  const handleOpenCampaignModal = (occasion: OccasionItem) => {
    setSelectedOccasion(occasion);
    setCampaignTitle(`${creatorName ? creatorName + "'s" : "My"} ${occasion.label} Fundraiser`);
    setIsCampaignModalOpen(true);
  };

  const handleCreateCampaignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!creatorName.trim() || !creatorEmail.trim()) return;

    // Generate clean public slug
    const cleanSlug = (campaignTitle || `${creatorName}-${selectedOccasion.id}`)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 40);

    const generatedLink = `${window.location.origin}/celebrate/${cleanSlug}`;
    setCreatedCampaignUrl(generatedLink);
  };

  const handleCopyLink = () => {
    if (!createdCampaignUrl) return;
    navigator.clipboard.writeText(createdCampaignUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-[#fbfcf8] to-white border-b border-gray-100" id="celebrate-section">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-lime-100 text-lime-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Gift className="w-3.5 h-3.5 text-lime-700" />
            <span>Celebrate With CHAH</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-tight">
            Make Your Special Day Matter
          </h2>

          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed font-normal">
            Celebrate life&apos;s special moments by giving back. Turn your birthday, anniversary or meaningful milestone into an opportunity to support children and communities.
          </p>
        </div>

        {/* Occasion Selection Tabs / Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-12 max-w-6xl mx-auto">
          {OCCASIONS.map((occ) => {
            const Icon = occ.icon;
            const isSelected = selectedOccasion.id === occ.id;

            return (
              <button
                key={occ.id}
                type="button"
                onClick={() => setSelectedOccasion(occ)}
                className={`p-4 rounded-2xl flex flex-col items-center text-center transition-all duration-200 border cursor-pointer select-none ${
                  isSelected
                    ? "bg-[#003399] text-white border-[#003399] shadow-lg scale-102 ring-2 ring-[#003399]/20"
                    : "bg-white text-gray-800 border-gray-200/90 hover:border-[#003399]/40 hover:bg-blue-50/30"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2.5 transition-colors ${
                  isSelected ? "bg-white/15 text-lime-300" : "bg-lime-50 text-lime-700"
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs sm:text-sm font-bold tracking-tight">
                  {occ.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dual Paths Action Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          
          {/* Path 1: Donate Directly for an Occasion */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gray-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between text-left">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#003399] text-xs font-bold uppercase tracking-wider mb-4">
                <Heart className="w-3.5 h-3.5 text-[#003399]" />
                <span>Path 1 · Instant Occasion Gift</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight mb-2">
                Donate in Honor of Your {selectedOccasion.label}
              </h3>

              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                {selectedOccasion.tagline} Make a direct contribution, dedicate it to yourself or a loved one, and receive an instant 80G tax receipt and personalized digital impact card.
              </p>

              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-700 space-y-1.5 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lime-600" />
                  <span>Personal dedication name &amp; message on receipt</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lime-600" />
                  <span>Receive shareable Celebration Impact Card upon payment</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lime-600" />
                  <span>50% tax deduction under Section 80G</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleDirectOccasionDonate(selectedOccasion)}
              className="w-full py-3.5 px-5 rounded-xl bg-[#003399] hover:bg-[#002878] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <span>Donate for {selectedOccasion.label}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Path 2: Create a Fundraising Campaign */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-lime-50/70 via-white to-lime-50/30 border border-lime-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between text-left">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-100 text-lime-800 text-xs font-bold uppercase tracking-wider mb-4">
                <Users className="w-3.5 h-3.5 text-lime-700" />
                <span>Path 2 · Social Impact Campaign</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight mb-2">
                Start a {selectedOccasion.label} Fundraiser
              </h3>

              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Invite friends and family to donate towards meals and education instead of gifts. Share your unique campaign link on WhatsApp and Instagram to amplify your impact.
              </p>

              <div className="p-3.5 rounded-xl bg-white/80 border border-lime-200/60 text-xs text-gray-700 space-y-1.5 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lime-600" />
                  <span>100% free — no donation required to create</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lime-600" />
                  <span>Unique shareable link &amp; real-time goal tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lime-600" />
                  <span>Friends receive instant 80G receipts for contributions</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleOpenCampaignModal(selectedOccasion)}
              className="w-full py-3.5 px-5 rounded-xl bg-lime-500 hover:bg-lime-600 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <span>Create Free {selectedOccasion.label} Campaign</span>
              <Share2 className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* CAMPAIGN CREATION MODAL                                  */}
      {/* ======================================================== */}
      {isCampaignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-5 sm:p-8 relative max-h-[90vh] overflow-y-auto text-left">
            
            <button
              type="button"
              onClick={() => {
                setIsCampaignModalOpen(false);
                setCreatedCampaignUrl(null);
              }}
              className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {!createdCampaignUrl ? (
              <form onSubmit={handleCreateCampaignSubmit} className="space-y-4">
                <div className="flex items-center gap-2 text-lime-700 text-xs font-bold uppercase tracking-wider">
                  <Gift className="w-4 h-4" />
                  <span>Start Your Celebration Campaign</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-[#003399] tracking-tight">
                  Celebrate Your {selectedOccasion.label}
                </h3>

                <p className="text-xs text-gray-500 leading-relaxed">
                  Fill in your details below to launch your personal campaign link. You do not need to make a donation right now.
                </p>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Your Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav Sharma"
                    value={creatorName}
                    onChange={(e) => {
                      setCreatorName(e.target.value);
                      if (!campaignTitle) {
                        setCampaignTitle(`${e.target.value}'s ${selectedOccasion.label} Fundraiser`);
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#003399]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Your Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={creatorEmail}
                    onChange={(e) => setCreatorEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#003399]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Campaign Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={`e.g. My ${selectedOccasion.label} Giving Campaign`}
                    value={campaignTitle}
                    onChange={(e) => setCampaignTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#003399]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Target Goal (₹)
                    </label>
                    <input
                      type="number"
                      min="500"
                      step="500"
                      value={targetGoal}
                      onChange={(e) => setTargetGoal(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#003399]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Supported Cause
                    </label>
                    <select
                      value={cause}
                      onChange={(e) => setCause(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#003399] bg-white"
                    >
                      <option value="Child Nutrition & Healthcare">Child Nutrition</option>
                      <option value="Child Education & Learning">Child Education</option>
                      <option value="Senior Healthcare & Care">Senior Eldercare</option>
                      <option value="General Community Support">Community Relief</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Personal Dedication Note <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="This year, instead of gifts, I would love for you to support children in need..."
                    value={dedicationNote}
                    onChange={(e) => setDedicationNote(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#003399]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-xl bg-[#003399] hover:bg-[#002878] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <span>Launch Campaign &amp; Get Share Link</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-4 space-y-5 animate-fade-in">
                <div className="w-14 h-14 bg-lime-100 text-lime-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <h3 className="text-2xl font-black text-[#003399] tracking-tight">
                  Your Campaign Is Ready!
                </h3>

                <p className="text-sm text-gray-600 max-w-sm mx-auto leading-relaxed">
                  Share your link with family and friends. Every donation brings verified change and issues 80G tax receipts to your supporters.
                </p>

                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between gap-2 text-left">
                  <input
                    type="text"
                    readOnly
                    value={createdCampaignUrl}
                    className="bg-transparent text-xs text-gray-800 w-full focus:outline-none font-mono truncate"
                  />
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="px-3 py-1.5 rounded-lg bg-[#003399] text-white text-xs font-bold shrink-0 flex items-center gap-1 hover:bg-[#002878] transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-lime-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                </div>

                {/* Direct WhatsApp Share button */}
                <div className="pt-2 space-y-2.5">
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`I chose to celebrate my ${selectedOccasion.label} by giving back through CHAH Foundation! Join me in supporting children and families: ${createdCampaignUrl}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share on WhatsApp</span>
                  </a>

                  {createdCampaignUrl && (
                    <Link
                      href={createdCampaignUrl.replace(window.location.origin, "")}
                      className="w-full py-2.5 px-4 rounded-xl bg-white border border-[#003399] text-[#003399] hover:bg-blue-50 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View Your Public Campaign Page</span>
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setIsCampaignModalOpen(false);
                      setCreatedCampaignUrl(null);
                    }}
                    className="w-full py-2.5 text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors"
                  >
                    Done &amp; Close
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </section>
  );
}
