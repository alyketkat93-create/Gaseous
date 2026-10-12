import React, { useState } from 'react';
import {
  Waves,
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
  Droplets,
  Flame,
  Leaf,
  Container,
} from 'lucide-react';
import { FoamCalcInput, FoamCalcResult, UnitSystem, CalculationRecord, EnclosureData } from '../../types';
import { calculateFoam, STANDARD_BLADDER_TANKS } from '../../engineering/foamEngine';
import { Language, DICTIONARY } from '../../i18n/translations';
import { CalculatorTopBar } from './common/CalculatorTopBar';

interface FoamCalculatorProps {
  unitSystem: UnitSystem;
  lang: Language;
  initialData?: CalculationRecord;
  onSaveCalculation?: (record: CalculationRecord) => void;
  onNavigateToReport?: (record: CalculationRecord) => void;
}

export const FoamCalculator: React.FC<FoamCalculatorProps> = ({
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
  const [projectName, setProjectName] = useState(initialData?.projectName || 'Jeddah Bulk Fuel Storage Terminal');
  const [roomName, setRoomName] = useState(initialData?.roomName || 'Diesel Storage Tank TK-102 & Dike Bund');
  const [calcRef, setCalcRef] = useState(initialData?.calcRef || 'CALC-FOAM-2026-006');
  const [revision, setRevision] = useState(initialData?.revision || 'Rev 01');

  // Foam Application Selection
  const [applicationType, setApplicationType] = useState<FoamCalcInput['applicationType']>(
    initialData?.inputs?.applicationType || 'fixed_foam_chamber'
  );
  const [hazardType, setHazardType] = useState<'hydrocarbon' | 'polar_solvent'>(
    initialData?.inputs?.hazardType || 'hydrocarbon'
  );
  const [protectedArea, setProtectedArea] = useState<number>(
    initialData?.inputs?.protectedAreaM2 || 314.16
  );
  const [tankDiameter, setTankDiameter] = useState<number>(
    initialData?.inputs?.tankDiameterMeters || 20.0
  );
  const [isCircularTank, setIsCircularTank] = useState<boolean>(true);

  // Foam Chemistry & Sizing
  const [foamConcentrateType, setFoamConcentrateType] = useState<FoamCalcInput['foamConcentrateType']>(
    initialData?.inputs?.foamConcentrateType || 'sfff_fluorine_free'
  );
  const [proportionPercent, setProportionPercent] = useState<number>(
    initialData?.inputs?.proportionPercent || 3.0
  );
  const [applicationRate, setApplicationRate] = useState<number>(
    initialData?.inputs?.applicationRateLMinM2 || 4.1
  );
  const [dischargeDuration, setDischargeDuration] = useState<number>(
    initialData?.inputs?.dischargeDurationMinutes || 55
  );
  const [operatingPressure, setOperatingPressure] = useState<number>(
    initialData?.inputs?.systemOperatingPressureBar || 7.0
  );
  const [manufacturer, setManufacturer] = useState<string>(
    initialData?.inputs?.manufacturer || 'Angus Fire / National Foam'
  );

  // If circular tank diameter is modified, update protectedArea
  const handleTankDiameterChange = (diam: number) => {
    setTankDiameter(diam);
    if (diam > 0) {
      const area = Math.PI * Math.pow(diam / 2, 2);
      setProtectedArea(Math.round(area * 100) / 100);
    }
  };

  const calcInput: FoamCalcInput = {
    applicationType,
    hazardType,
    tankDiameterMeters: isCircularTank ? tankDiameter : undefined,
    protectedAreaM2: protectedArea,
    foamConcentrateType,
    proportionPercent,
    applicationRateLMinM2: applicationRate,
    dischargeDurationMinutes: dischargeDuration,
    systemOperatingPressureBar: operatingPressure,
    manufacturer,
    applicableStandard: 'NFPA 11 (2021 ed.) / NFPA 16',
  };

  const result: FoamCalcResult = calculateFoam(calcInput);

  const handleApplicationTypeChange = (type: FoamCalcInput['applicationType']) => {
    setApplicationType(type);
    if (type === 'fixed_foam_chamber') {
      setIsCircularTank(true);
      setApplicationRate(4.1);
      setDischargeDuration(55);
    } else if (type === 'bund_spill') {
      setIsCircularTank(false);
      setApplicationRate(hazardType === 'polar_solvent' ? 6.5 : 4.1);
      setDischargeDuration(15);
    } else if (type === 'foam_water_sprinkler') {
      setIsCircularTank(false);
      setApplicationRate(6.5);
      setDischargeDuration(10);
    } else if (type === 'spray_deluge') {
      setIsCircularTank(false);
      setApplicationRate(6.5);
      setDischargeDuration(10);
    } else if (type === 'sub_surface') {
      setIsCircularTank(true);
      setApplicationRate(4.1);
      setDischargeDuration(55);
    }
  };

  const handleSave = () => {
    const dummyEnclosure: EnclosureData = {
      shape: 'rectangular',
      length: 20,
      width: 20,
      height: 10,
      quantity: 1,
      hasRaisedFloor: false,
      raisedFloorHeight: 0,
      hasCeilingVoid: false,
      ceilingVoidHeight: 0,
      solidObstructions: 0,
      minTemp: 20,
      maxTemp: 45,
      elevation: 0,
      integrityTested: true,
      holdTimeTargetMin: 30,
    };

    const record: CalculationRecord = {
      id: initialData?.id || `calc-foam-${Date.now()}`,
      calcRef,
      systemType: 'foam',
      systemName: `Foam System (${result.applicationDescription})`,
      applicableStandard: 'NFPA 11 (2021 ed.)',
      projectName,
      roomName,
      designer: 'Aly Ketkat',
      reviewer: 'Eng. Fahad Al-Otaibi, Lead FPE',
      revision,
      date: new Date().toISOString().split('T')[0],
      status: 'verified',
      unitSystem,
      roomConfirmedSingleEnclosure: true,
      enclosure: dummyEnclosure,
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
      const dummyEnclosure: EnclosureData = {
        shape: 'rectangular',
        length: 20,
        width: 20,
        height: 10,
        quantity: 1,
        hasRaisedFloor: false,
        raisedFloorHeight: 0,
        hasCeilingVoid: false,
        ceilingVoidHeight: 0,
        solidObstructions: 0,
        minTemp: 20,
        maxTemp: 45,
        elevation: 0,
        integrityTested: true,
        holdTimeTargetMin: 30,
      };

      const record: CalculationRecord = {
        id: initialData?.id || `calc-foam-${Date.now()}`,
        calcRef,
        systemType: 'foam',
        systemName: `Foam System (${result.applicationDescription})`,
        applicableStandard: 'NFPA 11 (2021 ed.)',
        projectName,
        roomName,
        designer: 'Aly Ketkat',
        reviewer: 'Eng. Fahad Al-Otaibi, Lead FPE',
        revision,
        date: new Date().toISOString().split('T')[0],
        status: 'verified',
        unitSystem,
        roomConfirmedSingleEnclosure: true,
        enclosure: dummyEnclosure,
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
        systemName="Foam Fire Suppression Calculator"
        systemCategory="Low & Medium Expansion Foam System (NFPA 11 / 16)"
        applicableStandard="NFPA 11 (2021 ed.) / NFPA 30"
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

      {/* Engineering Principle Notice */}
      <div className="p-4 rounded-xl bg-blue-50 dark:bg-navy-900 border border-blue-200 dark:border-blue-800/60 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-3 shadow-sm">
        <Info className="w-5 h-5 text-engBlue shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-extrabold text-sm block">
            {lang === 'ar' ? 'مبدأ التصميم الهندسي لأنظمة الرغوة (NFPA 11):' : 'Foam Sizing Engineering Principle:'}
          </span>
          <p className="leading-relaxed">
            {lang === 'ar'
              ? 'تعتمد حسابات أنظمة الرغوة على مساحة السطح المعرض للخطر، ومعدل التطبيق الهيدروليكي (L/min/m²)، ومدة التفريغ، ونسبة الخلط (Proportioning %)، وليس على حجم الغرفة بمفرده.'
              : 'Foam system requirements are strictly based on protected surface area, minimum application rate (L/min/m²), discharge duration, and proportioning percentage, rather than enclosure room volume alone.'}
          </p>
        </div>
      </div>

      {/* Step 1: Application Selector */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {t.foam.applicationType}
          </span>
          <span className="text-[10px] font-mono bg-slate-100 dark:bg-navy-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400">
            NFPA 11 / NFPA 16
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {[
            { id: 'fixed_foam_chamber' as const, name: 'Tank Foam Chamber', sub: 'Cone Roof Tanks' },
            { id: 'bund_spill' as const, name: 'Dike / Spill Area', sub: 'Bund Protection' },
            { id: 'foam_water_sprinkler' as const, name: 'Foam-Water Sprinkler', sub: 'NFPA 16 Closed Head' },
            { id: 'spray_deluge' as const, name: 'Spray Deluge System', sub: 'Open Nozzles' },
            { id: 'sub_surface' as const, name: 'Sub-Surface Injection', sub: 'Hydrocarbon Tanks' },
          ].map((app) => {
            const isSelected = applicationType === app.id;
            return (
              <button
                key={app.id}
                onClick={() => handleApplicationTypeChange(app.id)}
                className={`p-3 rounded-lg border text-left rtl:text-right transition cursor-pointer ${
                  isSelected
                    ? 'bg-engBlue/10 border-engBlue text-navy-900 dark:text-white ring-1 ring-engBlue'
                    : 'bg-slate-50 dark:bg-navy-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800'
                }`}
              >
                <div className="font-extrabold text-xs">{app.name}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{app.sub}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Tabs within Foam Module */}
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
            {/* Surface Area & Hazard Geometry Card */}
            <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-navy-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                <Container className="w-4 h-4 text-engBlue" />
                <span>Protected Hazard Area & Geometry</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    {t.foam.hazardType}
                  </label>
                  <select
                    value={hazardType}
                    onChange={(e) => {
                      const ht = e.target.value as any;
                      setHazardType(ht);
                      if (ht === 'polar_solvent') {
                        setFoamConcentrateType('ar_afff_3x3');
                        setProportionPercent(3.0);
                        setApplicationRate(6.5);
                      } else {
                        setApplicationRate(4.1);
                      }
                    }}
                    className="w-full bg-slate-50 dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-engBlue"
                  >
                    <option value="hydrocarbon">Hydrocarbon Liquid (Diesel, Crude, Jet A-1, Gas)</option>
                    <option value="polar_solvent">Polar Solvent (Methanol, Ethanol, Acetone)</option>
                  </select>
                </div>

                {isCircularTank ? (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      {t.foam.tankDiameter} (m)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="1.0"
                      value={tankDiameter}
                      onChange={(e) => handleTankDiameterChange(parseFloat(e.target.value) || 1.0)}
                      className="w-full bg-slate-50 dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-engBlue"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Auto-Calculated Area: {protectedArea.toFixed(2)} m²
                    </span>
                  </div>
                ) : (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      {t.foam.protectedArea} (m²)
                    </label>
                    <input
                      type="number"
                      step="5"
                      min="1.0"
                      value={protectedArea}
                      onChange={(e) => setProtectedArea(parseFloat(e.target.value) || 1.0)}
                      className="w-full bg-slate-50 dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-engBlue"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Foam Chemistry & Discharge Parameters Card */}
            <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-navy-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                <Droplets className="w-4 h-4 text-engBlue" />
                <span>Foam Proportioning & Discharge Rate Parameters</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    {t.foam.concentrateType}
                  </label>
                  <select
                    value={foamConcentrateType}
                    onChange={(e) => setFoamConcentrateType(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-engBlue"
                  >
                    <option value="sfff_fluorine_free">Synthetic Fluorine-Free Foam (SFFF) — 100% PFAS-Free</option>
                    <option value="ar_afff_3x3">Alcohol-Resistant AR-AFFF (3% × 3%)</option>
                    <option value="afff_3">AFFF 3% Standard Film-Forming</option>
                    <option value="afff_1">AFFF 1% High-Efficiency Concentrate</option>
                    <option value="afff_6">AFFF 6% Legacy Concentrate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    {t.foam.proportionPercent}
                  </label>
                  <select
                    value={proportionPercent}
                    onChange={(e) => setProportionPercent(parseFloat(e.target.value) || 3.0)}
                    className="w-full bg-slate-50 dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-engBlue"
                  >
                    <option value={1.0}>1.0% Concentrate Proportioning</option>
                    <option value={3.0}>3.0% Standard Proportioning</option>
                    <option value={6.0}>6.0% Legacy Proportioning</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    {t.foam.applicationRate}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="2.0"
                    max="15.0"
                    value={applicationRate}
                    onChange={(e) => setApplicationRate(parseFloat(e.target.value) || 4.1)}
                    className="w-full bg-slate-50 dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-engBlue"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">NFPA 11 min: 4.1 L/min/m² (Hydrocarbon)</span>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    {t.foam.duration}
                  </label>
                  <input
                    type="number"
                    step="5"
                    min="10"
                    max="65"
                    value={dischargeDuration}
                    onChange={(e) => setDischargeDuration(parseInt(e.target.value) || 30)}
                    className="w-full bg-slate-50 dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-engBlue"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Tank: 30-55 min | Spill: 10-15 min</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Engineering Summary Card */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4 sticky top-16">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Live Foam Hydraulic Summary
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  NFPA 11 Sizing
                </span>
              </div>

              {/* Big primary number: Foam Solution Flow Rate */}
              <div className="p-4 rounded-xl bg-engBlue/10 border border-engBlue/20 text-center space-y-1">
                <span className="text-xs font-bold uppercase text-engBlue">Required Foam Solution Flow Rate</span>
                <div className="text-3xl font-extrabold text-navy-900 dark:text-white font-mono">
                  {result.foamSolutionFlowRateLMin.toFixed(0)}{' '}
                  <span className="text-sm font-semibold text-slate-500">L/min</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Equivalent: <span className="font-mono font-bold text-navy-900 dark:text-white">{result.foamSolutionFlowRateGPM.toFixed(0)} GPM</span> at {operatingPressure} bar
                </div>
              </div>

              {/* Concentrate & Water Demands */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-neutralBg dark:bg-navy-800/60 border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-500 block font-medium">Foam Concentrate</span>
                  <div className="text-xl font-bold font-mono text-navy-900 dark:text-white mt-0.5">
                    {result.requiredFoamConcentrateLitres}{' '}
                    <span className="text-xs font-normal text-slate-500">L</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{proportionPercent}% proportion</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 block font-medium">Firewater Demand</span>
                  <div className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-0.5">
                    {(result.requiredWaterVolumeLitres / 1000).toFixed(1)}{' '}
                    <span className="text-xs font-normal text-slate-500">m³</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{result.requiredWaterVolumeLitres.toLocaleString()} Litres</span>
                </div>
              </div>

              {/* Bladder Tank Selection */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800/60 space-y-1.5">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Recommended Bladder Tank Model (+10% Reserve)
                </span>
                <div className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                  {result.recommendedBladderTankCapacityLitres} Litres Capacity
                </div>
                <span className="text-[11px] text-slate-600 dark:text-slate-300 block">
                  Vertical/Horizontal ASME Code Pressure Vessel with internal rubber diaphragm.
                </span>
              </div>

              {/* Metrics table */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400">Total Solution Demand:</span>
                  <span className="font-mono font-bold text-navy-900 dark:text-white">
                    {result.totalFoamSolutionLitres.toLocaleString()} Litres
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400">Discharge Duration:</span>
                  <span className="font-mono font-bold text-navy-900 dark:text-white">
                    {result.totalDischargeDurationMinutes} minutes
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400">Proportioning Device:</span>
                  <span className="font-mono font-bold text-engBlue">
                    Ratio Controller / ILBP
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
              <span>Foam System Bill of Quantities & Bladder Tank Sizing</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-800/80 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Protected Area</span>
                <div className="text-2xl font-extrabold font-mono text-navy-900 dark:text-white mt-1">
                  {result.protectedAreaM2.toFixed(1)} m²
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-800/80 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Solution Flow Rate</span>
                <div className="text-2xl font-extrabold font-mono text-engBlue mt-1">
                  {result.foamSolutionFlowRateLMin.toFixed(0)} L/min
                </div>
                <span className="text-[10px] text-slate-400">({result.foamSolutionFlowRateGPM.toFixed(0)} GPM)</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-800/80 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Concentrate Volume</span>
                <div className="text-2xl font-extrabold font-mono text-navy-900 dark:text-white mt-1">
                  {result.requiredFoamConcentrateLitres} L
                </div>
                <span className="text-[10px] text-slate-400">+10% reserve</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-800/80 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Water Volume Demand</span>
                <div className="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                  {(result.requiredWaterVolumeLitres / 1000).toFixed(1)} m³
                </div>
                <span className="text-[10px] text-slate-400">{result.requiredWaterVolumeLitres} Litres</span>
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
              <span>Step-by-Step NFPA 11 Foam Hydraulic Equations</span>
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
              <span>Foam Hydraulic Balance & Environmental Suitability</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-navy-900 dark:text-white flex items-center gap-1.5">
                  <Leaf className="w-4 h-4 text-emerald-500" />
                  PFAS / Environmental Compliance
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600">
                  SFFF Ready
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {result.environmentalSuitabilityNote}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-navy-900 dark:text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-engBlue" />
                  Hydraulic Pressure Balance
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-engBlue">
                  ΔP ≤ 0.5 Bar
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                A ratio controller requires accurate water and foam pressure matching. Complete pipe friction loss analysis
                is required to ensure proper proportioning across the minimum to maximum flow regime.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
