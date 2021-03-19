const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();
async function main() {
  const alice = await prisma.user.upsert({
    where: { email: "alice@prisma.io" },
    update: {},
    create: {
      email: `alice@prisma.io`,
      name: "Alice",
      role: "ADMIN",
      password: "123456",
    },
  });
  const bob = await prisma.user.upsert({
    where: { email: "bob@prisma.io" },
    update: {},
    create: {
      email: `bob@prisma.io`,
      name: "Bob",
      role: "EMPLOY",
      password: "123456",
      
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
