import { Router } from 'express';
import authRoutes from './authRoutes.js';
import portfolioRoutes from './portfolioRoutes.js';
import contactRoutes from './contactRoutes.js';
import uploadRoutes from './uploadRoutes.js';

const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/portfolio', portfolioRoutes);
apiRouter.use('/contact', contactRoutes);
apiRouter.use('/upload', uploadRoutes);

apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'Shanbel Dires Portfolio API (Prisma 6)',
  });
});

export default apiRouter;
