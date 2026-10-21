import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DonationForm } from "@/components/donate/DonationForm";
import { ImpactCardGenerator } from "@/components/donate/ImpactCardGenerator";
import { 
  Gift, 
  Cake, 
  Heart, 
  Sparkles, 
  GraduationCap, 
  Feather, 
  Users, 
  Share2, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  Copy, 
  ArrowLeft,
  Calendar,
  HeartHandshake
} from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Sample Occasion Campaigns for initial preview
const MOCK_OCCASION_CAMPAIGNS: Record<string, any> = {
  "aarav-10th-birthday": {
    slug: "aarav-10th-birthday",
    title: "Aarav's 10th Birthday — Gifting Meals to Children",
    occasion: "Birthday",
    creator_name: "Aarav Sharma",
    creator_avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
    cover_image_url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop",
    target_amount: 15000,
    raised_amount: 11500,
    supporters_count: 14,
    cause_title: "Child Nutrition & Daily Meals",
    dedication_note: "This year for my 10th birthday, instead of gifts or toys, I want to make sure children in underprivileged communities receive healthy, wholesome meals. Every ₹500 helps feed a child for a week. Thank you for your love and blessings!",
    created_at: "2026-10-01",
    recent_supporters: [
      { name: "Uncle Rajesh & Family", amount: 2000, note: "Happy 10th Birthday Aarav! So proud of your kind heart.", time: "2 hours ago" },
      { name: "Priya & Vikram", amount: 1500, note: "Keep shining bright! Wonderful initiative.", time: "1 day ago" },
      { name: "Meera aunty", amount: 1000, note: "Lots of blessings on your birthday!", time: "2 days ago" },
      { name: "Anonymous Friend", amount: 500, note: "Happy Birthday!", time: "3 days ago" },
    ]
  },
  "priya-vikram-anniversary": {
    slug: "priya-vikram-anniversary",
    title: "Priya & Vikram's 5th Anniversary Giving Circle",
    occasion: "Anniversary",
    creator_name: "Priya & Vikram",
    creator_avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&auto=format&fit=crop",
    cover_image_url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop",
    target_amount: 25000,
    raised_amount: 18500,
    supporters_count: 19,
    cause_title: "Child Education & School Supplies",
    dedication_note: "As we celebrate 5 years of our journey together, we want to share our gratitude by providing school bags, books, and educational kits to girls in rural schools. Join our anniversary giving circle!",
    created_at: "2026-10-05",
    recent_supporters: [
      { name: "Sunita & Arvind", amount: 5000, note: "Happy 5th Anniversary! Beautiful way to celebrate.", time: "Yesterday" },
      { name: "Kunal Mathur", amount: 2500, note: "Congratulations to both of you!", time: "3 days ago" },
    ]
  },
  "rakshabandhan-celebration": {
    slug: "rakshabandhan-celebration",
    title: "Rakshabandhan Celebration — Sibling Love for Shelter Children",
    occasion: "Festival",
    creator_name: "CHAH Youth Collective",
    creator_avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
    cover_image_url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1200&auto=format&fit=crop",
    target_amount: 35000,
    raised_amount: 28400,
    supporters_count: 42,
    cause_title: "Festival Sweets, Rakhi Kits & Nutrition Hampers",
    dedication_note: "Tying sacred Rakhis and distributing wholesome festival meal hampers to 350+ orphaned and vulnerable children who deserve to feel cherished and protected.",
    created_at: "2026-08-15",
    recent_supporters: [
      { name: "Sneha Kapur", amount: 2500, note: "Happy Raksha Bandhan to all beautiful kids!", time: "Today" },
      { name: "Amitabh Verma", amount: 2000, note: "Such a heartwarming initiative.", time: "Yesterday" },
      { name: "Rohit & Megha", amount: 1500, note: "Lots of love from our family.", time: "2 days ago" },
    ]
  },
  "independence-day": {
    slug: "independence-day",
    title: "Independence Day Celebration — Freedom from Hunger & Illiteracy",
    occasion: "Festival",
    creator_name: "CHAH Citizen Ambassadors",
    creator_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
    cover_image_url: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?q=80&w=1200&auto=format&fit=crop",
    target_amount: 50000,
    raised_amount: 41200,
    supporters_count: 68,
    cause_title: "Tricolor Educational Kits & Nutritious Breakfasts",
    dedication_note: "Celebrating India's Independence by equipping slum learning centers with books, national flags, stationery kits, and immunity breakfast packets.",
    created_at: "2026-08-10",
    recent_supporters: [
      { name: "Col. R. S. Bhatia (Retd.)", amount: 5000, note: "Proud to support our nation's children.", time: "1 day ago" },
      { name: "Sumanth Narayanan", amount: 2000, note: "Jai Hind! May education reach every home.", time: "2 days ago" },
    ]
  },
  "republic-day": {
    slug: "republic-day",
    title: "Republic Day Celebration — Empowering Tomorrow's Citizens",
    occasion: "Festival",
    creator_name: "Education First Network",
    creator_avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
    cover_image_url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop",
    target_amount: 40000,
    raised_amount: 32500,
    supporters_count: 38,
    cause_title: "Constitutional Literacy & School Bag Grants",
    dedication_note: "Distributing school bags, uniforms, and learning essentials to children of migrant construction laborers on Republic Day.",
    created_at: "2026-01-20",
    recent_supporters: [
      { name: "Advocate Pooja Rao", amount: 3500, note: "Empowering every child with their right to learn.", time: "3 days ago" },
      { name: "Alok Gupta", amount: 1500, note: "Happy Republic Day!", time: "4 days ago" },
    ]
  },
  "merry-christmas": {
    slug: "merry-christmas",
    title: "Merry Christmas & Joy of Giving — Warmth & Gifts for Destitute Elders",
    occasion: "Festival",
    creator_name: "CHAH Winter Care Circle",
    creator_avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop",
    cover_image_url: "https://images.unsplash.com/photo-1543258103-a62bd961387e?q=80&w=1200&auto=format&fit=crop",
    target_amount: 45000,
    raised_amount: 39000,
    supporters_count: 53,
    cause_title: "Winter Blankets, Plum Cakes & Thermal Woollens",
    dedication_note: "Sharing Christmas joy and warm winter survival kits with homeless elderly and shelter children to protect them against harsh winter winds.",
    created_at: "2026-12-18",
    recent_supporters: [
      { name: "David & Cheryl D'Souza", amount: 5000, note: "Merry Christmas! Joy and peace to everyone.", time: "Recently" },
      { name: "Tanya Sen", amount: 2000, note: "Blessed to be able to help.", time: "Recently" },
    ]
  },
  "eid-celebration": {
    slug: "eid-celebration",
    title: "Eid Celebration — Sharing Festive Meals & Care Hampers",
    occasion: "Festival",
    creator_name: "Unity in Compassion Forum",
    creator_avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=300&auto=format&fit=crop",
    cover_image_url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop",
    target_amount: 40000,
    raised_amount: 34800,
    supporters_count: 47,
    cause_title: "Dry Ration Kits, Sewaiyan & New Festive Clothes",
    dedication_note: "Ensuring no underprivileged family goes without delicious festive meals on Eid by providing grocery ration kits and new clothes to children.",
    created_at: "2026-04-10",
    recent_supporters: [
      { name: "Farhan & Shagufta", amount: 4000, note: "Eid Mubarak! May peace and barakah fill every home.", time: "1 day ago" },
      { name: "Zubair Ahmed", amount: 2500, note: "Happy to support CHAH Foundation.", time: "2 days ago" },
    ]
  },
  "dahi-handi": {
    slug: "dahi-handi",
    title: "Dahi Handi & Janmashtami Celebration — Bringing Smiles to Kids",
    occasion: "Festival",
    creator_name: "Bal Gopal Care Initiative",
    creator_avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=300&auto=format&fit=crop",
    cover_image_url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1200&auto=format&fit=crop",
    target_amount: 30000,
    raised_amount: 24600,
    supporters_count: 31,
    cause_title: "Dairy Nutrition, Butter & Wholesome Meals",
    dedication_note: "Organizing joyous community Dahi Handi celebrations with fresh milk, curd, fruits, and nutritious delicacies for street children.",
    created_at: "2026-08-25",
    recent_supporters: [
      { name: "Girish Kulkarni", amount: 2000, note: "Govinda Aala Re! Joy to all little ones.", time: "2 days ago" },
      { name: "Vandana Joshi", amount: 1500, note: "Jai Shri Krishna!", time: "3 days ago" },
    ]
  },
  "happy-holi": {
    slug: "happy-holi",
    title: "Happy Holi — Colors of Compassion & Food Distribution Drive",
    occasion: "Festival",
    creator_name: "Colors of Hope Team",
    creator_avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
    cover_image_url: "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?q=80&w=1200&auto=format&fit=crop",
    target_amount: 35000,
    raised_amount: 31000,
    supporters_count: 45,
    cause_title: "Organic Herbal Colors, Gujiyas & Festive Feast",
    dedication_note: "Celebrating safe, eco-friendly herbal Holi with destitutes and elderly residents, accompanied by freshly prepared festive lunches.",
    created_at: "2026-03-20",
    recent_supporters: [
      { name: "Manoj Agarwal", amount: 3000, note: "Happy Holi! Keep spreading colors of kindness.", time: "Yesterday" },
      { name: "Shalini Dixit", amount: 2000, note: "Wonderful work by CHAH volunteers.", time: "3 days ago" },
    ]
  }
};

function getOccasionDetails(slug: string) {
  if (MOCK_OCCASION_CAMPAIGNS[slug]) {
    return MOCK_OCCASION_CAMPAIGNS[slug];
  }

  // Synthesize realistic campaign for any slug created in the creation modal
  const cleanTitle = slug
    .split("-")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    slug,
    title: cleanTitle.length > 5 ? cleanTitle : "Special Occasion Fundraiser",
    occasion: slug.includes("birthday") ? "Birthday" : slug.includes("anniversary") ? "Anniversary" : "Milestone",
    creator_name: "Supporter",
    cover_image_url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop",
    target_amount: 10000,
    raised_amount: 2500,
    supporters_count: 3,
    cause_title: "Child Nutrition & Healthcare",
    dedication_note: "I have chosen to celebrate life's moments by supporting children and communities through CHAH Foundation. Please join me in making an impact!",
    created_at: "2026-10-10",
    recent_supporters: [
      { name: "Family Friend", amount: 1000, note: "Warmest wishes on your special day!", time: "Recently" },
      { name: "Kind Donor", amount: 1500, note: "Proud to support your cause.", time: "Recently" },
    ]
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const campaign = getOccasionDetails(slug);

  return {
    title: `${campaign.title} | Celebrate With CHAH`,
    description: campaign.dedication_note || `Support ${campaign.creator_name}'s celebration campaign on CHAH Foundation. All donations are 100% tax-deductible under 80G.`,
    openGraph: {
      title: `${campaign.title} — Celebrate With CHAH`,
      description: campaign.dedication_note,
      images: [campaign.cover_image_url],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: campaign.title,
      description: campaign.dedication_note,
      images: [campaign.cover_image_url],
    }
  };
}

export default async function OccasionCampaignPage({ params }: PageProps) {
  const { slug } = await params;
  const campaign = getOccasionDetails(slug);

  const percentRaised = Math.min(
    100,
    Math.round((campaign.raised_amount / (campaign.target_amount || 1)) * 100)
  );

  const campaignShareUrl = typeof window !== "undefined" 
    ? window.location.href 
    : `https://chahfoundation.com/celebrate/${slug}`;

  return (
    <div className="min-h-screen bg-[#fafaf9] text-gray-900 selection:bg-lime-200">
      
      {/* Top Breadcrumb & Nav */}
      <div className="bg-white border-b border-gray-200/80 sticky top-0 z-30">
        <div className="container mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link
            href="/celebrate"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#003399] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Celebrate With CHAH</span>
          </Link>

          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
            Verified Supporter Campaign
          </span>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* ======================================================== */}
          {/* LEFT COLUMN: Campaign Story, Media, Progress & Wall     */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 space-y-8 text-left">
            
            {/* Occasion Header Tag */}
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-lime-100 text-lime-800 text-xs font-bold uppercase tracking-wider mb-3">
                <Gift className="w-3.5 h-3.5 text-lime-700" />
                <span>{campaign.occasion} Celebration Fundraiser</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight">
                {campaign.title}
              </h1>

              <div className="flex items-center gap-3 mt-3 text-xs sm:text-sm text-gray-600">
                <span>Organized by <strong className="text-gray-900 font-bold">{campaign.creator_name}</strong></span>
                <span>•</span>
                <span>Benefitting <strong className="text-[#003399] font-bold">{campaign.cause_title}</strong></span>
              </div>
            </div>

            {/* Campaign Visual Banner */}
            <div className="relative h-64 sm:h-80 w-full rounded-3xl overflow-hidden shadow-sm border border-gray-200/80 bg-gray-100">
              <img
                src={campaign.cover_image_url}
                alt={campaign.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-4 left-4 right-4 text-white flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-xs font-semibold">
                  CHAH Foundation Verified
                </span>
                <span className="text-xs font-medium">
                  Section 80G Eligible
                </span>
              </div>
            </div>

            {/* Progress Card (Raised Amount, Goal, Supporters) */}
            <div className="p-6 rounded-3xl bg-white border border-gray-200/90 shadow-sm space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-3xl sm:text-4xl font-black text-[#003399] tracking-tight">
                    ₹{campaign.raised_amount.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-gray-500 font-semibold ml-2">
                    raised of ₹{campaign.target_amount.toLocaleString("en-IN")} goal
                  </span>
                </div>

                <span className="text-lg font-black text-lime-700">
                  {percentRaised}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-lime-500 to-[#95c718] rounded-full transition-all duration-700"
                  style={{ width: `${percentRaised}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 font-semibold pt-1">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#003399]" />
                  <span>{campaign.supporters_count} Kind Contributors</span>
                </span>
                <span>
                  ₹{(campaign.target_amount - campaign.raised_amount > 0 ? campaign.target_amount - campaign.raised_amount : 0).toLocaleString("en-IN")} remaining
                </span>
              </div>
            </div>

            {/* Creator's Dedication Story */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gray-200/90 shadow-sm space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                <span>About This Celebration Campaign</span>
              </h2>

              <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-normal">
                {campaign.dedication_note}
              </p>

              <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-lime-100 text-lime-800 flex items-center justify-center font-bold text-sm">
                  {campaign.creator_name.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">{campaign.creator_name}</p>
                  <p className="text-[11px] text-gray-500">Campaign Initiator · Verified Supporter</p>
                </div>
              </div>
            </div>

            {/* Supporter Wall / Contributions */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gray-200/90 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#003399]" />
                  <span>Supporter Wall ({campaign.recent_supporters.length})</span>
                </h2>
                <span className="text-xs text-lime-700 font-bold">100% Direct Impact</span>
              </div>

              <div className="space-y-3">
                {campaign.recent_supporters.map((sup: any, idx: number) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-gray-50/80 border border-gray-100 flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-gray-900">{sup.name}</p>
                      {sup.note && (
                        <p className="text-xs text-gray-600 italic">&ldquo;{sup.note}&rdquo;</p>
                      )}
                      <span className="text-[10px] text-gray-400 block pt-1">{sup.time}</span>
                    </div>

                    <span className="text-xs font-black text-[#003399] shrink-0">
                      ₹{sup.amount.toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Share Bar */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900 to-[#003399] text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-sm">Help {campaign.creator_name} Reach the Goal!</h3>
                <p className="text-xs text-blue-200 mt-0.5">Share this campaign with friends &amp; family on WhatsApp.</p>
              </div>

              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`I am supporting ${campaign.creator_name}'s ${campaign.occasion} Giving Campaign on CHAH Foundation! Join me: ${campaignShareUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs flex items-center gap-2 shrink-0 transition-all shadow-xs"
              >
                <Share2 className="w-4 h-4" />
                <span>Share on WhatsApp</span>
              </a>
            </div>

          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: Instant Donation Widget Attributed to P2P  */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 sticky top-16 space-y-6">
            
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200/90 p-6 sm:p-7 text-left">
              <div className="flex items-center gap-2 text-lime-700 text-xs font-bold uppercase tracking-wider mb-2">
                <Gift className="w-4 h-4" />
                <span>Donate to this Campaign</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-[#003399] tracking-tight mb-2">
                Contribute in Honor of {campaign.creator_name}
              </h2>

              <p className="text-xs text-gray-500 mb-5 leading-relaxed">
                All donations are collected directly by CHAH Foundation for verified programs and qualify for 50% tax deductions under Section 80G.
              </p>

              {/* Direct Integrated Donation Form */}
              <DonationForm
                initialOccasion={campaign.occasion}
              />
            </div>

            {/* Trust & Tax Benefits Strip */}
            <div className="p-5 rounded-2xl bg-white border border-gray-200/80 shadow-xs space-y-2.5 text-xs text-gray-600 text-left">
              <div className="flex items-start gap-2.5">
                <FileText className="w-4 h-4 text-lime-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-gray-900">Instant 80G Tax Exemption</p>
                  <p className="text-[11px] text-gray-500">Official tax deduction receipt sent to your email immediately upon payment.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-2 border-t border-gray-100">
                <ShieldCheck className="w-4 h-4 text-[#003399] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-gray-900">Secure &amp; Direct</p>
                  <p className="text-[11px] text-gray-500">Funds go 100% directly to grassroots operations, not to individuals.</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
