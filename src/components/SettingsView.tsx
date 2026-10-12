import React, { useState } from 'react';
import {
  Settings,
  Building2,
  UserCheck,
  Globe,
  Sliders,
  Database,
  Save,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  Shield,
  FileCheck2,
} from 'lucide-react';
import { CompanySettings, UnitSystem } from '../types';
import { Language, DICTIONARY } from '../i18n/translations';
import { saveCompanySettings, DEFAULT_SETTINGS, saveSavedCalculations, SEED_CALCULATIONS } from '../engineering/calculationStore';

interface SettingsViewProps {
  settings: CompanySettings;
  onUpdateSettings: (updated: CompanySettings) => void;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  unitSystem: UnitSystem;
  onUnitSystemChange: (units: UnitSystem) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  lang,
  onLanguageChange,
  unitSystem,
  onUnitSystemChange,
  theme,
  onToggleTheme,
  onResetData,
}) => {
  const t = DICTIONARY[lang];

  const [formData, setFormData] = useState<CompanySettings>(settings);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formData);
    saveCompanySettings(formData);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  const handleExportBackup = () => {
    const rawCalculations = localStorage.getItem('firecalc_pro_calculations_v2') || '[]';
    const backupObj = {
      version: 'FIRECALC PRO 2.4',
      exportDate: new Date().toISOString(),
      settings: formData,
      calculations: JSON.parse(rawCalculations),
    };

    const blob = new Blob([JSON.stringify(backupObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FIRECALC_PRO_BACKUP_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.settings) {
          setFormData(parsed.settings);
          onUpdateSettings(parsed.settings);
        }
        if (Array.isArray(parsed.calculations)) {
          saveSavedCalculations(parsed.calculations);
        }
        alert(lang === 'ar' ? 'تم استيراد النسخة الاحتياطية بنجاح!' : 'Backup data restored successfully!');
      } catch (err) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-engBlue/10 text-engBlue border border-engBlue/30">
              Platform Configuration
            </span>
          </div>
          <h1 className="text-xl lg:text-2xl font-extrabold text-navy-900 dark:text-white">
            {t.settings.title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.settings.subtitle}
          </p>
        </div>

        {showSavedToast && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Saved Successfully</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company & Engineering Office Header */}
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-navy-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <Building2 className="w-4 h-4 text-engBlue" />
            <span>{t.settings.companyInfo}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                {t.settings.companyName}
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full bg-slate-50 dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-engBlue"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                {t.settings.division}
              </label>
              <input
                type="text"
                value={formData.companyDivision}
                onChange={(e) => setFormData({ ...formData, companyDivision: e.target.value })}
                className="w-full bg-slate-50 dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-engBlue"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                {t.settings.license}
              </label>
              <input
                type="text"
                value={formData.licenseNumber}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                className="w-full bg-slate-50 dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-engBlue"
              />
            </div>
          </div>
        </div>

        {/* Default Engineering Personnel */}
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-navy-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <UserCheck className="w-4 h-4 text-engBlue" />
            <span>{t.settings.engineers}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                {t.settings.defaultDesigner}
              </label>
              <input
                type="text"
                value={formData.defaultEngineer}
                onChange={(e) => setFormData({ ...formData, defaultEngineer: e.target.value })}
                className="w-full bg-slate-50 dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-engBlue"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                {t.settings.defaultReviewer}
              </label>
              <input
                type="text"
                value={formData.defaultChecker}
                onChange={(e) => setFormData({ ...formData, defaultChecker: e.target.value })}
                className="w-full bg-slate-50 dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-engBlue"
              />
            </div>
          </div>
        </div>

        {/* Report Disclaimer Text */}
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-navy-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <Shield className="w-4 h-4 text-engBlue" />
            <span>{t.settings.disclaimer}</span>
          </h2>

          <div>
            <textarea
              rows={3}
              value={formData.disclaimerText}
              onChange={(e) => setFormData({ ...formData, disclaimerText: e.target.value })}
              className="w-full bg-slate-50 dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-900 dark:text-white leading-relaxed focus:outline-none focus:border-engBlue"
            />
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-engBlue hover:bg-engBlue/90 text-white font-bold text-xs shadow-md transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{t.common.save}</span>
          </button>
        </div>
      </form>

      {/* Backup and Data Management */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-navy-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <Database className="w-4 h-4 text-engBlue" />
          <span>{t.settings.dataManagement}</span>
        </h2>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportBackup}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-semibold text-xs transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-engBlue" />
            <span>{t.settings.exportBackup}</span>
          </button>

          <label className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-semibold text-xs transition cursor-pointer">
            <Upload className="w-4 h-4 text-emerald-500" />
            <span>{t.settings.importBackup}</span>
            <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
          </label>

          <button
            onClick={() => {
              if (confirm('Reset all saved calculations to seed sample engineering designs?')) {
                onResetData();
              }
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-navy-800 hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-700 dark:text-slate-200 hover:text-red-600 border border-slate-300 dark:border-slate-700 font-semibold text-xs transition cursor-pointer ml-auto"
          >
            <RefreshCw className="w-4 h-4 text-amber-500" />
            <span>{t.settings.resetSample}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
