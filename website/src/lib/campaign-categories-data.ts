import { 
  getFeaturedCampaignSection, 
  getMedicalEmergencySection, 
  getEldercareSection, 
  getFoodSection,
  type FeaturedCampaignSectionData,
  type FeaturedCampaignItem
} from "@/lib/api";

export interface CampaignCategoryConfig {
  slug: string;
  legacyTitle: string;
  displayTitle: string;
  categoryTag: string;
  defaultBadge: string;
  defaultHeading: string;
  defaultSubheading: string;
  heroImage: string;
  whyDescription: string;
  whyPoints: { title: string; desc: string }[];
  impactStats: { label: string; value: string }[];
  fetcher: () => Promise<FeaturedCampaignSectionData>;
  fallbackFeatured: FeaturedCampaignItem;
  fallbackSupporting: FeaturedCampaignItem[];
}

export type SerializableCampaignCategoryConfig = Omit<CampaignCategoryConfig, "fetcher">;

export const CAMPAIGN_CATEGORIES: Record<string, CampaignCategoryConfig> = {
  "child-education": {
    slug: "child-education",
    legacyTitle: "C.H.A.H.F @ child education",
    displayTitle: "Child Education & Scholarship Support",
    categoryTag: "Child Education",
    defaultBadge: "EDUCATION & SCHOLARSHIP SUPPORT",
    defaultHeading: "Empower Every Child Through the Journey of Learning",
    defaultSubheading: "Help underprivileged children stay in school with tuition sponsorships, learning kits, and smart digital classrooms.",
    heroImage: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1600&auto=format&fit=crop",
    whyDescription:
      "Education is the single most powerful tool to end generational poverty. Yet in marginalized communities, a child often drops out simply because a parent cannot afford ₹500 for textbooks or examination fees. By sponsoring a child's education, you provide them with the dignity, skills, and self-belief to build an independent future.",
    whyPoints: [
      {
        title: "Combatting Dropout Crisis",
        desc: "Over 30 million children in India are out of school due to poverty and lack of basic learning materials."
      },
      {
        title: "Holistic School Kits",
        desc: "Each kit contains bags, notebooks, geometry boxes, uniforms, and shoes to keep children motivated."
      },
      {
        title: "Parental Counseling",
        desc: "We convince daily wage parents to prioritize schooling over child labour, ensuring sustained attendance."
      }
    ],
    impactStats: [
      { label: "Children Enrolled", value: "14,500+" },
      { label: "Schools Supported", value: "172 Centers" },
      { label: "Scholarships Given", value: "3,800+" },
      { label: "Tax Exemption", value: "100% 80G" }
    ],
    fetcher: getFeaturedCampaignSection,
    fallbackFeatured: {
      id: "edu-feat-1",
      title: "Help Amit continue his education & dream of becoming a teacher",
      slug: "help-amit-continue-education",
      beneficiary_name: "Amit",
      beneficiary_age: 10,
      location: "Sitapur, Uttar Pradesh",
      target_amount: "15000",
      raised_amount: "9400",
      supporters_count: 28,
      is_featured: true,
      is_urgent: true,
      urgency_label: "5 days left",
      cta_button_text: "Help Amit",
      short_description: "Amit needs urgent school fee and textbook kit support so he does not drop out of class 5.",
      featured_image_url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop",
      category: { id: "1", name: "Education", slug: "education" }
    },
    fallbackSupporting: [
      {
        id: "edu-sup-1",
        title: "Help Veena get her school kit & uniform for 3rd grade",
        slug: "help-veena-school-kit",
        beneficiary_name: "Veena",
        beneficiary_age: 8,
        location: "Lucknow, Uttar Pradesh",
        target_amount: "6000",
        raised_amount: "3200",
        supporters_count: 14,
        is_featured: false,
        is_urgent: false,
        cta_button_text: "Help Veena",
        short_description: "Veena's parents are daily wage labourers. ₹500 provides a full textbook set and bag.",
        featured_image_url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop",
        category: { id: "1", name: "School Kits", slug: "school-kits" }
      },
      {
        id: "edu-sup-2",
        title: "Help Bharti continue high school after family hardship",
        slug: "help-bharti-continue-school",
        beneficiary_name: "Bharti",
        beneficiary_age: 12,
        location: "Barabanki, Uttar Pradesh",
        target_amount: "12000",
        raised_amount: "7800",
        supporters_count: 22,
        is_featured: false,
        is_urgent: true,
        urgency_label: "Critical",
        cta_button_text: "Help Bharti",
        short_description: "Bharti is top of her class in mathematics. Sponsorship covers tuition and exam fees.",
        featured_image_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop",
        category: { id: "1", name: "Tuition Fees", slug: "tuition-fees" }
      },
      {
        id: "edu-sup-3",
        title: "Clean drinking water filtration for 120 school students",
        slug: "clean-water-sanitation-aarav",
        beneficiary_name: "Aarav & Schoolmates",
        beneficiary_age: 9,
        location: "Rae Bareli, Uttar Pradesh",
        target_amount: "18000",
        raised_amount: "11200",
        supporters_count: 31,
        is_featured: false,
        is_urgent: false,
        cta_button_text: "Sponsor Water Unit",
        short_description: "Preventing waterborne illnesses so school children don't miss classes due to jaundice or cholera.",
        featured_image_url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800&auto=format&fit=crop",
        category: { id: "1", name: "Health in School", slug: "school-health" }
      }
    ]
  },

  "health-is-wealth": {
    slug: "health-is-wealth",
    legacyTitle: "C.H.A.H.F @ Health is wealth",
    displayTitle: "Critical Medical Emergency & Healthcare Aid",
    categoryTag: "Healthcare & Surgeries",
    defaultBadge: "CRITICAL MEDICAL EMERGENCY CASES",
    defaultHeading: "Urgent Care Needed: Health Cannot Wait",
    defaultSubheading: "When medical emergencies strike vulnerable families, timely help saves lives. Support life-saving surgeries and treatments.",
    heroImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1600&auto=format&fit=crop",
    whyDescription:
      "In India, a single serious medical diagnosis pushes families into catastrophic debt and poverty. For street children and impoverished families without health insurance, emergency surgeries, chemotherapy, and pediatric corrective treatments are out of reach without donor support.",
    whyPoints: [
      {
        title: "Zero Treatment Delay",
        desc: "Critical surgeries cannot wait for bureaucratic delays. We transfer funds directly to verified hospital accounts."
      },
      {
        title: "Hospital on Wheels",
        desc: "Deploying certified doctors and mobile diagnostic vans to provide doorstep care in slums twice a week."
      },
      {
        title: "Special Needs Children",
        desc: "Sponsoring prosthetic limbs, wheelchairs, and physical therapy for children with congenital deformities."
      }
    ],
    impactStats: [
      { label: "Surgeries Sponsored", value: "350+" },
      { label: "Free Consultations", value: "42,000+" },
      { label: "Mobile Clinics", value: "15 States" },
      { label: "Hospital Verification", value: "100% Direct" }
    ],
    fetcher: getMedicalEmergencySection,
    fallbackFeatured: {
      id: "med-feat-1",
      title: "Urgent Heart Surgery for 4-year-old Baby Ananya",
      slug: "baby-ananya-heart-surgery",
      beneficiary_name: "Baby Ananya",
      beneficiary_age: 4,
      location: "Mumbai, Maharashtra",
      target_amount: "250000",
      raised_amount: "185000",
      supporters_count: 142,
      is_featured: true,
      is_urgent: true,
      urgency_label: "Surgery in 3 days",
      cta_button_text: "Save Ananya",
      short_description: "Ananya suffers from a congenital heart defect. Her father is an autorickshaw driver unable to afford the operation.",
      featured_image_url: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=1200&auto=format&fit=crop",
      category: { id: "2", name: "Pediatric Surgery", slug: "pediatric-surgery" }
    },
    fallbackSupporting: [
      {
        id: "med-sup-1",
        title: "Chemotherapy Fund for 9-year-old Rohan fighting Leukemia",
        slug: "rohan-leukemia-treatment",
        beneficiary_name: "Rohan",
        beneficiary_age: 9,
        location: "Vellore, Tamil Nadu",
        target_amount: "180000",
        raised_amount: "124000",
        supporters_count: 89,
        is_featured: false,
        is_urgent: true,
        urgency_label: "Cycle 4 Due",
        cta_button_text: "Support Rohan",
        short_description: "Rohan is undergoing specialized chemotherapy cycles at CMC Vellore. Help him complete his treatment.",
        featured_image_url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop",
        category: { id: "2", name: "Cancer Care", slug: "cancer-care" }
      },
      {
        id: "med-sup-2",
        title: "Corrective Foot Surgery & Orthopedic Calipers for Muskan",
        slug: "muskan-orthopedic-calipers",
        beneficiary_name: "Muskan",
        beneficiary_age: 6,
        location: "Thane, Maharashtra",
        target_amount: "45000",
        raised_amount: "31000",
        supporters_count: 24,
        is_featured: false,
        is_urgent: false,
        cta_button_text: "Help Muskan Walk",
        short_description: "Corrective tendon release surgery and customized calipers will allow Muskan to walk and attend school independently.",
        featured_image_url: "https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=800&auto=format&fit=crop",
        category: { id: "2", name: "Special Needs", slug: "special-needs" }
      },
      {
        id: "med-sup-3",
        title: "Mobile Hospital Van Medicine & Diagnostic Kit Fund",
        slug: "mobile-hospital-medicine-fund",
        beneficiary_name: "Slum Outpatients",
        beneficiary_age: null,
        location: "Bhandup & Mulund Slums",
        target_amount: "60000",
        raised_amount: "41000",
        supporters_count: 38,
        is_featured: false,
        is_urgent: false,
        cta_button_text: "Donate Medicines",
        short_description: "Provides antibiotic suspensions, inhalers, and pediatric vitamins dispensed free of charge from mobile medical vans.",
        featured_image_url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=800&auto=format&fit=crop",
        category: { id: "2", name: "Doorstep Medicine", slug: "doorstep-medicine" }
      }
    ]
  },

  "changes-elder-life": {
    slug: "changes-elder-life",
    legacyTitle: "C.H.A.H.F @ Changes Elder life",
    displayTitle: "Care, Dignity & Healthcare for Abandoned Elders",
    categoryTag: "Elder Welfare & Shelter",
    defaultBadge: "COMPASSIONATE ELDER CARE",
    defaultHeading: "Dignity, Shelter & Healthcare for Abandoned Elders",
    defaultSubheading: "Ensure no senior citizen spends their golden years destitute, lonely, or without essential medicines and warm food.",
    heroImage: "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?q=80&w=1600&auto=format&fit=crop",
    whyDescription:
      "With over 138 million elderly in India, loneliness, abandonment, and medical destitution form a silent humanitarian crisis. As joint families splinter and poverty strikes, countless elderly parents are left without shelter, pensions, or basic human care. We provide comforting shelter, food, healthcare, and intergenerational companionship.",
    whyPoints: [
      {
        title: "Combating Abandonment",
        desc: "Providing safe shelter and dignified living for destitute senior citizens who have no family."
      },
      {
        title: "Doorstep Geriatric Healthcare",
        desc: "Supplying monthly cardiac, diabetic, and arthritis medicines free of charge directly to elderly individuals."
      },
      {
        title: "Restoring Human Dignity",
        desc: "Companionship circles, emotional listening sessions, and rights advocacy to protect elders from abuse."
      }
    ],
    impactStats: [
      { label: "Elders Supported", value: "3,200+" },
      { label: "Shelter Homes Supported", value: "26 Centers" },
      { label: "Monthly Ration Kits", value: "48,000+" },
      { label: "Geriatric Clinics", value: "15 States" }
    ],
    fetcher: getEldercareSection,
    fallbackFeatured: {
      id: "eld-feat-1",
      title: "Sponsor 1 Year Shelter, Medicine & Food for Grandmother Shanti Devi",
      slug: "shanti-devi-eldercare-sponsorship",
      beneficiary_name: "Shanti Devi",
      beneficiary_age: 78,
      location: "Pune, Maharashtra",
      target_amount: "36000",
      raised_amount: "26500",
      supporters_count: 34,
      is_featured: true,
      is_urgent: true,
      urgency_label: "Monthly Care",
      cta_button_text: "Support Shanti Devi",
      short_description: "Shanti Devi was found sleeping outside a temple with severe joint pain and no family. Your support covers her care and nutritious meals.",
      featured_image_url: "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?q=80&w=1200&auto=format&fit=crop",
      category: { id: "3", name: "Elder Shelter", slug: "elder-shelter" }
    },
    fallbackSupporting: [
      {
        id: "eld-sup-1",
        title: "Monthly Chronic Medicine & Blood Pressure Fund for 40 Elders",
        slug: "elderly-medicine-fund-40-seniors",
        beneficiary_name: "40 Destitute Seniors",
        beneficiary_age: null,
        location: "Mumbai & Thane Centers",
        target_amount: "40000",
        raised_amount: "28000",
        supporters_count: 26,
        is_featured: false,
        is_urgent: false,
        cta_button_text: "Sponsor Medicines",
        short_description: "Providing lifelong hypertension, diabetes, and pain relief medications to low-income senior citizens.",
        featured_image_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop",
        category: { id: "3", name: "Geriatric Medicine", slug: "geriatric-medicine" }
      },
      {
        id: "eld-sup-2",
        title: "Mobility Walkers, Walking Sticks & Wheelchairs for Bedridden Elders",
        slug: "mobility-aids-wheelchairs-elders",
        beneficiary_name: "Senior Citizens Group",
        beneficiary_age: null,
        location: "Lucknow & Varanasi",
        target_amount: "50000",
        raised_amount: "34500",
        supporters_count: 31,
        is_featured: false,
        is_urgent: false,
        cta_button_text: "Provide Mobility Aids",
        short_description: "Empowers fragile elders to walk safely without falling, restoring independence and mobility.",
        featured_image_url: "https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=800&auto=format&fit=crop",
        category: { id: "3", name: "Mobility Aids", slug: "mobility-aids" }
      },
      {
        id: "eld-sup-3",
        title: "Warm Woollen Blankets & Thermal Clothing for Homeless Grandparents",
        slug: "winter-blankets-homeless-grandparents",
        beneficiary_name: "Footpath Elders",
        beneficiary_age: null,
        location: "Delhi NCR Pavements",
        target_amount: "30000",
        raised_amount: "22000",
        supporters_count: 19,
        is_featured: false,
        is_urgent: true,
        urgency_label: "Winter Relief",
        cta_button_text: "Send Warmth",
        short_description: "High-grade thermal blankets protecting elderly pavement dwellers from freezing winter winds.",
        featured_image_url: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=800&auto=format&fit=crop",
        category: { id: "3", name: "Winter Protection", slug: "winter-protection" }
      }
    ]
  },

  "hungry-mitao": {
    slug: "hungry-mitao",
    legacyTitle: "C.H.A.H.F @ Hungry mitao",
    displayTitle: "Hungry Mitao — Zero Hunger & Daily Meal Mission",
    categoryTag: "Hunger Relief & Nutrition",
    defaultBadge: "ZERO HUNGER MISSION",
    defaultHeading: "Nutritious Meals & Food Aid for Every Hungry Soul",
    defaultSubheading: "Serving daily hot khichdi, distributing monthly dry ration kits, and delivering hospital caregiver food boxes.",
    heroImage: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1600&auto=format&fit=crop",
    whyDescription:
      "No child can study on an empty stomach, and no patient relative can care for their loved one while starving on hospital pavements. Our Hungry Mitao initiative serves hot, hygienic, and balanced meals daily outside public hospitals and in marginalized slum colonies.",
    whyPoints: [
      {
        title: "Direct Hospital Gate Feeding",
        desc: "Relatives caring for cancer and cardiac patients sleep on pavements and often starve to afford medicines."
      },
      {
        title: "Malnutrition Prevention",
        desc: "Providing protein-rich khichdi, milk, and seasonal vegetables to slum children to prevent stunted growth."
      },
      {
        title: "Monthly Family Ration Kits",
        desc: "Giving atta, rice, dal, cooking oil, and salt kits to widows and daily wagers to secure their monthly kitchen."
      }
    ],
    impactStats: [
      { label: "Meals Served", value: "2.5 Million+" },
      { label: "Hospital Gates Covered", value: "14 Hospitals" },
      { label: "Ration Kits Delivered", value: "52,000+" },
      { label: "Cost Per Meal", value: "Only ₹30" }
    ],
    fetcher: getFoodSection,
    fallbackFeatured: {
      id: "food-feat-1",
      title: "Daily Hot Meals for 500 Patient Attendants Outside Civil Hospital",
      slug: "daily-hot-meals-civil-hospital",
      beneficiary_name: "Hospital Caregivers",
      beneficiary_age: null,
      location: "Mumbai, Maharashtra",
      target_amount: "90000",
      raised_amount: "63000",
      supporters_count: 57,
      is_featured: true,
      is_urgent: true,
      urgency_label: "Active Daily Kitchen",
      cta_button_text: "Feed a Family",
      short_description: "Steaming hot, freshly prepared dal, rice, roti, and vegetables served daily at 1 PM and 8 PM outside civil hospital gates.",
      featured_image_url: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=1200&auto=format&fit=crop",
      category: { id: "4", name: "Hospital Meals", slug: "hospital-meals" }
    },
    fallbackSupporting: [
      {
        id: "food-sup-1",
        title: "Monthly Grocery & Dry Ration Kit for 100 Single-Mother Families",
        slug: "monthly-ration-kits-single-mothers",
        beneficiary_name: "100 Slum Families",
        beneficiary_age: null,
        location: "Gomti Riverbank & East Delhi Slums",
        target_amount: "150000",
        raised_amount: "98000",
        supporters_count: 73,
        is_featured: false,
        is_urgent: false,
        cta_button_text: "Sponsor a Family Kit",
        short_description: "A ₹1,500 kit provides 15kg wheat flour, 10kg rice, 3kg lentils, cooking oil, spices, and sugar for an entire month.",
        featured_image_url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800&auto=format&fit=crop",
        category: { id: "4", name: "Family Ration Kits", slug: "family-ration" }
      },
      {
        id: "food-sup-2",
        title: "Nutritious Morning Milk & Boiled Egg Drive for 350 Slum Kids",
        slug: "morning-nutrition-milk-egg-drive",
        beneficiary_name: "Slum School Children",
        beneficiary_age: null,
        location: "Bhandup & Thane Slums",
        target_amount: "45000",
        raised_amount: "32500",
        supporters_count: 39,
        is_featured: false,
        is_urgent: true,
        urgency_label: "High Priority",
        cta_button_text: "Provide Nutrition",
        short_description: "Ensures growing children get essential calcium and protein before their morning community classes.",
        featured_image_url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop",
        category: { id: "4", name: "Child Nutrition", slug: "child-nutrition" }
      },
      {
        id: "food-sup-3",
        title: "Emergency Food Packets for Migrant Labour Settlements",
        slug: "emergency-food-packets-migrant-wagers",
        beneficiary_name: "Migrant Daily Wagers",
        beneficiary_age: null,
        location: "Industrial Corridor, Palghar",
        target_amount: "60000",
        raised_amount: "41000",
        supporters_count: 32,
        is_featured: false,
        is_urgent: false,
        cta_button_text: "Support Migrant Meals",
        short_description: "Direct community kitchen distribution when monsoons or work stoppages disrupt daily wages.",
        featured_image_url: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop",
        category: { id: "4", name: "Emergency Food Relief", slug: "emergency-food" }
      }
    ]
  }
};

export function getCampaignCategory(slug: string): CampaignCategoryConfig | null {
  return CAMPAIGN_CATEGORIES[slug] || null;
}
