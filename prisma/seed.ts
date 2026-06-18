// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL ?? 'admin@automart.al';
  const password = process.env.ADMIN_PASSWORD ?? 'Admin@1234';
  const name = 'Lori';

  const existing = await prisma.admin.findUnique({ where: { email } });
  if (!existing) {
    const hashed = await bcrypt.hash(password, 12);
    await prisma.admin.create({ data: { email, password: hashed, name } });
    console.log(`✅ Admin created: ${email}`);
  } else {
    console.log(`ℹ️  Admin already exists: ${email}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
