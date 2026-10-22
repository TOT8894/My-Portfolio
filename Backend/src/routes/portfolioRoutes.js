import { Router } from 'express';
import { portfolioController } from '../controllers/portfolioController.js';
import { verifyAccessToken } from '../middlewares/authMiddleware.js';

const router = Router();

// Public Data Route
router.get('/', portfolioController.getAllData);

// Protected Admin Portfolio Management
router.put('/profile', verifyAccessToken, portfolioController.updateProfile);
router.put('/settings', verifyAccessToken, portfolioController.updateSettings);

// Specializations
router.post('/specializations', verifyAccessToken, portfolioController.createSpecialization);
router.put('/specializations/:id', verifyAccessToken, portfolioController.updateSpecialization);
router.delete('/specializations/:id', verifyAccessToken, portfolioController.deleteSpecialization);

// Experience
router.post('/experience', verifyAccessToken, portfolioController.createExperience);
router.put('/experience/:id', verifyAccessToken, portfolioController.updateExperience);
router.delete('/experience/:id', verifyAccessToken, portfolioController.deleteExperience);

// Projects
router.post('/projects', verifyAccessToken, portfolioController.createProject);
router.put('/projects/:id', verifyAccessToken, portfolioController.updateProject);
router.delete('/projects/:id', verifyAccessToken, portfolioController.deleteProject);

// Certificates
router.post('/certificates', verifyAccessToken, portfolioController.createCertificate);
router.put('/certificates/:id', verifyAccessToken, portfolioController.updateCertificate);
router.delete('/certificates/:id', verifyAccessToken, portfolioController.deleteCertificate);

// CV / Resume Management
router.put('/cv', verifyAccessToken, portfolioController.updateCV);
router.delete('/cv', verifyAccessToken, portfolioController.deleteCV);

export default router;
