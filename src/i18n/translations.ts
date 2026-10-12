export type Language = 'en' | 'ar';

export interface Translations {
  appName: string;
  appSubtitle: string;
  tagline: string;
  nav: {
    dashboard: string;
    fm200: string;
    fk5112: string;
    co2: string;
    aerosol: string;
    inertGas: string;
    foam: string;
    history: string;
    reports: string;
    settings: string;
    projects: string;
    enclosureCalc: string;
    cleanAgent: string;
    pipingReview: string;
    ventingIntegrity: string;
    equipmentDb: string;
    boqCost: string;
    standards: string;
    landing: string;
  };
  tabs: {
    inputs: string;
    results: string;
    method: string;
    checks: string;
  };
  common: {
    projectName: string;
    roomName: string;
    client: string;
    consultant: string;
    contractor: string;
    location: string;
    status: string;
    revision: string;
    date: string;
    designer: string;
    reviewer: string;
    actions: string;
    calculate: string;
    exportPdf: string;
    exportExcel: string;
    save: string;
    cancel: string;
    delete: string;
    duplicate: string;
    archive: string;
    edit: string;
    view: string;
    open: string;
    metric: string;
    imperial: string;
    units: string;
    verified: string;
    warning: string;
    danger: string;
    notes: string;
    preliminaryNotice: string;
    search: string;
    filter: string;
    all: string;
    standard: string;
    referenceNo: string;
    generateReport: string;
    saveCalculation: string;
    compare: string;
    confirmSingleEnclosure: string;
  };
  statuses: {
    draft: string;
    preliminary: string;
    verified: string;
    approved: string;
    incomplete_inputs: string;
    calc_completed: string;
    review_required: string;
    manufacturer_pending: string;
    consultant_review: string;
    approved_design_dev: string;
    approved_for_construction: string;
  };
  dashboard: {
    welcomeTitle: string;
    welcomeSubtitle: string;
    newCalculation: string;
    savedCount: string;
    draftCount: string;
    usedSystems: string;
    generatedReports: string;
    recentCalculations: string;
    systemsDirectory: string;
    startCalculation: string;
    lastCalculated: string;
    noCalculationsYet: string;
  };
  enclosure: {
    title: string;
    roomGeometry: string;
    length: string;
    width: string;
    height: string;
    grossVolume: string;
    netVolume: string;
    raisedFloor: string;
    ceilingVoid: string;
    solidObstructions: string;
    minTemp: string;
    maxTemp: string;
    elevation: string;
    altitudeFactor: string;
    quantity: string;
    connectedRoomsPrompt: string;
  };
  fm200: {
    title: string;
    subtitle: string;
    sectionA: string;
    sectionB: string;
    sectionC: string;
    hazardClass: string;
    designConc: string;
    specificVolume: string;
    theoreticalMass: string;
    designMass: string;
    cylindersRequired: string;
    cylinderModel: string;
    fillDensity: string;
    actualConc: string;
    noaelStatus: string;
    dischargeTime: string;
    reliefVentArea: string;
  };
  fk5112: {
    title: string;
    subtitle: string;
    sectionA: string;
    sectionB: string;
    sectionC: string;
    hazardClass: string;
    designConc: string;
    specificVolume: string;
    theoreticalMass: string;
    designMass: string;
    cylindersRequired: string;
    cylinderModel: string;
    fillDensity: string;
    environmentalScore: string;
    gwp: string;
    odp: string;
    atmospherictime: string;
    safetyHeadroom: string;
    novecDistinction: string;
  };
  co2: {
    title: string;
    subtitle: string;
    applicationMode: string;
    totalFlooding: string;
    localApplication: string;
    hazardNature: string;
    deepSeatedType: string;
    floodingFactor: string;
    totalCO2Mass: string;
    openingsArea: string;
    hazardArea: string;
    dischargeRate: string;
    localDuration: string;
    cylinders45kg: string;
    lifeSafetyAlert: string;
    mandatorySafeguards: string;
  };
  aerosol: {
    title: string;
    subtitle: string;
    density: string;
    generatorModel: string;
    generatorCount: string;
    totalAerosolMass: string;
    thermalClearance: string;
    combustibleClearance: string;
    personnelClearance: string;
    casingTemperature: string;
    heightFactor: string;
    leakageFactor: string;
  };
  inertGas: {
    title: string;
    subtitle: string;
    gasType: string;
    gasComposition: string;
    storagePressure: string;
    cylinderSize: string;
    freeGasVolume: string;
    cylinderCount: string;
    residualOxygen: string;
    oxygenSafety: string;
    co2Stimulation: string;
    ventArea: string;
  };
  foam: {
    title: string;
    subtitle: string;
    applicationType: string;
    hazardType: string;
    protectedArea: string;
    tankDiameter: string;
    applicationRate: string;
    duration: string;
    concentrateType: string;
    proportionPercent: string;
    solutionFlow: string;
    solutionVolume: string;
    concentrateVolume: string;
    waterVolume: string;
    bladderTank: string;
    pumprequirement: string;
  };
  history: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    filterSystem: string;
    filterStatus: string;
    recordsFound: string;
    noRecords: string;
    compareRevisions: string;
    reopen: string;
    duplicate: string;
    deleteConfirm: string;
    diffTitle: string;
  };
  reports: {
    title: string;
    subtitle: string;
    selectCalculation: string;
    officialHeader: string;
    designBasis: string;
    geometrySummary: string;
    equipmentSchedule: string;
    formulaSteps: string;
    safetyCompliance: string;
    signOff: string;
    preparedBy: string;
    checkedBy: string;
    printSheet: string;
  };
  settings: {
    title: string;
    subtitle: string;
    companyInfo: string;
    companyName: string;
    division: string;
    license: string;
    engineers: string;
    defaultDesigner: string;
    defaultReviewer: string;
    preferences: string;
    unitSystem: string;
    language: string;
    theme: string;
    disclaimer: string;
    dataManagement: string;
    exportBackup: string;
    importBackup: string;
    resetSample: string;
  };
  boq: {
    title: string;
  };
  piping: {
    title: string;
    physicalLength: string;
    equivalentLength: string;
    velocity: string;
    nozzles: string;
  };
  venting: {
    title: string;
  };
}

export const DICTIONARY: Record<Language, Translations> = {
  en: {
    appName: 'FIRECALC PRO',
    appSubtitle: 'Fire Suppression Engineering Calculator',
    tagline: 'Precision in Every Calculation. Confidence in Every Design.',
    nav: {
      dashboard: 'Dashboard',
      fm200: 'FM-200 Calculator',
      fk5112: 'FK-5-1-12 Calculator',
      co2: 'CO2 Calculator',
      aerosol: 'Aerosol Calculator',
      inertGas: 'Inert Gas Calculator',
      foam: 'Foam Calculator',
      history: 'Calculation History',
      reports: 'Engineering Reports',
      settings: 'Settings',
      projects: 'Projects',
      enclosureCalc: 'Enclosure Geometry',
      cleanAgent: 'FM-200 / FK-5-1-12',
      pipingReview: 'Piping & Hydraulics',
      ventingIntegrity: 'Integrity & Dampers',
      equipmentDb: 'Equipment Catalog',
      boqCost: 'BOQ & Costing',
      standards: 'NFPA Standards',
      landing: 'Platform Overview',
    },
    tabs: {
      inputs: 'Calculation Inputs',
      results: 'Calculation Results',
      method: 'Calculation Method',
      checks: 'Engineering Checks',
    },
    common: {
      projectName: 'Project Name',
      roomName: 'Protected Room Name',
      client: 'Client',
      consultant: 'Consultant',
      contractor: 'Main Contractor',
      location: 'Location',
      status: 'Status',
      revision: 'Revision',
      date: 'Date',
      designer: 'Lead Designer',
      reviewer: 'Lead Reviewer',
      actions: 'Actions',
      calculate: 'Recalculate',
      exportPdf: 'Export Engineering Report (PDF)',
      exportExcel: 'Export to Excel (.xlsx)',
      save: 'Save Calculation',
      cancel: 'Cancel',
      delete: 'Delete',
      duplicate: 'Duplicate Calculation',
      archive: 'Archive',
      edit: 'Edit Parameters',
      view: 'View Details',
      open: 'Open Calculator',
      metric: 'Metric (SI - m, kg, bar)',
      imperial: 'Imperial (US - ft, lb, psi)',
      units: 'Units',
      verified: 'Verified Engineering Data',
      warning: 'Engineering Warning',
      danger: 'Critical Life-Safety Hazard',
      notes: 'Engineering Notes & Limitations',
      preliminaryNotice: 'PRELIMINARY ENGINEERING CALCULATION — NOT FOR CONSTRUCTION WITHOUT PROPRIETARY HYDRAULIC SOFTWARE CERTIFICATION',
      search: 'Search by room or project...',
      filter: 'Filter by',
      all: 'All Systems',
      standard: 'Applicable Standard',
      referenceNo: 'Calculation Reference',
      generateReport: 'Generate Engineering Report',
      saveCalculation: 'Save Calculation',
      compare: 'Compare Revisions',
      confirmSingleEnclosure: 'I confirm these identical rooms are physically interconnected and permitted as a single protected enclosure volume per NFPA standards.',
    },
    statuses: {
      draft: 'Draft',
      preliminary: 'Preliminary Sizing',
      verified: 'Verified Complete',
      approved: 'Approved Design',
      incomplete_inputs: 'Incomplete Inputs',
      calc_completed: 'Calculation Completed',
      review_required: 'Engineering Review Required',
      manufacturer_pending: 'Manufacturer Pending',
      consultant_review: 'Consultant Review',
      approved_design_dev: 'Approved for Design Dev',
      approved_for_construction: 'Approved for Construction',
    },
    dashboard: {
      welcomeTitle: 'FIRECALC PRO — Engineering Workspace',
      welcomeSubtitle: 'Dedicated calculation engines for clean agents, CO2, aerosols, inert gases, and foam systems.',
      newCalculation: 'New Calculation',
      savedCount: 'Saved Calculations',
      draftCount: 'Draft Designs',
      usedSystems: 'Active Systems',
      generatedReports: 'Generated Reports',
      recentCalculations: 'Recent Calculations',
      systemsDirectory: 'Fire Suppression Sizing Engines',
      startCalculation: 'Start Calculation',
      lastCalculated: 'Last calculated',
      noCalculationsYet: 'No calculations saved yet. Click Start Calculation to begin.',
    },
    enclosure: {
      title: 'Protected Enclosure Geometry & Atmospheric Conditions',
      roomGeometry: 'Enclosure Dimensions',
      length: 'Length (L)',
      width: 'Width (W)',
      height: 'Height (H)',
      grossVolume: 'Gross Room Volume',
      netVolume: 'Net Design Volume',
      raisedFloor: 'Raised Access Floor Void',
      ceilingVoid: 'False Ceiling Plenum Void',
      solidObstructions: 'Solid Deductions (Columns/Equip)',
      minTemp: 'Min Design Temperature',
      maxTemp: 'Max Expected Temperature',
      elevation: 'Site Elevation',
      altitudeFactor: 'Atmospheric Correction (Fa)',
      quantity: 'Number of Identical Rooms',
      connectedRoomsPrompt: 'Are multiple identical rooms interconnected into one common flood volume?',
    },
    fm200: {
      title: 'FM-200 Fire Suppression Calculator',
      subtitle: 'HFC-227ea total flooding engineering calculation per NFPA 2001.',
      sectionA: 'Section A — Protected Enclosure',
      sectionB: 'Section B — Design Parameters',
      sectionC: 'Section C — Equipment Selection',
      hazardClass: 'Hazard Classification',
      designConc: 'Design Concentration (%)',
      specificVolume: 'Specific Vapor Volume (s)',
      theoreticalMass: 'Theoretical Agent Mass',
      designMass: 'Corrected Design Mass (Fa)',
      cylindersRequired: 'Preliminary Cylinder Count',
      cylinderModel: 'Selected Cylinder Model',
      fillDensity: 'Agent Fill Density (kg/L)',
      actualConc: 'Delivered Concentration',
      noaelStatus: 'NOAEL (9.0%) / LOAEL (10.5%) Check',
      dischargeTime: 'Discharge Duration (10.0s max)',
      reliefVentArea: 'Pressure Relief Vent Area (Est.)',
    },
    fk5112: {
      title: 'FK-5-1-12 Clean Agent Calculator',
      subtitle: 'Clean agent quantity and preliminary cylinder configuration per NFPA 2001.',
      sectionA: 'Section A — Protected Enclosure',
      sectionB: 'Section B — Design Parameters',
      sectionC: 'Section C — Equipment Selection',
      hazardClass: 'Hazard Classification',
      designConc: 'Design Concentration (%)',
      specificVolume: 'Specific Vapor Volume (s)',
      theoreticalMass: 'Theoretical Agent Mass',
      designMass: 'Corrected Design Mass (Fa)',
      cylindersRequired: 'Preliminary Cylinder Count',
      cylinderModel: 'Selected Cylinder Model',
      fillDensity: 'Agent Fill Density (kg/L)',
      environmentalScore: 'Environmental Profile',
      gwp: 'Global Warming Potential (GWP < 1)',
      odp: 'Ozone Depletion Potential (ODP = 0.0)',
      atmospherictime: 'Atmospheric Lifetime (5 Days)',
      safetyHeadroom: 'NOAEL (10.0%) Safety Headroom',
      novecDistinction: 'Note: Chemical specification FK-5-1-12 is distinct from historical 3M Novec 1230 product brand.',
    },
    co2: {
      title: 'Carbon Dioxide Fire Suppression Calculator',
      subtitle: 'CO2 quantity calculation and application-specific design review per NFPA 12.',
      applicationMode: 'Application Mode',
      totalFlooding: 'Total Flooding System',
      localApplication: 'Local Application System',
      hazardNature: 'Hazard Classification',
      deepSeatedType: 'Deep-Seated Hazard Type',
      floodingFactor: 'NFPA 12 Volume Factor',
      totalCO2Mass: 'Total Required CO2 Mass',
      openingsArea: 'Unclosable Openings Area',
      hazardArea: 'Protected Hazard Surface Area',
      dischargeRate: 'Application Rate (kg/min/m²)',
      localDuration: 'Discharge Duration (30s / 60s)',
      cylinders45kg: '45 kg High-Pressure Cylinders',
      lifeSafetyAlert: 'CRITICAL LIFE SAFETY ALERT: CO2 DISCHARGE PRODUCES LETHAL ASPHYXIATING ATMOSPHERE (< 10% O2).',
      mandatorySafeguards: 'Mandatory NFPA 12 Safeguards',
    },
    aerosol: {
      title: 'Aerosol Fire Suppression Calculator',
      subtitle: 'Condensed aerosol requirement and generator selection per NFPA 2010.',
      density: 'Design Application Density (g/m³)',
      generatorModel: 'Selected Generator Model',
      generatorCount: 'Required Generator Units',
      totalAerosolMass: 'Total Condensed Aerosol Mass',
      thermalClearance: 'Safe Thermal Clearances',
      combustibleClearance: 'Clearance to Combustibles',
      personnelClearance: 'Clearance to Egress / Personnel',
      casingTemperature: 'Discharge Casing Temperature',
      heightFactor: 'Height Distribution Factor (fh)',
      leakageFactor: 'Openings Leakage Factor (fv)',
    },
    inertGas: {
      title: 'Inert Gas Fire Suppression Calculator',
      subtitle: 'Inert atmospheric clean agent calculation and room pressure venting per NFPA 2001.',
      gasType: 'Inert Gas Selection',
      gasComposition: 'Chemical Gas Composition',
      storagePressure: 'Storage Working Pressure',
      cylinderSize: 'Cylinder Water Volume',
      freeGasVolume: 'Required Free Gas Volume (X)',
      cylinderCount: 'Preliminary Cylinder Count',
      residualOxygen: 'Post-Discharge Residual Oxygen',
      oxygenSafety: 'Oxygen Inhalation Safety Status',
      co2Stimulation: 'IG-541 Arterial CO2 Stimulation Effect',
      ventArea: 'Pressure Relief Free Vent Area (Av)',
    },
    foam: {
      title: 'Foam Fire Suppression Calculator',
      subtitle: 'Surface area, solution flow rate, and concentrate sizing per NFPA 11.',
      applicationType: 'Foam System Application',
      hazardType: 'Combustible Liquid Hazard',
      protectedArea: 'Protected Surface Area',
      tankDiameter: 'Atmospheric Tank Diameter',
      applicationRate: 'Application Rate (L/min/m²)',
      duration: 'Discharge Duration (Minutes)',
      concentrateType: 'Foam Concentrate Type',
      proportionPercent: 'Proportioning Rate (%)',
      solutionFlow: 'Foam Solution Flow Rate',
      solutionVolume: 'Total Foam Solution Demand',
      concentrateVolume: 'Foam Concentrate Volume (with 10% reserve)',
      waterVolume: 'Dedicated Fire Water Volume',
      bladderTank: 'Bladder Tank Capacity Allocation',
      pumprequirement: 'Fire Pump Flow Requirement',
    },
    history: {
      title: 'Calculation History & Revisions',
      subtitle: 'Search, reopen, compare revisions, duplicate, and manage all saved engineering calculations.',
      searchPlaceholder: 'Search by room name, project, or reference...',
      filterSystem: 'Filter by System',
      filterStatus: 'Filter by Status',
      recordsFound: 'Calculations Found',
      noRecords: 'No saved calculations found matching filter criteria.',
      compareRevisions: 'Compare Revisions',
      reopen: 'Reopen in Calculator',
      duplicate: 'Duplicate',
      deleteConfirm: 'Are you sure you want to delete this calculation record? This action cannot be undone.',
      diffTitle: 'Side-by-Side Revision Comparison',
    },
    reports: {
      title: 'Engineering Calculation Reports',
      subtitle: 'Generate, print, and export stamped technical submittals for civil defense and consultants.',
      selectCalculation: 'Select Calculation for Report',
      officialHeader: 'Official Engineering Submittal Sheet',
      designBasis: 'Design Basis & Regulatory Standards',
      geometrySummary: 'Protected Enclosure Geometry',
      equipmentSchedule: 'Equipment Bill of Materials (BOM)',
      formulaSteps: 'Mathematical Derivation & Formulas',
      safetyCompliance: 'Life Safety & Code Compliance Checks',
      signOff: 'Engineering Sign-Off & Approvals',
      preparedBy: 'Prepared By',
      checkedBy: 'Checked & Approved By',
      printSheet: 'Print Engineering Sheet',
    },
    settings: {
      title: 'Engineering & Company Settings',
      subtitle: 'Configure company header, license details, default units, language, and project data backups.',
      companyInfo: 'Engineering Company & Office Details',
      companyName: 'Consultancy / Company Name',
      division: 'Department / Division',
      license: 'Engineering License / Registration #',
      engineers: 'Default Engineering Signatures',
      defaultDesigner: 'Default Designer (Prepared By)',
      defaultReviewer: 'Default Reviewer (Checked By)',
      preferences: 'Application Preferences',
      unitSystem: 'Default Unit System',
      language: 'Default Language',
      theme: 'Theme Mode',
      disclaimer: 'Standard Report Disclaimer Text',
      dataManagement: 'Backup & Project Data Management',
      exportBackup: 'Export Data Backup (JSON)',
      importBackup: 'Import / Restore JSON',
      resetSample: 'Reset to Seed Calculations',
    },
    boq: {
      title: 'Bill of Quantities & Cost Takeoff',
    },
    piping: {
      title: 'Piping Hydraulic Network Preliminary Review',
      physicalLength: 'Physical Length (m)',
      equivalentLength: 'Total Equivalent Length (m)',
      velocity: 'Max Velocity (m/s)',
      nozzles: 'Nozzle Count',
    },
    venting: {
      title: 'Enclosure Pressure Relief Venting & Integrity Review',
    },
  },
  ar: {
    appName: 'فاير كالك برو',
    appSubtitle: 'حاسبة هندسة أنظمة الإطفاء المتخصصة',
    tagline: 'دقة في كل معادلة. ثقة في كل تصميم هندسي.',
    nav: {
      dashboard: 'لوحة التحكم',
      fm200: 'حاسبة FM-200',
      fk5112: 'حاسبة FK-5-1-12',
      co2: 'حاسبة ثاني أكسيد الكربون',
      aerosol: 'حاسبة الإيروسول',
      inertGas: 'حاسبة الغازات الخاملة',
      foam: 'حاسبة أنظمة الرغوة',
      history: 'سجل الحسابات الهندسية',
      reports: 'التقارير والمذكرات الحسابية',
      settings: 'الإعدادات وبيانات المكتب',
      projects: 'المشاريع',
      enclosureCalc: 'أبعاد الحيز',
      cleanAgent: 'الغازات النظيفة',
      pipingReview: 'شبكات الأنابيب',
      ventingIntegrity: 'تخفيف الضغط واختبار الغرفة',
      equipmentDb: 'كتالوج الأسطوانات والمعدات',
      boqCost: 'جدول الكميات والتسعير',
      standards: 'المكتبة الهندسية وكود NFPA',
      landing: 'نظرة عامة على المنصة',
    },
    tabs: {
      inputs: 'مدخلات الحساب الهندسي',
      results: 'النتائج والمخرجات',
      method: 'المعادلات وطريقة الحساب',
      checks: 'الفحوصات الهندسية واشتراطات الكود',
    },
    common: {
      projectName: 'اسم المشروع',
      roomName: 'اسم الغرفة المحمية',
      client: 'المالك / العميل',
      consultant: 'الاستشاري الهندسي',
      contractor: 'المقاول الرئيسي',
      location: 'موقع المشروع',
      status: 'حالة الاعتماد',
      revision: 'رقم المراجعة',
      date: 'التاريخ',
      designer: 'مهندس التصميم',
      reviewer: 'مهندس المراجعة والاعتماد',
      actions: 'الإجراءات',
      calculate: 'إعادة الحساب',
      exportPdf: 'تصدير المذكرة الحسابية (PDF)',
      exportExcel: 'تصدير إلى إكسيل (.xlsx)',
      save: 'حفظ الحساب',
      cancel: 'إلغاء',
      delete: 'حذف',
      duplicate: 'نسخ الحساب',
      archive: 'أرشفة',
      edit: 'تعديل المعايير',
      view: 'عرض التفاصيل',
      open: 'فتح الحاسبة',
      metric: 'المتري (متر، كجم، بار)',
      imperial: 'الإمبراطوري (قدم، رطل، رطل/بوصة²)',
      units: 'وحدات القياس',
      verified: 'بيانات هندسية معتمدة',
      warning: 'تحذير هندسي',
      danger: 'خطر جسيم على السلامة والحياة',
      notes: 'الملاحظات والاشتراطات الهندسية',
      preliminaryNotice: 'حسابات هندسية أولية — غير صالحة للتنفيذ دون مراجعة البرامج الهيدروليكية المعتمدة من المصنع',
      search: 'بحث باسم الغرفة أو المشروع...',
      filter: 'تصفية حسب',
      all: 'جميع الأنظمة',
      standard: 'الكود المعتمد',
      referenceNo: 'الرقم المرجعي للحساب',
      generateReport: 'إصدار التقرير الهندسي',
      saveCalculation: 'حفظ الحساب',
      compare: 'مقارنة المراجعات',
      confirmSingleEnclosure: 'أؤكد أن هذه الغرف المتطابقة متصلة إنشائياً ومسموح باعتبارها حيزاً مشتركاً واحداً للإغراق الكلي وفقاً لكود NFPA.',
    },
    statuses: {
      draft: 'مسودة',
      preliminary: 'حساب أولي',
      verified: 'مكتمل ومتحقق هندسياً',
      approved: 'معتمد للتنفيذ',
      incomplete_inputs: 'مدخلات غير مكتملة',
      calc_completed: 'اكتملت الحسابات',
      review_required: 'مطلوب مراجعة هندسية',
      manufacturer_pending: 'بانتظار حسابات المصنع',
      consultant_review: 'مراجعة الاستشاري',
      approved_design_dev: 'معتمد للتطوير التصميمي',
      approved_for_construction: 'معتمد للإنشاء والتركيب',
    },
    dashboard: {
      welcomeTitle: 'فاير كالك برو — بيئة العمل الهندسية',
      welcomeSubtitle: 'محركات حسابية متخصصة ومستقلة للغازات النظيفة، ثاني أكسيد الكربون، الإيروسول، الغازات الخاملة وأنظمة الرغوة.',
      newCalculation: 'حساب جديد',
      savedCount: 'الحسابات المحفوظة',
      draftCount: 'المسودات الحالية',
      usedSystems: 'الأنظمة النشطة',
      generatedReports: 'التقارير المصدرة',
      recentCalculations: 'أحدث الحسابات الهندسية',
      systemsDirectory: 'محركات حساب أنظمة الإطفاء المتخصصة',
      startCalculation: 'بدء الحساب',
      lastCalculated: 'آخر حساب:',
      noCalculationsYet: 'لا توجد حسابات محفوظة حالياً. انقر على بدء الحساب للبدء.',
    },
    enclosure: {
      title: 'أبعاد الحيز المحمي والظروف الجوية',
      roomGeometry: 'أبعاد الغرفة الإنشائية',
      length: 'الطول (L)',
      width: 'العرض (W)',
      height: 'الارتفاع (H)',
      grossVolume: 'الحجم الكلي الإجمالي',
      netVolume: 'الحجم الصافي المعتمد للتصميم',
      raisedFloor: 'فراغ الأرضية المرتفعة',
      ceilingVoid: 'فراغ السقف المستعار',
      solidObstructions: 'خصومات الأعمدة والكتل الخرسانية',
      minTemp: 'أدنى درجة حرارة تصميمية',
      maxTemp: 'أقصى درجة حرارة متوقعة',
      elevation: 'الارتفاع عن سطح البحر',
      altitudeFactor: 'معامل تصحيح الضغط الجوي (Fa)',
      quantity: 'عدد الغرف المتطابقة',
      connectedRoomsPrompt: 'هل الغرف المتطابقة متصلة وتشكل حيزاً مشتركاً واحداً؟',
    },
    fm200: {
      title: 'حاسبة نظام الإطفاء FM-200',
      subtitle: 'حساب كمية غاز HFC-227ea للإغراق الكلي وفق كود NFPA 2001.',
      sectionA: 'القسم أ — أبعاد الحيز المحمي',
      sectionB: 'القسم ب — المعايير التصميمية',
      sectionC: 'القسم ج — اختيار الأسطوانات والمعدات',
      hazardClass: 'تصنيف خطورة الحريق',
      designConc: 'التركيز التصميمي (%)',
      specificVolume: 'الحجم البخاري النوعي (s)',
      theoreticalMass: 'كمية الغاز النظرية المطلوبة',
      designMass: 'كمية الغاز المصححة للارتفاع (Fa)',
      cylindersRequired: 'عدد الأسطوانات المطلوب (أولي)',
      cylinderModel: 'سعة وموديل الأسطوانة المختارة',
      fillDensity: 'كثافة التعبئة (كجم/لتر)',
      actualConc: 'التركيز الفعلي المتحقق',
      noaelStatus: 'فحص حدود السمية (NOAEL 9.0% / LOAEL 10.5%)',
      dischargeTime: 'زمن التفريغ الأقصى (10.0 ثوانٍ)',
      reliefVentArea: 'مساحة فتحة تخفيف الضغط التقديرية',
    },
    fk5112: {
      title: 'حاسبة مادة الإطفاء النظيفة FK-5-1-12',
      subtitle: 'حساب كمية المادة النظيفة وترتيب الأسطوانات وفق كود NFPA 2001.',
      sectionA: 'القسم أ — أبعاد الحيز المحمي',
      sectionB: 'القسم ب — المعايير التصميمية',
      sectionC: 'القسم ج — اختيار الأسطوانات والمعدات',
      hazardClass: 'تصنيف خطورة الحريق',
      designConc: 'التركيز التصميمي (%)',
      specificVolume: 'الحجم البخاري النوعي (s)',
      theoreticalMass: 'كمية المادة النظرية المطلوبة',
      designMass: 'كمية المادة المصححة للارتفاع (Fa)',
      cylindersRequired: 'عدد الأسطوانات المطلوب (أولي)',
      cylinderModel: 'سعة وموديل الأسطوانة المختارة',
      fillDensity: 'كثافة التعبئة (كجم/لتر)',
      environmentalScore: 'المؤشرات البيئية',
      gwp: 'معامل الاحترار العالمي (GWP < 1)',
      odp: 'معامل استنفاد الأوزون (ODP = 0.0)',
      atmospherictime: 'العمر في الغلاف الجوي (5 أيام)',
      safetyHeadroom: 'هامش أمان حد السمية (NOAEL 10.0%)',
      novecDistinction: 'تنويه: التسمية الكيميائية المعتمدة هي FK-5-1-12 وهي مستقلة عن الاسم التجاري السابق 3M Novec 1230.',
    },
    co2: {
      title: 'حاسبة نظام الإطفاء بثاني أكسيد الكربون (CO2)',
      subtitle: 'حساب كمية غاز CO2 ومراجعة اشتراطات الأمان والحياة وفق كود NFPA 12.',
      applicationMode: 'نوع التطبيق',
      totalFlooding: 'نظام الإغراق الكلي (Total Flooding)',
      localApplication: 'نظام التطبيق الموضعي (Local Application)',
      hazardNature: 'طبيعة الحريق المحمي',
      deepSeatedType: 'نوع الحريق الغائر (Deep-Seated)',
      floodingFactor: 'معامل الحجم لكود NFPA 12',
      totalCO2Mass: 'إجمالي كمية CO2 المطلوبة',
      openingsArea: 'مساحة الفتحات غير القابلة للغلق',
      hazardArea: 'مساحة السطح المعرض للخطر',
      dischargeRate: 'معدل التدفق (كجم/دقيقة/م²)',
      localDuration: 'مدة التفريغ الموضعي (30 أو 60 ثانية)',
      cylinders45kg: 'عدد أسطوانات 45 كجم عالية الضغط',
      lifeSafetyAlert: 'تحذير حياة وسلامة حرج: تفريغ غاز CO2 يخلق بيئة خانقة وقاتلة فوراً للوجود البشري (نسبة O2 أقل من 10%).',
      mandatorySafeguards: 'اشتراطات الأمان الإلزامية وفق NFPA 12',
    },
    aerosol: {
      title: 'حاسبة نظام الإطفاء بالإيروسول المكثف',
      subtitle: 'حساب كمية الإيروسول المكثف واختيار المولدات وفق كود NFPA 2010.',
      density: 'كثافة التطبيق التصميمية (جرام/م³)',
      generatorModel: 'موديل مولد الإيروسول المختار',
      generatorCount: 'عدد مولدات الإيروسول المطلوبة',
      totalAerosolMass: 'إجمالي كتلة مادة الإيروسول',
      thermalClearance: 'مسافات الأمان الحرارية الإلزامية',
      combustibleClearance: 'المسافة الآمنة عن المواد القابلة للاشتعال',
      personnelClearance: 'المسافة الآمنة عن مسارات الهروب والأفراد',
      casingTemperature: 'درجة حرارة جسم المولد عند التفريغ',
      heightFactor: 'معامل تصحيح ارتفاع السقف (fh)',
      leakageFactor: 'معامل تسريب الفتحات (fv)',
    },
    inertGas: {
      title: 'حاسبة أنظمة الإطفاء بالغازات الخاملة',
      subtitle: 'حساب كمية الغازات الجوية الخاملة وفتحات تخفيف الضغط وفق كود NFPA 2001.',
      gasType: 'نوع الغاز الخامل المختار',
      gasComposition: 'التركيب الغازي الكيميائي',
      storagePressure: 'ضغط التخزين التشغيلي للأسطوانة',
      cylinderSize: 'السعة المائية للأسطوانة (لتر)',
      freeGasVolume: 'حجم الغاز الحر المطلوب (X)',
      cylinderCount: 'عدد الأسطوانات المطلوب (أولي)',
      residualOxygen: 'نسبة الأكسجين المتبقية بعد التفريغ',
      oxygenSafety: 'تصنيف أمان تنفس الأكسجين للإخلاء',
      co2Stimulation: 'تأثير ثاني أكسيد الكربون في IG-541 لتنشيط التنفس',
      ventArea: 'مساحة فتحة تخفيف الضغط الزائد الإلزامية (Av)',
    },
    foam: {
      title: 'حاسبة أنظمة الإطفاء بالرغوة (Foam)',
      subtitle: 'حساب مساحة الحماية ومعدل تدفق المحلول ورغوة الإطفاء وفق كود NFPA 11.',
      applicationType: 'نوع نظام الرغوة',
      hazardType: 'نوع الوقود السائل المعرض للحريق',
      protectedArea: 'مساحة السطح المحمي',
      tankDiameter: 'قطر خزان الوقود الجوي',
      applicationRate: 'معدل تطبيق المحلول (لتر/دقيقة/م²)',
      duration: 'مدة التفريغ المطلوبة (بالدقائق)',
      concentrateType: 'نوع مركز الرغوة (Concentrate)',
      proportionPercent: 'نسبة الخلط والخلط التناسبي (%)',
      solutionFlow: 'معدل تدفق محلول الرغوة الكلي',
      solutionVolume: 'إجمالي حجم محلول الرغوة المطلوب',
      concentrateVolume: 'حجم مركز الرغوة الصافي (مع احتياطي 10%)',
      waterVolume: 'حجم مياه الإطفاء المخصصة المطلوبة',
      bladderTank: 'سعة خزان الضغط الرغوي (Bladder Tank)',
      pumprequirement: 'معدل تدفق مضخة الحريق المطلوب',
    },
    history: {
      title: 'سجل الحسابات والمراجعات الهندسية',
      subtitle: 'البحث، إعادة فتح الحسابات، مقارنة المراجعات، النسخ وإدارة كافة الحسابات المحفوظة.',
      searchPlaceholder: 'بحث باسم الغرفة أو المشروع أو الرقم المرجعي...',
      filterSystem: 'تصفية حسب النظام',
      filterStatus: 'تصفية حسب الحالة',
      recordsFound: 'حسابات تم العثور عليها',
      noRecords: 'لا توجد حسابات مطابقة لمعايير البحث والتصفية.',
      compareRevisions: 'مقارنة المراجعات الهندسية',
      reopen: 'فتح في الحاسبة',
      duplicate: 'نسخ الحساب',
      deleteConfirm: 'هل أنت متأكد من رغبتك في حذف هذا الحساب الهندسي؟ لا يمكن التراجع عن هذا الإجراء.',
      diffTitle: 'مقارنة الفروق بين المراجعات الهندسية جنباً إلى جنب',
    },
    reports: {
      title: 'التقارير والمذكرات الحسابية الهندسية',
      subtitle: 'إصدار وطباعة وتصدير المذكرات الفنية المعتمدة للدفاع المدني والمكاتب الاستشارية.',
      selectCalculation: 'اختر الحساب الهندسي لإصدار التقرير',
      officialHeader: 'المذكرة الحسابية الهندسية الرسمية للاعتماد',
      designBasis: 'الأسس التصميمية والأكواد المعتمدة',
      geometrySummary: 'بيانات وأبعاد الحيز الإنشائي المحمي',
      equipmentSchedule: 'جدول حصر المعدات والأسطوانات (BOM)',
      formulaSteps: 'الاشتقاق الرياضي والمعادلات المطبقة خطوة بخطوة',
      safetyCompliance: 'فحوصات سلامة الحياة والامتثال للكود',
      signOff: 'توقيعات واعتمادات المهندسين المعتمدين',
      preparedBy: 'إعداد المهندس المصمم',
      checkedBy: 'مراجعة واعتماد المهندس الاستشاري',
      printSheet: 'طباعة المذكرة الحسابية',
    },
    settings: {
      title: 'إعدادات المكتب والمنصة الهندسية',
      subtitle: 'تخصيص ترويسة التقارير، بيانات الترخيص، الوحدات الافتراضية، والنسخ الاحتياطي.',
      companyInfo: 'بيانات المكتب الاستشاري / الشركة',
      companyName: 'اسم المكتب الهندسي / الشركة',
      division: 'القسم / الإدارة الهندسية',
      license: 'رقم السجل المهني / ترخيص الهيئة الهندسية',
      engineers: 'التوقيعات الهندسية الافتراضية',
      defaultDesigner: 'المهندس المصمم الافتراضي (إعداد)',
      defaultReviewer: 'المهندس المعتمد الافتراضي (مراجعة)',
      preferences: 'تفضيلات بيئة العمل',
      unitSystem: 'نظام وحدات القياس الافتراضي',
      language: 'اللغة الافتراضية',
      theme: 'المظهر والسمة البصرية',
      disclaimer: 'نص إخلاء المسؤولية المطبوع بالتقارير',
      dataManagement: 'إدارة وتصدير البيانات الهندسية',
      exportBackup: 'تصدير نسخة احتياطية (JSON)',
      importBackup: 'استيراد واستعادة ملف (JSON)',
      resetSample: 'إعادة ضبط الحسابات النموذجية',
    },
    boq: {
      title: 'جدول حصر الكميات والمقايسات التقديرية (BOQ)',
    },
    piping: {
      title: 'المراجعة الهيدروليكية المبدئية لشبكة الأنابيب',
      physicalLength: 'الطول الفعلي (متر)',
      equivalentLength: 'إجمالي الطول المكافئ (متر)',
      velocity: 'السرعة القصوى (م/ث)',
      nozzles: 'عدد الفوهات',
    },
    venting: {
      title: 'مراجعة فتحات تخفيف الضغط وسلامة الحيز',
    },
  },
};
