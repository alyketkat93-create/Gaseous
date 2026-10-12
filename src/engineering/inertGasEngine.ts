import { InertGasCalcInput, InertGasCalcResult } from '../types';
import { calculateEnclosureVolume } from './enclosureEngine';

interface InertGasProperties {
  name: string;
  composition: string;
  k1: number;
  k2: number;
  minClassAConc: number;
  freeGasPer80L_200Bar: number;  // m3
  freeGasPer80L_300Bar: number;  // m3
  freeGasPer140L_200Bar: number; // m3
  freeGasPer140L_300Bar: number; // m3
}

export const INERT_GAS_SPECS: Record<InertGasCalcInput['gasType'], InertGasProperties> = {
  inert_ig541: {
    name: 'IG-541 (Inergen)',
    composition: '52% Nitrogen (N2), 40% Argon (Ar), 8% Carbon Dioxide (CO2)',
    k1: 0.6579,
    k2: 0.00239,
    minClassAConc: 38.0,
    freeGasPer80L_200Bar: 15.8,
    freeGasPer80L_300Bar: 22.8,
    freeGasPer140L_200Bar: 27.6,
    freeGasPer140L_300Bar: 39.9,
  },
  inert_ig55: {
    name: 'IG-55 (Argonite)',
    composition: '50% Nitrogen (N2), 50% Argon (Ar)',
    k1: 0.6598,
    k2: 0.00242,
    minClassAConc: 37.9,
    freeGasPer80L_200Bar: 15.7,
    freeGasPer80L_300Bar: 22.6,
    freeGasPer140L_200Bar: 27.4,
    freeGasPer140L_300Bar: 39.6,
  },
  inert_ig100: {
    name: 'IG-100 (NN100)',
    composition: '100% Pure Nitrogen (N2)',
    k1: 0.7997,
    k2: 0.00293,
    minClassAConc: 38.2,
    freeGasPer80L_200Bar: 15.2,
    freeGasPer80L_300Bar: 22.0,
    freeGasPer140L_200Bar: 26.6,
    freeGasPer140L_300Bar: 38.5,
  },
  inert_ig01: {
    name: 'IG-01 (Argon)',
    composition: '100% Pure Argon (Ar)',
    k1: 0.5615,
    k2: 0.00205,
    minClassAConc: 41.9,
    freeGasPer80L_200Bar: 15.9,
    freeGasPer80L_300Bar: 23.0,
    freeGasPer140L_200Bar: 27.8,
    freeGasPer140L_300Bar: 40.2,
  },
};

export function calculateInertGas(input: InertGasCalcInput): InertGasCalcResult {
  const notesAndWarnings: string[] = [];
  const steps: InertGasCalcResult['calculationSteps'] = [];

  const specs = INERT_GAS_SPECS[input.gasType];
  const volBreakdown = calculateEnclosureVolume(input.enclosure, 'metric');
  const V_net = volBreakdown.netDesignVolume;
  const T_design = input.enclosure.minTemp;
  const Fa = volBreakdown.altitudeCorrectionFactor;

  // Specific volume at reference 21°C and design temp
  const s_ref = specs.k1 + specs.k2 * 21;
  const s_design = specs.k1 + specs.k2 * T_design;

  // Design concentration validation
  const C = Math.max(input.designConcentration, specs.minClassAConc);
  if (input.designConcentration < specs.minClassAConc) {
    notesAndWarnings.push(
      `Adjusted concentration from ${input.designConcentration}% to NFPA 2001 minimum requirement (${specs.minClassAConc}%) for ${specs.name}.`
    );
  }

  // NFPA 2001 Volumetric Formula for Inert Gas:
  // X = 2.303 * (V_net * (s_ref / s_design)) * log10(100 / (100 - C))
  const logTerm = Math.log10(100 / (100 - C));
  const theoreticalGasVolM3 = 2.303 * (V_net * (s_ref / s_design)) * logTerm;
  const correctedGasVolumeM3 = theoreticalGasVolM3 * Fa;

  steps.push({
    step: '1. Specific Volume Derivation (NFPA 2001 Table 5.5.1)',
    formula: 's = k1 + (k2 × T)',
    substitution: `s = ${specs.k1} + (${specs.k2} × ${T_design}°C)`,
    result: `${s_design.toFixed(4)} m³/kg (Reference s_21°C: ${s_ref.toFixed(4)} m³/kg)`,
    reference: 'NFPA 2001 Section 5.5.1 & Table 5.5.1',
  });

  steps.push({
    step: '2. Required Free Gas Quantity (X)',
    formula: 'X = 2.303 × V_net × (s_ref / s_design) × log10[100 / (100 - C)]',
    substitution: `X = 2.303 × ${V_net.toFixed(2)} × (${s_ref.toFixed(4)} / ${s_design.toFixed(4)}) × log10[100 / (100 - ${C.toFixed(1)})]`,
    result: `${theoreticalGasVolM3.toFixed(2)} m³ at 21°C, 1.013 bar`,
    reference: 'NFPA 2001 Equation 5.5.2',
  });

  steps.push({
    step: '3. Altitude & Barometric Correction Factor (Fa)',
    formula: 'X_corrected = X × Fa',
    substitution: `X_corrected = ${theoreticalGasVolM3.toFixed(2)} × ${Fa.toFixed(3)} (Elevation: ${input.enclosure.elevation}m)`,
    result: `${correctedGasVolumeM3.toFixed(2)} m³`,
    reference: 'NFPA 2001 Table 5.5.3.3',
  });

  // Cylinder Capacity determination based on pressure and size
  let gasYieldPerCylinder = 15.8;
  if (input.cylinderSizeLitres === 80) {
    gasYieldPerCylinder = input.storagePressureBar === 300 ? specs.freeGasPer80L_300Bar : specs.freeGasPer80L_200Bar;
  } else {
    gasYieldPerCylinder = input.storagePressureBar === 300 ? specs.freeGasPer140L_300Bar : specs.freeGasPer140L_200Bar;
  }

  const requiredCylinderCount = Math.max(1, Math.ceil(correctedGasVolumeM3 / gasYieldPerCylinder));
  const totalSuppliedGasVolumeM3 = Math.round(requiredCylinderCount * gasYieldPerCylinder * 10) / 10;

  steps.push({
    step: '4. Cylinder Bank Allocation',
    formula: 'N_cyl = ceil(X_corrected / Yield_per_cyl)',
    substitution: `N_cyl = ceil(${correctedGasVolumeM3.toFixed(2)} / ${gasYieldPerCylinder.toFixed(1)}) = ${requiredCylinderCount} × ${input.cylinderSizeLitres}L @ ${input.storagePressureBar} bar`,
    result: `${requiredCylinderCount} Cylinders (${totalSuppliedGasVolumeM3.toFixed(1)} m³ total free gas)`,
    reference: 'NFPA 2001 Clause 4.1.4.1 & ISO 9809 Cylinder Standards',
  });

  // Actual Delivered Concentration
  // C_actual = 100 * (1 - 10^(-X_supplied / (2.303 * V_net * (s_ref / s_design))))
  const exponent = -totalSuppliedGasVolumeM3 / (2.303 * V_net * (s_ref / s_design));
  const actualSuppliedConcentration = Math.round((100 * (1 - Math.pow(10, exponent))) * 10) / 10;

  // Residual Oxygen Calculation: O2% = 20.9 * (1 - C/100)
  const postDischargeOxygenPercent = Math.round((20.9 * (1 - actualSuppliedConcentration / 100)) * 10) / 10;

  let oxygenSafetyStatus: InertGasCalcResult['oxygenSafetyStatus'] = 'safe_egress';
  if (postDischargeOxygenPercent >= 12.0) {
    oxygenSafetyStatus = 'safe_egress';
    notesAndWarnings.push(
      `Residual Oxygen: ${postDischargeOxygenPercent}% (SAFE). Space is safe for human egress for up to 5 minutes without supplemental oxygen.`
    );
  } else if (postDischargeOxygenPercent >= 10.0) {
    oxygenSafetyStatus = 'short_exposure_only';
    notesAndWarnings.push(
      `Residual Oxygen: ${postDischargeOxygenPercent}% (CAUTION). Short exposure only (< 3 minutes). Supervised pre-discharge alarm mandatory.`
    );
  } else {
    oxygenSafetyStatus = 'immediate_danger';
    notesAndWarnings.push(
      `CRITICAL HYPOXIA HAZARD: Oxygen level drops to ${postDischargeOxygenPercent}%, below 10%. Lethal risk. Enclosure must be strictly unoccupied.`
    );
  }

  // IG-541 Specific Benefit Note (Carbon Dioxide stimulation)
  let postDischargeCarbonDioxidePercent: number | undefined;
  if (input.gasType === 'inert_ig541') {
    postDischargeCarbonDioxidePercent = Math.round((8.0 * (actualSuppliedConcentration / 100)) * 10) / 10;
    notesAndWarnings.push(
      `IG-541 Physiological Safety: Post-discharge CO2 is ~${postDischargeCarbonDioxidePercent}%. This gently stimulates arterial respiration, maintaining cerebral oxygenation despite reduced O2.`
    );
  }

  // Mandatory Overpressure Relief Venting calculation
  // Inert gas introduces massive displacement volume in 60s
  // Q_peak = totalSuppliedGasVolumeM3 / 60
  // Free Vent Area: Av = Q_peak / (Cd * sqrt(2 * dP / rho)) where dP = 500 Pa (0.5 kPa), Cd = 0.6, rho = 1.2
  const peakDischargeFlowM3S = totalSuppliedGasVolumeM3 / 60;
  const maxAllowablePressureDropPa = 500; // typical lightweight partition limit
  const airDensityKgM3 = 1.2;
  const dischargeCoeff = 0.6;
  const estPressureReliefVentAreaM2 = Math.round((peakDischargeFlowM3S / (dischargeCoeff * Math.sqrt((2 * maxAllowablePressureDropPa) / airDensityKgM3))) * 1000) / 1000;

  notesAndWarnings.push(
    `OVERPRESSURE RELIEF VENTING MANDATORY: Discharge of ${totalSuppliedGasVolumeM3} m³ within 60s generates significant peak pressure. A counter-balanced 2-way pressure relief damper with minimum free area of ${estPressureReliefVentAreaM2} m² (${(estPressureReliefVentAreaM2 * 10000).toFixed(0)} cm²) is mandatory per NFPA 2001 Section 5.4.`
  );

  return {
    gasName: specs.name,
    gasComposition: specs.composition,
    netDesignVolumeM3: Math.round(V_net * 100) / 100,
    specificVolumeM3Kg: Math.round(s_design * 10000) / 10000,
    theoreticalGasVolumeM3: Math.round(theoreticalGasVolM3 * 100) / 100,
    correctedGasVolumeM3: Math.round(correctedGasVolumeM3 * 100) / 100,
    storagePressureBar: input.storagePressureBar,
    cylinderSizeLitres: input.cylinderSizeLitres,
    gasYieldPerCylinderM3: gasYieldPerCylinder,
    requiredCylinderCount,
    totalSuppliedGasVolumeM3,
    actualSuppliedConcentration,
    postDischargeOxygenPercent,
    oxygenSafetyStatus,
    postDischargeCarbonDioxidePercent,
    requiredDischargeDurationSeconds: 60,
    estPressureReliefVentAreaM2,
    peakOverpressureKPa: 0.5,
    verificationStatus: oxygenSafetyStatus === 'immediate_danger' ? 'warning' : 'verified',
    calculationSteps: steps,
    notesAndWarnings,
  };
}
