export interface VentingCalculationInput {
  systemType: 'chemical_clean_agent' | 'inert_gas' | 'co2';
  netVolumeM3: number;
  totalAgentVolumeOrMass: number; // kg for clean agent/co2, m3 for inert gas
  dischargeDurationSec: number;
  wallConstruction: 'standard_drywall' | 'concrete_blockwork' | 'reinforced_concrete';
  allowablePressureLimitPa?: number;
  roomHeightM: number;
  targetHoldTimeMinutes?: number;
}

export interface VentingCalculationResult {
  allowablePeakPressurePa: number;
  peakVolumetricFlowM3S: number;
  requiredFreeVentAreaM2: number;
  requiredFreeVentAreaCm2: number;
  recommendedDamperModel: string;
  isDoubleActingRequired: boolean;
  doorFanTestHoldTimeEstimateMin: number;
  holdTimeCompliance: boolean;
  engineeringRecommendations: string[];
}

export function calculatePressureReliefAndIntegrity(
  input: VentingCalculationInput
): VentingCalculationResult {
  // Determine allowable pressure based on structural wall rating
  let allowablePa = input.allowablePressureLimitPa || 500;
  if (!input.allowablePressureLimitPa) {
    if (input.wallConstruction === 'standard_drywall') allowablePa = 300; // 300 Pa (3 mbar)
    else if (input.wallConstruction === 'concrete_blockwork') allowablePa = 600; // 600 Pa
    else allowablePa = 1000; // 1000 Pa for reinforced concrete
  }

  // Peak volumetric flow calculation
  let peakFlowM3S = 0;
  let isDoubleActing = false;

  if (input.systemType === 'inert_gas') {
    // Inert gas: Free gas volume injected over discharge time (typically 60s)
    const inertGasVolM3 = input.totalAgentVolumeOrMass;
    peakFlowM3S = (inertGasVolM3 * 1.25) / input.dischargeDurationSec;
    // Inert gas causes strong positive pressure during discharge, and slight negative pressure upon cool-down
    isDoubleActing = true;
  } else if (input.systemType === 'chemical_clean_agent') {
    // Chemical agent (FM-200 or FK-5-1-12):
    // Discharges rapidly in 10s. Vapor expansion + cooling contraction causes initial negative/positive pressure pulse
    // Approx peak displacement rate
    peakFlowM3S = (input.netVolumeM3 * 0.08) / 10;
    isDoubleActing = true;
  } else {
    // CO2
    peakFlowM3S = (input.netVolumeM3 * 0.05) / Math.max(input.dischargeDurationSec, 30);
    isDoubleActing = false;
  }

  // Orifice vent equation:
  // Av = Q_peak / (Cd * sqrt(2 * dP / rho))
  const Cd = 0.62;
  const rhoAir = 1.2;
  const denominator = Cd * Math.sqrt((2 * allowablePa) / rhoAir);
  const requiredAreaM2 = Math.round((peakFlowM3S / denominator) * 10000) / 10000;
  const requiredAreaCm2 = Math.round(requiredAreaM2 * 10000);

  // Recommended standard pressure relief damper size (e.g. 500x500mm, 600x600mm, etc.)
  let damperModel = 'PRD-300x300 (0.09 m² Free Area)';
  if (requiredAreaM2 > 0.45) {
    damperModel = 'PRD-800x800 Double-Acting Weighted Damper (0.55 m² Free Area)';
  } else if (requiredAreaM2 > 0.25) {
    damperModel = 'PRD-600x600 Double-Acting Weighted Damper (0.32 m² Free Area)';
  } else if (requiredAreaM2 > 0.12) {
    damperModel = 'PRD-500x500 Double-Acting Weighted Damper (0.22 m² Free Area)';
  } else if (requiredAreaM2 > 0.05) {
    damperModel = 'PRD-400x400 Counter-Weighted Damper (0.14 m² Free Area)';
  }

  // Retention hold time door fan test estimate (target 10 minutes)
  const targetHoldTime = input.targetHoldTimeMinutes || 10;
  // Estimated retention time based on room height and volume
  const estHoldTimeMin = Math.round((8 + (input.roomHeightM * 1.5)) * 10) / 10;
  const holdTimeCompliance = estHoldTimeMin >= targetHoldTime;

  const engineeringRecommendations: string[] = [
    `Install gravity-counterbalanced, double-acting pressure relief damper rated for minimum ${requiredAreaM2.toFixed(3)} m² free area.`,
    `Ensure wall aperture structural frame is capable of sustaining allowable differential pressure of ${allowablePa} Pa.`,
    'Penetrations around cable trays, busducts, HVAC ducts, and conduit sleeves must be firestopped with UL-listed elastomeric sealant.',
    `Mandatory Enclosure Integrity Door Fan Test (NFPA 2001 Annex B) must be conducted upon site handover to certify ≥ ${targetHoldTime} min hold time.`,
  ];

  return {
    allowablePeakPressurePa: allowablePa,
    peakVolumetricFlowM3S: Math.round(peakFlowM3S * 100) / 100,
    requiredFreeVentAreaM2: requiredAreaM2,
    requiredFreeVentAreaCm2: requiredAreaCm2,
    recommendedDamperModel: damperModel,
    isDoubleActingRequired: isDoubleActing,
    doorFanTestHoldTimeEstimateMin: estHoldTimeMin,
    holdTimeCompliance,
    engineeringRecommendations,
  };
}
