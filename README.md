# FIRECALC PRO — Fire Suppression Engineering & Design Platform
*Professional Engineering Workspace for Clean Agent, CO2, Inert Gas, Aerosol & Foam Systems*

---

## 1. Overview

**FIRECALC PRO** is a commercial-grade, responsive fire suppression engineering web application designed specifically for **Fire Protection Engineers (FPE)**, **MEP Consultants**, **Contractors**, **Technical Office Engineers**, and **Tendering Estimators** across **Egypt, Saudi Arabia, the GCC, and International markets**.

The platform provides mathematically verified preliminary system sizing, design documentation, pressure relief venting area calculations, quantity takeoffs, cost estimation, and formal engineering submittal reports complying with **NFPA 2001**, **NFPA 12**, **NFPA 2010**, **NFPA 11 / 16**, the **Saudi Building Code (SBC 801)**, and **Egyptian Civil Defense regulations**.

---

## 2. Key Modules & Technical Capabilities

### A. Engineering Dashboard
- Multi-project KPIs (Total Registered Projects, Active Calculations, Protected Enclosures, Pending Reviews).
- Real-time standards ticker and regulatory updates for GCC & Egypt.
- Quick-launch launchpad for specialized sizing modules.
- Engineering activity & audit timeline.

### B. Project & Zone Management
- Multi-zone and multi-system project architecture.
- Fields: Project Name, Client, Consultant, Main Contractor, Location, Authority Having Jurisdiction (AHJ), Designer, Reviewer, Revision Number, Code Editions.
- Search, filter by country (Saudi Arabia, Egypt, UAE, International), filter by approval status, duplicate, archive.

### C. Protected Enclosure Geometry & Atmospheric Engine
- Reusable geometry calculation: Rectangular rooms, multi-space connected volumes, verified custom survey volumes, irregular shapes.
- Sub-spaces: Raised floor plenum void, false ceiling void, permanent solid obstructions deductions.
- Metric (SI) and Imperial (US) unit toggles ($m \leftrightarrow ft$, $m^3 \leftrightarrow ft^3$, $^\circ C \leftrightarrow ^\circ F$).
- Atmospheric barometric correction factor ($F_a$) calculation based on site elevation per **NFPA 2001 Table 5.5.3.3 / Equation**:
  $$F_a = e^{-0.00012 \cdot h}$$
- Visual 2D/3D enclosure cross-section diagram showing protected envelope, plenums, and solid obstructions.

### D. Dedicated Sizing Engines

#### 1. FM-200 (HFC-227ea) & FK-5-1-12 Clean Agents (NFPA 2001)
- Specific vapor volume calculation:
  $$s = k_1 + k_2 \cdot T$$
  - *HFC-227ea*: $k_1 = 0.1269, k_2 = 0.000513$
  - *FK-5-1-12*: $k_1 = 0.0664, k_2 = 0.000274$
- Agent mass equation:
  $$W = \frac{V}{s} \left(\frac{C}{100 - C}\right) \times F_a$$
- Toxicological safety verification at maximum expected enclosure temperature:
  - NOAEL limit check (9.0% for FM-200; 10.0% for FK-5-1-12).
  - LOAEL limit check (10.5%).
- Cylinder bank allocation (40L, 80L, 120L, 140L, 180L, 343L) at 25, 42, or 50 bar.
- Interactive visual cylinder rack representation.

#### 2. Inert Gas Systems (NFPA 2001)
- Dedicated calculations for **IG-541 (Inergen)**, **IG-55 (Argonite)**, **IG-100 (Nitrogen)**, and **IG-01 (Argon)**.
- NFPA 2001 logarithmic volumetric formula:
  $$X = 2.303 \cdot V \cdot \left(\frac{s_{ref}}{s}\right) \cdot \log_{10}\left(\frac{100}{100 - C}\right) \times F_a$$
- Post-discharge residual oxygen content:
  $$O_2\% = 20.9\% \times \left(1 - \frac{C}{100}\right)$$
  - Physiological safety window: $12\% \le O_2 \le 14\%$ (Safe for human egress).
- For IG-541: Post-discharge $CO_2$ respiration stimulant calculation ($3.0\% - 3.5\%$).
- 200-bar and 300-bar storage cylinder sizing (80L and 140L).

#### 3. Carbon Dioxide Systems (NFPA 12)
- Total flooding surface fire ($34\%$) vs deep-seated hazards ($50\%$ electrical, $65\%$ archives).
- Volume factor tables per NFPA 12 Table 5.3.3 ($1.15 \text{ kg/m}^3$ to $0.61 \text{ kg/m}^3$).
- Unclosable openings leakage compensation ($0.24 \text{ kg/m}^2$).
- **Mandatory Life-Safety Protocol**: Supervised lockout ball valves, pneumatic sirens, 30s pre-discharge delay.

#### 4. Condensed Aerosol Systems (NFPA 2010)
- Design application density ($g/m^3$) and 1.3 safety factor:
  $$M = V \times d_{ae} \times 1.3$$
- Selection of FirePro (FP-200, FP-500, FP-1200, FP-3000, FP-5700) and Stat-X (1000E, 2500E) generators.
- Minimum safe thermal clearances to combustibles and personnel.

#### 5. Foam Fire Suppression (NFPA 11 / NFPA 16)
- Foam solution flow rate:
  $$Q_{sol} = \text{Area } (m^2) \times \text{Rate } (L/min/m^2)$$
- Total solution volume demand and water demand.
- Concentrate selection: Synthetic Fluorine-Free Foam (**SFFF - PFAS Free**), AFFF (1%, 3%, 6%), and AR-AFFF.
- Carbon steel bladder tank sizing with minimum 10% reserve.

### E. Piping & Preliminary Hydraulic Review
- Pipe schedule (Schedule 40 / 80 ASTM A106 Grade B).
- Equivalent length calculation ($L_{eq}$) for elbows and branch/run tees.
- Flow velocity screening ($8 - 25 \text{ m/s}$) and friction loss estimate.
- Clear legal disclaimer stating that proprietary software (Fike Flow, Kidde Flow, Jensen Hughes) is required for construction.

### F. Enclosure Integrity & Overpressure Damper Sizing
- Free vent area formula for pressure relief dampers (PRD):
  $$A_v = \frac{Q_{peak}}{C_d \sqrt{\frac{2 \Delta P}{\rho}}}$$
- Enclosure wall strength tolerances (Drywall 300 Pa, Blockwork 600 Pa, Concrete 1000 Pa).
- Door Fan Test hold-time descending interface simulation ($\ge 10 \text{ min}$).

### G. Bill of Quantities (BOQ) & GCC Cost Estimation
- Itemized material and labor lines across equipment, piping, detection, venting, and engineering services.
- Multi-currency support: **SAR**, **AED**, **EGP**, **USD**, **EUR**.
- Adjustable commercial markups: Overhead (%), Profit (%), Contingency (%), VAT (%).
- **Direct Excel Export**: One-click download of `.xlsx` spreadsheet with BOQ items and summary sheets.

### H. NFPA Standards Reference Center
- Verified searchable database covering NFPA 2001, 12, 2010, 11, 16, 15, 13, 72, 70, 75/76, Saudi Building Code SBC 801, and Egyptian Fire Protection Code.
- Direct links to official NFPA catalog.

### I. Branded Engineering Calculation Submittal Reports
- Professional layout formatted for consultant and civil defense submissions.
- Cover metadata, client/consultant blocks, formula substitutions, cylinder schedules, safety verifications, and PE stamp placeholders.
- Native high-resolution print stylesheet and clean PDF output.

### J. Full Localization & RTL
- Complete English and Arabic technical dictionary.
- Dynamic `dir="rtl"` layout switching with tailored Arabic typography (Cairo font).

---

## 3. Technology Stack

- **Frontend Framework**: React 18 / 19 with TypeScript & Vite
- **Styling**: Tailwind CSS with custom engineering palette (Navy, Graphite, Fire Orange, Alarm Red, Verified Green)
- **Icons**: Lucide React
- **Spreadsheet Generation**: SheetJS (`xlsx`) for real Excel import/export
- **Backend Architecture**: Supabase & PostgreSQL with Row Level Security (RLS) migrations included in `supabase/migrations/`
- **State Management**: Reactive LocalStorage store with realistic demonstration seed projects (Riyadh Hyperscale Data Center, Cairo Metro Underground Substation, Aramco Dhahran Vault, Dubai Chemical Bund)

---

## 4. Setup & Running the Application

### Prerequisites
- Node.js LTS (v20+ or v24+)
- npm (v10+)

### Installation
```bash
# Clone repository or navigate to directory
cd d:/Ketkat/Gaseous

# Install dependencies
npm install

# Run development server
npm run dev
```

### Production Build
```bash
# Compile and create production bundle
npm run build

# Preview production build
npm run preview
```

### Running Automated Engineering Tests
```bash
# Run physics formulas & boundary conditions test suite
node test-math.js
```

---

## 5. Database Setup (Supabase / PostgreSQL)

The normalized database schema with multi-tenant organization isolation and Role-Based Access Control (RBAC) is located in:
`supabase/migrations/20261010_initial_schema.sql`

To deploy to Supabase:
1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in the Supabase Dashboard.
3. Paste and execute the contents of `supabase/migrations/20261010_initial_schema.sql`.
4. The schema creates:
   - `organizations`
   - `user_profiles` (with roles: Administrator, Engineering Manager, Designer, Reviewer, Estimator, Read-Only)
   - `projects`
   - `project_zones`
   - `calculation_runs` (reproducible versioned calculation logs)
   - `equipment_catalog`
   - `boq_items`
   - `cost_estimates`
   - `project_reviews`
   - `audit_logs`
   - Complete Row Level Security (RLS) policies enforcing organization isolation.

---

## 6. Verification and Code Compliance

All calculations strictly follow recognized international and regional standards:
- **NFPA 2001 (2022 Edition)** — Clean Agent Fire Extinguishing Systems
- **NFPA 12 (2022 Edition)** — Carbon Dioxide Extinguishing Systems
- **NFPA 2010 (2020 Edition)** — Fixed Aerosol Fire-Extinguishing Systems
- **NFPA 11 (2021 Edition)** — Low-, Medium-, and High-Expansion Foam
- **SBC 801 (Chapter 9)** — Saudi Building Code Fire Protection
- **Egyptian Code of Practice** for the Protection of Buildings from Fire (Part 4)
