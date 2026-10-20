import React from 'react';
import {
  LayoutDashboard,
  User,
  Layers,
  Briefcase,
  FolderGit2,
  Award,
  Mail,
  LogOut,
  ExternalLink,
  Shield,
  Database,
  CheckCircle,
  AlertCircle,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePortfolio } from '../../context/PortfolioContext';

export default function AdminLayout({ activeTab, setActiveTab, children }) {
  const { adminUser, logout } = useAuth();
  const { isUsingFallback, refreshPortfolioData, loading } = usePortfolio();

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'profile', label: 'Profile & About', icon: User },
    { id: 'cv', label: 'CV / Resume Manager', icon: FileText },
    { id: 'specializations', label: 'Specializations', icon: Layers },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'messages', label: 'Messages / Inquiries', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-black text-slate-900 dark:text-slate-100 flex flex-col md:flex-row transition-colors">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between p-4 md:p-6 flex-shrink-0">
        <div>
          {/* Brand */}
          <div className="flex items-center gap-3 pb-6 mb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
              SD
            </div>
            <div>
              <h2 className="font-extrabold text-base leading-tight">Admin Console</h2>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <Shield className="w-3 h-3" /> Shanbel Dires
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 space-y-2">
          {/* Database connection badge */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-[11px]">
            <div className="flex items-center justify-between font-semibold">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <Database className="w-3.5 h-3.5 text-emerald-500" />
                Data Source:
              </span>
              {isUsingFallback ? (
                <span className="text-amber-500 font-bold flex items-center gap-1">
                  Demo Fallback
                </span>
              ) : (
                <span className="text-emerald-500 font-bold flex items-center gap-1">
                  PostgreSQL Active
                </span>
              )}
            </div>
          </div>

          <Link
            to="/"
            target="_blank"
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live Portfolio</span>
          </Link>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-h-screen">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
          <div>
            <h1 className="text-2xl font-extrabold capitalize text-slate-900 dark:text-white">
              {navItems.find((i) => i.id === activeTab)?.label || 'Dashboard'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Manage and synchronize your live portfolio data
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => refreshPortfolioData()}
              disabled={loading}
              className="px-3.5 py-2 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              {loading ? 'Refreshing...' : 'Sync Data'}
            </button>
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-900 dark:text-white">{adminUser?.name || 'Shanbel Dires'}</p>
              <p className="text-[10px] text-slate-500">{adminUser?.email || 'admin@portfolio.local'}</p>
            </div>
          </div>
        </header>

        {children}
      </main>

    </div>
  );
}
