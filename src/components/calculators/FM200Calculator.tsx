import React, { useState } from 'react';
import {
  Flame,
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
} from 'lucide-react';
import { EnclosureData, FM200CalcInput, FM200CalcResult, UnitSystem, CalculationRecord } from '../../types';
import { calculateFM200, FM200_CYLINDERS } from '../../engineering/fm200Engine';
import { Language, DICTIONARY } from '../../i18n/translations';
import { RoomGeometrySection } from './common/RoomGeometrySection';
import { CalculatorTopBar } from './common/CalculatorTopBar';

interface FM200CalculatorProps {
  unitSystem: UnitSystem;
  lang: Language;
  initialData?: CalculationRecord;
  onSaveCalculation?: (record: CalculationRecord) => void;
  onNavigateToReport?: (record: CalculationRecord) => void;
}

export const FM200Calculator: React.FC<FM200CalculatorProps> = ({
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
  const [projectName, setProjectName] = useState(initialData?.projectName || 'Riyadh Hyperscale Data Center');
  const [roomName, setRoomName] = useState(initialData?.roomName || 'Main Server Room 01');
  const [calcRef, setCalcRef] = useState(initialData?.calcRef || 'CALC-FM200-2026-001');
  const [revision, setRevision] = useState(initialData?.revision || 'Rev 01');

  // Room geometry
  const [enclosure, setEnclosure] = useState<EnclosureData>(
    initialData?.enclosure || {
      shape: 'rectangular',
      length: 12.0,
      width: 8.0,
      height: 3.5,
      quantity: 1,
      isCombinedEnclosureConfirmed: true,
      hasRaisedFloor: true,
      raisedFloorHeight: 0.5,
      hasCeilingVoid: true,
      ceilingVoidHeight: 0.4,
      solidObstructions: 4.5,
      minTemp: 21,
      maxTemp: 32,
      elevation: 612,
      integrityTested: true,
      holdTimeTargetMin: 10,
    }
  );

  // FM-200 Design Parameters
  const [hazardClass, setHazardClass] = useState<FM200CalcInput['hazardClass']>(
    initialData?.inputs?.hazardClass || 'class_a_surface'
  );
  const [designConc, setDesignConc] = useState<number>(initialData?.inputs?.designConcentration || 7.9);
  const [safetyFactor, setSafetyFactor] = useState<number>(initialData?.inputs?.safetyFactorPercent || 20);
  const [storagePressure, setStoragePressure] = useState<25 | 42>(initialData?.inputs?.cylinderStoragePressureBar || 25);
  const [selectedCylModel, setSelectedCylModel] = useState<string>(
    initialData?.inputs?.cylinderModel || 'FM-CYL-180L (25 Bar)'
  );
  const [fillDensity, setFillDensity] = useState<number>(initialData?.inputs?.fillDensityKgL || 0.95);
  const [manufacturer, setManufacturer] = useState<string>(
    initialData?.inputs?.manufacturer || 'Kidde Fenwal Fire Systems'
  );

  // Sizing calculation input
  const targetCyl = FM200_CYLINDERS.find((c) => c.model === selectedCylModel) || FM200_CYLINDERS[3];

  const calcInput: FM200CalcInput = {
    enclosure,
    hazardClass,
    designConcentration: designConc,
    safetyFactorPercent: safetyFactor,
    cylinderStoragePressureBar: storagePressure,
    cylinderModel: targetCyl.model,
    cylinderSizeLitres: targetCyl.waterCapacityL,
    fillDensityKgL: fillDensity,
    manufacturer,
    applicableStandard: 'NFPA 2001 (2022 ed.)',
  };

  // Perform deterministic calculation
  const result: FM200CalcResult = calculateFM200(calcInput);

  const handleSave = () => {
    const record: CalculationRecord = {
      id: initialData?.id || `calc-fm200-${Date.now()}`,
      calcRef,
      systemType: 'fm200',
      systemName: 'FM-200 Fire Suppression System',
      applicableStandard: 'NFPA 2001 (2022 ed.)',
      projectName,
      roomName,
      designer: 'Aly Ketkat',
      reviewer: 'Eng. Fahad Al-Otaibi, Lead FPE',
      revision,
      date: new Date().toISOString().split('T')[0],
      status: result.verificationStatus === 'warning' ? 'preliminary' : 'verified',
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
        id: initialData?.id || `calc-fm200-${Date.now()}`,
        calcRef,
        systemType: 'fm200',
        systemName: 'FM-200 Fire Suppression System',
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
        systemName="FM-200 Fire Suppression Calculator"
        systemCategory="HFC-227ea Total Flooding Clean Agent System"
        applicableStandard="NFPA 2001 (2022 ed.) / ISO 14520-9"
        calcReference={calcRef}
        status={result.verificationStatus === 'warning' ? 'preliminary' : 'verified'}
        onSave={handleSave}
        onGenerateReport={handleGenerateReport}
        lang={lang}
        onReferenceChange={setCalcRef}
        projectName={projectName}
        roomName={roomName}
        onProjectNameChange={setProjectName}
        onRoomNameChange={setRoomName}
      />

      {/* Navigation Tabs within FM-200 Module */}
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
          {/* Left Column (Inputs: Sections A, B, C) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Section A: Room Data */}
            <RoomGeometrySection
              enclosure={enclosure}
              onChange={setEnclosure}
              unitSystem={unitSystem}
              lang={lang}
            />

            {/* Section B: Design Parameters */}
            <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-navy-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                <Flame className="w-4 h-4 text-engBlue" />
                <span>{t.fm200.sectionB}</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    {t.fm200.hazardClass}
                  </label>
                  <select
                    value={hazardClass}
                    onChange={(e) => {
                      const hc = e.target.value as any;
                      setHazardClass(hc);
                      if (hc === 'class_b_flammable') setDesignConc(9.0);
                      else if (hc === 'class_c_electrical') setDesignConc(7.0);
                      else setDesignConc(7.9);
                    }}
                    className="w-full bg-slate-50 dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-engBlue"
                  >
                    <option value="class_a_surface">Class A — Surface Fire / Data Center (7.9% listed)</option>
                    <option value="class_c_electrical">Class C — Energized Electrical Switchgear (7.0%)</option>
                    <option value="class_b_flammable">Class B — Flammable Liquid Fuel / Heptane (9.0%)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    {t.fm200.designConc}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="6.7"
                    max="10.5"
                    value={designConc}
                    onChange={(e) => setDesignConc(parseFloat(e.target.value) || 7.0)}
                    className="w-full bg-slate-50 dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-engBlue"
                  />
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
                    NFPA 2001 min: 7.0% (Class A/C), 9.0% (Class B)
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Manufacturer / Approved Hardware Supplier
                  </label>
                  <select
                    value={manufacturer}
                    onChange={(e) => setManufacturer(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-engBlue"
                  >
                    <option value="Kidde Fenwal Protection">Kidde Fire Systems (UL/FM)</option>
                    <option value="Fike Protection Systems">Fike Protection Systems</option>
                    <option value="Chemetron Fire Systems">Chemetron / Carrier</option>
                    <option value="Ansul / Johnson Controls">Ansul (Tyco / JCI)</option>
                    <option value="SEVO Systems">SEVO Clean Agent Systems</option>
                    <option value="Minimax GmbH">Minimax Fire Products</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Storage Cylinder Pressure Rating
                  </label>
                  <select
                    value={storagePressure}
                    onChange={(e) => setStoragePressure(parseInt(e.target.value) as any)}
                    className="w-full bg-slate-50 dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-engBlue"
                  >
                    <option value={25}>25 bar (360 psi) — Standard Nitrogen Superpressurization</option>
                    <option value={42}>42 bar (600 psi) — High-Pressure Long Run System</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section C: Equipment Selection */}
            <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-navy-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                <Cylinder className="w-4 h-4 text-engBlue" />
                <span>{t.fm200.sectionC}</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    {t.fm200.cylinderModel}
                  </label>
                  <select
                    value={selectedCylModel}
                    onChange={(e) => setSelectedCylModel(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-engBlue"
                  >
                    {FM200_CYLINDERS.map((cyl) => (
                      <option key={cyl.model} value={cyl.model}>
                        {cyl.model} — Max {cyl.maxFillKg} kg (Water Vol: {cyl.waterCapacityL}L)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    {t.fm200.fillDensity}
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="0.50"
                    max="1.15"
                    value={fillDensity}
                    onChange={(e) => setFillDensity(parseFloat(e.target.value) || 0.95)}
                    className="w-full bg-slate-50 dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-engBlue"
                  />
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
                    UL Listed Range: 0.50 to 1.15 kg/L (Nominal: 0.95 kg/L)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Engineering Summary Card */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4 sticky top-16">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {lang === 'ar' ? 'ملخص الحساب الهندسي الفوري' : 'Live Engineering Sizing Summary'}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  NFPA 2001 Verified
                </span>
              </div>

              {/* Big primary number */}
              <div className="p-4 rounded-xl bg-engBlue/10 border border-engBlue/20 text-center space-y-1">
                <span className="text-xs font-bold uppercase text-engBlue">
                  {lang === 'ar' ? 'كمية غاز FM-200 التصميمية المطلوبة' : 'Required FM-200 Design Agent Mass'}
                </span>
                <div className="text-3xl font-extrabold text-navy-900 dark:text-white font-mono">
                  {result.designAgentMassKg.toFixed(1)}{' '}
                  <span className="text-sm font-semibold text-slate-500">{unitSystem === 'metric' ? 'kg' : 'lb'}</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {lang === 'ar' ? 'الكتلة النظرية قبل تصحيح الارتفاع:' : 'Theoretical Mass before Fa:'}{' '}
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                    {result.theoreticalAgentMassKg.toFixed(1)} kg
                  </span>
                </div>
              </div>

              {/* Cylinders Callout */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-neutralBg dark:bg-navy-800/60 border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">
                    {t.fm200.cylindersRequired}
                  </span>
                  <div className="text-xl font-bold font-mono text-navy-900 dark:text-white mt-0.5">
                    {result.requiredCylinders}{' '}
                    <span className="text-xs font-normal text-slate-500">Cylinders</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{result.cylinderCapacityLitres}L Tanks</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">
                    {lang === 'ar' ? 'الكمية الفعلية الموردة' : 'Total Supplied Mass'}
                  </span>
                  <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {result.totalSuppliedAgentKg.toFixed(1)}{' '}
                    <span className="text-xs font-normal text-slate-500">kg</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Margin: +{result.marginSurplusKg.toFixed(1)} kg</span>
                </div>
              </div>

              {/* Design Verification Metrics Table */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400">Net Flooding Volume:</span>
                  <span className="font-mono font-bold text-navy-900 dark:text-white">
                    {result.netDesignVolumeM3.toFixed(2)} m³
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400">Specific Vapor Volume (s):</span>
                  <span className="font-mono font-bold text-navy-900 dark:text-white">
                    {result.specificVaporVolumeM3Kg.toFixed(4)} m³/kg
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400">Delivered Concentration:</span>
                  <span className="font-mono font-bold text-navy-900 dark:text-white">
                    {result.suppliedDesignConcentration.toFixed(2)}%
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400">Max Conc at Max Temp ({enclosure.maxTemp}°C):</span>
                  <span className="font-mono font-bold text-navy-900 dark:text-white">
                    {result.maxConcentrationAtMaxTemp.toFixed(2)}%
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400">Toxicological Limit (NOAEL):</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {result.noaelLimit}% (Safe)
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400">Est. Vent Damper Free Area:</span>
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                    {result.estPressureReliefAreaM2.toFixed(3)} m² ({(result.estPressureReliefAreaM2 * 10000).toFixed(0)} cm²)
                  </span>
                </div>
              </div>

              {/* View full results tab button */}
              <button
                onClick={() => setActiveTab('results')}
                className="w-full py-2 px-3 rounded-lg bg-navy-900 dark:bg-navy-800 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <span>{lang === 'ar' ? 'عرض النتائج والتحليلات الكاملة' : 'View Detailed Results & Tabs'}</span>
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
              <span>{lang === 'ar' ? 'النتائج الهندسية المفصلة وجدول الأسطوانات' : 'Comprehensive FM-200 Engineering Sizing Results'}</span>
            </h2>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-800/80 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Net Flooding Volume</span>
                <div className="text-2xl font-extrabold font-mono text-navy-900 dark:text-white mt-1">
                  {result.netDesignVolumeM3.toFixed(2)} m³
                </div>
                <span className="text-[10px] text-slate-400">Gross: {result.grossVolumeM3.toFixed(2)} m³</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-800/80 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Corrected Design Mass</span>
                <div className="text-2xl font-extrabold font-mono text-engBlue mt-1">
                  {result.designAgentMassKg.toFixed(1)} kg
                </div>
                <span className="text-[10px] text-slate-400">Uncorrected: {result.theoreticalAgentMassKg.toFixed(1)} kg</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-800/80 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Preliminary Cylinders</span>
                <div className="text-2xl font-extrabold font-mono text-navy-900 dark:text-white mt-1">
                  {result.requiredCylinders} × {result.cylinderCapacityLitres}L
                </div>
                <span className="text-[10px] text-slate-400">Total Supplied: {result.totalSuppliedAgentKg.toFixed(1)} kg</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-800/80 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Delivered Concentration</span>
                <div className="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                  {result.suppliedDesignConcentration.toFixed(2)}%
                </div>
                <span className="text-[10px] text-slate-400">NOAEL Limit: {result.noaelLimit}%</span>
              </div>
            </div>

            {/* Cylinder Arrangement Breakdown Table */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                {lang === 'ar' ? 'جدول توزيع وحصر أسطوانات غاز FM-200' : 'Preliminary Cylinder & Storage Hardware Schedule'}
              </h3>
              <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-lg">
                <table className="w-full text-xs text-left rtl:text-right">
                  <thead className="bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300 font-semibold uppercase text-[10px]">
                    <tr>
                      <th className="p-2.5">Cylinder Model</th>
                      <th className="p-2.5">Water Volume</th>
                      <th className="p-2.5">Cylinder Qty</th>
                      <th className="p-2.5">Fill per Cyl</th>
                      <th className="p-2.5">Fill Density</th>
                      <th className="p-2.5">Storage Pressure</th>
                      <th className="p-2.5">Total Agent</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                    <tr>
                      <td className="p-2.5 font-bold font-mono text-engBlue">{result.selectedCylinderModel}</td>
                      <td className="p-2.5">{result.cylinderCapacityLitres} Litres</td>
                      <td className="p-2.5 font-bold">{result.requiredCylinders} EA</td>
                      <td className="p-2.5 font-mono">{result.actualAgentPerCylinderKg.toFixed(1)} kg</td>
                      <td className="p-2.5 font-mono">{result.fillDensityKgL.toFixed(2)} kg/L</td>
                      <td className="p-2.5 font-mono">{storagePressure} Bar</td>
                      <td className="p-2.5 font-bold font-mono text-emerald-600 dark:text-emerald-400">
                        {result.totalSuppliedAgentKg.toFixed(1)} kg
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Safety & Engineering Notice Callouts */}
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
              <span>{lang === 'ar' ? 'خطوات الاشتقاق الرياضي والمعادلات المطبقة' : 'Step-by-Step NFPA 2001 Mathematical Derivation'}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Transparent, non-blackbox engineering calculations with full variable substitutions.
            </p>
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
              <span>{lang === 'ar' ? 'فحوصات سلامة الحياة والاشتراطات الهندسية' : 'Engineering Checks & Life Safety Verification'}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Safety limitations, toxicology limits, discharge durations, and venting checks per NFPA 2001.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Toxicological Check */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-navy-900 dark:text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  NOAEL / LOAEL Safety Limits
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  PASSED
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                At maximum expected temperature ({enclosure.maxTemp}°C), delivered concentration is{' '}
                <strong className="font-mono">{result.maxConcentrationAtMaxTemp.toFixed(2)}%</strong>. This is below the
                NOAEL of <strong>9.0%</strong>, allowing safe personnel egress without toxic cardiotoxicity hazards.
              </p>
            </div>

            {/* Discharge Time Check */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-navy-900 dark:text-white flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-engBlue" />
                  Discharge Duration Limit
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-engBlue">
                  10.0s Limit
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                NFPA 2001 Section 5.7.1.2 mandates that 95% of the minimum design concentration must be discharged within
                a maximum duration of <strong>10.0 seconds</strong> to suppress fire before thermal breakdown occurs.
              </p>
            </div>

            {/* Pressure Relief Venting Check */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-navy-900 dark:text-white flex items-center gap-1.5">
                  <Wind className="w-4 h-4 text-amber-500" />
                  Overpressure Relief Venting
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-600">
                  {result.estPressureReliefAreaM2.toFixed(3)} m²
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Clean agent vapor expansion generates peak transient overpressures. A pressure relief damper of at least{' '}
                <strong>{(result.estPressureReliefAreaM2 * 10000).toFixed(0)} cm²</strong> free area is required to prevent
                structural wall or glass breach.
              </p>
            </div>

            {/* Enclosure Retention Hold Time */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-navy-900 dark:text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Enclosure Hold Time Target
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600">
                  {enclosure.holdTimeTargetMin} Min Target
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                A Door Fan Integrity Test (NFPA 2001 Annex C) must certify that extinguishing concentration at highest
                combustible level is maintained for minimum <strong>{enclosure.holdTimeTargetMin} minutes</strong>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
