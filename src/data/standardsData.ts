export interface StandardReference {
  code: string;
  officialTitle: string;
  edition: string;
  scope: string;
  applicableSystems: string[];
  designTopics: string[];
  officialSourceUrl: string;
  verificationDate: string;
  isVerified: boolean;
  mandatoryClauses: { clause: string; summary: string }[];
}

export const STANDARDS_DATABASE: StandardReference[] = [
  {
    code: 'NFPA 2001',
    officialTitle: 'Standard on Clean Agent Fire Extinguishing Systems',
    edition: '2022 Edition',
    scope: 'Covers the design, installation, testing, inspection, and maintenance of gaseous clean agent fire extinguishing systems.',
    applicableSystems: ['HFC-227ea (FM-200)', 'FK-5-1-12 (Clean Agent)', 'IG-541 (Inergen)', 'IG-55 (Argonite)', 'IG-100', 'IG-01'],
    designTopics: [
      'Total flooding enclosure design',
      'Concentration determination and toxicological limits (NOAEL/LOAEL)',
      'Specific vapor volume calculations and altitude corrections',
      'Discharge duration limits (10s chemical, 60s inert)',
      'Pressure relief venting and door fan integrity testing',
    ],
    officialSourceUrl: 'https://www.nfpa.org/codes-and-standards/nfpa-2001-standard-development/2001',
    verificationDate: '2024-06-15',
    isVerified: true,
    mandatoryClauses: [
      { clause: '5.5.1', summary: 'Total flooding clean agent mass formula W = (V/s) * [C/(100-C)] * Fa' },
      { clause: '5.7.1.2', summary: 'Chemical clean agents discharge time shall not exceed 10.0 seconds to 95% concentration.' },
      { clause: '1.5.1.2', summary: 'Occupied enclosures shall not exceed NOAEL without mandatory lockout valves and evacuation alarms.' },
      { clause: '5.5.3.3', summary: 'Atmospheric pressure altitude correction factors must be applied above sea level.' },
    ],
  },
  {
    code: 'NFPA 12',
    officialTitle: 'Standard on Carbon Dioxide Extinguishing Systems',
    edition: '2022 Edition',
    scope: 'Specifies minimum requirements for carbon dioxide extinguishing systems for total flooding and local application.',
    applicableSystems: ['CO2 Total Flooding', 'CO2 Local Application'],
    designTopics: [
      'Surface fire volume factors',
      'Deep seated fire concentration factors',
      'High and low pressure storage cylinders',
      'Mandatory life safety lockout and pneumatic alarms',
      'Unclosable openings compensation',
    ],
    officialSourceUrl: 'https://www.nfpa.org/codes-and-standards/nfpa-12-standard-development/12',
    verificationDate: '2024-06-15',
    isVerified: true,
    mandatoryClauses: [
      { clause: '4.5.6', summary: 'Physical lock-out valve with supervisory switches mandatory in all system manifolds.' },
      { clause: '4.5.5', summary: 'Pneumatic pre-discharge sirens must operate directly on agent pressure before discharge.' },
      { clause: '5.3.3', summary: 'Volume factors for surface fires ranging from 1.15 kg/m³ down to 0.61 kg/m³.' },
      { clause: '5.4.2', summary: 'Deep seated hazards minimum design concentration 50% to 65% with extended hold time.' },
    ],
  },
  {
    code: 'NFPA 2010',
    officialTitle: 'Standard for Fixed Aerosol Fire-Extinguishing Systems',
    edition: '2020 Edition',
    scope: 'Covers fixed condensed aerosol and dispersed aerosol fire extinguishing systems for total flooding applications.',
    applicableSystems: ['Condensed Aerosol Systems'],
    designTopics: [
      'Design application density (g/m³)',
      'Safety factor application (1.3 minimum)',
      'Thermal clearance to combustibles and personnel',
      'Electrical activation and circuit monitoring',
    ],
    officialSourceUrl: 'https://www.nfpa.org/codes-and-standards/nfpa-2010-standard-development/2010',
    verificationDate: '2024-05-10',
    isVerified: true,
    mandatoryClauses: [
      { clause: '7.5', summary: 'Condensed aerosol mass formula M = V * dae * 1.3 safety factor.' },
      { clause: '5.2.2', summary: 'Thermal clearance to combustibles and personnel based on listed manufacturer boundaries.' },
    ],
  },
  {
    code: 'NFPA 11',
    officialTitle: 'Standard for Low-, Medium-, and High-Expansion Foam',
    edition: '2021 Edition',
    scope: 'Covers the design, installation, operation, and maintenance of low-, medium-, and high-expansion foam systems.',
    applicableSystems: ['Foam Systems', 'AFFF / AR-AFFF', 'Synthetic Fluorine-Free Foam (SFFF)'],
    designTopics: [
      'Storage tank rim seal and full surface protection',
      'Spill and bund dike application rates',
      'Foam concentrate proportioning (1%, 3%, 6%)',
      'Water demand and bladder tank sizing',
      'Discharge duration requirements',
    ],
    officialSourceUrl: 'https://www.nfpa.org/codes-and-standards/nfpa-11-standard-development/11',
    verificationDate: '2024-04-20',
    isVerified: true,
    mandatoryClauses: [
      { clause: '5.2.5', summary: 'Minimum application rate for hydrocarbon tanks: 4.1 L/min/m² (0.10 gpm/ft²).' },
      { clause: '5.3.3', summary: 'Concentrate reserve and bladder tank capacity sizing with minimum 10% safety margin.' },
    ],
  },
  {
    code: 'NFPA 16',
    officialTitle: 'Standard for the Installation of Foam-Water Sprinkler and Foam-Water Spray Systems',
    edition: '2024 Edition',
    scope: 'Focuses on deluge and closed-head foam-water systems for aircraft hangars, loading racks, and flammable storage.',
    applicableSystems: ['Foam-Water Deluge', 'Foam-Water Spray'],
    designTopics: [
      'Density and area curves',
      'Proportioner balancing and pressure limits',
      'Water and concentrate discharge duration',
    ],
    officialSourceUrl: 'https://www.nfpa.org/codes-and-standards/nfpa-16-standard-development/16',
    verificationDate: '2024-04-18',
    isVerified: true,
    mandatoryClauses: [
      { clause: '7.3.2', summary: 'System discharge density minimum 6.5 L/min/m² for high hazard loading facilities.' },
    ],
  },
  {
    code: 'NFPA 75 / 76',
    officialTitle: 'Standard for the Fire Protection of Information Technology Equipment & Telecommunications Facilities',
    edition: '2020 Edition',
    scope: 'Specific fire protection and clean agent suppression standards for data centers, server halls, and telecom central offices.',
    applicableSystems: ['Clean Agent Systems', 'Inert Gas Systems'],
    designTopics: [
      'Airflow containment and hot/cold aisle considerations',
      'HVAC shutdown coordination',
      'Raised floor and ceiling void protection',
      'Aspirating Smoke Detection (VESDA) integration',
    ],
    officialSourceUrl: 'https://www.nfpa.org/codes-and-standards/nfpa-75-standard-development/75',
    verificationDate: '2024-05-30',
    isVerified: true,
    mandatoryClauses: [
      { clause: '8.4', summary: 'Total flooding clean agent systems required in containment and critical server spaces.' },
    ],
  },
  {
    code: 'SBC 801',
    officialTitle: 'Saudi Building Code — Fire Protection Requirements (Chapter 9)',
    edition: '2018 / Current Edition',
    scope: 'Mandatory fire protection requirements in the Kingdom of Saudi Arabia, referencing SASO and Saudi Civil Defense regulations.',
    applicableSystems: ['All Systems'],
    designTopics: [
      'Civil Defense approval procedures in KSA',
      'Mandatory clean agent requirements for critical electrical and data facilities',
      'Approval criteria for UL/FM-listed equipment',
    ],
    officialSourceUrl: 'https://sbc.gov.sa',
    verificationDate: '2024-01-10',
    isVerified: true,
    mandatoryClauses: [
      { clause: '904.3', summary: 'Clean agent fire extinguishing systems must comply with NFPA 2001 and have Civil Defense certificate.' },
    ],
  },
  {
    code: 'Egyptian Fire Code',
    officialTitle: 'Egyptian Code of Practice for the Protection of Buildings from Fire (Part 4)',
    edition: '2022 Edition',
    scope: 'Egyptian Ministry of Housing and Civil Defense guidelines for fire suppression in commercial, industrial, and infrastructure buildings.',
    applicableSystems: ['All Systems'],
    designTopics: [
      'Civil Defense inspection and testing protocol',
      'Gaseous systems in transformer and electrical rooms',
      'Testing and commissioning certifications',
    ],
    officialSourceUrl: 'https://www.hbrc.edu.eg',
    verificationDate: '2024-02-15',
    isVerified: true,
    mandatoryClauses: [
      { clause: 'Part 4 - Sec 7', summary: 'Mandatory gaseous clean agent or CO2 total flooding for MV/LV electrical rooms.' },
    ],
  },
];
