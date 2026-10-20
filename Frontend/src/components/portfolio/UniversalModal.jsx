import React from 'react';
import { X, CheckCircle, Github, ExternalLink } from 'lucide-react';

export default function UniversalModal({ item, modalType, onClose }) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 p-6 relative text-slate-900 dark:text-white">
        
        {/* Close Modal Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badges */}
        <div className="pr-8">
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
            {modalType === 'specialization' && 'Specialization & Curriculum'}
            {modalType === 'experience' && 'Work Experience Highlights'}
            {modalType === 'project' && 'Project Architecture'}
            {modalType === 'certificate' && 'Verified Certificate'}
          </span>

          <h2 className="text-2xl font-extrabold mt-1">{item.title || item.role}</h2>

          {item.company && (
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
              @ {item.company} ({item.period})
            </p>
          )}

          {item.issuer && (
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Issued by {item.issuer} • Date: {item.date} {item.certId && `• ID: ${item.certId}`}
            </p>
          )}
        </div>

        {/* Modal Photo Preview */}
        {item.image && (
          <div className="my-5 h-60 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
            <img src={item.image} alt={item.title || item.role} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Modal Description Content */}
        <div className="space-y-5 mt-4">
          
          {/* SPECIALIZATION MODAL CONTENT */}
          {modalType === 'specialization' && (
            <>
              <div>
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Scope & Curriculum
                </h4>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  {item.detailedScope}
                </p>
              </div>

              {item.competencies && (
                <div>
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Core Competencies
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {item.competencies.map((c, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {item.practicalApplication && (
                <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl">
                  <p className="text-xs text-emerald-900 dark:text-emerald-200 font-medium">
                    <strong>Practical Application:</strong> {item.practicalApplication}
                  </p>
                </div>
              )}
            </>
          )}

          {/* EXPERIENCE MODAL CONTENT */}
          {modalType === 'experience' && (
            <>
              <div>
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Full Role Overview
                </h4>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  {item.fullDescription || item.shortDesc}
                </p>
              </div>

              {item.keyAchievements && (
                <div>
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Key Deliverables & Metrics
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {item.keyAchievements.map((ach, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {/* PROJECT MODAL CONTENT */}
          {modalType === 'project' && (
            <>
              <div>
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Detailed System Overview
                </h4>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  {item.fullDesc || item.shortDesc}
                </p>
              </div>

              {item.architectureHighlights && (
                <div>
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Architecture Highlights
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {item.architectureHighlights.map((h, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {/* CERTIFICATE MODAL CONTENT */}
          {modalType === 'certificate' && (
            <>
              <div>
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Certificate Scope
                </h4>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>

              {item.validatedSkills && (
                <div>
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Validated Technical Skills
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {item.validatedSkills.map((v, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>{v}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {/* TECH TAGS */}
          {(item.tech || item.skills) && (
            <div>
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Tech Stack & Tools
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {(item.tech || item.skills).map((t, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-medium">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* EXTERNAL LINK CTAS */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-3">
            {item.github && (
              <a
                href={item.github}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-800 transition"
              >
                <Github className="w-4 h-4" /> Source Code
              </a>
            )}
            {item.live && (
              <a
                href={item.live}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:bg-emerald-700 transition"
              >
                <ExternalLink className="w-4 h-4" /> Live Demo
              </a>
            )}
            {item.credentialUrl && (
              <a
                href={item.credentialUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:bg-emerald-700 transition"
              >
                <ExternalLink className="w-4 h-4" /> Verify Official Credential
              </a>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
