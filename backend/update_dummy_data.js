const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const DUMMY_CONTENT = `<p><strong>Dhrupad Rishav Mahanta</strong> is a pianist, a composer and a writer. He is also fighting <strong>T-cell Acute Lymphoblastic Leukaemia (T-ALL), a blood cancer.</strong> A stem cell transplant is his best chance to be well again, and a 10/10 matched donor has been found.</p><p>Dhrupad holds Trinity College London Grade 8 in classical piano. His original compositions have won awards. Quiet and shy, he teaches piano to children and adults, reads classic literature and loves cinema.</p><p>Listen to his music: <a href="#" class="text-red-700 font-medium">https://youtube.com/@yellowkeys177</a></p><p>He was diagnosed in May 2026. He was treated at B. Borooah Cancer Institute, Guwahati, until August, then at CMC Vellore. He is now home in Vellore, stable and recovering.</p><p>CMC Vellore's Head of Haematology has certified that a matched unrelated donor transplant is his best option. We must arrange Rs 50,00,000 by 15 October 2026, which includes the Rs 12,00,000 already available from this campaign.</p>`;

async function main() {
  const categories = await prisma.campaignCategory.findMany();
  console.log("Categories:", categories);

  const medicalCategory = categories.find(c => c.slug.includes('medical') || c.name.toLowerCase().includes('medical'));

  if (!medicalCategory) {
    console.log('Medical category not found, checking all campaigns instead.');
  }

  const categoryId = medicalCategory ? medicalCategory.id : categories[0]?.id;

  const campaigns = await prisma.campaign.findMany({
    where: medicalCategory ? { category_id: medicalCategory.id } : {}
  });

  console.log(`Found ${campaigns.length} campaigns to update.`);

  for (const campaign of campaigns) {
    await prisma.campaign.update({
      where: { id: campaign.id },
      data: {
        content: DUMMY_CONTENT,
        target_amount: 9000000,
        raised_amount: 7918926,
        supporters_count: 389,
      }
    });
    console.log(`Updated campaign: ${campaign.title}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma['$disconnect']());
