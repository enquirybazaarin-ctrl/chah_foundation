const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedCompletedProjects() {
  console.log('--- Seeding Projects We Have Done ---');

  const projectsData = [
    // ─── CHILD EDUCATION ──────────────────────────────────────────
    {
      title: 'Project Shiksha: Transforming 172 Rural Learning Centers',
      slug: 'project-shiksha-rural-learning-centers',
      category: 'Child Education',
      location: 'Sitapur & Palghar Districts',
      short_description: 'Revitalizing underfunded community schools with digital learning aids, books, and clean water filtration.',
      description: 'Project Shiksha has equipped 172 rural schools with complete learning infrastructure, smart learning tablets, and trained volunteer teachers, boosting school retention by 42%.',
      impact_summary: '172 Centers · 14,500+ Children Enrolled',
      beneficiary_info: 'Primary school students in rural Uttar Pradesh & Maharashtra',
      status: 'ACTIVE',
      is_published: true,
      is_featured: true,
      sort_order: 1,
      cta_text: 'View Project',
      cta_link: '/projects/project-shiksha-rural-learning-centers',
      imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop',
    },
    {
      title: 'Digital Pragati: Solar-Powered Computer Labs in 45 Tribal Schools',
      slug: 'digital-pragati-solar-computer-labs',
      category: 'Child Education',
      location: 'Bastar, Chhattisgarh',
      short_description: 'Bringing modern IT education, basic coding, and digital literacy to tribal students for the first time.',
      description: 'Overcoming rural power outages through dedicated solar micro-grids, providing 45 tribal schools with operational computer labs and internet access.',
      impact_summary: '45 Labs · 3,800+ Tribal Students Trained',
      beneficiary_info: 'Underprivileged tribal youth',
      status: 'ACTIVE',
      is_published: true,
      is_featured: false,
      sort_order: 2,
      cta_text: 'View Project',
      cta_link: '/projects/digital-pragati-solar-computer-labs',
      imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=800&auto=format&fit=crop',
    },

    // ─── HEALTHCARE & SURGERIES ───────────────────────────────────
    {
      title: 'Sanjeevani Health Camps: 350+ Free Medical Care Drives',
      slug: 'sanjeevani-mobile-health-camps',
      category: 'Healthcare',
      location: 'Lucknow, Kanpur & Varanasi Slums',
      short_description: 'Deploying certified doctors, diagnostic tests, free prescription medicines, and pediatric screenings.',
      description: 'Our mobile medical vans travel to deep rural pockets and congested slum settlements twice every week, providing completely free consultations, diagnostics, and essential medicines.',
      impact_summary: '350+ Camps · 42,000+ Free Checkups',
      beneficiary_info: 'Slum families, elderly, and daily wagers',
      status: 'ACTIVE',
      is_published: true,
      is_featured: true,
      sort_order: 3,
      cta_text: 'View Project',
      cta_link: '/projects/sanjeevani-mobile-health-camps',
      imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop',
    },
    {
      title: 'Netra Jyoti Drive: 1,200+ Free Cataract Surgeries & Eye Glasses',
      slug: 'netra-jyoti-free-cataract-surgeries',
      category: 'Healthcare',
      location: 'Hardoi & Unnao Rural Blocks',
      short_description: 'Restoring sight to blind and visually impaired elderly citizens through free modern IOL surgeries.',
      description: 'In partnership with leading regional eye hospitals, we identified, transported, operated, and provided post-op care to over 1,200 rural elders suffering from reversible cataract blindness.',
      impact_summary: '1,200+ Restored Sights · 4,500 Spectacles Given',
      beneficiary_info: 'Destitute elderly grandparents',
      status: 'ACTIVE',
      is_published: true,
      is_featured: false,
      sort_order: 4,
      cta_text: 'View Project',
      cta_link: '/projects/netra-jyoti-free-cataract-surgeries',
      imageUrl: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=800&auto=format&fit=crop',
    },

    // ─── HUNGER RELIEF ───────────────────────────────────────────
    {
      title: 'Mission Annapurna: Over 2.5 Million Nutritious Meals Distributed',
      slug: 'mission-annapurna-meals-distribution',
      category: 'Hunger Relief',
      location: 'Delhi NCR, Mumbai & Lucknow',
      short_description: 'Continuous grassroots hunger relief providing freshly cooked, hygienic meals daily to urban slum dwellers.',
      description: 'Operating central community kitchens that prepare wholesome khichdi, dal, roti, and vegetables daily for destitute migrant wagers and children sleeping on streets.',
      impact_summary: '2.5M+ Meals Served · 12 Slum Hubs Covered',
      beneficiary_info: 'Destitute families & street dwellers',
      status: 'ACTIVE',
      is_published: true,
      is_featured: true,
      sort_order: 5,
      cta_text: 'View Project',
      cta_link: '/projects/mission-annapurna-meals-distribution',
      imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop',
    },
    {
      title: 'Poshan Aahar: Daily Fortified Milk & Eggs for 3,500 Slum Children',
      slug: 'poshan-aahar-child-nutrition-drive',
      category: 'Hunger Relief',
      location: 'Gomti Riverbank & East Delhi Slums',
      short_description: 'Morning nutrition drives providing fresh boiled milk, eggs, bananas, and high-protein biscuits to fight stunting.',
      description: 'Combating early childhood malnutrition and severe anaemia through structured 6-day weekly morning nutrition interventions in informal slum learning centers.',
      impact_summary: '3,500 Children Daily · 6 Days/Week',
      beneficiary_info: 'Malnourished children aged 2-12',
      status: 'ACTIVE',
      is_published: true,
      is_featured: false,
      sort_order: 6,
      cta_text: 'View Project',
      cta_link: '/projects/poshan-aahar-child-nutrition-drive',
      imageUrl: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=800&auto=format&fit=crop',
    },

    // ─── ELDER CARE ──────────────────────────────────────────────
    {
      title: 'Ashray Care Home: Dignified Shelter & 24/7 Care for 80 Elders',
      slug: 'ashray-care-home-destitute-elders',
      category: 'Elder Care',
      location: 'Vrindavan & Mathura, UP',
      short_description: 'Providing safe shelter, nutritious satvik food, on-site medical attention, and emotional warmth to abandoned seniors.',
      description: 'Ashray Care Home shelters destitute senior citizens and abandoned widows, ensuring their twilight years are filled with dignity, medical safety, and respect.',
      impact_summary: '80 Resident Seniors · 24/7 Medical Care',
      beneficiary_info: 'Abandoned senior citizens & widows',
      status: 'ACTIVE',
      is_published: true,
      is_featured: true,
      sort_order: 7,
      cta_text: 'View Project',
      cta_link: '/projects/ashray-care-home-destitute-elders',
      imageUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=800&auto=format&fit=crop',
    },
    {
      title: 'Warmth in Winter: 5,000+ Heavy Blankets & Thermal Relief Kits',
      slug: 'warmth-winter-relief-homeless-elders',
      category: 'Elder Care',
      location: 'Delhi, Varanasi & Prayagraj Pavements',
      short_description: 'Nightly rescue and relief drives delivering thick woollen blankets, sweaters, and thermals to protect against freezing cold.',
      description: 'During harsh North Indian cold waves, our midnight patrol vans distribute heavy blankets and thermal clothing directly to homeless elders sleeping on railway platforms and sidewalks.',
      impact_summary: '5,000+ Blankets · 18 Cities Reached',
      beneficiary_info: 'Homeless seniors & pavement dwellers',
      status: 'ACTIVE',
      is_published: true,
      is_featured: false,
      sort_order: 8,
      cta_text: 'View Project',
      cta_link: '/projects/warmth-winter-relief-homeless-elders',
      imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=800&auto=format&fit=crop',
    },

    // ─── WOMEN EMPOWERMENT ───────────────────────────────────────
    {
      title: 'Saksham Nari: Tailoring & Livelihood Centers for 240 Rural Women',
      slug: 'saksham-nari-women-livelihood-centers',
      category: 'Women Empowerment',
      location: 'Barabanki & Raebareli, UP',
      short_description: 'Vocational sewing, embroidery, and handicraft training helping marginalized women earn sustainable daily incomes.',
      description: 'Empowering underprivileged rural widows and young mothers with sewing machines, 6 months of master tailoring instruction, and direct market linkage for their apparel.',
      impact_summary: '240 Women Trained · ₹8,500 Avg Monthly Income',
      beneficiary_info: 'Underprivileged rural women & widows',
      status: 'ACTIVE',
      is_published: true,
      is_featured: false,
      sort_order: 9,
      cta_text: 'View Project',
      cta_link: '/projects/saksham-nari-women-livelihood-centers',
      imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop',
    },
    {
      title: 'Jal Swachhata: Clean Drinking Water Filtration in 28 Drought Villages',
      slug: 'jal-swachhata-clean-water-filtration',
      category: 'Women Empowerment',
      location: 'Bundelkhand & Marathwada',
      short_description: 'Community gravity filtration plants providing arsenic-free, fluorosis-free drinking water, freeing women from long treks.',
      description: 'Installing solar-powered reverse osmosis and gravity filtration systems, reducing water-borne diseases by 75% and saving rural women hours spent walking for potable water.',
      impact_summary: '28 Villages · 18,000 Villagers Benefited',
      beneficiary_info: 'Rural village communities',
      status: 'ACTIVE',
      is_published: true,
      is_featured: false,
      sort_order: 10,
      cta_text: 'View Project',
      cta_link: '/projects/jal-swachhata-clean-water-filtration',
      imageUrl: 'https://images.unsplash.com/photo-1594708767771-a7502209ff51?q=80&w=800&auto=format&fit=crop',
    },
  ];

  for (const p of projectsData) {
    // 1. Ensure Media record exists
    let media = await prisma.media.findFirst({
      where: { url: p.imageUrl }
    });
    if (!media) {
      media = await prisma.media.create({
        data: {
          filename: `${p.slug}.jpg`,
          url: p.imageUrl,
          mime_type: 'image/jpeg',
          file_size: 150000,
        }
      });
    }

    // 2. Upsert Project
    const existing = await prisma.project.findFirst({
      where: { slug: p.slug }
    });

    const projectData = {
      title: p.title,
      slug: p.slug,
      category: p.category,
      location: p.location,
      short_description: p.short_description,
      description: p.description,
      impact_summary: p.impact_summary,
      beneficiary_info: p.beneficiary_info,
      status: p.status,
      is_published: p.is_published,
      is_featured: p.is_featured,
      sort_order: p.sort_order,
      cta_text: p.cta_text,
      cta_link: p.cta_link,
      featured_image_id: media.id,
    };

    if (existing) {
      await prisma.project.update({
        where: { id: existing.id },
        data: projectData,
      });
      console.log(`Updated project: ${p.title}`);
    } else {
      await prisma.project.create({
        data: projectData,
      });
      console.log(`Created project: ${p.title}`);
    }
  }

  console.log('--- Successfully seeded all 10 completed projects across 5 categories ---');
}

seedCompletedProjects()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
