import { Project, ProjectZone, ReviewStatus, SuppressionTechnology, UnitSystem } from '../types';
import { calculateCleanAgent } from '../engineering/cleanAgentEngine';
import { calculateInertGas } from '../engineering/inertGasEngine';
import { calculateCO2 } from '../engineering/co2Engine';
import { calculateAerosol } from '../engineering/aerosolEngine';
import { calculateFoam } from '../engineering/foamEngine';
import { generateDefaultBOQ, calculateCostEstimate } from '../engineering/costingEngine';

export const SEED_PROJECTS: Project[] = [
  {
    id: 'proj-riyadh-dc',
    projectNumber: 'KSA-2024-FP-089',
    projectName: 'Riyadh Tier-IV Hyperscale Data Center - Server Hall 01',
    client: 'Saudi Telecom Infrastructure (STC)',
    consultant: 'Dar Al-Handasah Consultants',
    mainContractor: 'Al-Bawani Contracting Co.',
    location: 'King Abdullah Financial District (KAFD), Riyadh',
    country: 'Saudi Arabia',
    authority: 'Saudi Civil Defense (SBC 801 & NFPA 2001)',
    applicableCodes: ['NFPA 2001 (2022)', 'NFPA 75 (2020)', 'NFPA 72 (2022)', 'SBC 801 (Chapter 9)'],
    designer: 'Aly Ketkat',
    reviewer: 'Eng. Fahad Al-Otaibi, Lead FPE',
    revision: 'Rev 02',
    date: '2024-10-05',
    notes: 'Server hall with cold aisle containment. High-sensitivity smoke detection (VESDA) cross-zoned with analog addressable optical heads.',
    isArchived: false,
    createdAt: '2024-09-12T10:00:00Z',
    updatedAt: '2024-10-05T14:30:00Z',
    zones: [
      {
        id: 'zone-sh01',
        zoneName: 'Main Server Hall 01 & Underfloor Plenum',
        facilityType: 'data_center',
        technology: 'fk5112',
        reviewStatus: 'approved_design_dev',
        enclosure: {
          shape: 'rectangular',
          length: 18.0,
          width: 12.0,
          height: 4.2,
          quantity: 1,
          hasRaisedFloor: true,
          raisedFloorHeight: 0.8,
          hasCeilingVoid: true,
          ceilingVoidHeight: 0.6,
          solidObstructions: 12.5,
          minTemp: 20,
          maxTemp: 32,
          elevation: 612, // Riyadh elevation
          integrityTested: true,
          holdTimeTargetMin: 10,
        },
        boqItems: [],
      },
    ],
    costEstimate: {
      currency: 'SAR',
      materialDirectCost: 185000,
      installationDirectCost: 38000,
      otherDirectCosts: 0,
      subtotalDirect: 223000,
      overheadPercent: 10,
      overheadAmount: 22300,
      profitPercent: 15,
      profitAmount: 36795,
      contingencyPercent: 5,
      contingencyAmount: 11150,
      totalBeforeTax: 293245,
      vatPercent: 15,
      vatAmount: 43987,
      grandTotal: 337232,
    },
    reviewComments: [
      {
        id: 'c1',
        authorName: 'Eng. Fahad Al-Otaibi',
        authorRole: 'Consultant Lead Reviewer',
        createdAt: '2024-10-02',
        comment: 'Altitude correction factor for Riyadh (612m) verified (Fa = 0.93). Ensure pressure relief dampers are double-acting.',
        category: 'code_compliance',
        status: 'resolved',
      },
      {
        id: 'c2',
        authorName: 'Aly Ketkat',
        authorRole: 'Lead Suppression Designer',
        createdAt: '2024-10-04',
        comment: 'Cylinder selection updated to 140L 42-bar seamless cylinders to match Fike Impulse hardware submittal.',
        category: 'engineering',
        status: 'addressed',
      },
    ],
  },
  {
    id: 'proj-cairo-metro',
    projectNumber: 'EGY-2024-NAT-042',
    projectName: 'Cairo Metro Line 4 - Giza Underground Traction Substation',
    client: 'National Authority for Tunnels (NAT)',
    consultant: 'Systra - Khatib & Alami JV',
    mainContractor: 'Arab Contractors (Al Mokawloon Al Arab)',
    location: 'El-Remayah Station, Giza / Greater Cairo',
    country: 'Egypt',
    authority: 'Egyptian Civil Defense & NFPA 12 / NFPA 130',
    applicableCodes: ['NFPA 12 (2022)', 'NFPA 130 (Fixed Guideway)', 'Egyptian Fire Protection Code (Part 4)'],
    designer: 'Eng. Ahmed El-Sayed, MEP',
    reviewer: 'Dr. Eng. Hossam Zaki, Chief Consultant',
    revision: 'Rev 01',
    date: '2024-09-28',
    notes: '220kV Oil-filled step-down transformer room located at depth of -18.5m below ground level. Positive pneumatic siren and mechanical lock-out mandatory.',
    isArchived: false,
    createdAt: '2024-09-15T08:00:00Z',
    updatedAt: '2024-09-28T16:20:00Z',
    zones: [
      {
        id: 'zone-trans-01',
        zoneName: 'Main Transformer Vault #1',
        facilityType: 'transformer_room',
        technology: 'co2_total',
        reviewStatus: 'consultant_review',
        enclosure: {
          shape: 'rectangular',
          length: 14.0,
          width: 8.5,
          height: 5.5,
          quantity: 1,
          hasRaisedFloor: false,
          raisedFloorHeight: 0,
          hasCeilingVoid: false,
          ceilingVoidHeight: 0,
          solidObstructions: 24.0, // Transformer equipment core
          minTemp: 22,
          maxTemp: 45,
          elevation: 25,
          integrityTested: false,
          holdTimeTargetMin: 15,
        },
        boqItems: [],
      },
    ],
    costEstimate: {
      currency: 'EGP',
      materialDirectCost: 1450000,
      installationDirectCost: 320000,
      otherDirectCosts: 0,
      subtotalDirect: 1770000,
      overheadPercent: 12,
      overheadAmount: 212400,
      profitPercent: 15,
      profitAmount: 297360,
      contingencyPercent: 8,
      contingencyAmount: 141600,
      totalBeforeTax: 2421360,
      vatPercent: 14,
      vatAmount: 338990,
      grandTotal: 2760350,
    },
    reviewComments: [
      {
        id: 'c3',
        authorName: 'Dr. Eng. Hossam Zaki',
        authorRole: 'Chief Railway Safety Consultant',
        createdAt: '2024-09-26',
        comment: 'Strict life-safety lock-out valve mandatory due to underground confined space risk. Pre-discharge warning siren must be independent of electrical feed.',
        category: 'code_compliance',
        status: 'open',
      },
    ],
  },
  {
    id: 'proj-aramco-vault',
    projectNumber: 'SAU-ARAMCO-2024-VLT',
    projectName: 'Aramco Dhahran Corporate Archive & Seismic Vault',
    client: 'Saudi Aramco (Loss Prevention Dept)',
    consultant: 'Jacobs Engineering Group',
    mainContractor: 'Nesma & Partners',
    location: 'Core Complex, Dhahran, Eastern Province',
    country: 'Saudi Arabia',
    authority: 'Saudi Aramco Engineering Standards (SAES-M-100) & NFPA 2001',
    applicableCodes: ['NFPA 2001 (2022)', 'NFPA 232 (Records)', 'SAES-B-014', 'SBC 801'],
    designer: 'Eng. Omar Al-Ghamdi, PE',
    reviewer: 'Eng. Khalid Al-Mutairi, Senior LPD Specialist',
    revision: 'Rev 03',
    date: '2024-10-01',
    notes: 'Preservation of irreplaceable seismic log records and historic petroleum exploration charts. Zero chemical residue, pure atmospheric inert gas IG-541 required.',
    isArchived: false,
    createdAt: '2024-08-10T12:00:00Z',
    updatedAt: '2024-10-01T11:00:00Z',
    zones: [
      {
        id: 'zone-vault-01',
        zoneName: 'Seismic Core Log Archives Vault',
        facilityType: 'archive_vault',
        technology: 'inert_ig541',
        reviewStatus: 'approved_for_construction',
        enclosure: {
          shape: 'rectangular',
          length: 16.0,
          width: 10.0,
          height: 3.8,
          quantity: 1,
          hasRaisedFloor: false,
          raisedFloorHeight: 0,
          hasCeilingVoid: false,
          ceilingVoidHeight: 0,
          solidObstructions: 35.0, // High-density rolling archive racks
          minTemp: 18,
          maxTemp: 24,
          elevation: 45,
          integrityTested: true,
          holdTimeTargetMin: 12,
        },
        boqItems: [],
      },
    ],
    costEstimate: {
      currency: 'SAR',
      materialDirectCost: 260000,
      installationDirectCost: 55000,
      otherDirectCosts: 0,
      subtotalDirect: 315000,
      overheadPercent: 8,
      overheadAmount: 25200,
      profitPercent: 12,
      profitAmount: 40824,
      contingencyPercent: 5,
      contingencyAmount: 15750,
      totalBeforeTax: 396774,
      vatPercent: 15,
      vatAmount: 59516,
      grandTotal: 456290,
    },
    reviewComments: [
      {
        id: 'c4',
        authorName: 'Eng. Khalid Al-Mutairi',
        authorRole: 'Aramco LPD Specialist',
        createdAt: '2024-09-30',
        comment: 'Pressure relief damper calculation verified for 0.42 m² free vent area. Approved for construction submittal.',
        category: 'engineering',
        status: 'resolved',
      },
    ],
  },
  {
    id: 'proj-dubai-chem',
    projectNumber: 'UAE-DCD-2024-F41',
    projectName: 'Dubai Logistics City - Flammable Chemical Storage Bund',
    client: 'DP World Logistics UAE',
    consultant: 'AECOM Middle East',
    mainContractor: 'ALEC Engineering & Contracting',
    location: 'Jebel Ali Free Zone (JAFZA) South, Dubai',
    country: 'UAE',
    authority: 'Dubai Civil Defense (DCD) & NFPA 11 / NFPA 30',
    applicableCodes: ['NFPA 11 (2021)', 'NFPA 16 (2024)', 'NFPA 30 (Flammable Liquids)', 'UAE Fire & Life Safety Code'],
    designer: 'Eng. Bilal Kassam',
    reviewer: 'Eng. Tariq Mansoor, Consultant Rep',
    revision: 'Rev 01',
    date: '2024-09-20',
    notes: 'Outdoor diked chemical storage yard. Synthetic Fluorine-Free Foam (SFFF) specified to comply with UAE environmental directives banning persistent PFAS.',
    isArchived: false,
    createdAt: '2024-09-01T09:00:00Z',
    updatedAt: '2024-09-20T10:15:00Z',
    zones: [
      {
        id: 'zone-bund-01',
        zoneName: 'Hydrocarbon Drum Storage Diked Bund',
        facilityType: 'flammable_liquid_tank',
        technology: 'foam',
        reviewStatus: 'review_required',
        enclosure: {
          shape: 'custom',
          length: 25.0,
          width: 18.0,
          height: 1.5,
          quantity: 1,
          hasRaisedFloor: false,
          raisedFloorHeight: 0,
          hasCeilingVoid: false,
          ceilingVoidHeight: 0,
          solidObstructions: 0,
          customNetVolume: 675,
          minTemp: 15,
          maxTemp: 50,
          elevation: 10,
          integrityTested: false,
          holdTimeTargetMin: 30,
        },
        boqItems: [],
      },
    ],
    costEstimate: {
      currency: 'AED',
      materialDirectCost: 310000,
      installationDirectCost: 65000,
      otherDirectCosts: 0,
      subtotalDirect: 375000,
      overheadPercent: 10,
      overheadAmount: 37500,
      profitPercent: 12,
      profitAmount: 49500,
      contingencyPercent: 5,
      contingencyAmount: 18750,
      totalBeforeTax: 480750,
      vatPercent: 5,
      vatAmount: 24037,
      grandTotal: 504787,
    },
    reviewComments: [],
  },
  {
    id: 'proj-red-sea-gen',
    projectNumber: 'KSA-RSI-2024-AER-12',
    projectName: 'Red Sea Global Luxury Island - Emergency Generator Enclosure',
    client: 'Red Sea Global (RSG)',
    consultant: 'WSP Middle East',
    mainContractor: 'El-Seif Engineering Contracting',
    location: 'Shura Island Central Utility Plant, Tabuk Region',
    country: 'Saudi Arabia',
    authority: 'Saudi Civil Defense & RSG Sustainability Code',
    applicableCodes: ['NFPA 2010 (2020)', 'NFPA 37 (Combustion Engines)', 'SBC 801'],
    designer: 'Eng. Zaid Al-Hamad',
    reviewer: 'Eng. Salem Bakhsh, RSG Director',
    revision: 'Rev 00',
    date: '2024-10-08',
    notes: 'Modular acoustic containerized diesel generator set (2500 kVA). Compact space with no room for external high-pressure gas cylinders. Condensed Aerosol selected.',
    isArchived: false,
    createdAt: '2024-10-05T08:00:00Z',
    updatedAt: '2024-10-08T09:45:00Z',
    zones: [
      {
        id: 'zone-gen-01',
        zoneName: 'Generator Container Enclosure #1',
        facilityType: 'electrical_room',
        technology: 'aerosol',
        reviewStatus: 'calc_completed',
        enclosure: {
          shape: 'rectangular',
          length: 12.2,
          width: 3.2,
          height: 3.0,
          quantity: 1,
          hasRaisedFloor: false,
          raisedFloorHeight: 0,
          hasCeilingVoid: false,
          ceilingVoidHeight: 0,
          solidObstructions: 18.0, // Engine block and alternator
          minTemp: 15,
          maxTemp: 48,
          elevation: 5,
          integrityTested: true,
          holdTimeTargetMin: 10,
        },
        boqItems: [],
      },
    ],
    costEstimate: {
      currency: 'SAR',
      materialDirectCost: 48000,
      installationDirectCost: 12000,
      otherDirectCosts: 0,
      subtotalDirect: 60000,
      overheadPercent: 10,
      overheadAmount: 6000,
      profitPercent: 15,
      profitAmount: 9900,
      contingencyPercent: 5,
      contingencyAmount: 3000,
      totalBeforeTax: 78900,
      vatPercent: 15,
      vatAmount: 11835,
      grandTotal: 90735,
    },
    reviewComments: [],
  },
];

// Helper to initialize calculations and BOQ for seed projects
export function initializeProjectCalculations(projects: Project[]): Project[] {
  return projects.map(proj => {
    const updatedZones = proj.zones.map(zone => {
      let calcResult = zone.calcResult;
      if (!calcResult) {
        if (zone.technology === 'fk5112' || zone.technology === 'hfc227ea') {
          calcResult = calculateCleanAgent({
            agent: zone.technology,
            enclosure: zone.enclosure,
            hazardClass: 'class_a_surface',
            designConcentration: zone.technology === 'fk5112' ? 5.3 : 7.0,
            safetyFactorPercent: 20,
            cylinderStoragePressureBar: 42,
            cylinderSizeLitres: 140,
            fillDensityKgL: 0.95,
            pipingStatus: 'preliminary',
          });
        } else if (zone.technology.startsWith('inert_')) {
          calcResult = calculateInertGas({
            gasType: zone.technology as any,
            enclosure: zone.enclosure,
            hazardClass: 'class_a_surface',
            designConcentration: 38.0,
            storagePressureBar: 300,
            cylinderSizeLitres: 80,
            manufacturer: 'Ansul Inergen',
            applicableStandard: 'NFPA 2001 (2022 ed.)',
          });
        } else if (zone.technology === 'co2_total') {
          calcResult = calculateCO2({
            applicationMode: 'total_flooding',
            hazardNature: 'deep_seated',
            deepSeatedType: 'electrical',
            enclosure: zone.enclosure,
            hasUnclosableOpenings: false,
            unclosableOpeningsAreaM2: 0,
            storageType: 'high_pressure',
            cylinderSizeKg: 45,
            applicableStandard: 'NFPA 12 (2022 ed.)',
          });
        } else if (zone.technology === 'aerosol') {
          calcResult = calculateAerosol({
            enclosure: zone.enclosure,
            hazardClass: 'class_a_surface',
            designApplicationDensityGM3: 85,
            safetyFactor: 1.3,
            heightDistributionFactor: 1.0,
            unclosableOpeningsLeakageFactor: 1.0,
            generatorModel: 'FirePro FP-3000',
            generatorCapacityGrams: 3000,
            manufacturer: 'FirePro',
            applicableStandard: 'NFPA 2010 (2020 ed.)',
          });
        } else if (zone.technology === 'foam') {
          calcResult = calculateFoam({
            applicationType: 'bund_spill',
            hazardType: 'hydrocarbon',
            protectedAreaM2: zone.enclosure.length * zone.enclosure.width,
            foamConcentrateType: 'sfff_fluorine_free',
            proportionPercent: 3,
            applicationRateLMinM2: 4.1,
            dischargeDurationMinutes: 30,
            systemOperatingPressureBar: 8,
            manufacturer: 'National Foam',
            applicableStandard: 'NFPA 11 (2021 ed.)',
          });
        }
      }

      // Generate realistic BOQ items if empty
      let boq = zone.boqItems;
      if (!boq || boq.length === 0) {
        const cylCount = (calcResult as any)?.requiredCylinders || (calcResult as any)?.requiredCylinderCount || (calcResult as any)?.requiredCylinders45Kg || (calcResult as any)?.requiredGeneratorsCount || 2;
        const mass = (calcResult as any)?.designAgentMassKg || (calcResult as any)?.totalSuppliedGasVolumeM3 || (calcResult as any)?.totalRequiredCO2Kg || (calcResult as any)?.totalAerosolMassKg || 120;
        boq = generateDefaultBOQ(zone.technology, cylCount, mass, zone.enclosure.length * zone.enclosure.width * zone.enclosure.height, proj.costEstimate.currency);
      }

      return {
        ...zone,
        calcResult,
        boqItems: boq,
      };
    });

    return {
      ...proj,
      zones: updatedZones,
    };
  });
}

const STORAGE_KEY = 'firecalc_pro_projects_v1';

export function loadStoredProjects(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        let changed = false;
        parsed.forEach((p: any) => {
          if (p.designer === 'Eng. Tarek Mansour, PE') {
            p.designer = 'Aly Ketkat';
            changed = true;
          }
          p.activityLog?.forEach((act: any) => {
            if (act.authorName === 'Eng. Tarek Mansour') {
              act.authorName = 'Aly Ketkat';
              changed = true;
            }
          });
        });
        if (changed) {
          saveStoredProjects(parsed);
        }
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading projects from localStorage:', e);
  }
  const initialized = initializeProjectCalculations(SEED_PROJECTS);
  saveStoredProjects(initialized);
  return initialized;
}

export function saveStoredProjects(projects: Project[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (e) {
    console.error('Error saving projects to localStorage:', e);
  }
}
