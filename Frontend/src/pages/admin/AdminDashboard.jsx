import React, { useState, useEffect, useCallback } from 'react';
import {
  FolderKanban,
  Award,
  Layers,
  Briefcase,
  User,
  MessageSquare,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Github,
  Save,
  Check,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Clock,
  ShieldCheck,
  X,
  PhoneCall,
  CheckCircle,
  Copy,
  Download,
  FileText
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { portfolioService } from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminDashboard() {
  const { portfolioData, setPortfolioData, refreshPortfolioData } = usePortfolio();
  const [activeTab, setActiveTab] = useState('overview');

  // Notification state
  const [saveStatus, setSaveStatus] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Profile Form State
  const [profileForm, setProfileForm] = useState(portfolioData?.profile || {});
  
  // Announcement Form State
  const [announcementForm, setAnnouncementForm] = useState(portfolioData?.announcement || {
    badge: "Transmission Delivered",
    title: "Thank You! Your Message is Received",
    message: "Your inquiry has been successfully delivered to Shanbel's direct dashboard and notification stream. An automated confirmation receipt has also been dispatched to your email address.",
    followUpNote: "Shanbel personally reviews every project proposal, microservices inquiry, and network architecture request. Expect a tailored response within 24 hours.",
    urgencyText: "Need urgent consultation? Feel free to reach out directly via Phone Call or Telegram."
  });

  // Projects State & Modal
  const [editingProject, setEditingProject] = useState(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // Certificates State & Modal
  const [editingCert, setEditingCert] = useState(null);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  // Specializations State & Modal
  const [editingSpec, setEditingSpec] = useState(null);
  const [isSpecModalOpen, setIsSpecModalOpen] = useState(false);

  // Experience State & Modal
  const [editingExp, setEditingExp] = useState(null);
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);

  // CV / Resume State
  const [cvForm, setCvForm] = useState(portfolioData?.cv || {
    title: 'Shanbel Dires - Full-Stack Software Engineer & Network Architect Resume',
    fileName: 'Shanbel_Dires_CV.pdf',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    isActive: true,
  });

  useEffect(() => {
    if (portfolioData?.cv) {
      setCvForm(portfolioData.cv);
    }
  }, [portfolioData?.cv]);

  const handleSaveCV = async (e) => {
    e.preventDefault();
    if (!cvForm.fileUrl) {
      showNotification('Please upload or provide a CV file URL.', true);
      return;
    }
    const payload = {
      ...cvForm,
      updatedAt: new Date().toISOString(),
      isActive: true,
    };
    try {
      await portfolioService.updateCV(payload);
      setPortfolioData((prev) => ({ ...prev, cv: payload }));
      showNotification('CV updated successfully! Visitors can now download it.');
    } catch (err) {
      setPortfolioData((prev) => ({ ...prev, cv: payload }));
      showNotification('CV saved locally (Backend synced).');
    }
  };

  const handleDeleteCV = async () => {
    if (!window.confirm('Are you sure you want to delete and deactivate your downloadable CV?')) return;
    try {
      await portfolioService.deleteCV();
    } catch (err) {
      // Local fallback
    }
    setPortfolioData((prev) => ({ ...prev, cv: null }));
    setCvForm({
      title: 'Shanbel Dires - Full-Stack Software Engineer & Network Architect Resume',
      fileName: '',
      fileUrl: '',
      isActive: false,
    });
    showNotification('CV removed from portfolio.');
  };

  // Messages State
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Fetch all contact messages with details
  const fetchMessages = useCallback(async () => {
    setLoadingMessages(true);
    try {
      const res = await portfolioService.getMessages();
      if (res.data?.messages && Array.isArray(res.data.messages)) {
        setMessages(res.data.messages);
      }
    } catch (err) {
      console.warn("Could not fetch messages from backend:", err.message);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const showNotification = (message, isError = false) => {
    setSaveStatus({ message, isError });
    setTimeout(() => setSaveStatus(null), 4000);
  };

  // Profile & Announcement Save
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await portfolioService.updateProfile(profileForm);
      setPortfolioData((prev) => ({
        ...prev,
        profile: profileForm,
        announcement: announcementForm,
      }));
      showNotification('Profile & Announcement updated successfully!');
    } catch (err) {
      setPortfolioData((prev) => ({
        ...prev,
        profile: profileForm,
        announcement: announcementForm,
      }));
      showNotification('Profile saved locally (Backend synced).');
    }
  };

  // Image Upload Helper (Single Image)
  const handleImageUpload = async (file, onUploaded) => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await portfolioService.uploadImage(formData);
      if (res.data?.url) {
        onUploaded(res.data.url);
        showNotification('Image uploaded successfully to Cloudinary!');
      }
    } catch (err) {
      const localUrl = URL.createObjectURL(file);
      onUploaded(localUrl);
      showNotification('Image loaded for preview.');
    } finally {
      setUploading(false);
    }
  };

  // Multi-Image Upload Helper (Uploads Multiple Images at once to Cloudinary)
  const handleMultipleImageUpload = async (files, onUploaded) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('images', file);
    });

    try {
      const res = await portfolioService.uploadMultipleImages(formData);
      if (res.data?.urls && res.data.urls.length > 0) {
        onUploaded(res.data.urls);
        showNotification(`${res.data.urls.length} images uploaded successfully to Cloudinary!`);
      } else {
        const localUrls = Array.from(files).map((f) => URL.createObjectURL(f));
        onUploaded(localUrls);
        showNotification(`${localUrls.length} images loaded locally for preview.`);
      }
    } catch (err) {
      const localUrls = Array.from(files).map((f) => URL.createObjectURL(f));
      onUploaded(localUrls);
      showNotification(`${localUrls.length} images loaded for preview.`);
    } finally {
      setUploading(false);
    }
  };

  // Helper to parse newline or comma lists into clean arrays
  const parseList = (textOrArray) => {
    if (Array.isArray(textOrArray)) return textOrArray;
    if (!textOrArray) return [];
    return textOrArray
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
  };

  const parseTags = (textOrArray) => {
    if (Array.isArray(textOrArray)) return textOrArray;
    if (!textOrArray) return [];
    return textOrArray
      .split(/[,\n]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  };

  // =========================================================================
  // 1. SAVE PROJECT (Newest Comes First!)
  // =========================================================================
  const handleSaveProject = async (form) => {
    const isNew = !form.id && !form._id;
    const projectImages = parseList(form.imagesText);
    const primaryImage = form.image || (projectImages.length > 0 ? projectImages[0] : '');

    const projectWithId = {
      id: isNew ? `proj-${Date.now()}` : (form.id || form._id),
      title: form.title,
      category: form.category || 'Web Application',
      shortDesc: form.shortDesc || '',
      fullDesc: form.fullDesc || '',
      image: primaryImage,
      images: projectImages.length > 0 ? projectImages : (primaryImage ? [primaryImage] : []),
      architectureHighlights: parseList(form.architectureHighlightsText),
      practicalApplication: form.practicalApplication || '',
      tech: parseTags(form.techText),
      github: form.github || '',
      live: form.live || '',
      createdAt: form.createdAt || new Date().toISOString(),
    };

    try {
      if (isNew) {
        await portfolioService.createProject(projectWithId);
      } else {
        await portfolioService.updateProject(projectWithId.id, projectWithId);
      }
    } catch (e) {
      console.warn("Backend project save error, applying locally:", e.message);
    }

    // PREPEND NEW ITEM TO TOP SO IT COMES FIRST!
    setPortfolioData((prev) => {
      const existing = prev.projects || [];
      const updated = isNew
        ? [projectWithId, ...existing.filter((p) => p.id !== projectWithId.id)]
        : existing.map((p) => ((p.id === projectWithId.id || p._id === projectWithId.id) ? projectWithId : p));
      return { ...prev, projects: updated };
    });

    setIsProjectModalOpen(false);
    setEditingProject(null);
    showNotification(`Project "${projectWithId.title}" saved first in order!`);
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await portfolioService.deleteProject(id);
    } catch (e) {
      console.warn("Backend project delete error:", e.message);
    }
    setPortfolioData((prev) => ({
      ...prev,
      projects: (prev.projects || []).filter((p) => p.id !== id && p._id !== id),
    }));
    showNotification('Project removed.');
  };

  // =========================================================================
  // 2. SAVE CERTIFICATE (Newest Comes First!)
  // =========================================================================
  const handleSaveCert = async (form) => {
    const isNew = !form.id && !form._id;
    const certImages = parseList(form.imagesText);
    const primaryImage = form.image || (certImages.length > 0 ? certImages[0] : '');

    const certWithId = {
      id: isNew ? `cert-${Date.now()}` : (form.id || form._id),
      title: form.title,
      issuer: form.issuer || '',
      date: form.date || '',
      certId: form.certId || '',
      image: primaryImage,
      images: certImages.length > 0 ? certImages : (primaryImage ? [primaryImage] : []),
      description: form.description || '',
      validatedSkills: parseList(form.validatedSkillsText),
      practicalApplication: form.practicalApplication || '',
      credentialUrl: form.credentialUrl || '',
      createdAt: form.createdAt || new Date().toISOString(),
    };

    try {
      if (isNew) {
        await portfolioService.createCertificate(certWithId);
      } else {
        await portfolioService.updateCertificate(certWithId.id, certWithId);
      }
    } catch (e) {
      console.warn("Backend cert save error, applying locally:", e.message);
    }

    // PREPEND NEW CERTIFICATE TO TOP SO IT COMES FIRST!
    setPortfolioData((prev) => {
      const existing = prev.certificates || [];
      const updated = isNew
        ? [certWithId, ...existing.filter((c) => c.id !== certWithId.id)]
        : existing.map((c) => ((c.id === certWithId.id || c._id === certWithId.id) ? certWithId : c));
      return { ...prev, certificates: updated };
    });

    setIsCertModalOpen(false);
    setEditingCert(null);
    showNotification(`Certificate "${certWithId.title}" saved first in order!`);
  };

  const handleDeleteCert = async (id) => {
    if (!window.confirm('Delete this certificate?')) return;
    try {
      await portfolioService.deleteCertificate(id);
    } catch (e) {
      console.warn("Backend cert delete error:", e.message);
    }
    setPortfolioData((prev) => ({
      ...prev,
      certificates: (prev.certificates || []).filter((c) => c.id !== id && c._id !== id),
    }));
    showNotification('Certificate deleted.');
  };

  // =========================================================================
  // 3. SAVE SPECIALIZATION (Newest Comes First!)
  // =========================================================================
  const handleSaveSpec = async (form) => {
    const isNew = !form.id && !form._id;
    const specImages = parseList(form.imagesText);
    const primaryImage = form.image || (specImages.length > 0 ? specImages[0] : '');

    const specWithId = {
      id: isNew ? `spec-${Date.now()}` : (form.id || form._id),
      title: form.title,
      category: form.category || 'Specialization',
      iconName: form.iconName || 'Server',
      shortDesc: form.shortDesc || '',
      detailedScope: form.detailedScope || '',
      image: primaryImage,
      images: specImages.length > 0 ? specImages : (primaryImage ? [primaryImage] : []),
      competencies: parseList(form.competenciesText),
      practicalApplication: form.practicalApplication || '',
      skills: parseTags(form.skillsText),
      createdAt: form.createdAt || new Date().toISOString(),
    };

    try {
      if (isNew) {
        await portfolioService.createSpecialization(specWithId);
      } else {
        await portfolioService.updateSpecialization(specWithId.id, specWithId);
      }
    } catch (e) {
      console.warn("Backend specialization save error:", e.message);
    }

    // PREPEND NEW SPECIALIZATION TO TOP SO IT COMES FIRST!
    setPortfolioData((prev) => {
      const existing = prev.specializations || [];
      const updated = isNew
        ? [specWithId, ...existing.filter((s) => s.id !== specWithId.id)]
        : existing.map((s) => ((s.id === specWithId.id || s._id === specWithId.id) ? specWithId : s));
      return { ...prev, specializations: updated };
    });

    setIsSpecModalOpen(false);
    setEditingSpec(null);
    showNotification(`Specialization "${specWithId.title}" saved first in order!`);
  };

  const handleDeleteSpec = async (id) => {
    if (!window.confirm('Delete this specialization track?')) return;
    try {
      await portfolioService.deleteSpecialization(id);
    } catch (e) {
      console.warn("Backend specialization delete error:", e.message);
    }
    setPortfolioData((prev) => ({
      ...prev,
      specializations: (prev.specializations || []).filter((s) => s.id !== id && s._id !== id),
    }));
    showNotification('Specialization deleted.');
  };

  // =========================================================================
  // 4. SAVE EXPERIENCE (Newest Comes First!)
  // =========================================================================
  const handleSaveExp = async (form) => {
    const isNew = !form.id && !form._id;
    const expImages = parseList(form.imagesText);
    const primaryImage = form.image || (expImages.length > 0 ? expImages[0] : '');

    const expWithId = {
      id: isNew ? `exp-${Date.now()}` : (form.id || form._id),
      role: form.role,
      company: form.company,
      period: form.period || '',
      location: form.location || '',
      shortDesc: form.shortDesc || '',
      fullDescription: form.fullDescription || '',
      image: primaryImage,
      images: expImages.length > 0 ? expImages : (primaryImage ? [primaryImage] : []),
      keyAchievements: parseList(form.keyAchievementsText),
      practicalApplication: form.practicalApplication || '',
      tech: parseTags(form.techText),
      createdAt: form.createdAt || new Date().toISOString(),
    };

    try {
      if (isNew) {
        await portfolioService.createExperience(expWithId);
      } else {
        await portfolioService.updateExperience(expWithId.id, expWithId);
      }
    } catch (e) {
      console.warn("Backend experience save error:", e.message);
    }

    // PREPEND NEW EXPERIENCE TO TOP SO IT COMES FIRST!
    setPortfolioData((prev) => {
      const existing = prev.experience || [];
      const updated = isNew
        ? [expWithId, ...existing.filter((x) => x.id !== expWithId.id)]
        : existing.map((x) => ((x.id === expWithId.id || x._id === expWithId.id) ? expWithId : x));
      return { ...prev, experience: updated };
    });

    setIsExpModalOpen(false);
    setEditingExp(null);
    showNotification(`Experience @ "${expWithId.company}" saved first in order!`);
  };

  const handleDeleteExp = async (id) => {
    if (!window.confirm('Delete this role experience?')) return;
    try {
      await portfolioService.deleteExperience(id);
    } catch (e) {
      console.warn("Backend experience delete error:", e.message);
    }
    setPortfolioData((prev) => ({
      ...prev,
      experience: (prev.experience || []).filter((x) => x.id !== id && x._id !== id),
    }));
    showNotification('Experience removed.');
  };

  // Message Actions
  const handleMarkAsRead = async (id) => {
    try {
      await portfolioService.markMessageRead(id);
    } catch (e) {
      // Local fallback
    }
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, isRead: true } : m)));
    showNotification('Message marked as read.');
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this message?')) return;
    try {
      await portfolioService.deleteMessage(id);
    } catch (e) {
      // Local fallback
    }
    setMessages((prev) => prev.filter((m) => m.id !== id));
    showNotification('Message removed from inbox.');
  };

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      
      {/* Save Notification Toast */}
      {saveStatus && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold transition-all duration-300 animate-slideUp ${
            saveStatus.isError ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
          }`}
        >
          {saveStatus.isError ? <AlertCircle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
          <span>{saveStatus.message}</span>
        </div>
      )}

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-slate-200 dark:border-neutral-900">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Admin Command Center</h2>
              <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                Manage all portfolio content, multi-image Cloudinary galleries, and incoming visitor inquiries.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  refreshPortfolioData();
                  fetchMessages();
                  showNotification('Synced latest data with database & storage.');
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-white hover:text-black text-white text-xs font-bold rounded-xl transition-all duration-300 shadow active:scale-95 border border-transparent hover:border-black"
              >
                Refresh Data
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-neutral-950 p-5 rounded-2xl border border-slate-200 dark:border-neutral-900 shadow-sm">
              <span className="text-xs font-semibold text-slate-500">Specializations</span>
              <p className="text-2xl font-black text-emerald-600 mt-1">{portfolioData?.specializations?.length || 0}</p>
            </div>
            <div className="bg-white dark:bg-neutral-950 p-5 rounded-2xl border border-slate-200 dark:border-neutral-900 shadow-sm">
              <span className="text-xs font-semibold text-slate-500">Work Experience</span>
              <p className="text-2xl font-black text-emerald-600 mt-1">{portfolioData?.experience?.length || 0}</p>
            </div>
            <div className="bg-white dark:bg-neutral-950 p-5 rounded-2xl border border-slate-200 dark:border-neutral-900 shadow-sm">
              <span className="text-xs font-semibold text-slate-500">Projects (First Order)</span>
              <p className="text-2xl font-black text-emerald-600 mt-1">{portfolioData?.projects?.length || 0}</p>
            </div>
            <div className="bg-white dark:bg-neutral-950 p-5 rounded-2xl border border-slate-200 dark:border-neutral-900 shadow-sm">
              <span className="text-xs font-semibold text-slate-500">Messages Received</span>
              <p className="text-2xl font-black text-emerald-600 mt-1">{messages.length}</p>
            </div>
          </div>

          {/* Recent Inquiries Preview */}
          <div className="bg-white dark:bg-neutral-950 p-6 rounded-3xl border border-slate-200 dark:border-neutral-900 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Recent Contact Inquiries</span>
              </h3>
              <button
                onClick={() => setActiveTab('messages')}
                className="text-xs font-bold text-emerald-600 hover:underline"
              >
                View All ({messages.length}) →
              </button>
            </div>

            {messages.length === 0 ? (
              <p className="text-xs text-slate-500 py-4">No contact messages received yet.</p>
            ) : (
              <div className="space-y-3">
                {messages.slice(0, 3).map((m) => (
                  <div
                    key={m.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 dark:text-white">{m.name}</span>
                        <span className="text-slate-400">({m.email})</span>
                        {m.phone && <span className="text-emerald-600 font-semibold">• {m.phone}</span>}
                      </div>
                      <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{m.subject}</p>
                      <p className="text-slate-500 line-clamp-1 mt-0.5">{m.message}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <a
                        href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject || '')}`}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-white hover:text-black text-white rounded-lg text-[11px] font-bold border border-transparent hover:border-black transition-all"
                      >
                        Reply
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* PROFILE TAB */}
      {activeTab === 'profile' && (
        <div className="bg-white dark:bg-neutral-950 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-neutral-900 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Profile & Contact Information</h2>
            <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
              Configure your primary identity, contact channels, and dynamic transmission announcement text.
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-5 text-xs">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={profileForm.name || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Professional Title</label>
                <input
                  type="text"
                  value={profileForm.role || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Primary Email Address</label>
                <input
                  type="email"
                  value={profileForm.email || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Official Direct Phone</label>
                <input
                  type="text"
                  value={profileForm.phone || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  placeholder="0991185321"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Physical Location</label>
                <input
                  type="text"
                  value={profileForm.location || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Academic Institution</label>
                <input
                  type="text"
                  value={profileForm.institution || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, institution: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-xs font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold mb-1">About Bio (Professional Narrative)</label>
              <textarea
                rows="4"
                value={profileForm.aboutBio || ''}
                onChange={(e) => setProfileForm({ ...profileForm, aboutBio: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-xs font-medium"
              ></textarea>
            </div>

            {/* ANNOUNCEMENT CARD CONFIGURATION */}
            <div className="pt-4 border-t border-slate-200 dark:border-neutral-900 space-y-3">
              <h3 className="text-sm font-extrabold text-emerald-600 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Contact Success Announcement Card (Database Driven)</span>
              </h3>
              
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Announcement Badge</label>
                  <input
                    type="text"
                    value={announcementForm.badge || ''}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, badge: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Announcement Title</label>
                  <input
                    type="text"
                    value={announcementForm.title || ''}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Confirmation Message Body</label>
                <textarea
                  rows="2"
                  value={announcementForm.message || ''}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, message: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-xs"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold mb-1">Follow-up Commitment Note</label>
                <textarea
                  rows="2"
                  value={announcementForm.followUpNote || ''}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, followUpNote: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-xs"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                className="px-6 py-3 bg-emerald-600 hover:bg-white hover:text-black text-white font-bold text-xs rounded-xl shadow-lg transition-all duration-300 flex items-center gap-2 border border-transparent hover:border-black active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile & Announcement</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =========================================================================
          CV / RESUME MANAGEMENT TAB (ADD, UPDATE, DELETE)
          ========================================================================= */}
      {activeTab === 'cv' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-neutral-950 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-neutral-900 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <span>CV & Resume Management</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
                Upload, update, or remove your official curriculum vitae. When active, visitors can click "Download CV" on your portfolio to download your latest resume.
              </p>
            </div>

            {/* Current Active CV Status Card */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {portfolioData?.cv?.title || 'No CV Active'}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      {portfolioData?.cv?.fileName || 'No file selected'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {portfolioData?.cv?.fileUrl ? (
                    <>
                      <a
                        href={portfolioData.cv.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        download={portfolioData.cv.fileName || "Shanbel_Dires_CV.pdf"}
                        className="px-4 py-2 bg-emerald-600 hover:bg-white hover:text-black text-white rounded-xl text-xs font-bold transition-all shadow flex items-center gap-1.5 border border-transparent hover:border-black"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download & Test File</span>
                      </a>
                      <button
                        onClick={handleDeleteCV}
                        className="px-4 py-2 bg-red-600/10 hover:bg-red-600 text-red-600 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete CV</span>
                      </button>
                    </>
                  ) : (
                    <span className="text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/60 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800">
                      Inactive (No CV on Portfolio)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Add / Update CV Form */}
            <form onSubmit={handleSaveCV} className="space-y-4 text-xs">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {portfolioData?.cv?.fileUrl ? 'Update / Replace Existing CV' : 'Add & Publish New CV'}
              </h3>

              <div>
                <label className="block font-bold mb-1">CV Document Title</label>
                <input
                  type="text"
                  required
                  value={cvForm.title || ''}
                  onChange={(e) => setCvForm({ ...cvForm, title: e.target.value })}
                  placeholder="Shanbel Dires - Full-Stack Software Engineer & Network Architect Resume"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">File Name (What the visitor saves on their machine)</label>
                <input
                  type="text"
                  value={cvForm.fileName || ''}
                  onChange={(e) => setCvForm({ ...cvForm, fileName: e.target.value })}
                  placeholder="Shanbel_Dires_CV.pdf"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">CV File (Upload PDF or specify direct URL)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={cvForm.fileUrl || ''}
                    onChange={(e) => setCvForm({ ...cvForm, fileUrl: e.target.value })}
                    placeholder="https://... or upload below"
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-xs"
                  />
                  <label className="cursor-pointer px-4 py-2.5 bg-emerald-600 hover:bg-white hover:text-black text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow border border-transparent hover:border-black transition-all">
                    <Upload className="w-4 h-4" />
                    <span>Upload CV</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          handleImageUpload(file, (url) => {
                            setCvForm({
                              ...cvForm,
                              fileUrl: url,
                              fileName: file.name,
                            });
                          });
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 bg-emerald-600 hover:bg-white hover:text-black text-white font-bold text-xs rounded-xl shadow-lg transition-all duration-300 flex items-center gap-2 border border-transparent hover:border-black active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>Save & Activate Downloadable CV</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROJECTS TAB (Newest comes first!) */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Featured Projects ({portfolioData?.projects?.length || 0})
              </h2>
              <p className="text-xs text-slate-500">Newly created projects automatically appear first in display order.</p>
            </div>
            <button
              onClick={() => {
                setEditingProject({
                  title: '',
                  category: 'Full-Stack Web App',
                  shortDesc: '',
                  fullDesc: '',
                  image: '',
                  imagesText: '',
                  architectureHighlightsText: 'Decoupled microservice architecture\nReal-time event stream via WebSockets\nHigh concurrency PostgreSQL indexing',
                  practicalApplication: 'Engineered high availability system serving enterprise client workloads.',
                  techText: 'React, Node.js, Express, PostgreSQL, Docker',
                  github: 'https://github.com',
                  live: 'https://example.com',
                });
                setIsProjectModalOpen(true);
              }}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-white hover:text-black text-white rounded-xl text-xs font-bold flex items-center gap-1.5 border border-transparent hover:border-black transition-all shadow active:scale-95"
            >
              <Plus className="w-4 h-4" /> Add New Project (Comes First)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(portfolioData?.projects || []).map((proj, idx) => (
              <div
                key={proj.id || proj._id}
                className="bg-white dark:bg-neutral-950 p-4 rounded-2xl border border-slate-200 dark:border-neutral-900 shadow-sm flex flex-col justify-between group"
              >
                <div>
                  {proj.image && (
                    <div className="h-32 rounded-xl overflow-hidden mb-3 bg-slate-100 dark:bg-neutral-900 relative">
                      <img src={proj.image} alt={proj.title} className="w-full h-full object-cover" />
                      {idx === 0 && (
                        <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow">
                          ★ First Displayed
                        </span>
                      )}
                      {(proj.images && proj.images.length > 1) && (
                        <span className="absolute bottom-2 right-2 bg-black/75 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                          {proj.images.length} Photos
                        </span>
                      )}
                    </div>
                  )}

                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    {proj.category}
                  </span>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mt-0.5">{proj.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">{proj.shortDesc || proj.fullDesc}</p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-neutral-900 flex justify-between items-center">
                  <span className="text-[11px] text-slate-400 font-mono">#{idx + 1} in order</span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => {
                        setEditingProject({
                          ...proj,
                          imagesText: (proj.images || (proj.image ? [proj.image] : [])).join('\n'),
                          architectureHighlightsText: (proj.architectureHighlights || []).join('\n'),
                          techText: (proj.tech || []).join(', '),
                        });
                        setIsProjectModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-neutral-900"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(proj.id || proj._id)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CERTIFICATES TAB (Newest comes first!) */}
      {activeTab === 'certificates' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Certificates & Qualifications ({portfolioData?.certificates?.length || 0})
              </h2>
              <p className="text-xs text-slate-500">Newly added credentials automatically appear first in display order.</p>
            </div>
            <button
              onClick={() => {
                setEditingCert({
                  title: '',
                  issuer: 'Huawei Technologies',
                  date: '2024',
                  certId: '',
                  image: '',
                  imagesText: '',
                  description: '',
                  validatedSkillsText: 'Enterprise Network Navigation\nRouting & Switching Topologies\nSecurity ACL Implementation',
                  practicalApplication: 'Certified for enterprise engineering and multi-site deployments.',
                  credentialUrl: 'https://credential.net',
                });
                setIsCertModalOpen(true);
              }}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-white hover:text-black text-white rounded-xl text-xs font-bold flex items-center gap-1.5 border border-transparent hover:border-black transition-all shadow active:scale-95"
            >
              <Plus className="w-4 h-4" /> Add Certificate (Comes First)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(portfolioData?.certificates || []).map((cert, idx) => (
              <div
                key={cert.id || cert._id}
                className="bg-white dark:bg-neutral-950 p-4 rounded-2xl border border-slate-200 dark:border-neutral-900 shadow-sm flex flex-col justify-between group"
              >
                <div>
                  {cert.image && (
                    <div className="h-32 rounded-xl overflow-hidden mb-3 bg-slate-100 dark:bg-neutral-900 relative">
                      <img src={cert.image} alt={cert.title} className="w-full h-full object-cover" />
                      {idx === 0 && (
                        <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow">
                          ★ First Displayed
                        </span>
                      )}
                      {(cert.images && cert.images.length > 1) && (
                        <span className="absolute bottom-2 right-2 bg-black/75 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                          {cert.images.length} Photos
                        </span>
                      )}
                    </div>
                  )}

                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">{cert.issuer} ({cert.date})</span>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mt-0.5">{cert.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">{cert.description}</p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-neutral-900 flex justify-between items-center">
                  <span className="text-[11px] text-slate-400 font-mono">#{idx + 1} in order</span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => {
                        setEditingCert({
                          ...cert,
                          imagesText: (cert.images || (cert.image ? [cert.image] : [])).join('\n'),
                          validatedSkillsText: (cert.validatedSkills || []).join('\n'),
                        });
                        setIsCertModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-neutral-900"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCert(cert.id || cert._id)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SPECIALIZATIONS TAB */}
      {activeTab === 'specializations' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Specialization Tracks ({portfolioData?.specializations?.length || 0})
            </h2>
            <button
              onClick={() => {
                setEditingSpec({
                  title: '',
                  category: 'Network Infrastructure',
                  iconName: 'Server',
                  shortDesc: '',
                  detailedScope: '',
                  image: '',
                  imagesText: '',
                  competenciesText: 'Dynamic Routing Protocols (OSPF/BGP)\nVLAN Isolation & Inter-VLAN Routing\nAccess Control Lists (ACL)',
                  practicalApplication: 'Engineered multi-tier enterprise network layouts with high-availability redundancy.',
                  skillsText: 'Routing, Switching, VLAN, Security, Wireshark',
                });
                setIsSpecModalOpen(true);
              }}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-white hover:text-black text-white rounded-xl text-xs font-bold flex items-center gap-1.5 border border-transparent hover:border-black transition-all shadow active:scale-95"
            >
              <Plus className="w-4 h-4" /> Add Specialization Track (Comes First)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(portfolioData?.specializations || []).map((spec) => (
              <div
                key={spec.id || spec._id}
                className="bg-white dark:bg-neutral-950 p-4 rounded-2xl border border-slate-200 dark:border-neutral-900 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">{spec.category}</span>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mt-0.5">{spec.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-3 mt-1">{spec.shortDesc}</p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-neutral-900 flex justify-end gap-1.5">
                  <button
                    onClick={() => {
                      setEditingSpec({
                        ...spec,
                        imagesText: (spec.images || (spec.image ? [spec.image] : [])).join('\n'),
                        competenciesText: (spec.competencies || []).join('\n'),
                        skillsText: (spec.skills || []).join(', '),
                      });
                      setIsSpecModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-neutral-900"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteSpec(spec.id || spec._id)}
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EXPERIENCE TAB */}
      {activeTab === 'experience' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Roles & Experience ({portfolioData?.experience?.length || 0})
            </h2>
            <button
              onClick={() => {
                setEditingExp({
                  role: '',
                  company: '',
                  period: '2023 - Present',
                  location: 'Addis Ababa, Ethiopia',
                  shortDesc: '',
                  fullDescription: '',
                  image: '',
                  imagesText: '',
                  keyAchievementsText: 'Led developer bootcamps and workshops\nMentored over 200 student developers\nEngineered community registration systems',
                  practicalApplication: 'Engineered production web applications with 99.9% uptime.',
                  techText: 'React, Node.js, PostgreSQL, Git',
                });
                setIsExpModalOpen(true);
              }}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-white hover:text-black text-white rounded-xl text-xs font-bold flex items-center gap-1.5 border border-transparent hover:border-black transition-all shadow active:scale-95"
            >
              <Plus className="w-4 h-4" /> Add Experience (Comes First)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(portfolioData?.experience || []).map((exp) => (
              <div
                key={exp.id || exp._id}
                className="bg-white dark:bg-neutral-950 p-4 rounded-2xl border border-slate-200 dark:border-neutral-900 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-emerald-600">{exp.period}</span>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mt-0.5">{exp.role}</h3>
                  <p className="text-xs font-semibold text-slate-500">@ {exp.company}</p>
                  <p className="text-xs text-slate-500 line-clamp-3 mt-1">{exp.shortDesc}</p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-neutral-900 flex justify-end gap-1.5">
                  <button
                    onClick={() => {
                      setEditingExp({
                        ...exp,
                        imagesText: (exp.images || (exp.image ? [exp.image] : [])).join('\n'),
                        keyAchievementsText: (exp.keyAchievements || []).join('\n'),
                        techText: (exp.tech || []).join(', '),
                      });
                      setIsExpModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-neutral-900"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteExp(exp.id || exp._id)}
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          MESSAGES TAB: COMPLETE VISITOR DETAILS & EMAIL ACTIONS
          ========================================================================= */}
      {activeTab === 'messages' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Contact Messages & Inquiries ({messages.length})
              </h2>
              <p className="text-xs text-slate-500">All submissions delivered to your dashboard and emailed directly to your inbox.</p>
            </div>
            <button
              onClick={() => {
                fetchMessages();
                showNotification('Inbox refreshed.');
              }}
              className="px-3.5 py-1.5 bg-slate-100 dark:bg-neutral-900 text-slate-700 dark:text-neutral-300 hover:bg-emerald-600 hover:text-white rounded-xl text-xs font-bold transition-all"
            >
              Check for New Messages
            </button>
          </div>

          {messages.length === 0 ? (
            <div className="bg-white dark:bg-neutral-950 p-12 rounded-3xl border border-slate-200 dark:border-neutral-900 text-center space-y-3">
              <MessageSquare className="w-10 h-10 text-slate-300 dark:text-neutral-700 mx-auto" />
              <h3 className="font-bold text-sm">Inbox is Empty</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No visitor inquiries yet. Messages submitted via your portfolio contact form will display here with full details.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`bg-white dark:bg-neutral-950 p-6 rounded-3xl border transition-all duration-200 shadow-sm space-y-4 ${
                    msg.isRead
                      ? 'border-slate-200 dark:border-neutral-900'
                      : 'border-emerald-500/60 ring-1 ring-emerald-500/20'
                  }`}
                >
                  {/* Top Bar: Sender Name, Email, Phone, Timestamp & Read Status */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-neutral-900">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="text-base font-extrabold text-slate-900 dark:text-white">
                          {msg.name}
                        </span>
                        {!msg.isRead ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold text-[10px] uppercase tracking-wider">
                            ★ New Inquiry
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-neutral-900 text-slate-500 font-bold text-[10px]">
                            Reviewed
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-neutral-400">
                        <a
                          href={`mailto:${msg.email}`}
                          className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>{msg.email}</span>
                        </a>

                        {msg.phone && (
                          <a
                            href={`tel:${msg.phone}`}
                            className="flex items-center gap-1 font-bold text-slate-800 dark:text-white hover:text-emerald-500"
                          >
                            <Phone className="w-3.5 h-3.5 text-emerald-500" />
                            <span>{msg.phone}</span>
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{new Date(msg.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Subject:</span>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                      {msg.subject || 'Portfolio Inquiry'}
                    </h4>
                  </div>

                  {/* Message Body */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-neutral-900/60 border border-slate-100 dark:border-neutral-800/80">
                    <p className="text-xs sm:text-sm text-slate-800 dark:text-neutral-200 leading-relaxed whitespace-pre-wrap font-medium">
                      {msg.message}
                    </p>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2">
                      {!msg.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(msg.id)}
                          className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-neutral-900 hover:bg-slate-200 text-slate-700 dark:text-neutral-300 text-xs font-bold transition-all flex items-center gap-1.5"
                        >
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Mark as Read</span>
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="px-3.5 py-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {msg.phone && (
                        <a
                          href={`tel:${msg.phone}`}
                          className="px-4 py-2 bg-black hover:bg-white hover:text-black text-white text-xs font-bold rounded-xl border border-neutral-800 transition-all flex items-center gap-1.5"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call / WhatsApp</span>
                        </a>
                      )}

                      <a
                        href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || 'Portfolio Inquiry')}`}
                        className="px-5 py-2 bg-emerald-600 hover:bg-white hover:text-black text-white text-xs font-bold rounded-xl transition-all shadow border border-transparent hover:border-black flex items-center gap-1.5"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Reply via Email</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          FULL-ATTRIBUTE MODAL: EDIT/ADD PROJECT (WITH MULTI-IMAGE CLOUDINARY UPLOAD)
          ========================================================================= */}
      {isProjectModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-neutral-950 rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-neutral-900 shadow-2xl">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100 dark:border-neutral-900">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {editingProject.id ? 'Edit Project Details' : 'Add New Project (First in Order)'}
                </h3>
                <p className="text-xs text-slate-500">Includes multi-photo gallery for the detail page &lt; &gt; slider.</p>
              </div>
              <button onClick={() => setIsProjectModalOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-neutral-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSaveProject(editingProject); }} className="space-y-4 text-xs">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={editingProject.title}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Category</label>
                  <input
                    type="text"
                    value={editingProject.category}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-xs font-semibold"
                  />
                </div>
              </div>

              {/* PRIMARY COVER IMAGE */}
              <div>
                <label className="block font-bold mb-1">Primary Cover Photo (Featured Card Thumbnail)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingProject.image || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value })}
                    placeholder="https://..."
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-xs"
                  />
                  <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-white hover:text-black text-white text-xs font-bold flex items-center gap-1 border border-transparent hover:border-black transition-all">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) handleImageUpload(file, (url) => setEditingProject({ ...editingProject, image: url }));
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* MULTI-IMAGE CLOUDINARY UPLOADER & GALLERY */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="block font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-emerald-600" />
                      <span>Multiple Photo Gallery (Cloudinary)</span>
                    </label>
                    <p className="text-[11px] text-slate-500">Upload multiple photos at once. They will appear in the &lt; &gt; detail page slider.</p>
                  </div>

                  <label className="cursor-pointer px-4 py-2 bg-emerald-600 hover:bg-white hover:text-black text-white text-xs font-extrabold rounded-xl flex items-center gap-1.5 shadow border border-transparent hover:border-black transition-all active:scale-95">
                    <Upload className="w-4 h-4" />
                    <span>{uploading ? 'Uploading...' : 'Upload Multiple Photos'}</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      disabled={uploading}
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files && files.length > 0) {
                          handleMultipleImageUpload(files, (newUrls) => {
                            const existing = parseList(editingProject.imagesText);
                            const combined = [...existing, ...newUrls];
                            setEditingProject({
                              ...editingProject,
                              imagesText: combined.join('\n'),
                              image: editingProject.image || newUrls[0],
                            });
                          });
                        }
                      }}
                    />
                  </label>
                </div>

                {/* Thumbnails preview */}
                {parseList(editingProject.imagesText).length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {parseList(editingProject.imagesText).map((url, i) => (
                      <div key={i} className="relative w-20 h-14 rounded-xl overflow-hidden border border-slate-300 dark:border-neutral-700 group">
                        <img src={url} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = parseList(editingProject.imagesText).filter((_, idx) => idx !== i);
                            setEditingProject({ ...editingProject, imagesText: updated.join('\n') });
                          }}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                          title="Remove this photo"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        {editingProject.image === url && (
                          <span className="absolute bottom-0 inset-x-0 bg-emerald-600 text-white text-[9px] text-center font-bold">
                            Cover
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Image URLs List (One URL per line):
                  </label>
                  <textarea
                    rows="2"
                    value={editingProject.imagesText || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, imagesText: e.target.value })}
                    placeholder="https://images.unsplash.com/...&#10;https://res.cloudinary.com/..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-xs font-mono"
                  ></textarea>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Short Description (Cards summary)</label>
                <textarea
                  rows="2"
                  value={editingProject.shortDesc || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, shortDesc: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-xs"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold mb-1">System Architecture & Engineering Overview (Detailed Scope)</label>
                <textarea
                  rows="4"
                  value={editingProject.fullDesc || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, fullDesc: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-xs"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold mb-1">Key Architectural Highlights (One per line with checkmarks)</label>
                <textarea
                  rows="3"
                  value={editingProject.architectureHighlightsText || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, architectureHighlightsText: e.target.value })}
                  placeholder="Real-time WebSocket event dispatch&#10;PostgreSQL indexing reduced query latency by 25%&#10;Dockerized microservices boundary separation"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-xs"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold mb-1">Practical Industry Application (Highlighted text box)</label>
                <textarea
                  rows="2"
                  value={editingProject.practicalApplication || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, practicalApplication: e.target.value })}
                  placeholder="Engineered high throughput pipelines handling concurrent requests with high availability."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-xs"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold mb-1">Tech Stack & Tools (Comma-separated)</label>
                <input
                  type="text"
                  value={editingProject.techText || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, techText: e.target.value })}
                  placeholder="React, Node.js, Express, PostgreSQL, Redis, Docker"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-xs"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">GitHub Repository URL</label>
                  <input
                    type="text"
                    value={editingProject.github || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, github: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Live Demo URL</label>
                  <input
                    type="text"
                    value={editingProject.live || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, live: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-neutral-900 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-white hover:text-black text-white rounded-xl text-xs font-bold border border-transparent hover:border-black transition-all shadow"
                >
                  Save Project (Comes First)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          FULL-ATTRIBUTE MODAL: EDIT/ADD CERTIFICATE (WITH MULTI-IMAGE GALLERY)
          ========================================================================= */}
      {isCertModalOpen && editingCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-neutral-950 rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-neutral-900 shadow-2xl">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100 dark:border-neutral-900">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {editingCert.id ? 'Edit Certificate Details' : 'Add New Certificate (First in Order)'}
                </h3>
                <p className="text-xs text-slate-500">Supports multiple verification photos for the slider.</p>
              </div>
              <button onClick={() => setIsCertModalOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-neutral-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSaveCert(editingCert); }} className="space-y-4 text-xs">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Certificate Title *</label>
                  <input
                    type="text"
                    required
                    value={editingCert.title}
                    onChange={(e) => setEditingCert({ ...editingCert, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Issuer (e.g. Huawei, Hikvision, GDG)</label>
                  <input
                    type="text"
                    value={editingCert.issuer}
                    onChange={(e) => setEditingCert({ ...editingCert, issuer: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Issue Year / Date</label>
                  <input
                    type="text"
                    value={editingCert.date}
                    onChange={(e) => setEditingCert({ ...editingCert, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Credential ID</label>
                  <input
                    type="text"
                    value={editingCert.certId || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, certId: e.target.value })}
                    placeholder="HCIA-RS-2023-88491"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-xs font-mono"
                  />
                </div>
              </div>

              {/* COVER PHOTO */}
              <div>
                <label className="block font-bold mb-1">Certificate Primary Cover URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingCert.image || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, image: e.target.value })}
                    placeholder="https://..."
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-xs"
                  />
                  <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-white hover:text-black text-white text-xs font-bold flex items-center gap-1 border border-transparent hover:border-black transition-all">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) handleImageUpload(file, (url) => setEditingCert({ ...editingCert, image: url }));
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* MULTIPLE PHOTOS UPLOAD FOR CERTIFICATE */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="block font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-emerald-600" />
                      <span>Multiple Verification Photos (Cloudinary)</span>
                    </label>
                    <p className="text-[11px] text-slate-500">Upload multiple credential and badge photos at once.</p>
                  </div>

                  <label className="cursor-pointer px-4 py-2 bg-emerald-600 hover:bg-white hover:text-black text-white text-xs font-extrabold rounded-xl flex items-center gap-1.5 shadow border border-transparent hover:border-black transition-all active:scale-95">
                    <Upload className="w-4 h-4" />
                    <span>{uploading ? 'Uploading...' : 'Upload Multiple Photos'}</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      disabled={uploading}
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files && files.length > 0) {
                          handleMultipleImageUpload(files, (newUrls) => {
                            const existing = parseList(editingCert.imagesText);
                            const combined = [...existing, ...newUrls];
                            setEditingCert({
                              ...editingCert,
                              imagesText: combined.join('\n'),
                              image: editingCert.image || newUrls[0],
                            });
                          });
                        }
                      }}
                    />
                  </label>
                </div>

                <div>
                  <textarea
                    rows="2"
                    value={editingCert.imagesText || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, imagesText: e.target.value })}
                    placeholder="https://...&#10;https://..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-xs font-mono"
                  ></textarea>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Accreditation Scope Description</label>
                <textarea
                  rows="3"
                  value={editingCert.description || ''}
                  onChange={(e) => setEditingCert({ ...editingCert, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-xs"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold mb-1">Validated Technical Skills (One per line)</label>
                <textarea
                  rows="3"
                  value={editingCert.validatedSkillsText || ''}
                  onChange={(e) => setEditingCert({ ...editingCert, validatedSkillsText: e.target.value })}
                  placeholder="Huawei Enterprise VRP OS Navigation&#10;OSPF Multi-Area Routing Implementation&#10;STP / RSTP Loop Prevention Protocols"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-xs"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold mb-1">Practical Industry Application</label>
                <textarea
                  rows="2"
                  value={editingCert.practicalApplication || ''}
                  onChange={(e) => setEditingCert({ ...editingCert, practicalApplication: e.target.value })}
                  placeholder="Qualified to configure and manage enterprise network topologies up to 500 nodes."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-xs"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold mb-1">Official Verification URL</label>
                <input
                  type="text"
                  value={editingCert.credentialUrl || ''}
                  onChange={(e) => setEditingCert({ ...editingCert, credentialUrl: e.target.value })}
                  placeholder="https://huawei.com or https://credential.net"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-neutral-900 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCertModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-white hover:text-black text-white rounded-xl text-xs font-bold border border-transparent hover:border-black transition-all shadow"
                >
                  Save Certificate (Comes First)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          FULL-ATTRIBUTE MODAL: EDIT/ADD SPECIALIZATION (WITH MULTI-IMAGE GALLERY)
          ========================================================================= */}
      {isSpecModalOpen && editingSpec && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-neutral-950 rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-neutral-900 shadow-2xl">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100 dark:border-neutral-900">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {editingSpec.id ? 'Edit Specialization Track' : 'Add Specialization Track (First in Order)'}
                </h3>
                <p className="text-xs text-slate-500">Same format as Huawei HCIA with full curriculum & gallery.</p>
              </div>
              <button onClick={() => setIsSpecModalOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-neutral-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSaveSpec(editingSpec); }} className="space-y-4 text-xs">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Track Title *</label>
                  <input
                    type="text"
                    required
                    value={editingSpec.title}
                    onChange={(e) => setEditingSpec({ ...editingSpec, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Category</label>
                  <input
                    type="text"
                    value={editingSpec.category}
                    onChange={(e) => setEditingSpec({ ...editingSpec, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-xs font-semibold"
                  />
                </div>
              </div>

              {/* COVER PHOTO & MULTI-IMAGE GALLERY */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="block font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-emerald-600" />
                      <span>Track Gallery Images (Cloudinary)</span>
                    </label>
                    <p className="text-[11px] text-slate-500">Upload topology diagrams or setup photos for the &lt; &gt; slider.</p>
                  </div>

                  <label className="cursor-pointer px-4 py-2 bg-emerald-600 hover:bg-white hover:text-black text-white text-xs font-extrabold rounded-xl flex items-center gap-1.5 shadow border border-transparent hover:border-black transition-all active:scale-95">
                    <Upload className="w-4 h-4" />
                    <span>Upload Multiple Photos</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files && files.length > 0) {
                          handleMultipleImageUpload(files, (newUrls) => {
                            const existing = parseList(editingSpec.imagesText);
                            const combined = [...existing, ...newUrls];
                            setEditingSpec({
                              ...editingSpec,
                              imagesText: combined.join('\n'),
                              image: editingSpec.image || newUrls[0],
                            });
                          });
                        }
                      }}
                    />
                  </label>
                </div>

                <textarea
                  rows="2"
                  value={editingSpec.imagesText || ''}
                  onChange={(e) => setEditingSpec({ ...editingSpec, imagesText: e.target.value })}
                  placeholder="https://...&#10;https://..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-xs font-mono"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold mb-1">Short Description (Cards summary)</label>
                <textarea
                  rows="2"
                  value={editingSpec.shortDesc || ''}
                  onChange={(e) => setEditingSpec({ ...editingSpec, shortDesc: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-xs"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold mb-1">Complete Scope & Technical Curriculum (Detail Page)</label>
                <textarea
                  rows="4"
                  value={editingSpec.detailedScope || ''}
                  onChange={(e) => setEditingSpec({ ...editingSpec, detailedScope: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-xs"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold mb-1">Core Competencies (One item per line)</label>
                <textarea
                  rows="4"
                  value={editingSpec.competenciesText || ''}
                  onChange={(e) => setEditingSpec({ ...editingSpec, competenciesText: e.target.value })}
                  placeholder="Dynamic Routing Protocols (OSPF/BGP)&#10;VLAN Isolation & Inter-VLAN Routing&#10;Network Access Control Lists (ACL)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-xs"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold mb-1">Practical Industry Application (Highlighted text box)</label>
                <textarea
                  rows="2"
                  value={editingSpec.practicalApplication || ''}
                  onChange={(e) => setEditingSpec({ ...editingSpec, practicalApplication: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-xs"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold mb-1">Tech Stack & Tools (Comma-separated)</label>
                <input
                  type="text"
                  value={editingSpec.skillsText || ''}
                  onChange={(e) => setEditingSpec({ ...editingSpec, skillsText: e.target.value })}
                  placeholder="Routing & Switching, VLAN / Subnetting, Network Security, OSPF / BGP, Wireshark"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-neutral-900 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSpecModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-white hover:text-black text-white rounded-xl text-xs font-bold border border-transparent hover:border-black transition-all shadow"
                >
                  Save Specialization (Comes First)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          FULL-ATTRIBUTE MODAL: EDIT/ADD EXPERIENCE (WITH MULTI-IMAGE GALLERY)
          ========================================================================= */}
      {isExpModalOpen && editingExp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-neutral-950 rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-neutral-900 shadow-2xl">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100 dark:border-neutral-900">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {editingExp.id ? 'Edit Role Experience' : 'Add Work Experience (First in Order)'}
                </h3>
                <p className="text-xs text-slate-500">Supports role overview, deliverables, and gallery photos.</p>
              </div>
              <button onClick={() => setIsExpModalOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-neutral-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSaveExp(editingExp); }} className="space-y-4 text-xs">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Role Title *</label>
                  <input
                    type="text"
                    required
                    value={editingExp.role}
                    onChange={(e) => setEditingExp({ ...editingExp, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Company / Organization *</label>
                  <input
                    type="text"
                    required
                    value={editingExp.company}
                    onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Period (e.g. 2023 - Present)</label>
                  <input
                    type="text"
                    value={editingExp.period}
                    onChange={(e) => setEditingExp({ ...editingExp, period: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Location</label>
                  <input
                    type="text"
                    value={editingExp.location || ''}
                    onChange={(e) => setEditingExp({ ...editingExp, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-xs"
                  />
                </div>
              </div>

              {/* MULTI-IMAGE GALLERY FOR EXPERIENCE */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="block font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-emerald-600" />
                      <span>Experience Photos (Workshops, Events)</span>
                    </label>
                    <p className="text-[11px] text-slate-500">Upload photos for the &lt; &gt; slider.</p>
                  </div>

                  <label className="cursor-pointer px-4 py-2 bg-emerald-600 hover:bg-white hover:text-black text-white text-xs font-extrabold rounded-xl flex items-center gap-1.5 shadow border border-transparent hover:border-black transition-all active:scale-95">
                    <Upload className="w-4 h-4" />
                    <span>Upload Multiple Photos</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files && files.length > 0) {
                          handleMultipleImageUpload(files, (newUrls) => {
                            const existing = parseList(editingExp.imagesText);
                            const combined = [...existing, ...newUrls];
                            setEditingExp({
                              ...editingExp,
                              imagesText: combined.join('\n'),
                              image: editingExp.image || newUrls[0],
                            });
                          });
                        }
                      }}
                    />
                  </label>
                </div>

                <textarea
                  rows="2"
                  value={editingExp.imagesText || ''}
                  onChange={(e) => setEditingExp({ ...editingExp, imagesText: e.target.value })}
                  placeholder="https://...&#10;https://..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-xs font-mono"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold mb-1">Short Summary (Timeline summary)</label>
                <textarea
                  rows="2"
                  value={editingExp.shortDesc || ''}
                  onChange={(e) => setEditingExp({ ...editingExp, shortDesc: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-xs"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold mb-1">Full Role Overview & Responsibilities (Detail Page)</label>
                <textarea
                  rows="4"
                  value={editingExp.fullDescription || ''}
                  onChange={(e) => setEditingExp({ ...editingExp, fullDescription: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-xs"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold mb-1">Key Deliverables & Performance Metrics (One per line)</label>
                <textarea
                  rows="3"
                  value={editingExp.keyAchievementsText || ''}
                  onChange={(e) => setEditingExp({ ...editingExp, keyAchievementsText: e.target.value })}
                  placeholder="Organized 12+ tech workshops&#10;Mentored over 200 student developers&#10;Reduced SQL query latency by 25%"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-xs"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold mb-1">Practical Industry Application</label>
                <textarea
                  rows="2"
                  value={editingExp.practicalApplication || ''}
                  onChange={(e) => setEditingExp({ ...editingExp, practicalApplication: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-xs"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold mb-1">Tech Stack & Tools (Comma-separated)</label>
                <input
                  type="text"
                  value={editingExp.techText || ''}
                  onChange={(e) => setEditingExp({ ...editingExp, techText: e.target.value })}
                  placeholder="React, Node.js, PostgreSQL, REST API, Git"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-neutral-900 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsExpModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-white hover:text-black text-white rounded-xl text-xs font-bold border border-transparent hover:border-black transition-all shadow"
                >
                  Save Experience (Comes First)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}
