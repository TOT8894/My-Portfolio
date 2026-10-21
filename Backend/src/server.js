import './config/env.js';
import app from './app.js';
import prisma from './config/prisma.js';

const PORT = process.env.PORT || 5000;

async function startServer() {
  // Test Prisma 6 Connection
  try {
    await prisma.$connect();
    console.log('✅ Prisma 6 connected to PostgreSQL successfully.');
  } catch (error) {
    console.warn('⚠️  Prisma could not connect to PostgreSQL database:', error.message);
    console.log('ℹ️  The API will operate with zero downtime using the resilient in-memory fallback store.');
  }

  const server = app.listen(PORT, () => {
    console.log('================================================================');
    console.log(`🚀 Shanbel Dires Portfolio API (Prisma 6) is running on port ${PORT}`);
    console.log(`📡 Base API URL: http://localhost:${PORT}/api`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🌐 Allowed Frontend: http://localhost:5173`);
    console.log('================================================================');
  });

  const shutdown = async () => {
    console.log('\n🛑 Gracefully shutting down backend server...');
    server.close(async () => {
      await prisma.$disconnect();
      console.log('🔌 Prisma disconnected. Process exiting.');
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

startServer();
