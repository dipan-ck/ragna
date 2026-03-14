import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { auth } from "../src/lib/auth.js";
import { env } from "../src/config/env.js";

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
    const existing = await prisma.user.findUnique({
        where: { email: "dev@local.com" },
    });
    if (existing) {
        await prisma.user.delete({ where: { email: "dev@local.com" } });
        console.log("deleted existing dev user");
    }

    const { user } = await auth.api.signUpEmail({
        body: {
            name: "Dev User",
            email: "dev@local.com",
            password: "devpassword123",
        },
    });

    console.log("seeded dev user:", user.id);
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect());
