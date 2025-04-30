// backend/prisma/seed.js

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Password123!', 10);
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email:     'test@example.com',
      password:  passwordHash,
      firstName: 'Test',
      lastName:  'User',
    },
  });

  await prisma.document.upsert({
    where: { id: 1 },
    update: {},
    create: {
      originalname: 'testFile.pdf',
      filename:     'testFile.pdf',
      original:     'Ceci est le texte original du document.',
      anonymized:   'Ceci est le texte anonymisé du document.',
      filePath:     'uploads/testFile.pdf',
      anonPath:     'uploads/testFile.pdf',
      userId:       user.id,
    },
  });

  console.log('✅ Seed terminé');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
