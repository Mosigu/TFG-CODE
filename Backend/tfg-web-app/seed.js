const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin',
      surname: 'User',
      role: 'admin',
      profilePictureURL: null,
    },
  });

  console.log('Created admin user:', admin.email);

  const manager = await prisma.user.upsert({
    where: { email: 'manager@example.com' },
    update: {},
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

  console.log('Created manager user:', manager.email);

  const developer1 = await prisma.user.upsert({
    where: { email: 'dev1@example.com' },
    update: {},
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

  console.log('Created developer 1:', developer1.email);

  const developer2 = await prisma.user.upsert({
    where: { email: 'dev2@example.com' },
    update: {},
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

  console.log('Created developer 2:', developer2.email);

  const tester = await prisma.user.upsert({
    where: { email: 'tester@example.com' },
    update: {},
    create: {
      email: 'tester@example.com',
      password: hashedPassword,
      name: 'Test',
      surname: 'User',
      role: 'contributor',
      profilePictureURL: null,
      managerId: manager.id,
    },
  });

  console.log('Created tester:', tester.email);

  console.log('');
  console.log('Seed completed successfully!');
  console.log('');
  console.log('Test users credentials:');
  console.log('  Email: admin@example.com | Password: password123');
  console.log('  Email: manager@example.com | Password: password123');
  console.log('  Email: dev1@example.com | Password: password123');
  console.log('  Email: dev2@example.com | Password: password123');
  console.log('  Email: tester@example.com | Password: password123');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
