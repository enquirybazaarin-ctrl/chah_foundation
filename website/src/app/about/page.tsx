import { Metadata } from "next";
import Link from "next/link";
import { 
  Heart, 
  HandHeart, 
  Users, 
  Sparkles, 
  GraduationCap, 
  Stethoscope, 
  ShieldCheck, 
  MapPin, 
  Target, 
  Eye, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  Compass, 
  ShieldAlert, 
  Home, 
  HeartHandshake,
  UserCheck,
  HelpingHand
} from "lucide-react";

export const metadata: Metadata = {
  title: "Who We Are | CHAH Foundation",
  description: "Children’s Help and Helpage Foundation India is a secular, registered non-profit working for the holistic development of needy children and the care and dignity of disadvantaged older persons across India.",
};

// 15 States
const ACTIVE_STATES = [
  "Maharashtra",
  "Rajasthan",
  "Bihar",
  "Delhi",
  "Andhra Pradesh",
  "Jharkhand",
  "Orissa (Odisha)",
  "Uttarakhand",
  "Uttar Pradesh",
  "Uttarkashi",
  "Karnataka",
  "Tamil Nadu",
  "Assam",
  "West Bengal",
  "Telangana"
];

// Vision Points from official statement
const VISION_POINTS = [
  {
    icon: Users,
    title: "Holistic Child Welfare",
    desc: "To solve the fundamental issues of children who are underprivileged, neglected or poor."
  },
  {
    icon: GraduationCap,
    title: "Universal Education",
    desc: "To educate every child who is underprivileged or poor, ensuring learning resources and school kits."
  },
  {
    icon: Heart,
    title: "Nourishment & Food",
    desc: "To provide daily nutritious food and balanced meals to all children living in poverty."
  },
  {
    icon: Stethoscope,
    title: "Healthcare & Free Medical Aid",
    desc: "To provide free medical care to children with special focus on physically challenged kids."
  },
  {
    icon: ShieldCheck,
    title: "Eradication of Child Labour",
    desc: "To provide rehabilitation and protection to all children who are victims of child labour."
  },
  {
    icon: Home,
    title: "Safe Shelter & Rehabilitation",
    desc: "To provide secure shelter to children living on the streets due to extreme poverty."
  },
  {
    icon: Sparkles,
    title: "Early Health Detection",
    desc: "To detect child-related healthcare issues early and take active measures to correct them in time."
  },
  {
    icon: ShieldAlert,
    title: "Anti-Trafficking Protection",
    desc: "To actively protect vulnerable children from human trafficking, abuse, and exploitation."
  },
  {
    icon: HandHeart,
    title: "Protection & Care",
    desc: "To provide, protect and care for all underprivileged children across our project communities."
  },
  {
    icon: HeartHandshake,
    title: "Elder Shelter & Companionship",
    desc: "To provide comforting shelter and healthcare for older persons and fulfill basic needs for children."
  }
];

// Mission Points
const MISSION_POINTS = [
  {
    title: "Empowerment & Basic Rights",
    desc: "To work towards creating a better India which provides basic health, education and empowerment to every citizen."
  },
  {
    title: "Strategic Partnerships",
    desc: "To be a Knowledge and Execution Partner of Schools, NGOs, Corporates, and Government agencies for development programmes across India."
  },
  {
    title: "Capacity Building & Sustainability",
    desc: "Building the capacity of education NGOs to achieve sustainability and scalability, thereby enabling delivery of quality education."
  },
  {
    title: "Protection Across Generations",
    desc: "Fostering a nation where every child and older person secures their rights and stays protected with respect and dignity."
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fafaf9] text-gray-900 selection:bg-lime-200">
      
      {/* ======================================================== */}
      {/* 1. ABOUT HERO BANNER (DIRECTLY AFTER HEADER)             */}
      {/* ======================================================== */}
      <section className="relative w-full overflow-hidden bg-slate-900">
        <div className="relative w-full h-[240px] sm:h-[300px] md:h-[360px] lg:h-[400px]">
          <img
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop"
            alt="Children and elders supported by CHAH Foundation India"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-slate-950/20 pointer-events-none" />

          {/* Breadcrumbs & Banner Captions */}
          <div className="absolute inset-0 flex flex-col justify-end pb-8 sm:pb-12">
            <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-left text-white space-y-3">
              {/* Breadcrumb Navigation */}
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <Link href="/" className="hover:text-lime-300 transition-colors">Home</Link>
                <span>/</span>
                <span className="text-lime-400">Who We Are</span>
              </nav>

              <div className="space-y-1.5">
                <span className="inline-block px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-lime-300 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                  ABOUT US · CHAH FOUNDATION INDIA
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-md">
                  Who We Are
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-slate-200 max-w-2xl font-medium">
                  Children’s Help and Helpage Foundation India
                </p>
              </div>

              {/* Quick Trust Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#003399] text-xs font-bold shadow-xs">
                  Societies Registration Act 1950
                </span>
                <span className="px-3 py-1 rounded-full bg-[#95c718] text-slate-950 text-xs font-black shadow-xs">
                  Section 80G Tax Exemption
                </span>
                <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-medium border border-white/20 hidden sm:inline">
                  Serving across 15 States in India
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. RAISE YOUR HELPING HAND SECTION                       */}
      {/* ======================================================== */}
      <section className="py-14 sm:py-20 bg-white border-b border-gray-100">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-lime-100 text-lime-800 text-xs font-bold uppercase tracking-wider mb-4">
            <HeartHandshake className="w-4 h-4 text-lime-700" />
            <span>OUR INVITATION TO CARE</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#003399] leading-tight">
            Raise Your <span className="text-[#95c718]">Helping Hand</span>
          </h2>

          <p className="mt-5 text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-normal">
            Children’s Help and Helpage Foundation India is a secular, non-governmental and non-profit organization registered under the Societies’ Registration Act of 1950, working for the holistic development of neglected and needy children and the care of disadvantaged older persons.
          </p>

          {/* Quick Action Grid from official prompt */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto mt-9">
            <Link
              href="/partner-with-us"
              className="group p-4 rounded-2xl bg-white hover:bg-blue-50/50 border-2 border-gray-200 hover:border-[#003399] text-[#003399] font-bold text-xs sm:text-sm flex flex-col items-center justify-center gap-2 transition-all shadow-xs hover:shadow-md"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 group-hover:bg-[#003399] text-[#003399] group-hover:text-white flex items-center justify-center transition-colors">
                <UserCheck className="w-5 h-5" />
              </div>
              <span className="font-bold text-[#003399]">Become a Volunteer</span>
            </Link>

            <Link
              href="/celebrate"
              className="group p-4 rounded-2xl bg-white hover:bg-lime-50/50 border-2 border-gray-200 hover:border-[#95c718] text-[#003399] font-bold text-xs sm:text-sm flex flex-col items-center justify-center gap-2 transition-all shadow-xs hover:shadow-md"
            >
              <div className="w-10 h-10 rounded-xl bg-lime-50 group-hover:bg-[#95c718] text-lime-700 group-hover:text-slate-950 flex items-center justify-center transition-colors">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-bold text-[#003399]">Quick Fundraise</span>
            </Link>

            <Link
              href="/projects"
              className="group p-4 rounded-2xl bg-white hover:bg-blue-50/50 border-2 border-gray-200 hover:border-[#003399] text-[#003399] font-bold text-xs sm:text-sm flex flex-col items-center justify-center gap-2 transition-all shadow-xs hover:shadow-md"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 group-hover:bg-[#003399] text-[#003399] group-hover:text-white flex items-center justify-center transition-colors">
                <HelpingHand className="w-5 h-5" />
              </div>
              <span className="font-bold text-[#003399]">Help Someone</span>
            </Link>

            <Link
              href="/donate"
              className="group p-4 rounded-2xl bg-[#95c718] hover:bg-[#85b514] border-2 border-[#95c718] text-slate-950 font-black text-xs sm:text-sm flex flex-col items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className="w-10 h-10 rounded-xl bg-white/30 group-hover:bg-white text-slate-950 flex items-center justify-center transition-colors">
                <Heart className="w-5 h-5 fill-slate-950" />
              </div>
              <span className="font-black text-slate-950">Give Donation</span>
            </Link>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. CHILDREN'S HELP & DEVELOPMENT                         */}
      {/* ======================================================== */}
      <section className="py-16 sm:py-24 bg-[#fafaf8] border-b border-gray-100">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Visual Media Column */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-gray-200 bg-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop"
                  alt="Children learning happily in a school classroom"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="px-3 py-1 bg-[#003399] text-xs font-bold rounded-full uppercase tracking-wider">
                    Holistic Child Development
                  </span>
                  <p className="text-sm font-semibold mt-2">
                    Free medical aid, nutrition, education and shelter for every child in need.
                  </p>
                </div>
              </div>
            </div>

            {/* Narrative Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-[#003399] bg-blue-50 px-3 py-1 rounded-full">
                CHILDREN'S HELP &amp; DEVELOPMENT
              </span>

              <h2 className="text-3xl sm:text-4xl font-black text-[#003399] tracking-tight leading-tight">
                Together, We Can Transform the Lives of Children in Poverty
              </h2>

              <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-normal">
                Growing up in poverty, kids face tough challenges: hunger and malnutrition, limited access to education and medical services, gang violence, social discrimination and isolation.
              </p>

              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                But it doesn’t have to be that way. Together, we can transform the lives of children in poverty. It starts right here, right now when you help a child. We focus on the basics such as education, health, food and shelter. Our approach is holistic and our style hands on. We are on the ground, where it matters most for the child. We enable both families and communities.
              </p>

              {/* Free Medical Aid Callout */}
              <div className="p-4 rounded-2xl bg-lime-50/70 border border-lime-200/80 text-xs sm:text-sm text-gray-800 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-[#003399]">
                  <Stethoscope className="w-4 h-4 text-lime-700" />
                  <span>Free Medical Aid for Children</span>
                </div>
                <p className="text-gray-600 text-xs leading-relaxed">
                  We provide free medical aid to children with special focus on physically challenged kids, ensuring health monitoring and early corrective care.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. CARE & DIGNITY FOR ELDERS                             */}
      {/* ======================================================== */}
      <section className="py-16 sm:py-24 bg-white border-b border-gray-100">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Narrative Column */}
            <div className="lg:col-span-7 space-y-6 text-left order-2 lg:order-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#003399] bg-blue-50 px-3 py-1 rounded-full">
                CARE &amp; DIGNITY FOR ELDERS
              </span>

              <h2 className="text-3xl sm:text-4xl font-black text-[#003399] tracking-tight leading-tight">
                Addressing Elder Needs &amp; Ensuring Respectful Lives
              </h2>

              <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-normal">
                We have several grassroots initiatives; the organization works for elders also — <em>&lsquo;the cause and care of disadvantaged older persons to improve their quality of life&rsquo;</em>. We envision a society where the elderly have the right to an active, healthy, and dignified life.
              </p>

              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Currently, there are a projected 138 million elderly in India. As a person ages, dependence comes with it — a need of being cared for, looked after, and especially companionship becomes the core need of that hour. In this fast world, many lack the time and patience to spend with the aging population and look after their requirements day and night, so we fulfill these needs.
              </p>

              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Most older persons face loneliness because of the fast-moving lives of their children. Children’s Help and Helpage Foundation seeks to reach out to a larger audience of older persons, acting as a catalyst of change in bridging the gap between generations and ensuring a respectful and comfortable life for senior citizens.
              </p>

              {/* Rights and Advocacy Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 bg-[#fafaf9] rounded-xl border border-gray-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-lime-600 shrink-0" />
                  <span className="font-semibold text-[#003399]">Universal Pension Advocacy</span>
                </div>
                <div className="p-3 bg-[#fafaf9] rounded-xl border border-gray-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-lime-600 shrink-0" />
                  <span className="font-semibold text-[#003399]">Quality Geriatric Healthcare</span>
                </div>
                <div className="p-3 bg-[#fafaf9] rounded-xl border border-gray-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-lime-600 shrink-0" />
                  <span className="font-semibold text-[#003399]">Action Against Elder Abuse</span>
                </div>
                <div className="p-3 bg-[#fafaf9] rounded-xl border border-gray-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-lime-600 shrink-0" />
                  <span className="font-semibold text-[#003399]">26 State Offices Across India</span>
                </div>
              </div>
            </div>

            {/* Visual Media Column */}
            <div className="lg:col-span-5 relative order-1 lg:order-2">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-gray-200 bg-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?q=80&w=1200&auto=format&fit=crop"
                  alt="Senior citizen smiling with companionship and attentive care"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="px-3 py-1 bg-[#003399] text-xs font-bold rounded-full uppercase tracking-wider">
                    Bridging Generations
                  </span>
                  <p className="text-sm font-semibold mt-2">
                    Ensuring warmth, medical assistance, and companionship so no elder feels alone.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. OUR TEAM & COLLECTIVE HEART                           */}
      {/* ======================================================== */}
      <section className="py-16 sm:py-24 bg-[#fafaf8] border-b border-gray-100">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#003399]/10 text-[#003399] text-xs font-bold uppercase tracking-wider mb-4">
            <Users className="w-3.5 h-3.5" />
            <span>OUR TEAM &amp; LEADERSHIP</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-[#003399] tracking-tight leading-tight">
            United in Regard and Concern for Children &amp; Elders
          </h2>

          <p className="mt-5 text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed font-normal">
            Children’s Help and Helpage Foundation is driven by a passionate team from diverse walks of life, each bringing a proven track record of dedication.
          </p>

          <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-blue-50/60 border border-blue-200/80 text-left space-y-4">
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed">
              They are <strong className="text-[#003399]">university professors, writers, judges, and accomplished professionals</strong> who sincerely feel for the cause. Children’s Help and Helpage Foundation interacts with children and older persons at all levels of family and community.
            </p>
            <p className="text-sm sm:text-base text-[#003399] leading-relaxed italic font-medium">
              &ldquo;Our vision is to be there for every suffering human being and try to help each and every one in the smallest possible way.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. CORE AREAS OF ACTIVITY (15 STATES IN INDIA)           */}
      {/* ======================================================== */}
      <section className="py-16 sm:py-24 bg-white border-b border-gray-100">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-lime-100 text-lime-800 text-xs font-bold uppercase tracking-wider mb-4">
            <MapPin className="w-3.5 h-3.5 text-lime-700" />
            <span>PAN-INDIA FOOTPRINT</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-[#003399] tracking-tight leading-tight">
            Our Core Areas of Activity
          </h2>

          <p className="mt-4 text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Working on the ground to directly impact the lives of more than a million children, elders, and their families across 15 States in India:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 mt-10 max-w-5xl mx-auto">
            {ACTIVE_STATES.map((state, index) => (
              <div
                key={index}
                className="p-3.5 rounded-2xl bg-[#fafaf9] border border-gray-200/90 shadow-xs hover:border-[#003399] hover:bg-white hover:shadow-md transition-all flex items-center gap-2.5 text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-lime-100 text-lime-800 flex items-center justify-center font-bold text-xs shrink-0">
                  {index + 1}
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#003399]">
                  {state}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. OUR VISION (10 STATEMENTS)                            */}
      {/* ======================================================== */}
      <section className="py-16 sm:py-24 bg-[#fafaf8] border-b border-gray-100">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-[#003399] text-xs font-bold uppercase tracking-wider mb-3">
              <Eye className="w-3.5 h-3.5" />
              <span>GUIDING LIGHT</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#003399] tracking-tight">
              Our Vision
            </h2>
            <p className="mt-3 text-base text-gray-600 leading-relaxed">
              Committed to holistic welfare, dignity, and fundamental rights for every vulnerable child and elder.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {VISION_POINTS.map((v, i) => {
              const Icon = v.icon;
              return (
                <div
                  key={i}
                  className="p-5 sm:p-6 rounded-3xl bg-white border border-gray-200/90 hover:border-[#003399]/40 hover:shadow-md transition-all text-left flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-lime-100 text-lime-800 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-lime-700" />
                    </div>
                    <h3 className="text-base font-bold text-[#003399] tracking-tight">
                      {v.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                      {v.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 8. OUR MISSION (4 COMMITMENTS)                           */}
      {/* ======================================================== */}
      <section className="py-16 sm:py-24 bg-white border-b border-gray-100">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-lime-100 text-lime-800 text-xs font-bold uppercase tracking-wider mb-3">
              <Target className="w-3.5 h-3.5" />
              <span>CORE PURPOSE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#003399] tracking-tight">
              Our Mission
            </h2>
            <p className="mt-3 text-base text-gray-600 leading-relaxed">
              Sustainable interventions, institutional partnerships, and rights-based advocacy across the nation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MISSION_POINTS.map((m, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-8 rounded-3xl bg-[#fafaf9] border border-gray-200/90 shadow-sm hover:border-[#003399]/30 hover:bg-white hover:shadow-md transition-all text-left space-y-3"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-[#003399] text-white flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-[#003399] tracking-tight">
                    {m.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 9. CALL TO ACTION: JOIN OUR COMMUNITY                    */}
      {/* ======================================================== */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-[#003399] to-[#001e5a] text-white text-center">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Together, We Can Bring Meaningful Change
          </h2>
          <p className="mt-4 text-sm sm:text-base text-blue-100 max-w-xl mx-auto leading-relaxed">
            Whether you choose to volunteer your time or make a contribution, your support directly fuels meals, schooling, and eldercare on the ground.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/donate"
              className="px-6 py-3.5 rounded-xl bg-[#95c718] hover:bg-[#85b514] text-slate-950 font-black text-sm transition-all shadow-md flex items-center gap-2"
            >
              <span>Donate Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/partner-with-us"
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition-all"
            >
              <span>Become a Volunteer</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
