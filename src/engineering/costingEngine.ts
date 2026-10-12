import { BOQItem, CostEstimateSummary, SuppressionTechnology } from '../types';
import * as XLSX from 'xlsx';

export function generateDefaultBOQ(
  technology: SuppressionTechnology,
  cylinderCount: number = 2,
  agentTotalMassKg: number = 150,
  roomVolumeM3: number = 180,
  currency: CostEstimateSummary['currency'] = 'SAR'
): BOQItem[] {
  // Base rates in SAR (can be scaled for other currencies)
  const currencyRateMultiplier: Record<CostEstimateSummary['currency'], number> = {
    SAR: 1.0,
    AED: 0.98,
    USD: 0.27,
    EGP: 13.2,
    EUR: 0.25,
  };

  const mult = currencyRateMultiplier[currency] || 1.0;

  const items: BOQItem[] = [];
  let itemNum = 1;

  // 1. Agent & Storage Cylinders
  let cylDesc = `UL/FM Seamless Clean Agent Cylinder Assembly filled with ${agentTotalMassKg} kg approved agent, supervisory pressure switch, and valve`;
  let cylUnitPrice = 8500 * mult;
  if (technology === 'inert_ig541' || technology === 'inert_ig55') {
    cylDesc = `UL/FM 80L 300-Bar Inert Gas High-Pressure Cylinder filled with certified gas, discharge valve, and pressure regulator`;
    cylUnitPrice = 6800 * mult;
  } else if (technology === 'co2_total') {
    cylDesc = `UL/FM 45 kg (68L) High Pressure CO2 Cylinder with siphon tube, fast-opening differential valve`;
    cylUnitPrice = 3200 * mult;
  } else if (technology === 'aerosol') {
    cylDesc = `Condensed Aerosol Fire Suppression Generator with solid extinguishant compound and mounting bracket`;
    cylUnitPrice = 2900 * mult;
  } else if (technology === 'foam') {
    cylDesc = `Vertical Carbon Steel Foam Bladder Tank Assembly with internal neoprene rubber bladder & ratio controller`;
    cylUnitPrice = 32000 * mult;
  }

  items.push({
    id: `boq-${itemNum}`,
    itemNumber: itemNum++,
    category: 'cylinders',
    description: cylDesc,
    unit: technology === 'foam' ? 'SET' : 'EA',
    quantity: technology === 'foam' ? 1 : Math.max(1, cylinderCount),
    materialUnitPrice: Math.round(cylUnitPrice),
    installationUnitPrice: Math.round(cylUnitPrice * 0.12),
    totalPrice: 0,
    isCalculated: true,
  });

  // 2. Cylinder Wall Mounting Brackets & Manifold
  if (technology !== 'aerosol') {
    items.push({
      id: `boq-${itemNum}`,
      itemNumber: itemNum++,
      category: 'cylinders',
      description: 'Heavy duty modular unistrut cylinder mounting bracket with rubber padding and clamp bands',
      unit: 'SET',
      quantity: Math.max(1, cylinderCount),
      materialUnitPrice: Math.round(450 * mult),
      installationUnitPrice: Math.round(150 * mult),
      totalPrice: 0,
      isCalculated: true,
    });
  }

  // 3. Actuation and Discharge Equipment
  items.push({
    id: `boq-${itemNum}`,
    itemNumber: itemNum++,
    category: 'valves_nozzles',
    description: 'Electric solenoid actuator (24VDC) with mechanical manual release lever & safety lockout pin',
    unit: 'EA',
    quantity: 1,
    materialUnitPrice: Math.round(1200 * mult),
    installationUnitPrice: Math.round(250 * mult),
    totalPrice: 0,
    isCalculated: true,
  });

  // 4. Discharge Nozzles
  const nozzleCount = Math.max(2, Math.ceil(roomVolumeM3 / 60));
  items.push({
    id: `boq-${itemNum}`,
    itemNumber: itemNum++,
    category: 'valves_nozzles',
    description: 'UL/FM listed brass 360° engineered radial discharge nozzle with custom drilled orifice',
    unit: 'EA',
    quantity: nozzleCount,
    materialUnitPrice: Math.round(380 * mult),
    installationUnitPrice: Math.round(120 * mult),
    totalPrice: 0,
    isCalculated: true,
  });

  // 5. Piping & Fittings (Schedule 40/80 Seamless)
  const estPipeMeters = Math.max(15, Math.round(roomVolumeM3 * 0.15));
  items.push({
    id: `boq-${itemNum}`,
    itemNumber: itemNum++,
    category: 'piping_fittings',
    description: 'ASTM A106 Grade B Schedule 40 seamless steel pipe and 3000# forged steel threaded/welded fittings',
    unit: 'M',
    quantity: estPipeMeters,
    materialUnitPrice: Math.round(180 * mult),
    installationUnitPrice: Math.round(95 * mult),
    totalPrice: 0,
    isCalculated: true,
  });

  // 6. Detection and Releasing Control Panel
  items.push({
    id: `boq-${itemNum}`,
    itemNumber: itemNum++,
    category: 'controls_detection',
    description: 'Microprocessor-based Gas Releasing Fire Alarm Control Panel (Single/Dual hazard) with backup batteries',
    unit: 'SET',
    quantity: 1,
    materialUnitPrice: Math.round(5500 * mult),
    installationUnitPrice: Math.round(1400 * mult),
    totalPrice: 0,
    isCalculated: true,
  });

  // 7. Cross-Zoned Detection Sensors
  const detectorSets = Math.max(2, Math.ceil(roomVolumeM3 / 45));
  items.push({
    id: `boq-${itemNum}`,
    itemNumber: itemNum++,
    category: 'controls_detection',
    description: 'Cross-zoned addressable optical smoke and thermal rate-of-rise detectors with base',
    unit: 'SET',
    quantity: detectorSets * 2,
    materialUnitPrice: Math.round(280 * mult),
    installationUnitPrice: Math.round(90 * mult),
    totalPrice: 0,
    isCalculated: true,
  });

  // 8. Visual & Audible Alarms & Signage
  items.push({
    id: `boq-${itemNum}`,
    itemNumber: itemNum++,
    category: 'controls_detection',
    description: 'Discharge warning signs (bilingual Arabic/English) and dual-tone pre-discharge electronic sounder strobe',
    unit: 'SET',
    quantity: 2,
    materialUnitPrice: Math.round(420 * mult),
    installationUnitPrice: Math.round(110 * mult),
    totalPrice: 0,
    isCalculated: true,
  });

  // 9. Manual Releasing and Abort Stations
  items.push({
    id: `boq-${itemNum}`,
    itemNumber: itemNum++,
    category: 'controls_detection',
    description: 'Yellow gas release manual call point with protective flap and momentary abort switch station',
    unit: 'SET',
    quantity: 1,
    materialUnitPrice: Math.round(490 * mult),
    installationUnitPrice: Math.round(120 * mult),
    totalPrice: 0,
    isCalculated: true,
  });

  // 10. Pressure Relief Damper
  if (technology !== 'foam') {
    items.push({
      id: `boq-${itemNum}`,
      itemNumber: itemNum++,
      category: 'venting',
      description: 'Counter-weighted double-acting pressure relief damper for room overpressure mitigation',
      unit: 'EA',
      quantity: 1,
      materialUnitPrice: Math.round(2400 * mult),
      installationUnitPrice: Math.round(600 * mult),
      totalPrice: 0,
      isCalculated: true,
    });
  }

  // 11. Testing, Commissioning & Room Integrity Door Fan Test
  items.push({
    id: `boq-${itemNum}`,
    itemNumber: itemNum++,
    category: 'services',
    description: 'Enclosure Integrity Door Fan Hold-Time Test (NFPA 2001 Annex B compliant certified report)',
    unit: 'LOT',
    quantity: 1,
    materialUnitPrice: 0,
    installationUnitPrice: Math.round(3500 * mult),
    totalPrice: 0,
    isCalculated: true,
  });

  items.push({
    id: `boq-${itemNum}`,
    itemNumber: itemNum++,
    category: 'services',
    description: 'Engineering shop drawings, hydraulic software calculation submittals, testing & Civil Defense commissioning handover',
    unit: 'LOT',
    quantity: 1,
    materialUnitPrice: 0,
    installationUnitPrice: Math.round(4800 * mult),
    totalPrice: 0,
    isCalculated: true,
  });

  // Calculate totals for each item
  return items.map(item => ({
    ...item,
    totalPrice: (item.materialUnitPrice + item.installationUnitPrice) * item.quantity,
  }));
}

export function calculateCostEstimate(
  items: BOQItem[],
  currency: CostEstimateSummary['currency'] = 'SAR',
  overheadPercent: number = 10,
  profitPercent: number = 15,
  contingencyPercent: number = 5,
  vatPercent: number = 15 // Standard 15% VAT in Saudi Arabia (14% in Egypt, 5% in UAE)
): CostEstimateSummary {
  let materialDirect = 0;
  let installationDirect = 0;

  for (const item of items) {
    materialDirect += item.materialUnitPrice * item.quantity;
    installationDirect += item.installationUnitPrice * item.quantity;
  }

  const subtotalDirect = materialDirect + installationDirect;
  const overheadAmount = Math.round(subtotalDirect * (overheadPercent / 100));
  const profitAmount = Math.round((subtotalDirect + overheadAmount) * (profitPercent / 100));
  const contingencyAmount = Math.round(subtotalDirect * (contingencyPercent / 100));

  const totalBeforeTax = subtotalDirect + overheadAmount + profitAmount + contingencyAmount;
  const vatAmount = Math.round(totalBeforeTax * (vatPercent / 100));
  const grandTotal = totalBeforeTax + vatAmount;

  return {
    currency,
    materialDirectCost: Math.round(materialDirect),
    installationDirectCost: Math.round(installationDirect),
    otherDirectCosts: 0,
    subtotalDirect: Math.round(subtotalDirect),
    overheadPercent,
    overheadAmount,
    profitPercent,
    profitAmount,
    contingencyPercent,
    contingencyAmount,
    totalBeforeTax: Math.round(totalBeforeTax),
    vatPercent,
    vatAmount,
    grandTotal: Math.round(grandTotal),
  };
}

/**
 * Export Bill of Quantities directly to an Excel file (.xlsx)
 */
export function exportBOQToExcel(
  items: BOQItem[],
  summary: CostEstimateSummary,
  projectName: string,
  zoneName: string
): void {
  const workbook = XLSX.utils.book_new();

  // 1. BOQ Line Items Sheet
  const boqData = items.map(item => ({
    'Item #': item.itemNumber,
    'Category': item.category.toUpperCase(),
    'Description': item.description,
    'Unit': item.unit,
    'Qty': item.quantity,
    [`Material Rate (${summary.currency})`]: item.materialUnitPrice,
    [`Installation Rate (${summary.currency})`]: item.installationUnitPrice,
    [`Total Amount (${summary.currency})`]: item.totalPrice,
  }));

  const boqSheet = XLSX.utils.json_to_sheet(boqData);
  XLSX.utils.book_append_sheet(workbook, boqSheet, 'Bill of Quantities');

  // 2. Summary Sheet
  const summaryData = [
    { 'Cost Head': 'Project Name', 'Value': projectName },
    { 'Cost Head': 'Protected Zone', 'Value': zoneName },
    { 'Cost Head': 'Currency', 'Value': summary.currency },
    { 'Cost Head': 'Direct Material Cost', 'Value': summary.materialDirectCost },
    { 'Cost Head': 'Direct Installation & Labor Cost', 'Value': summary.installationDirectCost },
    { 'Cost Head': 'Subtotal Direct Cost', 'Value': summary.subtotalDirect },
    { 'Cost Head': `Overhead (${summary.overheadPercent}%)`, 'Value': summary.overheadAmount },
    { 'Cost Head': `Contractor Profit (${summary.profitPercent}%)`, 'Value': summary.profitAmount },
    { 'Cost Head': `Contingency Reserve (${summary.contingencyPercent}%)`, 'Value': summary.contingencyAmount },
    { 'Cost Head': 'Total Before VAT', 'Value': summary.totalBeforeTax },
    { 'Cost Head': `VAT (${summary.vatPercent}%)`, 'Value': summary.vatAmount },
    { 'Cost Head': 'GRAND TOTAL SELLING PRICE', 'Value': summary.grandTotal },
  ];

  const summarySheet = XLSX.utils.json_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Cost Summary');

  // Trigger download in browser
  const filename = `${projectName.replace(/\s+/g, '_')}_BOQ_${summary.currency}.xlsx`;
  XLSX.writeFile(workbook, filename);
}
