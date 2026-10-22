import React from 'react';
import { Server, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../../context/PortfolioContext';
import { ICON_MAP } from '../../config/iconMap';
import ScrollReveal from '../common/ScrollReveal';

export default function Specializations() {
  const { portfolioData } = usePortfolio();
  const specializations = portfolioData?.specializations || [];

  if (!specializations || specializations.length === 0) return null;

  return (
    <section id="specializations" className="py-20 bg-slate-50 dark:bg-black border-t border-slate-200 dark:border-neutral-900 transition-colors overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <ScrollReveal animation="fade-up">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Core Disciplines</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1 tracking-tight">
              Learning Tracks & Specializations
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm sm:text-base">
              Click 'See More Details' to view complete technical scope, curriculum, and competencies.
            </p>
          </div>
        </ScrollReveal>

        {/* 3-Column Responsive Grid with Scroll Animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specializations.map((spec, index) => {
            const IconComp = spec.icon || (spec.iconName && ICON_MAP[spec.iconName]) || Server;
            return (
              <ScrollReveal key={spec.id || spec._id} animation="fade-up" delay={index * 100}>
                <div className="bg-white dark:bg-neutral-950 p-6 rounded-3xl border border-slate-200 dark:border-neutral-900 shadow-sm hover:shadow-xl hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group h-full">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shadow-inner group-hover:scale-105 transition-transform duration-300">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-neutral-900 text-slate-600 dark:text-neutral-300 font-semibold border border-slate-200 dark:border-neutral-800">
                        {spec.category}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors duration-200">
                      {spec.title}
                    </h3>

                    <p className="text-slate-600 dark:text-neutral-400 text-xs sm:text-sm mt-2 leading-relaxed line-clamp-3">
                      {spec.shortDesc}
                    </p>

                    {spec.skills && (
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {spec.skills.slice(0, 3).map((sk, idx) => (
                          <span key={idx} className="text-xs px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-neutral-900 text-slate-700 dark:text-neutral-300 font-medium">
                            {sk}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* GREEN BUTTON WITH WHITE HOVER -> REDIRECTS TO DETAIL PAGE (NO POP-UP) */}
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-neutral-900">
                    <Link
                      to={`/details/specialization/${spec.id || spec._id}`}
                      className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-white hover:text-black text-white font-semibold text-xs rounded-xl shadow transition-all duration-300 flex items-center justify-center gap-1.5 border border-transparent hover:border-black dark:hover:border-white active:scale-95"
                    >
                      <span>See More Details</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

      </div>
    </section>
  );
}
