import { PipeSegment, PipingReviewResult } from '../types';

export const FITTING_EQUIVALENT_LENGTHS: Record<number, { elbow90: number; elbow45: number; teeThru: number; teeBranch: number; internalDiaMm: number }> = {
  25: { elbow90: 0.64, elbow45: 0.30, teeThru: 0.25, teeBranch: 1.30, internalDiaMm: 26.6 },
  32: { elbow90: 0.85, elbow45: 0.40, teeThru: 0.35, teeBranch: 1.70, internalDiaMm: 35.1 },
  40: { elbow90: 0.98, elbow45: 0.48, teeThru: 0.42, teeBranch: 2.10, internalDiaMm: 40.9 },
  50: { elbow90: 1.37, elbow45: 0.67, teeThru: 0.58, teeBranch: 2.90, internalDiaMm: 52.5 },
  65: { elbow90: 1.74, elbow45: 0.85, teeThru: 0.73, teeBranch: 3.70, internalDiaMm: 62.7 },
  80: { elbow90: 2.29, elbow45: 1.10, teeThru: 0.95, teeBranch: 4.90, internalDiaMm: 77.9 },
  100: { elbow90: 3.20, elbow45: 1.55, teeThru: 1.35, teeBranch: 6.80, internalDiaMm: 102.3 },
  150: { elbow90: 5.12, elbow45: 2.45, teeThru: 2.15, teeBranch: 10.9, internalDiaMm: 154.1 },
};

export function evaluatePipingPreliminary(
  segments: PipeSegment[],
  totalAgentMassKg: number = 200,
  dischargeDurationSec: number = 10
): PipingReviewResult {
  let totalPhysicalLengthM = 0;
  let totalEquivalentLengthM = 0;

  for (const seg of segments) {
    totalPhysicalLengthM += seg.lengthMeters;
    const fitting = FITTING_EQUIVALENT_LENGTHS[seg.nominalDiameterMm] || FITTING_EQUIVALENT_LENGTHS[50];
    
    const fittingsLeq =
      seg.elbow90Count * fitting.elbow90 +
      seg.elbow45Count * fitting.elbow45 +
      seg.teeThroughCount * fitting.teeThru +
      seg.teeBranchCount * fitting.teeBranch;

    totalEquivalentLengthM += seg.lengthMeters + fittingsLeq;
  }

  // Mass flow rate in kg/s
  const preliminaryFlowKgS = Math.round((totalAgentMassKg / dischargeDurationSec) * 10) / 10;

  // Main header diameter check (using first segment or largest diameter)
  const largestDiaMm = Math.max(...segments.map(s => s.nominalDiameterMm), 50);
  const internalDiaM = (FITTING_EQUIVALENT_LENGTHS[largestDiaMm]?.internalDiaMm || 50) / 1000;
  const areaM2 = Math.PI * Math.pow(internalDiaM / 2, 2);

  // Approximate two-phase average mixture density ~ 30 kg/m3
  const avgDensityKgM3 = 30;
  const estimatedVelocityMS = Math.round((preliminaryFlowKgS / (avgDensityKgM3 * areaM2)) * 10) / 10;

  // Typical recommended velocity range in main header is 8 to 25 m/s
  const isVelocityAcceptable = estimatedVelocityMS >= 5 && estimatedVelocityMS <= 35;

  // Approximate Darcy-Weisbach friction estimate (preliminary screening only)
  const preliminaryPressureDropBar = Math.round((0.02 * (totalEquivalentLengthM / internalDiaM) * (avgDensityKgM3 * Math.pow(estimatedVelocityMS, 2) / 2) / 100000) * 10) / 10;

  // Estimated nozzle count based on average 35 m2 per 360° nozzle or 25 kg agent per nozzle
  const requiredNozzleCountEstimate = Math.max(1, Math.ceil(totalAgentMassKg / 30));

  const warningNotice =
    'MANDATORY ENGINEERING NOTICE: This preliminary pipe schedule serves strictly for rough material takeoff and hydraulic feasibility screening. NFPA 2001 and NFPA 12 strictly forbid certifying pipe sizes, terminal nozzle orifices, discharge duration, or split ratios without running verified, manufacturer-approved two-phase hydraulic software calculations (e.g., Fike Flow, Kidde Flow, Jensen Hughes).';

  return {
    totalPhysicalLengthM: Math.round(totalPhysicalLengthM * 10) / 10,
    totalEquivalentLengthM: Math.round(totalEquivalentLengthM * 10) / 10,
    preliminaryFlowKgS,
    estimatedVelocityMS,
    preliminaryPressureDropBar,
    isVelocityAcceptable,
    requiredNozzleCountEstimate,
    warningNotice,
  };
}
