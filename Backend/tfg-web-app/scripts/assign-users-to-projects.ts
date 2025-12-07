import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const projects = await prisma.project.findMany({
    include: { users: true },
  });

  const users = await prisma.user.findMany();

  if (users.length === 0) {
    const defaultUser = await prisma.user.create({
      data: {
        id: 'default-user',
        email: 'default@example.com',
        password: 'hashed_password',
        name: 'Default',
        surname: 'User',
        role: 'admin',
      },
    });
    users.push(defaultUser);
  }

  const defaultUser = users[0];
  let assignedCount = 0;

  for (const project of projects) {
    if (project.users.length === 0) {
      await prisma.userProject.create({
        data: {
          userId: defaultUser.id,
          projectId: project.id,
          role: 'owner',
        },
      });
      assignedCount++;
    }
  }

  console.log(`Assigned users to ${assignedCount} projects`);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
