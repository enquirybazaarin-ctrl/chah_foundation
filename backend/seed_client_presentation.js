const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getOrCreateMedia(url, filename) {
  let media = await prisma.media.findFirst({ where: { url } });
  if (!media) {
    media = await prisma.media.create({
      data: {
        filename: filename || 'project_image.jpg',
        url: url,
        mime_type: 'image/jpeg',
        file_size: 150000
      }
    });
  }
  return media;
}

async function main() {
  console.log('--- SEEDING PRESENTATION DATA ---');

  // 1. Ensure Categories exist
  const categoriesData = [
    { name: 'Medical Emergency', slug: 'medical-emergency', description: 'Emergency medical aid and life-saving treatments' },
    { name: 'Education & School Support', slug: 'education', description: 'Empowering children with education and school kits' },
    { name: 'Elder Care', slug: 'elder-care', description: 'Shelter, healthcare, and dignity for elderly' },
    { name: 'Food And Hunger', slug: 'food-and-hunger', description: 'Fighting malnutrition with daily meals and ration kits' },
    { name: 'Relief Funds', slug: 'relief-funds', description: 'Disaster response and emergency assistance' },
  ];

  const categoryMap = {};
  for (const cat of categoriesData) {
    const existing = await prisma.campaignCategory.findFirst({ where: { slug: cat.slug } });
    if (existing) {
      categoryMap[cat.slug] = existing;
    } else {
      const created = await prisma.campaignCategory.create({ data: cat });
      categoryMap[cat.slug] = created;
    }
  }

  // 2. Seed/Update Medical Campaigns
  const medicalCampaigns = [
    {
      title: "Help Dhrupad fight Leukaemia",
      slug: "help-dhrupad-leukaemia",
      category_id: categoryMap['medical-emergency'].id,
      short_description: "Help Dhrupad fight T-cell Acute Lymphoblastic Leukaemia (T-ALL), a blood cancer. A stem cell transplant is his best chance to be well again.",
      target_amount: 9000000,
      raised_amount: 7920426,
      status: "ACTIVE",
      featured_image_url: "https://images.unsplash.com/photo-1536856136534-bb679c52a9aa?q=80&w=1200&auto=format&fit=crop",
      supporters_count: 394,
      is_featured: true,
      is_urgent: true,
      urgency_label: "5 days left",
      cta_button_text: "Donate Now",
      content: `<p><strong>Dhrupad Rishav Mahanta</strong> is fighting <strong>T-cell Acute Lymphoblastic Leukaemia (T-ALL)</strong>. A stem cell transplant at CMC Vellore is urgently required. Over 390 donors have joined hands, help us reach the goal.</p>`
    },
    {
      title: "Urgent Open-Heart Surgery for 4-Year-Old Ananya",
      slug: "urgent-heart-surgery-baby-ananya",
      category_id: categoryMap['medical-emergency'].id,
      short_description: "Little Ananya was diagnosed with a critical congenital heart defect (Tetralogy of Fallot). She urgently needs corrective surgery to survive.",
      target_amount: 450000,
      raised_amount: 312500,
      status: "ACTIVE",
      featured_image_url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop",
      supporters_count: 142,
      is_featured: true,
      is_urgent: true,
      urgency_label: "3 days left",
      cta_button_text: "Donate Now",
      content: `<p>4-year-old Ananya breathes with difficulty every single day due to a severe congenital heart defect. Doctors at Apollo Hospital have scheduled urgent surgery. Her father is an autorickshaw driver who cannot afford the treatment.</p>`
    },
    {
      title: "Help Baby Reyansh Undergo Critical Spinal Treatment",
      slug: "help-baby-reyansh-spinal-treatment",
      category_id: categoryMap['medical-emergency'].id,
      short_description: "11-month-old Reyansh is battling progressive Spinal Muscular Atrophy and needs urgent intensive supportive medical therapy.",
      target_amount: 1200000,
      raised_amount: 845000,
      status: "ACTIVE",
      featured_image_url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop",
      supporters_count: 280,
      is_featured: false,
      is_urgent: true,
      urgency_label: "7 days left",
      cta_button_text: "Donate Now",
      content: `<p>Baby Reyansh's muscles are weakening rapidly due to Spinal Muscular Atrophy. Intensive physiotherapy and specialized respiratory support can save his life.</p>`
    }
  ];

  for (const camp of medicalCampaigns) {
    const existing = await prisma.campaign.findFirst({ where: { slug: camp.slug } });
    if (existing) {
      await prisma.campaign.update({
        where: { id: existing.id },
        data: camp
      });
      console.log('Updated medical campaign:', camp.slug);
    } else {
      await prisma.campaign.create({ data: camp });
      console.log('Created medical campaign:', camp.slug);
    }
  }

  // 3. Seed/Update Education Campaigns
  const educationCampaigns = [
    {
      title: "Help Amit continue his education & dream of becoming an engineer",
      slug: "help-amit-continue-education",
      category_id: categoryMap['education'].id,
      short_description: "Amit scored 94% in his high school exams but his family faces extreme financial distress. Support his college tuition.",
      target_amount: 85000,
      raised_amount: 62000,
      status: "ACTIVE",
      featured_image_url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop",
      supporters_count: 48,
      is_featured: true,
      is_urgent: false,
      urgency_label: "Ongoing",
      cta_button_text: "Donate Now",
      content: `<p>Amit is an exceptionally bright student from a rural village. Your support pays for his annual tuition fees, books, and hostel stay.</p>`
    },
    {
      title: "Back-to-School Kits & Digital Tablets for 250 Tribal Children",
      slug: "help-veena-school-kit",
      category_id: categoryMap['education'].id,
      short_description: "Provide bags, notebooks, geometry boxes, uniforms, and learning materials to underprivileged students.",
      target_amount: 150000,
      raised_amount: 112000,
      status: "ACTIVE",
      featured_image_url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=800&auto=format&fit=crop",
      supporters_count: 76,
      is_featured: true,
      is_urgent: false,
      urgency_label: "Ongoing",
      cta_button_text: "Donate Now",
      content: `<p>Each kit costs just Rs 600 and covers an entire academic year's stationery, bag, and notebooks for an impoverished child.</p>`
    },
    {
      title: "Help Bharti continue school after losing her father",
      slug: "help-bharti-continue-school",
      category_id: categoryMap['education'].id,
      short_description: "Bharti wants to complete 10th grade and fulfill her father's dream of an educated life. Stand by her family.",
      target_amount: 45000,
      raised_amount: 38500,
      status: "ACTIVE",
      featured_image_url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop",
      supporters_count: 32,
      is_featured: false,
      is_urgent: true,
      urgency_label: "Urgent",
      cta_button_text: "Donate Now",
      content: `<p>Bharti is a dedicated 9th standard student. Without sponsorship, she would be forced to discontinue her schooling to work as a domestic helper.</p>`
    }
  ];

  for (const camp of educationCampaigns) {
    const existing = await prisma.campaign.findFirst({ where: { slug: camp.slug } });
    if (existing) {
      await prisma.campaign.update({
        where: { id: existing.id },
        data: camp
      });
      console.log('Updated education campaign:', camp.slug);
    } else {
      await prisma.campaign.create({ data: camp });
      console.log('Created education campaign:', camp.slug);
    }
  }

  // 4. Seed/Update Elder Care Campaigns
  const elderCampaigns = [
    {
      title: "Support Abandoned Elderly with Safe Shelter, Food & Compassion",
      slug: "support-abandoned-elderly-shelter-food",
      category_id: categoryMap['elder-care'].id,
      short_description: "Provide shelter, warm beds, clean clothing, and 3 nutritious meals daily to 40 destitute senior citizens living in our elder home.",
      target_amount: 300000,
      raised_amount: 215000,
      status: "ACTIVE",
      featured_image_url: "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?q=80&w=800&auto=format&fit=crop",
      supporters_count: 114,
      is_featured: true,
      is_urgent: false,
      urgency_label: "Monthly Goal",
      cta_button_text: "Donate Now",
      content: `<p>Elderly citizens abandoned on the streets find safety, healthcare, nutritious food, and dignified care at our senior care shelter.</p>`
    },
    {
      title: "Free Healthcare, Regular Medicines & Physiotherapy for Seniors",
      slug: "healthcare-medicine-support-senior-citizens",
      category_id: categoryMap['elder-care'].id,
      short_description: "Supply monthly BP, diabetes, cardiac medicines, and mobility aids like walkers and wheelchairs to indigent elders.",
      target_amount: 180000,
      raised_amount: 142000,
      status: "ACTIVE",
      featured_image_url: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=800&auto=format&fit=crop",
      supporters_count: 85,
      is_featured: true,
      is_urgent: false,
      urgency_label: "Active Care",
      cta_button_text: "Donate Now",
      content: `<p>Monthly medicine packages ensure our senior residents manage diabetes, hypertension, and arthritis without pain.</p>`
    },
    {
      title: "Warm Blankets & Thermal Winter Kits for Homeless Destitute Elders",
      slug: "warm-blankets-winter-care-destitute-elders",
      category_id: categoryMap['elder-care'].id,
      short_description: "Protect fragile seniors sleeping on footpaths from severe winter cold with heavy fleece blankets and thermal sweaters.",
      target_amount: 120000,
      raised_amount: 98000,
      status: "ACTIVE",
      featured_image_url: "https://images.unsplash.com/photo-1516307365426-bea591f05011?q=80&w=800&auto=format&fit=crop",
      supporters_count: 67,
      is_featured: false,
      is_urgent: true,
      urgency_label: "Winter Drive",
      cta_button_text: "Donate Now",
      content: `<p>A single blanket kit of Rs 500 keeps an elderly grandfather or grandmother warm and safe throughout the winter nights.</p>`
    }
  ];

  for (const camp of elderCampaigns) {
    const existing = await prisma.campaign.findFirst({ where: { slug: camp.slug } });
    if (existing) {
      await prisma.campaign.update({
        where: { id: existing.id },
        data: camp
      });
      console.log('Updated elder campaign:', camp.slug);
    } else {
      await prisma.campaign.create({ data: camp });
      console.log('Created elder campaign:', camp.slug);
    }
  }

  // 5. Seed/Update Food & Hunger Campaigns
  const foodCampaigns = [
    {
      title: "Daily Hot Nutritious Meals for 1,000 Destitute & Homeless Citizens",
      slug: "feed-hungry-daily-nutritious-meals",
      category_id: categoryMap['food-and-hunger'].id,
      short_description: "Our community kitchen cooks and serves wholesome meals (dal, rice, sabzi, roti) outside government hospitals and slum areas.",
      target_amount: 500000,
      raised_amount: 384000,
      status: "ACTIVE",
      featured_image_url: "https://images.unsplash.com/photo-1593113580332-ce288d6168e9?q=80&w=800&auto=format&fit=crop",
      supporters_count: 210,
      is_featured: true,
      is_urgent: false,
      urgency_label: "Ongoing",
      cta_button_text: "Donate Now",
      content: `<p>Every meal costs just Rs 35. Over 1,000 hungry individuals receive hot, hygienic food every day through our food distribution vans.</p>`
    },
    {
      title: "Monthly Dry Ration Kits for 200 Impoverished Widow-Headed Families",
      slug: "emergency-ration-kits-impoverished-families",
      category_id: categoryMap['food-and-hunger'].id,
      short_description: "Each ration kit contains 15kg flour, 10kg rice, 3kg pulses, cooking oil, spices, and tea to sustain a family of 4 for a month.",
      target_amount: 250000,
      raised_amount: 198000,
      status: "ACTIVE",
      featured_image_url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop",
      supporters_count: 94,
      is_featured: true,
      is_urgent: false,
      urgency_label: "Monthly Drive",
      cta_button_text: "Donate Now",
      content: `<p>A dry ration kit of Rs 1,200 ensures an impoverished family does not go to sleep on an empty stomach for a whole month.</p>`
    },
    {
      title: "Hospital Food Aid for Caregivers of Critical Underprivileged Patients",
      slug: "hospital-food-distribution-patient-families",
      category_id: categoryMap['food-and-hunger'].id,
      short_description: "Families camping outside public hospitals often starve while spending every rupee on medicine. Provide them fresh daily meals.",
      target_amount: 150000,
      raised_amount: 128000,
      status: "ACTIVE",
      featured_image_url: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=800&auto=format&fit=crop",
      supporters_count: 82,
      is_featured: false,
      is_urgent: true,
      urgency_label: "Hospital Care",
      cta_button_text: "Donate Now",
      content: `<p>Caregivers traveling hundreds of kilometers to metropolitan hospitals stay on pavements. We serve them warm food twice daily.</p>`
    }
  ];

  for (const camp of foodCampaigns) {
    const existing = await prisma.campaign.findFirst({ where: { slug: camp.slug } });
    if (existing) {
      await prisma.campaign.update({
        where: { id: existing.id },
        data: camp
      });
      console.log('Updated food campaign:', camp.slug);
    } else {
      await prisma.campaign.create({ data: camp });
      console.log('Created food campaign:', camp.slug);
    }
  }

  // 6. Seed Impact Projects in prisma.project with Media references
  console.log('\n--- SEEDING IMPACT PROJECTS ---');
  const project1Media = await getOrCreateMedia("https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop", "mission_annapurna.jpg");
  const project2Media = await getOrCreateMedia("https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop", "project_shiksha.jpg");
  const project3Media = await getOrCreateMedia("https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop", "sanjeevani_health.jpg");

  const impactProjects = [
    {
      title: "Mission Annapurna: Over 2.5 Million Nutritious Meals Distributed Across Slums",
      slug: "mission-annapurna-meals-distribution",
      category: "HUNGER RELIEF",
      short_description: "A continuous grassroots food security initiative providing freshly cooked, hygienic meals to vulnerable urban slum dwellers.",
      description: "Mission Annapurna operates daily community kitchens and mobile distribution vans across key municipal slum pockets, ensuring zero malnutrition among children and seniors.",
      location: "Mumbai, Thane & Navi Mumbai",
      status: "ACTIVE",
      is_published: true,
      is_featured: true,
      sort_order: 1,
      featured_image_id: project1Media.id,
      cta_text: "Read Full Story",
      cta_link: "/impact"
    },
    {
      title: "Project Shiksha: Transforming 172 Rural Learning Centers with Books & Tech",
      slug: "project-shiksha-rural-learning-centers",
      category: "CHILD EDUCATION",
      short_description: "Revitalizing underfunded community schools with digital learning aids, clean water filtration, and full academic supplies.",
      description: "By equipping rural schools with clean sanitation and modern learning kits, Project Shiksha has improved attendance by 42% across 172 centers.",
      location: "Palghar & Raigad Districts",
      status: "ACTIVE",
      is_published: true,
      is_featured: false,
      sort_order: 2,
      featured_image_id: project2Media.id,
      cta_text: "Read Full Story",
      cta_link: "/impact"
    },
    {
      title: "Sanjeevani Health Camps: 350+ Free Medical Screening & Care Drives",
      slug: "sanjeevani-mobile-health-camps",
      category: "HEALTHCARE",
      short_description: "Deploying certified doctors, diagnostic tests, free prescription drugs, and cataract surgeries to remote underserved areas.",
      description: "Over 350 health camps organized to date, providing preventative health diagnostics and life-saving early detection to more than 10,000 citizens.",
      location: "Maharashtra & Gujarat Borders",
      status: "ACTIVE",
      is_published: true,
      is_featured: false,
      sort_order: 3,
      featured_image_id: project3Media.id,
      cta_text: "Read Full Story",
      cta_link: "/impact"
    }
  ];

  for (const proj of impactProjects) {
    const existing = await prisma.project.findFirst({ where: { slug: proj.slug } });
    if (existing) {
      await prisma.project.update({
        where: { id: existing.id },
        data: proj
      });
      console.log('Updated project:', proj.slug);
    } else {
      await prisma.project.create({ data: proj });
      console.log('Created project:', proj.slug);
    }
  }

  // 7. Ensure Impact Section Settings
  await prisma.setting.upsert({
    where: { setting_key: 'impact_section_settings' },
    update: {
      setting_value: JSON.stringify({
        badge: "OUR IMPACT",
        heading: "Real work. Real communities. Real change.",
        subheading: "Explore some of the initiatives we have carried out with communities and the people we serve."
      })
    },
    create: {
      setting_key: 'impact_section_settings',
      setting_value: JSON.stringify({
        badge: "OUR IMPACT",
        heading: "Real work. Real communities. Real change.",
        subheading: "Explore some of the initiatives we have carried out with communities and the people we serve."
      })
    }
  });

  // 8. Seed/Update Metrics in DB (ImpactMetric model)
  console.log('\n--- SEEDING ENDEAVOUR METRICS ---');
  const metricsData = [
    { metric_name: "Meals Served", metric_value: "2.5M+", icon: "Utensils" },
    { metric_name: "People Reached", metric_value: "10,000+", icon: "Users" },
    { metric_name: "Schools & Communities", metric_value: "172+", icon: "School" },
    { metric_name: "Healthcare Camps", metric_value: "350+", icon: "Hospital" }
  ];

  for (const m of metricsData) {
    const existing = await prisma.impactMetric.findFirst({ where: { metric_name: m.metric_name } });
    if (existing) {
      await prisma.impactMetric.update({
        where: { id: existing.id },
        data: m
      });
      console.log('Updated metric:', m.metric_name);
    } else {
      await prisma.impactMetric.create({ data: m });
      console.log('Created metric:', m.metric_name);
    }
  }

  // 9. Update Section Settings for Our Endeavour
  await prisma.setting.upsert({
    where: { setting_key: 'our_endeavour_settings' },
    update: {
      setting_value: JSON.stringify({
        badge: "OUR IMPACT",
        heading: "Our Endeavour As NGO",
        description: "At our core, we believe a food-secure society helps unlock its true potential. We are not only nourishing bodies but also opening doors to better education, health and prosperity for fellow citizens. Together, we can pave the way for a future where every vulnerable has an equal chance to thrive.",
        cta_text: "Join Our Cause",
        cta_link: "/donate",
        updated_as_on: "04/10/2026"
      })
    },
    create: {
      setting_key: 'our_endeavour_settings',
      setting_value: JSON.stringify({
        badge: "OUR IMPACT",
        heading: "Our Endeavour As NGO",
        description: "At our core, we believe a food-secure society helps unlock its true potential. We are not only nourishing bodies but also opening doors to better education, health and prosperity for fellow citizens. Together, we can pave the way for a future where every vulnerable has an equal chance to thrive.",
        cta_text: "Join Our Cause",
        cta_link: "/donate",
        updated_as_on: "04/10/2026"
      })
    }
  });

  console.log('\n--- ALL PRESENTATION DUMMY DATA SEEDED SUCCESSFULLY! ---');
}

main()
  .catch((e) => {
    console.error('Error seeding presentation data:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
