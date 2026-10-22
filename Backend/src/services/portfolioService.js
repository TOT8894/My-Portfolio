import prisma from '../config/prisma.js';

const SETTINGS_ID = 'portfolio';

function imageFields(data, required = false) {
  const primaryImage = data.image || (Array.isArray(data.images) && data.images[0]) || (required ? '' : null);
  return {
    image: primaryImage,
    images: Array.isArray(data.images) && data.images.length > 0
      ? data.images
      : (primaryImage ? [primaryImage] : []),
  };
}

function sanitizeSpecialization(data) {
  return {
    id: data.id || `spec-${Date.now()}`,
    title: data.title || '',
    category: data.category || 'Specialization',
    iconName: data.iconName || 'Server',
    shortDesc: data.shortDesc || '',
    detailedScope: data.detailedScope || '',
    ...imageFields(data),
    competencies: Array.isArray(data.competencies) ? data.competencies : [],
    practicalApplication: data.practicalApplication || null,
    skills: Array.isArray(data.skills) ? data.skills : [],
    sortOrder: Number.isFinite(data.sortOrder) ? data.sortOrder : 0,
  };
}

function sanitizeExperience(data) {
  return {
    id: data.id || `exp-${Date.now()}`,
    role: data.role || '',
    company: data.company || '',
    period: data.period || '',
    location: data.location || '',
    shortDesc: data.shortDesc || '',
    fullDescription: data.fullDescription || '',
    ...imageFields(data),
    keyAchievements: Array.isArray(data.keyAchievements) ? data.keyAchievements : [],
    practicalApplication: data.practicalApplication || null,
    tech: Array.isArray(data.tech) ? data.tech : [],
    sortOrder: Number.isFinite(data.sortOrder) ? data.sortOrder : 0,
  };
}

function sanitizeProject(data) {
  return {
    id: data.id || `proj-${Date.now()}`,
    title: data.title || '',
    category: data.category || 'Web Application',
    shortDesc: data.shortDesc || '',
    fullDesc: data.fullDesc || '',
    ...imageFields(data, true),
    architectureHighlights: Array.isArray(data.architectureHighlights) ? data.architectureHighlights : [],
    practicalApplication: data.practicalApplication || null,
    tech: Array.isArray(data.tech) ? data.tech : [],
    github: data.github || null,
    live: data.live || null,
    sortOrder: Number.isFinite(data.sortOrder) ? data.sortOrder : 0,
  };
}

function sanitizeCertificate(data) {
  return {
    id: data.id || `cert-${Date.now()}`,
    title: data.title || '',
    issuer: data.issuer || '',
    date: data.date || '',
    certId: data.certId || null,
    ...imageFields(data, true),
    description: data.description || '',
    validatedSkills: Array.isArray(data.validatedSkills) ? data.validatedSkills : [],
    practicalApplication: data.practicalApplication || null,
    credentialUrl: data.credentialUrl || null,
    sortOrder: Number.isFinite(data.sortOrder) ? data.sortOrder : 0,
  };
}

function withoutId(data) {
  const { id, createdAt, updatedAt, ...payload } = data;
  return payload;
}

async function upsertSettings(data) {
  const existing = await prisma.portfolioSettings.findUnique({ where: { id: SETTINGS_ID } });
  const payload = {
    ...(data.cv !== undefined ? { cv: data.cv } : {}),
    ...(data.announcement !== undefined ? { announcement: data.announcement } : {}),
    ...(data.footer !== undefined ? { footer: data.footer } : {}),
  };
  return existing
    ? prisma.portfolioSettings.update({ where: { id: SETTINGS_ID }, data: payload })
    : prisma.portfolioSettings.create({ data: { id: SETTINGS_ID, ...payload } });
}

export const portfolioService = {
  async getAllData() {
    const [profile, socialChannels, specializations, experience, projects, certificates, settings] = await Promise.all([
      prisma.profile.findFirst(),
      prisma.socialChannel.findMany({ orderBy: { sortOrder: 'asc' } }),
      prisma.specialization.findMany({ orderBy: { sortOrder: 'asc' } }),
      prisma.experience.findMany({ orderBy: { sortOrder: 'asc' } }),
      prisma.project.findMany({ orderBy: { sortOrder: 'asc' } }),
      prisma.certificate.findMany({ orderBy: { sortOrder: 'asc' } }),
      prisma.portfolioSettings.findUnique({ where: { id: SETTINGS_ID } }),
    ]);

    return {
      profile: profile || {},
      socialChannels,
      specializations,
      experience,
      projects,
      certificates,
      cv: settings?.cv || null,
      announcement: settings?.announcement || {},
      footer: settings?.footer || {},
    };
  },

  async updateProfile(profileData) {
    const allowedKeys = ['name', 'role', 'institution', 'location', 'email', 'phone', 'telegram', 'avatar', 'aboutBio', 'stats'];
    const data = Object.fromEntries(
      allowedKeys
        .filter((key) => profileData[key] !== undefined)
        .map((key) => [key, key === 'stats' && typeof profileData[key] === 'string' ? JSON.parse(profileData[key]) : profileData[key]])
    );
    const existing = await prisma.profile.findFirst();
    return existing
      ? prisma.profile.update({ where: { id: existing.id }, data })
      : prisma.profile.create({ data: { ...data, name: data.name || '', role: data.role || '', institution: data.institution || '', location: data.location || '', email: data.email || '', telegram: data.telegram || '', avatar: data.avatar || '', aboutBio: data.aboutBio || '', stats: data.stats || [] } });
  },

  async updateSettings(settings) {
    return upsertSettings(settings);
  },

  async createSpecialization(data) {
    return prisma.specialization.create({ data: sanitizeSpecialization(data) });
  },
  async updateSpecialization(id, data) {
    return prisma.specialization.update({ where: { id }, data: withoutId(sanitizeSpecialization({ ...data, id })) });
  },
  async deleteSpecialization(id) {
    await prisma.specialization.delete({ where: { id } });
  },

  async createExperience(data) {
    return prisma.experience.create({ data: sanitizeExperience(data) });
  },
  async updateExperience(id, data) {
    return prisma.experience.update({ where: { id }, data: withoutId(sanitizeExperience({ ...data, id })) });
  },
  async deleteExperience(id) {
    await prisma.experience.delete({ where: { id } });
  },

  async createProject(data) {
    return prisma.project.create({ data: sanitizeProject(data) });
  },
  async updateProject(id, data) {
    return prisma.project.update({ where: { id }, data: withoutId(sanitizeProject({ ...data, id })) });
  },
  async deleteProject(id) {
    await prisma.project.delete({ where: { id } });
  },

  async createCertificate(data) {
    return prisma.certificate.create({ data: sanitizeCertificate(data) });
  },
  async updateCertificate(id, data) {
    return prisma.certificate.update({ where: { id }, data: withoutId(sanitizeCertificate({ ...data, id })) });
  },
  async deleteCertificate(id) {
    await prisma.certificate.delete({ where: { id } });
  },

  async updateCV(cvData) {
    const cv = {
      id: cvData.id || `cv-${Date.now()}`,
      title: cvData.title || '',
      fileName: cvData.fileName || '',
      fileUrl: cvData.fileUrl || '',
      fileSize: cvData.fileSize || '',
      updatedAt: new Date().toISOString(),
      isActive: cvData.isActive !== false,
    };
    await upsertSettings({ cv });
    return cv;
  },

  async deleteCV() {
    await upsertSettings({ cv: null });
    return { success: true, message: 'CV removed successfully.' };
  },
};
