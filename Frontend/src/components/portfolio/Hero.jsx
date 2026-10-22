import React from 'react';
import { Send, Eye, CheckCircle, BookOpen, MapPin, Sparkles, Download } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import ScrollReveal from '../common/ScrollReveal';

export default function Hero() {
  const { portfolioData } = usePortfolio();
  const profile = portfolioData?.profile || {};

  return (
    <section id="hero" className="py-20 md:py-32 bg-gradient-to-b from-emerald-50/40 via-white to-white dark:from-black dark:via-black dark:to-black transition-colors overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-12 gap-10 items-center">
          
          {/* Avatar Profile Box */}
          <div className="md:col-span-4 flex flex-col items-center text-center md:items-start md:text-left">
            <ScrollReveal animation="zoom-in" delay={100}>
              <div className="relative group">
                <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden border-4 border-emerald-500/30 shadow-2xl p-1 bg-white dark:bg-neutral-950 group-hover:border-emerald-500/70 transition-all duration-500">
                  <img
                    src={profile.avatar }
                    alt={profile.name || "Shanbel Dires"}
                    className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition duration-500"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
                <span className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-2.5 rounded-2xl shadow-lg animate-bounce" style={{ animationDuration: '3s' }} title="Certified Professional">
                  <CheckCircle className="w-5 h-5" />
                </span>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={200}>
              <div className="mt-6 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Available for Engineering Projects
              </div>
            </ScrollReveal>
          </div>

          {/* Hero Bio Details */}
          <div className="md:col-span-8 text-center md:text-left space-y-5">
            <ScrollReveal animation="fade-left" delay={150}>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Hi, I'm <span className="text-emerald-600 dark:text-emerald-500">{profile.name || "Shanbel Dires"}</span> 👋
              </h1>
            </ScrollReveal>

            <ScrollReveal animation="fade-left" delay={250}>
              <p className="text-lg sm:text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                {profile.role || "Full-Stack Software Engineer & Network Architect"}
              </p>
            </ScrollReveal>

            <ScrollReveal animation="fade-left" delay={300}>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-500 dark:text-neutral-400 text-xs sm:text-sm">
                <span className="flex items-center gap-1.5 font-medium">
                  <BookOpen className="w-4 h-4 text-emerald-500" />
                  {profile.institution || "Addis Ababa Science and Technology University (AASTU)"}
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  {profile.location || "Addis Ababa, Ethiopia"}
                </span>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-left" delay={350}>
              <p className="text-slate-600 dark:text-neutral-300 leading-relaxed max-w-2xl text-sm sm:text-base">
                {profile.aboutBio}
              </p>
            </ScrollReveal>

            {/* ACTION CTAS: GREEN WITH WHITE HOVER */}
            <ScrollReveal animation="fade-up" delay={400}>
              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4">
                <a
                  href="#contact"
                  className="px-7 py-3.5 bg-emerald-600 hover:bg-white hover:text-black text-white font-semibold rounded-xl shadow-lg transition-all duration-300 active:scale-95 flex items-center gap-2 text-sm border border-transparent hover:border-black dark:hover:border-white"
                >
                  <Send className="w-4 h-4" />
                  <span>Contact Me</span>
                </a>

                {portfolioData?.cv?.fileUrl && (
                  <a
                    href={portfolioData.cv.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={portfolioData.cv.fileName || "Shanbel_Dires_CV.pdf"}
                    className="px-7 py-3.5 bg-emerald-600 hover:bg-white hover:text-black text-white font-semibold rounded-xl shadow-lg transition-all duration-300 active:scale-95 flex items-center gap-2 text-sm border border-transparent hover:border-black dark:hover:border-white"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download CV</span>
                  </a>
                )}
                
                <a
                  href="#projects"
                  className="px-7 py-3.5 bg-slate-100 dark:bg-neutral-900 hover:bg-white hover:text-black dark:hover:bg-white dark:hover:text-black text-slate-800 dark:text-neutral-200 font-semibold rounded-xl border border-slate-200 dark:border-neutral-800 transition-all duration-300 flex items-center gap-2 text-sm active:scale-95 shadow-sm"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Projects</span>
                </a>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
}
