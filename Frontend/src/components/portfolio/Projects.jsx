import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../../context/PortfolioContext';
import ScrollReveal from '../common/ScrollReveal';

export default function Projects() {
  const { portfolioData } = usePortfolio();
  const projects = portfolioData?.projects || [];
  const [filter, setFilter] = useState('All');

  if (!projects || projects.length === 0) return null;

  const categories = ['All', ...new Set(projects.map((p) => p.category).filter(Boolean))];

  const filteredProjects = filter === 'All'
    ? projects
    : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="py-20 bg-slate-50 dark:bg-black border-t border-slate-200 dark:border-neutral-900 transition-colors overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <ScrollReveal animation="fade-up">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Portfolio</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1 tracking-tight">
              Featured Projects
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm sm:text-base">
              Click 'See More Details' on any project to inspect complete architectural breakdowns, source code, and live deployments.
            </p>
          </div>
        </ScrollReveal>

        {/* Category Filters */}
        <ScrollReveal animation="fade-up" delay={50}>
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-200 ${
                  filter === cat
                    ? 'bg-emerald-600 text-white shadow-md scale-105'
                    : 'bg-white dark:bg-neutral-950 text-slate-600 dark:text-neutral-300 border border-slate-200 dark:border-neutral-900 hover:bg-slate-100 dark:hover:bg-neutral-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Scrollable Container (Fixed to maximum 2 rows; scrolls internally if more than 2 rows) */}
        <div className="max-h-[960px] overflow-y-auto pr-1 sm:pr-2 scrollbar-thin scrollbar-thumb-emerald-500/40 hover:scrollbar-thumb-emerald-500 scrollbar-track-transparent rounded-3xl p-1">
          {/* 3-Column Responsive Grid with Scroll Animations */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-2">
            {filteredProjects.map((proj, index) => (
              <ScrollReveal key={proj.id || proj._id} animation="fade-up" delay={index * 80}>
                <div className="bg-white dark:bg-neutral-950 rounded-3xl overflow-hidden border border-slate-200 dark:border-neutral-900 shadow-sm hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group h-full">
                  <div>
                    {proj.image && (
                      <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-neutral-900">
                        <img
                          src={proj.image}
                          alt={proj.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                        {proj.category && (
                          <span className="absolute top-3 left-3 bg-black/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg border border-neutral-800">
                            {proj.category}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="p-6">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                        {proj.title}
                      </h3>

                      <p className="text-slate-600 dark:text-neutral-400 text-xs sm:text-sm mt-2 line-clamp-3 leading-relaxed">
                        {proj.shortDesc || proj.fullDesc}
                      </p>

                      {proj.tech && (
                        <div className="flex flex-wrap gap-1.5 mt-4">
                          {proj.tech.slice(0, 3).map((t, i) => (
                            <span key={i} className="text-xs px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-neutral-900 text-slate-600 dark:text-neutral-300 border border-slate-200 dark:border-neutral-800">
                              {t}
                            </span>
                          ))}
                          {proj.tech.length > 3 && (
                            <span className="text-xs text-slate-400 self-center">+{proj.tech.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* GREEN BUTTON WITH WHITE HOVER -> REDIRECTS TO DETAIL PAGE (NO POP-UP) */}
                  <div className="p-6 pt-0">
                    <Link
                      to={`/details/project/${proj.id || proj._id}`}
                      className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-white hover:text-black text-white font-semibold text-xs rounded-xl shadow transition-all duration-300 flex items-center justify-center gap-1.5 border border-transparent hover:border-black dark:hover:border-white active:scale-95"
                    >
                      <span>See More Details</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {filteredProjects.length > 6 && (
          <p className="text-center text-xs text-slate-500 dark:text-neutral-400 mt-4 flex items-center justify-center gap-1.5 font-medium">
            <span>Scroll inside the projects view to explore all {filteredProjects.length} projects</span>
            <span className="animate-bounce">↓</span>
          </p>
        )}

      </div>
    </section>
  );
}
