import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import prisma from '../config/prisma.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE_PATH = path.join(__dirname, '../data/portfolio-db.json');

// Helper to load portfolio database from disk
function loadPortfolioDataFromDisk() {
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('⚠️ Could not read portfolio-db.json from disk:', err.message);
  }
  return null;
}

// Helper to save portfolio database to disk
function savePortfolioDataToDisk(data) {
  try {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn('⚠️ Could not save portfolio-db.json to disk:', err.message);
  }
}

// In-Memory Dev Store synced with disk
let portfolioStore = loadPortfolioDataFromDisk() || {
  profile: {},
  socialChannels: [],
  specializations: [],
  experience: [],
  projects: [],
  certificates: [],
  announcement: {},
  footer: {},
};

// Sanitizer helpers ensuring clean Prisma & JSON structure
function sanitizeSpec(data) {
  const primaryImage = data.image || (Array.isArray(data.images) && data.images.length > 0 ? data.images[0] : null);
  const gallery = Array.isArray(data.images) && data.images.length > 0
    ? data.images
    : (primaryImage ? [primaryImage] : []);

  return {
    id: data.id || `spec-${Date.now()}`,
    title: data.title || '',
    category: data.category || 'Specialization',
    iconName: data.iconName || 'Server',
    shortDesc: data.shortDesc || '',
    detailedScope: data.detailedScope || '',
    image: primaryImage,
    images: gallery,
    competencies: Array.isArray(data.competencies) ? data.competencies : [],
    practicalApplication: data.practicalApplication || null,
    skills: Array.isArray(data.skills) ? data.skills : [],
    sortOrder: typeof data.sortOrder === 'number' ? data.sortOrder : 0,
    createdAt: data.createdAt || new Date().toISOString(),
  };
}

function sanitizeExp(data) {
  const primaryImage = data.image || (Array.isArray(data.images) && data.images.length > 0 ? data.images[0] : null);
  const gallery = Array.isArray(data.images) && data.images.length > 0
    ? data.images
    : (primaryImage ? [primaryImage] : []);

  return {
    id: data.id || `exp-${Date.now()}`,
    role: data.role || '',
    company: data.company || '',
    period: data.period || '',
    location: data.location || '',
    shortDesc: data.shortDesc || '',
    fullDescription: data.fullDescription || '',
    image: primaryImage,
    images: gallery,
    keyAchievements: Array.isArray(data.keyAchievements) ? data.keyAchievements : [],
    practicalApplication: data.practicalApplication || null,
    tech: Array.isArray(data.tech) ? data.tech : [],
    sortOrder: typeof data.sortOrder === 'number' ? data.sortOrder : 0,
    createdAt: data.createdAt || new Date().toISOString(),
  };
}

function sanitizeProject(data) {
  const primaryImage = data.image || (Array.isArray(data.images) && data.images.length > 0 ? data.images[0] : '');
  const gallery = Array.isArray(data.images) && data.images.length > 0
    ? data.images
    : (primaryImage ? [primaryImage] : []);

  return {
    id: data.id || `proj-${Date.now()}`,
    title: data.title || '',
    category: data.category || 'Web Application',
    shortDesc: data.shortDesc || '',
    fullDesc: data.fullDesc || '',
    image: primaryImage,
    images: gallery,
    architectureHighlights: Array.isArray(data.architectureHighlights) ? data.architectureHighlights : [],
    practicalApplication: data.practicalApplication || null,
    tech: Array.isArray(data.tech) ? data.tech : [],
    github: data.github || null,
    live: data.live || null,
    sortOrder: typeof data.sortOrder === 'number' ? data.sortOrder : 0,
    createdAt: data.createdAt || new Date().toISOString(),
  };
}

function sanitizeCert(data) {
  const primaryImage = data.image || (Array.isArray(data.images) && data.images.length > 0 ? data.images[0] : '');
  const gallery = Array.isArray(data.images) && data.images.length > 0
    ? data.images
    : (primaryImage ? [primaryImage] : []);

  return {
    id: data.id || `cert-${Date.now()}`,
    title: data.title || '',
    issuer: data.issuer || '',
    date: data.date || '',
    certId: data.certId || null,
    image: primaryImage,
    images: gallery,
    description: data.description || '',
    validatedSkills: Array.isArray(data.validatedSkills) ? data.validatedSkills : [],
    practicalApplication: data.practicalApplication || null,
    credentialUrl: data.credentialUrl || null,
    sortOrder: typeof data.sortOrder === 'number' ? data.sortOrder : 0,
    createdAt: data.createdAt || new Date().toISOString(),
  };
}

export const portfolioService = {
  async getAllData() {
    try {
      const [profile, socialChannels, specializations, experience, projects, certificates] = await Promise.all([
        prisma.profile.findFirst(),
        prisma.socialChannel.findMany({ orderBy: { sortOrder: 'asc' } }),
        prisma.specialization.findMany({ orderBy: { createdAt: 'desc' } }),
        prisma.experience.findMany({ orderBy: { createdAt: 'desc' } }),
        prisma.project.findMany({ orderBy: { createdAt: 'desc' } }),
        prisma.certificate.findMany({ orderBy: { createdAt: 'desc' } }),
      ]);

      const diskData = portfolioStore || {};
      const activeProfile = profile || diskData.profile || {};

      return {
        profile: {
          ...diskData.profile,
          ...activeProfile,
          phone: activeProfile.phone || diskData.profile?.phone || '',
        },
        socialChannels: (socialChannels && socialChannels.length > 0) ? socialChannels : diskData.socialChannels,
        specializations: (specializations && specializations.length > 0) ? specializations : diskData.specializations,
        experience: (experience && experience.length > 0) ? experience : diskData.experience,
        projects: (projects && projects.length > 0) ? projects : diskData.projects,
        certificates: (certificates && certificates.length > 0) ? certificates : diskData.certificates,
        cv: diskData.cv || null,
        announcement: diskData.announcement,
        footer: diskData.footer,
      };
    } catch (e) {
      console.warn('Prisma DB query error, serving persistent disk data:', e.message);
    }

    return portfolioStore;
  },

  async updateProfile(profileData) {
    const allowedKeys = ['name', 'role', 'institution', 'location', 'email', 'phone', 'telegram', 'avatar', 'aboutBio', 'stats'];
    const dbPayload = {};
    for (const key of allowedKeys) {
      if (profileData[key] !== undefined) {
        dbPayload[key] = profileData[key];
      }
    }

    // Parse stats if passed as JSON string
    if (dbPayload.stats && typeof dbPayload.stats === 'string') {
      try {
        dbPayload.stats = JSON.parse(dbPayload.stats);
      } catch (_) {}
    }

    let updatedFromDb = null;
    try {
      const existing = await prisma.profile.findFirst();
      if (existing) {
        updatedFromDb = await prisma.profile.update({
          where: { id: existing.id },
          data: dbPayload,
        });
      } else {
        updatedFromDb = await prisma.profile.create({
          data: {
            name: dbPayload.name || 'Shanbel Dires',
            role: dbPayload.role || 'Full-Stack Software Engineer & Network Architect',
            institution: dbPayload.institution || 'Addis Ababa Science and Technology University (AASTU)',
            location: dbPayload.location || 'Addis Ababa, Ethiopia',
            email: dbPayload.email || '',
            phone: dbPayload.phone || '',
            telegram: dbPayload.telegram || '',
            avatar: dbPayload.avatar || '',
            aboutBio: dbPayload.aboutBio || '',
            stats: dbPayload.stats || [],
          },
        });
      }
    } catch (e) {
      console.warn('Postgres profile update warning:', e.message);
    }

    portfolioStore.profile = {
      ...portfolioStore.profile,
      ...profileData,
      ...(updatedFromDb || {}),
    };
    savePortfolioDataToDisk(portfolioStore);
    return portfolioStore.profile;
  },

  // SPECIALIZATIONS CRUD (Newest comes first!)
  async createSpecialization(data) {
    const clean = sanitizeSpec(data);

    try {
      const createData = { ...clean, createdAt: clean.createdAt ? new Date(clean.createdAt) : new Date() };
      await prisma.specialization.create({ data: createData });
    } catch (e) {
      // Handled via disk store
    }

    portfolioStore.specializations = [clean, ...portfolioStore.specializations.filter((s) => s.id !== clean.id)];
    savePortfolioDataToDisk(portfolioStore);
    return clean;
  },

  async updateSpecialization(id, data) {
    const clean = sanitizeSpec({ ...data, id });

    try {
      const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...updateData } = clean;
      await prisma.specialization.update({ where: { id }, data: updateData });
    } catch (e) {
      // Handled via disk store
    }

    portfolioStore.specializations = portfolioStore.specializations.map((s) => (s.id === id ? clean : s));
    savePortfolioDataToDisk(portfolioStore);
    return clean;
  },

  async deleteSpecialization(id) {
    try {
      await prisma.specialization.delete({ where: { id } });
    } catch (e) {
      // Handled via disk store
    }

    portfolioStore.specializations = portfolioStore.specializations.filter((s) => s.id !== id);
    savePortfolioDataToDisk(portfolioStore);
    return { success: true };
  },

  // EXPERIENCE CRUD (Newest comes first!)
  async createExperience(data) {
    const clean = sanitizeExp(data);

    try {
      const createData = { ...clean, createdAt: clean.createdAt ? new Date(clean.createdAt) : new Date() };
      await prisma.experience.create({ data: createData });
    } catch (e) {
      // Handled via disk store
    }

    portfolioStore.experience = [clean, ...portfolioStore.experience.filter((x) => x.id !== clean.id)];
    savePortfolioDataToDisk(portfolioStore);
    return clean;
  },

  async updateExperience(id, data) {
    const clean = sanitizeExp({ ...data, id });

    try {
      const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...updateData } = clean;
      await prisma.experience.update({ where: { id }, data: updateData });
    } catch (e) {
      // Handled via disk store
    }

    portfolioStore.experience = portfolioStore.experience.map((x) => (x.id === id ? clean : x));
    savePortfolioDataToDisk(portfolioStore);
    return clean;
  },

  async deleteExperience(id) {
    try {
      await prisma.experience.delete({ where: { id } });
    } catch (e) {
      // Handled via disk store
    }

    portfolioStore.experience = portfolioStore.experience.filter((x) => x.id !== id);
    savePortfolioDataToDisk(portfolioStore);
    return { success: true };
  },

  // PROJECTS CRUD (Newest added project comes FIRST!)
  async createProject(data) {
    const clean = sanitizeProject(data);

    try {
      const createData = { ...clean, createdAt: clean.createdAt ? new Date(clean.createdAt) : new Date() };
      await prisma.project.create({ data: createData });
    } catch (e) {
      // Handled via disk store
    }

    // Prepend to top so it comes first!
    portfolioStore.projects = [clean, ...portfolioStore.projects.filter((p) => p.id !== clean.id)];
    savePortfolioDataToDisk(portfolioStore);
    return clean;
  },

  async updateProject(id, data) {
    const clean = sanitizeProject({ ...data, id });

    try {
      const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...updateData } = clean;
      await prisma.project.update({ where: { id }, data: updateData });
    } catch (e) {
      // Handled via disk store
    }

    portfolioStore.projects = portfolioStore.projects.map((p) => (p.id === id ? clean : p));
    savePortfolioDataToDisk(portfolioStore);
    return clean;
  },

  async deleteProject(id) {
    try {
      await prisma.project.delete({ where: { id } });
    } catch (e) {
      // Handled via disk store
    }

    portfolioStore.projects = portfolioStore.projects.filter((p) => p.id !== id);
    savePortfolioDataToDisk(portfolioStore);
    return { success: true };
  },

  // CERTIFICATES CRUD (Newest added certificate comes FIRST!)
  async createCertificate(data) {
    const clean = sanitizeCert(data);

    try {
      const createData = { ...clean, createdAt: clean.createdAt ? new Date(clean.createdAt) : new Date() };
      await prisma.certificate.create({ data: createData });
    } catch (e) {
      // Handled via disk store
    }

    // Prepend to top so it comes first!
    portfolioStore.certificates = [clean, ...portfolioStore.certificates.filter((c) => c.id !== clean.id)];
    savePortfolioDataToDisk(portfolioStore);
    return clean;
  },

  async updateCertificate(id, data) {
    const clean = sanitizeCert({ ...data, id });

    try {
      const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...updateData } = clean;
      await prisma.certificate.update({ where: { id }, data: updateData });
    } catch (e) {
      // Handled via disk store
    }

    portfolioStore.certificates = portfolioStore.certificates.map((c) => (c.id === id ? clean : c));
    savePortfolioDataToDisk(portfolioStore);
    return clean;
  },

  async deleteCertificate(id) {
    try {
      await prisma.certificate.delete({ where: { id } });
    } catch (e) {
      // Handled via disk store
    }

    portfolioStore.certificates = portfolioStore.certificates.filter((c) => c.id !== id);
    savePortfolioDataToDisk(portfolioStore);
    return { success: true };
  },

  // CV / RESUME CRUD
  async updateCV(cvData) {
    const cleanCV = {
      id: cvData.id || `cv-${Date.now()}`,
      title: cvData.title || "Shanbel Dires - Full-Stack Engineer & Network Architect Resume",
      fileName: cvData.fileName || "Shanbel_Dires_CV.pdf",
      fileUrl: cvData.fileUrl || "",
      fileSize: cvData.fileSize || "",
      updatedAt: new Date().toISOString(),
      isActive: cvData.isActive !== false,
    };
    portfolioStore.cv = cleanCV;
    savePortfolioDataToDisk(portfolioStore);
    return cleanCV;
  },

  async deleteCV() {
    portfolioStore.cv = null;
    savePortfolioDataToDisk(portfolioStore);
    return { success: true, message: 'CV removed successfully.' };
  },
};
