import { Metadata } from "next";
import Link from "next/link";
import { InteractiveDonationExperience } from "@/components/donate/InteractiveDonationExperience";
import { DonationFaq } from "@/components/donate/DonationFaq";
import { getCampaigns, getCampaignById, getCampaignBySlug } from "@/lib/api";
import { 
  ShieldCheck, 
  Heart, 
  Award, 
  FileText, 
  TrendingUp,
  Lock, 
  HeartHandshake, 
  Star, 
  Headphones, 
  MessageCircle, 
  CheckCircle2 
} from "lucide-react";

export const metadata: Metadata = {
  title: "Donate Now | CHAH Foundation",
  description: "Make a secure, 100% tax-deductible online donation to CHAH Foundation. Instant 80G certificate, total transparency, and life-changing impact.",
};

interface PageProps {
  searchParams: Promise<{
    campaign?: string;
    campaign_id?: string;
    slug?: string;
  }>;
}

export default async function DonatePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const campaignParam = params.campaign || params.campaign_id;
  
  let initialCampaign: any = null;
  let campaignsList: any[] = [];

  try {
    const list = await getCampaigns(1, 25).catch(() => []);
    campaignsList = Array.isArray(list) ? list : [];
  } catch (err) {
    console.warn("Could not fetch data for donation page", err);
  }

  if (campaignParam) {
    try {
      initialCampaign = await getCampaignById(campaignParam);
    } catch {
      initialCampaign = campaignsList.find(c => String(c.id) === String(campaignParam)) || null;
    }
  } else if (params.slug) {
    try {
      initialCampaign = await getCampaignBySlug(params.slug);
    } catch {
      initialCampaign = campaignsList.find(c => c.slug === params.slug) || null;
    }
  }

  return (
    <div className="min-h-screen bg-[#fafaf9] text-gray-900 selection:bg-lime-200">
      
      {/* ======================================================== */}
      {/* 1. HERO & DONATION EXPERIENCE                            */}
      {/* ======================================================== */}
      <InteractiveDonationExperience
        campaignParam={campaignParam}
        initialCampaign={initialCampaign}
        campaignsList={campaignsList}
      />


      {/* ======================================================== */}
      {/* 3. YOUR TRUST MAKES OUR WORK POSSIBLE                    */}
      {/* ======================================================== */}
      <section className="py-16 sm:py-24 bg-[#f7f7f5] border-b border-gray-200/60">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block px-3.5 py-1 bg-lime-100 text-lime-800 text-xs font-bold uppercase tracking-wider rounded-full mb-3">
              WHY DONATE TO US
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Your Trust Makes Our Work Possible
            </h2>
            <p className="mt-3 text-sm sm:text-base text-gray-600">
              We uphold the highest benchmarks of governance, donor accountability, and tax transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Pillar 1 */}
            <div className="p-6 bg-white rounded-3xl border border-gray-200/80 shadow-sm text-left hover:border-lime-300 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-lime-100 text-lime-700 flex items-center justify-center mb-5">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">
                80G Tax Exemption
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Get tax benefits under Section 80G of Income Tax Act. Instant digital certificate emailed upon donation.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 bg-white rounded-3xl border border-gray-200/80 shadow-sm text-left hover:border-lime-300 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-lime-100 text-lime-700 flex items-center justify-center mb-5">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">
                Transparent Use of Funds
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Regular impact reports and financial disclosures ensure every rupee reaches genuine grassroots beneficiaries.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 bg-white rounded-3xl border border-gray-200/80 shadow-sm text-left hover:border-lime-300 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-lime-100 text-lime-700 flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">
                Secure & Trusted Payments
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Bank-grade security with Razorpay, UPI, credit/debit cards, and 256-bit SSL encrypted transactions.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="p-6 bg-white rounded-3xl border border-gray-200/80 shadow-sm text-left hover:border-lime-300 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-lime-100 text-lime-700 flex items-center justify-center mb-5">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">
                Real Impact
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Your donation directly supports real beneficiaries without middlemen or unmonitored leakages.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* ======================================================== */}
      {/* 4. VOICES OF CHANGE (TESTIMONIALS)                       */}
      {/* ======================================================== */}
      <section className="py-16 sm:py-24 bg-white border-b border-gray-100">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block px-3.5 py-1 bg-lime-100 text-lime-800 text-xs font-bold uppercase tracking-wider rounded-full mb-3">
              VOICES OF CHANGE
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              What Our Donors Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Testimonial 1 */}
            <div className="p-6 bg-[#fafaf9] rounded-3xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 italic leading-relaxed mb-6">
                  &ldquo;It feels good to know that my contribution is actually making a difference. The 80G receipt arrived in my inbox within seconds.&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200/60">
                <div className="w-10 h-10 rounded-full bg-lime-200 text-lime-800 font-bold flex items-center justify-center text-sm">
                  RM
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Rahul Mehta</h4>
                  <p className="text-xs text-gray-500">Regular Donor</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="p-6 bg-[#fafaf9] rounded-3xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 italic leading-relaxed mb-6">
                  &ldquo;Transparent work and regular updates give me confidence to support again. Truly authentic team and selfless dedication.&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200/60">
                <div className="w-10 h-10 rounded-full bg-lime-200 text-lime-800 font-bold flex items-center justify-center text-sm">
                  PS
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Priya Sharma</h4>
                  <p className="text-xs text-gray-500">Monthly Donor</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="p-6 bg-[#fafaf9] rounded-3xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 italic leading-relaxed mb-6">
                  &ldquo;A small donation can really create a big impact when it reaches the right hands. Highly recommend supporting CHAH Foundation.&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200/60">
                <div className="w-10 h-10 rounded-full bg-lime-200 text-lime-800 font-bold flex items-center justify-center text-sm">
                  AV
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Amit Verma</h4>
                  <p className="text-xs text-gray-500">Supporter</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* ======================================================== */}
      {/* 5. FREQUENTLY ASKED QUESTIONS & NEED HELP?               */}
      {/* ======================================================== */}
      <section className="py-16 sm:py-24 bg-[#fafaf9]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            
            {/* LEFT 60%: FAQ Accordion */}
            <div className="lg:col-span-7">
              <span className="inline-block px-3.5 py-1 bg-lime-100 text-lime-800 text-xs font-bold uppercase tracking-wider rounded-full mb-3">
                FAQS
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-6">
                Frequently Asked Questions
              </h2>
              <DonationFaq />
            </div>

            {/* RIGHT 40%: Need Help Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl border border-gray-200/80 p-8 shadow-sm text-center">
                <div className="w-16 h-16 rounded-2xl bg-lime-100 text-lime-700 flex items-center justify-center mx-auto mb-5">
                  <Headphones className="w-8 h-8" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Need Help?
                </h3>

                <p className="text-sm text-gray-600 mb-8 max-w-sm mx-auto leading-relaxed">
                  We are here to help you with your donation, tax certificates, or any queries you may have.
                </p>

                <div className="space-y-3">
                  <Link
                    href="/contact"
                    className="w-full py-3.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-2xl text-sm transition-all flex items-center justify-center gap-2"
                  >
                    <span>Contact Us</span>
                  </Link>

                  <a
                    href="https://wa.me/919004004534"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-2xl text-sm transition-all shadow-md flex items-center justify-center gap-2 group"
                  >
                    <MessageCircle className="w-5 h-5 fill-current" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>

                <div className="mt-6 pt-5 border-t border-gray-100 text-xs text-gray-500">
                  Direct NGO Hotline: <strong className="text-gray-800">+91 90040 04534</strong>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
