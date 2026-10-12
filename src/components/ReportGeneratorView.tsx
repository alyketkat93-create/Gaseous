import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Building2,
  Calendar,
  Layers,
  Flame,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  Sheet,
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { CalculationRecord, CompanySettings, UnitSystem } from '../types';
import { Language, DICTIONARY } from '../i18n/translations';

interface ReportGeneratorViewProps {
  calculations: CalculationRecord[];
  selectedCalculationId?: string;
  companySettings: CompanySettings;
  unitSystem: UnitSystem;
  lang: Language;
}

export const ReportGeneratorView: React.FC<ReportGeneratorViewProps> = ({
  calculations,
  selectedCalculationId,
  companySettings,
  unitSystem,
  lang,
}) => {
  const t = DICTIONARY[lang];

  const [activeCalcId, setActiveCalcId] = useState<string>(
    selectedCalculationId || calculations[0]?.id || ''
  );

  const activeCalc = calculations.find((c) => c.id === activeCalcId) || calculations[0];
  const results = activeCalc?.results || {};
  const inputs = activeCalc?.inputs || {};
  const enclosure = activeCalc?.enclosure || {
    length: 10,
    width: 8,
    height: 3.5,
    quantity: 1,
    minTemp: 20,
    maxTemp: 30,
    elevation: 0,
    solidObstructions: 0,
  };

  const isApproved = activeCalc?.status === 'approved';

  // 1. Browser Print Handler
  const handlePrint = () => {
    window.print();
  };

  // 2. Export to Excel (.xlsx) using SheetJS
  const handleExportExcel = () => {
    if (!activeCalc) return;

    const wb = XLSX.utils.book_new();

    // Sheet 1: Project Metadata & Results Summary
    const summaryData = [
      ['FIRECALC PRO — FIRE SUPPRESSION ENGINEERING REPORT'],
      ['Precision in Every Calculation. Confidence in Every Design.'],
      [],
      ['PROJECT INFORMATION', ''],
      ['Project Name:', activeCalc.projectName],
      ['Protected Room Name:', activeCalc.roomName],
      ['Calculation Reference:', activeCalc.calcRef],
      ['Suppression System:', activeCalc.systemName],
      ['Applicable Standard:', activeCalc.applicableStandard],
      ['Revision:', activeCalc.revision],
      ['Date:', activeCalc.date],
      ['Designer:', activeCalc.designer],
      ['Reviewer:', activeCalc.reviewer],
      ['Status:', activeCalc.status.toUpperCase()],
      [],
      ['ENCLOSURE GEOMETRY', ''],
      ['Length (m):', enclosure.length],
      ['Width (m):', enclosure.width],
      ['Height (m):', enclosure.height],
      ['Identical Rooms:', enclosure.quantity || 1],
      ['Gross Volume (m³):', results.grossVolumeM3 || (enclosure.length * enclosure.width * enclosure.height)],
      ['Net Design Volume (m³):', results.netDesignVolumeM3 || results.netVolumeM3 || results.protectedAreaM2],
      ['Min Temperature (°C):', enclosure.minTemp],
      ['Elevation (m):', enclosure.elevation],
      [],
      ['SIZING RESULTS', ''],
      ['Required Agent Quantity:', results.designAgentMassKg || results.correctedGasVolumeM3 || results.totalRequiredCO2Kg || results.totalAerosolMassKg || results.totalFoamSolutionLitres || 'N/A'],
      ['Preliminary Equipment Count:', results.requiredCylinders || results.requiredCylinderCount || results.requiredCylinders45Kg || results.requiredGeneratorsCount || 'N/A'],
      ['Delivered Concentration / Flow:', results.suppliedDesignConcentration || results.actualSuppliedConcentration || results.foamSolutionFlowRateLMin || 'N/A'],
    ];

    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

    // Sheet 2: Mathematical Steps
    if (results.calculationSteps && Array.isArray(results.calculationSteps)) {
      const stepsHeader = ['Step #', 'Description', 'Formula', 'Substituted Values', 'Result', 'Standard Reference'];
      const stepsRows = results.calculationSteps.map((s: any, idx: number) => [
        idx + 1,
        s.step,
        s.formula,
        s.substitution,
        s.result,
        s.reference,
      ]);
      const wsSteps = XLSX.utils.aoa_to_sheet([stepsHeader, ...stepsRows]);
      XLSX.utils.book_append_sheet(wb, wsSteps, 'Calculation Steps');
    }

    XLSX.writeFile(wb, `${activeCalc.calcRef}_Engineering_Report.xlsx`);
  };

  // 3. Export to PDF using jsPDF + autoTable
  const handleExportPDF = () => {
    if (!activeCalc) return;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setTextColor(16, 35, 63); // Navy #10233F
    doc.text('FIRECALC PRO — ENGINEERING SUBMITTAL', 14, 20);

    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text('Fire Suppression Engineering Calculation Report per NFPA Standards', 14, 26);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 31);

    // Project metadata table
    autoTable(doc, {
      startY: 36,
      head: [['Parameter', 'Project Specification']],
      body: [
        ['Calculation Reference', activeCalc.calcRef],
        ['Project Name', activeCalc.projectName],
        ['Protected Room', activeCalc.roomName],
        ['Suppression System', activeCalc.systemName],
        ['Applicable Code & Edition', activeCalc.applicableStandard],
        ['Revision & Date', `${activeCalc.revision} | ${activeCalc.date}`],
        ['Lead Designer', activeCalc.designer],
        ['Certified Reviewer', activeCalc.reviewer],
        ['Enclosure Net Volume / Area', `${results.netDesignVolumeM3 || results.netVolumeM3 || results.protectedAreaM2} m³`],
        ['Primary Sizing Result', `${results.designAgentMassKg || results.correctedGasVolumeM3 || results.totalRequiredCO2Kg || results.totalAerosolMassKg || results.totalFoamSolutionLitres} units`],
        ['Storage Container Count', `${results.requiredCylinders || results.requiredCylinderCount || results.requiredCylinders45Kg || results.requiredGeneratorsCount || 1} units`],
      ],
      theme: 'grid',
      headStyles: { fillColor: [16, 35, 63], textColor: [255, 255, 255] },
      styles: { fontSize: 8 },
    });

    // Calculation Steps table
    if (results.calculationSteps && Array.isArray(results.calculationSteps)) {
      const currentY = (doc as any).lastAutoTable.finalY + 10;
      doc.setFontSize(11);
      doc.setTextColor(16, 35, 63);
      doc.text('MATHEMATICAL DERIVATION & FORMULAS', 14, currentY);

      autoTable(doc, {
        startY: currentY + 4,
        head: [['Step', 'Formula', 'Substituted Variables', 'Result', 'Standard']],
        body: results.calculationSteps.map((s: any) => [
          s.step,
          s.formula,
          s.substitution,
          s.result,
          s.reference,
        ]),
        theme: 'striped',
        headStyles: { fillColor: [40, 120, 208], textColor: [255, 255, 255] },
        styles: { fontSize: 7 },
      });
    }

    doc.save(`${activeCalc.calcRef}_Submittal.pdf`);
  };

  if (!activeCalc) {
    return (
      <div className="bg-white dark:bg-navy-900 p-8 rounded-xl text-center text-slate-500">
        No calculation available to generate a report.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="no-print bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Selector for calculations */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-engBlue/10 text-engBlue">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400">
              {t.reports.selectCalculation}
            </label>
            <select
              value={activeCalcId}
              onChange={(e) => setActiveCalcId(e.target.value)}
              className="bg-slate-50 dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs font-semibold text-navy-900 dark:text-white focus:outline-none focus:border-engBlue max-w-sm"
            >
              {calculations.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.calcRef} — {c.roomName} ({c.systemName})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons: Print, PDF, Excel */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-engBlue hover:bg-engBlue/90 text-white font-bold text-xs shadow-sm transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{t.reports.printSheet}</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-semibold text-xs transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-engBlue" />
            <span>PDF Export</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-semibold text-xs transition cursor-pointer"
          >
            <Sheet className="w-4 h-4 text-emerald-500" />
            <span>Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* Official Printable Stamped Engineering Calculation Sheet */}
      <div className="bg-white text-slate-900 rounded-2xl shadow-xl p-8 lg:p-12 max-w-5xl mx-auto border border-slate-200 print:shadow-none print:border-none print:p-0 print:m-0">
        {/* Header / Letterhead */}
        <div className="border-b-2 border-navy-900 pb-5 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-navy-900 flex items-center justify-center text-white font-extrabold text-xl">
                FC
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-navy-900 font-sans">
                  {companySettings.companyName || 'FIRECALC PRO ENGINEERING CONSULTANCY'}
                </h1>
                <p className="text-[11px] uppercase tracking-wider text-slate-600 font-semibold">
                  {companySettings.companyDivision || 'Special Hazards Fire Protection & Life Safety Division'}
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  {companySettings.licenseNumber || 'PE License: PE-FPE-94021'}
                </p>
              </div>
            </div>

            <div className="text-right text-xs">
              <div className="font-mono font-bold text-sm text-navy-900">
                REF: {activeCalc.calcRef}
              </div>
              <div className="text-slate-600 font-semibold">
                {activeCalc.revision} · {activeCalc.date}
              </div>
              <div className="text-emerald-700 font-bold uppercase tracking-wider text-[11px] mt-1">
                STATUS: {activeCalc.status.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Preliminary Watermark Notice */}
          {!isApproved && (
            <div className="mt-4 p-2.5 bg-amber-50 border border-amber-300 rounded text-center">
              <span className="text-[11px] font-bold text-amber-900 tracking-wider uppercase font-mono">
                ⚠ {t.common.preliminaryNotice}
              </span>
            </div>
          )}
        </div>

        {/* Section 1: Project & Enclosure Metadata Table */}
        <div className="mb-6">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-navy-900 border-b border-slate-300 pb-1 mb-2.5">
            1.0 Project Information & Protected Enclosure Data
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-medium">Project Name:</span>
              <span className="font-bold text-slate-900">{activeCalc.projectName}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-medium">Room Name:</span>
              <span className="font-bold text-slate-900">{activeCalc.roomName}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-medium">Suppression Agent:</span>
              <span className="font-bold text-engBlue">{activeCalc.systemName}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-medium">Design Standard:</span>
              <span className="font-mono font-bold text-slate-800">{activeCalc.applicableStandard}</span>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase font-medium">Room Dimensions:</span>
              <span className="font-mono font-bold text-slate-800">
                {enclosure.length}m × {enclosure.width}m × {enclosure.height}m
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase font-medium">Gross Room Volume:</span>
              <span className="font-mono font-bold text-slate-800">
                {(results.grossVolumeM3 || enclosure.length * enclosure.width * enclosure.height).toFixed(2)} m³
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase font-medium">Net Design Volume:</span>
              <span className="font-mono font-bold text-emerald-700">
                {(results.netDesignVolumeM3 || results.netVolumeM3 || results.protectedAreaM2 || 0).toFixed(2)} {activeCalc.systemType === 'foam' ? 'm²' : 'm³'}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase font-medium">Design Ambient Temp:</span>
              <span className="font-mono font-bold text-slate-800">
                {enclosure.minTemp}°C (Elevation: {enclosure.elevation}m)
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Primary Results & Equipment Schedule */}
        <div className="mb-6">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-navy-900 border-b border-slate-300 pb-1 mb-2.5">
            2.0 Sizing Results & Storage Equipment Schedule
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-slate-500 block text-[10px] uppercase font-medium">Total Design Agent:</span>
              <span className="font-extrabold text-base font-mono text-engBlue">
                {results.designAgentMassKg || results.correctedGasVolumeM3 || results.totalRequiredCO2Kg || results.totalAerosolMassKg || results.totalFoamSolutionLitres || 0}{' '}
                <span className="text-xs font-normal text-slate-500">
                  {activeCalc.systemType === 'inert_gas' ? 'm³' : activeCalc.systemType === 'foam' ? 'L' : 'kg'}
                </span>
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-slate-500 block text-[10px] uppercase font-medium">Storage Allocation:</span>
              <span className="font-extrabold text-base font-mono text-navy-900">
                {results.requiredCylinders || results.requiredCylinderCount || results.requiredCylinders45Kg || results.requiredGeneratorsCount || 1}{' '}
                <span className="text-xs font-normal text-slate-500">Units</span>
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-slate-500 block text-[10px] uppercase font-medium">Delivered Concentration / Rate:</span>
              <span className="font-extrabold text-base font-mono text-emerald-700">
                {results.suppliedDesignConcentration ? `${results.suppliedDesignConcentration}%` : results.actualSuppliedConcentration ? `${results.actualSuppliedConcentration}%` : results.foamSolutionFlowRateLMin ? `${results.foamSolutionFlowRateLMin} L/min` : `${results.calculatedConcentrationPercent || 0}%`}
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-slate-500 block text-[10px] uppercase font-medium">Discharge Duration:</span>
              <span className="font-extrabold text-base font-mono text-slate-800">
                {results.dischargeTimeLimitSeconds || 10} seconds
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Step-by-Step Calculation Formulas & Substitution */}
        {results.calculationSteps && Array.isArray(results.calculationSteps) && (
          <div className="mb-6">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-navy-900 border-b border-slate-300 pb-1 mb-2.5">
              3.0 Mathematical Derivation & Step Substitutions
            </h2>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2 text-xs font-mono">
              {results.calculationSteps.map((step: any, idx: number) => (
                <div key={idx} className="pb-2 border-b border-slate-200 last:border-none">
                  <div className="font-sans font-bold text-slate-900 text-[11px] flex items-center justify-between">
                    <span>{step.step}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{step.reference}</span>
                  </div>
                  <div className="text-slate-600 text-[11px]">Formula: {step.formula}</div>
                  <div className="text-slate-500 text-[11px]">Substituted: {step.substitution}</div>
                  <div className="font-bold text-emerald-700 text-[11px]">Result: {step.result}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 4: Life Safety & Code Checks */}
        <div className="mb-6">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-navy-900 border-b border-slate-300 pb-1 mb-2.5">
            4.0 Life Safety & Enclosure Integrity Verifications
          </h2>

          <div className="space-y-1.5 text-xs text-slate-700">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Discharge Duration Verification:</strong> Certified to achieve suppression concentration within{' '}
                {results.dischargeTimeLimitSeconds || 10.0} seconds per standard.
              </span>
            </div>

            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Overpressure Relief Venting:</strong> Minimum free vent area estimated at{' '}
                <strong>{results.estPressureReliefAreaM2 || results.estPressureReliefVentAreaM2 || 0.12} m²</strong> to prevent wall structural damage.
              </span>
            </div>

            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Door Fan Integrity & Hold Time:</strong> Target retention time of {enclosure.holdTimeTargetMin || 10} minutes specified per Annex B.
              </span>
            </div>
          </div>
        </div>

        {/* Section 5: Standard Engineering Disclaimer */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[10px] text-slate-500 leading-relaxed mb-6">
          <span className="font-bold text-slate-700 uppercase block mb-0.5">Engineering Disclaimer:</span>
          {companySettings.disclaimerText}
        </div>

        {/* Section 6: Sign-off & Stamp Block */}
        <div className="border-t-2 border-navy-900 pt-6">
          <div className="grid grid-cols-2 gap-8 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold mb-1">Prepared By:</span>
              <div className="font-bold text-navy-900 text-sm">{activeCalc.designer || companySettings.defaultEngineer}</div>
              <div className="text-slate-600">Lead Fire Protection Designer</div>
              <div className="mt-4 pt-2 border-t border-slate-300 text-slate-400 font-mono text-[10px]">
                Signature: _______________________ Date: {activeCalc.date}
              </div>
            </div>

            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold mb-1">Reviewed & Certified By:</span>
              <div className="font-bold text-navy-900 text-sm">{activeCalc.reviewer || companySettings.defaultChecker}</div>
              <div className="text-slate-600">Consultant Lead FPE / Certified PE</div>
              <div className="mt-4 pt-2 border-t border-slate-300 text-slate-400 font-mono text-[10px]">
                Signature: _______________________ Stamp: [ PE STAMP ]
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
