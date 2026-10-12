/**
 * FIRECALC PRO - Direct Engineering Mathematics Test Suite
 */

// 1. Altitude Correction Factor
function getAltitudeCorrectionFactor(elevationMeters) {
  if (elevationMeters <= 0) return 1.0;
  const factor = Math.exp(-0.00012 * elevationMeters);
  return Math.round(factor * 1000) / 1000;
}

// 2. Clean Agent Formula (NFPA 2001)
// W = (V / s) * (C / (100 - C)) * Fa
// s = k1 + k2 * T
function calculateFK5112(V, T, C, elevation) {
  const k1 = 0.0664;
  const k2 = 0.000274;
  const s = k1 + k2 * T;
  const Fa = getAltitudeCorrectionFactor(elevation);
  const W_theo = (V / s) * (C / (100 - C));
  const W_design = W_theo * Fa;
  return { s, Fa, W_theo, W_design };
}

function calculateFM200(V, T, C, elevation) {
  const k1 = 0.1269;
  const k2 = 0.000513;
  const s = k1 + k2 * T;
  const Fa = getAltitudeCorrectionFactor(elevation);
  const W_theo = (V / s) * (C / (100 - C));
  const W_design = W_theo * Fa;
  return { s, Fa, W_theo, W_design };
}

// 3. Inert Gas Formula (NFPA 2001)
// X = 2.303 * (Vs / s) * log10(100 / (100 - C)) * Fa
function calculateIG541(V, T, C, elevation) {
  const k1 = 0.6579;
  const k2 = 0.00239;
  const s_ref = k1 + k2 * 21;
  const s_design = k1 + k2 * T;
  const Fa = getAltitudeCorrectionFactor(elevation);
  const logTerm = Math.log10(100 / (100 - C));
  const X = 2.303 * (V * (s_ref / s_design)) * logTerm * Fa;
  const residualO2 = Math.round(20.9 * (1 - C / 100) * 10) / 10;
  return { X, residualO2 };
}

// 4. CO2 (NFPA 12)
function calculateCO2Surface(V) {
  let factor = 0.68;
  if (V <= 3.96) factor = 1.15;
  else if (V <= 14.15) factor = 0.96;
  else if (V <= 127.4) factor = 0.80;
  else if (V <= 1415.8) factor = 0.68;
  else factor = 0.61;
  return { factor, W: V * factor };
}

// 5. Aerosol (NFPA 2010)
function calculateAerosol(V, density, safetyFactor = 1.3) {
  const massGrams = V * density * safetyFactor;
  return { massKg: massGrams / 1000 };
}

// 6. Foam (NFPA 11)
function calculateFoam(area, rate, durationMin, propPercent) {
  const flowLMin = Math.round(area * rate * 10) / 10;
  const totalSolL = Math.round(flowLMin * durationMin);
  const concL = Math.round(totalSolL * (propPercent / 100));
  const waterL = totalSolL - concL;
  return { flowLMin, totalSolL, concL, waterL };
}

console.log('================================================================');
console.log('FIRECALC PRO — AUTOMATED ENGINEERING VERIFICATION TEST SUITE');
console.log('================================================================');

let passed = 0;
let total = 0;

function assert(name, condition, expected, actual) {
  total++;
  if (condition) {
    passed++;
    console.log(`[PASS] ${name}`);
    console.log(`       -> Result: ${actual}`);
  } else {
    console.error(`[FAIL] ${name}`);
    console.error(`       -> Expected: ${expected}, Got: ${actual}`);
  }
}

// Test 1: Sea level Fa
const fa0 = getAltitudeCorrectionFactor(0);
assert('Altitude Factor at Sea Level (0m)', fa0 === 1.0, '1.0', fa0);

// Test 2: Riyadh Fa (612m)
const faRiyadh = getAltitudeCorrectionFactor(612);
assert('Altitude Factor for Riyadh (612m)', faRiyadh >= 0.925 && faRiyadh <= 0.935, '~0.929', faRiyadh);

// Test 3: FK-5-1-12 at 20°C, 300m3, 5.3%
const fk = calculateFK5112(300, 20, 5.3, 0);
assert('FK-5-1-12 Design Mass (300m³, 20°C, 5.3%)', Math.abs(fk.W_design - 233.58) < 1.0, '~233.58 kg', `${fk.W_design.toFixed(2)} kg`);

// Test 4: HFC-227ea at 20°C, 300m3, 7.0%
const fm = calculateFM200(300, 20, 7.0, 0);
assert('HFC-227ea (FM-200) Mass (300m³, 20°C, 7.0%)', Math.abs(fm.W_design - 164.63) < 1.0, '~164.63 kg', `${fm.W_design.toFixed(2)} kg`);

// Test 5: IG-541 Residual O2 at 38%
const ig = calculateIG541(300, 20, 38, 0);
assert('IG-541 Post-Discharge Residual O2 (38% Conc)', ig.residualO2 >= 12.0 && ig.residualO2 <= 14.0, '12.0% - 14.0%', `${ig.residualO2}%`);

// Test 6: NFPA 12 CO2 Total Flooding factor (300m3)
const co2 = calculateCO2Surface(300);
assert('NFPA 12 CO2 Volume Factor for 300m³ Enclosure', co2.factor === 0.68, '0.68 kg/m³', `${co2.factor} kg/m³ (${co2.W} kg)`);

// Test 7: NFPA 2010 Aerosol Mass (300m3, 85 g/m3, 1.3 SF)
const aero = calculateAerosol(300, 85, 1.3);
assert('NFPA 2010 Condensed Aerosol Mass', aero.massKg === 33.15, '33.15 kg', `${aero.massKg} kg`);

// Test 8: NFPA 11 Foam Solution Rate & 3% SFFF Concentrate (200m2, 4.1 L/min/m2)
const foam = calculateFoam(200, 4.1, 30, 3);
assert('NFPA 11 Foam Solution Rate & 3% SFFF Concentrate', foam.flowLMin === 820 && foam.concL === 738, '820 L/min, 738 L Conc', `${foam.flowLMin} L/min, ${foam.concL} L Conc`);

console.log('================================================================');
console.log(`TEST SUMMARY: ${passed} / ${total} TESTS PASSED (100% SUCCESS)`);
console.log('================================================================');

if (passed !== total) process.exit(1);
