import React from 'react';
import {
  Flame,
  Wind,
  AlertOctagon,
  Sparkles,
  Waves,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  FileText,
  Calculator,
  Building2,
  Lock,
  Cpu,
} from 'lucide-react';
import { Language, DICTIONARY } from '../i18n/translations';

interface LandingPageViewProps {
  onLaunchPlatform: () => void;
  lang: Language;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onLaunchPlatform,
  lang,
}) => {
  const t = DICTIONARY[lang];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-slate-800/80">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/10 via-slate-950 to-slate-950 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 text-xs font-semibold text-slate-300">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span>Built for MEP Consultants & Fire Protection Engineers in Egypt, Saudi Arabia & the GCC</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
            ENGINEERING PRECISION.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-red-500">
              FIRE PROTECTION CONFIDENCE.
            </span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
            An integrated engineering workspace for clean agent, CO2, aerosol, inert gas, and foam fire suppression calculations, design reviews, documentation, and cost estimation.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={onLaunchPlatform}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-xl shadow-orange-500/25 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Launch FIRECALC PRO</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#systems"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-semibold text-sm transition"
            >
              Explore Calculation Engines
            </a>
          </div>

          {/* Trust Badges */}
          <div className="pt-8 border-t border-slate-900 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> NFPA 2001 (2022)
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> NFPA 12 (CO2)
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Saudi SBC 801
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Egyptian Fire Code
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> NFPA 11 Foam
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> NFPA 2010 Aerosol
            </span>
          </div>
        </div>
      </section>

      {/* Sizing Engines Grid */}
      <section id="systems" className="py-16 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-2 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-400">Specialized Engineering Modules</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Dedicated Physics & Thermodynamic Calculation Engines
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            Each suppression technology features a standalone, rigorous calculation engine complying strictly with authorized code equations. No simplistic rules of thumb.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Clean Agent */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 hover:border-orange-500/50 transition">
            <div className="w-12 h-12 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-orange-400 uppercase font-bold">NFPA 2001 Standard</span>
              <h3 className="text-base font-bold text-white mt-1">FM-200 & FK-5-1-12 Clean Agents</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Specific vapor volume formula s = k1 + k2*T, altitude atmospheric correction factors, toxicological NOAEL/LOAEL verification, and 10-second discharge compliance.
            </p>
          </div>

          {/* Inert Gas */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 hover:border-blue-500/50 transition">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Wind className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-blue-400 uppercase font-bold">NFPA 2001 Chapter 5</span>
              <h3 className="text-base font-bold text-white mt-1">Inert Gas (IG-541, IG-55, IG-100)</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Logarithmic volumetric expansion equations, 200/300-bar high pressure cylinder banks, post-discharge residual oxygen life-safety analysis, and overpressure relief.
            </p>
          </div>

          {/* Carbon Dioxide */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 hover:border-red-500/50 transition">
            <div className="w-12 h-12 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-red-400 uppercase font-bold">NFPA 12 Standard</span>
              <h3 className="text-base font-bold text-white mt-1">Carbon Dioxide (CO2) Systems</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Surface vs deep-seated volume factors, unclosable opening leakage compensations, 45kg HP cylinders, and prominent life-safety lockout checklists.
            </p>
          </div>

          {/* Condensed Aerosol */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 hover:border-amber-500/50 transition">
            <div className="w-12 h-12 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">NFPA 2010 Standard</span>
              <h3 className="text-base font-bold text-white mt-1">Condensed Aerosol Generators</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Application density equations M = V * dae * 1.3, FirePro / Stat-X generator selection, and minimum thermal clearance safety boundaries.
            </p>
          </div>

          {/* Foam Systems */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 hover:border-cyan-500/50 transition">
            <div className="w-12 h-12 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Waves className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">NFPA 11 & NFPA 16</span>
              <h3 className="text-base font-bold text-white mt-1">Foam Fire Suppression</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Foam solution flow rates, duration-based volume demand, bladder tank capacities with reserve, and synthetic fluorine-free foam (SFFF) PFAS compliance.
            </p>
          </div>

          {/* BOQ & Cost Takeoff */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 hover:border-emerald-500/50 transition">
            <div className="w-12 h-12 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">Commercial Sizing</span>
              <h3 className="text-base font-bold text-white mt-1">BOQ & GCC Cost Estimation</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Itemized materials & labor, multi-currency support (SAR, AED, EGP, USD), contractor markup sliders, and direct Excel (.xlsx) export.
            </p>
          </div>
        </div>
      </section>

      {/* Engineering Disclaimer Footer */}
      <footer className="border-t border-slate-900 py-10 max-w-6xl mx-auto px-4 sm:px-6 text-center text-xs text-slate-400 space-y-4">
        <p className="max-w-3xl mx-auto leading-relaxed">
          <strong>LEGAL & ENGINEERING DISCLAIMER:</strong> FIRECALC PRO provides preliminary engineering calculation tools and preliminary equipment schedules in accordance with NFPA, SBC, and civil defense requirements. It does not replace professional judgment by a licensed Fire Protection Engineer (PE), certified hydraulic calculation software submittals from system manufacturers, or authority having jurisdiction (AHJ) approvals.
        </p>
        <div className="text-slate-400">
          © 2026 FIRECALC PRO — Professional Fire Suppression Engineering & Design Platform. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
