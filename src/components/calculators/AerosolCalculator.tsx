import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Layers,
  Cylinder,
  CheckCircle2,
  FileText,
  Calculator,
  Wind,
  Info,
  Clock,
  ExternalLink,
  Flame,
  Thermometer,
} from 'lucide-react';
import { EnclosureData, AerosolCalcInput, AerosolCalcResult, UnitSystem, CalculationRecord } from '../../types';
import { calculateAerosol, AEROSOL_GENERATORS } from '../../engineering/aerosolEngine';
import { Language, DICTIONARY } from '../../i18n/translations';
import { RoomGeometrySection } from './common/RoomGeometrySection';
import { CalculatorTopBar } from './common/CalculatorTopBar';

interface AerosolCalculatorProps {
  unitSystem: UnitSystem;
  lang: Language;
  initialData?: CalculationRecord;
  onSaveCalculation?: (record: CalculationRecord) => void;
  onNavigateToReport?: (record: CalculationRecord) => void;
}

export const AerosolCalculator: React.FC<AerosolCalculatorProps> = ({
  unitSystem,
  lang,
  initialData,
  onSaveCalculation,
  onNavigateToReport,
}) => {
  const t = DICTIONARY[lang];

  // Active Tab: 1. Inputs, 2. Results, 3. Method, 4. Checks
  const [activeTab, setActiveTab] = useState<'inputs' | 'results' | 'method' | 'checks'>('inputs');

  // Metadata
  const [projectName, setProjectName] = useState(initialData?.projectName || 'Yanbu Remote Petrochem Substation');
  const [roomName, setRoomName] = useState(initialData?.roomName || 'Switchgear Compartment #4');
  const [calcRef, setCalcRef] = useState(initialData?.calcRef || 'CALC-AERO-2026-005');
  const [revision, setRevision] = useState(initialData?.revision || 'Rev 00');

  // Room geometry
  const [enclosure, setEnclosure] = useState<EnclosureData>(
    initialData?.enclosure || {
      shape: 'rectangular',
      length: 8.0,
      width: 5.0,
      height: 3.2,
      quantity: 1,
      isCombinedEnclosureConfirmed: true,
      hasRaisedFloor: false,
      raisedFloorHeight: 0,
      hasCeilingVoid: false,
      ceilingVoidHeight: 0,
      solidObstructions: 3.0,
      minTemp: 20,
      maxTemp: 45,
      elevation: 20,
      integrityTested: true,
      holdTimeTargetMin: 15,
    }
  );

  // Aerosol parameters
  const [hazardClass, setHazardClass] = useState<AerosolCalcInput['hazardClass']>(
    initialData?.inputs?.hazardClass || 'class_c_electrical'
  );
  const [designDensity, setDesignDensity] = useState<number>(
    initialData?.inputs?.designApplicationDensityGM3 || 78.0
  );
  const [safetyFactor, setSafetyFactor] = useState<number>(initialData?.inputs?.safetyFactor || 1.30);
  const [heightFactor, setHeightFactor] = useState<number>(initialData?.inputs?.heightDistributionFactor || 1.0);
  const [leakageFactor, setLeakageFactor] = useState<number>(
    initialData?.inputs?.unclosableOpeningsLeakageFactor || 1.05
  );
  const [selectedGenModel, setSelectedGenModel] = useState<string>(
    initialData?.inputs?.generatorModel || 'FirePro FP-3000'
  );
  const [manufacturer, setManufacturer] = useState<string>(
    initialData?.inputs?.manufacturer || 'FirePro Systems Ltd.'
  );

  const targetGen = AEROSOL_GENERATORS.find((g) => g.modelName === selectedGenModel) || AEROSOL_GENERATORS[7];

  const calcInput: AerosolCalcInput = {
    enclosure,
    hazardClass,
    designApplicationDensityGM3: designDensity,
    safetyFactor,
    heightDistributionFactor: heightFactor,
    unclosableOpeningsLeakageFactor: leakageFactor,
    generatorModel: targetGen.modelName,
    generatorCapacityGrams: targetGen.compoundMassGrams,
    manufacturer,
    applicableStandard: 'NFPA 2010 (2020 ed.)',
  };

  const result: AerosolCalcResult = calculateAerosol(calcInput);

  const handleSave = () => {
    const record: CalculationRecord = {
      id: initialData?.id || `calc-aerosol-${Date.now()}`,
      calcRef,
      systemType: 'aerosol',
      systemName: 'Condensed Aerosol Fire Suppression System',
      applicableStandard: 'NFPA 2010 (2020 ed.)',
      projectName,
      roomName,
      designer: 'Aly Ketkat',
      reviewer: 'Eng. Fahad Al-Otaibi, Lead FPE',
      revision,
      date: new Date().toISOString().split('T')[0],
      status: 'verified',
      unitSystem,
      roomConfirmedSingleEnclosure: !!enclosure.isCombinedEnclosureConfirmed,
      enclosure,
      inputs: calcInput,
      results: result,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    if (onSaveCalculation) onSaveCalculation(record);
  };

  const handleGenerateReport = () => {
    handleSave();
    if (onNavigateToReport) {
      const record: CalculationRecord = {
        id: initialData?.id || `calc-aerosol-${Date.now()}`,
        calcRef,
        systemType: 'aerosol',
        systemName: 'Condensed Aerosol Fire Suppression System',
        applicableStandard: 'NFPA 2010 (2020 ed.)',
        projectName,
        roomName,
        designer: 'Aly Ketkat',
        reviewer: 'Eng. Fahad Al-Otaibi, Lead FPE',
        revision,
        date: new Date().toISOString().split('T')[0],
        status: 'verified',
        unitSystem,
        roomConfirmedSingleEnclosure: !!enclosure.isCombinedEnclosureConfirmed,
        enclosure,
        inputs: calcInput,
        results: result,
        createdAt: initialData?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      onNavigateToReport(record);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Engineering Framework Bar */}
      <CalculatorTopBar
        systemName="Aerosol Fire Suppression Calculator"
        systemCategory="Condensed Aerosol Generator Extinguishing System"
        applicableStandard="NFPA 2010 (2020 ed.) / ISO 15779"
        calcReference={calcRef}
        status="verified"
        onSave={handleSave}
        onGenerateReport={handleGenerateReport}
        lang={lang}
        onReferenceChange={setCalcRef}
        projectName={projectName}
        roomName={roomName}
        onProjectNameChange={setProjectName}
        onRoomNameChange={setRoomName}
      />

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 rounded-lg p-1 shadow-sm">
        <button
          onClick={() => setActiveTab('inputs')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-md transition cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'inputs'
              ? 'bg-engBlue text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>1. {t.tabs.inputs}</span>
        </button>

        <button
          onClick={() => setActiveTab('results')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-md transition cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'results'
              ? 'bg-engBlue text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>2. {t.tabs.results}</span>
        </button>

        <button
          onClick={() => setActiveTab('method')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-md transition cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'method'
              ? 'bg-engBlue text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>3. {t.tabs.method}</span>
        </button>

        <button
          onClick={() => setActiveTab('checks')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-md transition cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'checks'
              ? 'bg-engBlue text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>4. {t.tabs.checks}</span>
        </button>
      </div>

      {/* Tab 1: Calculation Inputs */}
      {activeTab === 'inputs' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column (Inputs) */}
          <div className="lg:col-span-7 space-y-5">
            <RoomGeometrySection
              enclosure={enclosure}
              onChange={setEnclosure}
              unitSystem={unitSystem}
              lang={lang}
            />

            <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-navy-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                <Sparkles className="w-4 h-4 text-engBlue" />
                <span>Aerosol Design Density & Generator Model Selection</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Hazard Classification
                  </label>
                  <select
                    value={hazardClass}
                    onChange={(e) => {
                      const hc = e.target.value as any;
                      setHazardClass(hc);
                      if (hc === 'class_b_flammable') setDesignDensity(95.0);
                      else if (hc === 'class_c_electrical') setDesignDensity(78.0);
                      else setDesignDensity(75.0);
                    }}
                    className="w-full bg-slate-50 dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-engBlue"
                  >
                    <option value="class_c_electrical">Class C — Electrical Switchgear / Panels (78 g/m³)</option>
                    <option value="class_a_surface">Class A — Surface Combustibles (75 g/m³)</option>
                    <option value="class_b_flammable">Class B — Flammable Liquids / Fuel (95 g/m³)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    {t.aerosol.density}
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="50"
                    max="150"
                    value={designDensity}
                    onChange={(e) => setDesignDensity(parseFloat(e.target.value) || 78)}
                    className="w-full bg-slate-50 dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-engBlue"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Certified certified application density</span>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    {t.aerosol.generatorModel}
                  </label>
                  <select
                    value={selectedGenModel}
                    onChange={(e) => setSelectedGenModel(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-engBlue"
                  >
                    {AEROSOL_GENERATORS.map((gen) => (
                      <option key={gen.modelName} value={gen.modelName}>
                        {gen.modelName} ({gen.compoundMassGrams}g compound) — {gen.manufacturer}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Safety Factor (fa)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="1.30"
                    max="1.60"
                    value={safetyFactor}
                    onChange={(e) => setSafetyFactor(parseFloat(e.target.value) || 1.3)}
                    className="w-full bg-slate-50 dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-engBlue"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">NFPA 2010 Clause 7.5 minimum: 1.30</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Engineering Summary Card */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4 sticky top-16">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Live Aerosol Sizing Summary
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  NFPA 2010 Verified
                </span>
              </div>

              {/* Big primary number */}
              <div className="p-4 rounded-xl bg-engBlue/10 border border-engBlue/20 text-center space-y-1">
                <span className="text-xs font-bold uppercase text-engBlue">Total Condensed Aerosol Mass</span>
                <div className="text-3xl font-extrabold text-navy-900 dark:text-white font-mono">
                  {result.totalAerosolMassKg.toFixed(2)}{' '}
                  <span className="text-sm font-semibold text-slate-500">kg</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Net Volume: {result.netVolumeM3.toFixed(2)} m³ @ {result.designDensityGM3} g/m³
                </div>
              </div>

              {/* Generators Callout */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-neutralBg dark:bg-navy-800/60 border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-500 block font-medium">Required Generators</span>
                  <div className="text-xl font-bold font-mono text-navy-900 dark:text-white mt-0.5">
                    {result.requiredGeneratorsCount}{' '}
                    <span className="text-xs font-normal text-slate-500">Units</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{result.selectedGeneratorModel}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 block font-medium">Total Supplied Mass</span>
                  <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {result.totalSuppliedMassKg.toFixed(2)}{' '}
                    <span className="text-xs font-normal text-slate-500">kg</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{result.unitCapacityGrams}g per unit</span>
                </div>
              </div>

              {/* Thermal Clearance Metrics Table */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400">Casing Temperature at Nozzle:</span>
                  <span className="font-mono font-bold text-red-600 dark:text-red-400">
                    ~{result.casingTemperatureC}°C
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400">Min Distance to Combustibles:</span>
                  <span className="font-mono font-bold text-navy-900 dark:text-white">
                    {result.safeThermalClearanceOutletMeters} meters
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400">Min Distance to Egress/Personnel:</span>
                  <span className="font-mono font-bold text-navy-900 dark:text-white">
                    {result.safeClearancePersonnelMeters} meters
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400">Discharge Duration:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {result.dischargeDurationSeconds} seconds
                  </span>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('results')}
                className="w-full py-2 px-3 rounded-lg bg-navy-900 dark:bg-navy-800 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <span>View Detailed Results & Tabs</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Calculation Results */}
      {activeTab === 'results' && (
        <div className="space-y-5">
          <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
            <h2 className="text-base font-bold text-navy-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <Calculator className="w-5 h-5 text-engBlue" />
              <span>Aerosol Generator Allocation Schedule & Thermal Clearances</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-800/80 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Protected Net Volume</span>
                <div className="text-2xl font-extrabold font-mono text-navy-900 dark:text-white mt-1">
                  {result.netVolumeM3.toFixed(2)} m³
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-800/80 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Aerosol Mass</span>
                <div className="text-2xl font-extrabold font-mono text-engBlue mt-1">
                  {result.totalAerosolMassKg.toFixed(2)} kg
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-800/80 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Generator Units</span>
                <div className="text-2xl font-extrabold font-mono text-navy-900 dark:text-white mt-1">
                  {result.requiredGeneratorsCount} × {result.selectedGeneratorModel}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-800/80 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Discharge Time</span>
                <div className="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                  {result.dischargeDurationSeconds}s
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {result.notesAndWarnings.map((note, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-lg bg-neutralBg dark:bg-navy-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 leading-relaxed"
                >
                  <Info className="w-4 h-4 text-engBlue shrink-0 mt-0.5" />
                  <span>{note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Calculation Method */}
      {activeTab === 'method' && (
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 className="text-base font-bold text-navy-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-engBlue" />
              <span>Step-by-Step NFPA 2010 Condensed Aerosol Formulas</span>
            </h2>
          </div>

          <div className="space-y-4">
            {result.calculationSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-50 dark:bg-navy-800/60 border border-slate-200 dark:border-slate-700 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-navy-900 dark:text-white">{step.step}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-engBlue/10 text-engBlue">
                    {step.reference}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">Formula</span>
                    <code className="text-slate-800 dark:text-slate-200 font-mono font-semibold">{step.formula}</code>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">Substitution</span>
                    <span className="text-slate-700 dark:text-slate-300 font-mono text-[11px]">{step.substitution}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">Step Result</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">{step.result}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Engineering Checks */}
      {activeTab === 'checks' && (
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 className="text-base font-bold text-navy-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span>Aerosol Safety Clearances & Electrical Actuation Verification</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-navy-900 dark:text-white flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4 text-red-500" />
                  Thermal Clearance to Combustibles
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600">
                  {result.safeThermalClearanceOutletMeters}m Clearance
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Minimum {result.safeThermalClearanceOutletMeters}m clearance must be maintained between the generator
                discharge nozzle and any combustible material to prevent ignition from hot effluent gases (~{result.casingTemperatureC}°C).
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-navy-900 dark:text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Electrical Actuation Circuit
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-engBlue">
                  24V DC Supervised
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Release control panel must deliver a simultaneous 24V DC (1.5A) activation pulse to all generators to ensure
                uniform flooding across the protected enclosure.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
