import {
  Github,
  Linkedin,
  Mail,
  MapPin,
  Send,
  Shield,
  Server,
  Code,
  Award,
  Layers,
  Cpu,
  Tv,
  Globe,
  Briefcase,
  PhoneCall,
} from 'lucide-react';

export const ICON_MAP = {
  Server,
  Tv,
  Shield,
  Linkedin,
  Github,
  Globe,
  Send,
  Mail,
  MapPin,
  PhoneCall,
  Award,
  Briefcase,
  Code,
  Cpu,
  Layers,
};

export const DEFAULT_DATA = {
  profile: {},

  cv: null,

  socialChannels: [
    {
      id: 'linkedin',
      platform: 'LinkedIn',
      handle: '',
      url: 'https://www.linkedin.com/in/shanbel-dires-2b60733aa/',
      brandColor: '#0A66C2',
      bgClass:
        'bg-[#0A66C2]/10 border-[#0A66C2]/30 text-[#0A66C2]',
      hoverClass: 'hover:bg-[#0A66C2] hover:text-white',
      iconName: 'Linkedin',
    },
    {
      id: 'github',
      platform: 'GitHub',
      handle: '',
      url: 'https://github.com/TOT8894',
      brandColor: '#181717',
      bgClass:
        'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white',
      hoverClass:
        'hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-black',
      iconName: 'Github',
    },
    {
      id: 'twitter',
      platform: 'X / Twitter',
      handle: '',
      url: 'https://x.com/shyul143527',
      brandColor: '#000000',
      bgClass:
        'bg-slate-100 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white',
      hoverClass:
        'hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black',
      iconName: 'Globe',
    },
    {
      id: 'telegram',
      platform: 'Telegram',
      handle: '',
      url: 'https://t.me/TOT8894',
      brandColor: '#229ED9',
      bgClass:
        'bg-[#229ED9]/10 border-[#229ED9]/30 text-[#229ED9]',
      hoverClass: 'hover:bg-[#229ED9] hover:text-white',
      iconName: 'Send',
    },
    {
      id: 'phone',
      platform: 'Phone Call',
      handle: '+251 98 894 6528',
      url: 'tel:+251988946528',
      brandColor: '#059669',
      bgClass:
        'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
      hoverClass: 'hover:bg-emerald-600 hover:text-white',
      iconName: 'PhoneCall',
    },
    {
      id: 'email',
      platform: 'Gmail Direct',
      handle: 'shanbeldires8@gmail.com',
      url: 'mailto:shanbeldires8@gmail.com',
      brandColor: '#EA4335',
      bgClass:
        'bg-[#EA4335]/10 border-[#EA4335]/30 text-[#EA4335]',
      hoverClass: 'hover:bg-[#EA4335] hover:text-white',
      iconName: 'Mail',
    },
    {
      id: 'location',
      platform: 'Location',
      handle: 'Addis Ababa, Ethiopia',
      url: '#contact',
      brandColor: '#10B981',
      bgClass:
        'bg-emerald-500/10 border-emerald-500/30 text-emerald-500',
      hoverClass: 'hover:bg-emerald-600 hover:text-white',
      iconName: 'MapPin',
    },
  ],

  specializations: [],

  experience: [],

  projects: [],

  certificates: [],

  announcement: null,

  footer: {
    quickLinks: [
      { name: 'Home', href: '#hero' },
      { name: 'About Me', href: '#about' },
      { name: 'Specializations', href: '#specializations' },
      { name: 'Work Experience', href: '#experience' },
      { name: 'Projects', href: '#projects' },
      { name: 'Certificates', href: '#certificates' },
      { name: 'Contact', href: '#contact' },
    ],
    copyText: 'Designed & Built by Shanbel Dires',
  },
};