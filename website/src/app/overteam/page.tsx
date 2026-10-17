import { Metadata } from "next";
import Link from "next/link";
import { 
  Heart, 
  GraduationCap, 
  Briefcase, 
  HeartHandshake, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Stethoscope, 
  Building2, 
  Users, 
  Quote, 
  CheckCircle2,
  PhoneCall,
  Mail
} from "lucide-react";

export const metadata: Metadata = {
  title: "Our Trustees & Board Members | CHAH Foundation India",
  description: "Meet the visionary board members and founders of Children’s Help and Helpage Foundation India: Mr. Ashwin Ashok Patne, Mr. Amit Yashwant Kawade, and Miss Shravni Swapnil Kharade.",
};

interface BoardMember {
  id: string;
  name: string;
  role: string;
  roleBadgeColor: string;
  image: string;
  credentials: string[];
  bioParagraphs: string[];
  quote?: string;
  impactAreas: string[];
}

const BOARD_MEMBERS: BoardMember[] = [
  {
    id: "ashwin-patne",
    name: "MR. ASHWIN ASHOK PATNE",
    role: "OUR FOUNDER",
    roleBadgeColor: "bg-[#003399] text-white",
    image: "/team/ashwin-patne.png",
    credentials: [
      "Masters in Social Work (M.S.W.)",
      "Management & Project Coordinator",
      "Healthcare & Elder Welfare Specialist"
    ],
    bioParagraphs: [
      "Children's Help and Helpage Foundation, having worked as management and project coordinator of Children's Help and Helpage Foundation specifically with the care and support centre for senior citizens, Heart - to - Heart project, and the health services, the hospital on wheels for street children's project.",
      "Having qualified with a Masters in Social Work, he is a sincere & dedicated social worker with the heart of gold. He has an unending reserve of energy & enthusiasm. When it comes to looking after the needs of poor & deserving patients in Styles hospital, he is extremely enterprising & innovative & finds solutions to difficult problems & situations very easily."
    ],
    quote: "When it comes to looking after the needs of poor and deserving patients, compassion must be paired with action and unending reserve of energy.",
    impactAreas: [
      "Hospital on Wheels for Street Children",
      "Care & Support Centre for Senior Citizens",
      "Heart-to-Heart Emergency Health Initiative",
      "Direct Patient Relief in Styles Hospital"
    ]
  },
  {
    id: "amit-kawade",
    name: "Mr. AMIT YASHWANT KAWADE",
    role: "CO FOUNDER",
    roleBadgeColor: "bg-[#95c718] text-slate-950 font-black",
    image: "/team/amit-kawade.png",
    credentials: [
      "B.E. Mechanical Engineering",
      "Corporate Leader & Social Strategist",
      "Child Empowerment & Livelihood Advocate"
    ],
    bioParagraphs: [
      "Mr. Amit Yashwant Kawade, founder member of Children's Help And Helpage Foundation, holds a B.E. Mechanical Engineering, currently working with reputed organization of the country at leading position.",
      "Purpose: Children empowerment and health care is essential for the growth and development of the nation. This non-governmental organization (NGO) seeks to determine how NGOs may support children's empowerment by providing them with direct livelihood resources. Children are the country's future, but many of them are unable to take advantage of the chances that are open to them due to a lack of education, health conditions, basic necessities, and adequate government support. Therefore, NGOs are crucial in educating and enabling kids to earn a living right away. This prompted the formation of our NGO, whose aim is to foster wide collaboration and social change. Our purpose is to bridge the gap, boost communities, and inspire hope, allowing people to reach their full potential. Join us on our mission to make a lasting difference.",
      "After many years of close association with communities witnessing critical challenges in education, women's issues, healthcare, and skill development, I felt compelled to bring about change, leading to the creation of our NGO, whose mission is to collaborate broadly and promote social change by bridging gaps, uplifting communities, and inspiring hope, empowering individuals to unlock their full potential—join us on our journey toward making a lasting impact."
    ],
    quote: "Our purpose is to bridge the gap, boost communities, and inspire hope, allowing individuals to reach their full potential.",
    impactAreas: [
      "Child Empowerment & Direct Livelihood",
      "Women Welfare & Skill Development",
      "Strategic Non-Profit Partnerships",
      "Nationwide Community Upliftment"
    ]
  },
  {
    id: "shravni-kharade",
    name: "Miss. Shravni Swapnil Kharade",
    role: "CEO",
    roleBadgeColor: "bg-[#003399] text-white",
    image: "/team/shravni-kharade.png",
    credentials: [
      "Chief Executive Officer & Founder",
      "B.Com — SNDT College (Wadala)",
      "Diploma in Interior Design"
    ],
    bioParagraphs: [
      "Miss Shravni Swapnil Kharade, CEO and founder of Children’s Help and HelpAge Foundation, has a background rooted in social work and a deep-seated helping nature, inherited from her family.",
      "She holds a B.Com degree from SNDT College (Wadala) and has also earned a diploma in Interior Design. The influence of her father, who has been her idol since childhood, inspired her to follow in his footsteps.",
      "Today, with the support of her family and friends, Miss Shravni Swapnil Kharade plays a crucial role in leading the operations, outreach, and ground programs of the Children’s Help and HelpAge Foundation."
    ],
    quote: "Rooted in social work and inspired by generational service, our aim is to ensure every child and older person lives with respect and opportunity.",
    impactAreas: [
      "Executive Direction & Daily Operations",
      "Grassroots Community Coordination",
      "Youth & Women Education Programs",
      "Holistic Institutional Growth"
    ]
  }
];

export default function OurTrusteesAndTeamsPage() {
  return (
    <div className="min-h-screen bg-[#fafaf9] text-gray-900 selection:bg-lime-200">

      {/* ======================================================== */}
      {/* 1. HERO BANNER (DIRECTLY AFTER HEADER)                   */}
      {/* ======================================================== */}
      <section className="relative w-full overflow-hidden bg-slate-900">
        <div className="relative w-full h-[240px] sm:h-[300px] md:h-[360px] lg:h-[400px]">
          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2070&auto=format&fit=crop"
            alt="Board Members and Trustees of CHAH Foundation India"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/45 to-slate-950/25 pointer-events-none" />

          {/* Breadcrumbs & Hero Caption */}
          <div className="absolute inset-0 flex flex-col justify-end pb-8 sm:pb-12">
            <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-left text-white space-y-3">
              
              {/* Breadcrumbs */}
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <Link href="/" className="hover:text-lime-300 transition-colors">Home</Link>
                <span>/</span>
                <Link href="/about" className="hover:text-lime-300 transition-colors">About Us</Link>
                <span>/</span>
                <span className="text-lime-400">Our Trustees and Teams</span>
              </nav>

              <div className="space-y-1.5">
                <span className="inline-block px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-lime-300 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                  GOVERNANCE &amp; LEADERSHIP
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-md">
                  Our Trustees &amp; Teams
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-slate-200 max-w-2xl font-medium">
                  Guiding Children’s Help and Helpage Foundation India with integrity, compassion, and tireless grassroots commitment.
                </p>
              </div>

              {/* Trust & Governance Tags */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#003399] text-xs font-bold shadow-xs">
                  Governing Board of Trustees
                </span>
                <span className="px-3 py-1 rounded-full bg-[#95c718] text-slate-950 text-xs font-black shadow-xs">
                  Section 80G Tax Exemption
                </span>
                <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-medium border border-white/20 hidden sm:inline">
                  Societies Registration Act 1950
                </span>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. MAIN SECTION: OUR BOARD MEMBERS                       */}
      {/* ======================================================== */}
      <section className="py-14 sm:py-20 lg:py-24 bg-white border-b border-gray-100">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          
          {/* Main Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-lime-100 text-lime-800 text-xs font-bold uppercase tracking-wider mb-4">
              <Users className="w-4 h-4 text-lime-700" />
              <span>LEADERSHIP THAT INSPIRES CHANGE</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#003399] leading-tight">
              Our <span className="text-[#95c718]">Board Members</span>
            </h2>

            <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed font-normal">
              Meet the visionary minds, founders, and trustees who spearhead our mission to transform the lives of neglected children and uplift older persons across India.
            </p>

            {/* Quick Navigation Anchor Bar */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-6">
              {BOARD_MEMBERS.map((member) => (
                <a
                  key={member.id}
                  href={`#${member.id}`}
                  className="px-3.5 py-1.5 rounded-full bg-gray-50 hover:bg-blue-50 border border-gray-200 text-[#003399] hover:border-[#003399] text-xs font-bold transition-all"
                >
                  {member.name.replace("MR. ", "").replace("Mr. ", "").replace("Miss. ", "")}
                </a>
              ))}
            </div>
          </div>

          {/* ======================================================== */}
          {/* 3. PROFILES OF THE 3 BOARD MEMBERS                       */}
          {/* ======================================================== */}
          <div className="space-y-16 sm:space-y-24">
            {BOARD_MEMBERS.map((member, index) => {
              const isEven = index % 2 === 1;

              return (
                <div
                  key={member.id}
                  id={member.id}
                  className="p-6 sm:p-10 lg:p-12 rounded-3xl bg-[#fafaf8] border border-gray-200/90 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                >
                  <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start ${
                    isEven ? "lg:flex-row-reverse" : ""
                  }`}>

                    {/* Member Image & Key Quick Stats */}
                    <div className={`lg:col-span-5 space-y-5 ${isEven ? "lg:order-2" : "lg:order-1"}`}>
                      <div className="relative rounded-3xl overflow-hidden shadow-lg border-2 border-white bg-slate-100 group">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full aspect-[4/4.5] sm:aspect-[4/4] lg:aspect-[4/4.5] object-cover object-top group-hover:scale-102 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent pointer-events-none" />

                        {/* Bottom Overlay Label */}
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <p className="text-xs font-bold uppercase tracking-wider text-lime-300">
                            CHAH FOUNDATION INDIA
                          </p>
                          <p className="text-lg font-black tracking-tight drop-shadow-sm text-white">
                            {member.name}
                          </p>
                        </div>
                      </div>

                      {/* Credentials Pill Strip */}
                      <div className="p-4 rounded-2xl bg-white border border-gray-200/90 shadow-2xs space-y-2.5">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#003399] flex items-center gap-1.5">
                          <GraduationCap className="w-4 h-4 text-[#95c718]" />
                          <span>Key Qualifications &amp; Focus</span>
                        </p>
                        <div className="space-y-1.5">
                          {member.credentials.map((cred, cIdx) => (
                            <div key={cIdx} className="flex items-start gap-2 text-xs text-gray-700">
                              <CheckCircle2 className="w-3.5 h-3.5 text-lime-600 shrink-0 mt-0.5" />
                              <span className="font-medium">{cred}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Member Detailed Content */}
                    <div className={`lg:col-span-7 space-y-6 text-left ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                      
                      {/* Name & Role Header */}
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${member.roleBadgeColor}`}>
                            {member.role}
                          </span>
                          <span className="px-3 py-1 rounded-full bg-blue-50 text-[#003399] text-xs font-bold">
                            Board Member
                          </span>
                        </div>

                        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#003399] tracking-tight leading-snug">
                          {member.name}
                        </h3>
                      </div>

                      {/* Bio Narrative */}
                      <div className="space-y-4 text-gray-700 text-sm sm:text-base leading-relaxed font-normal">
                        {member.bioParagraphs.map((para, pIdx) => (
                          <p key={pIdx} className="leading-relaxed">
                            {para}
                          </p>
                        ))}
                      </div>

                      {/* Executive Quote Callout */}
                      {member.quote && (
                        <div className="p-5 rounded-2xl bg-lime-50/80 border-l-4 border-[#95c718] text-gray-800 space-y-2">
                          <div className="flex items-center gap-2 text-xs font-bold text-[#003399] uppercase tracking-wider">
                            <Quote className="w-4 h-4 text-lime-700" />
                            <span>Leadership Philosophy</span>
                          </div>
                          <p className="text-xs sm:text-sm italic font-medium text-gray-800 leading-relaxed">
                            &ldquo;{member.quote}&rdquo;
                          </p>
                        </div>
                      )}

                      {/* Core Impact Initiatives */}
                      <div className="pt-2">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#003399] mb-3">
                          Areas of Responsibility &amp; Initiatives
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {member.impactAreas.map((area, aIdx) => (
                            <div
                              key={aIdx}
                              className="p-2.5 bg-white rounded-xl border border-gray-200/90 text-xs font-semibold text-gray-800 flex items-center gap-2 shadow-2xs"
                            >
                              <div className="w-2 h-2 rounded-full bg-[#95c718]" />
                              <span>{area}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. GOVERNANCE & ACCOUNTABILITY COMMITMENTS                */}
      {/* ======================================================== */}
      <section className="py-16 sm:py-20 bg-[#fafaf8] border-b border-gray-100">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#003399] bg-blue-50 px-3.5 py-1 rounded-full">
              ORGANIZATIONAL INTEGRITY
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#003399] tracking-tight mt-3">
              Our Governance Principles
            </h2>
            <p className="mt-3 text-sm sm:text-base text-gray-600">
              The CHAH Foundation Board is committed to absolute transparency, statutory compliance, and grassroots accountability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-gray-200/90 shadow-2xs space-y-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-lime-100 text-lime-800 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5 text-lime-700" />
              </div>
              <h3 className="text-base font-bold text-[#003399]">
                100% Financial Transparency
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Every rupee received is audited and deployed directly towards meals, medicines, education materials, and senior shelter.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-gray-200/90 shadow-2xs space-y-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#003399] flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5 text-[#003399]" />
              </div>
              <h3 className="text-base font-bold text-[#003399]">
                Societies Act &amp; 80G Compliant
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Registered under the Societies Registration Act of 1950, holding valid Section 80G tax exemptions and 12A certifications.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-gray-200/90 shadow-2xs space-y-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-lime-100 text-lime-800 flex items-center justify-center font-bold">
                <HeartHandshake className="w-5 h-5 text-lime-700" />
              </div>
              <h3 className="text-base font-bold text-[#003399]">
                Direct Ground Execution
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Our trustees coordinate hands-on with local communities, schools, and care homes across 15 states without intermediary delays.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. CALL TO ACTION: CONNECT WITH OUR BOARD                */}
      {/* ======================================================== */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-[#003399] to-[#001e5a] text-white text-center">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            Support the Cause Led by Our Board
          </h2>
          <p className="mt-4 text-sm sm:text-base text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Join hands with our leadership team. Whether you choose to sponsor a child&apos;s education, fund eldercare, or partner via CSR, your support creates tangible impact.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/donate"
              className="px-7 py-3.5 rounded-xl bg-[#95c718] hover:bg-[#85b514] text-slate-950 font-black text-sm transition-all shadow-md flex items-center gap-2 hover:scale-102"
            >
              <Heart className="w-4 h-4 fill-slate-950" />
              <span>Donate to Our Cause</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/partner-with-us"
              className="px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-sm transition-all"
            >
              <span>Partner With Us</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
