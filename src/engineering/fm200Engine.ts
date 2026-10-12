import { FM200CalcInput, FM200CalcResult } from '../types';
import { calculateEnclosureVolume } from './enclosureEngine';

export interface FM200CylinderSpec {
  model: string;
  waterCapacityL: number;
  tareWeightKg: number;
  maxFillKg: number;
  minFillKg: number;
  workingPressureBar: number;
}

export const FM200_CYLINDERS: FM200CylinderSpec[] = [
  { model: 'FM-CYL-052L (25 Bar)', waterCapacityL: 52, tareWeightKg: 42, minFillKg: 26.0, maxFillKg: 59.8, workingPressureBar: 25 },
  { model: 'FM-CYL-106L (25 Bar)', waterCapacityL: 106, tareWeightKg: 78, minFillKg: 53.0, maxFillKg: 121.9, workingPressureBar: 25 },
  { model: 'FM-CYL-147L (25 Bar)', waterCapacityL: 147, tareWeightKg: 105, minFillKg: 73.5, maxFillKg: 169.0, workingPressureBar: 25 },
  { model: 'FM-CYL-180L (25 Bar)', waterCapacityL: 180, tareWeightKg: 135, minFillKg: 90.0, maxFillKg: 207.0, workingPressureBar: 25 },
  { model: 'FM-CYL-343L (25 Bar)', waterCapacityL: 343, tareWeightKg: 230, minFillKg: 171.5, maxFillKg: 394.4, workingPressureBar: 25 },
  { model: 'FM-CYL-450L (25 Bar)', waterCapacityL: 450, tareWeightKg: 295, minFillKg: 225.0, maxFillKg: 517.5, workingPressureBar: 25 },
  { model: 'FM-CYL-140L (42 Bar High-Pressure)', waterCapacityL: 140, tareWeightKg: 118, minFillKg: 70.0, maxFillKg: 161.0, workingPressureBar: 42 },
  { model: 'FM-CYL-180L (42 Bar High-Pressure)', waterCapacityL: 180, tareWeightKg: 152, minFillKg: 90.0, maxFillKg: 207.0, workingPressureBar: 42 },
];

export function calculateFM200(input: FM200CalcInput): FM200CalcResult {
  const notesAndWarnings: string[] = [];
  const steps: FM200CalcResult['calculationSteps'] = [];

  // Physical constants for HFC-227ea per NFPA 2001 (2022 Table 5.5.1)
  const k1 = 0.1269;
  const k2 = 0.000513;
  const noael = 9.0;
  const loael = 10.5;

  // 1. Enclosure Geometry & Volume Derivation
  const volBreakdown = calculateEnclosureVolume(input.enclosure, 'metric');
  const V_gross = volBreakdown.grossVolume;
  const V_net = volBreakdown.netDesignVolume;
  const T_min = input.enclosure.minTemp;
  const T_max = input.enclosure.maxTemp || T_min + 15;
  const Fa = volBreakdown.altitudeCorrectionFactor;

  // 2. Specific Vapor Volume at Minimum Design Temperature
  // s = k1 + k2 * T
  const s_min = k1 + k2 * T_min;
  const s_max = k1 + k2 * T_max;

  steps.push({
    step: '1. Specific Vapor Volume (s) of HFC-227ea',
    formula: 's = k1 + (k2 × T_min)',
    substitution: `s = ${k1} + (${k2} × ${T_min.toFixed(1)}°C)`,
    result: `${s_min.toFixed(4)} m³/kg`,
    reference: 'NFPA 2001 Section 5.5.1 / Table 5.5.1',
  });

  // 3. Minimum Design Concentration Validation
  let minPermissibleConc = 7.0;
  if (input.hazardClass === 'class_b_flammable') {
    minPermissibleConc = 9.0;
  } else if (input.hazardClass === 'class_a_surface') {
    minPermissibleConc = 7.0; // 6.7% cup burner + 20% = 7.9% or 7.0% min listed
  }

  const C = input.designConcentration;
  if (C < minPermissibleConc) {
    notesAndWarnings.push(
      `Warning: Selected design concentration (${C}%) is below the NFPA 2001 minimum requirement (${minPermissibleConc}%) for ${input.hazardClass}.`
    );
  }

  // 4. Theoretical Agent Mass Calculation
  // W_theo = (V_net / s) * (C / (100 - C))
  const theoreticalMass = (V_net / s_min) * (C / (100 - C));

  steps.push({
    step: '2. Theoretical Agent Mass (Uncorrected)',
    formula: 'W_theo = (V_net / s) × [C / (100 - C)]',
    substitution: `W_theo = (${V_net.toFixed(2)} / ${s_min.toFixed(4)}) × [${C.toFixed(1)} / (100 - ${C.toFixed(1)})]`,
    result: `${theoreticalMass.toFixed(2)} kg`,
    reference: 'NFPA 2001 Equation 5.5.1',
  });

  // 5. Altitude / Atmospheric Correction Factor
  const designMass = theoreticalMass * Fa;

  steps.push({
    step: '3. Atmospheric Pressure / Altitude Correction (Fa)',
    formula: 'W_design = W_theo × Fa',
    substitution: `W_design = ${theoreticalMass.toFixed(2)} × ${Fa.toFixed(3)} (Elevation: ${input.enclosure.elevation}m)`,
    result: `${designMass.toFixed(2)} kg`,
    reference: 'NFPA 2001 Table 5.5.3.3 / Equation 5.5.3.3',
  });

  // 6. Cylinder Selection & Fill Density
  const targetCyl = FM200_CYLINDERS.find(c => c.waterCapacityL === input.cylinderSizeLitres) || FM200_CYLINDERS[3];
  
  // Fill density clamp: 0.50 to 1.15 kg/L per UL/FM listings
  const fillDensityClamped = Math.min(Math.max(input.fillDensityKgL, 0.50), 1.15);
  const nominalFillPerCyl = fillDensityClamped * targetCyl.waterCapacityL;
  const requiredCylinders = Math.max(1, Math.ceil(designMass / nominalFillPerCyl));
  const actualAgentPerCyl = Math.round((designMass / requiredCylinders) * 10) / 10;
  const totalSuppliedAgentKg = Math.round(actualAgentPerCyl * requiredCylinders * 10) / 10;
  const marginSurplusKg = Math.round((totalSuppliedAgentKg - designMass) * 10) / 10;

  steps.push({
    step: '4. Cylinder Bank Allocation & Fill Density Check',
    formula: 'N_cyl = ceil(W_design / Fill_nominal); Fill_actual = W_design / N_cyl',
    substitution: `N_cyl = ceil(${designMass.toFixed(2)} / ${nominalFillPerCyl.toFixed(1)}) = ${requiredCylinders} × ${targetCyl.waterCapacityL}L @ ${(actualAgentPerCyl / targetCyl.waterCapacityL).toFixed(2)} kg/L`,
    result: `${requiredCylinders} Cylinders (${actualAgentPerCyl} kg/cyl, Total: ${totalSuppliedAgentKg} kg)`,
    reference: 'NFPA 2001 Clause 4.1.4.1 & Manufacturer Listed Fill Density (0.50 - 1.15 kg/L)',
  });

  // 7. Actual Delivered Concentration and NOAEL/LOAEL Toxicological Limits
  // C_supplied = 100 * (W_total * s_min) / (V_net + W_total * s_min)
  const suppliedDesignConc = (100 * totalSuppliedAgentKg * s_min) / (V_net + totalSuppliedAgentKg * s_min);
  const maxConcAtMaxTemp = (100 * totalSuppliedAgentKg * s_max) / (V_net + totalSuppliedAgentKg * s_max);

  steps.push({
    step: '5. Toxicological Life-Safety Verification (NOAEL / LOAEL)',
    formula: 'C_max = 100 × (W_total × s_max) / (V_net + W_total × s_max)',
    substitution: `C_max = 100 × (${totalSuppliedAgentKg} × ${s_max.toFixed(4)}) / (${V_net.toFixed(2)} + ${totalSuppliedAgentKg} × ${s_max.toFixed(4)})`,
    result: `At ${T_max.toFixed(1)}°C: ${maxConcAtMaxTemp.toFixed(2)}% (NOAEL: ${noael}%, LOAEL: ${loael}%)`,
    reference: 'NFPA 2001 Section 1.5 & Table 1.5.1.2.1',
  });

  const isOccupiedSpaceCompliant = maxConcAtMaxTemp <= noael;
  const isWithinSafetyLimits = maxConcAtMaxTemp <= loael;

  if (isOccupiedSpaceCompliant) {
    notesAndWarnings.push(
      `Occupant Safety: PASSED. Design concentration (${maxConcAtMaxTemp.toFixed(2)}% max) is below NOAEL (${noael}%). System is safe for human egress in normally occupied spaces.`
    );
  } else if (isWithinSafetyLimits) {
    notesAndWarnings.push(
      `Caution: Concentration exceeds NOAEL (${noael}%) but is within LOAEL (${loael}%). Personnel exposure must not exceed 5 minutes. Mandatory pre-discharge alarm with 30s delay and mechanical lockout valve required.`
    );
  } else {
    notesAndWarnings.push(
      `CRITICAL SAFETY ALERT: Concentration exceeds LOAEL (${loael}%). Space must NEVER be normally occupied. Immediate lockout required.`
    );
  }

  // 8. Discharge Duration Requirement
  const dischargeTimeLimitSeconds = 10.0;
  notesAndWarnings.push(
    `Discharge Duration Limit: 10.0 seconds maximum to reach 95% design concentration per NFPA 2001 Section 5.7.1.2.`
  );

  // 9. Pressure Relief Vent Area Estimate (NFPA Annex B)
  const estPressureReliefAreaM2 = Math.round((V_net * 0.00045) * 1000) / 1000;
  notesAndWarnings.push(
    `Pressure Relief Venting: Estimated minimum free vent area is ${estPressureReliefAreaM2.toFixed(3)} m² (${(estPressureReliefAreaM2 * 10000).toFixed(0)} cm²) to prevent wall/ceiling structural failure.`
  );

  // 10. Engineering Hydraulic Calculation Mandate
  notesAndWarnings.push(
    `HYDRAULIC VERIFICATION REQUIREMENT: This calculation determines agent mass and cylinder quantity. As-built pipe sizes, nozzle orifice drilling, and nozzle pressures must be verified using manufacturer-specific UL-listed hydraulic flow calculation software.`
  );

  let verificationStatus: FM200CalcResult['verificationStatus'] = 'verified';
  if (C < minPermissibleConc || !isWithinSafetyLimits) {
    verificationStatus = 'warning';
  }

  return {
    agentName: 'FM-200 (HFC-227ea)',
    chemicalName: 'Heptafluoropropane (CF3CHFCF3)',
    grossVolumeM3: Math.round(V_gross * 100) / 100,
    netDesignVolumeM3: Math.round(V_net * 100) / 100,
    specificVaporVolumeM3Kg: Math.round(s_min * 10000) / 10000,
    altitudeCorrectionFactor: Fa,
    theoreticalAgentMassKg: Math.round(theoreticalMass * 100) / 100,
    designAgentMassKg: Math.round(designMass * 100) / 100,
    requiredCylinders,
    selectedCylinderModel: targetCyl.model,
    cylinderCapacityLitres: targetCyl.waterCapacityL,
    actualAgentPerCylinderKg: actualAgentPerCyl,
    totalSuppliedAgentKg,
    fillDensityKgL: Math.round((actualAgentPerCyl / targetCyl.waterCapacityL) * 100) / 100,
    marginSurplusKg,
    suppliedDesignConcentration: Math.round(suppliedDesignConc * 100) / 100,
    maxConcentrationAtMaxTemp: Math.round(maxConcAtMaxTemp * 100) / 100,
    noaelLimit: noael,
    loaelLimit: loael,
    isWithinSafetyLimits,
    isOccupiedSpaceCompliant,
    dischargeTimeLimitSeconds,
    estPressureReliefAreaM2,
    verificationStatus,
    notesAndWarnings,
    calculationSteps: steps,
  };
}
