import { Metadata } from "next";
import Link from "next/link";
import { 
  HeartHandshake, 
  Sparkles, 
  Users, 
  Quote, 
  CheckCircle2, 
  ArrowRight, 
  GraduationCap, 
  Stethoscope, 
  Heart, 
  Award, 
  Clock, 
  MapPin, 
  Compass,
  Footprints,
  UserCheck
} from "lucide-react";

export const metadata: Metadata = {
  title: "Volunteer With Us | Volunteers Share Their Journey | CHAH Foundation",
  description: "Read inspiring stories from dedicated volunteers of Children’s Help and Helpage Foundation India. Join our changemaker community and leave an indelible footprint of compassion.",
};

interface VolunteerStory {
  id: string;
  name: string;
  role: string;
  tag: string;
  tagColor: string;
  avatar: string;
  quote: string;
  keyTakeaway: string;
}

const VOLUNTEER_STORIES: VolunteerStory[] = [
  {
    id: "ravina-rane",
    name: "Ravina Rane",
    role: "Community Outreach Volunteer",
    tag: "Personal Growth & Simplicity",
    tagColor: "bg-lime-100 text-lime-800 border-lime-200",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop",
    quote: "Volunteering with Chah Foundation has been a transformative journey, revealing the beauty of finding happiness in the little things and emphasizing the importance of community connection. The organization not only focuses on its mission but also contributes to personal growth, guiding me to appreciate the simplicity of life. Chah Foundation's impact extends far beyond the volunteer experience, enriching my understanding of the profound effects of community bonds on personal well-being.",
    keyTakeaway: "Discovered the joy of community bonds and appreciating simplicity in life."
  },
  {
    id: "mrunali-nirbhavane",
    name: "Mrunali Nirbhavane",
    role: "Youth Leadership Volunteer",
    tag: "Leadership & Teamwork",
    tagColor: "bg-blue-100 text-[#003399] border-blue-200",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop",
    quote: "Chah Foundation has been an invaluable platform for honing my leadership skills and unraveling the intricacies of effective teamwork. As a volunteer, I navigated the delicate balance between leading a team and being an active team player, fostering a collaborative and supportive environment. The organization's dedication to nurturing leadership qualities has significantly influenced my professional journey. Chah Foundation recognizes the potential within its volunteers, encouraging them to take on leadership roles, instilling a sense of responsibility that extends beyond the immediate volunteer experience.",
    keyTakeaway: "Honed executive leadership skills while fostering team collaboration."
  },
  {
    id: "avinash-thakur",
    name: "Avinash Thakur",
    role: "Grassroots Field Volunteer",
    tag: "Changemaker Family Culture",
    tagColor: "bg-amber-100 text-amber-900 border-amber-200",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
    quote: "What sets Chah Foundation apart is its exceptional approach to volunteer engagement. From the outset, I was embraced not merely as a volunteer but as a cherished family member. The spirit of selflessness is ingrained in the organization's culture, creating a strong sense of belonging and commitment. Chah Foundation goes beyond the traditional volunteer relationship, fostering a community of changemakers united by a common purpose. The camaraderie and shared dedication at Chah Foundation redefine the volunteer experience, making it an extraordinary and heartwarming journey.",
    keyTakeaway: "Found a second family and a purposeful community of changemakers."
  }
];

export default function VolunteerPage() {
  return (
    <div className="min-h-screen bg-[#fafaf9] text-gray-900 selection:bg-lime-200">

      {/* ======================================================== */}
      {/* 1. HERO BANNER (DIRECTLY AFTER HEADER)                   */}
      {/* ======================================================== */}
      <section className="relative w-full overflow-hidden bg-slate-900">
        <div className="relative w-full h-[240px] sm:h-[300px] md:h-[360px] lg:h-[400px]">
          <img
            src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=2070&auto=format&fit=crop"
            alt="Passionate volunteers working together at CHAH Foundation India"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/45 to-slate-950/25 pointer-events-none" />

          {/* Breadcrumbs & Hero Caption */}
          <div className="absolute inset-0 flex flex-col justify-end pb-8 sm:pb-12">
            <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-left text-white space-y-3">
              
              {/* Breadcrumb Navigation */}
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <Link href="/" className="hover:text-lime-300 transition-colors">Home</Link>
                <span>/</span>
                <Link href="/about" className="hover:text-lime-300 transition-colors">About Us</Link>
                <span>/</span>
                <span className="text-lime-400">Volunteer</span>
              </nav>

              <div className="space-y-1.5">
                <span className="inline-block px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-lime-300 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                  COMMUNITY OF CHANGEMAKERS
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-md">
                  Volunteers Share Their Journey
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-slate-200 max-w-2xl font-medium">
                  Discover how giving your time transforms lives, builds leadership, and leaves an indelible footprint of compassion across India.
                </p>
              </div>

              {/* Trust & Community Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#003399] text-xs font-bold shadow-xs">
                  500+ Active Volunteers
                </span>
                <span className="px-3 py-1 rounded-full bg-[#95c718] text-slate-950 text-xs font-black shadow-xs">
                  Certificate of Volunteering
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
      {/* 2. SECTION: VOLUNTEERS SHARE THEIR JOURNEY               */}
      {/* ======================================================== */}
      <section className="py-14 sm:py-20 lg:py-24 bg-white border-b border-gray-100">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-lime-100 text-lime-800 text-xs font-bold uppercase tracking-wider mb-4">
              <HeartHandshake className="w-4 h-4 text-lime-700" />
              <span>REAL STORIES OF PERSONAL GROWTH</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#003399] leading-tight">
              Volunteers Share Their <span className="text-[#95c718]">Journey</span>
            </h2>

            <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed font-normal">
              Hear firsthand from the dedicated hearts who walk the ground with Children’s Help &amp; Helpage Foundation, discovering purpose, leadership, and camaraderie along the way.
            </p>
          </div>

          {/* 3 Featured Volunteer Stories */}
          <div className="space-y-10 sm:space-y-12">
            {VOLUNTEER_STORIES.map((volunteer, index) => {
              const isEven = index % 2 === 1;

              return (
                <div
                  key={volunteer.id}
                  className="p-6 sm:p-10 rounded-3xl bg-[#fafaf8] border border-gray-200/90 shadow-2xs hover:shadow-md transition-shadow relative overflow-hidden"
                >
                  <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
                    isEven ? "lg:flex-row-reverse" : ""
                  }`}>

                    {/* Volunteer Portrait & Badge */}
                    <div className={`lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left ${
                      isEven ? "lg:order-2" : "lg:order-1"
                    }`}>
                      <div className="relative mb-4">
                        <img
                          src={volunteer.avatar}
                          alt={volunteer.name}
                          className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover border-4 border-white shadow-md"
                        />
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-[#003399] text-white flex items-center justify-center shadow-xs">
                          <Quote className="w-5 h-5 text-lime-300" />
                        </div>
                      </div>

                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border mb-2 ${volunteer.tagColor}`}>
                        {volunteer.tag}
                      </span>

                      <h3 className="text-xl sm:text-2xl font-black text-[#003399] tracking-tight">
                        {volunteer.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 font-medium mt-0.5">
                        {volunteer.role}
                      </p>
                    </div>

                    {/* Volunteer Story Narrative */}
                    <div className={`lg:col-span-8 space-y-4 text-left ${
                      isEven ? "lg:order-1" : "lg:order-2"
                    }`}>
                      <div className="relative">
                        <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed font-normal">
                          &ldquo;{volunteer.quote}&rdquo;
                        </p>
                      </div>

                      {/* Key Takeaway Callout */}
                      <div className="p-3.5 rounded-2xl bg-white border border-gray-200/90 flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#003399] shadow-2xs">
                        <CheckCircle2 className="w-4 h-4 text-lime-600 shrink-0" />
                        <span>{volunteer.keyTakeaway}</span>
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
      {/* 3. SECTION: FOOTPRINTS OF COMPASSION                     */}
      {/* ======================================================== */}
      <section className="py-16 sm:py-24 bg-[#fafaf8] border-b border-gray-100">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-[#003399] text-xs font-bold uppercase tracking-wider">
                <Footprints className="w-4 h-4 text-[#003399]" />
                <span>OUR COLLECTIVE IMPACT</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#003399] tracking-tight leading-tight">
                Footprints of Compassion: <span className="text-[#95c718]">Tales from Dedicated Volunteers</span>
              </h2>

              <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-normal">
                Our volunteer efforts leave an indelible footprint of positive change. With each task completed, event organized, and community outreach initiative undertaken, we imprint a path toward a brighter future.
              </p>

              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                The footprints of our collective work are evident in the lives touched, the smiles shared, and the meaningful impact on the community. As volunteers, we stride forward, leaving a trail of inspiration, unity, and progress—a footprint that echoes our commitment to making a lasting difference in the world.
              </p>

              {/* Impact Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-white border border-gray-200/90 flex items-center gap-3 shadow-2xs">
                  <div className="w-8 h-8 rounded-xl bg-lime-100 text-lime-800 flex items-center justify-center font-bold shrink-0">
                    <Stethoscope className="w-4 h-4 text-lime-700" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#003399]">Hospital on Wheels</p>
                    <p className="text-[11px] text-gray-500">Street children health camps</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-gray-200/90 flex items-center gap-3 shadow-2xs">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#003399] flex items-center justify-center font-bold shrink-0">
                    <GraduationCap className="w-4 h-4 text-[#003399]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#003399]">Education Drives</p>
                    <p className="text-[11px] text-gray-500">Distributing kits &amp; teaching</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-gray-200/90 flex items-center gap-3 shadow-2xs">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold shrink-0">
                    <Heart className="w-4 h-4 text-amber-700" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#003399]">Eldercare Visits</p>
                    <p className="text-[11px] text-gray-500">Companionship &amp; dignity care</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-gray-200/90 flex items-center gap-3 shadow-2xs">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center font-bold shrink-0">
                    <Sparkles className="w-4 h-4 text-purple-700" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#003399]">Blanket &amp; Meal Drives</p>
                    <p className="text-[11px] text-gray-500">Direct street distribution</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Media Graphic */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border-2 border-white bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1200&auto=format&fit=crop"
                  alt="Volunteers actively supporting children and elders in need"
                  className="w-full h-[440px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="px-3 py-1 bg-[#95c718] text-slate-950 text-xs font-black rounded-full uppercase tracking-wider">
                    Our Volunteer Promise
                  </span>
                  <p className="text-sm font-semibold mt-2 drop-shadow-sm">
                    &ldquo;Leaving a trail of inspiration, unity, and progress wherever our foot falls.&rdquo;
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. WHY JOIN OUR VOLUNTEER NETWORK                         */}
      {/* ======================================================== */}
      <section className="py-16 sm:py-20 bg-white border-b border-gray-100">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#003399] bg-blue-50 px-3.5 py-1 rounded-full">
              VOLUNTEER BENEFITS
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#003399] tracking-tight mt-3">
              What You Gain as a Volunteer
            </h2>
            <p className="mt-3 text-sm sm:text-base text-gray-600">
              Volunteering with CHAH Foundation is not just about giving — it is about learning, growing, and experiencing heartfelt connections.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-6 rounded-3xl bg-[#fafaf8] border border-gray-200/90 shadow-2xs space-y-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-lime-100 text-lime-800 flex items-center justify-center font-bold">
                <Users className="w-5 h-5 text-lime-700" />
              </div>
              <h3 className="text-base font-bold text-[#003399]">
                Family &amp; Belonging
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Be welcomed into a supportive community of changemakers who value every single effort.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#fafaf8] border border-gray-200/90 shadow-2xs space-y-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#003399] flex items-center justify-center font-bold">
                <Award className="w-5 h-5 text-[#003399]" />
              </div>
              <h3 className="text-base font-bold text-[#003399]">
                Leadership Growth
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Gain hands-on experience in project coordination, community engagement, and team leadership.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#fafaf8] border border-gray-200/90 shadow-2xs space-y-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5 text-amber-700" />
              </div>
              <h3 className="text-base font-bold text-[#003399]">
                Flexible Commitments
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Participate on weekends, special holidays, or periodic field drives at your own pace.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#fafaf8] border border-gray-200/90 shadow-2xs space-y-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5 text-purple-700" />
              </div>
              <h3 className="text-base font-bold text-[#003399]">
                Official Certificate
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Receive an authentic Certificate of Volunteering recognizing your dedicated service.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. FINAL CALL TO ACTION: JOIN AS A VOLUNTEER             */}
      {/* (STRICTLY NO DONATION CTA PER USER INSTRUCTIONS)         */}
      {/* ======================================================== */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-[#003399] via-[#002673] to-[#001e5a] text-white text-center relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/5 pointer-events-none blur-2xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-lime-400/10 pointer-events-none blur-2xl" />

        <div className="container mx-auto max-w-4xl px-4 sm:px-6 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-lime-300 text-xs font-bold uppercase tracking-wider mb-5">
            <UserCheck className="w-3.5 h-3.5 text-lime-300" />
            <span>JOIN OUR CHANGEMAKER MOVEMENT</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Ready to Leave Your <span className="text-[#95c718]">Footprint of Compassion?</span>
          </h2>

          <p className="mt-5 text-base sm:text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed font-normal">
            Whether you can spare a few hours on weekends or want to lead grassroots projects, your heart and dedication can change the world for a child or elder in need.
          </p>

          {/* Action Buttons: Exclusively to JOIN as Volunteer / Partner (No donation CTA) */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/partner-with-us"
              className="px-8 py-4 rounded-2xl bg-[#95c718] hover:bg-[#85b514] text-slate-950 font-black text-base transition-all shadow-xl hover:shadow-2xl flex items-center gap-2.5 hover:scale-103 active:scale-98"
            >
              <UserCheck className="w-5 h-5 text-slate-950" />
              <span>Join as a Volunteer Today</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/partner-with-us"
              className="px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border-2 border-white/25 text-white font-bold text-base transition-all flex items-center gap-2"
            >
              <Users className="w-5 h-5 text-lime-300" />
              <span>Partner With Us</span>
            </Link>
          </div>

          {/* Assurance Badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-xs text-blue-200">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#95c718]" />
              Certificate of Volunteering
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#95c718]" />
              Flexible Weekend &amp; Field Hours
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#95c718]" />
              Active across 15 States in India
            </span>
          </div>

        </div>
      </section>

    </div>
  );
}
