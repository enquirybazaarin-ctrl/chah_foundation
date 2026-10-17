const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const DUMMY_CONTENT = `<p><strong>Dhrupad Rishav Mahanta</strong> is a pianist, a composer and a writer. He is also fighting <strong>T-cell Acute Lymphoblastic Leukaemia (T-ALL), a blood cancer.</strong> A stem cell transplant is his best chance to be well again, and a 10/10 matched donor has been found.</p><p>Dhrupad holds Trinity College London Grade 8 in classical piano. His original compositions have won awards. Quiet and shy, he teaches piano to children and adults, reads classic literature and loves cinema.</p><p>Listen to his music: <a href="#" class="text-red-700 font-medium">https://youtube.com/@yellowkeys177</a></p><p>He was diagnosed in May 2026. He was treated at B. Borooah Cancer Institute, Guwahati, until August, then at CMC Vellore. He is now home in Vellore, stable and recovering.</p><p>CMC Vellore's Head of Haematology has certified that a matched unrelated donor transplant is his best option. We must arrange Rs 50,00,000 by 15 October 2026, which includes the Rs 12,00,000 already available from this campaign.</p>`;

async function main() {
  const medicalCategory = await prisma.campaignCategory.findFirst({
    where: { slug: 'medical-emergency' }
  });

  if (!medicalCategory) {
    console.log("No medical category found.");
    return;
  }

  // Create a dummy campaign
  const campaign = await prisma.campaign.create({
    data: {
      title: "Help Dhrupad fight Leukaemia (Dummy Data)",
      slug: "help-dhrupad-leukaemia",
      category_id: medicalCategory.id,
      short_description: "Help Dhrupad fight T-cell Acute Lymphoblastic Leukaemia (T-ALL), a blood cancer. A stem cell transplant is his best chance to be well again.",
      target_amount: 9000000,
      raised_amount: 7918926,
      status: "ACTIVE",
      content: DUMMY_CONTENT,
      featured_image_url: "https://images.unsplash.com/photo-1536856136534-bb679c52a9aa?q=80&w=1200&auto=format&fit=crop",
      supporters_count: 389,
      is_featured: true,
      is_urgent: true,
      urgency_label: "5 days left",
      cta_button_text: "Donate Now",
    }
  });

  console.log(`Created medical campaign: ${campaign.slug}`);
}

main()
  .catch(console.error)
  .finally(() => prisma['$disconnect']());
