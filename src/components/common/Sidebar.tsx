import React, { useState } from 'react';
import {
  LayoutDashboard,
  Flame,
  Wind,
  AlertOctagon,
  Sparkles,
  Waves,
  History,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Wrench,
  GitBranch,
  ShieldCheck,
  Database,
  Calculator,
  BookOpen,
  Droplets,
  Layers,
} from 'lucide-react';
import { Language, DICTIONARY } from '../../i18n/translations';

export type NavTab =
  | 'dashboard'
  | 'fm200'
  | 'fk5112'
  | 'co2'
  | 'aerosol'
  | 'inert-gas'
  | 'foam'
  | 'history'
  | 'reports'
  | 'settings'
  | 'piping'
  | 'venting'
  | 'equipment'
  | 'boq'
  | 'standards';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  lang: Language;
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  lang,
  collapsed,
  onToggleCollapsed,
}) => {
  const t = DICTIONARY[lang];
  const [showUtilities, setShowUtilities] = useState(false);

  // The 6 dedicated fire suppression system calculators
  const systemCalculators = [
    { id: 'fm200' as NavTab, label: t.nav.fm200, icon: Flame, badge: 'NFPA 2001', code: 'HFC-227ea' },
    { id: 'fk5112' as NavTab, label: t.nav.fk5112, icon: Droplets, badge: 'NFPA 2001', code: 'FK-5-1-12' },
    { id: 'co2' as NavTab, label: t.nav.co2, icon: AlertOctagon, badge: 'NFPA 12', code: 'CO2 High/Low' },
    { id: 'aerosol' as NavTab, label: t.nav.aerosol, icon: Sparkles, badge: 'NFPA 2010', code: 'Condensed' },
    { id: 'inert-gas' as NavTab, label: t.nav.inertGas, icon: Wind, badge: 'NFPA 2001', code: 'IG-541/55/100' },
    { id: 'foam' as NavTab, label: t.nav.foam, icon: Waves, badge: 'NFPA 11', code: 'Low/Med Foam' },
  ];

  // Secondary Technical Utilities
  const technicalUtilities = [
    { id: 'piping' as NavTab, label: t.nav.pipingReview, icon: GitBranch },
    { id: 'venting' as NavTab, label: t.nav.ventingIntegrity, icon: ShieldCheck },
    { id: 'equipment' as NavTab, label: t.nav.equipmentDb, icon: Database },
    { id: 'boq' as NavTab, label: t.nav.boqCost, icon: Calculator },
    { id: 'standards' as NavTab, label: t.nav.standards, icon: BookOpen },
  ];

  return (
    <aside
      className={`no-print bg-navy-900 border-r border-slate-700/80 transition-all duration-300 flex flex-col justify-between shrink-0 select-none ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="py-3 overflow-y-auto max-h-[calc(100vh-60px)]">
        {/* Section 1: Dashboard */}
        <div className="px-3 mb-4">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              currentTab === 'dashboard'
                ? 'bg-engBlue text-white shadow-md shadow-engBlue/20'
                : 'text-slate-300 hover:text-white hover:bg-navy-800'
            }`}
            title={t.nav.dashboard}
          >
            <LayoutDashboard className={`w-4 h-4 shrink-0 ${currentTab === 'dashboard' ? 'text-white' : 'text-blue-400'}`} />
            {!collapsed && <span>{t.nav.dashboard}</span>}
          </button>
        </div>

        {/* Section 2: Dedicated Fire Suppression Calculators */}
        <div className="px-3 mb-4">
          {!collapsed && (
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1.5 flex items-center justify-between">
              <span>{lang === 'ar' ? 'أنظمة الإطفاء المتخصصة' : 'Suppression Calculators'}</span>
              <span className="text-[9px] bg-slate-800 text-slate-400 px-1 rounded">6</span>
            </div>
          )}
          <nav className="space-y-1">
            {systemCalculators.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition cursor-pointer group ${
                    isActive
                      ? 'bg-engBlue text-white shadow-md shadow-engBlue/20'
                      : 'text-slate-300 hover:text-white hover:bg-navy-800'
                  }`}
                  title={`${item.label} (${item.code})`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-blue-400 group-hover:text-blue-300'}`} />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </div>
                  {!collapsed && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-mono shrink-0 ${
                        isActive ? 'bg-navy-900 text-blue-200' : 'bg-navy-800 text-slate-400 group-hover:text-slate-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Section 3: Records & Deliverables */}
        <div className="px-3 mb-4">
          {!collapsed && (
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1.5">
              {lang === 'ar' ? 'السجلات والمخرجات' : 'Deliverables & History'}
            </div>
          )}
          <nav className="space-y-1">
            {/* Calculation History */}
            <button
              onClick={() => onSelectTab('history')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                currentTab === 'history'
                  ? 'bg-engBlue text-white shadow-md shadow-engBlue/20'
                  : 'text-slate-300 hover:text-white hover:bg-navy-800'
              }`}
              title={t.nav.history}
            >
              <History className={`w-4 h-4 shrink-0 ${currentTab === 'history' ? 'text-white' : 'text-amber-400'}`} />
              {!collapsed && <span>{t.nav.history}</span>}
            </button>

            {/* Engineering Reports */}
            <button
              onClick={() => onSelectTab('reports')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                currentTab === 'reports'
                  ? 'bg-engBlue text-white shadow-md shadow-engBlue/20'
                  : 'text-slate-300 hover:text-white hover:bg-navy-800'
              }`}
              title={t.nav.reports}
            >
              <FileText className={`w-4 h-4 shrink-0 ${currentTab === 'reports' ? 'text-white' : 'text-emerald-400'}`} />
              {!collapsed && <span>{t.nav.reports}</span>}
            </button>

            {/* Settings */}
            <button
              onClick={() => onSelectTab('settings')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                currentTab === 'settings'
                  ? 'bg-engBlue text-white shadow-md shadow-engBlue/20'
                  : 'text-slate-300 hover:text-white hover:bg-navy-800'
              }`}
              title={t.nav.settings}
            >
              <Settings className={`w-4 h-4 shrink-0 ${currentTab === 'settings' ? 'text-white' : 'text-slate-400'}`} />
              {!collapsed && <span>{t.nav.settings}</span>}
            </button>
          </nav>
        </div>

        {/* Section 4: Auxiliary Technical Utilities (Collapsible) */}
        {!collapsed && (
          <div className="px-3 border-t border-slate-700/60 pt-3">
            <button
              onClick={() => setShowUtilities(!showUtilities)}
              className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-bold text-slate-400 hover:text-slate-200 transition cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Wrench className="w-3.5 h-3.5 text-slate-400" />
                <span>{lang === 'ar' ? 'أدوات هندسية مساندة' : 'Auxiliary Tools'}</span>
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${showUtilities ? 'rotate-180' : ''}`}
              />
            </button>

            {showUtilities && (
              <div className="mt-1 space-y-1 pl-2 rtl:pl-0 rtl:pr-2">
                {technicalUtilities.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onSelectTab(item.id)}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                        isActive
                          ? 'bg-slate-800 text-blue-300 font-bold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-navy-800'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Collapse Toggle at Bottom */}
      <div className="p-3 border-t border-slate-700/80">
        <button
          onClick={onToggleCollapsed}
          className="w-full flex items-center justify-center p-2 rounded-lg bg-navy-800 hover:bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};
