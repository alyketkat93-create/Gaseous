import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  Copy,
  Trash2,
  ExternalLink,
  FileText,
  Calendar,
  Layers,
  CheckCircle2,
  AlertTriangle,
  GitCompare,
  X,
  PlusCircle,
} from 'lucide-react';
import { CalculationRecord, SystemType, UnitSystem } from '../types';
import { Language, DICTIONARY } from '../i18n/translations';

interface HistoryViewProps {
  calculations: CalculationRecord[];
  onReopenCalculation: (record: CalculationRecord) => void;
  onDuplicateCalculation: (id: string) => void;
  onDeleteCalculation: (id: string) => void;
  onExportReport: (record: CalculationRecord) => void;
  onStartNewCalculation: () => void;
  lang: Language;
  unitSystem: UnitSystem;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  calculations,
  onReopenCalculation,
  onDuplicateCalculation,
  onDeleteCalculation,
  onExportReport,
  onStartNewCalculation,
  lang,
  unitSystem,
}) => {
  const t = DICTIONARY[lang];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSystem, setSelectedSystem] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  // Revisions comparison modal
  const [comparingRecord, setComparingRecord] = useState<CalculationRecord | null>(null);

  // Delete confirmation modal
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filter logic
  const filteredCalculations = calculations.filter((calc) => {
    const matchesSearch =
      calc.roomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      calc.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      calc.calcRef.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSystem = selectedSystem === 'all' || calc.systemType === selectedSystem;
    const matchesStatus = selectedStatus === 'all' || calc.status === selectedStatus;

    return matchesSearch && matchesSystem && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              Audit & Revision Trail
            </span>
          </div>
          <h1 className="text-xl lg:text-2xl font-extrabold text-navy-900 dark:text-white">
            {t.history.title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.history.subtitle}
          </p>
        </div>

        <button
          onClick={onStartNewCalculation}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-engBlue hover:bg-engBlue/90 text-white font-bold text-xs shadow-md shadow-engBlue/20 transition cursor-pointer self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{lang === 'ar' ? 'حساب هندسي جديد' : 'New Calculation'}</span>
        </button>
      </div>

      {/* Filters & Search Row */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 rtl:left-auto rtl:right-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.history.searchPlaceholder}
            className="w-full bg-slate-50 dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-lg pl-9 pr-3 rtl:pl-3 rtl:pr-9 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-engBlue"
          />
        </div>

        {/* Filter by System */}
        <div>
          <select
            value={selectedSystem}
            onChange={(e) => setSelectedSystem(e.target.value)}
            className="w-full bg-slate-50 dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-engBlue"
          >
            <option value="all">All Suppression Technologies</option>
            <option value="fm200">FM-200 (HFC-227ea)</option>
            <option value="fk5112">FK-5-1-12 Clean Agent</option>
            <option value="co2">Carbon Dioxide (CO2)</option>
            <option value="aerosol">Condensed Aerosol</option>
            <option value="inert_gas">Inert Gas (IG-541/55/100/01)</option>
            <option value="foam">Foam Systems (NFPA 11)</option>
          </select>
        </div>

        {/* Filter by Status */}
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-slate-50 dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-engBlue"
          >
            <option value="all">All Calculation Statuses</option>
            <option value="verified">Verified Complete</option>
            <option value="approved">Approved Design</option>
            <option value="preliminary">Preliminary Sizing</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          {filteredCalculations.length} {t.history.recordsFound}
        </span>
      </div>

      {/* Calculations Table */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        {filteredCalculations.length === 0 ? (
          <div className="text-center py-12 text-xs text-slate-400">
            {t.history.noRecords}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left rtl:text-right">
              <thead className="bg-slate-50 dark:bg-navy-800 text-slate-700 dark:text-slate-300 uppercase text-[10px] font-semibold">
                <tr>
                  <th className="p-3">Reference #</th>
                  <th className="p-3">Project & Room</th>
                  <th className="p-3">System Type</th>
                  <th className="p-3">Revision</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right rtl:text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                {filteredCalculations.map((calc) => (
                  <tr key={calc.id} className="hover:bg-slate-50 dark:hover:bg-navy-800/60 transition">
                    <td className="p-3 font-mono font-bold text-engBlue">
                      {calc.calcRef}
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-navy-900 dark:text-white">{calc.roomName}</div>
                      <div className="text-[10px] text-slate-400">{calc.projectName}</div>
                    </td>
                    <td className="p-3">
                      <span className="font-semibold">{calc.systemName}</span>
                      <div className="text-[10px] text-slate-400">{calc.applicableStandard}</div>
                    </td>
                    <td className="p-3 font-mono">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-navy-800 border border-slate-200 dark:border-slate-700 text-[10px]">
                        {calc.revision}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                        {calc.status}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-400">
                      {calc.date}
                    </td>
                    <td className="p-3 text-right rtl:text-left space-x-1 rtl:space-x-reverse">
                      {/* Reopen */}
                      <button
                        onClick={() => onReopenCalculation(calc)}
                        className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-engBlue transition cursor-pointer"
                        title={t.history.reopen}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>

                      {/* Export Report */}
                      <button
                        onClick={() => onExportReport(calc)}
                        className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-emerald-600 transition cursor-pointer"
                        title="Export Report"
                      >
                        <FileText className="w-4 h-4" />
                      </button>

                      {/* Compare Revisions */}
                      {calc.revisionHistory && calc.revisionHistory.length > 0 && (
                        <button
                          onClick={() => setComparingRecord(calc)}
                          className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-purple-600 transition cursor-pointer"
                          title={t.history.compareRevisions}
                        >
                          <GitCompare className="w-4 h-4" />
                        </button>
                      )}

                      {/* Duplicate */}
                      <button
                        onClick={() => onDuplicateCalculation(calc.id)}
                        className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition cursor-pointer"
                        title={t.history.duplicate}
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => setDeletingId(calc.id)}
                        className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-950/40 text-red-500 transition cursor-pointer"
                        title={t.common.delete}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="font-bold text-sm">Delete Calculation</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {t.history.deleteConfirm}
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-navy-800 cursor-pointer"
              >
                {t.common.cancel}
              </button>
              <button
                onClick={() => {
                  onDeleteCalculation(deletingId);
                  setDeletingId(null);
                }}
                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold cursor-pointer"
              >
                {t.common.delete}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revisions Comparison Modal */}
      {comparingRecord && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <GitCompare className="w-5 h-5 text-purple-500" />
                <h3 className="font-bold text-sm text-navy-900 dark:text-white">
                  {t.history.diffTitle}: {comparingRecord.calcRef}
                </h3>
              </div>
              <button
                onClick={() => setComparingRecord(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              {/* Current revision */}
              <div className="p-4 rounded-xl border border-engBlue/30 bg-engBlue/5 space-y-2">
                <span className="font-bold text-engBlue block">
                  Current: {comparingRecord.revision} ({comparingRecord.date})
                </span>
                <div className="space-y-1">
                  <div>Designer: {comparingRecord.designer}</div>
                  <div>Room: {comparingRecord.roomName}</div>
                  <div>Status: {comparingRecord.status}</div>
                  <pre className="p-2 rounded bg-slate-100 dark:bg-navy-800 text-[10px] font-mono overflow-x-auto">
                    {JSON.stringify(comparingRecord.inputs, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Previous revision */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800/40 space-y-2">
                <span className="font-bold text-slate-600 dark:text-slate-300 block">
                  Previous: {comparingRecord.revisionHistory?.[0]?.revision || 'Rev 00'} ({comparingRecord.revisionHistory?.[0]?.date})
                </span>
                <div className="space-y-1">
                  <div>Designer: {comparingRecord.revisionHistory?.[0]?.designer}</div>
                  <div>Notes: {comparingRecord.revisionHistory?.[0]?.notes || 'N/A'}</div>
                  <pre className="p-2 rounded bg-slate-100 dark:bg-navy-800 text-[10px] font-mono overflow-x-auto">
                    {JSON.stringify(comparingRecord.revisionHistory?.[0]?.inputs, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
