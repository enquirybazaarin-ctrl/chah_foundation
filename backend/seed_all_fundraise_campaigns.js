const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedAllFundraiseCampaigns() {
  console.log('--- Seeding all campaigns for Fundraise for a Cause section ---');

  // 1. Ensure categories
  const categoriesData = [
    { name: 'Medical Emergency', slug: 'medical-emergency', description: 'Urgent medical support for life-threatening illnesses' },
    { name: 'Education', slug: 'education', description: 'Child education and schooling support' },
    { name: 'Elder Care', slug: 'elder-care', description: 'Compassionate elder care and shelter support' },
    { name: 'Food & Hunger', slug: 'food-and-hunger', description: 'Feeding the hungry and malnutrition relief' },
  ];

  const catMap = {};
  for (const cat of categoriesData) {
    let existing = await prisma.campaignCategory.findFirst({ where: { slug: cat.slug } });
    if (!existing) {
      existing = await prisma.campaignCategory.create({ data: cat });
    } else {
      await prisma.campaignCategory.update({
        where: { id: existing.id },
        data: { name: cat.name, description: cat.description }
      });
    }
    catMap[cat.slug] = existing;
  }

  // 2. All 16 campaigns with realistic presentation data and relevant imagery
  const campaigns = [
    // ─── MEDICAL EMERGENCY ───────────────────────────────────────────────
    {
      title: 'Urgent Open-Heart Surgery for 4-Year-Old Ananya',
      slug: 'urgent-heart-surgery-baby-ananya',
      category_id: catMap['medical-emergency'].id,
      beneficiary_name: 'Baby Ananya',
      beneficiary_age: 4,
      location: 'AIIMS, New Delhi',
      short_description: 'Baby Ananya is diagnosed with severe Tetralogy of Fallot and requires immediate open-heart surgery to survive.',
      content: '4-year-old Ananya was born with a severe congenital heart defect. In recent weeks her oxygen saturation has dropped dangerously. Doctors at AIIMS have advised emergency cardiac surgery. Her father, an auto driver, cannot arrange the requisite hospital funds alone. Your timely donation can save this little angel’s life.',
      target_amount: new Prisma.Decimal(450000),
      raised_amount: new Prisma.Decimal(312000),
      supporters_count: 142,
      is_featured: true,
      is_urgent: true,
      urgency_label: '3 Days Left',
      cta_button_text: 'Help Ananya',
      featured_image_url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop',
      sort_order: 1,
      status: 'ACTIVE',
    },
    {
      title: 'Help 8-Year-Old Dhrupad Fight Leukaemia with Chemotherapy',
      slug: 'help-dhrupad-leukaemia',
      category_id: catMap['medical-emergency'].id,
      beneficiary_name: 'Dhrupad',
      beneficiary_age: 8,
      location: 'CMC Hospital, Vellore',
      short_description: 'Dhrupad is battling Acute Lymphoblastic Leukaemia and needs 6 months of urgent intensive chemotherapy sessions.',
      content: 'Dhrupad dreams of returning to school and playing cricket with his friends. Diagnosed with aggressive blood cancer, his chemotherapy protocol at CMC Vellore costs more than his family can ever afford. Please donate to help Dhrupad win his fight against cancer.',
      target_amount: new Prisma.Decimal(1200000),
      raised_amount: new Prisma.Decimal(890000),
      supporters_count: 394,
      is_featured: false,
      is_urgent: true,
      urgency_label: 'Critical Care',
      cta_button_text: 'Help Dhrupad',
      featured_image_url: 'https://images.unsplash.com/photo-1536856136534-bb679c52a9aa?q=80&w=1200&auto=format&fit=crop',
      sort_order: 2,
      status: 'ACTIVE',
    },
    {
      title: 'Help Baby Reyansh Undergo Critical Spinal Treatment',
      slug: 'help-baby-reyansh-spinal-treatment',
      category_id: catMap['medical-emergency'].id,
      beneficiary_name: 'Baby Reyansh',
      beneficiary_age: 1,
      location: 'Apollo Hospital, Chennai',
      short_description: 'Baby Reyansh suffers from progressive spinal muscular atrophy. Timely neurological intervention is his only hope.',
      content: 'Reyansh is just 18 months old and unable to move his limbs without agonizing pain. Specialized neuro-rehab and corrective surgery can halt the nerve degeneration. His daily wage earner parents need our collective generosity.',
      target_amount: new Prisma.Decimal(950000),
      raised_amount: new Prisma.Decimal(675000),
      supporters_count: 280,
      is_urgent: true,
      urgency_label: 'Immediate Surgery',
      cta_button_text: 'Help Reyansh',
      featured_image_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop',
      sort_order: 3,
      status: 'ACTIVE',
    },
    {
      title: 'Urgent Dialysis & Kidney Transplant for Ramesh, Sole Family Earner',
      slug: 'urgent-kidney-transplant-ramesh',
      category_id: catMap['medical-emergency'].id,
      beneficiary_name: 'Ramesh',
      beneficiary_age: 38,
      location: 'KGMU Hospital, Lucknow',
      short_description: 'Ramesh suffers from end-stage renal failure. A matched donor is ready; funds are urgently needed for surgical costs.',
      content: 'As the sole breadwinner for his mother, wife, and two school-going daughters, Ramesh’s life hanging by a thread threatens the entire household. A kidney donor has been approved, and the surgery must take place this month.',
      target_amount: new Prisma.Decimal(650000),
      raised_amount: new Prisma.Decimal(420000),
      supporters_count: 165,
      is_urgent: true,
      urgency_label: 'Donor Matched',
      cta_button_text: 'Help Ramesh',
      featured_image_url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=800&auto=format&fit=crop',
      sort_order: 4,
      status: 'ACTIVE',
    },

    // ─── EDUCATION ────────────────────────────────────────────────────────
    {
      title: 'Help Amit Continue His Education & Dream of Becoming an Engineer',
      slug: 'help-amit-continue-education',
      category_id: catMap['education'].id,
      beneficiary_name: 'Amit',
      beneficiary_age: 11,
      location: 'Sitapur, Uttar Pradesh',
      short_description: 'Amit is a meritorious 6th-grade student who faces school dropout without annual tuition, uniform, and books support.',
      content: 'Amit scored 96% in his 5th-grade board examination. His father’s modest roadside bicycle repair shop closed during personal tragedy, leaving school fees unpaid. With our sponsorship, Amit can stay in school and achieve his engineering dream.',
      target_amount: new Prisma.Decimal(85000),
      raised_amount: new Prisma.Decimal(62000),
      supporters_count: 68,
      is_featured: true,
      is_urgent: true,
      urgency_label: '5 Days Left',
      cta_button_text: 'Help Amit',
      featured_image_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop',
      sort_order: 1,
      status: 'ACTIVE',
    },
    {
      title: 'Back-to-School Kits & Digital Tablets for 250 Tribal Children',
      slug: 'back-to-school-tribal-children-kits',
      category_id: catMap['education'].id,
      beneficiary_name: '250 Tribal Students',
      beneficiary_age: 9,
      location: 'Bastar District, Chhattisgarh',
      short_description: 'Equipping underprivileged tribal kids with sturdy school bags, stationery, shoes, solar study lamps, and basic tablets.',
      content: 'Remote tribal settlements face massive primary dropout rates when families cannot buy basic notebooks and uniforms. This initiative outfits 250 youngsters with annual learning kits and community digital tablets to make education exciting.',
      target_amount: new Prisma.Decimal(150000),
      raised_amount: new Prisma.Decimal(112000),
      supporters_count: 112,
      is_urgent: false,
      urgency_label: 'School Reopening',
      cta_button_text: 'Sponsor a Kit',
      featured_image_url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop',
      sort_order: 2,
      status: 'ACTIVE',
    },
    {
      title: 'Help Bharti Continue Her Higher Secondary Schooling',
      slug: 'help-bharti-continue-school',
      category_id: catMap['education'].id,
      beneficiary_name: 'Bharti',
      beneficiary_age: 13,
      location: 'Barabanki, Uttar Pradesh',
      short_description: 'Bharti ranks top of her class in science and dreams of becoming a doctor. After losing her father, sponsorship keeps her in school.',
      content: 'Bharti refuses to let poverty derail her ambition. Her single mother works as an agricultural laborer earning barely ₹120 a day. Annual sponsorship covers tuition, state board exam fees, and textbooks.',
      target_amount: new Prisma.Decimal(65000),
      raised_amount: new Prisma.Decimal(48500),
      supporters_count: 54,
      is_urgent: true,
      urgency_label: 'Fee Deadline Near',
      cta_button_text: 'Help Bharti',
      featured_image_url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop',
      sort_order: 3,
      status: 'ACTIVE',
    },
    {
      title: 'Smart Learning Classrooms & Computer Lab for Rural Girls',
      slug: 'smart-learning-computer-lab-girls',
      category_id: catMap['education'].id,
      beneficiary_name: '120 Rural Girls',
      beneficiary_age: 14,
      location: 'Rae Bareli, Uttar Pradesh',
      short_description: 'Setting up 10 refurbished computers, internet access, and digital literacy classes for first-generation girl learners.',
      content: 'Bridging the rural digital divide: this project establishes a dedicated solar-powered computer lab inside a rural government school, opening up STEM pathways and online learning for over 120 girls.',
      target_amount: new Prisma.Decimal(120000),
      raised_amount: new Prisma.Decimal(86000),
      supporters_count: 79,
      is_urgent: false,
      urgency_label: 'Phase 2 Launch',
      cta_button_text: 'Support Lab',
      featured_image_url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=800&auto=format&fit=crop',
      sort_order: 4,
      status: 'ACTIVE',
    },

    // ─── ELDER CARE ───────────────────────────────────────────────────────
    {
      title: 'Support Abandoned Elderly with Safe Shelter, Warm Food & Compassion',
      slug: 'support-abandoned-elderly-shelter-food',
      category_id: catMap['elder-care'].id,
      beneficiary_name: '45 Abandoned Elders',
      beneficiary_age: 72,
      location: 'Vrindavan, Uttar Pradesh',
      short_description: 'Providing destitute elderly women and abandoned seniors with clean shelter, three hot daily meals, and loving care.',
      content: 'Hundreds of elderly individuals find themselves homeless in their final years. CHAH Foundation provides clean dormitory shelter, doctor visits, nutritious satvik meals, and a community of respect and love.',
      target_amount: new Prisma.Decimal(300000),
      raised_amount: new Prisma.Decimal(215000),
      supporters_count: 184,
      is_featured: true,
      is_urgent: true,
      urgency_label: 'Shelter Support',
      cta_button_text: 'Support Elders',
      featured_image_url: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=800&auto=format&fit=crop',
      sort_order: 1,
      status: 'ACTIVE',
    },
    {
      title: 'Free Healthcare, Regular Medicines & Physiotherapy for Destitute Seniors',
      slug: 'healthcare-medicine-support-senior-citizens',
      category_id: catMap['elder-care'].id,
      beneficiary_name: '80 Senior Citizens',
      beneficiary_age: 68,
      location: 'Lucknow & Kanpur, UP',
      short_description: 'Monthly supplies of diabetes, hypertension, and arthritis medicines along with on-site doctor consultations.',
      content: 'Chronic pain and neglected chronic illnesses rob seniors of peace. We deliver monthly prescribed medicines, mobility walkers, hearing aids, and weekly physiotherapy sessions right to their doorsteps.',
      target_amount: new Prisma.Decimal(180000),
      raised_amount: new Prisma.Decimal(142000),
      supporters_count: 126,
      is_urgent: false,
      urgency_label: 'Monthly Medical Need',
      cta_button_text: 'Provide Medicines',
      featured_image_url: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=800&auto=format&fit=crop',
      sort_order: 2,
      status: 'ACTIVE',
    },
    {
      title: 'Warm Winter Blankets, Sweaters & Thermal Kits for Homeless Elders',
      slug: 'warm-blankets-winter-care-destitute-elders',
      category_id: catMap['elder-care'].id,
      beneficiary_name: '200 Homeless Elders',
      beneficiary_age: 70,
      location: 'Delhi NCR & Varanasi',
      short_description: 'Distributing heavy woollen blankets, thermal innerwear, socks, and warm bedding to elders sleeping on city footpaths.',
      content: 'North Indian winters are unforgiving for frail seniors without roofs over their heads. Our nightly outreach teams distribute premium thick woollen blankets, thermals, and hot tea to safeguard them against hypothermia.',
      target_amount: new Prisma.Decimal(120000),
      raised_amount: new Prisma.Decimal(98000),
      supporters_count: 92,
      is_urgent: true,
      urgency_label: 'Winter Relief',
      cta_button_text: 'Gift Warmth',
      featured_image_url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=800&auto=format&fit=crop',
      sort_order: 3,
      status: 'ACTIVE',
    },
    {
      title: 'Free Cataract Surgeries & Vision Glasses for 150 Impoverished Seniors',
      slug: 'cataract-surgery-vision-grandparents',
      category_id: catMap['elder-care'].id,
      beneficiary_name: '150 Needy Grandparents',
      beneficiary_age: 65,
      location: 'Hardoi & Sitapur Rural',
      short_description: 'Restoring the gift of clear eyesight through modern IOL lens replacement surgeries and customized prescription glasses.',
      content: 'Treatable cataracts have forced over 150 rural grandparents into total darkness, rendering them dependent on others. In partnership with eye hospitals, ₹1,000 covers one complete cataract surgery and eye drops.',
      target_amount: new Prisma.Decimal(150000),
      raised_amount: new Prisma.Decimal(108000),
      supporters_count: 104,
      is_urgent: true,
      urgency_label: 'Surgery Camp',
      cta_button_text: 'Restore Vision',
      featured_image_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop',
      sort_order: 4,
      status: 'ACTIVE',
    },

    // ─── FOOD & HUNGER ────────────────────────────────────────────────────
    {
      title: 'Daily Hot Nutritious Meals for 1,000 Destitute & Homeless Citizens',
      slug: 'feed-hungry-daily-nutritious-meals',
      category_id: catMap['food-and-hunger'].id,
      beneficiary_name: '1,000 Citizens Daily',
      beneficiary_age: 0,
      location: 'Slum Clusters, Delhi & Lucknow',
      short_description: 'Freshly cooked wholesome meals consisting of dal, rice, seasonal vegetables, and rotis served every afternoon.',
      content: 'No one should go to sleep on an empty stomach. CHAH Foundation operates community kitchens that prepare wholesome, hygienic meals served with dignity to destitute families, migrant laborers, and homeless citizens.',
      target_amount: new Prisma.Decimal(500000),
      raised_amount: new Prisma.Decimal(384000),
      supporters_count: 290,
      is_featured: true,
      is_urgent: true,
      urgency_label: 'Zero Hunger Drive',
      cta_button_text: 'Sponsor Meals',
      featured_image_url: 'https://images.unsplash.com/photo-1617870952348-7524edfb61b7?q=80&w=800&auto=format&fit=crop',
      sort_order: 1,
      status: 'ACTIVE',
    },
    {
      title: 'Monthly Dry Ration Kits for 200 Impoverished Widow-Headed Families',
      slug: 'emergency-ration-kits-impoverished-families',
      category_id: catMap['food-and-hunger'].id,
      beneficiary_name: '200 Vulnerable Families',
      beneficiary_age: 0,
      location: 'Unnao & Barabanki, UP',
      short_description: 'Each family kit supplies 15kg wheat flour, 10kg rice, 3kg pulses, cooking oil, spices, and tea to sustain a household for a month.',
      content: 'Widowed mothers struggling with unstable wages often skip meals so their children can eat. Our monthly grocery hampers bring food security and nutrition into 200 vulnerable homes.',
      target_amount: new Prisma.Decimal(250000),
      raised_amount: new Prisma.Decimal(198000),
      supporters_count: 145,
      is_urgent: false,
      urgency_label: 'Monthly Ration Drive',
      cta_button_text: 'Gift a Ration Kit',
      featured_image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop',
      sort_order: 2,
      status: 'ACTIVE',
    },
    {
      title: 'Hospital Food Aid for Caregivers of Critical Underprivileged Patients',
      slug: 'hospital-food-distribution-patient-families',
      category_id: catMap['food-and-hunger'].id,
      beneficiary_name: '500 Patient Attendants',
      beneficiary_age: 0,
      location: 'Government Hospital Wards, Lucknow',
      short_description: 'Providing hot, hygienic packed lunch and dinner boxes to poor family caregivers waiting outside emergency hospital ICUs.',
      content: 'Families travelling from remote villages to government hospitals spend all their money on medicines and cannot afford food. We distribute packed hot thalis twice daily directly to these exhausted patient attendants.',
      target_amount: new Prisma.Decimal(150000),
      raised_amount: new Prisma.Decimal(128000),
      supporters_count: 110,
      is_urgent: true,
      urgency_label: 'Daily ICU Outreach',
      cta_button_text: 'Support Food Aid',
      featured_image_url: 'https://images.unsplash.com/photo-1594708767771-a7502209ff51?q=80&w=800&auto=format&fit=crop',
      sort_order: 3,
      status: 'ACTIVE',
    },
    {
      title: 'Mid-Day Nutrition, Fresh Milk & Fruit Drives for Malnourished Slum Kids',
      slug: 'mid-day-nutrition-milk-slum-kids',
      category_id: catMap['food-and-hunger'].id,
      beneficiary_name: '350 Slum Children',
      beneficiary_age: 6,
      location: 'Gomti Riverbank Slums',
      short_description: 'Daily fortified nutrition: fresh boiled milk, eggs, bananas, and high-protein biscuits to fight childhood stunting and anaemia.',
      content: 'Early childhood malnutrition causes irreversible cognitive and physical developmental delays. This morning nutrition drive provides 350 slum children with warm boiled milk, bananas, and protein supplements 6 days a week.',
      target_amount: new Prisma.Decimal(120000),
      raised_amount: new Prisma.Decimal(94500),
      supporters_count: 88,
      is_urgent: false,
      urgency_label: 'Child Nutrition Week',
      cta_button_text: 'Feed a Child',
      featured_image_url: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=800&auto=format&fit=crop',
      sort_order: 4,
      status: 'ACTIVE',
    },
  ];

  for (const c of campaigns) {
    const existing = await prisma.campaign.findFirst({ where: { slug: c.slug } });
    if (existing) {
      await prisma.campaign.update({
        where: { id: existing.id },
        data: c,
      });
      console.log(`Updated campaign: ${c.title}`);
    } else {
      await prisma.campaign.create({
        data: c,
      });
      console.log(`Created campaign: ${c.title}`);
    }
  }

  // Update section settings for clean headers
  await prisma.setting.upsert({
    where: { setting_key: 'fundraising_section_badge' },
    update: { setting_value: 'EDUCATION & SCHOLARSHIP SUPPORT' },
    create: { setting_key: 'fundraising_section_badge', setting_value: 'EDUCATION & SCHOLARSHIP SUPPORT' }
  });
  await prisma.setting.upsert({
    where: { setting_key: 'fundraising_section_heading' },
    update: { setting_value: 'Empower Every Child Through the Journey of Learning' },
    create: { setting_key: 'fundraising_section_heading', setting_value: 'Empower Every Child Through the Journey of Learning' }
  });
  await prisma.setting.upsert({
    where: { setting_key: 'fundraising_section_subheading' },
    update: { setting_value: 'Help underprivileged children stay in school with tuition sponsorships, learning kits, and smart digital classrooms.' },
    create: { setting_key: 'fundraising_section_subheading', setting_value: 'Help underprivileged children stay in school with tuition sponsorships, learning kits, and smart digital classrooms.' }
  });

  await prisma.setting.upsert({
    where: { setting_key: 'medical_section_badge' },
    update: { setting_value: 'CRITICAL MEDICAL EMERGENCY CASES' },
    create: { setting_key: 'medical_section_badge', setting_value: 'CRITICAL MEDICAL EMERGENCY CASES' }
  });
  await prisma.setting.upsert({
    where: { setting_key: 'medical_section_heading' },
    update: { setting_value: 'Urgent Care Needed: Health Cannot Wait' },
    create: { setting_key: 'medical_section_heading', setting_value: 'Urgent Care Needed: Health Cannot Wait' }
  });
  await prisma.setting.upsert({
    where: { setting_key: 'medical_section_subheading' },
    update: { setting_value: 'When medical emergencies strike vulnerable families, timely help saves lives. Support life-saving surgeries and treatments.' },
    create: { setting_key: 'medical_section_subheading', setting_value: 'When medical emergencies strike vulnerable families, timely help saves lives. Support life-saving surgeries and treatments.' }
  });

  await prisma.setting.upsert({
    where: { setting_key: 'eldercare_badge' },
    update: { setting_value: 'COMPASSIONATE ELDER CARE' },
    create: { setting_key: 'eldercare_badge', setting_value: 'COMPASSIONATE ELDER CARE' }
  });
  await prisma.setting.upsert({
    where: { setting_key: 'eldercare_heading' },
    update: { setting_value: 'Dignity, Shelter & Healthcare for Abandoned Elders' },
    create: { setting_key: 'eldercare_heading', setting_value: 'Dignity, Shelter & Healthcare for Abandoned Elders' }
  });
  await prisma.setting.upsert({
    where: { setting_key: 'eldercare_subheading' },
    update: { setting_value: 'Ensure no senior citizen spends their golden years destitute, lonely, or without essential medicines and warm food.' },
    create: { setting_key: 'eldercare_subheading', setting_value: 'Ensure no senior citizen spends their golden years destitute, lonely, or without essential medicines and warm food.' }
  });

  await prisma.setting.upsert({
    where: { setting_key: 'food_badge' },
    update: { setting_value: 'ZERO HUNGER MISSION' },
    create: { setting_key: 'food_badge', setting_value: 'ZERO HUNGER MISSION' }
  });
  await prisma.setting.upsert({
    where: { setting_key: 'food_heading' },
    update: { setting_value: 'Nutritious Meals & Food Aid for Every Hungry Soul' },
    create: { setting_key: 'food_heading', setting_value: 'Nutritious Meals & Food Aid for Every Hungry Soul' }
  });
  await prisma.setting.upsert({
    where: { setting_key: 'food_subheading' },
    update: { setting_value: 'Serving daily hot khichdi, distributing monthly dry ration kits, and delivering hospital caregiver food boxes.' },
    create: { setting_key: 'food_subheading', setting_value: 'Serving daily hot khichdi, distributing monthly dry ration kits, and delivering hospital caregiver food boxes.' }
  });

  console.log('--- Successfully seeded all 16 campaigns across all categories ---');
}

seedAllFundraiseCampaigns()
  .catch(err => {
    console.error('Seed error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
