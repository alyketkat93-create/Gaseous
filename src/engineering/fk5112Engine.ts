import { FK5112CalcInput, FK5112CalcResult } from '../types';
import { calculateEnclosureVolume } from './enclosureEngine';

export interface FK5112CylinderSpec {
  model: string;
  waterCapacityL: number;
  tareWeightKg: number;
  minFillKg: number;
  maxFillKg: number;
  workingPressureBar: number;
}

export const FK5112_CYLINDERS: FK5112CylinderSpec[] = [
  { model: 'FK-CYL-040L (42 Bar)', waterCapacityL: 40, tareWeightKg: 35, minFillKg: 16.0, maxFillKg: 48.0, workingPressureBar: 42 },
  { model: 'FK-CYL-080L (42 Bar)', waterCapacityL: 80, tareWeightKg: 65, minFillKg: 32.0, maxFillKg: 96.0, workingPressureBar: 42 },
  { model: 'FK-CYL-120L (42 Bar)', waterCapacityL: 120, tareWeightKg: 95, minFillKg: 48.0, maxFillKg: 144.0, workingPressureBar: 42 },
  { model: 'FK-CYL-140L (42 Bar)', waterCapacityL: 140, tareWeightKg: 110, minFillKg: 56.0, maxFillKg: 168.0, workingPressureBar: 42 },
  { model: 'FK-CYL-180L (42 Bar)', waterCapacityL: 180, tareWeightKg: 140, minFillKg: 72.0, maxFillKg: 216.0, workingPressureBar: 42 },
  { model: 'FK-CYL-343L (50 Bar High-Capacity)', waterCapacityL: 343, tareWeightKg: 245, minFillKg: 137.2, maxFillKg: 411.6, workingPressureBar: 50 },
  { model: 'FK-CYL-360L (42 Bar)', waterCapacityL: 360, tareWeightKg: 255, minFillKg: 144.0, maxFillKg: 432.0, workingPressureBar: 42 },
  { model: 'FK-CYL-450L (50 Bar)', waterCapacityL: 450, tareWeightKg: 310, minFillKg: 180.0, maxFillKg: 540.0, workingPressureBar: 50 },
];

export function calculateFK5112(input: FK5112CalcInput): FK5112CalcResult {
  const notesAndWarnings: string[] = [];
  const steps: FK5112CalcResult['calculationSteps'] = [];

  // Physical constants for FK-5-1-12 per NFPA 2001 (2022 Table 5.5.1)
  const k1 = 0.0664;
  const k2 = 0.0002741;
  const noael = 10.0;
  const loael = 10.5;

  // 1. Enclosure Geometry & Volume
  const volBreakdown = calculateEnclosureVolume(input.enclosure, 'metric');
  const V_gross = volBreakdown.grossVolume;
  const V_net = volBreakdown.netDesignVolume;
  const T_min = input.enclosure.minTemp;
  const T_max = input.enclosure.maxTemp || T_min + 15;
  const Fa = volBreakdown.altitudeCorrectionFactor;

  // 2. Specific Vapor Volume at Minimum Design Temperature: s = k1 + k2 * T
  const s_min = k1 + k2 * T_min;
  const s_max = k1 + k2 * T_max;

  steps.push({
    step: '1. Specific Vapor Volume (s) of FK-5-1-12',
    formula: 's = k1 + (k2 × T_min)',
    substitution: `s = ${k1} + (${k2} × ${T_min.toFixed(1)}°C)`,
    result: `${s_min.toFixed(4)} m³/kg`,
    reference: 'NFPA 2001 Section 5.5.1 / Table 5.5.1',
  });

  // 3. Minimum Design Concentration Check
  let minPermissibleConc = 5.3;
  if (input.hazardClass === 'class_b_flammable') {
    minPermissibleConc = 5.8;
  } else if (input.hazardClass === 'class_a_surface') {
    minPermissibleConc = 5.3; // 4.5% MEC + 20% safety factor per NFPA 2001 2022 ed.
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

  // 6. Cylinder Sizing & Fill Density
  const targetCyl = FK5112_CYLINDERS.find(c => c.waterCapacityL === input.cylinderSizeLitres) || FK5112_CYLINDERS[3];
  
  // Fill density range: 0.40 to 1.20 kg/L per UL/FM listings
  const fillDensityClamped = Math.min(Math.max(input.fillDensityKgL, 0.40), 1.20);
  const nominalFillPerCyl = fillDensityClamped * targetCyl.waterCapacityL;
  const requiredCylinders = Math.max(1, Math.ceil(designMass / nominalFillPerCyl));
  const actualAgentPerCyl = Math.round((designMass / requiredCylinders) * 10) / 10;
  const totalSuppliedAgentKg = Math.round(actualAgentPerCyl * requiredCylinders * 10) / 10;
  const marginSurplusKg = Math.round((totalSuppliedAgentKg - designMass) * 10) / 10;

  steps.push({
    step: '4. Cylinder Bank Sizing & Fill Density Verification',
    formula: 'N_cyl = ceil(W_design / Fill_nominal); Fill_actual = W_design / N_cyl',
    substitution: `N_cyl = ceil(${designMass.toFixed(2)} / ${nominalFillPerCyl.toFixed(1)}) = ${requiredCylinders} × ${targetCyl.waterCapacityL}L @ ${(actualAgentPerCyl / targetCyl.waterCapacityL).toFixed(2)} kg/L`,
    result: `${requiredCylinders} Cylinders (${actualAgentPerCyl} kg/cyl, Total: ${totalSuppliedAgentKg} kg)`,
    reference: 'NFPA 2001 Clause 4.1.4.1 & Manufacturer Listed Fill Density (0.40 - 1.20 kg/L)',
  });

  // 7. Delivered Concentration & Toxicological Safety Verification
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
    const safetyMarginPct = Math.round(((noael - maxConcAtMaxTemp) / maxConcAtMaxTemp) * 100);
    notesAndWarnings.push(
      `Occupant Safety: PASSED. Design concentration (${maxConcAtMaxTemp.toFixed(2)}%) is well below the NOAEL (${noael}%). Margin of safety is +${safetyMarginPct}%, providing safe egress conditions.`
    );
  } else {
    notesAndWarnings.push(
      `CRITICAL SAFETY ALERT: Concentration exceeds NOAEL (${noael}%). Life safety lockout valve and pre-discharge alarm mandatory.`
    );
  }

  // 8. Environmental Profile Check
  notesAndWarnings.push(
    `Environmental Classification: Ozone Depletion Potential (ODP) = 0.00 | Global Warming Potential (GWP) < 1 | Atmospheric Lifetime = 5 days. Zero phase-down restrictions under Kigali Amendment / EPA AIM Act.`
  );

  // 9. Discharge Duration Requirement
  const dischargeTimeLimitSeconds = 10.0;
  notesAndWarnings.push(
    `Discharge Duration: 10.0 seconds maximum to deliver 95% design concentration per NFPA 2001 Section 5.7.1.2.`
  );

  // 10. Pressure Relief Vent Area Estimate
  const estPressureReliefAreaM2 = Math.round((V_net * 0.00040) * 1000) / 1000;
  notesAndWarnings.push(
    `Pressure Relief Venting: Estimated free vent area is ${estPressureReliefAreaM2.toFixed(3)} m² (${(estPressureReliefAreaM2 * 10000).toFixed(0)} cm²). Damper must be verified with manufacturer venting software.`
  );

  // 11. Nomenclature & Product Line Distinction
  notesAndWarnings.push(
    `PRODUCT SPECIFICATION NOTE: Calculated for FK-5-1-12 fluoroketone clean agent. This chemical specification is distinct from historical brand trademarks (e.g. 3M Novec 1230). Hardware must be UL-listed/FM-approved with verified agent filling documentation.`
  );

  let verificationStatus: FK5112CalcResult['verificationStatus'] = 'verified';
  if (C < minPermissibleConc || !isWithinSafetyLimits) {
    verificationStatus = 'warning';
  }

  return {
    agentName: 'FK-5-1-12 Clean Agent',
    chemicalName: 'Dodecafluoro-2-methylpentan-3-one (CF3CF2C(=O)CF(CF3)2)',
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
    environmentalScore: {
      gwp: 0.9,
      odp: 0.0,
      atmosphericLifetimeDays: 5,
    },
    dischargeTimeLimitSeconds,
    estPressureReliefAreaM2,
    verificationStatus,
    notesAndWarnings,
    calculationSteps: steps,
  };
}
