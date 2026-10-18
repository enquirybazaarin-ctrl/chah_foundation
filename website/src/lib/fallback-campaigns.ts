export interface FullCampaignData {
  id: string;
  category_id?: string;
  title: string;
  slug: string;
  short_description?: string;
  content: string;
  beneficiary_name?: string;
  beneficiary_age?: number | null;
  location?: string;
  target_amount?: string;
  raised_amount?: string;
  supporters_count?: number;
  status?: string;
  is_featured?: boolean;
  is_urgent?: boolean;
  urgency_label?: string | null;
  cta_button_text?: string;
  featured_image_url?: string;
  images?: string[];
  supporting_images?: string[];
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

export const FALLBACK_CAMPAIGNS_REGISTRY: Record<string, FullCampaignData> = {
  // ─── 1. CHILD EDUCATION ───────────────────────────────────────
  "help-amit-continue-education": {
    id: "edu-feat-1",
    category_id: "1",
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
    content: `Amit is a diligent and enthusiastic 10-year-old student residing in Sitapur, Uttar Pradesh. Despite challenging socio-economic circumstances, he consistently ranks among the top performers in his class and dreams of becoming a science teacher to inspire other children in his village.

Recently, his family faced severe economic hardship after his father lost daily-wage construction work due to health complications. Without urgent assistance for his term school fees, examination charges, uniforms, and textbooks, Amit faces the imminent threat of discontinuation from school.

Your compassionate donation will directly cover Amit's annual tuition fees, provide a comprehensive school kit with notebooks and stationery, and ensure he can attend school safely with dignity. Every contribution, small or large, helps keep a young boy's dream alive.`,
    featured_image_url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop"
    ],
    category: { id: "1", name: "Child Education", slug: "education" }
  },
  "help-amit-continue-school": {
    id: "edu-feat-1",
    category_id: "1",
    title: "Help Amit continue his education & dream of becoming a teacher",
    slug: "help-amit-continue-school",
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
    content: `Amit is a diligent 10-year-old student who dreams of becoming a science teacher. Due to severe economic hardship, his family cannot afford this term's school fees, uniforms, and textbooks. Your contribution ensures Amit does not drop out and can pursue his education safely.`,
    featured_image_url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop"],
    category: { id: "1", name: "Child Education", slug: "education" }
  },
  "help-veena-school-kit": {
    id: "edu-sup-1",
    category_id: "1",
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
    content: `Veena is an eager 8-year-old student in Lucknow starting 3rd grade. Her parents work as daily-wage labourers and strive hard to give her a better future, but cannot afford the mandatory school uniform, shoes, and subject textbook kit.

A contribution of just ₹500 provides Veena with a durable school bag, complete notebook set, geometry tools, and stationery essentials, keeping her motivated to attend school consistently without shame or embarrassment.`,
    featured_image_url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop"],
    category: { id: "1", name: "School Support", slug: "school-kits" }
  },
  "help-bharti-continue-school": {
    id: "edu-sup-2",
    category_id: "1",
    title: "Help Bharti continue high school after family hardship",
    slug: "help-bharti-continue-school",
    beneficiary_name: "Bharti",
    beneficiary_age: 12,
    location: "Barabanki, Uttar Pradesh",
    target_amount: "10000",
    raised_amount: "4200",
    supporters_count: 19,
    is_featured: false,
    is_urgent: true,
    urgency_label: "Urgent Support",
    cta_button_text: "Help Bharti",
    short_description: "Provide annual tuition support and books to prevent Bharti from dropping out.",
    content: `Bharti is top of her class in mathematics and dreams of becoming an engineer. Following her father's chronic illness, the household income stopped completely. Bharti's school has given a final notice for tuition fees.

Sponsorship of ₹10,000 completely clears her academic fees for the full school year and supplies textbooks and exam preparatory guides. Help Bharti stay in the classroom where she belongs.`,
    featured_image_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop"],
    category: { id: "1", name: "Tuition Assistance", slug: "tuition-fees" }
  },
  "clean-water-sanitation-aarav": {
    id: "edu-sup-3",
    category_id: "1",
    title: "Clean water & sanitation kit for Aarav and schoolmates",
    slug: "clean-water-sanitation-aarav",
    beneficiary_name: "Aarav",
    beneficiary_age: 9,
    location: "Rae Bareli, Uttar Pradesh",
    target_amount: "12000",
    raised_amount: "6800",
    supporters_count: 24,
    is_featured: false,
    is_urgent: false,
    cta_button_text: "Help Aarav",
    short_description: "Ensure Aarav and his fellow 120 schoolmates have clean drinking water and hygiene essentials.",
    content: `Clean drinking water and hygiene facilities are essential for children to stay healthy and attend school. In Aarav's primary school, over 120 children frequently fell ill due to contaminated groundwater.

This fundraiser installs an effective water purification system, handwashing stations, and provides each student with an individual sanitization kit. Your support prevents waterborne illness and builds a healthier learning environment.`,
    featured_image_url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800&auto=format&fit=crop"],
    category: { id: "1", name: "School Health & Hygiene", slug: "school-health" }
  },

  // ─── 2. HEALTHCARE & MEDICAL EMERGENCY ────────────────────────
  "urgent-heart-surgery-rohan": {
    id: "med-feat-rohan",
    category_id: "2",
    title: "Urgent heart surgery needed for 5-year-old Rohan",
    slug: "urgent-heart-surgery-rohan",
    beneficiary_name: "Rohan",
    beneficiary_age: 5,
    location: "Delhi, NCR",
    target_amount: "450000",
    raised_amount: "185000",
    supporters_count: 142,
    is_featured: true,
    is_urgent: true,
    urgency_label: "Surgery in 3 Days",
    cta_button_text: "Help Rohan",
    short_description: "Rohan has been diagnosed with a congenital heart defect. He needs immediate surgery to survive, but his parents cannot afford the medical costs.",
    content: `5-year-old Rohan was born with a severe congenital heart defect. In recent weeks, his oxygen saturation levels have dropped drastically, causing breathlessness and severe fatigue. Doctors at the specialized pediatric cardiac center have advised immediate open-heart surgery.

His father works as a daily delivery driver and has already spent all meager family savings on preliminary ICU evaluations and medications. The operation and post-operative intensive care total ₹4,50,000. 

CHAH Foundation works directly with the hospital billing department to ensure 100% of donor funds go strictly toward Rohan's surgical and ICU expenses. Please contribute today to save a young life.`,
    featured_image_url: "https://images.unsplash.com/photo-1536856136534-bb679c52a9aa?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1536856136534-bb679c52a9aa?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop"
    ],
    category: { id: "2", name: "Medical Emergency", slug: "medical-emergency" }
  },
  "baby-ananya-heart-surgery": {
    id: "med-feat-1",
    category_id: "2",
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
    content: `4-year-old Ananya was diagnosed with an acute Ventricular Septal Defect. Her condition has progressed to the point where doctors say surgical intervention is urgently needed.

Her father drives a hired autorickshaw and earns barely ₹350 a day. Hospital estimates for surgery and ICU stay are ₹2,50,000. Your immediate support will give Ananya the chance to grow up healthy and playful.`,
    featured_image_url: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=1200&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=1200&auto=format&fit=crop"],
    category: { id: "2", name: "Pediatric Surgery", slug: "pediatric-surgery" }
  },
  "support-priyas-leukemia": {
    id: "med-sup-priya",
    category_id: "2",
    title: "Support Priya's leukemia treatment & chemotherapy",
    slug: "support-priyas-leukemia",
    beneficiary_name: "Priya",
    beneficiary_age: 12,
    location: "Mumbai, Maharashtra",
    target_amount: "600000",
    raised_amount: "420000",
    supporters_count: 315,
    is_featured: false,
    is_urgent: true,
    urgency_label: "Critical",
    cta_button_text: "Help Priya",
    short_description: "Priya requires 6 months of chemotherapy. Her father, a daily wage worker, has exhausted all savings.",
    content: `12-year-old Priya was diagnosed with Acute Lymphoblastic Leukemia. Her medical team has charted a comprehensive chemotherapy regimen that has an 85% cure rate if completed without interruption.

Her father has borrowed from relatives and exhausted all resources for the initial phases. Funds raised here go directly to the hospital cancer ward for her remaining cycles, anti-infection injections, and blood transfusions.`,
    featured_image_url: "https://images.unsplash.com/photo-1616422285623-aa301f409bdc?q=80&w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1616422285623-aa301f409bdc?q=80&w=800&auto=format&fit=crop"],
    category: { id: "2", name: "Cancer Care", slug: "cancer-care" }
  },
  "rohan-leukemia-treatment": {
    id: "med-sup-1",
    category_id: "2",
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
    content: `9-year-old Rohan is bravely battling Leukemia. He is currently on Cycle 4 of his chemotherapy protocol. His recovery is progressing well, but the financial strain on his family is immense. Your contribution ensures no life-saving medicine is delayed.`,
    featured_image_url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop"],
    category: { id: "2", name: "Cancer Care", slug: "cancer-care" }
  },
  "ankit-accident-recovery": {
    id: "med-sup-ankit",
    category_id: "2",
    title: "Help Ankit recover from a tragic accident",
    slug: "ankit-accident-recovery",
    beneficiary_name: "Ankit",
    beneficiary_age: 28,
    location: "Pune, Maharashtra",
    target_amount: "800000",
    raised_amount: "350000",
    supporters_count: 89,
    is_featured: false,
    is_urgent: false,
    cta_button_text: "Help Ankit",
    short_description: "Ankit suffered severe injuries in a road accident. Funds are needed for his ongoing ICU care and upcoming surgeries.",
    content: `28-year-old Ankit, the sole earner for his elderly parents and younger sister, suffered multiple fractures and internal injuries in a road collision. He has survived two critical procedures and now requires neuro-rehabilitation and orthopaedic stabilization.`,
    featured_image_url: "https://images.unsplash.com/photo-1504151932400-72d4384f0e13?q=80&w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1504151932400-72d4384f0e13?q=80&w=800&auto=format&fit=crop"],
    category: { id: "2", name: "Accident Trauma", slug: "accident-trauma" }
  },
  "kidney-transplant-ramesh": {
    id: "med-sup-ramesh",
    category_id: "2",
    title: "Kidney transplant for 45-year-old father Ramesh",
    slug: "kidney-transplant-ramesh",
    beneficiary_name: "Ramesh",
    beneficiary_age: 45,
    location: "Bangalore, Karnataka",
    target_amount: "700000",
    raised_amount: "150000",
    supporters_count: 45,
    is_featured: false,
    is_urgent: true,
    urgency_label: "Donor Ready",
    cta_button_text: "Help Ramesh",
    short_description: "Ramesh is the sole breadwinner for his family of four. He urgently needs a kidney transplant to live.",
    content: `45-year-old Ramesh has reached end-stage renal disease and survives on tri-weekly dialysis. A matched donor has stepped forward, and government authorizations are in place. The transplant and immunosuppressant medicines require ₹7,00,000. Your help will restore a father to his young children.`,
    featured_image_url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop"],
    category: { id: "2", name: "Organ Transplant", slug: "organ-transplant" }
  },
  "muskan-orthopedic-calipers": {
    id: "med-sup-2",
    category_id: "2",
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
    content: `6-year-old Muskan has congenital bilateral clubfoot. A minor corrective surgical intervention and customized calipers will allow her to walk pain-free and attend primary school with her friends.`,
    featured_image_url: "https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=800&auto=format&fit=crop"],
    category: { id: "2", name: "Special Needs", slug: "special-needs" }
  },
  "mobile-hospital-medicine-fund": {
    id: "med-sup-3",
    category_id: "2",
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
    content: `Our mobile clinic vans visit impoverished urban settlements every week, dispensing free antibiotics, pediatric syrups, asthma inhalers, and diagnostic tests to thousands who cannot afford private clinics.`,
    featured_image_url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=800&auto=format&fit=crop"],
    category: { id: "2", name: "Doorstep Medicine", slug: "doorstep-medicine" }
  },

  // ─── 3. ELDER CARE ───────────────────────────────────────────
  "shanti-devi-eldercare-sponsorship": {
    id: "elder-feat-1",
    category_id: "3",
    title: "Monthly Shelter, Food & Care for 74-year-old Shanti Devi",
    slug: "shanti-devi-eldercare-sponsorship",
    beneficiary_name: "Shanti Devi",
    beneficiary_age: 74,
    location: "Varanasi, Uttar Pradesh",
    target_amount: "36000",
    raised_amount: "24500",
    supporters_count: 34,
    is_featured: true,
    is_urgent: false,
    cta_button_text: "Support Shanti Devi",
    short_description: "Shanti Devi was abandoned at a pilgrimage ghat without shelter. Sponsoring her provides clean shelter, nutritious meals, and medical care.",
    content: `74-year-old Shanti Devi was found frail, sick, and alone near the ghats of Varanasi after being abandoned by distant relatives. Our team brought her to a partner eldercare shelter where she now receives compassionate nursing, three hot meals daily, and ongoing arthritis care.`,
    featured_image_url: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1200&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1200&auto=format&fit=crop"],
    category: { id: "3", name: "Elder Shelter", slug: "elder-shelter" }
  },
  "elderly-medicine-fund-40-seniors": {
    id: "elder-sup-1",
    category_id: "3",
    title: "Life-Saving Monthly Medicines for 40 Destitute Seniors",
    slug: "elderly-medicine-fund-40-seniors",
    beneficiary_name: "Destitute Elders",
    beneficiary_age: 68,
    location: "Lucknow, Uttar Pradesh",
    target_amount: "48000",
    raised_amount: "32000",
    supporters_count: 42,
    is_featured: false,
    is_urgent: true,
    urgency_label: "Monthly Fund",
    cta_button_text: "Sponsor Medicines",
    short_description: "Provides cardiac pills, hypertension tablets, and diabetic insulin pens to 40 impoverished seniors.",
    content: `Chronic diseases like diabetes and hypertension are fatal without daily pills. For destitute elders living on streets or under bridges, ₹800 a month provides an uninterrupted medicine kit that keeps them alive and active.`,
    featured_image_url: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=800&auto=format&fit=crop"],
    category: { id: "3", name: "Geriatric Medicine", slug: "geriatric-medicine" }
  },
  "mobility-aids-wheelchairs-elders": {
    id: "elder-sup-2",
    category_id: "3",
    title: "Mobility Aids, Walkers & Wheelchairs for Bedridden Elders",
    slug: "mobility-aids-wheelchairs-elders",
    beneficiary_name: "Senior Citizens",
    beneficiary_age: 72,
    location: "Kanpur, Uttar Pradesh",
    target_amount: "30000",
    raised_amount: "19500",
    supporters_count: 22,
    is_featured: false,
    is_urgent: false,
    cta_button_text: "Gift Mobility",
    short_description: "Distribute 15 wheelchairs and 25 tripod walking sticks to elderly individuals who have lost independent mobility.",
    content: `A simple wheelchair or walker restores dignity, sunlight, and social interaction to seniors confined to small dark rooms. Help us distribute ergonomic mobility aids to 40 elderly individuals.`,
    featured_image_url: "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?q=80&w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?q=80&w=800&auto=format&fit=crop"],
    category: { id: "3", name: "Mobility Aids", slug: "mobility-aids" }
  },
  "winter-blankets-homeless-grandparents": {
    id: "elder-sup-3",
    category_id: "3",
    title: "Warm Winter Blankets & Thermal Sets for Homeless Grandparents",
    slug: "winter-blankets-homeless-grandparents",
    beneficiary_name: "Street Elders",
    beneficiary_age: null,
    location: "New Delhi & NCR",
    target_amount: "25000",
    raised_amount: "17800",
    supporters_count: 29,
    is_featured: false,
    is_urgent: false,
    cta_button_text: "Gift Warmth",
    short_description: "Distribute heavy quilted blankets, thermal woollens, and socks to destitute elders sleeping on winter pavements.",
    content: `Winter temperatures in North India fall below 4°C, posing life-threatening risks of hypothermia for elderly people without shelter. ₹400 provides a heavy fleece blanket and woollen cap set.`,
    featured_image_url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop"],
    category: { id: "3", name: "Winter Protection", slug: "winter-protection" }
  },

  // ─── 4. FOOD & HUNGER ─────────────────────────────────────────
  "daily-hot-meals-civil-hospital": {
    id: "food-feat-1",
    category_id: "4",
    title: "Nutritious Cooked Meals for Hospitalized Patients & Attendants",
    slug: "daily-hot-meals-civil-hospital",
    beneficiary_name: "Patients & Attendants",
    beneficiary_age: null,
    location: "Civil Hospital, Lucknow",
    target_amount: "50000",
    raised_amount: "38500",
    supporters_count: 54,
    is_featured: true,
    is_urgent: true,
    urgency_label: "300 Meals Daily",
    cta_button_text: "Sponsor Meals",
    short_description: "Serving fresh khichdi, dal, and roti packets daily to poor families sitting outside government hospital emergency wards.",
    content: `Families travelling from remote villages to government hospitals often sleep on footpaths outside and starve themselves to save money for patient medicines. Our food relief van serves freshly prepared dal, rice, roti, and vegetable meals to 300+ caregivers daily.`,
    featured_image_url: "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1200&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1200&auto=format&fit=crop"],
    category: { id: "4", name: "Hospital Food Relief", slug: "hospital-meals" }
  },
  "monthly-ration-kits-single-mothers": {
    id: "food-sup-1",
    category_id: "4",
    title: "Monthly Dry Ration Kits for Impoverished Single Mothers",
    slug: "monthly-ration-kits-single-mothers",
    beneficiary_name: "Widowed Mothers",
    beneficiary_age: null,
    location: "Gorakhpur, Uttar Pradesh",
    target_amount: "40000",
    raised_amount: "28000",
    supporters_count: 36,
    is_featured: false,
    is_urgent: false,
    cta_button_text: "Gift Ration Kit",
    short_description: "Provides wheat flour, rice, pulses, cooking oil, spices, and tea to 25 single-earner households.",
    content: `₹1,600 provides a 30-day comprehensive grocery kit containing 10kg wheat flour, 5kg rice, 2kg lentils, 1L cooking oil, sugar, and spices to keep a mother and her children fed with dignity.`,
    featured_image_url: "https://images.unsplash.com/photo-1594708767771-a7502209ff51?q=80&w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1594708767771-a7502209ff51?q=80&w=800&auto=format&fit=crop"],
    category: { id: "4", name: "Family Ration Kits", slug: "family-ration" }
  },
  "morning-nutrition-milk-egg-drive": {
    id: "food-sup-2",
    category_id: "4",
    title: "Morning Milk & Egg Nutrition Drive for Slum Children",
    slug: "morning-nutrition-milk-egg-drive",
    beneficiary_name: "Slum Children",
    beneficiary_age: 7,
    location: "Dharavi, Mumbai",
    target_amount: "35000",
    raised_amount: "24000",
    supporters_count: 31,
    is_featured: false,
    is_urgent: false,
    cta_button_text: "Feed a Child",
    short_description: "Deliver daily boiled eggs and fortified milk to 100 malnourished children before school.",
    content: `Malnutrition in early childhood leads to stunting and learning deficits. Our morning nutrition drive ensures 100 children receive boiled eggs, fortified milk, and fruit before attending morning classes.`,
    featured_image_url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop"],
    category: { id: "4", name: "Child Nutrition", slug: "child-nutrition" }
  },
  "emergency-food-packets-migrant-wagers": {
    id: "food-sup-3",
    category_id: "4",
    title: "Emergency Food Packets for Brick Kiln & Migrant Wagers",
    slug: "emergency-food-packets-migrant-wagers",
    beneficiary_name: "Migrant Labourers",
    beneficiary_age: null,
    location: "Noida & Greater Noida",
    target_amount: "30000",
    raised_amount: "21500",
    supporters_count: 27,
    is_featured: false,
    is_urgent: false,
    cta_button_text: "Sponsor Packets",
    short_description: "Distribute ready-to-eat meals and clean drinking water to migrant workers during extreme heat and monsoon halts.",
    content: `When seasonal rain or dust storms halt kiln work, migrant workers face days without pay or food rations. We deliver ready-to-eat vegetable biryani, glucose water, and bread packets to their settlements.`,
    featured_image_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop"],
    category: { id: "4", name: "Emergency Food Relief", slug: "emergency-food" }
  }
};

export function getFallbackCampaign(slug: string): FullCampaignData | null {
  if (!slug) return null;
  const normalized = slug.trim().toLowerCase();
  if (FALLBACK_CAMPAIGNS_REGISTRY[normalized]) {
    return FALLBACK_CAMPAIGNS_REGISTRY[normalized];
  }

  // Also check if any key ends with or starts with slug
  const entry = Object.entries(FALLBACK_CAMPAIGNS_REGISTRY).find(([key]) => 
    key === normalized || key.includes(normalized) || normalized.includes(key)
  );

  return entry ? entry[1] : null;
}
