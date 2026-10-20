import React from 'react';
import { MapPin, Briefcase, ChevronRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../../context/PortfolioContext';
import ScrollReveal from '../common/ScrollReveal';

export default function Experience() {
  const { portfolioData } = usePortfolio();
  const experience = portfolioData?.experience || [];

  if (!experience || experience.length === 0) return null;

  return (
    <section id="experience" className="py-20 bg-white dark:bg-black border-t border-slate-200 dark:border-neutral-900 transition-colors overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <ScrollReveal animation="fade-up">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Professional History</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1 tracking-tight">
              Work & Leadership Experience
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm sm:text-base">
              Detailed career timeline highlighting technical leadership, backend engineering, and community initiatives.
            </p>
          </div>
        </ScrollReveal>

        {/* Extended Horizontal Rows Layout */}
        <div className="space-y-5">
          {experience.map((exp, index) => (
            <ScrollReveal key={exp.id || exp._id} animation="fade-up" delay={index * 80}>
              <div className="bg-slate-50 dark:bg-neutral-950 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-neutral-900 shadow-sm hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-6 group">
                
                {/* Extended Details */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                      {exp.period}
                    </span>
                    
                    {exp.location && (
                      <span className="text-xs text-slate-500 dark:text-neutral-400 flex items-center gap-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                        {exp.location}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                      {exp.role}
                    </h3>
                    <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                      @ {exp.company}
                    </p>
                  </div>

                  <p className="text-slate-600 dark:text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-4xl">
                    {exp.shortDesc || exp.fullDescription}
                  </p>

                  {exp.tech && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {exp.tech.map((item, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-900 text-slate-700 dark:text-neutral-300 border border-slate-200 dark:border-neutral-800 font-medium"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* GREEN BUTTON WITH WHITE HOVER -> REDIRECTS TO DETAIL PAGE (NO POP-UP) */}
                <div className="lg:pl-6 lg:border-l lg:border-slate-200 dark:lg:border-neutral-900 flex-shrink-0 flex items-center">
                  <Link
                    to={`/details/experience/${exp.id || exp._id}`}
                    className="w-full sm:w-auto py-3 px-5 bg-emerald-600 hover:bg-white hover:text-black text-white font-semibold text-xs rounded-xl shadow-md transition-all duration-300 flex items-center justify-center gap-2 border border-transparent hover:border-black dark:hover:border-white active:scale-95"
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>See More Details</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
