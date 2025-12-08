const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Checking projects without users...');

  const projects = await prisma.project.findMany({
    include: {
      users: true,
    },
  });

  console.log(`Found ${projects.length} projects`);

  const users = await prisma.user.findMany();
  console.log(`Found ${users.length} users`);

  if (users.length === 0) {
    console.log('No users found in database. Creating default user...');
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
    console.log('Default user created');
  }

  const defaultUser = users[0];
  let assignedCount = 0;

  for (const project of projects) {
    if (project.users.length === 0) {
      console.log(
        `Assigning user "${defaultUser.email}" to project "${project.title}"`,
      );
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
  console.log(`${projects.length - assignedCount} projects already had users`);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
