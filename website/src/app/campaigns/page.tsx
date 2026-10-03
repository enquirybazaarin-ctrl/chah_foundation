import { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

export const metadata: Metadata = {
  title: "Campaigns | CHAH Foundation",
  description: "Choose the story that stays with you. Don't overthink. Pick the one that moves you and help them today.",
};

const CAMPAIGNS = [
  {
    id: 1,
    title: "She hasn’t eaten properly in days",
    impact: "₹1,000 feeds one child for 30 days",
    category: "Food & Hunger",
    progress: 75,
  },
  {
    id: 2,
    title: "A mother needs medicine for her child",
    impact: "₹2,500 provides a complete medical kit",
    category: "Health",
    progress: 40,
  },
  {
    id: 3,
    title: "He wants to study but has nothing",
    impact: "₹5,000 supports education for one full year",
    category: "Education",
    progress: 60,
  },
  {
    id: 4,
    title: "An elderly couple has no shelter for winter",
    impact: "₹3,500 provides warm clothes and blankets",
    category: "Elderly Care",
    progress: 85,
  },
  {
    id: 5,
    title: "Clean water is a luxury they don't have",
    impact: "₹10,000 installs a community water filter",
    category: "Community",
    progress: 25,
  },
  {
    id: 6,
    title: "Urgent surgery needed for a young girl",
    impact: "Every rupee helps reach the goal of ₹50,000",
    category: "Health",
    progress: 90,
  },
];

export default function CampaignsPage() {
  return (
    <div className="min-h-screen bg-muted/30 pt-16 pb-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
            Choose the story that stays with you
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Don’t overthink. Pick the one that moves you and help them today.
          </p>
        </div>

        {/* Categories (Placeholder filters) */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {["All Needs", "Food & Hunger", "Health", "Education", "Elderly Care"].map((cat) => (
            <button
              key={cat}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                cat === "All Needs" 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "bg-white border border-border text-foreground hover:border-primary/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Campaign Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CAMPAIGNS.map((campaign) => (
            <div key={campaign.id} className="group rounded-2xl border border-border bg-card overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
              
              {/* Image Placeholder */}
              <div className="h-56 w-full bg-muted relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/0 transition-colors z-10" />
                <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-primary">
                  {campaign.category}
                </div>
                {campaign.progress > 80 && (
                  <div className="absolute top-4 right-4 z-20 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                    Urgent
                  </div>
                )}
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-heading text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {campaign.title}
                </h3>
                <p className="text-muted-foreground font-medium text-sm mb-6 flex-1">
                  {campaign.impact}
                </p>
                
                {/* Progress Bar */}
                <div className="space-y-2 mb-6">
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full rounded-full transition-all duration-1000", campaign.progress > 80 ? "bg-secondary" : "bg-primary")} 
                      style={{ width: `${campaign.progress}%` }} 
                    />
                  </div>
                </div>

                <Link href={`/donate?campaign=${campaign.id}`} className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "w-full rounded-xl font-bold shadow-md hover:shadow-lg")}>
                  Support this cause
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
