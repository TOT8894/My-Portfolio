import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  ExternalLink,
  Github,
  Award,
  ChevronLeft,
  ChevronRight,
  Layers,
  CheckCircle,
  Sparkles,
  Send,
  ShieldCheck,
  Maximize2
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import ScrollReveal from '../components/common/ScrollReveal';

export default function DetailPage() {
  const { type, id } = useParams();
  const { portfolioData } = usePortfolio();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Scroll to top on navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentImageIndex(0);
  }, [type, id]);

  // Find item dynamically
  let item = null;
  let typeLabel = '';
  let backAnchor = '#hero';

  if (type === 'specialization') {
    typeLabel = 'Learning Track & Specialization';
    backAnchor = '#specializations';
    item = (portfolioData?.specializations || []).find((s) => s.id === id || s._id === id);
  } else if (type === 'experience') {
    typeLabel = 'Professional Work & Leadership';
    backAnchor = '#experience';
    item = (portfolioData?.experience || []).find((e) => e.id === id || e._id === id);
  } else if (type === 'project') {
    typeLabel = 'Featured Project Architecture';
    backAnchor = '#projects';
    item = (portfolioData?.projects || []).find((p) => p.id === id || p._id === id);
  } else if (type === 'certificate') {
    typeLabel = 'Verified Credential & Accreditation';
    backAnchor = '#certificates';
    item = (portfolioData?.certificates || []).find((c) => c.id === id || c._id === id);
  }

  // Gallery images resolver: checks for multiple images, or single image fallback
  const galleryImages = (item?.images && Array.isArray(item.images) && item.images.length > 0)
    ? item.images
    : (item?.image ? [item.image] : []);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-white dark:bg-black text-slate-900 dark:text-white transition-colors">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center mx-auto">
            <Layers className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold">Item Not Found</h2>
          <p className="text-xs text-slate-500 dark:text-neutral-400">
            The requested technical detail item could not be retrieved.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white hover:bg-white hover:text-black font-semibold text-xs rounded-xl shadow-lg transition-all duration-300 border border-transparent hover:border-black dark:hover:border-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Portfolio</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white transition-colors py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* TOP NAVIGATION: BACK TO PORTFOLIO BUTTON */}
        <ScrollReveal animation="fade-up">
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-neutral-900">
            <Link
              to={`/${backAnchor}`}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-white dark:bg-neutral-900 text-slate-800 dark:text-white border border-slate-200 dark:border-neutral-800 hover:bg-emerald-600 hover:text-white hover:border-emerald-500 dark:hover:bg-white dark:hover:text-black transition-all duration-300 font-bold text-xs shadow-sm active:scale-95 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Portfolio</span>
            </Link>

            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800">
              {typeLabel}
            </span>
          </div>
        </ScrollReveal>

        {/* HERO TITLE & META HEADER */}
        <ScrollReveal animation="fade-up" delay={100}>
          <div className="bg-white dark:bg-neutral-950 p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-neutral-900 shadow-sm space-y-4">
            
            {/* Meta Badges */}
            <div className="flex flex-wrap items-center gap-3">
              {item.category && (
                <span className="px-3 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                  {item.category}
                </span>
              )}
              {item.period && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 dark:bg-neutral-900 text-slate-700 dark:text-neutral-300 text-xs font-semibold">
                  <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                  {item.period}
                </span>
              )}
              {item.location && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 dark:bg-neutral-900 text-slate-700 dark:text-neutral-300 text-xs font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                  {item.location}
                </span>
              )}
              {item.issuer && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                  <Award className="w-3.5 h-3.5 text-emerald-500" />
                  {item.issuer} ({item.date})
                </span>
              )}
            </div>

            {/* Main Title */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {item.title || item.role}
            </h1>

            {item.company && (
              <p className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400">
                @ {item.company}
              </p>
            )}

            {item.certId && (
              <p className="text-xs font-mono text-slate-500 dark:text-neutral-400">
                Credential ID: <span className="text-slate-800 dark:text-white font-bold">{item.certId}</span>
              </p>
            )}

            {/* Short Tagline */}
            <p className="text-slate-600 dark:text-neutral-300 text-sm sm:text-base leading-relaxed pt-1">
              {item.shortDesc || item.description}
            </p>
          </div>
        </ScrollReveal>

        {/* ==========================================================
           INTERACTIVE IMAGE GALLERY CAROUSEL WITH < > CONTROLS
           ========================================================== */}
        {galleryImages.length > 0 && (
          <ScrollReveal animation="zoom-in" delay={150}>
            <div className="bg-white dark:bg-neutral-950 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-neutral-900 shadow-xl space-y-4">
              
              {/* Main Image Display Box */}
              <div className="relative h-72 sm:h-96 md:h-[460px] rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center group">
                <img
                  src={galleryImages[currentImageIndex]}
                  alt={`${item.title || item.role} - Preview ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover transition-all duration-500"
                />

                {/* Dark Gradient Overlay on Bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none"></div>

                {/* Image Counter Badge */}
                <div className="absolute top-4 right-4 bg-black/75 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-white/20 shadow">
                  <span>{currentImageIndex + 1}</span> / <span>{galleryImages.length}</span>
                </div>

                {/* Previous Button < */}
                {galleryImages.length > 1 && (
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-2xl bg-black/75 hover:bg-white hover:text-black text-white flex items-center justify-center transition-all duration-200 shadow-xl border border-white/20 backdrop-blur-md active:scale-95 z-10"
                    aria-label="Previous Image"
                    title="Previous Image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                )}

                {/* Next Button > */}
                {galleryImages.length > 1 && (
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-2xl bg-black/75 hover:bg-white hover:text-black text-white flex items-center justify-center transition-all duration-200 shadow-xl border border-white/20 backdrop-blur-md active:scale-95 z-10"
                    aria-label="Next Image"
                    title="Next Image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                )}
              </div>

              {/* Thumbnails Bar (If multiple images) */}
              {galleryImages.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-thin">
                  {galleryImages.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 transition-all duration-200 flex-shrink-0 ${
                        currentImageIndex === idx
                          ? 'border-emerald-500 scale-105 shadow-md ring-2 ring-emerald-500/30'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

            </div>
          </ScrollReveal>
        )}

        {/* COMPREHENSIVE TECHNICAL DETAIL CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Main Content Area (md:col-span-8) */}
          <div className="md:col-span-8 space-y-6">
            
            {/* 1. Full Description / Scope */}
            <ScrollReveal animation="fade-up" delay={200}>
              <div className="bg-white dark:bg-neutral-950 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-neutral-900 shadow-sm space-y-3">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  {type === 'specialization' && 'Complete Scope & Technical Curriculum'}
                  {type === 'experience' && 'Full Role Overview & Responsibilities'}
                  {type === 'project' && 'System Architecture & Engineering Overview'}
                  {type === 'certificate' && 'Accreditation Scope & Verification'}
                </h3>
                
                <p className="text-slate-700 dark:text-neutral-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {item.detailedScope || item.fullDescription || item.fullDesc || item.description}
                </p>
              </div>
            </ScrollReveal>

            {/* 2. Structured Deliverables / Highlights / Competencies */}
            {(item.competencies || item.keyAchievements || item.architectureHighlights || item.validatedSkills) && (
              <ScrollReveal animation="fade-up" delay={250}>
                <div className="bg-white dark:bg-neutral-950 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-neutral-900 shadow-sm space-y-4">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    {type === 'specialization' && 'Core Competencies'}
                    {type === 'experience' && 'Key Deliverables & Performance Metrics'}
                    {type === 'project' && 'Key Architectural Highlights'}
                    {type === 'certificate' && 'Validated Competencies & Technical Skills'}
                  </h3>

                  <ul className="space-y-3 text-sm text-slate-700 dark:text-neutral-300">
                    {(item.competencies || item.keyAchievements || item.architectureHighlights || item.validatedSkills).map((point, idx) => (
                      <li key={idx} className="flex items-start gap-3 bg-slate-50 dark:bg-black p-3.5 rounded-2xl border border-slate-100 dark:border-neutral-900">
                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            )}

            {/* Practical Application Box */}
            {item.practicalApplication && (
              <ScrollReveal animation="fade-up" delay={300}>
                <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                    Practical Industry Application:
                  </h4>
                  <p className="text-sm text-emerald-950 dark:text-emerald-100 font-medium leading-relaxed">
                    {item.practicalApplication}
                  </p>
                </div>
              </ScrollReveal>
            )}

          </div>

          {/* Sidebar Area: Tech Tools & Action CTAs (md:col-span-4) */}
          <div className="md:col-span-4 space-y-6">
            
            {/* Tech Stack & Tools */}
            {(item.tech || item.skills) && (
              <ScrollReveal animation="fade-left" delay={200}>
                <div className="bg-white dark:bg-neutral-950 p-6 rounded-3xl border border-slate-200 dark:border-neutral-900 shadow-sm space-y-4">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Tech Stack & Tools
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(item.tech || item.skills).map((tool, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-neutral-900 text-slate-800 dark:text-neutral-200 text-xs font-semibold border border-slate-200 dark:border-neutral-800"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Action Buttons: Green by default, White on hover */}
            <ScrollReveal animation="fade-left" delay={250}>
              <div className="bg-white dark:bg-neutral-950 p-6 rounded-3xl border border-slate-200 dark:border-neutral-900 shadow-sm space-y-3">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-2">
                  Action Links
                </h3>

                {item.live && (
                  <a
                    href={item.live}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-white hover:text-black text-white font-semibold text-xs rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 border border-transparent hover:border-black dark:hover:border-white active:scale-95"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Launch Live Demo</span>
                  </a>
                )}

                {item.github && (
                  <a
                    href={item.github}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-white hover:text-black text-white font-semibold text-xs rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 border border-transparent hover:border-black dark:hover:border-white active:scale-95"
                  >
                    <Github className="w-4 h-4" />
                    <span>View GitHub Source</span>
                  </a>
                )}

                {item.credentialUrl && (
                  <a
                    href={item.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-white hover:text-black text-white font-semibold text-xs rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 border border-transparent hover:border-black dark:hover:border-white active:scale-95"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verify Credential</span>
                  </a>
                )}

                {/* Direct Contact Button */}
                <Link
                  to="/#contact"
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-white hover:text-black text-white font-semibold text-xs rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 border border-transparent hover:border-black dark:hover:border-white active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>Inquire About This</span>
                </Link>
              </div>
            </ScrollReveal>

          </div>

        </div>

        {/* BOTTOM BACK BUTTON */}
        <ScrollReveal animation="fade-up">
          <div className="pt-6 border-t border-slate-200 dark:border-neutral-900 text-center">
            <Link
              to={`/${backAnchor}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-white hover:text-black text-white font-bold text-xs shadow-lg transition-all duration-300 border border-transparent hover:border-black dark:hover:border-white active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Main Portfolio</span>
            </Link>
          </div>
        </ScrollReveal>

      </div>
    </div>
  );
}
