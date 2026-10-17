import { Metadata } from "next";
import { CelebrateWithChah } from "@/components/donate/CelebrateWithChah";
import { DonationForm } from "@/components/donate/DonationForm";
import { ImpactCardGenerator } from "@/components/donate/ImpactCardGenerator";
import { getCampaigns } from "@/lib/api";
import { Gift, HeartHandshake, ShieldCheck, FileText, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Celebrate With CHAH — Make Your Special Day Matter | CHAH Foundation",
  description: "Turn your birthday, anniversary, or milestone into an opportunity to support children and communities across India. Receive a personalized digital impact card and 80G tax receipt.",
};

export default async function CelebratePage() {
  const campaignsList = await getCampaigns(1, 10).catch(() => []);

  return (
    <div className="min-h-screen bg-[#fafaf9] text-gray-900 selection:bg-lime-200">
      
      {/* Hero Banner */}
      <section className="relative py-14 sm:py-20 bg-gradient-to-b from-blue-900 via-[#003399] to-[#00246a] text-white overflow-hidden text-center">
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="container relative z-10 mx-auto max-w-4xl px-4 sm:px-6">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-lime-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Gift className="w-3.5 h-3.5" />
            <span>Occasion Giving Platform</span>
          </span>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Celebrate With <span className="text-[#95c718]">CHAH</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed font-normal">
            Turn your birthday, anniversary, or meaningful milestone into an opportunity to bring nourishment, education, and health to children and families across India.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-6 text-xs sm:text-sm text-blue-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-lime-400" />
              <span>Instant 80G Tax Exemption</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-lime-400" />
              <span>Personalized Digital Impact Card</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-lime-400" />
              <span>100% Free Campaign Setup</span>
            </div>
          </div>
        </div>
      </section>

      {/* Occasion Section & Dual Paths */}
      <CelebrateWithChah />

      {/* Interactive Personalized Impact Card Showcase */}
      <section className="py-16 sm:py-24 bg-gray-50 border-b border-gray-100" id="cards-preview-section">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-3.5 py-1 bg-lime-100 text-lime-800 text-xs font-bold uppercase tracking-wider rounded-full mb-3">
              DIGITAL RECOGNITION
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Personalized Impact Cards &amp; Certificates
            </h2>
            <p className="mt-3 text-sm sm:text-base text-gray-600">
              Every verified donation unlocks custom digital recognition cards. Share your story on Instagram Story, WhatsApp Status, and LinkedIn, or print your official Gratitude Certificate.
            </p>
          </div>

          <ImpactCardGenerator
            donorName="Aarav Sharma"
            amount={2000}
            occasion="Birthday"
            dedicationName="In honor of loved ones"
            causeTitle="Child Nutrition & Education"
          />
        </div>
      </section>

      {/* Direct Donation Widget Anchor */}
      <section className="py-16 sm:py-24 bg-white border-b border-gray-100" id="donate-form-section">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#003399]">Direct Giving</span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-1">
              Make Your Occasion Donation
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Select your amount and dedicate your contribution. You will receive an official Section 80G tax certificate via email.
            </p>
          </div>

          <div className="max-w-xl mx-auto">
            <DonationForm campaignsList={campaignsList} initialOccasion="Birthday" />
          </div>
        </div>
      </section>

      {/* Trust & Transparency */}
      <section className="py-16 bg-[#f7f7f5]">
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-2xl border border-gray-200/80 shadow-xs">
              <ShieldCheck className="w-8 h-8 text-[#003399] mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 text-sm">Verified Governance</h3>
              <p className="text-xs text-gray-500 mt-1">Registered charitable trust adhering to complete regulatory standards and annual audits.</p>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-gray-200/80 shadow-xs">
              <FileText className="w-8 h-8 text-lime-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 text-sm">Instant 80G Receipt</h3>
              <p className="text-xs text-gray-500 mt-1">All online donations qualify for 50% tax deductions under Indian Income Tax Act Sec 80G.</p>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-gray-200/80 shadow-xs">
              <HeartHandshake className="w-8 h-8 text-[#003399] mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 text-sm">Grassroots Impact</h3>
              <p className="text-xs text-gray-500 mt-1">Every rupee is directly allocated towards verified education, nutrition, and healthcare programs.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
