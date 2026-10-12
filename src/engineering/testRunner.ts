/**
 * FIRECALC PRO - Automated Engineering Verification Test Suite
 * Validates physics formulas, boundary conditions, unit conversions, and known code examples.
 */

import { calculateEnclosureVolume, getAltitudeCorrectionFactor } from './enclosureEngine';
import { calculateCleanAgent } from './cleanAgentEngine';
import { calculateInertGas } from './inertGasEngine';
import { calculateCO2 } from './co2Engine';
import { calculateAerosol } from './aerosolEngine';
import { calculateFoam } from './foamEngine';
import { calculatePressureReliefAndIntegrity } from './ventingIntegrity';

interface TestCaseResult {
  testName: string;
  passed: boolean;
  expected: string;
  actual: string;
  details?: string;
}

export function runEngineeringVerificationTests(): { passedCount: number; totalCount: number; results: TestCaseResult[] } {
  const results: TestCaseResult[] = [];

  // 1. Altitude Correction Factor at Sea Level vs Riyadh
  const fa_seaLevel = getAltitudeCorrectionFactor(0);
  results.push({
    testName: 'Atmospheric Altitude Factor at Sea Level (0m)',
    passed: fa_seaLevel === 1.0,
    expected: '1.0',
    actual: fa_seaLevel.toString(),
  });

  const fa_riyadh = getAltitudeCorrectionFactor(612);
  const passRiyadh = fa_riyadh >= 0.925 && fa_riyadh <= 0.935;
  results.push({
    testName: 'NFPA 2001 Altitude Factor for Riyadh (612m)',
    passed: passRiyadh,
    expected: '~0.929',
    actual: fa_riyadh.toString(),
  });

  // 2. FK-5-1-12 Specific Vapor Volume & Mass Verification
  const testEnclosure = {
    shape: 'rectangular' as const,
    length: 10,
    width: 10,
    height: 3, // 300 m3
    quantity: 1,
    hasRaisedFloor: false,
    raisedFloorHeight: 0,
    hasCeilingVoid: false,
    ceilingVoidHeight: 0,
    solidObstructions: 0,
    minTemp: 20,
    maxTemp: 32,
    elevation: 0,
    integrityTested: true,
    holdTimeTargetMin: 10,
  };

  const fkCalc = calculateCleanAgent({
    agent: 'fk5112',
    enclosure: testEnclosure,
    hazardClass: 'class_a_surface',
    designConcentration: 5.3,
    safetyFactorPercent: 20,
    cylinderStoragePressureBar: 42,
    cylinderSizeLitres: 140,
    fillDensityKgL: 0.95,
    pipingStatus: 'preliminary',
  });

  // Specific volume at 20°C: s = 0.0664 + 0.000274*20 = 0.07188
  // Theoretical mass: (300 / 0.07188) * (5.3 / 94.7) = 4173.6 * 0.055966 = ~233.58 kg
  const passFK = Math.abs(fkCalc.designAgentMassKg - 233.58) < 2.0;
  results.push({
    testName: 'FK-5-1-12 Mass Calculation (300m³ at 20°C, 5.3% Conc)',
    passed: passFK,
    expected: '233.58 kg (±2kg)',
    actual: `${fkCalc.designAgentMassKg} kg (s = ${fkCalc.specificVaporVolumeM3Kg} m³/kg)`,
  });

  // 3. FM-200 (HFC-227ea) Mass Verification
  const fmCalc = calculateCleanAgent({
    agent: 'hfc227ea',
    enclosure: testEnclosure,
    hazardClass: 'class_a_surface',
    designConcentration: 7.0,
    safetyFactorPercent: 20,
    cylinderStoragePressureBar: 25,
    cylinderSizeLitres: 140,
    fillDensityKgL: 0.90,
    pipingStatus: 'preliminary',
  });

  // Specific volume at 20°C: s = 0.1269 + 0.000513*20 = 0.13716
  // Theoretical mass: (300 / 0.13716) * (7.0 / 93.0) = 2187.2 * 0.075268 = ~164.63 kg
  const passFM = Math.abs(fmCalc.designAgentMassKg - 164.63) < 2.0;
  results.push({
    testName: 'HFC-227ea Mass Calculation (300m³ at 20°C, 7.0% Conc)',
    passed: passFM,
    expected: '164.63 kg (±2kg)',
    actual: `${fmCalc.designAgentMassKg} kg (s = ${fmCalc.specificVaporVolumeM3Kg} m³/kg)`,
  });

  // 4. Inert Gas (IG-541) Residual Oxygen Check
  const inertCalc = calculateInertGas({
    gasType: 'inert_ig541',
    enclosure: testEnclosure,
    hazardClass: 'class_a_surface',
    designConcentration: 38.0,
    storagePressureBar: 300,
    cylinderSizeLitres: 80,
    manufacturer: 'Ansul Inergen',
    applicableStandard: 'NFPA 2001 (2022 ed.)',
  });

  // Expected residual oxygen: ~ 12.9% - 13.0%
  const passO2 = inertCalc.postDischargeOxygenPercent >= 12.0 && inertCalc.postDischargeOxygenPercent <= 14.0;
  results.push({
    testName: 'IG-541 Post-Discharge Oxygen Physiological Range (38% Conc)',
    passed: passO2,
    expected: '12.0% - 14.0% (Safe Egress Window)',
    actual: `${inertCalc.postDischargeOxygenPercent}% (Status: ${inertCalc.oxygenSafetyStatus})`,
  });

  // 5. NFPA 12 Carbon Dioxide Deep-Seated Flooding Factor
  const co2Calc = calculateCO2({
    applicationMode: 'total_flooding',
    hazardNature: 'deep_seated',
    deepSeatedType: 'electrical',
    enclosure: testEnclosure,
    hasUnclosableOpenings: false,
    unclosableOpeningsAreaM2: 0,
    storageType: 'high_pressure',
    cylinderSizeKg: 45,
    applicableStandard: 'NFPA 12 (2022 ed.)',
  });

  // Base flooding factor for 300 m3 deep seated electrical = 0.80 kg/m3 (NFPA 12)
  // Expected mass = 300 * 0.80 = 240 kg
  const passCO2 = co2Calc.basicFloodingFactorKgM3 === 0.80 && co2Calc.baseCO2MassKg === 240;
  results.push({
    testName: 'NFPA 12 Deep-Seated Electrical Flooding Factor (300m³)',
    passed: passCO2,
    expected: '0.80 kg/m³ -> 240.0 kg Base Mass',
    actual: `${co2Calc.basicFloodingFactorKgM3} kg/m³ -> ${co2Calc.baseCO2MassKg} kg (${co2Calc.requiredCylinders45Kg} Cylinders)`,
  });

  // 6. NFPA 2010 Condensed Aerosol Equation
  const aeroCalc = calculateAerosol({
    enclosure: testEnclosure,
    hazardClass: 'class_a_surface',
    designApplicationDensityGM3: 85,
    safetyFactor: 1.3,
    heightDistributionFactor: 1.0,
    unclosableOpeningsLeakageFactor: 1.0,
    generatorModel: 'FirePro FP-3000',
    generatorCapacityGrams: 3000,
    manufacturer: 'FirePro',
    applicableStandard: 'NFPA 2010 (2020 ed.)',
  });

  // M = 300 m3 * 85 g/m3 * 1.3 = 33,150 grams = 33.15 kg
  const passAero = aeroCalc.totalAerosolMassKg === 33.15 && aeroCalc.requiredGeneratorsCount === Math.ceil(33150 / 3000); // 12 units
  results.push({
    testName: 'NFPA 2010 Condensed Aerosol Mass & Unit Quantity',
    passed: passAero,
    expected: '33.15 kg -> 12 FP-3000 Units',
    actual: `${aeroCalc.totalAerosolMassKg} kg -> ${aeroCalc.requiredGeneratorsCount} Units`,
  });

  // 7. NFPA 11 Foam Solution Flow Rate & SFFF Bladder Tank Reserve
  const foamCalc = calculateFoam({
    applicationType: 'bund_spill',
    hazardType: 'hydrocarbon',
    protectedAreaM2: 200,
    foamConcentrateType: 'sfff_fluorine_free',
    proportionPercent: 3,
    applicationRateLMinM2: 4.1,
    dischargeDurationMinutes: 30,
    systemOperatingPressureBar: 8,
    manufacturer: 'National Foam',
    applicableStandard: 'NFPA 11 (2021 ed.)',
  });

  // Q_sol = 200 * 4.1 = 820 L/min
  // Total solution = 820 * 30 = 24,600 L
  // Concentrate = 24,600 * 0.03 = 738 L
  const passFoam = foamCalc.foamSolutionFlowRateLMin === 820 && foamCalc.requiredFoamConcentrateLitres === 738;
  results.push({
    testName: 'NFPA 11 Foam Solution Rate & 3% SFFF Concentrate Demand',
    passed: passFoam,
    expected: '820.0 L/min -> 738 L Concentrate',
    actual: `${foamCalc.foamSolutionFlowRateLMin} L/min -> ${foamCalc.requiredFoamConcentrateLitres} L (Bladder Tank: ${foamCalc.recommendedBladderTankCapacityLitres} L)`,
  });

  const passedCount = results.filter(r => r.passed).length;
  return {
    passedCount,
    totalCount: results.length,
    results,
  };
}
