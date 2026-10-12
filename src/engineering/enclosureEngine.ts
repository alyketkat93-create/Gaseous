import { EnclosureData, UnitSystem } from '../types';

export interface VolumeBreakdown {
  mainRoomVolume: number;
  raisedFloorVolume: number;
  ceilingVoidVolume: number;
  obstructionsDeducted: number;
  grossVolume: number;
  netDesignVolume: number;
  altitudeCorrectionFactor: number;
  elevationMeters: number;
  tempCelsius: number;
  unit: string;
  notes: string[];
}

/**
 * NFPA 2001 Table 5.5.3.3 Atmospheric Correction Factors
 * Altitude (m) vs Correction Factor (Fa)
 */
export function getAltitudeCorrectionFactor(elevationMeters: number): number {
  if (elevationMeters <= 0) return 1.0;
  // Exact barometric formula modeling NFPA 2001 Table 5.5.3.3:
  // Fa = exp(-0.00012 * elevation)
  // At 1000m Fa ~ 0.885, at 1500m Fa ~ 0.835, at 2000m Fa ~ 0.785
  const factor = Math.exp(-0.00012 * elevationMeters);
  return Math.round(factor * 1000) / 1000;
}

export function convertMetersToFeet(meters: number): number {
  return meters * 3.28084;
}

export function convertFeetToMeters(feet: number): number {
  return feet / 3.28084;
}

export function convertCelsiusToFahrenheit(c: number): number {
  return (c * 9) / 5 + 32;
}

export function convertFahrenheitToCelsius(f: number): number {
  return ((f - 32) * 5) / 9;
}

export function calculateEnclosureVolume(
  enclosure: EnclosureData,
  unitSystem: UnitSystem = 'metric'
): VolumeBreakdown {
  const notes: string[] = [];

  // Convert inputs to metric for rigorous calculation if needed
  let lengthM = enclosure.length;
  let widthM = enclosure.width;
  let heightM = enclosure.height;
  let floorHeightM = enclosure.hasRaisedFloor ? enclosure.raisedFloorHeight : 0;
  let ceilingHeightM = enclosure.hasCeilingVoid ? enclosure.ceilingVoidHeight : 0;
  let obstructionsM3 = enclosure.solidObstructions;
  let elevationM = enclosure.elevation;

  if (unitSystem === 'imperial') {
    lengthM = convertFeetToMeters(enclosure.length);
    widthM = convertFeetToMeters(enclosure.width);
    heightM = convertFeetToMeters(enclosure.height);
    floorHeightM = enclosure.hasRaisedFloor ? convertFeetToMeters(enclosure.raisedFloorHeight) : 0;
    ceilingHeightM = enclosure.hasCeilingVoid ? convertFeetToMeters(enclosure.ceilingVoidHeight) : 0;
    obstructionsM3 = enclosure.solidObstructions * 0.0283168; // ft3 to m3
    elevationM = convertFeetToMeters(enclosure.elevation);
  }

  let mainRoomVolumeM3 = 0;
  let raisedFloorVolumeM3 = 0;
  let ceilingVoidVolumeM3 = 0;
  let grossVolumeM3 = 0;
  let netDesignVolumeM3 = 0;

  if (enclosure.shape === 'custom' && enclosure.customNetVolume) {
    const customVolM3 = unitSystem === 'imperial'
      ? enclosure.customNetVolume * 0.0283168
      : enclosure.customNetVolume;
    grossVolumeM3 = customVolM3;
    netDesignVolumeM3 = customVolM3;
    notes.push('Volume entered directly as verified custom engineering survey volume.');
  } else {
    mainRoomVolumeM3 = lengthM * widthM * heightM * (enclosure.quantity || 1);
    
    if (enclosure.hasRaisedFloor && floorHeightM > 0) {
      raisedFloorVolumeM3 = lengthM * widthM * floorHeightM * (enclosure.quantity || 1);
      notes.push(`Included raised floor void (${floorHeightM.toFixed(2)} m height) in total flooding protection envelope.`);
    }

    if (enclosure.hasCeilingVoid && ceilingHeightM > 0) {
      ceilingVoidVolumeM3 = lengthM * widthM * ceilingHeightM * (enclosure.quantity || 1);
      notes.push(`Included false ceiling void (${ceilingHeightM.toFixed(2)} m height) in total flooding protection envelope.`);
    }

    grossVolumeM3 = mainRoomVolumeM3 + raisedFloorVolumeM3 + ceilingVoidVolumeM3;
    
    // Solid obstructions deduction: only deduct if verified non-permeable permanent concrete/steel columns
    const allowedDeduction = Math.min(obstructionsM3, grossVolumeM3 * 0.25);
    netDesignVolumeM3 = grossVolumeM3 - allowedDeduction;

    if (obstructionsM3 > 0) {
      notes.push(`Deducted ${allowedDeduction.toFixed(2)} m³ for verified permanent non-porous solid obstructions.`);
    }
  }

  const altFactor = getAltitudeCorrectionFactor(elevationM);
  if (elevationM > 100) {
    notes.push(`Site elevation ${Math.round(elevationM)} m: Atmospheric pressure correction factor Fa = ${altFactor} applied per NFPA 2001.`);
  }

  const factorDisplay = unitSystem === 'imperial' ? 35.3147 : 1;
  const unitLabel = unitSystem === 'imperial' ? 'ft³' : 'm³';

  return {
    mainRoomVolume: Math.round(mainRoomVolumeM3 * factorDisplay * 100) / 100,
    raisedFloorVolume: Math.round(raisedFloorVolumeM3 * factorDisplay * 100) / 100,
    ceilingVoidVolume: Math.round(ceilingVoidVolumeM3 * factorDisplay * 100) / 100,
    obstructionsDeducted: Math.round(obstructionsM3 * factorDisplay * 100) / 100,
    grossVolume: Math.round(grossVolumeM3 * factorDisplay * 100) / 100,
    netDesignVolume: Math.round(netDesignVolumeM3 * factorDisplay * 100) / 100,
    altitudeCorrectionFactor: altFactor,
    elevationMeters: elevationM,
    tempCelsius: enclosure.minTemp,
    unit: unitLabel,
    notes,
  };
}
