// FIRECALC PRO - Core Engineering Type Definitions

export type UnitSystem = 'metric' | 'imperial';

export type SystemType =
  | 'fm200'
  | 'fk5112'
  | 'co2'
  | 'aerosol'
  | 'inert_gas'
  | 'foam';

export type SuppressionTechnology =
  | 'hfc227ea'        // FM-200 / HFC-227ea
  | 'fk5112'          // FK-5-1-12 Clean Agent (historically Novec 1230)
  | 'inert_ig541'     // IG-541 Inergen (52% N2, 40% Ar, 8% CO2)
  | 'inert_ig55'      // IG-55 Argonite (50% N2, 50% Ar)
  | 'inert_ig100'     // IG-100 (100% N2)
  | 'inert_ig01'      // IG-01 (100% Ar)
  | 'co2_total'       // CO2 Total Flooding
  | 'co2_local'       // CO2 Local Application
  | 'aerosol'         // Condensed Aerosol (NFPA 2010)
  | 'foam';           // Foam Systems (NFPA 11 / 16)

export type FacilityType =
  | 'data_center'
  | 'server_room'
  | 'electrical_room'
  | 'transformer_room'
  | 'ups_room'
  | 'control_room'
  | 'archive_vault'
  | 'museum_gallery'
  | 'industrial_facility'
  | 'commercial_building'
  | 'warehouse'
  | 'kitchen_hood'
  | 'flammable_liquid_tank'
  | 'other';

export type ReviewStatus =
  | 'draft'
  | 'incomplete_inputs'
  | 'calc_completed'
  | 'preliminary'
  | 'review_required'
  | 'manufacturer_pending'
  | 'consultant_review'
  | 'approved_design_dev'
  | 'approved_for_construction'
  | 'approved';

export interface EnclosureData {
  shape: 'rectangular' | 'multi_space' | 'custom' | 'irregular';
  length: number;           // m or ft
  width: number;            // m or ft
  height: number;           // m or ft
  quantity: number;         // number of identical rooms
  isCombinedEnclosureConfirmed?: boolean; // Confirmation that identical rooms form 1 connected enclosure
  hasRaisedFloor: boolean;
  raisedFloorHeight: number;// m or ft
  hasCeilingVoid: boolean;
  ceilingVoidHeight: number;// m or ft
  solidObstructions: number;// m3 or ft3
  customNetVolume?: number; // m3 or ft3 if custom entered
  
  // Ambient / Atmospheric
  minTemp: number;          // °C or °F
  maxTemp: number;          // °C or °F
  elevation: number;        // m or ft above sea level
  atmosphericPressure?: number; // kPa or psi
  
  // Integrity & Leakage
  leakageAreaCm2?: number;  // Equivalent leakage area cm2
  integrityTested: boolean;
  holdTimeTargetMin: number;// Target hold time in minutes (default 10)
}

export interface CalculationStep {
  step: string;
  formula: string;
  substitution: string;
  result: string;
  reference: string;
}

// ==========================================
// 1. FM-200 (HFC-227ea) SPECIFIC TYPES
// ==========================================
export interface FM200CalcInput {
  enclosure: EnclosureData;
  hazardClass: 'class_a_surface' | 'class_b_flammable' | 'class_c_electrical';
  designConcentration: number; // % (e.g. 7.0% or 7.9% for Class A, 9.0% for Class B)
  safetyFactorPercent: number; // default 20%
  cylinderStoragePressureBar: 25 | 42; // 25 bar (360 psi) or 42 bar (600 psi)
  cylinderModel: string;
  cylinderSizeLitres: number;  // e.g. 52, 106, 147, 180, 343, 450
  fillDensityKgL: number;      // 0.50 to 1.15 kg/L per UL/FM listings
  manufacturer: string;        // Kidde, Fike, Ansul, Chemetron, SEVO, Minimax
  applicableStandard: string;  // NFPA 2001 (2022 ed.)
}

export interface FM200CalcResult {
  agentName: string;
  chemicalName: string;
  grossVolumeM3: number;
  netDesignVolumeM3: number;
  specificVaporVolumeM3Kg: number;
  altitudeCorrectionFactor: number;
  theoreticalAgentMassKg: number;
  designAgentMassKg: number;
  requiredCylinders: number;
  selectedCylinderModel: string;
  cylinderCapacityLitres: number;
  actualAgentPerCylinderKg: number;
  totalSuppliedAgentKg: number;
  fillDensityKgL: number;
  marginSurplusKg: number;
  suppliedDesignConcentration: number;
  maxConcentrationAtMaxTemp: number;
  noaelLimit: number;
  loaelLimit: number;
  isWithinSafetyLimits: boolean;
  isOccupiedSpaceCompliant: boolean;
  dischargeTimeLimitSeconds: number;
  estPressureReliefAreaM2: number;
  verificationStatus: 'verified' | 'incomplete' | 'warning';
  notesAndWarnings: string[];
  calculationSteps: CalculationStep[];
}

// ==========================================
// 2. FK-5-1-12 CLEAN AGENT SPECIFIC TYPES
// ==========================================
export interface FK5112CalcInput {
  enclosure: EnclosureData;
  hazardClass: 'class_a_surface' | 'class_b_flammable' | 'class_c_electrical';
  designConcentration: number; // % (e.g. 5.3% or 5.6% for Class A, 5.9% for Class B)
  safetyFactorPercent: number; // default 20%
  cylinderStoragePressureBar: 25 | 42 | 50; // 25, 42, or 50 bar
  cylinderModel: string;
  cylinderSizeLitres: number;  // 40, 80, 120, 140, 180, 343, 360, 450
  fillDensityKgL: number;      // 0.40 to 1.20 kg/L
  manufacturer: string;
  applicableStandard: string;  // NFPA 2001 (2022 ed.)
}

export interface FK5112CalcResult {
  agentName: string;
  chemicalName: string;
  grossVolumeM3: number;
  netDesignVolumeM3: number;
  specificVaporVolumeM3Kg: number;
  altitudeCorrectionFactor: number;
  theoreticalAgentMassKg: number;
  designAgentMassKg: number;
  requiredCylinders: number;
  selectedCylinderModel: string;
  cylinderCapacityLitres: number;
  actualAgentPerCylinderKg: number;
  totalSuppliedAgentKg: number;
  fillDensityKgL: number;
  marginSurplusKg: number;
  suppliedDesignConcentration: number;
  maxConcentrationAtMaxTemp: number;
  noaelLimit: number;
  loaelLimit: number;
  isWithinSafetyLimits: boolean;
  isOccupiedSpaceCompliant: boolean;
  environmentalScore: {
    gwp: number;
    odp: number;
    atmosphericLifetimeDays: number;
  };
  dischargeTimeLimitSeconds: number;
  estPressureReliefAreaM2: number;
  verificationStatus: 'verified' | 'incomplete' | 'warning';
  notesAndWarnings: string[];
  calculationSteps: CalculationStep[];
}

// ==========================================
// 3. CARBON DIOXIDE (CO2) SPECIFIC TYPES
// ==========================================
export interface CO2CalcInput {
  applicationMode: 'total_flooding' | 'local_application';
  // Total Flooding parameters
  hazardNature: 'surface_fire' | 'deep_seated';
  deepSeatedType?: 'electrical' | 'record_storage' | 'duct_enclosure' | 'fur_storage';
  enclosure: EnclosureData;
  hasUnclosableOpenings: boolean;
  unclosableOpeningsAreaM2: number;
  // Local Application parameters
  localAppMethod?: 'area_method' | 'volume_method';
  hazardSurfaceAreaM2?: number;
  hazardEnvelopeVolumeM3?: number;
  dischargeRateKgMinM2?: number; // 16 to 20 kg/min/m2
  localDischargeDurationSec?: number; // 30s or 60s
  // Storage
  storageType: 'high_pressure' | 'low_pressure_bulk';
  cylinderSizeKg: 45; // 45 kg (68L) cylinders
  applicableStandard: string; // NFPA 12 (2022 ed.)
}

export interface CO2CalcResult {
  applicationMode: 'total_flooding' | 'local_application';
  netVolumeM3: number;
  basicFloodingFactorKgM3: number;
  baseCO2MassKg: number;
  leakageOpeningCompensationKg: number;
  temperatureCorrectionKg: number;
  totalRequiredCO2Kg: number;
  requiredCylinders45Kg: number;
  suppliedCO2MassKg: number;
  calculatedConcentrationPercent: number;
  dischargeTimeLimitSeconds: number;
  lifeSafetyClass: 'immediately_dangerous';
  mandatoryLifeSafetyMeasures: string[];
  verificationStatus: 'verified' | 'incomplete' | 'warning';
  calculationSteps: CalculationStep[];
  notesAndWarnings: string[];
}

// ==========================================
// 4. AEROSOL SPECIFIC TYPES
// ==========================================
export interface AerosolCalcInput {
  enclosure: EnclosureData;
  hazardClass: 'class_a_surface' | 'class_b_flammable' | 'class_c_electrical';
  designApplicationDensityGM3: number; // g/m3 (e.g. 60 to 100 g/m3)
  safetyFactor: number; // min 1.30 per NFPA 2010
  heightDistributionFactor: number; // 1.0 to 1.3 for high ceilings
  unclosableOpeningsLeakageFactor: number; // 1.0 to 1.25
  generatorModel: string;
  generatorCapacityGrams: number;
  manufacturer: string; // FirePro, Stat-X, DSPA, GreenEx
  applicableStandard: string; // NFPA 2010 (2020 ed.)
}

export interface AerosolCalcResult {
  technologyName: string;
  netVolumeM3: number;
  designDensityGM3: number;
  totalAerosolMassKg: number;
  selectedGeneratorModel: string;
  unitCapacityGrams: number;
  requiredGeneratorsCount: number;
  totalSuppliedMassKg: number;
  safeThermalClearanceOutletMeters: number;
  safeClearancePersonnelMeters: number;
  dischargeDurationSeconds: number;
  casingTemperatureC: number;
  verificationStatus: 'verified' | 'incomplete' | 'warning';
  calculationSteps: CalculationStep[];
  notesAndWarnings: string[];
}

// ==========================================
// 5. INERT GAS SPECIFIC TYPES
// ==========================================
export interface InertGasCalcInput {
  gasType: 'inert_ig541' | 'inert_ig55' | 'inert_ig100' | 'inert_ig01';
  enclosure: EnclosureData;
  hazardClass: 'class_a_surface' | 'class_b_flammable' | 'class_c_electrical';
  designConcentration: number; // % (e.g. 38% - 42%)
  storagePressureBar: 200 | 300;
  cylinderSizeLitres: 80 | 140;
  manufacturer: string;
  applicableStandard: string; // NFPA 2001 (2022 ed.)
}

export interface InertGasCalcResult {
  gasName: string;
  gasComposition: string;
  netDesignVolumeM3: number;
  specificVolumeM3Kg: number;
  theoreticalGasVolumeM3: number;
  correctedGasVolumeM3: number;
  storagePressureBar: 200 | 300;
  cylinderSizeLitres: 80 | 140;
  gasYieldPerCylinderM3: number;
  requiredCylinderCount: number;
  totalSuppliedGasVolumeM3: number;
  actualSuppliedConcentration: number;
  postDischargeOxygenPercent: number;
  oxygenSafetyStatus: 'safe_egress' | 'short_exposure_only' | 'immediate_danger';
  postDischargeCarbonDioxidePercent?: number;
  requiredDischargeDurationSeconds: number;
  estPressureReliefVentAreaM2: number;
  peakOverpressureKPa: number;
  verificationStatus: 'verified' | 'incomplete' | 'warning';
  calculationSteps: CalculationStep[];
  notesAndWarnings: string[];
}

// ==========================================
// 6. FOAM SPECIFIC TYPES
// ==========================================
export interface FoamCalcInput {
  applicationType: 'foam_water_sprinkler' | 'spray_deluge' | 'fixed_foam_chamber' | 'bund_spill' | 'sub_surface';
  hazardType: 'hydrocarbon' | 'polar_solvent';
  tankDiameterMeters?: number;
  protectedAreaM2: number;
  foamConcentrateType: 'afff_1' | 'afff_3' | 'afff_6' | 'ar_afff_3x3' | 'ar_afff_3x6' | 'sfff_fluorine_free';
  proportionPercent: number; // 1%, 3%, or 6%
  applicationRateLMinM2: number; // L/min/m2
  dischargeDurationMinutes: number; // min
  systemOperatingPressureBar: number;
  manufacturer: string;
  applicableStandard: string; // NFPA 11 (2021 ed.)
}

export interface FoamCalcResult {
  applicationDescription: string;
  hazardDescription: string;
  protectedAreaM2: number;
  applicationRateLMinM2: number;
  foamSolutionFlowRateLMin: number;
  foamSolutionFlowRateGPM: number;
  totalDischargeDurationMinutes: number;
  totalFoamSolutionLitres: number;
  requiredFoamConcentrateLitres: number;
  requiredWaterVolumeLitres: number;
  recommendedBladderTankCapacityLitres: number;
  proportionerType: string;
  environmentalSuitabilityNote: string;
  verificationStatus: 'verified' | 'incomplete' | 'warning';
  calculationSteps: CalculationStep[];
  notesAndWarnings: string[];
}

// Backwards compatibility legacy CleanAgent types
export interface CleanAgentCalcInput {
  agent: 'hfc227ea' | 'fk5112';
  enclosure: EnclosureData;
  hazardClass: 'class_a_surface' | 'class_b_flammable' | 'class_c_electrical';
  designConcentration: number;
  cupBurnerValue?: number;
  safetyFactorPercent: number;
  cylinderStoragePressureBar: number;
  cylinderSizeLitres: number;
  fillDensityKgL: number;
  pipingStatus: 'preliminary' | 'manufacturer_calculated' | 'approved';
}

export interface CleanAgentCalcResult {
  agentName: string;
  chemicalDesignation: string;
  grossVolumeM3: number;
  netDesignVolumeM3: number;
  specificVaporVolumeM3Kg: number;
  altitudeCorrectionFactor: number;
  theoreticalAgentMassKg: number;
  designAgentMassKg: number;
  requiredCylinders: number;
  selectedCylinderModel: string;
  cylinderCapacityLitres: number;
  actualAgentPerCylinderKg: number;
  totalSuppliedAgentKg: number;
  designConcentrationSupplied: number;
  maxConcentrationAtMaxTemp: number;
  noaelLimit: number;
  loaelLimit: number;
  isWithinSafetyLimits: boolean;
  isOccupiedSpaceCompliant: boolean;
  dischargeTimeLimitSeconds: number;
  estPressureReliefAreaM2: number;
  notesAndWarnings: string[];
  calculationSteps: CalculationStep[];
}

// ==========================================
// UNIFIED CALCULATION RECORD (PERSISTENCE)
// ==========================================
export interface CalculationRecord {
  id: string;
  calcRef: string;
  systemType: SystemType;
  systemName: string;
  applicableStandard: string;
  projectName: string;
  roomName: string;
  designer: string;
  reviewer: string;
  revision: string; // e.g. "Rev 00"
  date: string;
  status: 'draft' | 'preliminary' | 'verified' | 'approved';
  unitSystem: UnitSystem;
  roomConfirmedSingleEnclosure: boolean;
  enclosure: EnclosureData;
  inputs: Record<string, any>;
  results: Record<string, any>;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  revisionHistory?: Array<{
    revision: string;
    date: string;
    designer: string;
    inputs: Record<string, any>;
    results: Record<string, any>;
    notes?: string;
  }>;
}

export interface CompanySettings {
  companyName: string;
  companyDivision: string;
  licenseNumber: string;
  defaultEngineer: string;
  defaultChecker: string;
  defaultUnitSystem: UnitSystem;
  defaultLanguage: 'en' | 'ar';
  disclaimerText: string;
  theme: 'light' | 'dark';
}

// Auxiliary types for other tools
export interface PipeSegment {
  id: string;
  description: string;
  pipeSchedule: 'Schedule 40' | 'Schedule 80';
  nominalDiameterMm: number;
  lengthMeters: number;
  elbow90Count: number;
  elbow45Count: number;
  teeThroughCount: number;
  teeBranchCount: number;
  elevationDifferenceMeters: number;
}

export interface PipingReviewResult {
  totalPhysicalLengthM: number;
  totalEquivalentLengthM: number;
  preliminaryFlowKgS: number;
  estimatedVelocityMS: number;
  preliminaryPressureDropBar: number;
  isVelocityAcceptable: boolean;
  requiredNozzleCountEstimate: number;
  warningNotice: string;
}

export interface BOQItem {
  id: string;
  itemNumber: number;
  category: 'cylinders' | 'valves_nozzles' | 'piping_fittings' | 'controls_detection' | 'venting' | 'services';
  description: string;
  unit: 'EA' | 'M' | 'SET' | 'LOT' | 'KG';
  quantity: number;
  materialUnitPrice: number;
  installationUnitPrice: number;
  totalPrice: number;
  isCalculated: boolean;
}

export interface CostEstimateSummary {
  currency: 'SAR' | 'EGP' | 'AED' | 'USD' | 'EUR';
  materialDirectCost: number;
  installationDirectCost: number;
  otherDirectCosts: number;
  subtotalDirect: number;
  overheadPercent: number;
  overheadAmount: number;
  profitPercent: number;
  profitAmount: number;
  contingencyPercent: number;
  contingencyAmount: number;
  totalBeforeTax: number;
  vatPercent: number;
  vatAmount: number;
  grandTotal: number;
}

export interface ProjectReviewComment {
  id: string;
  authorName: string;
  authorRole: string;
  createdAt: string;
  comment: string;
  category: 'engineering' | 'code_compliance' | 'hydraulic_check' | 'client_approval';
  status: 'open' | 'addressed' | 'resolved';
}

export interface ProjectZone {
  id: string;
  zoneName: string;
  facilityType: FacilityType;
  technology: SuppressionTechnology;
  enclosure: EnclosureData;
  reviewStatus: ReviewStatus;
  calcResult?: any;
  boqItems: BOQItem[];
}

export interface Project {
  id: string;
  projectNumber: string;
  projectName: string;
  client: string;
  consultant: string;
  mainContractor: string;
  location: string;
  country: 'Egypt' | 'Saudi Arabia' | 'UAE' | 'Qatar' | 'Kuwait' | 'Oman' | 'International';
  authority: string;
  applicableCodes: string[];
  designer: string;
  reviewer: string;
  revision: string;
  date: string;
  notes: string;
  zones: ProjectZone[];
  costEstimate: CostEstimateSummary;
  reviewComments: ProjectReviewComment[];
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}
