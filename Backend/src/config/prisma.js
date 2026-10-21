import { PrismaClient } from '@prisma/client';

let prisma;

try {
  prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });
} catch (error) {
  console.warn('⚠️ PrismaClient initialization notice:', error.message);
  prisma = new PrismaClient();
}

export default prisma;
