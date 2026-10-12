import React from 'react';
import { Save, FileText, CheckCircle2, AlertTriangle, Clock, ShieldCheck } from 'lucide-react';
import { Language, DICTIONARY } from '../../../i18n/translations';

interface CalculatorTopBarProps {
  systemName: string;
  systemCategory: string;
  applicableStandard: string;
  calcReference: string;
  status: 'draft' | 'preliminary' | 'verified' | 'approved';
  onSave: () => void;
  onGenerateReport: () => void;
  lang: Language;
  onReferenceChange?: (ref: string) => void;
  projectName?: string;
  roomName?: string;
  onProjectNameChange?: (name: string) => void;
  onRoomNameChange?: (name: string) => void;
}

export const CalculatorTopBar: React.FC<CalculatorTopBarProps> = ({
  systemName,
  systemCategory,
  applicableStandard,
  calcReference,
  status,
  onSave,
  onGenerateReport,
  lang,
  onReferenceChange,
  projectName = 'Default Project',
  roomName = 'Protected Room',
  onProjectNameChange,
  onRoomNameChange,
}) => {
  const t = DICTIONARY[lang];

  const statusBadges = {
    draft: { label: t.statuses.draft, bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700', icon: Clock },
    preliminary: { label: t.statuses.preliminary, bg: 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800', icon: AlertTriangle },
    verified: { label: t.statuses.verified, bg: 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800', icon: CheckCircle2 },
    approved: { label: t.statuses.approved, bg: 'bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800', icon: ShieldCheck },
  };

  const currentBadge = statusBadges[status] || statusBadges.verified;
  const StatusIcon = currentBadge.icon;

  return (
    <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 lg:p-5 shadow-sm space-y-3">
      {/* Upper line: System Identity & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg lg:text-xl font-bold text-navy-900 dark:text-white">
              {systemName}
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-engBlue/10 text-engBlue border border-engBlue/30 font-semibold">
              {applicableStandard}
            </span>
            <div className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded border ${currentBadge.bg}`}>
              <StatusIcon className="w-3 h-3" />
              <span>{currentBadge.label}</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {systemCategory}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onSave}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-engBlue hover:bg-engBlue/90 text-white font-semibold text-xs shadow-sm transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{t.common.saveCalculation}</span>
          </button>
          <button
            onClick={onGenerateReport}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-semibold text-xs transition cursor-pointer"
          >
            <FileText className="w-4 h-4 text-emerald-500" />
            <span>{t.common.generateReport}</span>
          </button>
        </div>
      </div>

      {/* Lower line: Editable Project, Room Name, Reference Number */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-0.5">
            {t.common.projectName}
          </label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => onProjectNameChange && onProjectNameChange(e.target.value)}
            className="w-full bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-engBlue"
            placeholder="e.g. Al-Nakheel Tower"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-0.5">
            {t.common.roomName}
          </label>
          <input
            type="text"
            value={roomName}
            onChange={(e) => onRoomNameChange && onRoomNameChange(e.target.value)}
            className="w-full bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-engBlue"
            placeholder="e.g. Main Server Room"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-0.5">
            {t.common.referenceNo}
          </label>
          <input
            type="text"
            value={calcReference}
            onChange={(e) => onReferenceChange && onReferenceChange(e.target.value)}
            className="w-full bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs font-mono font-medium text-blue-600 dark:text-blue-300 focus:outline-none focus:border-engBlue"
          />
        </div>
      </div>
    </div>
  );
};
