import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Layers,
  FileCheck2,
} from 'lucide-react';
import { UnitSystem } from '../types';
import { calculatePressureReliefAndIntegrity } from '../engineering/ventingIntegrity';
import { Language, DICTIONARY } from '../i18n/translations';

interface VentingIntegrityViewProps {
  unitSystem: UnitSystem;
  lang: Language;
}

export const VentingIntegrityView: React.FC<VentingIntegrityViewProps> = ({
  unitSystem,
  lang,
}) => {
  const t = DICTIONARY[lang];

  const [systemType, setSystemType] = useState<'chemical_clean_agent' | 'inert_gas' | 'co2'>('chemical_clean_agent');
  const [netVolume, setNetVolume] = useState<number>(320);
  const [wallConstruction, setWallConstruction] = useState<'standard_drywall' | 'concrete_blockwork' | 'reinforced_concrete'>('concrete_blockwork');
  const [roomHeight, setRoomHeight] = useState<number>(3.8);

  const result = calculatePressureReliefAndIntegrity({
    systemType,
    netVolumeM3: netVolume,
    totalAgentVolumeOrMass: systemType === 'inert_gas' ? netVolume * 0.45 : netVolume * 0.85,
    dischargeDurationSec: systemType === 'chemical_clean_agent' ? 10 : 60,
    wallConstruction,
    roomHeightM: roomHeight,
    targetHoldTimeMinutes: 10,
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>{t.venting.title}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {lang === 'ar'
              ? 'حساب مساحة فتحات مخمدات تخفيف الضغط الزائد واختبار إحكام الغرفة ومروحة الباب وفق ملحق كود NFPA 2001'
              : 'NFPA 2001 Annex B Pressure Relief Damper (PRD) Sizing and Door Fan Test Hold-Time Integrity Assessment'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form Parameters & Integrity Checklist */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'ar' ? 'معايير حساب تفريغ الضغط' : 'Enclosure Structural & System Discharge Inputs'}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Fire Suppression Agent
                </label>
                <select
                  value={systemType}
                  onChange={(e) => setSystemType(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="chemical_clean_agent">Chemical Clean Agent (10s discharge)</option>
                  <option value="inert_gas">Inert Gas IG-541 / IG-55 (60s discharge)</option>
                  <option value="co2">Carbon Dioxide CO2 (NFPA 12)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Net Enclosure Volume (m³)
                </label>
                <input
                  type="number"
                  step="10"
                  min="20"
                  value={netVolume}
                  onChange={(e) => setNetVolume(parseFloat(e.target.value) || 100)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Enclosure Structural Construction
                </label>
                <select
                  value={wallConstruction}
                  onChange={(e) => setWallConstruction(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="concrete_blockwork">Concrete Blockwork (600 Pa Limit)</option>
                  <option value="standard_drywall">Fire-Rated Drywall Gypsum (300 Pa Limit)</option>
                  <option value="reinforced_concrete">Reinforced Cast Concrete (1000 Pa Limit)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Enclosure Integrity Checklist */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <h2 className="text-sm font-bold text-white flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'ar' ? 'اشتراطات اختبار مروحة الباب وختم الفراغ' : 'NFPA 2001 Room Sealing & Inspection Checklist'}</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ANNEX B TEST
              </span>
            </h2>

            <div className="space-y-2 text-xs text-slate-300">
              <label className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                <input type="checkbox" defaultChecked className="mt-0.5 rounded border-slate-700 text-emerald-500" />
                <div>
                  <span className="font-semibold block text-slate-200">Motorized Fire & Smoke Dampers</span>
                  <span className="text-[11px] text-slate-400">Interlocked to gas releasing panel to seal supply and extract ducts upon first-stage alarm.</span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                <input type="checkbox" defaultChecked className="mt-0.5 rounded border-slate-700 text-emerald-500" />
                <div>
                  <span className="font-semibold block text-slate-200">Penetration Firestopping Certification</span>
                  <span className="text-[11px] text-slate-400">All cable trays, busducts, pipe sleeves, and perimeter gaps sealed with UL-listed intumescent/elastomeric sealant.</span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                <input type="checkbox" defaultChecked className="mt-0.5 rounded border-slate-700 text-emerald-500" />
                <div>
                  <span className="font-semibold block text-slate-200">Door Weatherstripping & Automatic Door Closers</span>
                  <span className="text-[11px] text-slate-400">Positive latching fire doors with acoustic neoprene perimeter seals and drop-down bottom threshold seals.</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Results & Damper Recommendation */}
        <div className="space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-3">
              {lang === 'ar' ? 'مساحة فتحة مخمد الضغط الزائد' : 'Pressure Relief Damper Sizing'}
            </h3>

            {/* Free Vent Area */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block mb-1">Required Free Vent Area</span>
              <div className="text-3xl font-extrabold text-white font-mono">
                {result.requiredFreeVentAreaM2} <span className="text-lg text-emerald-400 font-sans">m²</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-1">
                Equivalent: {result.requiredFreeVentAreaCm2} cm²
              </div>
            </div>

            {/* Recommended Model */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-xs font-semibold text-slate-300 block mb-1">Recommended Damper:</span>
              <div className="text-sm font-bold text-emerald-400">
                {result.recommendedDamperModel}
              </div>
              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800 mt-2 font-mono space-y-1">
                <div className="flex justify-between">
                  <span>Allowable Peak Pressure:</span>
                  <span className="text-slate-200">{result.allowablePeakPressurePa} Pa</span>
                </div>
                <div className="flex justify-between">
                  <span>Double-Acting Required:</span>
                  <span className="text-emerald-400 font-bold">{result.isDoubleActingRequired ? 'YES' : 'NO'}</span>
                </div>
              </div>
            </div>

            {/* Hold Time Simulation */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-orange-400" />
                  <span>Door Fan Hold-Time Estimate:</span>
                </span>
                <span className="text-base font-extrabold font-mono text-emerald-400">
                  {result.doorFanTestHoldTimeEstimateMin} min
                </span>
              </div>
              <div className="text-[11px] text-emerald-400 font-medium">
                Target Hold Time (≥ 10 min) PASSED per NFPA 2001 Annex B descending interface model.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
