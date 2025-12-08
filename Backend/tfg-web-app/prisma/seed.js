const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: { role: 'admin' },
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin',
      surname: 'User',
      role: 'admin',
      profilePictureURL: null,
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: 'manager@example.com' },
    update: { role: 'manager' },
    create: {
      email: 'manager@example.com',
      password: hashedPassword,
      name: 'Manager',
      surname: 'Smith',
      role: 'manager',
      profilePictureURL: null,
      managerId: admin.id,
    },
  });

  await prisma.user.upsert({
    where: { email: 'dev1@example.com' },
    update: { role: 'contributor' },
    create: {
      email: 'dev1@example.com',
      password: hashedPassword,
      name: 'John',
      surname: 'Doe',
      role: 'contributor',
      profilePictureURL: null,
      managerId: manager.id,
    },
  });

  await prisma.user.upsert({
    where: { email: 'dev2@example.com' },
    update: { role: 'contributor' },
    create: {
      email: 'dev2@example.com',
      password: hashedPassword,
      name: 'Jane',
      surname: 'Smith',
      role: 'contributor',
      profilePictureURL: null,
      managerId: manager.id,
    },
  });

  await prisma.user.upsert({
    where: { email: 'viewer@example.com' },
    update: { role: 'viewer' },
    create: {
      email: 'viewer@example.com',
      password: hashedPassword,
      name: 'Stakeholder',
      surname: 'User',
      role: 'viewer',
      profilePictureURL: null,
      managerId: manager.id,
    },
  });

  console.log('Seed completed');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
