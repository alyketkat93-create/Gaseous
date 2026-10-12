import React, { useState } from 'react';
import {
  AlertOctagon,
  ShieldAlert,
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
  Volume2,
} from 'lucide-react';
import { EnclosureData, CO2CalcInput, CO2CalcResult, UnitSystem, CalculationRecord } from '../../types';
import { calculateCO2 } from '../../engineering/co2Engine';
import { Language, DICTIONARY } from '../../i18n/translations';
import { RoomGeometrySection } from './common/RoomGeometrySection';
import { CalculatorTopBar } from './common/CalculatorTopBar';

interface CO2CalculatorProps {
  unitSystem: UnitSystem;
  lang: Language;
  initialData?: CalculationRecord;
  onSaveCalculation?: (record: CalculationRecord) => void;
  onNavigateToReport?: (record: CalculationRecord) => void;
}

export const CO2Calculator: React.FC<CO2CalculatorProps> = ({
  unitSystem,
  lang,
  initialData,
  onSaveCalculation,
  onNavigateToReport,
}) => {
  const t = DICTIONARY[lang];

  // Active Tab: 1. Inputs, 2. Results, 3. Method, 4. Checks
  const [activeTab, setActiveTab] = useState<'inputs' | 'results' | 'method' | 'checks'>('inputs');

  // Step 1 Application Mode: Total Flooding vs Local Application
  const [applicationMode, setApplicationMode] = useState<'total_flooding' | 'local_application'>(
    initialData?.inputs?.applicationMode || 'total_flooding'
  );

  // Metadata
  const [projectName, setProjectName] = useState(initialData?.projectName || 'Cairo Metro Substation Vault');
  const [roomName, setRoomName] = useState(initialData?.roomName || 'HV Transformer Vault #1');
  const [calcRef, setCalcRef] = useState(initialData?.calcRef || 'CALC-CO2-2026-003');
  const [revision, setRevision] = useState(initialData?.revision || 'Rev 01');

  // Room geometry
  const [enclosure, setEnclosure] = useState<EnclosureData>(
    initialData?.enclosure || {
      shape: 'rectangular',
      length: 10.0,
      width: 7.0,
      height: 4.0,
      quantity: 1,
      isCombinedEnclosureConfirmed: true,
      hasRaisedFloor: false,
      raisedFloorHeight: 0,
      hasCeilingVoid: false,
      ceilingVoidHeight: 0,
      solidObstructions: 8.0,
      minTemp: 25,
      maxTemp: 45,
      elevation: 50,
      integrityTested: true,
      holdTimeTargetMin: 20,
    }
  );

  // Total Flooding parameters
  const [hazardNature, setHazardNature] = useState<'surface_fire' | 'deep_seated'>(
    initialData?.inputs?.hazardNature || 'deep_seated'
  );
  const [deepSeatedType, setDeepSeatedType] = useState<'electrical' | 'record_storage' | 'fur_storage'>(
    initialData?.inputs?.deepSeatedType || 'electrical'
  );
  const [hasUnclosableOpenings, setHasUnclosableOpenings] = useState<boolean>(
    initialData?.inputs?.hasUnclosableOpenings ?? true
  );
  const [unclosableOpeningsArea, setUnclosableOpeningsArea] = useState<number>(
    initialData?.inputs?.unclosableOpeningsAreaM2 || 0.6
  );

  // Local Application parameters
  const [hazardSurfaceArea, setHazardSurfaceArea] = useState<number>(
    initialData?.inputs?.hazardSurfaceAreaM2 || 12.0
  );
  const [dischargeRate, setDischargeRate] = useState<number>(
    initialData?.inputs?.dischargeRateKgMinM2 || 16.0
  );
  const [localDurationSec, setLocalDurationSec] = useState<number>(
    initialData?.inputs?.localDischargeDurationSec || 30
  );

  const calcInput: CO2CalcInput = {
    applicationMode,
    hazardNature,
    deepSeatedType,
    enclosure,
    hasUnclosableOpenings,
    unclosableOpeningsAreaM2: unclosableOpeningsArea,
    localAppMethod: 'area_method',
    hazardSurfaceAreaM2: hazardSurfaceArea,
    dischargeRateKgMinM2: dischargeRate,
    localDischargeDurationSec: localDurationSec,
    storageType: 'high_pressure',
    cylinderSizeKg: 45,
    applicableStandard: 'NFPA 12 (2022 ed.)',
  };

  const result: CO2CalcResult = calculateCO2(calcInput);

  const handleSave = () => {
    const record: CalculationRecord = {
      id: initialData?.id || `calc-co2-${Date.now()}`,
      calcRef,
      systemType: 'co2',
      systemName: 'Carbon Dioxide (CO2) Fire Suppression System',
      applicableStandard: 'NFPA 12 (2022 ed.)',
      projectName,
      roomName,
      designer: 'Eng. Ahmed Zaki, PE',
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
        id: initialData?.id || `calc-co2-${Date.now()}`,
        calcRef,
        systemType: 'co2',
        systemName: 'Carbon Dioxide (CO2) Fire Suppression System',
        applicableStandard: 'NFPA 12 (2022 ed.)',
        projectName,
        roomName,
        designer: 'Eng. Ahmed Zaki, PE',
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
        systemName="Carbon Dioxide Fire Suppression Calculator"
        systemCategory="High-Pressure / Low-Pressure CO2 Extinguishing System"
        applicableStandard="NFPA 12 (2022 ed.) / ISO 6183"
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

      {/* Prominent Red Safety Notice */}
      <div className="bg-red-50 dark:bg-red-950/40 border-2 border-red-500 rounded-xl p-4 text-red-900 dark:text-red-200 shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <AlertOctagon className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-red-700 dark:text-red-300">
            {lang === 'ar' ? 'تحذير أمان وحياة حرج — خطر الاختناق الفوري (NFPA 12)' : 'Critical Life-Safety Notice — Immediate Asphyxiation Hazard'}
          </h3>
        </div>
        <p className="text-xs leading-relaxed text-red-800 dark:text-red-300">
          {lang === 'ar'
            ? 'تفريغ غاز ثاني أكسيد الكربون (CO2) يخفض تركيز الأكسجين إلى أقل من 10%، مما يسبب الإغماء الفوري والوفاة خلال ثوانٍ معدودة. يُحظر تماماً تصميم أنظمة CO2 في الأماكن المأهولة طبيعياً. يجب تجهيز النظام بصمام إغلاق ميكانيكي (Lockout Valve)، وأجهزة إنذار هوائية مسبقة التفريغ (Pre-Discharge Alarm) مع مهلة زمنية 30 ثانية على الأقل.'
            : 'CO2 extinguishes fires by dropping ambient oxygen below 10%, causing instant asphyxiation, unconsciousness, and fatality within seconds. CO2 total flooding must NEVER be designed for normally occupied enclosures. A mechanical lock-out valve, pneumatic pre-discharge alarms with a minimum 30-second delay, and positive mechanical purge ventilation are mandatory under NFPA 12.'}
        </p>
      </div>

      {/* Step 1 Selector: Total Flooding vs Local Application */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {lang === 'ar' ? 'الخطوة الأولى: تحديد نمط التطبيق' : 'Step 1: Select Application Methodology'}
          </span>
          <span className="text-[10px] font-mono bg-slate-100 dark:bg-navy-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400">
            NFPA 12 Chapter 5 vs Chapter 6
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => setApplicationMode('total_flooding')}
            className={`p-3.5 rounded-xl border text-left rtl:text-right transition cursor-pointer flex items-start gap-3 ${
              applicationMode === 'total_flooding'
                ? 'bg-engBlue/10 border-engBlue text-navy-900 dark:text-white shadow-sm ring-1 ring-engBlue'
                : 'bg-slate-50 dark:bg-navy-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800'
            }`}
          >
            <div className={`p-2 rounded-lg ${applicationMode === 'total_flooding' ? 'bg-engBlue text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs">{t.co2.totalFlooding}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {lang === 'ar' ? 'للغرف المحكمة والمحولات ومخازن الأرشيف' : 'Enclosed rooms, transformer vaults, archive record vaults.'}
              </div>
            </div>
          </button>

          <button
            onClick={() => setApplicationMode('local_application')}
            className={`p-3.5 rounded-xl border text-left rtl:text-right transition cursor-pointer flex items-start gap-3 ${
              applicationMode === 'local_application'
                ? 'bg-engBlue/10 border-engBlue text-navy-900 dark:text-white shadow-sm ring-1 ring-engBlue'
                : 'bg-slate-50 dark:bg-navy-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800'
            }`}
          >
            <div className={`p-2 rounded-lg ${applicationMode === 'local_application' ? 'bg-engBlue text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs">{t.co2.localApplication}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {lang === 'ar' ? 'للمعدات المفتوحة وأحواض التبريد بالزيت والطباعة' : 'Open dip tanks, quench oil, printing presses, isolated machinery.'}
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Navigation Tabs within CO2 Module */}
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
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>4. {t.tabs.checks}</span>
        </button>
      </div>

      {/* Tab 1: Calculation Inputs */}
      {activeTab === 'inputs' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column (Inputs) */}
          <div className="lg:col-span-7 space-y-5">
            {applicationMode === 'total_flooding' ? (
              <>
                {/* Total Flooding Enclosure Geometry */}
                <RoomGeometrySection
                  enclosure={enclosure}
                  onChange={setEnclosure}
                  unitSystem={unitSystem}
                  lang={lang}
                />

                {/* Total Flooding Parameters */}
                <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
                  <h2 className="text-sm font-bold text-navy-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                    <AlertOctagon className="w-4 h-4 text-engBlue" />
                    <span>Total Flooding Design Parameters (NFPA 12 Chapter 5)</span>
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        {t.co2.hazardNature}
                      </label>
                      <select
                        value={hazardNature}
                        onChange={(e) => setHazardNature(e.target.value as any)}
                        className="w-full bg-slate-50 dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-engBlue"
                      >
                        <option value="surface_fire">Surface Fire (Flammable Liquids / Gases - 34% Conc)</option>
                        <option value="deep_seated">Deep-Seated Fire (Electrical, Records, Archives)</option>
                      </select>
                    </div>

                    {hazardNature === 'deep_seated' && (
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                          {t.co2.deepSeatedType}
                        </label>
                        <select
                          value={deepSeatedType}
                          onChange={(e) => setDeepSeatedType(e.target.value as any)}
                          className="w-full bg-slate-50 dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-engBlue"
                        >
                          <option value="electrical">Electrical Equipment / Generators (50% min conc, 1.33 kg/m³)</option>
                          <option value="record_storage">Record Storage / Files / Archives (65% min conc, 2.00 kg/m³)</option>
                          <option value="fur_storage">Fur Storage Vaults (75% min conc, 2.00 kg/m³)</option>
                        </select>
                      </div>
                    )}

                    <div className="sm:col-span-2">
                      <label className="flex items-center gap-2 text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={hasUnclosableOpenings}
                          onChange={(e) => setHasUnclosableOpenings(e.target.checked)}
                          className="rounded text-engBlue focus:ring-engBlue"
                        />
                        <span>Enclosure has Unclosable Openings or Ventilation Dampers</span>
                      </label>
                      {hasUnclosableOpenings && (
                        <div className="mt-2">
                          <label className="block text-[10px] text-slate-500 mb-1">
                            {t.co2.openingsArea} (m²)
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            value={unclosableOpeningsArea}
                            onChange={(e) => setUnclosableOpeningsArea(parseFloat(e.target.value) || 0)}
                            className="w-full sm:w-1/2 bg-slate-50 dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-lg p-1.5 text-xs text-slate-900 dark:text-white"
                          />
                          <span className="text-[10px] text-slate-500 mt-1 block">
                            NFPA 12 Compensation: 5.0 kg/m² per minute of discharge duration.
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* Local Application Inputs */
              <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
                <h2 className="text-sm font-bold text-navy-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                  <Flame className="w-4 h-4 text-engBlue" />
                  <span>Local Application System Parameters (NFPA 12 Chapter 6)</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      {t.co2.hazardArea} (m² or ft²)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="1.0"
                      value={hazardSurfaceArea}
                      onChange={(e) => setHazardSurfaceArea(parseFloat(e.target.value) || 1.0)}
                      className="w-full bg-slate-50 dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-engBlue"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      {t.co2.dischargeRate}
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="16.0"
                      max="20.0"
                      value={dischargeRate}
                      onChange={(e) => setDischargeRate(parseFloat(e.target.value) || 16.0)}
                      className="w-full bg-slate-50 dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-engBlue"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      NFPA 12 Rate-by-Area: 16.0 to 20.0 kg/min/m² (liquid surface)
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      {t.co2.localDuration}
                    </label>
                    <select
                      value={localDurationSec}
                      onChange={(e) => setLocalDurationSec(parseInt(e.target.value) || 30)}
                      className="w-full bg-slate-50 dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-engBlue"
                    >
                      <option value={30}>30 Seconds (Liquid fuels - minimum discharge)</option>
                      <option value={60}>60 Seconds (Solid coated / pre-heated metals)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Live Engineering Summary Card */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4 sticky top-16">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {lang === 'ar' ? 'ملخص حساب ثاني أكسيد الكربون' : 'Live CO2 Sizing Summary'}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30">
                  NFPA 12 Verified
                </span>
              </div>

              {/* Big primary number */}
              <div className="p-4 rounded-xl bg-engBlue/10 border border-engBlue/20 text-center space-y-1">
                <span className="text-xs font-bold uppercase text-engBlue">
                  {lang === 'ar' ? 'إجمالي كمية غاز CO2 المطلوبة' : 'Total Required CO2 Agent Mass'}
                </span>
                <div className="text-3xl font-extrabold text-navy-900 dark:text-white font-mono">
                  {result.totalRequiredCO2Kg.toFixed(1)}{' '}
                  <span className="text-sm font-semibold text-slate-500">{unitSystem === 'metric' ? 'kg' : 'lb'}</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Base Mass: <span className="font-mono font-bold">{result.baseCO2MassKg.toFixed(1)} kg</span> | Openings Leakage: <span className="font-mono font-bold">{result.leakageOpeningCompensationKg.toFixed(1)} kg</span>
                </div>
              </div>

              {/* Cylinders Callout */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-neutralBg dark:bg-navy-800/60 border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">
                    {t.co2.cylinders45kg}
                  </span>
                  <div className="text-xl font-bold font-mono text-navy-900 dark:text-white mt-0.5">
                    {result.requiredCylinders45Kg}{' '}
                    <span className="text-xs font-normal text-slate-500">Cylinders</span>
                  </div>
                  <span className="text-[10px] text-slate-500">45 kg (68L) Standard Steel Tanks</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">
                    {lang === 'ar' ? 'الكمية الفعلية الموردة' : 'Supplied CO2 Mass'}
                  </span>
                  <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {result.suppliedCO2MassKg.toFixed(1)}{' '}
                    <span className="text-xs font-normal text-slate-500">kg</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Storage: 58 bar (850 psi)</span>
                </div>
              </div>

              {/* Metrics Breakdown */}
              <div className="space-y-2 text-xs">
                {applicationMode === 'total_flooding' && (
                  <>
                    <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-600 dark:text-slate-400">Net Enclosure Volume:</span>
                      <span className="font-mono font-bold text-navy-900 dark:text-white">
                        {result.netVolumeM3.toFixed(2)} m³
                      </span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-600 dark:text-slate-400">Volume Flooding Factor:</span>
                      <span className="font-mono font-bold text-navy-900 dark:text-white">
                        {result.basicFloodingFactorKgM3.toFixed(2)} kg/m³
                      </span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-600 dark:text-slate-400">Design Concentration:</span>
                      <span className="font-mono font-bold text-red-600 dark:text-red-400">
                        {result.calculatedConcentrationPercent}% (LETHAL)
                      </span>
                    </div>
                  </>
                )}

                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400">Discharge Duration:</span>
                  <span className="font-mono font-bold text-navy-900 dark:text-white">
                    {result.dischargeTimeLimitSeconds} seconds
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400">Life-Safety Classification:</span>
                  <span className="font-mono font-bold text-red-600 dark:text-red-400">
                    Immediately Lethal
                  </span>
                </div>
              </div>

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
              <span>{lang === 'ar' ? 'نتائج حساب ثاني أكسيد الكربون وحصر الأسطوانات' : 'CO2 Sizing Breakdown & Storage Schedule'}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-800/80 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Application Mode</span>
                <div className="text-lg font-bold font-mono text-navy-900 dark:text-white mt-1">
                  {result.applicationMode === 'total_flooding' ? 'Total Flooding' : 'Local Application'}
                </div>
                <span className="text-[10px] text-slate-400">NFPA 12 Standard</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-800/80 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Required CO2</span>
                <div className="text-2xl font-extrabold font-mono text-engBlue mt-1">
                  {result.totalRequiredCO2Kg.toFixed(1)} kg
                </div>
                <span className="text-[10px] text-slate-400">Base: {result.baseCO2MassKg.toFixed(1)} kg</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-800/80 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Cylinders (45 kg)</span>
                <div className="text-2xl font-extrabold font-mono text-navy-900 dark:text-white mt-1">
                  {result.requiredCylinders45Kg} EA
                </div>
                <span className="text-[10px] text-slate-400">Supplied: {result.suppliedCO2MassKg.toFixed(1)} kg</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-800/80 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Discharge Duration</span>
                <div className="text-2xl font-extrabold font-mono text-amber-600 mt-1">
                  {result.dischargeTimeLimitSeconds}s
                </div>
                <span className="text-[10px] text-slate-400">Soaking Time</span>
              </div>
            </div>

            {/* Cylinder Arrangement Breakdown Table */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                {lang === 'ar' ? 'جدول أسطوانات ثاني أكسيد الكربون عالية الضغط' : 'High-Pressure CO2 Cylinder Bank Specification'}
              </h3>
              <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-lg">
                <table className="w-full text-xs text-left rtl:text-right">
                  <thead className="bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300 font-semibold uppercase text-[10px]">
                    <tr>
                      <th className="p-2.5">Storage Cylinder Type</th>
                      <th className="p-2.5">Nominal Agent Fill</th>
                      <th className="p-2.5">Water Volume</th>
                      <th className="p-2.5">Cylinder Count</th>
                      <th className="p-2.5">Working Pressure</th>
                      <th className="p-2.5">Total Supplied Agent</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                    <tr>
                      <td className="p-2.5 font-bold font-mono text-engBlue">Seamless Steel DOT-3AA / ISO 9809</td>
                      <td className="p-2.5">45.0 kg (100 lb)</td>
                      <td className="p-2.5">67.5 Litres</td>
                      <td className="p-2.5 font-bold">{result.requiredCylinders45Kg} EA</td>
                      <td className="p-2.5 font-mono">58 bar (850 psi @ 21°C)</td>
                      <td className="p-2.5 font-bold font-mono text-emerald-600 dark:text-emerald-400">
                        {result.suppliedCO2MassKg.toFixed(1)} kg
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Life Safety Measures Checklist */}
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/60 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-400 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-600" />
                Mandatory NFPA 12 Life-Safety Safeguards Checklist
              </span>
              <ul className="space-y-2 text-xs text-red-900 dark:text-red-200">
                {result.mandatoryLifeSafetyMeasures.map((measure, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <span>{measure}</span>
                  </li>
                ))}
              </ul>
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
              <span>Step-by-Step NFPA 12 Calculation Equations</span>
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
              <ShieldAlert className="w-5 h-5 text-red-500" />
              <span>CO2 Life-Safety Protocols & Room Integrity Review</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-red-300 dark:border-red-900/60 bg-red-50 dark:bg-red-950/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-900 dark:text-red-300 flex items-center gap-1.5">
                  <AlertOctagon className="w-4 h-4 text-red-600" />
                  Life Safety Lockout Protocol
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-red-100 dark:bg-red-900/80 text-red-700 dark:text-red-300">
                  MANDATORY
                </span>
              </div>
              <p className="text-xs text-red-800 dark:text-red-300">
                A lock-out valve supervised by the fire alarm control panel must isolate the cylinder manifold whenever
                maintenance personnel enter the protected vault.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-navy-900 dark:text-white flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-engBlue" />
                  Pre-Discharge Alarm Delay
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-engBlue">
                  30s Minimum
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                NFPA 12 mandates pneumatic time delay before release to permit evacuation of all occupants upon detection.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
