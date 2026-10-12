import React, { useState } from 'react';
import {
  Database,
  Search,
  Filter,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  FileText,
  Layers,
} from 'lucide-react';
import { EQUIPMENT_DATABASE, EquipmentItem } from '../data/equipmentData';
import { Language, DICTIONARY } from '../i18n/translations';

interface EquipmentCatalogViewProps {
  lang: Language;
}

export const EquipmentCatalogView: React.FC<EquipmentCatalogViewProps> = ({ lang }) => {
  const t = DICTIONARY[lang];

  const [search, setSearch] = useState('');
  const [manufacturerFilter, setManufacturerFilter] = useState('all');
  const [agentFilter, setAgentFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<EquipmentItem | null>(null);

  const filtered = EQUIPMENT_DATABASE.filter((item) => {
    const matchesSearch =
      item.productName.toLowerCase().includes(search.toLowerCase()) ||
      item.cylinderModel.toLowerCase().includes(search.toLowerCase()) ||
      item.manufacturer.toLowerCase().includes(search.toLowerCase());
    const matchesManuf = manufacturerFilter === 'all' || item.manufacturer === manufacturerFilter;
    const matchesAgent = agentFilter === 'all' || item.agentType.includes(agentFilter);
    return matchesSearch && matchesManuf && matchesAgent;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-orange-500" />
            <span>{t.nav.equipmentDb}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {lang === 'ar'
              ? 'كتالوج الأسطوانات والمعدات ومحددات التعبئة المعتمدة من كبرى الشركات العالمية (Kidde, Fike, Ansul, FirePro)'
              : 'Verified manufacturer equipment database with cylinder capacities, fill densities, test pressures, and certifications'}
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search equipment model, manufacturer, valve type..."
            className="w-full bg-slate-800/80 text-xs text-slate-200 pl-9 pr-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={manufacturerFilter}
            onChange={(e) => setManufacturerFilter(e.target.value)}
            className="bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-orange-500"
          >
            <option value="all">All Manufacturers</option>
            <option value="Kidde Fire Systems">Kidde Fire Systems</option>
            <option value="Fike Corporation">Fike Corporation</option>
            <option value="Ansul / Johnson Controls">Ansul / Johnson Controls</option>
            <option value="FirePro Systems">FirePro Systems</option>
            <option value="Chemguard / Johnson Controls">Chemguard</option>
          </select>

          <select
            value={agentFilter}
            onChange={(e) => setAgentFilter(e.target.value)}
            className="bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-orange-500"
          >
            <option value="all">All Agent Technologies</option>
            <option value="HFC-227ea">FM-200 (HFC-227ea)</option>
            <option value="FK-5-1-12">FK-5-1-12 Clean Agent</option>
            <option value="IG-541">IG-541 (Inergen)</option>
            <option value="CO2">CO2 Carbon Dioxide</option>
            <option value="Aerosol">Condensed Aerosol</option>
            <option value="Foam">Foam Bladder Tanks</option>
          </select>
        </div>
      </div>

      {/* Grid of Equipment Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 flex flex-col justify-between transition cursor-pointer group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 font-mono">
                  {item.manufacturer}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                  VERIFIED
                </span>
              </div>

              <h3 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors mb-1">
                {item.productName}
              </h3>
              <div className="text-xs text-slate-300 font-mono mb-3">
                Model: {item.cylinderModel}
              </div>

              <div className="space-y-1.5 text-xs text-slate-400 mb-4 bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="flex justify-between">
                  <span>Agent Technology:</span>
                  <span className="text-slate-200 font-medium">{item.agentType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Storage Pressure:</span>
                  <span className="text-orange-400 font-mono font-bold">{item.storagePressureBar} bar</span>
                </div>
                <div className="flex justify-between">
                  <span>Capacity / Max Fill:</span>
                  <span className="text-slate-200 font-mono font-bold">
                    {item.waterCapacityL > 0 ? `${item.waterCapacityL} Litres` : `${item.maxFillKg} kg`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Discharge Valve:</span>
                  <span className="text-slate-300 truncate max-w-[150px]">{item.valveType}</span>
                </div>
              </div>

              {/* Approvals */}
              <div className="flex flex-wrap gap-1 mb-2">
                {item.approvals.map((app, i) => (
                  <span
                    key={i}
                    className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-semibold"
                  >
                    {app}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-[10px]">{item.datasheetRef}</span>
              <span className="text-orange-400 font-semibold flex items-center gap-1 group-hover:underline">
                <span>View Specs</span>
                <ExternalLink className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div>
                <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">{selectedItem.manufacturer}</span>
                <h2 className="text-base font-bold text-white">{selectedItem.productName}</h2>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div>
                  <span className="text-slate-400 block text-[11px]">Model Reference:</span>
                  <span className="text-white font-mono font-bold">{selectedItem.cylinderModel}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Operating Pressure:</span>
                  <span className="text-orange-400 font-mono font-bold">{selectedItem.storagePressureBar} bar</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Water Capacity:</span>
                  <span className="text-white font-mono font-bold">{selectedItem.waterCapacityL} L</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Temperature Range:</span>
                  <span className="text-white font-mono font-bold">{selectedItem.temperatureRangeC}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Approved Orientation:</span>
                  <span className="text-white font-bold">{selectedItem.approvedOrientation}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Datasheet Version:</span>
                  <span className="text-white font-mono">{selectedItem.datasheetRef}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block mb-1 font-semibold">Valve Assembly Description:</span>
                <p className="text-slate-200 bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                  {selectedItem.valveType} ({selectedItem.valveSizeMm > 0 ? `${selectedItem.valveSizeMm} mm connection` : 'Direct unit'})
                </p>
              </div>

              <div>
                <span className="text-slate-400 block mb-1 font-semibold">Listings & Civil Defense Approvals:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedItem.approvals.map((app, i) => (
                    <span key={i} className="px-2.5 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700 font-bold">
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs"
              >
                Close Specification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
