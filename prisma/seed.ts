import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import moment from "moment";

moment().format();

const prisma = new PrismaClient();

async function seed() {
  const email = "test@test.com";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("123456789", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  for (let p = 0; p < 5; p++) {
    const project = await prisma.project.create({
      data: {
        name: `Project ${p}`,
        userId: user.id,
      },
    });

    Promise.all(
      [0, 0, 0, 0, 0].map((_, index) => {
        return prisma.task.create({
          data: {
            name: `Test Task ${index}`,
            description: "This is a description",
            projectId: project.id,
            dueDate: moment().add(index, "d").startOf("day").toISOString(),
            userId: user.id,
          },
        });
      })
    );
  }

  Promise.all(
    [0, 0, 0, 0, 0].map((_, index) => {
      return prisma.task.create({
        data: {
          name: `Test Task ${index}`,
          description: "This is a description",
          dueDate: moment().add(index, "d").startOf("day").toISOString(),
          userId: user.id,
        },
      });
    })
  );

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
