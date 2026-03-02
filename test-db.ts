import { prisma } from "./lib/prisma";

async function test() {
    try {
        const users = await prisma.user.count();
        console.log("Database connection successful, user count:", users);
    } catch (err) {
        console.dir(err, { depth: null });
    } finally {
        await prisma.$disconnect();
    }
}

test();
