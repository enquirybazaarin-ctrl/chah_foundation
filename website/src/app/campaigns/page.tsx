import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Users, Heart } from "lucide-react";
import { getCampaigns } from "@/lib/api";

export const metadata: Metadata = {
  title: "Active Campaigns | CHAH Foundation",
  description: "Explore our verified fundraising campaigns supporting children's education, urgent medical assistance, and community welfare.",
};

const DEFAULT_FALLBACK_CAMPAIGNS = [
  {
    id: "1",
    title: "Help Amit continue his education",
    beneficiary_name: "Amit",
    beneficiary_age: 10,
    location: "Sitapur, UP",
    category: { name: "Education" },
    short_description: "Amit needs urgent school fee and kit support so he does not drop out of class 5.",
    target_amount: "8000",
    raised_amount: "3200",
    supporters_count: 12,
    is_urgent: true,
    urgency_label: "5 days left",
    cta_button_text: "Help Amit",
    featured_image_url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Help Veena get her school kit & uniform",
    beneficiary_name: "Veena",
    beneficiary_age: 8,
    location: "Lucknow, UP",
    category: { name: "School Support" },
    short_description: "Help provide Veena with books, bag, and school uniform for her 3rd grade studies.",
    target_amount: "5000",
    raised_amount: "1500",
    supporters_count: 7,
    is_urgent: false,
    cta_button_text: "Help Veena",
    featured_image_url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "Help Bharti continue school after family hardship",
    beneficiary_name: "Bharti",
    beneficiary_age: 12,
    location: "Barabanki, UP",
    category: { name: "Education" },
    short_description: "Provide annual tuition support and books to prevent Bharti from dropping out.",
    target_amount: "10000",
    raised_amount: "4200",
    supporters_count: 19,
    is_urgent: true,
    urgency_label: "Urgent",
    cta_button_text: "Help Bharti",
    featured_image_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "4",
    title: "Clean water & sanitation kit for Aarav's school",
    beneficiary_name: "Aarav",
    beneficiary_age: 9,
    location: "Rae Bareli, UP",
    category: { name: "Community" },
    short_description: "Ensure Aarav and 120 schoolmates have clean drinking water and hygiene facilities.",
    target_amount: "12000",
    raised_amount: "6800",
    supporters_count: 24,
    is_urgent: false,
    cta_button_text: "Help Aarav",
    featured_image_url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800&auto=format&fit=crop",
  },
];

export default async function CampaignsPage() {
  const liveCampaigns = await getCampaigns(1, 30).catch(() => []);
  const campaigns = (liveCampaigns && liveCampaigns.length > 0) ? liveCampaigns : DEFAULT_FALLBACK_CAMPAIGNS;

  return (
    <div className="min-h-screen bg-[#fafbfc] pt-16 pb-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-14 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-[12px] font-bold tracking-[0.14em] text-emerald-800 uppercase">
              ALL CAMPAIGNS
            </span>
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-gray-950 mb-4 tracking-tight">
            Every Contribution Creates Tangible Impact
          </h1>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed">
            Choose a verified campaign to support today. 100% of your donation directly reaches the ground with immediate 80G tax exemption.
          </p>
        </div>

        {/* Campaign Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((campaign: any) => {
            const raised = parseFloat(campaign.raised_amount) || 0;
            const target = campaign.target_amount ? parseFloat(campaign.target_amount) : 0;
            const progress = target > 0 ? Math.min(Math.round((raised / target) * 100), 100) : 0;
            const imgUrl = campaign.featured_image?.url || campaign.featured_image_url || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop";

            return (
              <div
                key={campaign.id}
                className="group flex flex-col rounded-2xl border border-gray-200/90 bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Natural Image */}
                <div className="relative aspect-[4/3] w-full bg-gray-100 overflow-hidden">
                  <img
                    src={imgUrl}
                    alt={campaign.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 z-10">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/95 text-emerald-800 shadow-sm backdrop-blur-sm">
                      {campaign.category?.name || "CAMPAIGN"}
                    </span>
                  </div>
                  {campaign.is_urgent && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-600 text-white shadow-sm">
                        <Clock className="w-3 h-3" />
                        {campaign.urgency_label || "Urgent"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Body: Person -> Story -> Need -> Progress -> Action */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {campaign.beneficiary_name && (
                      <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1.5">
                        {campaign.beneficiary_name}
                        {campaign.beneficiary_age ? `, ${campaign.beneficiary_age} years old` : ""}
                        {campaign.location ? ` • ${campaign.location}` : ""}
                      </p>
                    )}
                    <h2 className="font-heading text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug mb-2">
                      {campaign.title}
                    </h2>
                    <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4">
                      {campaign.short_description || campaign.description || "Support this urgent cause with essential supplies and assistance."}
                    </p>
                  </div>

                  <div>
                    {/* Progress */}
                    <div className="pt-2 mb-4 border-t border-gray-100">
                      <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                        <span className="text-gray-900 font-bold">
                          ₹{raised.toLocaleString("en-IN")}{" "}
                          <span className="text-gray-400 font-normal">
                            / ₹{target.toLocaleString("en-IN")}
                          </span>
                        </span>
                        <span className="text-emerald-700">{progress}%</span>
                      </div>

                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full transition-all duration-700"
                          style={{ width: `${Math.max(progress, 3)}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between mt-2 text-[11px] text-gray-400">
                        <span className="inline-flex items-center gap-1">
                          <Users className="w-3 h-3 text-emerald-600" />
                          <strong className="text-gray-600">{campaign.supporters_count || 5}</strong> supporters
                        </span>
                        <span>Verified Need</span>
                      </div>
                    </div>

                    <Link
                      href={`/donate?campaign=${campaign.id}`}
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 px-4 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors"
                    >
                      <Heart className="w-3.5 h-3.5 fill-white/20" />
                      <span>{campaign.cta_button_text || (campaign.beneficiary_name ? `Help ${campaign.beneficiary_name}` : "Donate Now")}</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
