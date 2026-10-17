const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const p32 = await prisma.project.findUnique({ where: { id: 32n } });
  const p43 = await prisma.project.findUnique({ where: { id: 43n }, include: { gallery_images: true } });
  
  console.log('Project 32:', p32?.id, p32?.slug, p32?.title);
  console.log('Project 43:', p43?.id, p43?.slug, p43?.title, 'Gallery images count:', p43?.gallery_images?.length);

  if (p43 && p32) {
    // Transfer p32 activities to p43 if any
    const p32Activities = await prisma.activity.findMany({ where: { project_id: 32n } });
    if (p32Activities.length > 0) {
      await prisma.activity.updateMany({
        where: { project_id: 32n },
        data: { project_id: 43n }
      });
    }

    // Delete p32 so that slug 'education-support-drive' is free
    await prisma.project.delete({ where: { id: 32n } });
    console.log('Deleted old duplicate project 32');

    // Update p43's slug to 'education-support-drive'
    await prisma.project.update({
      where: { id: 43n },
      data: { slug: 'education-support-drive' }
    });
    console.log('Updated project 43 slug to "education-support-drive" successfully!');
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
