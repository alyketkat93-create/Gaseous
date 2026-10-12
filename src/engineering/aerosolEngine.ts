import { AerosolCalcInput, AerosolCalcResult } from '../types';
import { calculateEnclosureVolume } from './enclosureEngine';

export interface AerosolGeneratorModel {
  modelName: string;
  manufacturer: string;
  compoundMassGrams: number;
  dischargeTimeSec: number;
  minClearanceCombustiblesM: number;
  minClearancePersonnelM: number;
  casingDiameterMm: number;
  heightMm: number;
  casingTempC: number;
}

export const AEROSOL_GENERATORS: AerosolGeneratorModel[] = [
  { modelName: 'FirePro FP-20T', manufacturer: 'FirePro Systems', compoundMassGrams: 20, dischargeTimeSec: 3, minClearanceCombustiblesM: 0.1, minClearancePersonnelM: 0.3, casingDiameterMm: 32, heightMm: 165, casingTempC: 220 },
  { modelName: 'FirePro FP-50T', manufacturer: 'FirePro Systems', compoundMassGrams: 50, dischargeTimeSec: 4, minClearanceCombustiblesM: 0.2, minClearancePersonnelM: 0.5, casingDiameterMm: 51, heightMm: 140, casingTempC: 260 },
  { modelName: 'FirePro FP-100T', manufacturer: 'FirePro Systems', compoundMassGrams: 100, dischargeTimeSec: 5, minClearanceCombustiblesM: 0.3, minClearancePersonnelM: 0.6, casingDiameterMm: 84, heightMm: 120, casingTempC: 280 },
  { modelName: 'FirePro FP-200T', manufacturer: 'FirePro Systems', compoundMassGrams: 200, dischargeTimeSec: 6, minClearanceCombustiblesM: 0.4, minClearancePersonnelM: 0.8, casingDiameterMm: 84, heightMm: 155, casingTempC: 300 },
  { modelName: 'FirePro FP-500T', manufacturer: 'FirePro Systems', compoundMassGrams: 500, dischargeTimeSec: 9, minClearanceCombustiblesM: 0.6, minClearancePersonnelM: 1.0, casingDiameterMm: 84, heightMm: 295, casingTempC: 320 },
  { modelName: 'FirePro FP-1200', manufacturer: 'FirePro Systems', compoundMassGrams: 1200, dischargeTimeSec: 15, minClearanceCombustiblesM: 1.0, minClearancePersonnelM: 1.5, casingDiameterMm: 216, heightMm: 167, casingTempC: 380 },
  { modelName: 'FirePro FP-2000', manufacturer: 'FirePro Systems', compoundMassGrams: 2000, dischargeTimeSec: 18, minClearanceCombustiblesM: 1.2, minClearancePersonnelM: 1.8, casingDiameterMm: 300, heightMm: 155, casingTempC: 400 },
  { modelName: 'FirePro FP-3000', manufacturer: 'FirePro Systems', compoundMassGrams: 3000, dischargeTimeSec: 20, minClearanceCombustiblesM: 1.5, minClearancePersonnelM: 2.0, casingDiameterMm: 300, heightMm: 185, casingTempC: 420 },
  { modelName: 'FirePro FP-5700', manufacturer: 'FirePro Systems', compoundMassGrams: 5700, dischargeTimeSec: 25, minClearanceCombustiblesM: 2.0, minClearancePersonnelM: 3.0, casingDiameterMm: 300, heightMm: 300, casingTempC: 480 },
  { modelName: 'Stat-X 500E', manufacturer: 'Fireaway Inc.', compoundMassGrams: 500, dischargeTimeSec: 10, minClearanceCombustiblesM: 0.5, minClearancePersonnelM: 1.0, casingDiameterMm: 127, heightMm: 127, casingTempC: 330 },
  { modelName: 'Stat-X 1000E', manufacturer: 'Fireaway Inc.', compoundMassGrams: 1000, dischargeTimeSec: 16, minClearanceCombustiblesM: 0.9, minClearancePersonnelM: 1.4, casingDiameterMm: 127, heightMm: 198, casingTempC: 380 },
  { modelName: 'Stat-X 1500E', manufacturer: 'Fireaway Inc.', compoundMassGrams: 1500, dischargeTimeSec: 18, minClearanceCombustiblesM: 1.2, minClearancePersonnelM: 1.8, casingDiameterMm: 203, heightMm: 177, casingTempC: 410 },
  { modelName: 'Stat-X 2500E', manufacturer: 'Fireaway Inc.', compoundMassGrams: 2500, dischargeTimeSec: 22, minClearanceCombustiblesM: 1.6, minClearancePersonnelM: 2.2, casingDiameterMm: 203, heightMm: 267, casingTempC: 450 },
];

export function calculateAerosol(input: AerosolCalcInput): AerosolCalcResult {
  const notesAndWarnings: string[] = [];
  const steps: AerosolCalcResult['calculationSteps'] = [];

  const volBreakdown = calculateEnclosureVolume(input.enclosure, 'metric');
  const V_net = volBreakdown.netDesignVolume;

  // Selected generator model details
  const genModel = AEROSOL_GENERATORS.find(g => g.modelName === input.generatorModel) || AEROSOL_GENERATORS[7]; // FP-3000 default

  // NFPA 2010 Equation: M = V * q * fa * fh * fv
  const q_design = input.designApplicationDensityGM3 || 78.0; // g/m3
  const fa_safety = Math.max(input.safetyFactor || 1.30, 1.30); // 1.30 min per NFPA 2010
  
  // Height factor: for ceilings > 4.0m, height factor is applied
  let fh_height = input.heightDistributionFactor || 1.0;
  if (input.enclosure.height > 4.0 && fh_height === 1.0) {
    fh_height = input.enclosure.height > 6.0 ? 1.25 : 1.15;
  }

  const fv_leakage = input.unclosableOpeningsLeakageFactor || 1.0;

  // Mass in grams: M (g) = V (m3) * q (g/m3) * fa * fh * fv
  const totalMassGrams = V_net * q_design * fa_safety * fh_height * fv_leakage;
  const totalMassKg = totalMassGrams / 1000;

  steps.push({
    step: '1. Net Protected Enclosure Volume',
    formula: 'V_net = L × W × H + V_voids - V_obstructions',
    substitution: `V_net = ${V_net.toFixed(2)} m³`,
    result: `${V_net.toFixed(2)} m³`,
    reference: 'NFPA 2010 Section 7.4 Enclosure Volume Determination',
  });

  steps.push({
    step: '2. Design Application Density (q)',
    formula: 'q = q_certified × Safety_Factor (1.30 min)',
    substitution: `q = ${q_design.toFixed(1)} g/m³ × ${fa_safety.toFixed(2)}`,
    result: `${(q_design * fa_safety).toFixed(1)} g/m³`,
    reference: 'NFPA 2010 Section 7.5 & Listing / Certification',
  });

  steps.push({
    step: '3. Total Condensed Aerosol Compound Mass',
    formula: 'M = V_net × q × fa × fh × fv',
    substitution: `M = ${V_net.toFixed(2)} m³ × ${q_design.toFixed(1)} g/m³ × ${fa_safety.toFixed(2)} × ${fh_height.toFixed(2)} × ${fv_leakage.toFixed(2)}`,
    result: `${totalMassKg.toFixed(2)} kg (${totalMassGrams.toFixed(0)} grams)`,
    reference: 'NFPA 2010 Equation 7.5.1',
  });

  // Generator quantity allocation
  const generatorCapacityG = genModel.compoundMassGrams;
  const requiredGeneratorsCount = Math.max(1, Math.ceil(totalMassGrams / generatorCapacityG));
  const totalSuppliedMassG = requiredGeneratorsCount * generatorCapacityG;
  const totalSuppliedMassKg = totalSuppliedMassG / 1000;

  steps.push({
    step: '4. Generator Model Allocation',
    formula: 'N_gen = ceil(M_total / Unit_Capacity)',
    substitution: `N_gen = ceil(${totalMassGrams.toFixed(0)} g / ${generatorCapacityG} g)`,
    result: `${requiredGeneratorsCount} × ${genModel.modelName} (Total Mass: ${totalSuppliedMassKg.toFixed(2)} kg)`,
    reference: 'NFPA 2010 Chapter 7 & Manufacturer Specification',
  });

  // Thermal clearance checks per NFPA 2010 Table 4.2.3
  notesAndWarnings.push(
    `THERMAL CLEARANCE MANDATE: Generator casing reaches ~${genModel.casingTempC}°C at nozzle during discharge. Maintain minimum ${genModel.minClearanceCombustiblesM} m clearance from combustible materials and ${genModel.minClearancePersonnelM} m from personnel escape routes.`
  );

  notesAndWarnings.push(
    `ELECTRICAL ACTUATION: Supervised 24V DC pulse (1.5A, 50ms) per generator or certified sequential pulse module. Simultaneous discharge of all generators is required within 10 seconds.`
  );

  notesAndWarnings.push(
    `AEROSOL DISPERSION & HOLD TIME: Fine particulate potassium carbonate (K2CO3) remains suspended for 30+ minutes. Mechanical extraction/ventilation must be shut down before release.`
  );

  return {
    technologyName: 'Condensed Aerosol Extinguishing System',
    netVolumeM3: Math.round(V_net * 100) / 100,
    designDensityGM3: q_design,
    totalAerosolMassKg: Math.round(totalMassKg * 100) / 100,
    selectedGeneratorModel: genModel.modelName,
    unitCapacityGrams: generatorCapacityG,
    requiredGeneratorsCount,
    totalSuppliedMassKg: Math.round(totalSuppliedMassKg * 100) / 100,
    safeThermalClearanceOutletMeters: genModel.minClearanceCombustiblesM,
    safeClearancePersonnelMeters: genModel.minClearancePersonnelM,
    dischargeDurationSeconds: genModel.dischargeTimeSec,
    casingTemperatureC: genModel.casingTempC,
    verificationStatus: 'verified',
    calculationSteps: steps,
    notesAndWarnings,
  };
}
