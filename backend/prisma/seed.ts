import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

import { CONFIGS } from "../src/configs";

const prisma = new PrismaClient();

const addDefaultUser = async () => {
    const defaultPassword = "password"; 
    const hashedPassword = await bcrypt.hash(defaultPassword, CONFIGS.BCRYPT_SALT_ROUNDS);

    // Add a default user
    const defaultUser = await prisma.user.upsert({
        where: { email: "default.user@hackernews.com" },
        update: {},
        create: {
            name: "Default User",
            email: "default.user@hackernews.com",
            password: hashedPassword
        },
    });

    console.log("Default user created:", defaultUser);
}

async function main() {
    await addDefaultUser();
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
