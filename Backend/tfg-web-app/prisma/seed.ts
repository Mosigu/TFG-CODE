import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

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

  console.log('✅ Created admin user:', admin.email, '(role: admin)');

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

  console.log('✅ Created manager user:', manager.email, '(role: manager)');

  const developer1 = await prisma.user.upsert({
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

  console.log('✅ Created developer 1:', developer1.email, '(role: contributor)');

  const developer2 = await prisma.user.upsert({
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

  console.log('✅ Created developer 2:', developer2.email, '(role: contributor)');

  const viewer = await prisma.user.upsert({
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

  console.log('✅ Created viewer:', viewer.email, '(role: viewer)');

  console.log('');
  console.log('🎉 Seed completed successfully!');
  console.log('');
  console.log('Test users credentials:');
  console.log('  Email: admin@example.com | Password: password123 | Role: ADMIN');
  console.log('  Email: manager@example.com | Password: password123 | Role: MANAGER');
  console.log('  Email: dev1@example.com | Password: password123 | Role: CONTRIBUTOR');
  console.log('  Email: dev2@example.com | Password: password123 | Role: CONTRIBUTOR');
  console.log('  Email: viewer@example.com | Password: password123 | Role: VIEWER');
  console.log('');
  console.log('Role Permissions:');
  console.log('  ADMIN: Full system access, manage users and roles');
  console.log('  MANAGER: Create/manage projects, assign team members');
  console.log('  CONTRIBUTOR: Execute tasks, update status, record progress');
  console.log('  VIEWER: Read-only access to project information');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
