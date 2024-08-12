const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

require('dotenv').config();

console.log("DATABASE_URL", process.env.DATABASE_URL);


async function main() {


  // For User Types Default Record

  const userTypes = [{ name: "SuperAdmin" }, { name: "Admin" }, { name: "User" }];


  for (usertype of userTypes) {
    const existingRecord = await prisma.usertypes.findFirst({
      where: {
        name: { equals: usertype.name },

      },
    })

    if (!existingRecord) {
      const newRecord = await prisma.usertypes.create({
        data: {
          name: usertype.name,

        }
      })
      console.log(`Created record with name '${usertype.name}'`);
    } else {
      console.log(`Record with name '${usertype.name}' already exists.`);
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });