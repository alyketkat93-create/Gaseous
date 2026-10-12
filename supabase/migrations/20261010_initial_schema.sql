-- ============================================================================
-- FIRECALC PRO — COMPLETE POSTGRESQL & SUPABASE DATABASE ARCHITECTURE
-- Migration: 20261010_initial_schema.sql
-- Modules: Organizations, Users (RBAC), Projects, Zones, Calculation Logs,
--          Equipment DB, Standards DB, BOQ Items, Reviews, and Audit Trails.
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Organizations (Multi-Tenancy Isolation)
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'Saudi Arabia',
    license_number VARCHAR(100),
    subscription_tier VARCHAR(50) NOT NULL DEFAULT 'enterprise_engineering',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. User Profiles & Role-Based Access Control (RBAC)
-- Roles: administrator, engineering_manager, designer, reviewer, estimator, read_only
CREATE TYPE user_role AS ENUM (
    'administrator',
    'engineering_manager',
    'designer',
    'reviewer',
    'estimator',
    'read_only'
);

CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    professional_title VARCHAR(255) DEFAULT 'Fire Protection Engineer',
    pe_registration_number VARCHAR(100), -- Licensed Professional Engineer stamp/number
    role user_role NOT NULL DEFAULT 'designer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 3. Projects
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    project_number VARCHAR(100) NOT NULL,
    project_name VARCHAR(255) NOT NULL,
    client VARCHAR(255) NOT NULL,
    consultant VARCHAR(255) NOT NULL,
    main_contractor VARCHAR(255),
    location VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'Saudi Arabia',
    authority VARCHAR(255) NOT NULL DEFAULT 'Saudi Civil Defense (SBC 801)',
    applicable_codes TEXT[] NOT NULL DEFAULT ARRAY['NFPA 2001', 'SBC 801'],
    designer_id UUID REFERENCES user_profiles(id),
    reviewer_id UUID REFERENCES user_profiles(id),
    revision VARCHAR(50) NOT NULL DEFAULT 'Rev 00',
    notes TEXT,
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 4. Protected Zones
CREATE TABLE IF NOT EXISTS project_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    zone_name VARCHAR(255) NOT NULL,
    facility_type VARCHAR(100) NOT NULL DEFAULT 'data_center',
    technology VARCHAR(50) NOT NULL DEFAULT 'fk5112',
    review_status VARCHAR(50) NOT NULL DEFAULT 'draft',
    enclosure_data JSONB NOT NULL, -- Geometry, volumes, ambient temps, elevation, leakage
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 5. Calculation Records & Audit Runs (Reproducibility & Traceability)
CREATE TABLE IF NOT EXISTS calculation_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zone_id UUID NOT NULL REFERENCES project_zones(id) ON DELETE CASCADE,
    run_by UUID NOT NULL REFERENCES user_profiles(id),
    calculation_version VARCHAR(50) NOT NULL DEFAULT 'FIRECALC-ENG-2.4',
    technology VARCHAR(50) NOT NULL,
    inputs JSONB NOT NULL,
    results JSONB NOT NULL,
    intermediate_steps JSONB NOT NULL,
    safety_checks_passed BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 6. Equipment Catalog
CREATE TABLE IF NOT EXISTS equipment_catalog (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    manufacturer VARCHAR(150) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    agent_type VARCHAR(100) NOT NULL,
    cylinder_model VARCHAR(150) NOT NULL,
    water_capacity_l NUMERIC(10,2) NOT NULL DEFAULT 0,
    min_fill_density_kg_l NUMERIC(6,3),
    max_fill_density_kg_l NUMERIC(6,3),
    max_fill_kg NUMERIC(10,2),
    storage_pressure_bar NUMERIC(10,2) NOT NULL,
    valve_size_mm INT NOT NULL,
    valve_type VARCHAR(255) NOT NULL,
    approved_orientation VARCHAR(50) NOT NULL DEFAULT 'Vertical Only',
    approvals TEXT[] NOT NULL DEFAULT ARRAY['UL Listed', 'FM Approved'],
    datasheet_ref VARCHAR(255),
    is_verified BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 7. Bill of Quantities (BOQ) Items
CREATE TABLE IF NOT EXISTS boq_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zone_id UUID NOT NULL REFERENCES project_zones(id) ON DELETE CASCADE,
    item_number INT NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    unit VARCHAR(50) NOT NULL DEFAULT 'EA',
    quantity NUMERIC(10,2) NOT NULL DEFAULT 1,
    material_unit_price NUMERIC(12,2) NOT NULL DEFAULT 0,
    installation_unit_price NUMERIC(12,2) NOT NULL DEFAULT 0,
    total_price NUMERIC(14,2) NOT NULL DEFAULT 0,
    is_calculated BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 8. Cost Estimate Summaries
CREATE TABLE IF NOT EXISTS cost_estimates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    currency VARCHAR(10) NOT NULL DEFAULT 'SAR',
    material_direct NUMERIC(14,2) NOT NULL DEFAULT 0,
    installation_direct NUMERIC(14,2) NOT NULL DEFAULT 0,
    subtotal_direct NUMERIC(14,2) NOT NULL DEFAULT 0,
    overhead_percent NUMERIC(5,2) NOT NULL DEFAULT 10,
    profit_percent NUMERIC(5,2) NOT NULL DEFAULT 15,
    contingency_percent NUMERIC(5,2) NOT NULL DEFAULT 5,
    total_before_tax NUMERIC(14,2) NOT NULL DEFAULT 0,
    vat_percent NUMERIC(5,2) NOT NULL DEFAULT 15,
    grand_total NUMERIC(14,2) NOT NULL DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 9. Review Comments & Formal Sign-offs
CREATE TABLE IF NOT EXISTS project_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES user_profiles(id),
    category VARCHAR(50) NOT NULL DEFAULT 'engineering', -- engineering, code_compliance, hydraulic_check
    status VARCHAR(50) NOT NULL DEFAULT 'open', -- open, addressed, resolved
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 10. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES user_profiles(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id UUID,
    ip_address INET,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Ensures organization isolation and role enforcement
-- ============================================================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculation_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE boq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cost_estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function: Get user's active organization ID
CREATE OR REPLACE FUNCTION get_auth_org_id()
RETURNS UUID AS $$
    SELECT organization_id FROM user_profiles WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE;

-- Projects Isolation Policy
CREATE POLICY "Projects accessible only by members of the same organization"
    ON projects
    FOR ALL
    USING (organization_id = get_auth_org_id());

-- Project Zones Policy (inherited via projects join)
CREATE POLICY "Zones accessible only through parent organization project"
    ON project_zones
    FOR ALL
    USING (project_id IN (SELECT id FROM projects WHERE organization_id = get_auth_org_id()));

-- BOQ Items Policy
CREATE POLICY "BOQ items accessible only through organization zone"
    ON boq_items
    FOR ALL
    USING (zone_id IN (
        SELECT pz.id FROM project_zones pz
        JOIN projects p ON p.id = pz.project_id
        WHERE p.organization_id = get_auth_org_id()
    ));
