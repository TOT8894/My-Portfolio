import { portfolioService } from '../services/portfolioService.js';

export const portfolioController = {
  async getAllData(req, res, next) {
    try {
      const data = await portfolioService.getAllData();
      return res.json(data);
    } catch (error) {
      next(error);
    }
  },

  async updateProfile(req, res, next) {
    try {
      const updated = await portfolioService.updateProfile(req.body);
      return res.json({ success: true, message: 'Profile updated successfully.', profile: updated });
    } catch (error) {
      next(error);
    }
  },

  async updateSettings(req, res, next) {
    try {
      const updated = await portfolioService.updateSettings(req.body);
      return res.json({ success: true, settings: updated });
    } catch (error) {
      next(error);
    }
  },

  // SPECIALIZATIONS
  async createSpecialization(req, res, next) {
    try {
      const created = await portfolioService.createSpecialization(req.body);
      return res.status(201).json({ success: true, specialization: created });
    } catch (error) {
      next(error);
    }
  },

  async updateSpecialization(req, res, next) {
    try {
      const updated = await portfolioService.updateSpecialization(req.params.id, req.body);
      return res.json({ success: true, specialization: updated });
    } catch (error) {
      next(error);
    }
  },

  async deleteSpecialization(req, res, next) {
    try {
      await portfolioService.deleteSpecialization(req.params.id);
      return res.json({ success: true, message: 'Specialization deleted.' });
    } catch (error) {
      next(error);
    }
  },

  // EXPERIENCE
  async createExperience(req, res, next) {
    try {
      const created = await portfolioService.createExperience(req.body);
      return res.status(201).json({ success: true, experience: created });
    } catch (error) {
      next(error);
    }
  },

  async updateExperience(req, res, next) {
    try {
      const updated = await portfolioService.updateExperience(req.params.id, req.body);
      return res.json({ success: true, experience: updated });
    } catch (error) {
      next(error);
    }
  },

  async deleteExperience(req, res, next) {
    try {
      await portfolioService.deleteExperience(req.params.id);
      return res.json({ success: true, message: 'Experience deleted.' });
    } catch (error) {
      next(error);
    }
  },

  // PROJECTS
  async createProject(req, res, next) {
    try {
      const created = await portfolioService.createProject(req.body);
      return res.status(201).json({ success: true, project: created });
    } catch (error) {
      next(error);
    }
  },

  async updateProject(req, res, next) {
    try {
      const updated = await portfolioService.updateProject(req.params.id, req.body);
      return res.json({ success: true, project: updated });
    } catch (error) {
      next(error);
    }
  },

  async deleteProject(req, res, next) {
    try {
      await portfolioService.deleteProject(req.params.id);
      return res.json({ success: true, message: 'Project deleted.' });
    } catch (error) {
      next(error);
    }
  },

  // CERTIFICATES
  async createCertificate(req, res, next) {
    try {
      const created = await portfolioService.createCertificate(req.body);
      return res.status(201).json({ success: true, certificate: created });
    } catch (error) {
      next(error);
    }
  },

  async updateCertificate(req, res, next) {
    try {
      const updated = await portfolioService.updateCertificate(req.params.id, req.body);
      return res.json({ success: true, certificate: updated });
    } catch (error) {
      next(error);
    }
  },

  async deleteCertificate(req, res, next) {
    try {
      await portfolioService.deleteCertificate(req.params.id);
      return res.json({ success: true, message: 'Certificate deleted.' });
    } catch (error) {
      next(error);
    }
  },

  // CV / RESUME
  async updateCV(req, res, next) {
    try {
      const updated = await portfolioService.updateCV(req.body);
      return res.json({ success: true, message: 'CV updated successfully.', cv: updated });
    } catch (error) {
      next(error);
    }
  },

  async deleteCV(req, res, next) {
    try {
      const result = await portfolioService.deleteCV();
      return res.json({ success: true, message: 'CV deleted successfully.' });
    } catch (error) {
      next(error);
    }
  },
};
