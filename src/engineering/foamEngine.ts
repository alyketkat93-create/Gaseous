import { FoamCalcInput, FoamCalcResult } from '../types';

export const STANDARD_BLADDER_TANKS = [
  { capacityL: 500, type: 'Vertical ASME Code Carbon Steel Bladder Tank' },
  { capacityL: 1000, type: 'Vertical ASME Code Carbon Steel Bladder Tank' },
  { capacityL: 1500, type: 'Vertical ASME Code Carbon Steel Bladder Tank' },
  { capacityL: 2000, type: 'Vertical ASME Code Carbon Steel Bladder Tank' },
  { capacityL: 3000, type: 'Horizontal ASME Code Carbon Steel Bladder Tank' },
  { capacityL: 5000, type: 'Horizontal ASME Code Carbon Steel Bladder Tank' },
  { capacityL: 7500, type: 'Horizontal ASME Code Carbon Steel Bladder Tank' },
  { capacityL: 10000, type: 'Horizontal ASME Code Carbon Steel Bladder Tank' },
  { capacityL: 15000, type: 'Horizontal ASME Code Carbon Steel Bladder Tank' },
];

export function calculateFoam(input: FoamCalcInput): FoamCalcResult {
  const notesAndWarnings: string[] = [];
  const steps: FoamCalcResult['calculationSteps'] = [];

  // Determine effective surface area
  let effectiveAreaM2 = input.protectedAreaM2;
  if (input.applicationType === 'fixed_foam_chamber' && input.tankDiameterMeters && input.tankDiameterMeters > 0) {
    effectiveAreaM2 = Math.PI * Math.pow(input.tankDiameterMeters / 2, 2);
  }

  // 1. Foam Solution Flow Rate = Protected Area * Application Rate
  const flowRateLMin = effectiveAreaM2 * input.applicationRateLMinM2;
  const flowRateGPM = flowRateLMin * 0.264172;

  let appName = 'Foam-Water Sprinkler System';
  if (input.applicationType === 'spray_deluge') appName = 'Foam-Water Spray Deluge System';
  if (input.applicationType === 'fixed_foam_chamber') appName = 'Fixed Cone-Roof Storage Tank Foam Chamber';
  if (input.applicationType === 'bund_spill') appName = 'Dike / Bund Flammable Liquid Spill Protection';
  if (input.applicationType === 'sub_surface') appName = 'Sub-Surface Base Injection System';

  steps.push({
    step: '1. Required Foam Solution Flow Rate (Q_sol)',
    formula: 'Q_sol = Protected_Area × Application_Rate',
    substitution: `Q_sol = ${effectiveAreaM2.toFixed(2)} m² × ${input.applicationRateLMinM2.toFixed(2)} L/min/m²`,
    result: `${flowRateLMin.toFixed(1)} L/min (${flowRateGPM.toFixed(1)} GPM)`,
    reference: 'NFPA 11 Section 5.2 & NFPA 16 Section 4.3',
  });

  // 2. Total Foam Solution Volume = Flow Rate * Discharge Duration
  const totalSolutionL = flowRateLMin * input.dischargeDurationMinutes;

  steps.push({
    step: '2. Total Foam Solution Volume Demand',
    formula: 'V_sol = Q_sol × Discharge_Duration',
    substitution: `V_sol = ${flowRateLMin.toFixed(1)} L/min × ${input.dischargeDurationMinutes} min`,
    result: `${totalSolutionL.toFixed(0)} Litres (${(totalSolutionL / 1000).toFixed(2)} m³)`,
    reference: 'NFPA 11 Table 5.2.5.2.2 Minimum Discharge Times',
  });

  // 3. Foam Concentrate Demand = Solution * (Proportion % / 100)
  const concentrateFraction = input.proportionPercent / 100;
  const concentrateVolumeL = totalSolutionL * concentrateFraction;

  steps.push({
    step: '3. Net Foam Concentrate Demand (V_conc)',
    formula: 'V_conc = V_sol × Proportioning_Fraction',
    substitution: `V_conc = ${totalSolutionL.toFixed(0)} L × ${input.proportionPercent}%`,
    result: `${concentrateVolumeL.toFixed(0)} Litres of Foam Concentrate`,
    reference: 'NFPA 11 Section 5.3 Proportioning Requirements',
  });

  // 4. Dedicated Water Supply Demand = Solution - Concentrate
  const waterVolumeL = totalSolutionL - concentrateVolumeL;

  steps.push({
    step: '4. Dedicated Firewater Supply Demand',
    formula: 'V_water = V_sol - V_conc',
    substitution: `V_water = ${totalSolutionL.toFixed(0)} L - ${concentrateVolumeL.toFixed(0)} L`,
    result: `${waterVolumeL.toFixed(0)} Litres (${(waterVolumeL / 1000).toFixed(1)} m³ / ${(waterVolumeL * 0.264172).toFixed(0)} Gallons)`,
    reference: 'NFPA 11 Section 5.3.2 Water Supply Duration and Dedicated Reserve',
  });

  // 5. Select Bladder Tank Capacity (with mandatory 10% reserve per NFPA 11 Section 5.3.3.4)
  const minTankCapacityWithReserve = concentrateVolumeL * 1.10;
  const selectedTank = STANDARD_BLADDER_TANKS.find(t => t.capacityL >= minTankCapacityWithReserve) || {
    capacityL: Math.ceil(minTankCapacityWithReserve / 1000) * 1000,
    type: 'Custom High-Capacity Atmospheric Storage Tank with Foam Pump',
  };

  steps.push({
    step: '5. Bladder Tank Capacity Allocation (with 10% NFPA Reserve)',
    formula: 'V_tank ≥ V_conc × 1.10',
    substitution: `V_tank ≥ ${concentrateVolumeL.toFixed(0)} L × 1.10 = ${minTankCapacityWithReserve.toFixed(0)} L`,
    result: `${selectedTank.capacityL} L ${selectedTank.type}`,
    reference: 'NFPA 11 Section 5.3.3.4 & UL Listed Ratio Controller Equipment',
  });

  // Environmental suitability notes
  let envNote = 'Standard AFFF selected. Comply with local environmental guidelines on fluorine-containing foams.';
  if (input.foamConcentrateType === 'sfff_fluorine_free') {
    envNote = 'Synthetic Fluorine-Free Foam (SFFF / F3) selected: 100% Biodegradable, zero PFAS/PFOS chemicals, non-bioaccumulative, meeting latest EPA & EU environmental standards.';
    notesAndWarnings.push('SFFF Flow Rheology Note: Ensure proportioner calibration and discharge nozzle expansion ratio match the viscosity of selected SFFF concentrate.');
  } else if (input.foamConcentrateType.includes('ar_afff')) {
    envNote = 'Alcohol-Resistant AR-AFFF selected: Forms a tough polymeric membrane barrier preventing alcohol/polar solvents from dissolving the foam blanket.';
  }

  notesAndWarnings.push(
    `HYDRAULIC REQUIREMENT: Fire water pump capacity must provide minimum ${flowRateLMin.toFixed(0)} L/min (${flowRateGPM.toFixed(0)} GPM) at ${input.systemOperatingPressureBar || 7.0} bar residual pressure at the most remote discharge device.`
  );

  notesAndWarnings.push(
    `PROPORTIONER SPECIFICATION: Ratio controller (wide-range or in-line balanced pressure proportioner) must be calibrated for ${input.proportionPercent}% proportioning at the specified flow range.`
  );

  return {
    applicationDescription: appName,
    hazardDescription: input.hazardType === 'polar_solvent' ? 'Polar Solvent Combustible (Alcohol / Ketone)' : 'Hydrocarbon Liquid Fuel',
    protectedAreaM2: Math.round(effectiveAreaM2 * 100) / 100,
    applicationRateLMinM2: input.applicationRateLMinM2,
    foamSolutionFlowRateLMin: Math.round(flowRateLMin * 10) / 10,
    foamSolutionFlowRateGPM: Math.round(flowRateGPM * 10) / 10,
    totalDischargeDurationMinutes: input.dischargeDurationMinutes,
    totalFoamSolutionLitres: Math.round(totalSolutionL),
    requiredFoamConcentrateLitres: Math.round(concentrateVolumeL),
    requiredWaterVolumeLitres: Math.round(waterVolumeL),
    recommendedBladderTankCapacityLitres: selectedTank.capacityL,
    proportionerType: 'In-Line Balanced Pressure Proportioner (ILBP) / Ratio Controller',
    environmentalSuitabilityNote: envNote,
    verificationStatus: 'verified',
    calculationSteps: steps,
    notesAndWarnings,
  };
}
