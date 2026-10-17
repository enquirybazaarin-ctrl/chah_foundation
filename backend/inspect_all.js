const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.campaignCategory.findMany();
  console.log('=== CATEGORIES ===');
  console.log(categories.map(c => ({ id: c.id.toString(), name: c.name, slug: c.slug })));

  const campaigns = await prisma.campaign.findMany({
    include: { category: true }
  });
  console.log('\n=== CAMPAIGNS (' + campaigns.length + ') ===');
  console.log(campaigns.map(c => ({
    id: c.id.toString(),
    title: c.title,
    slug: c.slug,
    category: c.category?.slug,
    raised: c.raised_amount.toString(),
    target: c.target_amount.toString(),
    supporters: c.supporters_count
  })));

  const slides = await prisma.heroSlide.findMany();
  console.log('\n=== HERO SLIDES (' + slides.length + ') ===');
  console.log(slides.map(s => ({ id: s.id.toString(), title: s.title, active: s.is_active, img: s.image_url })));

  const metrics = await prisma.metric.findMany();
  console.log('\n=== METRICS (' + metrics.length + ') ===');
  console.log(metrics.map(m => ({ id: m.id.toString(), name: m.metric_name, val: m.metric_value })));

  const whatWeDo = await prisma.whatWeDoCard.findMany();
  console.log('\n=== WHAT WE DO CARDS (' + whatWeDo.length + ') ===');
  console.log(whatWeDo.map(w => ({ id: w.id.toString(), title: w.title, active: w.is_active })));

  const impactProjects = await prisma.impactProject.findMany().catch(() => []);
  console.log('\n=== IMPACT PROJECTS (' + impactProjects.length + ') ===');
  console.log(impactProjects.map(p => ({ id: p.id.toString(), title: p.title })));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
