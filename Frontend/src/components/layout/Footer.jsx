import React from 'react';
import { ArrowUp, Globe } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { ICON_MAP } from '../../config/iconMap';

export default function Footer() {
  const { portfolioData } = usePortfolio();
  const footer = portfolioData?.footer || {};
  const profile = portfolioData?.profile || {};
  const socialChannels = portfolioData?.socialChannels || [];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black text-white border-t border-neutral-900 py-16 transition-colors relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Multi-Column Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-10 pb-12 border-b border-neutral-900">
          
          {/* Column 1: Brand & Bio (md:col-span-5) */}
          <div className="md:col-span-5 space-y-4">
            <a href={footer.brandHref || '/#hero'} className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-base shadow-md group-hover:bg-emerald-500 transition duration-300">
                {footer.brandMark || ''}
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                {footer.brandName || profile.name || ''}
              </span>
            </a>
            
            <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed max-w-sm">
              {footer.description || ''}
            </p>
            
            {footer.statusText && <div className="pt-1">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/90 text-emerald-300 text-xs font-semibold border border-emerald-800/80">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                {footer.statusText}
              </span>
            </div>}
          </div>

          {/* Column 2: Quick Links (Vertical Column) (md:col-span-3) */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Quick Links
            </h4>
            <ul className="flex flex-col space-y-2.5 text-xs font-medium text-neutral-300">
              {(footer.quickLinks || []).map((link, idx) => {
                const targetHref = link.href.startsWith('#') ? `/${link.href}` : link.href;
                return (
                  <li key={idx}>
                    <a
                      href={targetHref}
                      className="hover:text-emerald-400 transition-colors duration-200 flex items-center gap-1.5"
                    >
                      <span>{link.name}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 3: Social Channels (Vertical Column) (md:col-span-4) */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Social & Network Channels
            </h4>
            <ul className="flex flex-col space-y-2.5 text-xs font-medium text-neutral-300">
              {socialChannels.map((channel) => {
                const IconComp = channel.icon || (channel.iconName && ICON_MAP[channel.iconName]) || Globe;
                return (
                  <li key={channel.id || channel._id}>
                    <a
                      href={channel.url}
                      target={channel.url.startsWith('http') ? '_blank' : '_self'}
                      rel="noreferrer"
                      className="hover:text-emerald-400 transition-colors duration-200 flex items-center gap-2.5 group"
                    >
                      <IconComp className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                      <span className="text-white font-medium">{channel.platform}</span>
                      {(channel.id === 'location' || channel.id === 'email') && channel.handle && (
                        <span className="text-[11px] text-neutral-400 truncate">({channel.handle})</span>
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

        </div>

        {/* Bottom Credits Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-4">
          <p>© {new Date().getFullYear()} {footer.copyrightName || profile.name || ''}. All rights reserved.</p>
          <p className="text-neutral-300 font-medium">{footer.copyText || ''}</p>

          <button
            onClick={scrollToTop}
            className="p-3 rounded-xl bg-emerald-600 hover:bg-white hover:text-black text-white border border-transparent hover:border-white transition-all duration-300 flex items-center gap-1.5 shadow-md active:scale-95"
            title="Back to Top"
          >
            <ArrowUp className="w-4 h-4" />
            <span className="text-[11px] font-bold">Back to Top</span>
          </button>
        </div>

      </div>
    </footer>
  );
}
