import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { Sidebar, NavTab } from './components/common/Sidebar';
import { DashboardView } from './components/DashboardView';
import { FM200Calculator } from './components/calculators/FM200Calculator';
import { FK5112Calculator } from './components/calculators/FK5112Calculator';
import { CO2Calculator } from './components/calculators/CO2Calculator';
import { AerosolCalculator } from './components/calculators/AerosolCalculator';
import { InertGasCalculator } from './components/calculators/InertGasCalculator';
import { FoamCalculator } from './components/calculators/FoamCalculator';
import { HistoryView } from './components/HistoryView';
import { ReportGeneratorView } from './components/ReportGeneratorView';
import { SettingsView } from './components/SettingsView';
import { PipingReviewView } from './components/PipingReviewView';
import { VentingIntegrityView } from './components/VentingIntegrityView';
import { EquipmentCatalogView } from './components/EquipmentCatalogView';
import { BOQCostingView } from './components/BOQCostingView';
import { StandardsView } from './components/StandardsView';
import {
  CalculationRecord,
  CompanySettings,
  SystemType,
  UnitSystem,
} from './types';
import { Language } from './i18n/translations';
import {
  loadSavedCalculations,
  saveCalculationRecord,
  duplicateCalculationRecord,
  deleteCalculationRecord,
  loadCompanySettings,
  saveCompanySettings,
  saveSavedCalculations,
  SEED_CALCULATIONS,
} from './engineering/calculationStore';
import { loadStoredProjects, saveStoredProjects } from './store/projectStore';

// Map tab ID to URL path
const TAB_TO_ROUTE: Record<NavTab, string> = {
  dashboard: '/dashboard',
  fm200: '/calculators/fm200',
  fk5112: '/calculators/fk5112',
  co2: '/calculators/co2',
  aerosol: '/calculators/aerosol',
  'inert-gas': '/calculators/inert-gas',
  foam: '/calculators/foam',
  history: '/history',
  reports: '/reports',
  settings: '/settings',
  piping: '/tools/piping',
  venting: '/tools/venting',
  equipment: '/tools/equipment',
  boq: '/tools/boq',
  standards: '/tools/standards',
};

// Map URL path or hash to tab ID
function getTabFromPath(path: string): NavTab {
  const cleanPath = path.toLowerCase().replace(/\/$/, '') || '/dashboard';
  for (const [tab, route] of Object.entries(TAB_TO_ROUTE)) {
    if (cleanPath === route || cleanPath.endsWith(route)) {
      return tab as NavTab;
    }
  }
  return 'dashboard';
}

export function App() {
  const [calculations, setCalculations] = useState<CalculationRecord[]>(() => loadSavedCalculations());
  const [companySettings, setCompanySettings] = useState<CompanySettings>(() => loadCompanySettings());
  const [currentTab, setCurrentTab] = useState<NavTab>(() => getTabFromPath(window.location.pathname));
  const [lang, setLang] = useState<Language>(() => companySettings.defaultLanguage || 'en');
  const [unitSystem, setUnitSystem] = useState<UnitSystem>(() => companySettings.defaultUnitSystem || 'metric');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => companySettings.theme || 'light');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Active calculation record loaded in calculator or report
  const [activeCalculationRecord, setActiveCalculationRecord] = useState<CalculationRecord | undefined>(
    calculations[0]
  );

  // URL sync on load & popstate
  useEffect(() => {
    const handlePopState = () => {
      setCurrentTab(getTabFromPath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update browser URL on tab change
  const handleSelectTab = (tab: NavTab) => {
    setCurrentTab(tab);
    const targetRoute = TAB_TO_ROUTE[tab] || '/dashboard';
    if (window.location.pathname !== targetRoute) {
      window.history.pushState(null, '', targetRoute);
    }
  };

  // Sync RTL / LTR attribute on <html> element
  useEffect(() => {
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  // Sync theme on <html> element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Toggle Theme
  const handleToggleTheme = () => {
    const nextTheme: 'light' | 'dark' = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    const updatedSettings: CompanySettings = { ...companySettings, theme: nextTheme };
    setCompanySettings(updatedSettings);
    saveCompanySettings(updatedSettings);
  };

  // Save calculation
  const handleSaveCalculation = (record: CalculationRecord) => {
    const updated = saveCalculationRecord(record, calculations);
    setCalculations(updated);
    setActiveCalculationRecord(record);
  };

  // Duplicate calculation
  const handleDuplicateCalculation = (id: string) => {
    const { updatedRecords, duplicatedRecord } = duplicateCalculationRecord(id, calculations);
    setCalculations(updatedRecords);
    if (duplicatedRecord) {
      setActiveCalculationRecord(duplicatedRecord);
      // Reopen in its dedicated calculator
      const tabMap: Record<SystemType, NavTab> = {
        fm200: 'fm200',
        fk5112: 'fk5112',
        co2: 'co2',
        aerosol: 'aerosol',
        inert_gas: 'inert-gas',
        foam: 'foam',
      };
      handleSelectTab(tabMap[duplicatedRecord.systemType]);
    }
  };

  // Delete calculation
  const handleDeleteCalculation = (id: string) => {
    const updated = deleteCalculationRecord(id, calculations);
    setCalculations(updated);
    if (activeCalculationRecord?.id === id) {
      setActiveCalculationRecord(updated[0]);
    }
  };

  // Reopen calculation from dashboard or history
  const handleReopenCalculation = (record: CalculationRecord) => {
    setActiveCalculationRecord(record);
    const tabMap: Record<SystemType, NavTab> = {
      fm200: 'fm200',
      fk5112: 'fk5112',
      co2: 'co2',
      aerosol: 'aerosol',
      inert_gas: 'inert-gas',
      foam: 'foam',
    };
    handleSelectTab(tabMap[record.systemType]);
  };

  // Launch a dedicated calculator from Dashboard
  const handleLaunchCalculator = (system: SystemType, record?: CalculationRecord) => {
    if (record) {
      setActiveCalculationRecord(record);
    } else {
      // Find latest or default record for this system
      const found = calculations.find((c) => c.systemType === system);
      setActiveCalculationRecord(found);
    }
    const tabMap: Record<SystemType, NavTab> = {
      fm200: 'fm200',
      fk5112: 'fk5112',
      co2: 'co2',
      aerosol: 'aerosol',
      inert_gas: 'inert-gas',
      foam: 'foam',
    };
    handleSelectTab(tabMap[system]);
  };

  // Navigate to report generator
  const handleNavigateToReport = (record: CalculationRecord) => {
    setActiveCalculationRecord(record);
    handleSelectTab('reports');
  };

  // Reset data to seed sample calculations
  const handleResetData = () => {
    saveSavedCalculations(SEED_CALCULATIONS);
    setCalculations(SEED_CALCULATIONS);
    setActiveCalculationRecord(SEED_CALCULATIONS[0]);
  };

  // Header module name
  const moduleNames: Record<NavTab, { en: string; ar: string }> = {
    dashboard: { en: 'Engineering Dashboard', ar: 'لوحة التحكم الهندسية' },
    fm200: { en: 'FM-200 Fire Suppression Calculator', ar: 'حاسبة نظام FM-200' },
    fk5112: { en: 'FK-5-1-12 Clean Agent Calculator', ar: 'حاسبة مادة FK-5-1-12' },
    co2: { en: 'Carbon Dioxide Fire Suppression Calculator', ar: 'حاسبة ثاني أكسيد الكربون' },
    aerosol: { en: 'Aerosol Fire Suppression Calculator', ar: 'حاسبة الإيروسول المكثف' },
    'inert-gas': { en: 'Inert Gas Fire Suppression Calculator', ar: 'حاسبة الغازات الخاملة' },
    foam: { en: 'Foam Fire Suppression Calculator', ar: 'حاسبة أنظمة الرغوة' },
    history: { en: 'Calculation History & Audit Trail', ar: 'سجل الحسابات والمراجعات' },
    reports: { en: 'Engineering Submittal Reports', ar: 'المذكرات والتقارير الهندسية' },
    settings: { en: 'Engineering & Company Settings', ar: 'الإعدادات وبيانات المكتب' },
    piping: { en: 'Piping & Hydraulics Review', ar: 'مراجعة الأنابيب والهيدروليك' },
    venting: { en: 'Venting & Damper Integrity', ar: 'تخفيف الضغط واختبار الغرفة' },
    equipment: { en: 'Approved Equipment Catalog', ar: 'كتالوج المعدات والأسطوانات' },
    boq: { en: 'BOQ & Commercial Costing', ar: 'جدول الكميات والتسعير' },
    standards: { en: 'NFPA Standards Reference', ar: 'المكتبة الهندسية وكود NFPA' },
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-200 ${
        theme === 'dark' ? 'bg-navy-950 text-slate-100' : 'bg-neutralBg text-slate-800'
      } ${lang === 'ar' ? 'font-arabic' : 'font-sans'}`}
    >
      {/* Top Application Header */}
      <Header
        currentModuleName={lang === 'ar' ? moduleNames[currentTab]?.ar : moduleNames[currentTab]?.en}
        calcReference={activeCalculationRecord?.calcRef || 'CALC-2026-REF'}
        lang={lang}
        onLanguageChange={setLang}
        unitSystem={unitSystem}
        onUnitSystemChange={setUnitSystem}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        engineerName={companySettings.defaultEngineer}
        engineerRole={companySettings.companyDivision}
        onOpenSettings={() => handleSelectTab('settings')}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={handleSelectTab}
          lang={lang}
          collapsed={sidebarCollapsed}
          onToggleCollapsed={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Working View Surface */}
        <main
          className={`flex-1 overflow-y-auto p-4 lg:p-6 ${
            theme === 'dark' ? 'bg-navy-950' : 'bg-neutralBg'
          }`}
        >
          <div className="max-w-7xl mx-auto pb-12">
            {/* 1. Dashboard */}
            {currentTab === 'dashboard' && (
              <DashboardView
                calculations={calculations}
                onNavigateToCalculator={handleLaunchCalculator}
                onNavigateTab={handleSelectTab}
                lang={lang}
                unitSystem={unitSystem}
              />
            )}

            {/* 2. FM-200 Calculator */}
            {currentTab === 'fm200' && (
              <FM200Calculator
                unitSystem={unitSystem}
                lang={lang}
                initialData={
                  activeCalculationRecord?.systemType === 'fm200'
                    ? activeCalculationRecord
                    : calculations.find((c) => c.systemType === 'fm200')
                }
                onSaveCalculation={handleSaveCalculation}
                onNavigateToReport={handleNavigateToReport}
              />
            )}

            {/* 3. FK-5-1-12 Calculator */}
            {currentTab === 'fk5112' && (
              <FK5112Calculator
                unitSystem={unitSystem}
                lang={lang}
                initialData={
                  activeCalculationRecord?.systemType === 'fk5112'
                    ? activeCalculationRecord
                    : calculations.find((c) => c.systemType === 'fk5112')
                }
                onSaveCalculation={handleSaveCalculation}
                onNavigateToReport={handleNavigateToReport}
              />
            )}

            {/* 4. CO2 Calculator */}
            {currentTab === 'co2' && (
              <CO2Calculator
                unitSystem={unitSystem}
                lang={lang}
                initialData={
                  activeCalculationRecord?.systemType === 'co2'
                    ? activeCalculationRecord
                    : calculations.find((c) => c.systemType === 'co2')
                }
                onSaveCalculation={handleSaveCalculation}
                onNavigateToReport={handleNavigateToReport}
              />
            )}

            {/* 5. Aerosol Calculator */}
            {currentTab === 'aerosol' && (
              <AerosolCalculator
                unitSystem={unitSystem}
                lang={lang}
                initialData={
                  activeCalculationRecord?.systemType === 'aerosol'
                    ? activeCalculationRecord
                    : calculations.find((c) => c.systemType === 'aerosol')
                }
                onSaveCalculation={handleSaveCalculation}
                onNavigateToReport={handleNavigateToReport}
              />
            )}

            {/* 6. Inert Gas Calculator */}
            {currentTab === 'inert-gas' && (
              <InertGasCalculator
                unitSystem={unitSystem}
                lang={lang}
                initialData={
                  activeCalculationRecord?.systemType === 'inert_gas'
                    ? activeCalculationRecord
                    : calculations.find((c) => c.systemType === 'inert_gas')
                }
                onSaveCalculation={handleSaveCalculation}
                onNavigateToReport={handleNavigateToReport}
              />
            )}

            {/* 7. Foam Calculator */}
            {currentTab === 'foam' && (
              <FoamCalculator
                unitSystem={unitSystem}
                lang={lang}
                initialData={
                  activeCalculationRecord?.systemType === 'foam'
                    ? activeCalculationRecord
                    : calculations.find((c) => c.systemType === 'foam')
                }
                onSaveCalculation={handleSaveCalculation}
                onNavigateToReport={handleNavigateToReport}
              />
            )}

            {/* 8. Calculation History */}
            {currentTab === 'history' && (
              <HistoryView
                calculations={calculations}
                onReopenCalculation={handleReopenCalculation}
                onDuplicateCalculation={handleDuplicateCalculation}
                onDeleteCalculation={handleDeleteCalculation}
                onExportReport={handleNavigateToReport}
                onStartNewCalculation={() => handleSelectTab('dashboard')}
                lang={lang}
                unitSystem={unitSystem}
              />
            )}

            {/* 9. Engineering Reports */}
            {currentTab === 'reports' && (
              <ReportGeneratorView
                calculations={calculations}
                selectedCalculationId={activeCalculationRecord?.id}
                companySettings={companySettings}
                unitSystem={unitSystem}
                lang={lang}
              />
            )}

            {/* 10. Settings */}
            {currentTab === 'settings' && (
              <SettingsView
                settings={companySettings}
                onUpdateSettings={(updated) => {
                  setCompanySettings(updated);
                  saveCompanySettings(updated);
                }}
                lang={lang}
                onLanguageChange={setLang}
                unitSystem={unitSystem}
                onUnitSystemChange={setUnitSystem}
                theme={theme}
                onToggleTheme={handleToggleTheme}
                onResetData={handleResetData}
              />
            )}

            {/* Auxiliary Technical Tools */}
            {currentTab === 'piping' && (
              <PipingReviewView unitSystem={unitSystem} lang={lang} />
            )}

            {currentTab === 'venting' && (
              <VentingIntegrityView unitSystem={unitSystem} lang={lang} />
            )}

            {currentTab === 'equipment' && (
              <EquipmentCatalogView lang={lang} />
            )}

            {currentTab === 'boq' && (
              <BOQCostingView
                project={loadStoredProjects()[0]}
                onUpdateProject={() => {}}
                lang={lang}
              />
            )}

            {currentTab === 'standards' && (
              <StandardsView lang={lang} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
