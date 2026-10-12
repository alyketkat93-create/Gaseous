import React, { useState } from 'react';
import {
  Wind,
  ShieldCheck,
  AlertTriangle,
  Layers,
  Cylinder,
  CheckCircle2,
  FileText,
  Calculator,
  Info,
  Clock,
  ExternalLink,
  Activity,
  Gauge,
} from 'lucide-react';
import { EnclosureData, InertGasCalcInput, InertGasCalcResult, UnitSystem, CalculationRecord } from '../../types';
import { calculateInertGas, INERT_GAS_SPECS } from '../../engineering/inertGasEngine';
import { Language, DICTIONARY } from '../../i18n/translations';
import { RoomGeometrySection } from './common/RoomGeometrySection';
import { CalculatorTopBar } from './common/CalculatorTopBar';

interface InertGasCalculatorProps {
  unitSystem: UnitSystem;
  lang: Language;
  initialData?: CalculationRecord;
  onSaveCalculation?: (record: CalculationRecord) => void;
  onNavigateToReport?: (record: CalculationRecord) => void;
}

export const InertGasCalculator: React.FC<InertGasCalculatorProps> = ({
  unitSystem,
  lang,
  initialData,
  onSaveCalculation,
  onNavigateToReport,
}) => {
  const t = DICTIONARY[lang];

  // Active Tab: 1. Inputs, 2. Results, 3. Method, 4. Checks
  const [activeTab, setActiveTab] = useState<'inputs' | 'results' | 'method' | 'checks'>('inputs');

  // Dedicated Gas Selector
  const [gasType, setGasType] = useState<InertGasCalcInput['gasType']>(
    initialData?.inputs?.gasType || 'inert_ig541'
  );

  // Metadata
  const [projectName, setProjectName] = useState(initialData?.projectName || 'National Heritage Archive Vault');
  const [roomName, setRoomName] = useState(initialData?.roomName || 'Rare Manuscripts Archive Room');
  const [calcRef, setCalcRef] = useState(initialData?.calcRef || 'CALC-INERT-2026-004');
  const [revision, setRevision] = useState(initialData?.revision || 'Rev 01');

  // Room geometry
  const [enclosure, setEnclosure] = useState<EnclosureData>(
    initialData?.enclosure || {
      shape: 'rectangular',
      length: 14.0,
      width: 10.0,
      height: 3.5,
      quantity: 1,
      isCombinedEnclosureConfirmed: true,
      hasRaisedFloor: false,
      raisedFloorHeight: 0,
      hasCeilingVoid: false,
      ceilingVoidHeight: 0,
      solidObstructions: 8.0,
      minTemp: 20,
      maxTemp: 28,
      elevation: 612,
      integrityTested: true,
      holdTimeTargetMin: 15,
    }
  );

  // Design parameters
  const [hazardClass, setHazardClass] = useState<InertGasCalcInput['hazardClass']>(
    initialData?.inputs?.hazardClass || 'class_a_surface'
  );
  const [designConc, setDesignConc] = useState<number>(initialData?.inputs?.designConcentration || 38.0);
  const [storagePressure, setStoragePressure] = useState<200 | 300>(
    initialData?.inputs?.storagePressureBar || 300
  );
  const [cylinderSize, setCylinderSize] = useState<80 | 140>(
    initialData?.inputs?.cylinderSizeLitres || 140
  );
  const [manufacturer, setManufacturer] = useState<string>(
    initialData?.inputs?.manufacturer || 'Tyco Ansul INERGEN Systems'
  );

  const calcInput: InertGasCalcInput = {
    gasType,
    enclosure,
    hazardClass,
    designConcentration: designConc,
    storagePressureBar: storagePressure,
    cylinderSizeLitres: cylinderSize,
    manufacturer,
    applicableStandard: 'NFPA 2001 (2022 ed.)',
  };

  const result: InertGasCalcResult = calculateInertGas(calcInput);

  const handleGasChange = (newGas: InertGasCalcInput['gasType']) => {
    setGasType(newGas);
    const specs = INERT_GAS_SPECS[newGas];
    setDesignConc(specs.minClassAConc);
  };

  const handleSave = () => {
    const record: CalculationRecord = {
      id: initialData?.id || `calc-inert-${Date.now()}`,
      calcRef,
      systemType: 'inert_gas',
      systemName: `Inert Gas (${result.gasName}) Fire Suppression System`,
      applicableStandard: 'NFPA 2001 (2022 ed.)',
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
        id: initialData?.id || `calc-inert-${Date.now()}`,
        calcRef,
        systemType: 'inert_gas',
        systemName: `Inert Gas (${result.gasName}) Fire Suppression System`,
        applicableStandard: 'NFPA 2001 (2022 ed.)',
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
        systemName="Inert Gas Fire Suppression Calculator"
        systemCategory="Atmospheric Inert Gas Clean Agent System"
        applicableStandard="NFPA 2001 (2022 ed.) / ISO 14520"
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

      {/* Gas Selector Tabs: IG-541, IG-55, IG-100, IG-01 */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {lang === 'ar' ? 'اختيار نوع الغاز الخامل المعتمد (NFPA 2001)' : 'Select Approved Inert Gas Agent'}
          </span>
          <span className="text-[10px] font-mono bg-blue-50 dark:bg-navy-800 text-engBlue px-2 py-0.5 rounded font-bold">
            Zero GWP | Zero ODP | Atmospheric
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { id: 'inert_ig541' as const, name: 'IG-541', trade: 'Inergen', comp: '52% N2, 40% Ar, 8% CO2' },
            { id: 'inert_ig55' as const, name: 'IG-55', trade: 'Argonite', comp: '50% N2, 50% Ar' },
            { id: 'inert_ig100' as const, name: 'IG-100', trade: 'NN100', comp: '100% Pure Nitrogen' },
            { id: 'inert_ig01' as const, name: 'IG-01', trade: 'Pure Argon', comp: '100% Pure Argon' },
          ].map((gas) => {
            const isSelected = gasType === gas.id;
            return (
              <button
                key={gas.id}
                onClick={() => handleGasChange(gas.id)}
                className={`p-3 rounded-lg border text-left rtl:text-right transition cursor-pointer ${
                  isSelected
                    ? 'bg-engBlue/10 border-engBlue text-navy-900 dark:text-white ring-1 ring-engBlue'
                    : 'bg-slate-50 dark:bg-navy-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm">{gas.name}</span>
                  <span className="text-[10px] font-medium text-slate-400">{gas.trade}</span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 truncate">
                  {gas.comp}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Tabs within Inert Gas Module */}
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
          <Activity className="w-3.5 h-3.5" />
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
                <Wind className="w-4 h-4 text-engBlue" />
                <span>{result.gasName} Sizing Parameters & Storage Pressure</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Design Concentration (%)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="34.0"
                    max="52.0"
                    value={designConc}
                    onChange={(e) => setDesignConc(parseFloat(e.target.value) || 38.0)}
                    className="w-full bg-slate-50 dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-engBlue"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    NFPA 2001 minimum: {INERT_GAS_SPECS[gasType].minClassAConc}%
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Storage Working Pressure
                  </label>
                  <select
                    value={storagePressure}
                    onChange={(e) => setStoragePressure(parseInt(e.target.value) as any)}
                    className="w-full bg-slate-50 dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-engBlue"
                  >
                    <option value={300}>300 bar (4350 psi) — High-Density Modern Storage</option>
                    <option value={200}>200 bar (2900 psi) — Standard Pressure System</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Cylinder Water Volume
                  </label>
                  <select
                    value={cylinderSize}
                    onChange={(e) => setCylinderSize(parseInt(e.target.value) as any)}
                    className="w-full bg-slate-50 dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-engBlue"
                  >
                    <option value={140}>140 Litre Seamless Cylinders (Yields ~39.9 m³ @ 300 bar)</option>
                    <option value={80}>80 Litre Seamless Cylinders (Yields ~22.8 m³ @ 300 bar)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Approved System Manufacturer
                  </label>
                  <select
                    value={manufacturer}
                    onChange={(e) => setManufacturer(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-engBlue"
                  >
                    <option value="Tyco Ansul INERGEN Systems">Tyco / Ansul INERGEN</option>
                    <option value="Fike ProInert System">Fike ProInert (Constant Flow)</option>
                    <option value="Minimax MX 1230 / Argonite">Minimax MX 200/300</option>
                    <option value="Janus Inert System">Janus Fire Systems</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Summary */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4 sticky top-16">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Live Inert Gas Sizing Summary
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  NFPA 2001
                </span>
              </div>

              {/* Big primary number */}
              <div className="p-4 rounded-xl bg-engBlue/10 border border-engBlue/20 text-center space-y-1">
                <span className="text-xs font-bold uppercase text-engBlue">Required Free Gas Volume (X)</span>
                <div className="text-3xl font-extrabold text-navy-900 dark:text-white font-mono">
                  {result.correctedGasVolumeM3.toFixed(1)}{' '}
                  <span className="text-sm font-semibold text-slate-500">m³</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  At 21°C & 1.013 bar reference conditions
                </div>
              </div>

              {/* Cylinders Callout */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-neutralBg dark:bg-navy-800/60 border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-500 block font-medium">Cylinder Bank</span>
                  <div className="text-xl font-bold font-mono text-navy-900 dark:text-white mt-0.5">
                    {result.requiredCylinderCount}{' '}
                    <span className="text-xs font-normal text-slate-500">Cyls</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{result.cylinderSizeLitres}L @ {result.storagePressureBar} bar</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 block font-medium">Total Supplied Gas</span>
                  <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {result.totalSuppliedGasVolumeM3.toFixed(1)}{' '}
                    <span className="text-xs font-normal text-slate-500">m³</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Yield: {result.gasYieldPerCylinderM3} m³/cyl</span>
                </div>
              </div>

              {/* Residual Oxygen & Venting Indicators */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-xs text-emerald-900 dark:text-emerald-300">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Residual Oxygen:</span>
                  <span className="text-lg font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                    {result.postDischargeOxygenPercent}% O₂
                  </span>
                  <span className="text-[9px] block text-emerald-700 dark:text-emerald-400 font-semibold">Safe Egress (&ge; 12%)</span>
                </div>

                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40 text-xs text-blue-900 dark:text-blue-300">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Required Vent Damper:</span>
                  <span className="text-lg font-mono font-extrabold text-blue-600 dark:text-blue-400">
                    {result.estPressureReliefVentAreaM2.toFixed(3)} m²
                  </span>
                  <span className="text-[9px] block text-blue-700 dark:text-blue-400 font-semibold">
                    {(result.estPressureReliefVentAreaM2 * 10000).toFixed(0)} cm² Free Area
                  </span>
                </div>
              </div>

              {/* Metrics table */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400">Net Flooding Volume:</span>
                  <span className="font-mono font-bold text-navy-900 dark:text-white">
                    {result.netDesignVolumeM3.toFixed(2)} m³
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400">Actual Supplied Concentration:</span>
                  <span className="font-mono font-bold text-navy-900 dark:text-white">
                    {result.actualSuppliedConcentration.toFixed(1)}%
                  </span>
                </div>

                {result.postDischargeCarbonDioxidePercent && (
                  <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-600 dark:text-slate-400">Post-Discharge CO2 Level:</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      ~{result.postDischargeCarbonDioxidePercent}% (Breathing Stimulant)
                    </span>
                  </div>
                )}
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
              <span>Inert Gas Cylinder Schedule & Pressure Venting Requirements</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-800/80 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Agent & Gas Mix</span>
                <div className="text-xl font-bold font-mono text-navy-900 dark:text-white mt-1">
                  {result.gasName}
                </div>
                <span className="text-[10px] text-slate-400">{result.gasComposition}</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-800/80 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Free Gas Volume</span>
                <div className="text-2xl font-extrabold font-mono text-engBlue mt-1">
                  {result.correctedGasVolumeM3.toFixed(1)} m³
                </div>
                <span className="text-[10px] text-slate-400">At reference temperature</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-800/80 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Cylinder Count</span>
                <div className="text-2xl font-extrabold font-mono text-navy-900 dark:text-white mt-1">
                  {result.requiredCylinderCount} × {result.cylinderSizeLitres}L
                </div>
                <span className="text-[10px] text-slate-400">Storage: {result.storagePressureBar} bar</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-800/80 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Residual O2</span>
                <div className="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                  {result.postDischargeOxygenPercent}%
                </div>
                <span className="text-[10px] text-slate-400">Safe for Egress (&ge; 12%)</span>
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
              <span>Step-by-Step NFPA 2001 Inert Gas Volumetric Equations</span>
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
              <Activity className="w-5 h-5 text-emerald-500" />
              <span>Oxygen Inhalation Safety & Overpressure Relief Damper Sizing</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-navy-900 dark:text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Residual Oxygen Egress Limit
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600">
                  {result.postDischargeOxygenPercent}% O₂ (SAFE)
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Oxygen level drops from 20.9% to <strong>{result.postDischargeOxygenPercent}%</strong>, which is above the
                12.0% threshold. Personnel can safely evacuate the space within 5 minutes without asphyxiation hazard.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-navy-900 dark:text-white flex items-center gap-1.5">
                  <Gauge className="w-4 h-4 text-engBlue" />
                  Mandatory Pressure Relief Damper
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-engBlue">
                  {result.estPressureReliefVentAreaM2.toFixed(3)} m²
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Discharging {result.totalSuppliedGasVolumeM3.toFixed(1)} m³ of inert gas within 60 seconds generates extreme
                positive pressure surges. A counterbalanced 2-way relief damper of minimum{' '}
                <strong>{(result.estPressureReliefVentAreaM2 * 10000).toFixed(0)} cm²</strong> free vent area is mandatory.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
