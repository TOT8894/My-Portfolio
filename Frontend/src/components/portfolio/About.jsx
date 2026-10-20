import React from 'react';
import { User, CheckCircle, Download } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import ScrollReveal from '../common/ScrollReveal';

export default function About() {
  const { portfolioData } = usePortfolio();
  const profile = portfolioData?.profile || {};
  const stats = profile.stats || [];

  return (
    <section id="about" className="py-20 bg-white dark:bg-black border-t border-slate-200 dark:border-neutral-900 transition-colors overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <ScrollReveal animation="fade-up">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Background</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1 tracking-tight">
              About {profile.name || "Shanbel Dires"}
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
                <p className="text-slate-600 dark:text-neutral-300 text-sm leading-relaxed">
                  Studying at <strong>{profile.institution ? profile.institution.split('(')[1]?.replace(')', '') || profile.institution : 'AASTU'}</strong>, I built my foundational engineering knowledge across full-stack software development and network design. My work spans constructing responsive single-page web applications with modern React architecture to engineering low-latency Express API microservices.
                </p>
                <p className="text-slate-600 dark:text-neutral-300 text-sm leading-relaxed">
                  Beyond software, I hold deep practical competence in physical network routing, switch configuration (Huawei HCIA), and digital IP surveillance (Hikvision CCTV setup). I am passionate about mentoring student developers as Tech Lead at GDG AASTU and contributing to open community tech initiatives.
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
          <div className="md:col-span-5 grid grid-cols-2 gap-4">
            {stats.map((stat, idx) => (
              <ScrollReveal key={idx} animation="zoom-in" delay={150 + idx * 80}>
                <div className="bg-slate-50 dark:bg-neutral-950 p-6 rounded-3xl border border-slate-200 dark:border-neutral-900 text-center flex flex-col justify-center shadow-sm hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300">
                  <p className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    {stat.value}
                  </p>
                  <p className="text-xs font-medium text-slate-600 dark:text-neutral-400 mt-1">
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
