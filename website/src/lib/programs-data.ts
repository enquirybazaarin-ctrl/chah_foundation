export interface ProgramData {
  id: string;
  slug: string;
  title: string;
  category: string;
  tagline: string;
  heroImage: string;
  whyDescription: string;
  whyPoints?: { title: string; desc: string }[];
  whatWeDoDescription: string;
  whatWeDoInitiatives?: { title: string; desc: string }[];
  impactStats?: { label: string; value: string }[];
  galleryImages: {
    url: string;
    caption: string;
    alt: string;
  }[];
  beneficiaryInfo?: string;
  location?: string;
}

export const PROGRAMS_REGISTRY: Record<string, ProgramData> = {
  "education-support-drive": {
    id: "education-support-drive",
    slug: "education-support-drive",
    title: "Education Support Drive",
    category: "Child Education & Literacy",
    tagline: "Empowering Underprivileged Children Through Accessible Quality Learning",
    heroImage: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1600&auto=format&fit=crop",
    whyDescription:
      "Millions of children in India drop out of schools every year not due to lack of ambition, but because their families cannot afford basic school bags, textbooks, notebooks, and uniforms. Without foundational education, young children remain trapped in generational poverty, child labour, and vulnerability.",
    whyPoints: [
      {
        title: "Poverty & High Dropout Rates",
        desc: "Over 30 million children in marginalized communities lack foundational schooling access due to financial constraints."
      },
      {
        title: "Lack of Learning Materials",
        desc: "A missing notebook or pen is often the sole reason a child discontinues going to primary school."
      },
      {
        title: "Breaking Generational Cycles",
        desc: "Educating one child lifts an entire family and neighbourhood out of extreme poverty for generations to come."
      }
    ],
    whatWeDoDescription:
      "Our Education Support Drive bridges this gap by directly providing complete annual academic kits, tuition support, digital learning aids, and volunteer teacher mentoring across urban slums and rural hamlets. We coordinate with schools, parents, and community leaders to ensure 100% classroom retention.",
    whatWeDoInitiatives: [
      {
        title: "Annual Educational Kit Distribution",
        desc: "Providing durable school bags, notebooks, geometry sets, stationary, and uniforms before every academic term."
      },
      {
        title: "Remedial & Evening Learning Centers",
        desc: "Conducting after-school tuition sessions for first-generation learners who need personalized academic guidance."
      },
      {
        title: "Parental Counselling & School Enrollment",
        desc: "Persuading daily wage parents to enroll their children instead of sending them to informal labour."
      },
      {
        title: "Digital Literacy & Smart Classrooms",
        desc: "Equipping community classrooms with educational tablets and multimedia learning modules."
      }
    ],
    impactStats: [
      { label: "Children Enrolled", value: "14,500+" },
      { label: "Learning Kits Distributed", value: "25,000+" },
      { label: "Active Learning Centers", value: "170+" },
      { label: "States Covered", value: "15 States" }
    ],
    galleryImages: [
      {
        url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800&auto=format&fit=crop",
        caption: "Students receiving brand new textbooks and backpacks",
        alt: "Children holding new school kits"
      },
      {
        url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=800&auto=format&fit=crop",
        caption: "Volunteer teachers mentoring kids in community evening center",
        alt: "Volunteer teaching underprivileged students"
      },
      {
        url: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=800&auto=format&fit=crop",
        caption: "Interactive classroom session on foundational mathematics",
        alt: "Kids happily studying together"
      },
      {
        url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop",
        caption: "School distribution drive in rural Maharashtra settlement",
        alt: "School kit distribution drive"
      }
    ],
    beneficiaryInfo: "Underprivileged children aged 5-16 across 15 states in India",
    location: "Mumbai, Thane, Pune, Delhi NCR, and rural blocks"
  },

  "health-support-drive": {
    id: "health-support-drive",
    slug: "health-support-drive",
    title: "Health Support Drive",
    category: "Pediatric & Community Healthcare",
    tagline: "Free Medical Care, Diagnostics, and Hospital on Wheels for Vulnerable Communities",
    heroImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1600&auto=format&fit=crop",
    whyDescription:
      "Preventable illnesses, malnutrition, and unmonitored chronic diseases threaten millions of children and elders living in slums and remote villages. With private healthcare being unaffordable and government centers overcrowded, delayed medical care often turns simple ailments into life-threatening emergencies.",
    whyPoints: [
      {
        title: "Prohibitive Healthcare Costs",
        desc: "Over 70% of low-income families incur debt or skip treatment due to expensive medicine and diagnostic costs."
      },
      {
        title: "Early Detection Deficit",
        desc: "Congenital deformities, pediatric issues, and elder illnesses go undetected without regular doorstep checkups."
      },
      {
        title: "Special Needs Vulnerability",
        desc: "Physically challenged children rarely receive early corrective therapy or medical assistive gear."
      }
    ],
    whatWeDoDescription:
      "Our Health Support Drive deploys certified medical doctors, nurses, mobile clinics ('Hospital on Wheels'), and diagnostic equipment directly to doorsteps. We provide free consultations, distribute essential medicines, sponsor corrective surgeries for children with disabilities, and organize specialized pediatric health camps.",
    whatWeDoInitiatives: [
      {
        title: "Hospital on Wheels (Mobile Health Units)",
        desc: "Fully equipped mobile medical vans conducting on-site checkups and diagnostics twice weekly in urban slums."
      },
      {
        title: "Free Medicine & Supplement Distribution",
        desc: "Dispensing free prescription medicines, antibiotics, vitamins, and deworming treatments."
      },
      {
        title: "Physically Challenged Children Care",
        desc: "Providing mobility aids, wheelchairs, prosthetics, and sponsoring life-changing corrective surgeries."
      },
      {
        title: "Hospital Partnership & Emergency Sponsorship",
        desc: "Covering hospital admission and treatment costs for destitute patients in partner hospitals."
      }
    ],
    impactStats: [
      { label: "Free Consultations", value: "42,000+" },
      { label: "Mobile Health Camps", value: "350+" },
      { label: "Surgeries Sponsored", value: "120+" },
      { label: "Beneficiaries Served", value: "15 States" }
    ],
    galleryImages: [
      {
        url: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=800&auto=format&fit=crop",
        caption: "Doctor conducting thorough pediatric health screening",
        alt: "Pediatric checkup by volunteer physician"
      },
      {
        url: "https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=800&auto=format&fit=crop",
        caption: "Mobile van dispensing free essential medicines to slum residents",
        alt: "Free medicine distribution at mobile health camp"
      },
      {
        url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop",
        caption: "Corrective assessment for physically challenged children",
        alt: "Doctor evaluating young child with special needs"
      },
      {
        url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=800&auto=format&fit=crop",
        caption: "Healthcare awareness and hygiene session in local community",
        alt: "Community health awareness session"
      }
    ],
    beneficiaryInfo: "Street children, daily wage earners, and destitute elders",
    location: "Pan-India across 15 States with daily hubs in Mumbai and Uttar Pradesh"
  },

  "dog-food-donation-drive": {
    id: "dog-food-donation-drive",
    slug: "dog-food-donation-drive",
    title: "Dog Food Donation Drive",
    category: "Animal Welfare & Compassion",
    tagline: "Nourishing and Protecting Community Animals Who Have No One to Speak for Them",
    heroImage: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?q=80&w=1600&auto=format&fit=crop",
    whyDescription:
      "Stray dogs and community animals often scavenge in garbage heaps, suffering from chronic malnutrition, skin diseases, vehicle collisions, and cruelty. In urban environments where hotels and street stalls discard food without compassion, countless stray dogs face starvation daily.",
    whyPoints: [
      {
        title: "Severe Urban Hunger",
        desc: "Street animals go days without clean water and balanced food, causing aggressive malnutrition."
      },
      {
        title: "Lack of Basic Veterinary Care",
        desc: "Minor wounds from street accidents quickly become septic and fatal without basic first aid."
      },
      {
        title: "Coexistence & Compassion",
        desc: "Feeding and caring for community animals creates peaceful, rabies-free, and compassionate neighbourhoods."
      }
    ],
    whatWeDoDescription:
      "Our Dog Food Donation Drive mobilizes dedicated volunteers and field vehicles to prepare and distribute hygienic, protein-rich dog food, fresh water, and basic medical care across identified street clusters every day. We also facilitate vaccination, wound dressing, and emergency rescue assistance.",
    whatWeDoInitiatives: [
      {
        title: "Daily Street Feeding Rounds",
        desc: "Preparing wholesome meals of rice, broth, dog food, and boiled eggs distributed twice daily."
      },
      {
        title: "Clean Water Bowl Placement",
        desc: "Installing cement and terracotta water bowls outside shops, parks, and housing societies."
      },
      {
        title: "On-Street Wound Dressing & First Aid",
        desc: "Administering antiseptic sprays, maggot wound treatment, and skin disease ointments."
      },
      {
        title: "Anti-Rabies Vaccination & Neutering Ties",
        desc: "Partnering with animal welfare centers for immunization and humane population management."
      }
    ],
    impactStats: [
      { label: "Strays Fed Daily", value: "1,200+" },
      { label: "Wounded Dogs Treated", value: "450+" },
      { label: "Water Bowls Installed", value: "800+" },
      { label: "Volunteer Feeders", value: "75+" }
    ],
    galleryImages: [
      {
        url: "https://images.unsplash.com/photo-1544568100-847a948585b9?q=80&w=800&auto=format&fit=crop",
        caption: "Volunteers feeding nutritious meals to community stray dogs",
        alt: "Volunteers feeding stray dogs on the street"
      },
      {
        url: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=800&auto=format&fit=crop",
        caption: "Healthy and well-nourished stray resting peacefully after meal",
        alt: "Happy dog after meal"
      },
      {
        url: "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?q=80&w=800&auto=format&fit=crop",
        caption: "Water bowls installed in commercial market areas",
        alt: "Dog drinking from volunteer water bowl"
      },
      {
        url: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=800&auto=format&fit=crop",
        caption: "First-aid application for injured street dog in rescue vehicle",
        alt: "Volunteer treating wounded animal"
      }
    ],
    beneficiaryInfo: "Community animals, street dogs, and abandoned pets",
    location: "Mumbai, Navi Mumbai, Thane, and suburban highways"
  },

  "celebrations": {
    id: "celebrations",
    slug: "celebrations",
    title: "Celebrations Drive",
    category: "Occasion-Based Giving",
    tagline: "Sharing the Joy of Birthdays, Anniversaries, and Festivals with Needy Children & Elders",
    heroImage: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1600&auto=format&fit=crop",
    whyDescription:
      "While many celebrate milestones with lavish spending, millions of children in shelters and elders in old-age homes have never had anyone celebrate their birthdays or festive days. Bringing celebrations to those who feel forgotten restores their dignity and fills their hearts with warmth.",
    whyPoints: [
      {
        title: "Emotional Wellbeing",
        desc: "Feeling remembered on special days combats chronic loneliness and childhood depression."
      },
      {
        title: "Meaningful Milestones",
        desc: "Turning personal joy into grassroots giving creates memories far more fulfilling than traditional parties."
      },
      {
        title: "Intergenerational Joy",
        desc: "Bringing young donors and elderly residents together creates heartwarming smiles and lifelong memories."
      }
    ],
    whatWeDoDescription:
      "Through Celebrations with CHAH, donors can sponsor feasts, cake-cuttings, gift distributions, and festive clothing for children in orphanages and elders in care shelters on their birthdays, anniversaries, or festival days. We document the celebrations and share personalised recognition cards with donors.",
    whatWeDoInitiatives: [
      {
        title: "Birthday Feasts & Cake Cutting",
        desc: "Organizing cake cuttings, balloon decor, and delicious hot meals for children and senior citizens."
      },
      {
        title: "Festival Gift Hampers",
        desc: "Distributing new clothes, sweets, and festival gifts during Diwali, Eid, Christmas, and New Year."
      },
      {
        title: "Milestone Campaign Sharing",
        desc: "Enabling donors to create personal fundraising pages so friends and family can donate in their honour."
      },
      {
        title: "Personalised Digital Recognition Cards",
        desc: "Delivering custom impact cards and photos showcasing the exact joy created on the ground."
      }
    ],
    impactStats: [
      { label: "Celebrations Hosted", value: "650+" },
      { label: "Children & Elders Delighted", value: "18,000+" },
      { label: "Festival Hampers Delivered", value: "9,500+" },
      { label: "Occasion Donors", value: "1,200+" }
    ],
    galleryImages: [
      {
        url: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=800&auto=format&fit=crop",
        caption: "Birthday cake cutting celebrated with orphan shelter children",
        alt: "Children smiling around birthday cake"
      },
      {
        url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800&auto=format&fit=crop",
        caption: "Festival gift hampers distributed to happy kids",
        alt: "Kids holding festival gifts"
      },
      {
        url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800&auto=format&fit=crop",
        caption: "Senior citizens enjoying warm treats during festive gathering",
        alt: "Elders laughing and celebrating"
      },
      {
        url: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=800&auto=format&fit=crop",
        caption: "Community feast organized on donor's wedding anniversary",
        alt: "Community feast celebration"
      }
    ],
    beneficiaryInfo: "Shelter children, underprivileged youth, and senior citizens",
    location: "Partner shelter homes across 15 states"
  },

  "blanket-donation-drive": {
    id: "blanket-donation-drive",
    slug: "blanket-donation-drive",
    title: "Blanket Donation Drive",
    category: "Winter Survival & Street Relief",
    tagline: "Protecting Pavement Dwellers and Fragile Elders from Severe Cold Waves",
    heroImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1600&auto=format&fit=crop",
    whyDescription:
      "During North and Central Indian winters, night temperatures plummet dangerously. Without proper shelter or heating, thousands of homeless families, newborn babies, and fragile elders sleep on bare railway platforms and pavements, risking hypothermia, pneumonia, and cold-related fatalities.",
    whyPoints: [
      {
        title: "Life-Threatening Cold Waves",
        desc: "Severe winter drops temperatures below 4°C, posing mortal danger to unprotected street dwellers."
      },
      {
        title: "Elder & Infant Vulnerability",
        desc: "Weak immune systems make homeless infants and grandparents critically susceptible to severe respiratory infections."
      },
      {
        title: "Dignity in Freezing Conditions",
        desc: "A thick warm blanket is an immediate lifesaver and a shield of human dignity during dark freezing nights."
      }
    ],
    whatWeDoDescription:
      "Our Blanket Donation Drive operates midnight relief squads that traverse roads, railway stations, flyover pavements, and rural settlements to directly wrap homeless children, mothers, and elderly persons in high-grade thermal woollen blankets, caps, and socks.",
    whatWeDoInitiatives: [
      {
        title: "Midnight Relief Patrols",
        desc: "Deploying volunteer vans between 11 PM and 4 AM to deliver blankets directly to those sleeping on cold footpaths."
      },
      {
        title: "Heavy Woollen Thermal Blankets",
        desc: "Procuring durable, heavy-gauge thermal blankets specifically engineered to withstand biting winter winds."
      },
      {
        title: "Winter Kits for Slum Children",
        desc: "Providing woollen sweaters, thermal inners, woollen caps, and socks to school-going children in slums."
      },
      {
        title: "Rural Shelter Support",
        desc: "Supplying blankets to rural old age homes and leper colonies without adequate insulation."
      }
    ],
    impactStats: [
      { label: "Blankets Distributed", value: "32,000+" },
      { label: "Midnight Patrols", value: "180+" },
      { label: "Children Kept Warm", value: "12,500+" },
      { label: "States Covered", value: "8 Winter States" }
    ],
    galleryImages: [
      {
        url: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop",
        caption: "Volunteers handing warm blankets to homeless elders at night",
        alt: "Blanket distribution during winter night"
      },
      {
        url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop",
        caption: "Young children wrapped warmly in heavy woollen blankets",
        alt: "Children protected from cold"
      },
      {
        url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=800&auto=format&fit=crop",
        caption: "Stock of high-grade woollen blankets prepared for night distribution",
        alt: "Blanket bundles ready for deployment"
      },
      {
        url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
        caption: "Elder grandmother smiling with relief after receiving warm quilt",
        alt: "Elderly woman with new warm blanket"
      }
    ],
    beneficiaryInfo: "Homeless families, footpath dwellers, railway platform residents, and rural elders",
    location: "Delhi NCR, Uttar Pradesh, Bihar, Rajasthan, Jharkhand, and Maharashtra"
  },

  "women-empowerment-drive": {
    id: "women-empowerment-drive",
    slug: "women-empowerment-drive",
    title: "Women Empowerment Drive",
    category: "Skill Development & Self-Reliance",
    tagline: "Empowering Underprivileged Women Through Livelihood Skills, Health, and Financial Literacy",
    heroImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1600&auto=format&fit=crop",
    whyDescription:
      "When a woman is financially independent, her children go to school, family nutrition improves, and domestic vulnerability decreases. In low-income communities, millions of capable women lack marketable skills, access to seed capital, or sanitary health awareness to secure dignified livelihoods.",
    whyPoints: [
      {
        title: "Economic Dependence",
        desc: "Lack of independent income leaves underprivileged women vulnerable to financial stress and exploitation."
      },
      {
        title: "Unmet Menstrual Hygiene Needs",
        desc: "Millions still lack access to hygienic sanitary products, compromising reproductive health and dignity."
      },
      {
        title: "Multiplier Impact",
        desc: "Every rupee earned by an empowered mother is reinvested into her children's education and health."
      }
    ],
    whatWeDoDescription:
      "We establish vocational training centers in tailoring, handicrafts, computer basics, and home business entrepreneurship. Concurrently, we conduct menstrual hygiene awareness drives, distribute free eco-friendly sanitary kits, and guide self-help groups towards micro-savings.",
    whatWeDoInitiatives: [
      {
        title: "Vocational Sewing & Tailoring Centers",
        desc: "Providing certified training and sewing machines so women can earn sustainable incomes from home."
      },
      {
        title: "Menstrual Hygiene & Health Camps",
        desc: "Educating adolescent girls and women on menstrual health and distributing free sanitary napkin supplies."
      },
      {
        title: "Financial Literacy & Banking Access",
        desc: "Guiding women through opening individual bank accounts, government welfare schemes, and micro-loans."
      },
      {
        title: "Self-Help Group (SHG) Mentorship",
        desc: "Helping collectives produce and market artisanal items, papads, and eco-friendly shopping bags."
      }
    ],
    impactStats: [
      { label: "Women Trained", value: "3,800+" },
      { label: "Tailoring Units Given", value: "650+" },
      { label: "Sanitary Kits Distributed", value: "45,000+" },
      { label: "Independent Earners", value: "2,200+" }
    ],
    galleryImages: [
      {
        url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
        caption: "Women learning advanced stitching techniques at our training center",
        alt: "Women at sewing training center"
      },
      {
        url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop",
        caption: "Menstrual hygiene workshop and free kit distribution in village",
        alt: "Hygiene awareness camp for women"
      },
      {
        url: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=800&auto=format&fit=crop",
        caption: "Proud graduate receiving certification and sewing machine grant",
        alt: "Woman receiving vocational certificate"
      },
      {
        url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop",
        caption: "Self-help group displaying handcrafted products at community fair",
        alt: "Handicrafts made by empowered women"
      }
    ],
    beneficiaryInfo: "Mothers, young women, widows, and domestic workers in marginalized slums",
    location: "Maharashtra, Uttar Pradesh, Bihar, and Jharkhand"
  },

  "environment-drive": {
    id: "environment-drive",
    slug: "environment-drive",
    title: "Environment Drive",
    category: "Tree Plantation & Clean Communities",
    tagline: "Restoring Green Cover, Clean Air, and Eco-Awareness for Future Generations",
    heroImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1600&auto=format&fit=crop",
    whyDescription:
      "Rapid urbanisation, toxic air pollution, and deforestation directly degrade the health of vulnerable children and senior citizens who lack air purifiers and medical shields. Protecting our environment is not an optional luxury—it is fundamental to human survival and health.",
    whyPoints: [
      {
        title: "Severe Air Quality Crisis",
        desc: "Over 85% of urban children in Indian cities suffer from reduced lung capacity due to particulate pollution."
      },
      {
        title: "Loss of Urban Green Canopy",
        desc: "Concrete expansion has stripped shade and clean oxygen from congested slum neighbourhoods."
      },
      {
        title: "Plastic & Waste Choking Slums",
        desc: "Open garbage dumping breeds waterborne infections, malaria, and toxic smoke from burning plastic."
      }
    ],
    whatWeDoDescription:
      "Our Environment Drive plants native, climate-resilient trees (Neem, Peepal, Banyan, Jamun) across schools, parks, and roadside belts. We organize community clean-up drives, teach waste segregation in schools, and install rainwater harvesting systems in drought-prone villages.",
    whatWeDoInitiatives: [
      {
        title: "Native Tree Plantation Drives",
        desc: "Planting saplings with protective tree guards and guaranteed 3-year nurturing by local caretakers."
      },
      {
        title: "Clean Neighborhood Clean-Up Campaigns",
        desc: "Mobilizing youth volunteers to clear plastic waste from water bodies, parks, and school surroundings."
      },
      {
        title: "School Eco-Clubs & Environmental Education",
        desc: "Engaging students in seed-ball making, composting, and water preservation techniques."
      },
      {
        title: "Distribution of Cloth & Jute Bags",
        desc: "Replacing single-use plastic bags in community bazaars with reusable cloth bags."
      }
    ],
    impactStats: [
      { label: "Trees Planted & Nurtured", value: "28,000+" },
      { label: "Clean-up Drives", value: "110+" },
      { label: "School Eco-Clubs", value: "45+" },
      { label: "Plastic Waste Cleared", value: "18 Tons" }
    ],
    galleryImages: [
      {
        url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop",
        caption: "Volunteers and school students planting native Neem saplings",
        alt: "Tree plantation drive"
      },
      {
        url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=800&auto=format&fit=crop",
        caption: "Youth volunteers conducting riverbank plastic collection drive",
        alt: "Clean-up drive volunteers"
      },
      {
        url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop",
        caption: "Green canopy restored in community primary school compound",
        alt: "Green school compound with trees"
      },
      {
        url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop",
        caption: "Children happily watering newly planted fruit saplings",
        alt: "Kids watering young saplings"
      }
    ],
    beneficiaryInfo: "Urban communities, school students, and future generations",
    location: "Delhi NCR, Maharashtra, Rajasthan, and Uttarakhand"
  },

  "help-for-the-blind-drive": {
    id: "help-for-the-blind-drive",
    slug: "help-for-the-blind-drive",
    title: "Help for the Blind Drive",
    category: "Visual Impairment & Eye Care",
    tagline: "Restoring Vision, Independence, and Dignity to Visually Impaired Citizens",
    heroImage: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=1600&auto=format&fit=crop",
    whyDescription:
      "India is home to the world's largest visually impaired population, yet over 80% of blindness is preventable or curable with timely cataract surgery or refractive correction. Destitute elders and children without vision support face extreme isolation, injury risks, and utter dependence on others.",
    whyPoints: [
      {
        title: "Preventable Blindness Crisis",
        desc: "Cataracts and uncorrected refractive errors rob thousands of their sight solely due to unaffordable surgery costs."
      },
      {
        title: "Loss of Independent Mobility",
        desc: "Without white canes and audio tools, visually impaired individuals cannot navigate streets safely."
      },
      {
        title: "Educational Barriers",
        desc: "Blind children drop out of learning centers due to lack of Braille books and specialized audio learning kits."
      }
    ],
    whatWeDoDescription:
      "Our Help for the Blind Drive conducts free comprehensive eye checkup camps, sponsors 100% free cataract surgeries with modern intraocular lens (IOL) implants, distributes smart white canes, and provides Braille learning kits and assistive technologies to blind students.",
    whatWeDoInitiatives: [
      {
        title: "Free Cataract Surgeries & IOL Implants",
        desc: "Identifying elderly cataract patients in rural villages, transporting them to partner hospitals, and covering all surgery and post-op costs."
      },
      {
        title: "Prescription Glasses & Diagnostics",
        desc: "Testing vision and distributing custom-powered prescription spectacles free of charge."
      },
      {
        title: "Smart White Canes & Mobility Assistive Gear",
        desc: "Distributing ergonomic sensory white canes to visually challenged youth and adults."
      },
      {
        title: "Braille Kits & Audio Educational Aids",
        desc: "Supplying Braille slates, styluses, and audio study devices to blind students in special schools."
      }
    ],
    impactStats: [
      { label: "Cataract Surgeries Sponsored", value: "1,200+" },
      { label: "Spectacles Distributed", value: "8,500+" },
      { label: "White Canes Provided", value: "1,400+" },
      { label: "Eye Camps Organized", value: "160+" }
    ],
    galleryImages: [
      {
        url: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=800&auto=format&fit=crop",
        caption: "Eye surgeon conducting detailed examination during rural screening camp",
        alt: "Doctor examining elderly patient eye"
      },
      {
        url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop",
        caption: "Elder grandfather trying on his new high-power prescription glasses",
        alt: "Elderly man testing new spectacles"
      },
      {
        url: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=800&auto=format&fit=crop",
        caption: "Young student receiving sensory white cane and mobility orientation",
        alt: "Student holding white cane"
      },
      {
        url: "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?q=80&w=800&auto=format&fit=crop",
        caption: "Patients smiling brightly after bandage removal following successful surgery",
        alt: "Post surgery smiling patient"
      }
    ],
    beneficiaryInfo: "Visually impaired elders, blind students, and rural patients suffering from cataracts",
    location: "Hardoi, Unnao, Varanasi, Thane, and rural Maharashtra"
  },

  "old-age-support-drive": {
    id: "old-age-support-drive",
    slug: "old-age-support-drive",
    title: "Old Age Support Drive",
    category: "Elder Care & Dignity",
    tagline: "Restoring Dignity, Medical Support, and Companionship to India's Disadvantaged Elders",
    heroImage: "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?q=80&w=1600&auto=format&fit=crop",
    whyDescription:
      "India has over 138 million elderly persons, millions of whom face extreme neglect, loneliness, and physical infirmity. As joint family systems evolve, many aging parents are abandoned without pensions, medicine, or emotional care, spending their sunset years in distressing poverty and isolation.",
    whyPoints: [
      {
        title: "138 Million Aging Population",
        desc: "As dependency grows, vast numbers of senior citizens lack family support or basic geriatric healthcare."
      },
      {
        title: "Destitution & Abandonment",
        desc: "Without regular pensions or savings, elderly persons struggle for even two basic meals and medicines."
      },
      {
        title: "Crippling Loneliness",
        desc: "Emotional isolation deeply harms the mental and physical well-being of seniors who long for human warmth."
      }
    ],
    whatWeDoDescription:
      "Our Old Age Support Drive provides direct monthly nutrition rations, geriatric medical consultations, mobility aids (walkers, wheelchairs, walking sticks), and volunteer companionship visits to abandoned elders and partner old-age homes across India.",
    whatWeDoInitiatives: [
      {
        title: "Monthly Elder Nutrition & Ration Kits",
        desc: "Delivering wholesome monthly packets of rice, atta, dal, cooking oil, spices, and tea to destitute elders."
      },
      {
        title: "Doorstep Geriatric Healthcare & Medicines",
        desc: "Monitoring blood pressure, blood sugar, arthritis pain, and supplying free chronic medications."
      },
      {
        title: "Day-Care Support & Companionship Sessions",
        desc: "Creating listening circles, storytelling hours, and intergenerational exchanges with youth volunteers."
      },
      {
        title: "Advocacy for Universal Senior Pension & Rights",
        desc: "Helping older citizens complete documentation for government old-age pensions and legal protection against abuse."
      }
    ],
    impactStats: [
      { label: "Elders Supported Monthly", value: "3,200+" },
      { label: "Ration Kits Delivered", value: "48,000+" },
      { label: "Care Shelters Supported", value: "26 Centers" },
      { label: "States Impacted", value: "15 States" }
    ],
    galleryImages: [
      {
        url: "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?q=80&w=800&auto=format&fit=crop",
        caption: "Elder grandmother smiling warmly during our monthly doorstep ration visit",
        alt: "Senior woman with happy expression"
      },
      {
        url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop",
        caption: "Volunteer spending comforting time listening to elder grandfather's memories",
        alt: "Volunteer talking to elderly gentleman"
      },
      {
        url: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=800&auto=format&fit=crop",
        caption: "Free geriatric health screening for blood sugar and cardiac health",
        alt: "Doctor checking elderly pulse"
      },
      {
        url: "https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=800&auto=format&fit=crop",
        caption: "Mobility walkers and ergonomic canes handed over to seniors",
        alt: "Elderly receiving walking aids"
      }
    ],
    beneficiaryInfo: "Destitute senior citizens, abandoned grandmothers, and residents of old-age homes",
    location: "Pan-India footprint across 15 States with active centers in Mumbai, Pune, and Delhi"
  },

  "food-distribution-outside-the-hospital": {
    id: "food-distribution-outside-the-hospital",
    slug: "food-distribution-outside-the-hospital",
    title: "Food Distribution Outside the Hospital",
    category: "Hunger Relief & Patient Family Care",
    tagline: "Free Hygienic Hot Meals for Impoverished Patient Attendants Outside Public Hospitals",
    heroImage: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1600&auto=format&fit=crop",
    whyDescription:
      "When a poor family travels hundreds of kilometers to large public hospitals for cancer, cardiac, or pediatric treatment, they exhaust every penny on transport and medicines. While patients receive hospital beds, their accompanying relatives sleep on footpaths and routinely starve to save money for treatment.",
    whyPoints: [
      {
        title: "Family Caregivers Going Hungry",
        desc: "Relatives caring for critically ill loved ones often skip meals for days to afford daily medicines."
      },
      {
        title: "Displacement & Hopelessness",
        desc: "Forced to sleep on hospital pavements without cooking facilities, families have nowhere to turn."
      },
      {
        title: "Nutrition Maintains Caregiving Strength",
        desc: "A hot, hygienic meal restores physical stamina and psychological strength to caregivers when they need it most."
      }
    ],
    whatWeDoDescription:
      "Every single afternoon and evening, our mobile meal kitchens park directly outside major government and cancer hospitals. We serve fresh, steaming hot, nutrient-dense meals (dal, rice, roti, vegetables, and khichdi) to thousands of patient families and street dwellers with zero charge and complete respect.",
    whatWeDoInitiatives: [
      {
        title: "Daily Hot Meal Distribution at Hospital Gates",
        desc: "Serving freshly cooked meals twice daily outside prominent government hospital campuses."
      },
      {
        title: "Nutritionally Balanced Diet",
        desc: "Meals formulated with lentils, seasonal vegetables, whole grains, and protein to sustain caregiver health."
      },
      {
        title: "Hygienic Central Kitchen Preparation",
        desc: "Prepared in certified hygienic kitchens adhering to high standards of food safety and sanitation."
      },
      {
        title: "Emergency Water & Nutrition Supplements",
        desc: "Providing clean drinking water bottles and fortified milk packets to patient children outside clinics."
      }
    ],
    impactStats: [
      { label: "Meals Served Annually", value: "3,50,000+" },
      { label: "Hospital Gates Covered", value: "14 Hospitals" },
      { label: "Caregivers Fed Daily", value: "1,500+" },
      { label: "Active Days/Year", value: "365 Days" }
    ],
    galleryImages: [
      {
        url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop",
        caption: "Volunteers serving fresh hot khichdi and roti to patient attendants outside hospital",
        alt: "Food distribution outside hospital"
      },
      {
        url: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=800&auto=format&fit=crop",
        caption: "Patient relatives receiving clean packaged meals with smiles of relief",
        alt: "Patient family receiving meals"
      },
      {
        url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800&auto=format&fit=crop",
        caption: "Central kitchen team preparing nutritious dal and vegetables early morning",
        alt: "Hygienic kitchen preparation"
      },
      {
        url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop",
        caption: "Distributing water bottles and fruit packets to children waiting outside OPD",
        alt: "Distributing fruits and water outside clinic"
      }
    ],
    beneficiaryInfo: "Patient attendants, impoverished family caregivers, and destitute OPD visitors",
    location: "Outside premier civil, regional, and cancer hospitals in Mumbai, Delhi, and Lucknow"
  }
};

export function getAllProgramSlugs(): string[] {
  return Object.keys(PROGRAMS_REGISTRY);
}

export function getProgramBySlugFromRegistry(slug: string): ProgramData | null {
  return PROGRAMS_REGISTRY[slug] || null;
}
