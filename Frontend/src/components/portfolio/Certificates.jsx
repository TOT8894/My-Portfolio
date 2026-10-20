import React, { useRef } from 'react';
import { Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../../context/PortfolioContext';
import ScrollReveal from '../common/ScrollReveal';

export default function Certificates() {
  const { portfolioData } = usePortfolio();
  const certificates = portfolioData?.certificates || [];
  const scrollRef = useRef(null);

  if (!certificates || certificates.length === 0) return null;

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="certificates" className="py-20 bg-white dark:bg-black border-t border-slate-200 dark:border-neutral-900 transition-colors overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header & Horizontal Controls */}
        <ScrollReveal animation="fade-up">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Verified Qualifications</span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1 flex items-center gap-2.5 tracking-tight">
                <Award className="w-8 h-8 text-emerald-500" />
                Certifications & Credentials
              </h2>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => scroll('left')}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900 text-slate-700 dark:text-neutral-300 hover:bg-emerald-600 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 shadow-sm active:scale-95"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900 text-slate-700 dark:text-neutral-300 hover:bg-emerald-600 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 shadow-sm active:scale-95"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Horizontal Scrollable Carousel Track */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-emerald-600 scrollbar-track-slate-100 dark:scrollbar-track-neutral-900 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'thin' }}
        >
          {certificates.map((cert, index) => (
            <div
              key={cert.id || cert._id}
              className="min-w-[280px] sm:min-w-[340px] md:min-w-[380px] max-w-[380px] snap-start bg-slate-50 dark:bg-neutral-950 rounded-3xl p-6 border border-slate-200 dark:border-neutral-900 shadow-sm hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between group flex-shrink-0"
            >
              <div>
                {cert.image && (
                  <div className="h-44 rounded-2xl overflow-hidden mb-4 bg-slate-200 dark:bg-neutral-900">
                    <img
                      src={cert.image}
                      alt={cert.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                )}
                
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  {cert.issuer} ({cert.date})
                </span>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1 group-hover:text-emerald-500 transition-colors">
                  {cert.title}
                </h3>

                <p className="text-slate-600 dark:text-neutral-400 text-xs mt-2 line-clamp-3 leading-relaxed">
                  {cert.description}
                </p>
              </div>

              {/* GREEN BUTTON WITH WHITE HOVER -> REDIRECTS TO DETAIL PAGE (NO POP-UP) */}
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-neutral-900">
                <Link
                  to={`/details/certificate/${cert.id || cert._id}`}
                  className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-white hover:text-black text-white font-semibold text-xs rounded-xl shadow transition-all duration-300 flex items-center justify-center gap-1.5 border border-transparent hover:border-black dark:hover:border-white active:scale-95"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>See Certificate Details</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
