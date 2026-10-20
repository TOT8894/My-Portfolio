import React, { useState } from 'react';
import { Sun, Moon, Layers, X, ShieldCheck, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePortfolio } from '../../context/PortfolioContext';

export default function Navbar({ darkMode, setDarkMode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { portfolioData } = usePortfolio();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/90 dark:bg-black/90 border-b border-slate-200 dark:border-neutral-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <a href="/#hero" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-105 transition-transform duration-300">
            SD
          </div>
          <span className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">
            Shanbel<span className="text-emerald-500">.Dires</span>
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-neutral-300">
          <a href="/#hero" className="hover:text-emerald-500 transition-colors">Home</a>
          <a href="/#about" className="hover:text-emerald-500 transition-colors">About</a>
          <a href="/#specializations" className="hover:text-emerald-500 transition-colors">Specializations</a>
          <a href="/#experience" className="hover:text-emerald-500 transition-colors">Experience</a>
          <a href="/#projects" className="hover:text-emerald-500 transition-colors">Projects</a>
          <a href="/#certificates" className="hover:text-emerald-500 transition-colors">Certificates</a>
          <a href="/#contact" className="hover:text-emerald-500 transition-colors">Contact</a>
          {portfolioData?.cv?.fileUrl && (
            <a
              href={portfolioData.cv.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              download={portfolioData.cv.fileName || "Shanbel_Dires_CV.pdf"}
              className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CV</span>
            </a>
          )}
        </nav>

        {/* Theme Toggle & Hire Me CTA & Admin Shortcut */}
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <Link
              to="/admin/dashboard"
              className="px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 rounded-lg border border-emerald-300 dark:border-emerald-800 flex items-center gap-1.5 hover:bg-emerald-100 transition"
              title="Open Admin Dashboard"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>
          )}

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-neutral-800 text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-900 transition-all active:scale-95"
            aria-label="Toggle Theme"
            title="Toggle Light/Dark Theme"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: '20s' }} /> : <Moon className="w-5 h-5 text-slate-700" />}
          </button>

          {/* GREEN BUTTON WITH WHITE HOVER */}
          <a
            href="/#contact"
            className="hidden sm:inline-flex px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-white hover:text-black rounded-xl shadow-md transition-all duration-300 active:scale-95 border border-transparent hover:border-black dark:hover:border-white"
          >
            Hire Me
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-900 transition"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Layers className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 dark:border-neutral-900 bg-white dark:bg-black px-6 py-5 space-y-3 text-sm font-medium shadow-xl animate-fadeIn">
          <a href="/#hero" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-emerald-500">Home</a>
          <a href="/#about" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-emerald-500">About</a>
          <a href="/#specializations" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-emerald-500">Specializations</a>
          <a href="/#experience" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-emerald-500">Experience</a>
          <a href="/#projects" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-emerald-500">Projects</a>
          <a href="/#certificates" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-emerald-500">Certificates</a>
          <a href="/#contact" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-emerald-500">Contact</a>
          {portfolioData?.cv?.fileUrl && (
            <a
              href={portfolioData.cv.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              download={portfolioData.cv.fileName || "Shanbel_Dires_CV.pdf"}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1 font-bold text-emerald-600 dark:text-emerald-400"
            >
              Download CV / Resume
            </a>
          )}
          <div className="pt-2 border-t border-slate-100 dark:border-neutral-900 flex items-center justify-between">
            <a
              href="/#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
            >
              Hire Me
            </a>
            {isAuthenticated ? (
              <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-emerald-500 text-xs font-bold">Admin Dashboard</Link>
            ) : (
              <Link to="/admin/login" onClick={() => setMobileMenuOpen(false)} className="text-slate-400 text-xs">Admin Login</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
