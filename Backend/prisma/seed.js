import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;

if (!email || !password) {
  throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be defined in backend/.env.');
}

const prisma = new PrismaClient();

try {
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.upsert({
    where: { email },
    update: { password: passwordHash },
    create: {
      name: process.env.ADMIN_NAME?.trim() || email.split('@')[0],
      email,
      password: passwordHash,
    },
    select: { id: true, email: true },
  });

  console.log(`Admin credentials stored for ${user.email}.`);
} finally {
  await prisma.$disconnect();
}
