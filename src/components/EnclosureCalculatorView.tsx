import React from 'react';
import {
  Box,
  Layers,
  Thermometer,
  Mountain,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  Maximize2,
} from 'lucide-react';
import { EnclosureData, UnitSystem } from '../types';
import { calculateEnclosureVolume } from '../engineering/enclosureEngine';
import { Language, DICTIONARY } from '../i18n/translations';

interface EnclosureCalculatorViewProps {
  enclosure: EnclosureData;
  onChange: (updated: EnclosureData) => void;
  unitSystem: UnitSystem;
  lang: Language;
}

export const EnclosureCalculatorView: React.FC<EnclosureCalculatorViewProps> = ({
  enclosure,
  onChange,
  unitSystem,
  lang,
}) => {
  const t = DICTIONARY[lang];
  const breakdown = calculateEnclosureVolume(enclosure, unitSystem);

  const lengthUnit = unitSystem === 'imperial' ? 'ft' : 'm';
  const volumeUnit = unitSystem === 'imperial' ? 'ft³' : 'm³';
  const tempUnit = unitSystem === 'imperial' ? '°F' : '°C';

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Box className="w-5 h-5 text-orange-500" />
            <span>{t.enclosure.title}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {lang === 'ar'
              ? 'تحديد أبعاد الغرفة والأسقف المعلقة والأرضيات المرتفعة وتصحيح الضغط الجوي وفقاً لـ NFPA 2001'
              : 'Determine gross/net volumes, plenum sub-spaces, and altitude atmospheric pressure correction factors'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
            {lang === 'ar' ? 'الوحدات الحالية:' : 'Active Units:'} <strong className="text-orange-400 font-mono">{unitSystem.toUpperCase()}</strong>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form Parameters */}
        <div className="lg:col-span-2 space-y-5">
          {/* Main Dimensions Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Box className="w-4 h-4 text-orange-400" />
                <span>{t.enclosure.roomGeometry}</span>
              </h2>
              <div className="flex items-center gap-2">
                <select
                  value={enclosure.shape}
                  onChange={(e) => onChange({ ...enclosure, shape: e.target.value as any })}
                  className="bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1 focus:outline-none focus:border-orange-500"
                >
                  <option value="rectangular">Rectangular Enclosure</option>
                  <option value="multi_space">Multiple Connected Spaces</option>
                  <option value="custom">Custom Verified Volume</option>
                  <option value="irregular">Documented Irregular Shape</option>
                </select>
              </div>
            </div>

            {enclosure.shape !== 'custom' ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    {t.enclosure.length} ({lengthUnit})
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    value={enclosure.length}
                    onChange={(e) => onChange({ ...enclosure, length: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    {t.enclosure.width} ({lengthUnit})
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    value={enclosure.width}
                    onChange={(e) => onChange({ ...enclosure, width: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    {t.enclosure.height} ({lengthUnit})
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    value={enclosure.height}
                    onChange={(e) => onChange({ ...enclosure, height: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    {t.enclosure.quantity}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={enclosure.quantity}
                    onChange={(e) => onChange({ ...enclosure, quantity: parseInt(e.target.value) || 1 })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Verified Custom Net Volume ({volumeUnit})
                </label>
                <input
                  type="number"
                  step="1"
                  value={enclosure.customNetVolume || 200}
                  onChange={(e) => onChange({ ...enclosure, customNetVolume: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-orange-500"
                  placeholder="Enter documented engineering survey volume..."
                />
              </div>
            )}

            {/* Sub-spaces & Obstructions */}
            <div className="pt-2 border-t border-slate-800/80 space-y-3">
              <div className="text-xs font-bold text-slate-300">
                {lang === 'ar' ? 'الفراغات التابعة والعوائق' : 'Plenum Sub-Spaces & Permanent Obstructions'}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Raised Floor */}
                <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enclosure.hasRaisedFloor}
                        onChange={(e) => onChange({ ...enclosure, hasRaisedFloor: e.target.checked })}
                        className="rounded border-slate-700 text-orange-500 focus:ring-0"
                      />
                      <span>{t.enclosure.raisedFloor}</span>
                    </label>
                  </div>
                  {enclosure.hasRaisedFloor && (
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-0.5">Void Height ({lengthUnit}):</span>
                      <input
                        type="number"
                        step="0.05"
                        value={enclosure.raisedFloorHeight}
                        onChange={(e) => onChange({ ...enclosure, raisedFloorHeight: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-white font-mono"
                      />
                    </div>
                  )}
                </div>

                {/* Ceiling Void */}
                <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enclosure.hasCeilingVoid}
                        onChange={(e) => onChange({ ...enclosure, hasCeilingVoid: e.target.checked })}
                        className="rounded border-slate-700 text-orange-500 focus:ring-0"
                      />
                      <span>{t.enclosure.ceilingVoid}</span>
                    </label>
                  </div>
                  {enclosure.hasCeilingVoid && (
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-0.5">Plenum Height ({lengthUnit}):</span>
                      <input
                        type="number"
                        step="0.05"
                        value={enclosure.ceilingVoidHeight}
                        onChange={(e) => onChange({ ...enclosure, ceilingVoidHeight: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-white font-mono"
                      />
                    </div>
                  )}
                </div>

                {/* Permanent Obstructions */}
                <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
                  <span className="text-[11px] font-semibold text-slate-300 block mb-1">
                    {t.enclosure.solidObstructions} ({volumeUnit})
                  </span>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={enclosure.solidObstructions}
                    onChange={(e) => onChange({ ...enclosure, solidObstructions: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-white font-mono mb-1"
                  />
                  <span className="text-[9px] text-slate-400 block leading-tight">
                    * Deduct only verified concrete columns / non-porous cores
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Environmental & Atmospheric Conditions */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Thermometer className="w-4 h-4 text-blue-400" />
              <span>{lang === 'ar' ? 'درجات الحرارة والضغط الجوي والارتفاع' : 'Temperature & Atmospheric Pressure Corrections'}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  {t.enclosure.minTemp} ({tempUnit})
                </label>
                <input
                  type="number"
                  value={enclosure.minTemp}
                  onChange={(e) => onChange({ ...enclosure, minTemp: parseFloat(e.target.value) || 20 })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono focus:outline-none focus:border-orange-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  * Defines agent mass per NFPA 2001
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  {t.enclosure.maxTemp} ({tempUnit})
                </label>
                <input
                  type="number"
                  value={enclosure.maxTemp}
                  onChange={(e) => onChange({ ...enclosure, maxTemp: parseFloat(e.target.value) || 32 })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono focus:outline-none focus:border-orange-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  * Evaluates max concentration & NOAEL limit
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
                  <Mountain className="w-3.5 h-3.5 text-purple-400" />
                  <span>{t.enclosure.elevation} ({lengthUnit})</span>
                </label>
                <input
                  type="number"
                  value={enclosure.elevation}
                  onChange={(e) => onChange({ ...enclosure, elevation: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono focus:outline-none focus:border-orange-500"
                />
                <span className="text-[10px] text-purple-400 font-mono mt-1 block">
                  Correction Factor (Fa): {breakdown.altitudeCorrectionFactor}
                </span>
              </div>
            </div>

            {/* Integrity Status */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={enclosure.integrityTested}
                  onChange={(e) => onChange({ ...enclosure, integrityTested: e.target.checked })}
                  className="rounded border-slate-700 text-orange-500 focus:ring-0"
                />
                <span>Enclosure Door Fan Hold-Time Integrity Test completed or specified</span>
              </label>

              <span className="text-slate-400 text-[11px]">
                Target Hold Time: <strong>{enclosure.holdTimeTargetMin} mins</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Visual Room Diagram & Volume Breakdown */}
        <div className="space-y-5">
          {/* 3D/2D Visual Room Representation */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
              <span>{lang === 'ar' ? 'المخطط الهندسي للحيز' : 'Enclosure Profile Diagram'}</span>
              <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
            </h3>

            {/* Visual SVG Enclosure Cross-Section */}
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 flex flex-col items-center justify-center relative min-h-[220px]">
              {/* False Ceiling Void */}
              {enclosure.hasCeilingVoid && (
                <div className="w-full h-8 bg-purple-500/15 border-b-2 border-dashed border-purple-500/50 flex items-center justify-center text-[10px] font-mono text-purple-300">
                  Ceiling Void ({enclosure.ceilingVoidHeight} {lengthUnit})
                </div>
              )}

              {/* Main Room Volume */}
              <div className="w-full h-32 bg-orange-500/10 border-x-2 border-slate-700 flex flex-col items-center justify-center relative p-2 my-1">
                <div className="text-xs font-bold text-slate-200">
                  Main Protected Room
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  {enclosure.length} × {enclosure.width} × {enclosure.height} {lengthUnit}
                </div>

                {/* Obstruction block inside */}
                {enclosure.solidObstructions > 0 && (
                  <div className="absolute bottom-2 right-4 px-2 py-1 bg-slate-800 border border-slate-600 rounded text-[9px] text-slate-300 font-mono">
                    Solid Obstruction: {enclosure.solidObstructions} {volumeUnit}
                  </div>
                )}
              </div>

              {/* Raised Floor Void */}
              {enclosure.hasRaisedFloor && (
                <div className="w-full h-8 bg-blue-500/15 border-t-2 border-dashed border-blue-500/50 flex items-center justify-center text-[10px] font-mono text-blue-300">
                  Raised Floor Void ({enclosure.raisedFloorHeight} {lengthUnit})
                </div>
              )}

              {/* Floor Base */}
              <div className="w-full h-2 bg-slate-700 rounded-b mt-1" />
            </div>

            {/* Dimensions Summary */}
            <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs">
              <div className="text-slate-400">{t.enclosure.grossVolume}:</div>
              <div className="text-right font-mono font-bold text-slate-200">
                {breakdown.grossVolume} {volumeUnit}
              </div>

              <div className="text-slate-400 font-semibold">{t.enclosure.netVolume}:</div>
              <div className="text-right font-mono font-bold text-orange-400 text-sm">
                {breakdown.netDesignVolume} {volumeUnit}
              </div>
            </div>
          </div>

          {/* Mathematical Breakdown Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-orange-400" />
              <span>{lang === 'ar' ? 'خطوات التحقق الرياضي' : 'Calculation Methodology'}</span>
            </h3>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 font-mono text-[11px] text-slate-300 space-y-1.5">
              <div>V_main = {enclosure.length} × {enclosure.width} × {enclosure.height} = {breakdown.mainRoomVolume} {volumeUnit}</div>
              {enclosure.hasRaisedFloor && (
                <div className="text-blue-400">+ V_floor = {breakdown.raisedFloorVolume} {volumeUnit}</div>
              )}
              {enclosure.hasCeilingVoid && (
                <div className="text-purple-400">+ V_ceiling = {breakdown.ceilingVoidVolume} {volumeUnit}</div>
              )}
              {enclosure.solidObstructions > 0 && (
                <div className="text-red-400">- Solid Obstructions = {breakdown.obstructionsDeducted} {volumeUnit}</div>
              )}
              <div className="pt-1 border-t border-slate-800 text-emerald-400 font-bold">
                Net Design Volume = {breakdown.netDesignVolume} {volumeUnit}
              </div>
            </div>

            <div className="space-y-1 text-[11px] text-slate-400">
              {breakdown.notes.map((note, idx) => (
                <div key={idx} className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
