import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

export interface Campaign {
  id: string;
  title: string;
  slug: string;
  content?: string | null;
  description?: string | null;
  target_amount: string | null;
  raised_amount: string;
  status: string;
  featured_image_id: string | null;
}

interface CampaignSectionProps {
  title: string;
  subtitle: string;
  campaigns: Campaign[];
  theme?: "light" | "muted";
}

export function CampaignSection({ title, subtitle, campaigns, theme = "light" }: CampaignSectionProps) {
  if (!campaigns || campaigns.length === 0) return null;

  return (
    <section className={cn("py-20 md:py-24", theme === "muted" ? "bg-[#fafafa]" : "bg-white")}>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <span className="text-[#53b34b] font-bold text-[13px] tracking-[0.15em] uppercase mb-3 block">{title}</span>
            <h2 className="font-heading text-[32px] md:text-[40px] font-bold text-[#0033A0] leading-tight">
              {subtitle}
            </h2>
          </div>
          <Link href="/campaigns" className={cn(buttonVariants({ variant: "ghost" }), "hidden md:flex text-[#53b34b] hover:text-[#43a047] hover:bg-[#53b34b]/10")}>
            View All Campaigns
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {campaigns.slice(0, 3).map((campaign, i) => {
            const raised = parseFloat(campaign.raised_amount) || 0;
            const target = campaign.target_amount ? parseFloat(campaign.target_amount) : 0;
            const progress = target > 0 ? Math.min(Math.round((raised / target) * 100), 100) : 0;
            
            // Randomize images slightly for the demo
            const imgId = 1488521787991 + i * 1000;
            const imgUrl = `https://images.unsplash.com/photo-${imgId}-ed7bbaae773c?q=80&w=800&auto=format&fit=crop`;

            return (
              <div key={campaign.id} className="group rounded-3xl border border-gray-100 bg-white overflow-hidden hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 flex flex-col">
                <div className="h-56 w-full bg-muted relative overflow-hidden">
                  <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url('${imgUrl}')` }} />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors z-10" />
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="font-heading text-xl font-bold text-[#1A1A1A] mb-3 group-hover:text-[#0033A0] transition-colors line-clamp-2 leading-tight">
                    {campaign.title}
                  </h3>
                  
                  {/* Progress Bar */}
                  <div className="mt-auto pt-4 mb-8">
                    <div className="flex justify-between text-sm font-bold mb-3">
                      <span className="text-gray-500">Raised: ₹{raised.toLocaleString()}</span>
                      <span className="text-[#53b34b]">{progress}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#53b34b] rounded-full relative" style={{ width: `${progress}%` }}>
                        <div className="absolute inset-0 bg-white/20 w-full" />
                      </div>
                    </div>
                  </div>

                  <Link href={`/donate?campaign=${campaign.id}`} className="flex items-center justify-center bg-[#53b34b] text-white font-bold text-[15px] px-8 py-3.5 rounded-xl hover:bg-[#4a9f43] transition-colors shadow-[0_8px_20px_rgba(83,179,75,0.25)] hover:shadow-[0_12px_25px_rgba(83,179,75,0.35)] w-full">
                    Donate Now
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-10 text-center md:hidden">
          <Link href="/campaigns" className="inline-flex items-center justify-center bg-white border-2 border-[#53b34b] text-[#53b34b] font-bold px-8 py-3.5 rounded-xl w-full">
            View All Campaigns
          </Link>
        </div>
      </div>
    </section>
  );
}
