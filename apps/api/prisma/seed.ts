import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.template.upsert({
    where: { slug: 'colanode' },
    update: {
      name: 'Colanode',
      description: 'Default Colanode starter template',
      repoUrl: 'https://github.com/colanode/colanode',
      defaultPort: 4000,
      envSchemaJson: {},
      isActive: true,
    },
    create: {
      slug: 'colanode',
      name: 'Colanode',
      description: 'Default Colanode starter template',
      repoUrl: 'https://github.com/colanode/colanode',
      defaultPort: 4000,
      envSchemaJson: {},
      isActive: true,
    },
  });
}

main()
  .catch((error) => {
    console.error('Prisma seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
