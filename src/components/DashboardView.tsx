import React, { useState } from 'react';
import {
  Flame,
  Droplets,
  AlertOctagon,
  Sparkles,
  Wind,
  Waves,
  PlusCircle,
  FileText,
  History,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  X,
} from 'lucide-react';
import { CalculationRecord, SystemType, UnitSystem } from '../types';
import { Language, DICTIONARY } from '../i18n/translations';
import { NavTab } from './common/Sidebar';

interface DashboardViewProps {
  calculations: CalculationRecord[];
  onNavigateToCalculator: (system: SystemType, record?: CalculationRecord) => void;
  onNavigateTab: (tab: NavTab) => void;
  lang: Language;
  unitSystem: UnitSystem;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  calculations,
  onNavigateToCalculator,
  onNavigateTab,
  lang,
  unitSystem,
}) => {
  const t = DICTIONARY[lang];
  const [showNewCalcModal, setShowNewCalcModal] = useState(false);

  // Derived metrics
  const savedCount = calculations.filter((c) => c.status !== 'draft').length;
  const draftCount = calculations.filter((c) => c.status === 'draft').length;
  const usedSystemsCount = new Set(calculations.map((c) => c.systemType)).size;
  const generatedReportsCount = calculations.length;

  // The 6 distinct system cards per Section 3
  const systems = [
    {
      type: 'fm200' as SystemType,
      name: 'FM-200 (HFC-227ea)',
      shortDesc: lang === 'ar'
        ? 'حساب الإغراق الكلي للغاز النظيف HFC-227ea وفحص حدود السمية وفق كود NFPA 2001.'
        : 'HFC-227ea total flooding clean agent calculation and toxicological verification per NFPA 2001.',
      icon: Flame,
      color: 'text-orange-500 bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800',
      standard: 'NFPA 2001 (2022)',
      route: 'fm200' as NavTab,
    },
    {
      type: 'fk5112' as SystemType,
      name: 'FK-5-1-12 Clean Agent',
      shortDesc: lang === 'ar'
        ? 'حساب المادة النظيفة الصديقة للبيئة (GWP < 1) وهامش الأمان الاستثنائي للغرف المأهولة.'
        : 'Fluoroketone clean agent sizing with GWP < 1, zero ODP, and wide NOAEL safety headroom.',
      icon: Droplets,
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',
      standard: 'NFPA 2001 (2022)',
      route: 'fk5112' as NavTab,
    },
    {
      type: 'co2' as SystemType,
      name: 'CO2 Fire Suppression',
      shortDesc: lang === 'ar'
        ? 'حساب الإغراق الكلي والتطبيق الموضعي لغاز ثاني أكسيد الكربون مع بروتوكولات حماية الحياة.'
        : 'Total flooding and local application CO2 sizing with mandatory life-safety protocols per NFPA 12.',
      icon: AlertOctagon,
      color: 'text-red-500 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800',
      standard: 'NFPA 12 (2022)',
      route: 'co2' as NavTab,
    },
    {
      type: 'aerosol' as SystemType,
      name: 'Condensed Aerosol',
      shortDesc: lang === 'ar'
        ? 'حساب كتلة الإيروسول المكثف واختيار المولدات ومسافات الأمان الحرارية وفق كود NFPA 2010.'
        : 'Condensed aerosol generator selection, application density, and thermal clearance reviews per NFPA 2010.',
      icon: Sparkles,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800',
      standard: 'NFPA 2010 (2020)',
      route: 'aerosol' as NavTab,
    },
    {
      type: 'inert_gas' as SystemType,
      name: 'Inert Gas (IG-541 / 55 / 100 / 01)',
      shortDesc: lang === 'ar'
        ? 'حساب الغازات الجوية الخاملة عند 200/300 بار، وفحص نسبة الأكسجين وفتحات تخفيف الضغط.'
        : 'Atmospheric inert gases (Inergen, Argonite) sizing, residual O2 safety, and room pressure relief dampers.',
      icon: Wind,
      color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/30 border-cyan-200 dark:border-cyan-800',
      standard: 'NFPA 2001 (2022)',
      route: 'inert-gas' as NavTab,
    },
    {
      type: 'foam' as SystemType,
      name: 'Foam Systems (NFPA 11)',
      shortDesc: lang === 'ar'
        ? 'حساب معدل تدفق محلول الرغوة وسعة خزانات الضغط (Bladder Tanks) بناءً على مساحة الحماية.'
        : 'Surface area, solution flow rate, foam concentrate, and bladder tank sizing per NFPA 11.',
      icon: Waves,
      color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800',
      standard: 'NFPA 11 (2021)',
      route: 'foam' as NavTab,
    },
  ];

  // Helper to find last calculated date for a system
  const getLastCalculatedDate = (sysType: SystemType): string | null => {
    const matching = calculations.filter((c) => c.systemType === sysType);
    if (matching.length === 0) return null;
    matching.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    return matching[0].date;
  };

  // 5 Most recent calculations
  const recentCalculations = [...calculations]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* 1. Welcome Header Banner */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-engBlue/10 text-engBlue border border-engBlue/30">
              Professional Engineering Suite
            </span>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              NFPA 2001 | NFPA 12 | NFPA 2010 | NFPA 11 | SBC 801
            </span>
          </div>
          <h1 className="text-xl lg:text-2xl font-extrabold text-navy-900 dark:text-white tracking-tight">
            FIRECALC PRO — {lang === 'ar' ? 'منصة الحسابات الهندسية لأنظمة الإطفاء' : 'Fire Suppression Engineering Calculator'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {lang === 'ar'
              ? 'دقة في كل معادلة. ثقة في كل تصميم. كل نظام إطفاء مزود بشاشة مخصصة، ومحرك حسابي مستقل، ومعادلات اشتقاقية دقيقة، وتقارير هندسية معتمدة.'
              : 'Precision in Every Calculation. Confidence in Every Design. Dedicated calculation engines, independent inputs, and certified technical reports for every fire suppression technology.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setShowNewCalcModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-engBlue hover:bg-engBlue/90 text-white font-bold text-xs shadow-md shadow-engBlue/20 transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t.dashboard.newCalculation}</span>
          </button>
          <button
            onClick={() => onNavigateTab('reports')}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-semibold text-xs transition cursor-pointer"
          >
            <FileText className="w-4 h-4 text-emerald-500" />
            <span>{t.nav.reports}</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
            {t.dashboard.savedCount}
          </span>
          <div className="text-2xl font-extrabold font-mono text-navy-900 dark:text-white mt-1">
            {savedCount}
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Verified designs</span>
        </div>

        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
            {t.dashboard.draftCount}
          </span>
          <div className="text-2xl font-extrabold font-mono text-amber-600 mt-1">
            {draftCount}
          </div>
          <span className="text-[10px] text-slate-400 font-medium">In-progress calculations</span>
        </div>

        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
            {t.dashboard.usedSystems}
          </span>
          <div className="text-2xl font-extrabold font-mono text-engBlue mt-1">
            {usedSystemsCount} / 6
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Unique technologies in use</span>
        </div>

        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
            {t.dashboard.generatedReports}
          </span>
          <div className="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
            {generatedReportsCount}
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Submittal reports available</span>
        </div>
      </div>

      {/* 3. Six Individual System Cards (Core requirement) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-navy-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-engBlue" />
            <span>{t.dashboard.systemsDirectory}</span>
          </h2>
          <span className="text-xs text-slate-400">Click any system to launch its dedicated calculator</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {systems.map((sys) => {
            const Icon = sys.icon;
            const lastDate = getLastCalculatedDate(sys.type);

            return (
              <div
                key={sys.type}
                className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-engBlue/60 transition flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className={`p-2.5 rounded-xl border ${sys.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700">
                      {sys.standard}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-navy-900 dark:text-white group-hover:text-engBlue transition">
                      {sys.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {sys.shortDesc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-4 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{lastDate ? `${t.dashboard.lastCalculated} ${lastDate}` : 'No calculation yet'}</span>
                  </div>

                  <button
                    onClick={() => onNavigateToCalculator(sys.type)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-engBlue/10 hover:bg-engBlue hover:text-white text-engBlue text-xs font-bold transition cursor-pointer"
                  >
                    <span>{t.dashboard.startCalculation}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Recent Calculations Section */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-engBlue" />
            <h2 className="text-sm font-bold text-navy-900 dark:text-white uppercase tracking-wider">
              {t.dashboard.recentCalculations}
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('history')}
            className="text-xs font-semibold text-engBlue hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All History</span>
            <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </button>
        </div>

        {recentCalculations.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            {t.dashboard.noCalculationsYet}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left rtl:text-right">
              <thead className="bg-slate-50 dark:bg-navy-800 text-slate-600 dark:text-slate-400 uppercase text-[10px] font-semibold">
                <tr>
                  <th className="p-3">Reference #</th>
                  <th className="p-3">Project & Room Name</th>
                  <th className="p-3">System Type</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right rtl:text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {recentCalculations.map((calc) => (
                  <tr key={calc.id} className="hover:bg-slate-50 dark:hover:bg-navy-800/60 transition">
                    <td className="p-3 font-mono font-bold text-engBlue">
                      {calc.calcRef}
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-navy-900 dark:text-white">{calc.roomName}</div>
                      <div className="text-[10px] text-slate-400">{calc.projectName}</div>
                    </td>
                    <td className="p-3">
                      <span className="font-medium">{calc.systemName}</span>
                    </td>
                    <td className="p-3">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                        {calc.status}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-400">
                      {calc.date}
                    </td>
                    <td className="p-3 text-right rtl:text-left">
                      <button
                        onClick={() => onNavigateToCalculator(calc.systemType, calc)}
                        className="px-2.5 py-1 rounded bg-navy-900 dark:bg-navy-800 hover:bg-engBlue hover:text-white text-slate-200 text-xs font-semibold transition cursor-pointer"
                      >
                        Reopen
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Calculation Modal */}
      {showNewCalcModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-navy-900 dark:text-white">
                {lang === 'ar' ? 'اختر نظام الإطفاء لبدء حساب جديد' : 'Select Fire Suppression Technology'}
              </h3>
              <button
                onClick={() => setShowNewCalcModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
              {systems.map((sys) => {
                const Icon = sys.icon;
                return (
                  <button
                    key={sys.type}
                    onClick={() => {
                      setShowNewCalcModal(false);
                      onNavigateToCalculator(sys.type);
                    }}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800/60 hover:bg-engBlue/10 hover:border-engBlue text-left rtl:text-right transition cursor-pointer flex items-start gap-3"
                  >
                    <div className={`p-2 rounded-lg border ${sys.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-navy-900 dark:text-white">{sys.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{sys.standard}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
