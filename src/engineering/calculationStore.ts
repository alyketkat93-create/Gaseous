import { CalculationRecord, CompanySettings, SystemType } from '../types';
import { calculateFM200 } from './fm200Engine';
import { calculateFK5112 } from './fk5112Engine';
import { calculateCO2 } from './co2Engine';
import { calculateAerosol } from './aerosolEngine';
import { calculateInertGas } from './inertGasEngine';
import { calculateFoam } from './foamEngine';

const STORAGE_CALCULATIONS_KEY = 'firecalc_pro_calculations_v2';
const STORAGE_SETTINGS_KEY = 'firecalc_pro_company_settings_v2';

export const DEFAULT_SETTINGS: CompanySettings = {
  companyName: 'VERTEX Engineering Consultants & Fire Protection Services',
  companyDivision: 'Special Hazards Suppression & Life Safety Division',
  licenseNumber: 'PE-FPE-94021 / SCE Reg: 489210',
  defaultEngineer: 'Aly Ketkat',
  defaultChecker: 'Eng. Fahad Al-Otaibi, Lead FPE',
  defaultUnitSystem: 'metric',
  defaultLanguage: 'en',
  disclaimerText: 'This calculation is prepared using FIRECALC PRO engineering algorithms in accordance with NFPA standards. All final pipe network sizing, nozzle orifice drilling, and flow splits must be verified using manufacturer-specific UL-listed hydraulic calculation software prior to installation.',
  theme: 'light',
};

// Generate realistic seeded calculations for each of the 6 systems
export const SEED_CALCULATIONS: CalculationRecord[] = [
  // 1. FM-200 Seed
  {
    id: 'calc-fm200-server01',
    calcRef: 'CALC-FM200-2026-001',
    systemType: 'fm200',
    systemName: 'FM-200 Fire Suppression System',
    applicableStandard: 'NFPA 2001 (2022 ed.)',
    projectName: 'King Abdullah Financial District (KAFD) Data Center',
    roomName: 'Server Hall 01 (Underfloor & Ceiling Plenum)',
    designer: 'Aly Ketkat',
    reviewer: 'Eng. Fahad Al-Otaibi, Lead FPE',
    revision: 'Rev 01',
    date: '2026-03-15',
    status: 'verified',
    unitSystem: 'metric',
    roomConfirmedSingleEnclosure: true,
    enclosure: {
      shape: 'rectangular',
      length: 14.5,
      width: 10.2,
      height: 3.8,
      quantity: 1,
      isCombinedEnclosureConfirmed: true,
      hasRaisedFloor: true,
      raisedFloorHeight: 0.6,
      hasCeilingVoid: true,
      ceilingVoidHeight: 0.5,
      solidObstructions: 8.5,
      minTemp: 21,
      maxTemp: 32,
      elevation: 612, // Riyadh
      integrityTested: true,
      holdTimeTargetMin: 10,
    },
    inputs: {
      hazardClass: 'class_a_surface',
      designConcentration: 7.9,
      safetyFactorPercent: 20,
      cylinderStoragePressureBar: 25,
      cylinderModel: 'FM-CYL-180L (25 Bar)',
      cylinderSizeLitres: 180,
      fillDensityKgL: 0.95,
      manufacturer: 'Kidde Fenwal Protection',
      applicableStandard: 'NFPA 2001 (2022 ed.)',
    },
    results: calculateFM200({
      enclosure: {
        shape: 'rectangular',
        length: 14.5,
        width: 10.2,
        height: 3.8,
        quantity: 1,
        isCombinedEnclosureConfirmed: true,
        hasRaisedFloor: true,
        raisedFloorHeight: 0.6,
        hasCeilingVoid: true,
        ceilingVoidHeight: 0.5,
        solidObstructions: 8.5,
        minTemp: 21,
        maxTemp: 32,
        elevation: 612,
        integrityTested: true,
        holdTimeTargetMin: 10,
      },
      hazardClass: 'class_a_surface',
      designConcentration: 7.9,
      safetyFactorPercent: 20,
      cylinderStoragePressureBar: 25,
      cylinderModel: 'FM-CYL-180L (25 Bar)',
      cylinderSizeLitres: 180,
      fillDensityKgL: 0.95,
      manufacturer: 'Kidde Fenwal Protection',
      applicableStandard: 'NFPA 2001 (2022 ed.)',
    }),
    notes: 'Primary server hall protected with total flooding FM-200. Enclosure integrity test scheduled following duct damper seals.',
    createdAt: '2026-03-15T09:30:00Z',
    updatedAt: '2026-03-15T14:20:00Z',
    revisionHistory: [
      {
        revision: 'Rev 00',
        date: '2026-03-10',
        designer: 'Aly Ketkat',
        inputs: { designConcentration: 7.0, cylinderSizeLitres: 147 },
        results: {},
        notes: 'Initial preliminary sizing based on architectural schematic drawings.',
      }
    ],
  },

  // 2. FK-5-1-12 Seed
  {
    id: 'calc-fk5112-hyperscale',
    calcRef: 'CALC-FK5112-2026-002',
    systemType: 'fk5112',
    systemName: 'FK-5-1-12 Clean Agent Fire Suppression System',
    applicableStandard: 'NFPA 2001 (2022 ed.)',
    projectName: 'NEOM Cloud Region - DC Building B',
    roomName: 'High-Density AI Cluster Hall 03',
    designer: 'Aly Ketkat',
    reviewer: 'Eng. Michael Vance, Chief FPE',
    revision: 'Rev 02',
    date: '2026-04-02',
    status: 'approved',
    unitSystem: 'metric',
    roomConfirmedSingleEnclosure: true,
    enclosure: {
      shape: 'rectangular',
      length: 20.0,
      width: 15.0,
      height: 4.5,
      quantity: 1,
      isCombinedEnclosureConfirmed: true,
      hasRaisedFloor: true,
      raisedFloorHeight: 0.8,
      hasCeilingVoid: true,
      ceilingVoidHeight: 0.6,
      solidObstructions: 25.0,
      minTemp: 20,
      maxTemp: 30,
      elevation: 150,
      integrityTested: true,
      holdTimeTargetMin: 12,
    },
    inputs: {
      hazardClass: 'class_a_surface',
      designConcentration: 5.6,
      safetyFactorPercent: 20,
      cylinderStoragePressureBar: 42,
      cylinderModel: 'FK-CYL-180L (42 Bar)',
      cylinderSizeLitres: 180,
      fillDensityKgL: 1.0,
      manufacturer: 'Fike Protection Systems (Impulse Valve)',
      applicableStandard: 'NFPA 2001 (2022 ed.)',
    },
    results: calculateFK5112({
      enclosure: {
        shape: 'rectangular',
        length: 20.0,
        width: 15.0,
        height: 4.5,
        quantity: 1,
        isCombinedEnclosureConfirmed: true,
        hasRaisedFloor: true,
        raisedFloorHeight: 0.8,
        hasCeilingVoid: true,
        ceilingVoidHeight: 0.6,
        solidObstructions: 25.0,
        minTemp: 20,
        maxTemp: 30,
        elevation: 150,
        integrityTested: true,
        holdTimeTargetMin: 12,
      },
      hazardClass: 'class_a_surface',
      designConcentration: 5.6,
      safetyFactorPercent: 20,
      cylinderStoragePressureBar: 42,
      cylinderModel: 'FK-CYL-180L (42 Bar)',
      cylinderSizeLitres: 180,
      fillDensityKgL: 1.0,
      manufacturer: 'Fike Protection Systems (Impulse Valve)',
      applicableStandard: 'NFPA 2001 (2022 ed.)',
    }),
    notes: 'Green datacenter design utilizing zero-GWP FK-5-1-12 clean agent. Fike Impulse valve technology selected for long pipe runs.',
    createdAt: '2026-04-01T11:00:00Z',
    updatedAt: '2026-04-02T16:45:00Z',
  },

  // 3. CO2 Total Flooding Seed
  {
    id: 'calc-co2-substation',
    calcRef: 'CALC-CO2-2026-003',
    systemType: 'co2',
    systemName: 'CO2 High-Pressure Total Flooding System',
    applicableStandard: 'NFPA 12 (2022 ed.)',
    projectName: 'Cairo Metro Line 4 - Underground Traction Substation',
    roomName: 'High Voltage Transformer Vault #2 (Unoccupied)',
    designer: 'Eng. Ahmed Zaki, PE',
    reviewer: 'Eng. Fahad Al-Otaibi, Lead FPE',
    revision: 'Rev 00',
    date: '2026-05-18',
    status: 'verified',
    unitSystem: 'metric',
    roomConfirmedSingleEnclosure: true,
    enclosure: {
      shape: 'rectangular',
      length: 12.0,
      width: 8.5,
      height: 4.5,
      quantity: 1,
      isCombinedEnclosureConfirmed: true,
      hasRaisedFloor: false,
      raisedFloorHeight: 0,
      hasCeilingVoid: false,
      ceilingVoidHeight: 0,
      solidObstructions: 15.0,
      minTemp: 25,
      maxTemp: 45,
      elevation: 35,
      integrityTested: true,
      holdTimeTargetMin: 20,
    },
    inputs: {
      applicationMode: 'total_flooding',
      hazardNature: 'deep_seated',
      deepSeatedType: 'electrical',
      hasUnclosableOpenings: true,
      unclosableOpeningsAreaM2: 0.8,
      storageType: 'high_pressure',
      cylinderSizeKg: 45,
      applicableStandard: 'NFPA 12 (2022 ed.)',
    },
    results: calculateCO2({
      applicationMode: 'total_flooding',
      hazardNature: 'deep_seated',
      deepSeatedType: 'electrical',
      enclosure: {
        shape: 'rectangular',
        length: 12.0,
        width: 8.5,
        height: 4.5,
        quantity: 1,
        isCombinedEnclosureConfirmed: true,
        hasRaisedFloor: false,
        raisedFloorHeight: 0,
        hasCeilingVoid: false,
        ceilingVoidHeight: 0,
        solidObstructions: 15.0,
        minTemp: 25,
        maxTemp: 45,
        elevation: 35,
        integrityTested: true,
        holdTimeTargetMin: 20,
      },
      hasUnclosableOpenings: true,
      unclosableOpeningsAreaM2: 0.8,
      storageType: 'high_pressure',
      cylinderSizeKg: 45,
      applicableStandard: 'NFPA 12 (2022 ed.)',
    }),
    notes: 'Unoccupied transformer room with oil-filled electrical equipment. Mandatory lock-out valve, time delay, and warning beacons included.',
    createdAt: '2026-05-18T08:15:00Z',
    updatedAt: '2026-05-18T10:30:00Z',
  },

  // 4. Inert Gas IG-541 Seed
  {
    id: 'calc-ig541-archives',
    calcRef: 'CALC-INERT-2026-004',
    systemType: 'inert_gas',
    systemName: 'IG-541 Inert Gas (Inergen) Suppression System',
    applicableStandard: 'NFPA 2001 (2022 ed.)',
    projectName: 'National Museum Heritage Vault Expansion',
    roomName: 'Manuscripts & Rare Parchments Archive Room',
    designer: 'Aly Ketkat',
    reviewer: 'Eng. Fahad Al-Otaibi, Lead FPE',
    revision: 'Rev 01',
    date: '2026-06-11',
    status: 'verified',
    unitSystem: 'metric',
    roomConfirmedSingleEnclosure: true,
    enclosure: {
      shape: 'rectangular',
      length: 16.0,
      width: 11.0,
      height: 3.5,
      quantity: 1,
      isCombinedEnclosureConfirmed: true,
      hasRaisedFloor: false,
      raisedFloorHeight: 0,
      hasCeilingVoid: false,
      ceilingVoidHeight: 0,
      solidObstructions: 12.0,
      minTemp: 19,
      maxTemp: 24,
      elevation: 612,
      integrityTested: true,
      holdTimeTargetMin: 15,
    },
    inputs: {
      gasType: 'inert_ig541',
      hazardClass: 'class_a_surface',
      designConcentration: 38.0,
      storagePressureBar: 300,
      cylinderSizeLitres: 140,
      manufacturer: 'Johnson Controls / Tyco Ansul INERGEN',
      applicableStandard: 'NFPA 2001 (2022 ed.)',
    },
    results: calculateInertGas({
      gasType: 'inert_ig541',
      enclosure: {
        shape: 'rectangular',
        length: 16.0,
        width: 11.0,
        height: 3.5,
        quantity: 1,
        isCombinedEnclosureConfirmed: true,
        hasRaisedFloor: false,
        raisedFloorHeight: 0,
        hasCeilingVoid: false,
        ceilingVoidHeight: 0,
        solidObstructions: 12.0,
        minTemp: 19,
        maxTemp: 24,
        elevation: 612,
        integrityTested: true,
        holdTimeTargetMin: 15,
      },
      hazardClass: 'class_a_surface',
      designConcentration: 38.0,
      storagePressureBar: 300,
      cylinderSizeLitres: 140,
      manufacturer: 'Johnson Controls / Tyco Ansul INERGEN',
      applicableStandard: 'NFPA 2001 (2022 ed.)',
    }),
    notes: 'Preservation archive with delicate artifacts. IG-541 maintains safe residual oxygen and stimulates breathing while leaving zero residue.',
    createdAt: '2026-06-10T14:00:00Z',
    updatedAt: '2026-06-11T09:10:00Z',
  },

  // 5. Aerosol Seed
  {
    id: 'calc-aerosol-switchgear',
    calcRef: 'CALC-AERO-2026-005',
    systemType: 'aerosol',
    systemName: 'Condensed Aerosol Fire Suppression System',
    applicableStandard: 'NFPA 2010 (2020 ed.)',
    projectName: 'Yanbu Petrochemical Remote Electrical Substation',
    roomName: 'Medium Voltage Switchgear Enclosure #4',
    designer: 'Aly Ketkat',
    reviewer: 'Eng. Fahad Al-Otaibi, Lead FPE',
    revision: 'Rev 00',
    date: '2026-07-20',
    status: 'draft',
    unitSystem: 'metric',
    roomConfirmedSingleEnclosure: true,
    enclosure: {
      shape: 'rectangular',
      length: 8.0,
      width: 5.0,
      height: 3.2,
      quantity: 1,
      isCombinedEnclosureConfirmed: true,
      hasRaisedFloor: false,
      raisedFloorHeight: 0,
      hasCeilingVoid: false,
      ceilingVoidHeight: 0,
      solidObstructions: 4.0,
      minTemp: 25,
      maxTemp: 40,
      elevation: 20,
      integrityTested: false,
      holdTimeTargetMin: 10,
    },
    inputs: {
      hazardClass: 'class_c_electrical',
      designApplicationDensityGM3: 78.0,
      safetyFactor: 1.3,
      heightDistributionFactor: 1.0,
      unclosableOpeningsLeakageFactor: 1.05,
      generatorModel: 'FirePro FP-3000',
      generatorCapacityGrams: 3000,
      manufacturer: 'FirePro Systems Ltd.',
      applicableStandard: 'NFPA 2010 (2020 ed.)',
    },
    results: calculateAerosol({
      enclosure: {
        shape: 'rectangular',
        length: 8.0,
        width: 5.0,
        height: 3.2,
        quantity: 1,
        isCombinedEnclosureConfirmed: true,
        hasRaisedFloor: false,
        raisedFloorHeight: 0,
        hasCeilingVoid: false,
        ceilingVoidHeight: 0,
        solidObstructions: 4.0,
        minTemp: 25,
        maxTemp: 40,
        elevation: 20,
        integrityTested: false,
        holdTimeTargetMin: 10,
      },
      hazardClass: 'class_c_electrical',
      designApplicationDensityGM3: 78.0,
      safetyFactor: 1.3,
      heightDistributionFactor: 1.0,
      unclosableOpeningsLeakageFactor: 1.05,
      generatorModel: 'FirePro FP-3000',
      generatorCapacityGrams: 3000,
      manufacturer: 'FirePro Systems Ltd.',
      applicableStandard: 'NFPA 2010 (2020 ed.)',
    }),
    notes: 'Modular electrical substation. Condensed aerosol eliminates high pressure piping network and storage cylinders.',
    createdAt: '2026-07-20T10:00:00Z',
    updatedAt: '2026-07-20T11:45:00Z',
  },

  // 6. Foam Seed
  {
    id: 'calc-foam-tankfarm',
    calcRef: 'CALC-FOAM-2026-006',
    systemType: 'foam',
    systemName: 'Fixed Foam Chamber & Proportioning System',
    applicableStandard: 'NFPA 11 (2021 ed.)',
    projectName: 'Jeddah Bulk Fuel Terminal Modernization',
    roomName: 'Diesel Storage Tank TK-102 & Dike Bund',
    designer: 'Aly Ketkat',
    reviewer: 'Eng. Fahad Al-Otaibi, Lead FPE',
    revision: 'Rev 01',
    date: '2026-08-04',
    status: 'verified',
    unitSystem: 'metric',
    roomConfirmedSingleEnclosure: true,
    enclosure: {
      shape: 'rectangular',
      length: 22.0,
      width: 22.0,
      height: 12.0,
      quantity: 1,
      isCombinedEnclosureConfirmed: true,
      hasRaisedFloor: false,
      raisedFloorHeight: 0,
      hasCeilingVoid: false,
      ceilingVoidHeight: 0,
      solidObstructions: 0,
      minTemp: 25,
      maxTemp: 45,
      elevation: 12,
      integrityTested: true,
      holdTimeTargetMin: 30,
    },
    inputs: {
      applicationType: 'fixed_foam_chamber',
      hazardType: 'hydrocarbon',
      tankDiameterMeters: 20.0,
      protectedAreaM2: 314.16,
      foamConcentrateType: 'sfff_fluorine_free',
      proportionPercent: 3.0,
      applicationRateLMinM2: 4.1,
      dischargeDurationMinutes: 55,
      systemOperatingPressureBar: 7.0,
      manufacturer: 'Angus Fire / National Foam',
      applicableStandard: 'NFPA 11 (2021 ed.)',
    },
    results: calculateFoam({
      applicationType: 'fixed_foam_chamber',
      hazardType: 'hydrocarbon',
      tankDiameterMeters: 20.0,
      protectedAreaM2: 314.16,
      foamConcentrateType: 'sfff_fluorine_free',
      proportionPercent: 3.0,
      applicationRateLMinM2: 4.1,
      dischargeDurationMinutes: 55,
      systemOperatingPressureBar: 7.0,
      manufacturer: 'Angus Fire / National Foam',
      applicableStandard: 'NFPA 11 (2021 ed.)',
    }),
    notes: '20m diameter cone roof hydrocarbon storage tank. Fluorine-free foam (SFFF) selected per environmental authority directives.',
    createdAt: '2026-08-03T16:00:00Z',
    updatedAt: '2026-08-04T12:00:00Z',
  },
];

// Persistent Store Helpers
export function loadSavedCalculations(): CalculationRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_CALCULATIONS_KEY);
    if (!raw) {
      saveSavedCalculations(SEED_CALCULATIONS);
      return SEED_CALCULATIONS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      let migrated = false;
      const updated = parsed.map((c: CalculationRecord) => {
        if (c.designer === 'Eng. Tarek Mansour, PE') {
          migrated = true;
          return { ...c, designer: 'Aly Ketkat' };
        }
        return c;
      });
      if (migrated) {
        saveSavedCalculations(updated);
      }
      return updated;
    }
    saveSavedCalculations(SEED_CALCULATIONS);
    return SEED_CALCULATIONS;
  } catch (err) {
    console.error('Failed to load calculations from storage:', err);
    return SEED_CALCULATIONS;
  }
}

export function saveSavedCalculations(calculations: CalculationRecord[]): void {
  try {
    localStorage.setItem(STORAGE_CALCULATIONS_KEY, JSON.stringify(calculations));
  } catch (err) {
    console.error('Failed to save calculations to storage:', err);
  }
}

export function loadCompanySettings(): CompanySettings {
  try {
    const raw = localStorage.getItem(STORAGE_SETTINGS_KEY);
    if (!raw) {
      saveCompanySettings(DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    }
    const parsed = JSON.parse(raw);
    if (parsed.defaultEngineer === 'Eng. Tarek Mansour, PE') {
      parsed.defaultEngineer = 'Aly Ketkat';
      saveCompanySettings({ ...DEFAULT_SETTINGS, ...parsed });
    }
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch (err) {
    console.error('Failed to load company settings:', err);
    return DEFAULT_SETTINGS;
  }
}

export function saveCompanySettings(settings: CompanySettings): void {
  try {
    localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save company settings:', err);
  }
}

export function saveCalculationRecord(
  record: CalculationRecord,
  allRecords: CalculationRecord[]
): CalculationRecord[] {
  const existingIdx = allRecords.findIndex(r => r.id === record.id);
  let updated: CalculationRecord[];

  if (existingIdx >= 0) {
    const prev = allRecords[existingIdx];
    // Archive previous version if revision or parameters changed
    const revHistory = prev.revisionHistory || [];
    const isNewRevision = prev.revision !== record.revision;
    
    const nextRecord = {
      ...record,
      updatedAt: new Date().toISOString(),
      revisionHistory: isNewRevision
        ? [
            ...revHistory,
            {
              revision: prev.revision,
              date: prev.date,
              designer: prev.designer,
              inputs: prev.inputs,
              results: prev.results,
              notes: prev.notes,
            },
          ]
        : revHistory,
    };

    updated = allRecords.map(r => (r.id === record.id ? nextRecord : r));
  } else {
    updated = [record, ...allRecords];
  }

  saveSavedCalculations(updated);
  return updated;
}

export function duplicateCalculationRecord(
  sourceId: string,
  allRecords: CalculationRecord[]
): { updatedRecords: CalculationRecord[]; duplicatedRecord: CalculationRecord | null } {
  const target = allRecords.find(r => r.id === sourceId);
  if (!target) return { updatedRecords: allRecords, duplicatedRecord: null };

  const randomSuffix = Math.floor(100 + Math.random() * 900);
  const duplicated: CalculationRecord = {
    ...target,
    id: `calc-${target.systemType}-${Date.now()}`,
    calcRef: `${target.calcRef}-COPY-${randomSuffix}`,
    roomName: `${target.roomName} (Copy)`,
    revision: 'Rev 00',
    date: new Date().toISOString().split('T')[0],
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    revisionHistory: [],
  };

  const updated = [duplicated, ...allRecords];
  saveSavedCalculations(updated);
  return { updatedRecords: updated, duplicatedRecord: duplicated };
}

export function deleteCalculationRecord(
  id: string,
  allRecords: CalculationRecord[]
): CalculationRecord[] {
  const updated = allRecords.filter(r => r.id !== id);
  saveSavedCalculations(updated);
  return updated;
}
