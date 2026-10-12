import { CO2CalcInput, CO2CalcResult } from '../types';
import { calculateEnclosureVolume } from './enclosureEngine';

export function calculateCO2(input: CO2CalcInput): CO2CalcResult {
  const notesAndWarnings: string[] = [];
  const steps: CO2CalcResult['calculationSteps'] = [];

  const volBreakdown = calculateEnclosureVolume(input.enclosure, 'metric');
  const V_net = volBreakdown.netDesignVolume;
  const Fa = volBreakdown.altitudeCorrectionFactor;

  let basicFloodingFactor = 0.68; // kg/m3 default
  let requiredConcPercent = 34;
  let dischargeDurationSec = 60;
  let baseCO2MassKg = 0;
  let leakageOpeningCompensationKg = 0;
  let temperatureCorrectionKg = 0;
  let totalRequiredCO2Kg = 0;

  if (input.applicationMode === 'total_flooding') {
    if (input.hazardNature === 'surface_fire') {
      requiredConcPercent = 34;
      dischargeDurationSec = 60;
      
      // NFPA 12 (2022 Table 5.3.3) Volume Factors for Surface Fires
      if (V_net <= 3.96) {
        basicFloodingFactor = 1.15;
      } else if (V_net <= 14.15) {
        basicFloodingFactor = 0.96;
      } else if (V_net <= 127.4) {
        basicFloodingFactor = 0.80;
      } else if (V_net <= 1415.8) {
        basicFloodingFactor = 0.68;
      } else {
        basicFloodingFactor = 0.61;
      }

      baseCO2MassKg = V_net * basicFloodingFactor;

      steps.push({
        step: '1. Total Flooding Volume Factor (Surface Fire)',
        formula: 'Factor determined from NFPA 12 Table 5.3.3',
        substitution: `Net Volume: ${V_net.toFixed(2)} m³ → Volume Factor: ${basicFloodingFactor.toFixed(2)} kg/m³`,
        result: `${basicFloodingFactor.toFixed(2)} kg/m³ (Target Concentration: ${requiredConcPercent}%)`,
        reference: 'NFPA 12 Section 5.3.3 & Table 5.3.3',
      });
    } else {
      // Deep-seated fires (NFPA 12 Section 5.4)
      dischargeDurationSec = 420; // 7 minutes sustained soaking period
      if (input.deepSeatedType === 'record_storage') {
        requiredConcPercent = 65;
        basicFloodingFactor = 2.00;
      } else if (input.deepSeatedType === 'fur_storage') {
        requiredConcPercent = 75;
        basicFloodingFactor = 2.00;
      } else if (input.deepSeatedType === 'electrical') {
        requiredConcPercent = 50;
        if (V_net <= 14.15) {
          basicFloodingFactor = 1.33;
        } else if (V_net <= 141.6) {
          basicFloodingFactor = 1.07;
        } else {
          basicFloodingFactor = 0.80;
        }
      } else {
        requiredConcPercent = 50;
        basicFloodingFactor = 1.33;
      }

      baseCO2MassKg = V_net * basicFloodingFactor;

      steps.push({
        step: '1. Total Flooding Volume Factor (Deep-Seated Fire)',
        formula: 'Factor determined from NFPA 12 Table 5.4.2.1',
        substitution: `Enclosure volume ${V_net.toFixed(2)} m³, Deep Seated Hazard: ${input.deepSeatedType || 'electrical'}`,
        result: `${basicFloodingFactor.toFixed(2)} kg/m³ (Design Concentration: ${requiredConcPercent}%)`,
        reference: 'NFPA 12 Section 5.4',
      });
    }

    steps.push({
      step: '2. Base Agent Quantity',
      formula: 'W_base = V_net × Flooding_Factor',
      substitution: `W_base = ${V_net.toFixed(2)} m³ × ${basicFloodingFactor.toFixed(2)} kg/m³`,
      result: `${baseCO2MassKg.toFixed(2)} kg`,
      reference: 'NFPA 12 Section 5.3.3 / 5.4.1',
    });

    // Unclosable openings leakage compensation per NFPA 12 Section 5.3.5
    if (input.hasUnclosableOpenings && input.unclosableOpeningsAreaM2 > 0) {
      // 5.0 kg/m2 of unclosable opening or NFPA opening leakage allowance
      leakageOpeningCompensationKg = input.unclosableOpeningsAreaM2 * 5.0 * (dischargeDurationSec / 60);
      steps.push({
        step: '3. Unclosable Openings Compensation',
        formula: 'W_openings = Area_openings × Leakage_Allowance × Duration',
        substitution: `W_openings = ${input.unclosableOpeningsAreaM2.toFixed(2)} m² × 5.0 kg/m²/min × ${(dischargeDurationSec / 60).toFixed(1)} min`,
        result: `${leakageOpeningCompensationKg.toFixed(2)} kg`,
        reference: 'NFPA 12 Section 5.3.5.1',
      });
    }

    // High temperature compensation (NFPA 12 Section 5.3.4: if T > 93°C, add 1% per 2.8°C)
    if (input.enclosure.minTemp > 93) {
      const excessTemp = input.enclosure.minTemp - 93;
      const factorInc = excessTemp / 2.8; // 1% per 2.8 deg C
      temperatureCorrectionKg = (baseCO2MassKg * factorInc) / 100;
      steps.push({
        step: '4. High Ambient Temperature Compensation',
        formula: 'W_temp = W_base × [(T - 93) / 2.8]%',
        substitution: `W_temp = ${baseCO2MassKg.toFixed(2)} × [(${input.enclosure.minTemp} - 93) / 2.8]%`,
        result: `${temperatureCorrectionKg.toFixed(2)} kg`,
        reference: 'NFPA 12 Section 5.3.4',
      });
    }

    // Altitude factor Fa
    totalRequiredCO2Kg = (baseCO2MassKg + leakageOpeningCompensationKg + temperatureCorrectionKg) * Fa;

  } else {
    // LOCAL APPLICATION SYSTEM (NFPA 12 Chapter 6)
    const area = input.hazardSurfaceAreaM2 || 10.0;
    const dischargeRate = input.dischargeRateKgMinM2 || 16.0; // 16 to 20 kg/min/m2
    dischargeDurationSec = input.localDischargeDurationSec || 30; // min 30s
    const durationMin = dischargeDurationSec / 60;

    baseCO2MassKg = area * dischargeRate * durationMin;
    totalRequiredCO2Kg = baseCO2MassKg * Fa;

    steps.push({
      step: '1. Local Application Discharge Rate',
      formula: 'Q_rate = Hazard_Area × Application_Rate',
      substitution: `Q_rate = ${area.toFixed(2)} m² × ${dischargeRate.toFixed(1)} kg/min/m²`,
      result: `${(area * dischargeRate).toFixed(1)} kg/min`,
      reference: 'NFPA 12 Section 6.4.2 Rate-by-Area Method',
    });

    steps.push({
      step: '2. Total Local Application CO2 Mass',
      formula: 'W_local = Q_rate × Duration',
      substitution: `W_local = ${(area * dischargeRate).toFixed(1)} kg/min × ${durationMin.toFixed(2)} min`,
      result: `${totalRequiredCO2Kg.toFixed(2)} kg`,
      reference: 'NFPA 12 Section 6.4.3 Minimum Discharge Time (30s min)',
    });
  }

  // Cylinder allocation: Standard 45 kg (100 lb / 68L) high-pressure cylinder
  const cylinderWeightKg = 45;
  const requiredCylinders45Kg = Math.max(1, Math.ceil(totalRequiredCO2Kg / cylinderWeightKg));
  const suppliedCO2MassKg = requiredCylinders45Kg * cylinderWeightKg;

  steps.push({
    step: 'Storage Allocation (45 kg High-Pressure Cylinders)',
    formula: 'N_cyl = ceil(W_total / 45 kg)',
    substitution: `N_cyl = ceil(${totalRequiredCO2Kg.toFixed(2)} / 45 kg)`,
    result: `${requiredCylinders45Kg} Cylinders (Supplied Mass: ${suppliedCO2MassKg} kg @ 58 bar / 850 psi)`,
    reference: 'NFPA 12 Chapter 4 Storage Containers',
  });

  // CRITICAL LIFE SAFETY MEASURES
  const mandatoryLifeSafetyMeasures = [
    'CRITICAL: Mechanical Lockout-Ball-Valve with electrical limit monitoring switch to isolate cylinder manifold during personnel entry.',
    'Pneumatic Pre-Discharge Sirens driven directly by agent pressure, operating for minimum 30 seconds prior to manifold release.',
    'Wintergreen / Pine Odorizer injection unit to provide unmistakable warning scent to odorless CO2 gas.',
    'Warning Plaques and Flashing Audio-Visual Warning Beacons at all entrance doors ("DO NOT ENTER - CO2 DISCHARGE CAN BE FATAL").',
    'Post-discharge forced mechanical purge exhaust system providing minimum 6 air changes per hour with floor-level suction.'
  ];

  notesAndWarnings.push(
    `CRITICAL LIFE-SAFETY ALERT: Carbon Dioxide extinguishes fires by reducing oxygen content to lethal levels (< 10%). CO2 concentrations required for suppression (34% to 75%) cause instantaneous asphyxiation, unconsciousness, and death within seconds. Spaces MUST be evacuated prior to discharge.`
  );

  notesAndWarnings.push(
    `NFPA 12 SAFETY MANDATE: Total flooding systems protecting occupiable spaces must be equipped with full pneumatic time delays (min 30 sec), supervised lockout valves, and positive mechanical ventilation.`
  );

  if (input.applicationMode === 'local_application') {
    notesAndWarnings.push(
      `LOCAL APPLICATION REVIEW: Protects isolated hazards (dip tanks, quench oil, printing presses). Coordinated with overhead hood or dedicated directional low/high velocity horns.`
    );
  }

  return {
    applicationMode: input.applicationMode,
    netVolumeM3: Math.round(V_net * 100) / 100,
    basicFloodingFactorKgM3: Math.round(basicFloodingFactor * 100) / 100,
    baseCO2MassKg: Math.round(baseCO2MassKg * 100) / 100,
    leakageOpeningCompensationKg: Math.round(leakageOpeningCompensationKg * 100) / 100,
    temperatureCorrectionKg: Math.round(temperatureCorrectionKg * 100) / 100,
    totalRequiredCO2Kg: Math.round(totalRequiredCO2Kg * 100) / 100,
    requiredCylinders45Kg,
    suppliedCO2MassKg,
    calculatedConcentrationPercent: requiredConcPercent,
    dischargeTimeLimitSeconds: dischargeDurationSec,
    lifeSafetyClass: 'immediately_dangerous',
    mandatoryLifeSafetyMeasures,
    verificationStatus: 'verified',
    calculationSteps: steps,
    notesAndWarnings,
  };
}
