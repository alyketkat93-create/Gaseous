import React, { useState } from 'react';
import {
  Calculator,
  Download,
  Plus,
  Trash2,
  FileSpreadsheet,
  Coins,
  CheckCircle2,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { Project, BOQItem, CostEstimateSummary } from '../types';
import { exportBOQToExcel, calculateCostEstimate } from '../engineering/costingEngine';
import { Language, DICTIONARY } from '../i18n/translations';

interface BOQCostingViewProps {
  project: Project;
  onUpdateProject: (proj: Project) => void;
  lang: Language;
}

export const BOQCostingView: React.FC<BOQCostingViewProps> = ({
  project,
  onUpdateProject,
  lang,
}) => {
  const t = DICTIONARY[lang];
  const activeZone = project.zones[0];

  const [items, setItems] = useState<BOQItem[]>(activeZone?.boqItems || []);
  const [currency, setCurrency] = useState<CostEstimateSummary['currency']>(project.costEstimate.currency || 'SAR');
  const [overheadPercent, setOverheadPercent] = useState<number>(project.costEstimate.overheadPercent || 10);
  const [profitPercent, setProfitPercent] = useState<number>(project.costEstimate.profitPercent || 15);
  const [contingencyPercent, setContingencyPercent] = useState<number>(project.costEstimate.contingencyPercent || 5);
  const [vatPercent, setVatPercent] = useState<number>(
    project.country === 'Egypt' ? 14 : project.country === 'UAE' ? 5 : 15
  );

  const summary = calculateCostEstimate(items, currency, overheadPercent, profitPercent, contingencyPercent, vatPercent);

  const handleUpdateItem = (id: string, updates: Partial<BOQItem>) => {
    const updated = items.map(item => {
      if (item.id === id) {
        const newItem = { ...item, ...updates };
        newItem.totalPrice = (newItem.materialUnitPrice + newItem.installationUnitPrice) * newItem.quantity;
        return newItem;
      }
      return item;
    });
    setItems(updated);
    saveUpdatedBOQ(updated);
  };

  const handleAddItem = () => {
    const newItem: BOQItem = {
      id: `boq-${Date.now()}`,
      itemNumber: items.length + 1,
      category: 'piping_fittings',
      description: 'Additional Engineering Accessories & Support Brackets',
      unit: 'LOT',
      quantity: 1,
      materialUnitPrice: 1500,
      installationUnitPrice: 500,
      totalPrice: 2000,
      isCalculated: false,
    };
    const updated = [...items, newItem];
    setItems(updated);
    saveUpdatedBOQ(updated);
  };

  const handleDeleteItem = (id: string) => {
    const updated = items.filter(i => i.id !== id).map((item, idx) => ({ ...item, itemNumber: idx + 1 }));
    setItems(updated);
    saveUpdatedBOQ(updated);
  };

  const saveUpdatedBOQ = (newItems: BOQItem[]) => {
    const newSummary = calculateCostEstimate(newItems, currency, overheadPercent, profitPercent, contingencyPercent, vatPercent);
    const updatedZones = project.zones.map((z, idx) => idx === 0 ? { ...z, boqItems: newItems } : z);
    onUpdateProject({
      ...project,
      zones: updatedZones,
      costEstimate: newSummary,
    });
  };

  const handleExportExcel = () => {
    exportBOQToExcel(items, summary, project.projectName, activeZone?.zoneName || 'Zone 01');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-400" />
            <span>{t.boq.title}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {lang === 'ar'
              ? 'إعداد جداول الكميات والمقايسات التقديرية والتسعير لمشاريع الخليج ومصر وتصديرها بصيغة Excel'
              : 'Itemized material & installation takeoff, customizable markups, and direct Excel (.xlsx) export'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/20 transition cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>{lang === 'ar' ? 'تصدير إلى Excel (.xlsx)' : 'Export BOQ to Excel (.xlsx)'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 3 Cols: BOQ Table */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-white">
                  {lang === 'ar' ? 'بنود التوريد والتركيب والخدمات الهندسية' : 'Itemized Equipment, Piping & Services Schedule'}
                </h2>
                <span className="text-xs text-slate-400">
                  Zone: {activeZone?.zoneName} ({activeZone?.technology.toUpperCase()})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={currency}
                  onChange={(e) => {
                    const c = e.target.value as any;
                    setCurrency(c);
                  }}
                  className="bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 font-bold focus:outline-none focus:border-emerald-500"
                >
                  <option value="SAR">SAR (Saudi Riyal)</option>
                  <option value="EGP">EGP (Egyptian Pound)</option>
                  <option value="AED">AED (UAE Dirham)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>

                <button
                  onClick={handleAddItem}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold"
                >
                  <Plus className="w-3.5 h-3.5 text-orange-400" />
                  <span>Add Line Item</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-2.5 font-semibold w-8">#</th>
                    <th className="pb-2.5 font-semibold">Scope Description</th>
                    <th className="pb-2.5 font-semibold w-16">Unit</th>
                    <th className="pb-2.5 font-semibold w-16">Qty</th>
                    <th className="pb-2.5 font-semibold w-24">Material Rate</th>
                    <th className="pb-2.5 font-semibold w-24">Labor Rate</th>
                    <th className="pb-2.5 font-semibold w-24 text-right">Total ({currency})</th>
                    <th className="pb-2.5 font-semibold w-10 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/30">
                      <td className="py-2.5 font-mono text-slate-400">{item.itemNumber}</td>
                      <td className="py-2.5 pr-2">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleUpdateItem(item.id, { description: e.target.value })}
                          className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
                        />
                      </td>
                      <td className="py-2.5">
                        <select
                          value={item.unit}
                          onChange={(e) => handleUpdateItem(item.id, { unit: e.target.value as any })}
                          className="bg-slate-800 border border-slate-700 rounded px-1.5 py-1 text-slate-200 text-xs font-mono"
                        >
                          <option value="EA">EA</option>
                          <option value="M">M</option>
                          <option value="SET">SET</option>
                          <option value="LOT">LOT</option>
                          <option value="KG">KG</option>
                        </select>
                      </td>
                      <td className="py-2.5">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleUpdateItem(item.id, { quantity: parseInt(e.target.value) || 1 })}
                          className="w-14 bg-slate-800 border border-slate-700 rounded px-1.5 py-1 text-slate-200 font-mono text-xs"
                        />
                      </td>
                      <td className="py-2.5">
                        <input
                          type="number"
                          step="50"
                          value={item.materialUnitPrice}
                          onChange={(e) => handleUpdateItem(item.id, { materialUnitPrice: parseFloat(e.target.value) || 0 })}
                          className="w-20 bg-slate-800 border border-slate-700 rounded px-1.5 py-1 text-slate-200 font-mono text-xs"
                        />
                      </td>
                      <td className="py-2.5">
                        <input
                          type="number"
                          step="20"
                          value={item.installationUnitPrice}
                          onChange={(e) => handleUpdateItem(item.id, { installationUnitPrice: parseFloat(e.target.value) || 0 })}
                          className="w-20 bg-slate-800 border border-slate-700 rounded px-1.5 py-1 text-slate-200 font-mono text-xs"
                        />
                      </td>
                      <td className="py-2.5 text-right font-mono font-bold text-slate-200">
                        {item.totalPrice.toLocaleString()}
                      </td>
                      <td className="py-2.5 text-right">
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-slate-800 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Commercial Costing Summary */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-3 flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'ar' ? 'المقايسة والتحليل المالي' : 'Commercial Markups & Summary'}</span>
            </h3>

            {/* Direct Costs */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Material Direct Cost:</span>
                <span className="font-mono text-slate-200">{summary.materialDirectCost.toLocaleString()} {currency}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Installation & Labor:</span>
                <span className="font-mono text-slate-200">{summary.installationDirectCost.toLocaleString()} {currency}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-300 pt-1 border-t border-slate-800">
                <span>Subtotal Direct:</span>
                <span className="font-mono text-emerald-400">{summary.subtotalDirect.toLocaleString()} {currency}</span>
              </div>
            </div>

            {/* Markups Controls */}
            <div className="pt-2 border-t border-slate-800 space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Overhead ({overheadPercent}%):</span>
                  <span className="font-mono text-slate-200">{summary.overheadAmount.toLocaleString()} {currency}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  value={overheadPercent}
                  onChange={(e) => setOverheadPercent(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 h-1 bg-slate-800 rounded cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Profit Margin ({profitPercent}%):</span>
                  <span className="font-mono text-slate-200">{summary.profitAmount.toLocaleString()} {currency}</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="35"
                  value={profitPercent}
                  onChange={(e) => setProfitPercent(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 h-1 bg-slate-800 rounded cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Contingency ({contingencyPercent}%):</span>
                  <span className="font-mono text-slate-200">{summary.contingencyAmount.toLocaleString()} {currency}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  value={contingencyPercent}
                  onChange={(e) => setContingencyPercent(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 h-1 bg-slate-800 rounded cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>VAT ({vatPercent}%):</span>
                  <span className="font-mono text-slate-200">{summary.vatAmount.toLocaleString()} {currency}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={vatPercent}
                  onChange={(e) => setVatPercent(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 h-1 bg-slate-800 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Grand Total Box */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center pt-3">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">
                Grand Total Selling Price
              </span>
              <div className="text-2xl font-extrabold text-emerald-400 font-mono">
                {summary.grandTotal.toLocaleString()} <span className="text-sm font-sans text-slate-300">{currency}</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-1">
                Excl. Tax: {summary.totalBeforeTax.toLocaleString()} {currency}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
