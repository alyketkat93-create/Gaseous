import React, { useState } from 'react';
import {
  Flame,
  Globe,
  User,
  Sun,
  Moon,
  ShieldCheck,
  Building2,
  FileText,
  BadgeCheck,
  ChevronDown,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Language } from '../../i18n/translations';
import { UnitSystem } from '../../types';

interface HeaderProps {
  currentModuleName: string;
  calcReference: string;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  unitSystem: UnitSystem;
  onUnitSystemChange: (unit: UnitSystem) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  engineerName?: string;
  engineerRole?: string;
  onOpenSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentModuleName,
  calcReference,
  lang,
  onLanguageChange,
  unitSystem,
  onUnitSystemChange,
  theme,
  onToggleTheme,
  engineerName = 'Aly Ketkat',
  engineerRole = 'Lead Fire Protection Engineer',
  onOpenSettings,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getInitials = (name: string) => {
    const parts = name.replace(/^Eng\.?\s+|^Dr\.?\s+/i, '').trim().split(/\s+/);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    if (parts.length === 1 && parts[0]) return parts[0].substring(0, 2).toUpperCase();
    return 'AK';
  };

  return (
    <header className="no-print sticky top-0 z-40 bg-navy-900 border-b border-slate-700/80 px-4 lg:px-6 py-2.5 flex items-center justify-between text-white shadow-md">
      {/* Left: Brand Logo & Current Module / Reference */}
      <div className="flex items-center gap-3 lg:gap-6 min-w-0">
        {/* Brand */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-engBlue flex items-center justify-center shadow-md shadow-engBlue/30">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 leading-tight">
              <span className="font-extrabold text-base lg:text-lg tracking-wider text-white">FIRECALC</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-engBlue/20 text-blue-300 border border-engBlue/40">
                PRO
              </span>
            </div>
            <div className="text-[10px] text-slate-300 font-medium hidden sm:block">
              {lang === 'ar' ? 'حاسبة هندسة أنظمة الإطفاء' : 'Fire Suppression Engineering Calculator'}
            </div>
          </div>
        </div>

        {/* Vertical divider */}
        <div className="hidden md:block h-7 w-px bg-slate-700" />

        {/* Current Module & Reference */}
        <div className="hidden sm:flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white truncate max-w-xs lg:max-w-md">
              {currentModuleName}
            </span>
            {calcReference && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-navy-800 text-blue-200 border border-slate-700 shrink-0">
                {calcReference}
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-400">
            {lang === 'ar' ? 'دقة في كل معادلة. ثقة في كل تصميم.' : 'Precision in Every Calculation. Confidence in Every Design.'}
          </span>
        </div>
      </div>

      {/* Right: Controls & User Profile */}
      <div className="flex items-center gap-2 lg:gap-3 shrink-0">
        {/* Unit System Switcher */}
        <div className="flex items-center rounded-lg bg-navy-800 p-0.5 border border-slate-700">
          <button
            onClick={() => onUnitSystemChange('metric')}
            className={`px-2 py-1 text-xs rounded font-medium transition ${
              unitSystem === 'metric'
                ? 'bg-engBlue text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Metric SI (m, kg, bar, °C)"
          >
            SI
          </button>
          <button
            onClick={() => onUnitSystemChange('imperial')}
            className={`px-2 py-1 text-xs rounded font-medium transition ${
              unitSystem === 'imperial'
                ? 'bg-engBlue text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Imperial US (ft, lb, psi, °F)"
          >
            US
          </button>
        </div>

        {/* Language Switcher */}
        <button
          onClick={() => onLanguageChange(lang === 'en' ? 'ar' : 'en')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-navy-800 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition cursor-pointer"
          title={lang === 'en' ? 'التحويل للغة العربية' : 'Switch to English'}
        >
          <Globe className="w-3.5 h-3.5 text-blue-400" />
          <span>{lang === 'en' ? 'العربية' : 'EN'}</span>
        </button>

        {/* Theme Switcher */}
        <button
          onClick={onToggleTheme}
          className="p-1.5 rounded-lg bg-navy-800 hover:bg-slate-800 text-slate-300 border border-slate-700 transition cursor-pointer"
          title={theme === 'dark' ? 'Switch to Engineering Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-300" />
          )}
        </button>

        {/* Compliance Badge */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>NFPA / SBC Verified</span>
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 pl-2 border-l border-slate-700 focus:outline-none cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-engBlue flex items-center justify-center text-white font-bold text-xs ring-2 ring-slate-700 group-hover:ring-blue-400 transition">
              {getInitials(engineerName)}
            </div>
            <div className="hidden lg:block text-left rtl:text-right">
              <div className="text-xs font-bold text-white group-hover:text-blue-200 transition truncate max-w-[120px]">
                {engineerName}
              </div>
              <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                {engineerRole}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition" />
          </button>

          {/* User Popover Menu */}
          {showUserMenu && (
            <div
              className={`absolute top-full mt-2 w-64 rounded-xl bg-navy-900 border border-slate-700 shadow-2xl p-3 z-50 ${
                lang === 'ar' ? 'left-0' : 'right-0'
              }`}
            >
              <div className="pb-3 border-b border-slate-700">
                <div className="text-xs font-bold text-white">{engineerName}</div>
                <div className="text-[11px] text-blue-300">{engineerRole}</div>
                <div className="text-[10px] text-slate-400 mt-1">License: PE-FPE-94021 / SCE 489210</div>
              </div>
              <div className="py-2 space-y-1 text-xs">
                {onOpenSettings && (
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenSettings();
                    }}
                    className="w-full text-left rtl:text-right px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition flex items-center gap-2 cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5 text-blue-400" />
                    <span>{lang === 'ar' ? 'إعدادات المكتب والترخيص' : 'Engineering Settings'}</span>
                  </button>
                )}
              </div>
              <div className="pt-2 border-t border-slate-700 text-[10px] text-slate-400 flex items-center justify-between">
                <span>FIRECALC PRO v2.4</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <BadgeCheck className="w-3 h-3" /> Online
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
