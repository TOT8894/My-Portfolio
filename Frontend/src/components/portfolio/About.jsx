import React from 'react';
import { User, CheckCircle, Download } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import ScrollReveal from '../common/ScrollReveal';

export default function About() {
  const { portfolioData } = usePortfolio();
  const profile = portfolioData?.profile || {};
  const stats = [
    { label: 'Years Experience of Programming', value: '2+' },
    { label: 'Projects Completed', value: '8+' },
    { label: 'Certifications', value: '6+' },
  ];

  return (
    <section id="about" className="py-20 bg-white dark:bg-black border-t border-slate-200 dark:border-neutral-900 transition-colors overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <ScrollReveal animation="fade-up">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Background</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1 tracking-tight">
              About Me
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm sm:text-base">
              Engineered at the intersection of web software development and physical network infrastructure.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-12 gap-8 items-center">
          
          {/* Bio Deep Dive */}
          <div className="md:col-span-7">
            <ScrollReveal animation="fade-right" delay={150}>
              <div className="bg-slate-50 dark:bg-neutral-950 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-neutral-900 space-y-4 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-emerald-500" />
                  Engineering Philosophy & Journey
                </h3>
                <p className="text-slate-600 dark:text-neutral-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {profile.aboutBio || `Studying at ${profile.institution || 'AASTU'}, I built my foundational engineering knowledge across full-stack software development and network infrastructure.`}
                </p>

                <div className="pt-2 flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800">
                    Software Development
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800">
                    Network Architecture
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800">
                    IP Surveillance & CCTV
                  </span>
                </div>

                {portfolioData?.cv?.fileUrl && (
                  <div className="pt-3 border-t border-slate-200 dark:border-neutral-800">
                    <a
                      href={portfolioData.cv.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={portfolioData.cv.fileName || "Shanbel_Dires_CV.pdf"}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-white hover:text-black text-white font-semibold text-xs rounded-xl shadow transition-all duration-300 border border-transparent hover:border-black active:scale-95"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Resume / CV</span>
                    </a>
                  </div>
                )}
              </div>
            </ScrollReveal>
          </div>

          {/* Stats Grid */}
          <div className="md:col-span-5 grid grid-cols-1 gap-4">
            {stats.map((stat, idx) => (
              <ScrollReveal key={idx} animation="zoom-in" delay={150 + idx * 80}>
                <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800/70 text-center flex flex-col items-center justify-center shadow-sm hover:bg-emerald-100 dark:hover:bg-emerald-950/70 hover:-translate-y-0.5 transition-all duration-300">
                  <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    {stat.value}
                  </p>
                  <p className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 mt-0.5">
                    {stat.label}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
