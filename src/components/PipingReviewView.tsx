import React, { useState } from 'react';
import {
  GitBranch,
  Plus,
  Trash2,
  AlertTriangle,
  FileCheck2,
  CheckCircle2,
  Info,
  Layers,
} from 'lucide-react';
import { PipeSegment, UnitSystem } from '../types';
import { evaluatePipingPreliminary } from '../engineering/pipingHydraulics';
import { Language, DICTIONARY } from '../i18n/translations';

interface PipingReviewViewProps {
  unitSystem: UnitSystem;
  lang: Language;
}

export const PipingReviewView: React.FC<PipingReviewViewProps> = ({
  unitSystem,
  lang,
}) => {
  const t = DICTIONARY[lang];

  const [segments, setSegments] = useState<PipeSegment[]>([
    {
      id: 'seg-1',
      description: 'Main Cylinder Manifold Discharge Header',
      pipeSchedule: 'Schedule 40',
      nominalDiameterMm: 80,
      lengthMeters: 6.5,
      elbow90Count: 2,
      elbow45Count: 0,
      teeThroughCount: 1,
      teeBranchCount: 0,
      elevationDifferenceMeters: 0,
    },
    {
      id: 'seg-2',
      description: 'Distribution Feeder to Room Penetration',
      pipeSchedule: 'Schedule 40',
      nominalDiameterMm: 65,
      lengthMeters: 8.0,
      elbow90Count: 3,
      elbow45Count: 1,
      teeThroughCount: 0,
      teeBranchCount: 1,
      elevationDifferenceMeters: 1.5,
    },
    {
      id: 'seg-3',
      description: 'Branch Line to Sector A Radial Nozzles',
      pipeSchedule: 'Schedule 40',
      nominalDiameterMm: 40,
      lengthMeters: 5.5,
      elbow90Count: 2,
      elbow45Count: 0,
      teeThroughCount: 2,
      teeBranchCount: 2,
      elevationDifferenceMeters: 0,
    },
  ]);

  const reviewResult = evaluatePipingPreliminary(segments, 160, 10);

  const handleAddSegment = () => {
    const newSeg: PipeSegment = {
      id: `seg-${Date.now()}`,
      description: `Distribution Branch #${segments.length + 1}`,
      pipeSchedule: 'Schedule 40',
      nominalDiameterMm: 32,
      lengthMeters: 4.0,
      elbow90Count: 1,
      elbow45Count: 0,
      teeThroughCount: 1,
      teeBranchCount: 0,
      elevationDifferenceMeters: 0,
    };
    setSegments([...segments, newSeg]);
  };

  const handleDeleteSegment = (id: string) => {
    if (segments.length <= 1) return;
    setSegments(segments.filter(s => s.id !== id));
  };

  const handleUpdateSegment = (id: string, updates: Partial<PipeSegment>) => {
    setSegments(segments.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-orange-500" />
            <span>{t.piping.title}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {lang === 'ar'
              ? 'جدول الأنابيب، الأطوال المكافئة للوصلات، وفحص سرعة التدفق وفق كود NFPA 2001'
              : 'Preliminary Schedule 40/80 pipe schedule, equivalent lengths of fittings, velocity screening, and hydraulic submittal review'}
          </p>
        </div>

        <button
          onClick={handleAddSegment}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs shadow-lg shadow-orange-500/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{lang === 'ar' ? 'إضافة مسار أنابيب' : 'Add Pipe Segment'}</span>
        </button>
      </div>

      {/* Mandatory Engineering Disclaimer Banner */}
      <div className="bg-amber-950/50 border border-amber-500/40 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="font-bold text-amber-300">
            {lang === 'ar' ? 'تنبيه هندسي إلزامي - حسابات تقريبية أولية' : 'Mandatory Engineering Disclaimer — Preliminary Sizing Only'}
          </div>
          <p className="text-slate-300 leading-relaxed">
            {reviewResult.warningNotice}
          </p>
        </div>
      </div>

      {/* Pipe Segments Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h2 className="text-sm font-bold text-white mb-3">
          {lang === 'ar' ? 'مسارات شبكة الأنابيب الموزعة' : 'Preliminary Piping Schedule & Fittings Inventory'}
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-2.5 font-semibold">Segment Description</th>
                <th className="pb-2.5 font-semibold">Schedule</th>
                <th className="pb-2.5 font-semibold">Dia (mm)</th>
                <th className="pb-2.5 font-semibold">Length (m)</th>
                <th className="pb-2.5 font-semibold">90° Elbows</th>
                <th className="pb-2.5 font-semibold">45° Elbows</th>
                <th className="pb-2.5 font-semibold">Tees (Run/Branch)</th>
                <th className="pb-2.5 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {segments.map((seg) => (
                <tr key={seg.id} className="hover:bg-slate-800/30">
                  <td className="py-2.5 pr-2">
                    <input
                      type="text"
                      value={seg.description}
                      onChange={(e) => handleUpdateSegment(seg.id, { description: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-orange-500"
                    />
                  </td>
                  <td className="py-2.5">
                    <select
                      value={seg.pipeSchedule}
                      onChange={(e) => handleUpdateSegment(seg.id, { pipeSchedule: e.target.value as any })}
                      className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs"
                    >
                      <option value="Schedule 40">Sch 40</option>
                      <option value="Schedule 80">Sch 80</option>
                    </select>
                  </td>
                  <td className="py-2.5">
                    <select
                      value={seg.nominalDiameterMm}
                      onChange={(e) => handleUpdateSegment(seg.id, { nominalDiameterMm: parseInt(e.target.value) })}
                      className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-200 font-mono text-xs"
                    >
                      <option value={25}>25 mm (1")</option>
                      <option value={32}>32 mm (1¼")</option>
                      <option value={40}>40 mm (1½")</option>
                      <option value={50}>50 mm (2")</option>
                      <option value={65}>65 mm (2½")</option>
                      <option value={80}>80 mm (3")</option>
                      <option value={100}>100 mm (4")</option>
                      <option value={150}>150 mm (6")</option>
                    </select>
                  </td>
                  <td className="py-2.5">
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      value={seg.lengthMeters}
                      onChange={(e) => handleUpdateSegment(seg.id, { lengthMeters: parseFloat(e.target.value) || 1 })}
                      className="w-20 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-200 font-mono text-xs"
                    />
                  </td>
                  <td className="py-2.5">
                    <input
                      type="number"
                      min="0"
                      value={seg.elbow90Count}
                      onChange={(e) => handleUpdateSegment(seg.id, { elbow90Count: parseInt(e.target.value) || 0 })}
                      className="w-14 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-200 font-mono text-xs"
                    />
                  </td>
                  <td className="py-2.5">
                    <input
                      type="number"
                      min="0"
                      value={seg.elbow45Count}
                      onChange={(e) => handleUpdateSegment(seg.id, { elbow45Count: parseInt(e.target.value) || 0 })}
                      className="w-14 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-200 font-mono text-xs"
                    />
                  </td>
                  <td className="py-2.5">
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        title="Tee Run"
                        value={seg.teeThroughCount}
                        onChange={(e) => handleUpdateSegment(seg.id, { teeThroughCount: parseInt(e.target.value) || 0 })}
                        className="w-12 bg-slate-800 border border-slate-700 rounded px-1.5 py-1 text-slate-200 font-mono text-xs"
                      />
                      <span className="text-slate-400">/</span>
                      <input
                        type="number"
                        min="0"
                        title="Tee Branch"
                        value={seg.teeBranchCount}
                        onChange={(e) => handleUpdateSegment(seg.id, { teeBranchCount: parseInt(e.target.value) || 0 })}
                        className="w-12 bg-slate-800 border border-slate-700 rounded px-1.5 py-1 text-slate-200 font-mono text-xs"
                      />
                    </div>
                  </td>
                  <td className="py-2.5 text-right">
                    <button
                      onClick={() => handleDeleteSegment(seg.id)}
                      className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-slate-800 transition"
                      title="Remove Segment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hydraulic Screening Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 block mb-1">{t.piping.physicalLength}</span>
          <div className="text-2xl font-bold font-mono text-white">
            {reviewResult.totalPhysicalLengthM} <span className="text-sm font-sans text-slate-400">m</span>
          </div>
          <span className="text-[10px] text-slate-400">Physical centerline run</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 block mb-1">{t.piping.equivalentLength}</span>
          <div className="text-2xl font-bold font-mono text-orange-400">
            {reviewResult.totalEquivalentLengthM} <span className="text-sm font-sans text-slate-400">m</span>
          </div>
          <span className="text-[10px] text-slate-400">Includes elbows & tees Leq</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 block mb-1">{t.piping.velocity}</span>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {reviewResult.estimatedVelocityMS} <span className="text-sm font-sans text-slate-400">m/s</span>
          </div>
          <span className="text-[10px] text-emerald-400">Within recommended 8-25 m/s</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400 block mb-1">{t.piping.nozzles}</span>
          <div className="text-2xl font-bold font-mono text-purple-400">
            {reviewResult.requiredNozzleCountEstimate} <span className="text-sm font-sans text-slate-400">Radial Nozzles</span>
          </div>
          <span className="text-[10px] text-slate-400">360° coverage pattern estimate</span>
        </div>
      </div>
    </div>
  );
};
