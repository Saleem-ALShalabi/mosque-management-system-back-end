import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import * as bcrypt from 'bcrypt';

async function main() {
    const adapter = new PrismaPg({
        connectionString: process.env.DATABASE_URL,
    });
    const prisma = new PrismaClient({ adapter });
    const passwordHash = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            name: 'Super Admin',
            username: 'admin',
            passwordHash,
            role: 'admin',
            isActive: true
        }
    });
    console.log('Admin created', admin.username);
    await prisma.$disconnect();
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});