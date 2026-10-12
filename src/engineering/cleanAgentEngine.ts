import { CleanAgentCalcInput, CleanAgentCalcResult } from '../types';
import { calculateEnclosureVolume } from './enclosureEngine';

interface AgentPhysicalProperties {
  chemicalName: string;
  molecularWeight: number;
  boilingPointC: number;
  k1_metric: number;
  k2_metric: number;
  noael: number;
  loael: number;
  minDesignConcClassA: number;
  minDesignConcClassB: number;
  maxFillDensityKgL: number;
  minFillDensityKgL: number;
}

export const CLEAN_AGENT_PROPERTIES: Record<'hfc227ea' | 'fk5112', AgentPhysicalProperties> = {
  hfc227ea: {
    chemicalName: 'Heptafluoropropane (CF3CHFCF3)',
    molecularWeight: 170.03,
    boilingPointC: -16.4,
    k1_metric: 0.1269,
    k2_metric: 0.000513,
    noael: 9.0,
    loael: 10.5,
    minDesignConcClassA: 7.0, // NFPA 2001 Class A / C
    minDesignConcClassB: 9.0, // Class B Flammable Liquid
    minFillDensityKgL: 0.5,
    maxFillDensityKgL: 1.15,
  },
  fk5112: {
    chemicalName: 'Dodecafluoro-2-methylpentan-3-one (CF3CF2C(=O)CF(CF3)2)',
    molecularWeight: 316.04,
    boilingPointC: 49.2,
    k1_metric: 0.0664,
    k2_metric: 0.000274,
    noael: 10.0,
    loael: 10.5,
    minDesignConcClassA: 5.3, // NFPA 2001 (2022 ed) Class A / C
    minDesignConcClassB: 5.9, // Class B
    minFillDensityKgL: 0.4,
    maxFillDensityKgL: 1.20,
  },
};

// Standard cylinder sizes in Litres
export const STANDARD_CYLINDER_SIZES = [
  { capacityL: 40, tareWeightKg: 35, model: 'CYL-040L-42BAR' },
  { capacityL: 80, tareWeightKg: 65, model: 'CYL-080L-42BAR' },
  { capacityL: 120, tareWeightKg: 95, model: 'CYL-120L-42BAR' },
  { capacityL: 140, tareWeightKg: 110, model: 'CYL-140L-42BAR' },
  { capacityL: 180, tareWeightKg: 140, model: 'CYL-180L-42BAR' },
  { capacityL: 343, tareWeightKg: 245, model: 'CYL-343L-50BAR' },
];

export function calculateCleanAgent(input: CleanAgentCalcInput): CleanAgentCalcResult {
  const notesAndWarnings: string[] = [];
  const steps: CleanAgentCalcResult['calculationSteps'] = [];

  const props = CLEAN_AGENT_PROPERTIES[input.agent];
  const agentDisplayName = input.agent === 'hfc227ea' ? 'HFC-227ea (FM-200)' : 'FK-5-1-12 Clean Agent';
  
  // 1. Calculate enclosure geometry & atmospheric factor
  const volBreakdown = calculateEnclosureVolume(input.enclosure, 'metric');
  const V_net = volBreakdown.netDesignVolume;
  const T_min = input.enclosure.minTemp;
  const T_max = input.enclosure.maxTemp || T_min + 15;
  const Fa = volBreakdown.altitudeCorrectionFactor;

  // 2. Specific vapor volume at minimum temperature: s = k1 + k2 * T
  const s_min = props.k1_metric + props.k2_metric * T_min;
  const s_max = props.k1_metric + props.k2_metric * T_max;

  steps.push({
    step: '1. Specific Vapor Volume (s)',
    formula: 's = k1 + (k2 × T_min)',
    substitution: `s = ${props.k1_metric} + (${props.k2_metric} × ${T_min}°C)`,
    result: `${s_min.toFixed(4)} m³/kg`,
    reference: 'NFPA 2001 Section 5.5.1 / Table 5.5.1',
  });

  // 3. Minimum design concentration validation
  const minRequiredConc = input.hazardClass === 'class_b_flammable'
    ? props.minDesignConcClassB
    : props.minDesignConcClassA;

  if (input.designConcentration < minRequiredConc) {
    notesAndWarnings.push(
      `Warning: Selected concentration (${input.designConcentration}%) is below NFPA 2001 minimum requirement (${minRequiredConc}%) for ${input.hazardClass}.`
    );
  }

  const C = input.designConcentration;

  // 4. Calculate theoretical agent mass (without altitude correction)
  // W_theo = (V / s) * (C / (100 - C))
  const theoreticalMass = (V_net / s_min) * (C / (100 - C));

  steps.push({
    step: '2. Theoretical Agent Mass',
    formula: 'W_theo = (V_net / s) × [C / (100 - C)]',
    substitution: `W_theo = (${V_net.toFixed(2)} / ${s_min.toFixed(4)}) × [${C} / (100 - ${C})]`,
    result: `${theoreticalMass.toFixed(2)} kg`,
    reference: 'NFPA 2001 Equation 5.5.1',
  });

  // 5. Apply Atmospheric / Altitude Correction Factor
  const designMass = theoreticalMass * Fa;

  steps.push({
    step: '3. Corrected Design Agent Mass (Fa)',
    formula: 'W_design = W_theo × Fa',
    substitution: `W_design = ${theoreticalMass.toFixed(2)} × ${Fa}`,
    result: `${designMass.toFixed(2)} kg`,
    reference: 'NFPA 2001 Table 5.5.3.3',
  });

  // 6. Cylinder Selection & Fill Quantity
  // Find suitable cylinder configuration
  const targetCylinder = STANDARD_CYLINDER_SIZES.find(c => c.capacityL === input.cylinderSizeLitres) || STANDARD_CYLINDER_SIZES[2];
  const maxAgentPerCyl = targetCylinder.capacityL * props.maxFillDensityKgL;
  const minAgentPerCyl = targetCylinder.capacityL * props.minFillDensityKgL;

  let cylFillKg = input.fillDensityKgL * targetCylinder.capacityL;
  if (cylFillKg > maxAgentPerCyl) cylFillKg = maxAgentPerCyl;
  if (cylFillKg < minAgentPerCyl) cylFillKg = minAgentPerCyl;

  const requiredCylinders = Math.ceil(designMass / cylFillKg);
  const actualAgentPerCyl = Math.round((designMass / requiredCylinders) * 10) / 10;
  const totalSuppliedAgentKg = Math.round(actualAgentPerCyl * requiredCylinders * 10) / 10;

  steps.push({
    step: '4. Cylinder Quantity and Fill Density',
    formula: 'N_cyl = ceil(W_design / Fill_per_cyl)',
    substitution: `N_cyl = ceil(${designMass.toFixed(2)} / ${cylFillKg.toFixed(1)}) = ${requiredCylinders} × ${targetCylinder.capacityL}L`,
    result: `${requiredCylinders} Cylinders (${actualAgentPerCyl} kg/cyl, Total: ${totalSuppliedAgentKg} kg)`,
    reference: 'Manufacturer Fill Limits & NFPA 2001 Clause 4.1',
  });

  // 7. Actual Delivered Concentration and Safety Limits Check
  // C_actual = 100 * (W_supplied * s_min) / (V_net + W_supplied * s_min)
  const actualDeliveredConcMinTemp = (100 * totalSuppliedAgentKg * s_min) / (V_net + totalSuppliedAgentKg * s_min);
  const actualDeliveredConcMaxTemp = (100 * totalSuppliedAgentKg * s_max) / (V_net + totalSuppliedAgentKg * s_max);

  steps.push({
    step: '5. Toxicological Limit Verification',
    formula: 'C_max = 100 × (W_total × s_max) / (V_net + W_total × s_max)',
    substitution: `C_max = 100 × (${totalSuppliedAgentKg} × ${s_max.toFixed(4)}) / (${V_net.toFixed(2)} + ${totalSuppliedAgentKg} × ${s_max.toFixed(4)})`,
    result: `At ${T_max}°C: ${actualDeliveredConcMaxTemp.toFixed(2)}% (NOAEL: ${props.noael}%, LOAEL: ${props.loael}%)`,
    reference: 'NFPA 2001 Section 1.5 & Table 1.5.1.2.1',
  });

  const isWithinSafetyLimits = actualDeliveredConcMaxTemp <= props.loael;
  const isOccupiedSpaceCompliant = actualDeliveredConcMaxTemp <= props.noael;

  if (!isOccupiedSpaceCompliant) {
    notesAndWarnings.push(
      `CRITICAL SAFETY ALERT: At maximum room temperature (${T_max}°C), the concentration reaches ${actualDeliveredConcMaxTemp.toFixed(2)}%, exceeding the NOAEL (${props.noael}%). Enclosure must NOT be normally occupied, or an evacuation time delay with lockout valve must be installed!`
    );
  } else {
    notesAndWarnings.push(
      `Toxicological check PASSED: Actual concentration (${actualDeliveredConcMaxTemp.toFixed(2)}%) is below NOAEL (${props.noael}%). System is safe for human egress in normally occupied spaces.`
    );
  }

  // 8. Discharge Duration Check
  const dischargeTimeLimitSeconds = 10;
  notesAndWarnings.push(
    `NFPA 2001 Clause 5.7.1.2 requirement: Maximum allowable discharge duration to reach 95% design concentration is 10.0 seconds.`
  );

  // 9. Pressure Relief Vent Area Estimate (NFPA Annex B)
  // Clean agent gas expansion produces peak overpressure.
  // Approximation: Av = (Q_peak) / (Cd * sqrt(2 * dP / rho))
  // Rule of thumb for clean agent: ~ 0.0003 - 0.0006 m2 per m3 of enclosure
  const estPressureReliefAreaM2 = Math.round((V_net * 0.00045) * 1000) / 1000;
  notesAndWarnings.push(
    `Preliminary Free Vent Area for Pressure Relief Damper (PRD): approximately ${estPressureReliefAreaM2.toFixed(3)} m² (subject to manufacturer venting flow software).`
  );

  return {
    agentName: agentDisplayName,
    chemicalDesignation: props.chemicalName,
    grossVolumeM3: volBreakdown.grossVolume,
    netDesignVolumeM3: V_net,
    specificVaporVolumeM3Kg: Math.round(s_min * 10000) / 10000,
    altitudeCorrectionFactor: Fa,
    theoreticalAgentMassKg: Math.round(theoreticalMass * 100) / 100,
    designAgentMassKg: Math.round(designMass * 100) / 100,
    requiredCylinders,
    selectedCylinderModel: targetCylinder.model,
    cylinderCapacityLitres: targetCylinder.capacityL,
    actualAgentPerCylinderKg: actualAgentPerCyl,
    totalSuppliedAgentKg,
    designConcentrationSupplied: Math.round(actualDeliveredConcMinTemp * 100) / 100,
    maxConcentrationAtMaxTemp: Math.round(actualDeliveredConcMaxTemp * 100) / 100,
    noaelLimit: props.noael,
    loaelLimit: props.loael,
    isWithinSafetyLimits,
    isOccupiedSpaceCompliant,
    dischargeTimeLimitSeconds,
    estPressureReliefAreaM2,
    notesAndWarnings,
    calculationSteps: steps,
  };
}
