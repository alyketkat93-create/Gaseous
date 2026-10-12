import React from 'react';
import { Box, Layers, Thermometer, Mountain, AlertCircle, CheckCircle2 } from 'lucide-react';
import { EnclosureData, UnitSystem } from '../../../types';
import { Language, DICTIONARY } from '../../../i18n/translations';
import { getAltitudeCorrectionFactor } from '../../../engineering/enclosureEngine';

interface RoomGeometrySectionProps {
  enclosure: EnclosureData;
  onChange: (updated: EnclosureData) => void;
  unitSystem: UnitSystem;
  lang: Language;
}

export const RoomGeometrySection: React.FC<RoomGeometrySectionProps> = ({
  enclosure,
  onChange,
  unitSystem,
  lang,
}) => {
  const t = DICTIONARY[lang];

  const lengthUnit = unitSystem === 'metric' ? 'm' : 'ft';
  const volumeUnit = unitSystem === 'metric' ? 'm³' : 'ft³';
  const tempUnit = unitSystem === 'metric' ? '°C' : '°F';
  const elevationUnit = unitSystem === 'metric' ? 'm' : 'ft';

  // Live calculations
  const singleRoomGrossVolume = enclosure.length * enclosure.width * enclosure.height;
  const quantity = enclosure.quantity || 1;
  const totalGrossVolume = singleRoomGrossVolume * quantity;

  // Additional voids
  const raisedFloorVol = enclosure.hasRaisedFloor
    ? enclosure.length * enclosure.width * enclosure.raisedFloorHeight * quantity
    : 0;
  const ceilingVoidVol = enclosure.hasCeilingVoid
    ? enclosure.length * enclosure.width * enclosure.ceilingVoidHeight * quantity
    : 0;
  const netDesignVolume = Math.max(
    0,
    totalGrossVolume + raisedFloorVol + ceilingVoidVol - (enclosure.solidObstructions || 0)
  );

  const elevationInMeters = unitSystem === 'metric' ? enclosure.elevation : enclosure.elevation * 0.3048;
  const altitudeFactor = getAltitudeCorrectionFactor(elevationInMeters);

  const handleUpdate = (field: keyof EnclosureData, value: any) => {
    onChange({
      ...enclosure,
      [field]: value,
    });
  };

  return (
    <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <h2 className="text-sm font-bold text-navy-900 dark:text-white flex items-center gap-2">
          <Box className="w-4 h-4 text-engBlue" />
          <span>{lang === 'ar' ? 'بيانات وأبعاد الحيز المحمي' : 'Protected Enclosure Geometry & Room Data'}</span>
        </h2>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-engBlue/10 text-engBlue border border-engBlue/30">
          {unitSystem === 'metric' ? 'SI Units (m, m³, °C)' : 'US Customary (ft, ft³, °F)'}
        </span>
      </div>

      {/* Primary Dimensions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
            {t.enclosure.length} ({lengthUnit})
          </label>
          <input
            type="number"
            step="0.1"
            min="0.5"
            value={enclosure.length}
            onChange={(e) => handleUpdate('length', parseFloat(e.target.value) || 0)}
            className="w-full bg-slate-50 dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-engBlue"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
            {t.enclosure.width} ({lengthUnit})
          </label>
          <input
            type="number"
            step="0.1"
            min="0.5"
            value={enclosure.width}
            onChange={(e) => handleUpdate('width', parseFloat(e.target.value) || 0)}
            className="w-full bg-slate-50 dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-engBlue"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
            {t.enclosure.height} ({lengthUnit})
          </label>
          <input
            type="number"
            step="0.1"
            min="0.5"
            value={enclosure.height}
            onChange={(e) => handleUpdate('height', parseFloat(e.target.value) || 0)}
            className="w-full bg-slate-50 dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-engBlue"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
            {t.enclosure.quantity}
          </label>
          <input
            type="number"
            min="1"
            max="20"
            value={quantity}
            onChange={(e) => handleUpdate('quantity', parseInt(e.target.value) || 1)}
            className="w-full bg-slate-50 dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-engBlue"
          />
        </div>
      </div>

      {/* Multiple Identical Rooms Confirmation Checkbox */}
      {quantity > 1 && (
        <div className={`p-3 rounded-lg border text-xs transition ${
          enclosure.isCombinedEnclosureConfirmed
            ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-300'
            : 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800/60 text-amber-900 dark:text-amber-200'
        }`}>
          <label className="flex items-start gap-2.5 cursor-pointer font-medium">
            <input
              type="checkbox"
              checked={!!enclosure.isCombinedEnclosureConfirmed}
              onChange={(e) => handleUpdate('isCombinedEnclosureConfirmed', e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded text-engBlue focus:ring-engBlue cursor-pointer"
            />
            <div className="space-y-0.5">
              <span className="font-bold">
                {lang === 'ar'
                  ? 'تأكيد الحيز المشترك للغرف المتطابقة:'
                  : 'Multi-Room Common Enclosure Confirmation:'}
              </span>
              <p className="text-[11px] leading-relaxed">
                {t.common.confirmSingleEnclosure}
              </p>
              {!enclosure.isCombinedEnclosureConfirmed && (
                <p className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold pt-0.5">
                  {lang === 'ar'
                    ? 'تنبيه: إذا كانت الغرف مفصولة بجدران محكمة، يجب حساب كل غرفة كمنطقة إطفاء مستقلة (Zone) أو استخدام صمامات توجيه (Selector Valves).'
                    : 'Caution: If rooms are partitioned with sealed walls, each room must be sized independently or equipped with directional selector valves.'}
                </p>
              )}
            </div>
          </label>
        </div>
      )}

      {/* Dynamic Volume Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-lg bg-neutralBg dark:bg-navy-800/60 border border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">
            {lang === 'ar' ? 'حجم الغرفة المفردة' : 'Single Room Gross'}
          </span>
          <span className="text-xs font-mono font-bold text-navy-900 dark:text-white">
            {singleRoomGrossVolume.toFixed(2)} {volumeUnit}
          </span>
        </div>

        <div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">
            {lang === 'ar' ? 'إجمالي الحجم الكلي' : 'Total Gross Volume'}
          </span>
          <span className="text-xs font-mono font-bold text-engBlue">
            {totalGrossVolume.toFixed(2)} {volumeUnit}
          </span>
        </div>

        <div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">
            {lang === 'ar' ? 'حجم الفراغات المضافة' : 'Additional Voids'}
          </span>
          <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
            +{(raisedFloorVol + ceilingVoidVol).toFixed(2)} {volumeUnit}
          </span>
        </div>

        <div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">
            {lang === 'ar' ? 'الحجم الصافي للتصميم' : 'Net Design Volume'}
          </span>
          <span className="text-sm font-mono font-extrabold text-navy-900 dark:text-emerald-400">
            {netDesignVolume.toFixed(2)} {volumeUnit}
          </span>
        </div>
      </div>

      {/* Voids & Obstructions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-slate-100 dark:border-slate-800/80">
        <div>
          <label className="flex items-center gap-2 text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1 cursor-pointer">
            <input
              type="checkbox"
              checked={enclosure.hasRaisedFloor}
              onChange={(e) => handleUpdate('hasRaisedFloor', e.target.checked)}
              className="rounded text-engBlue focus:ring-engBlue"
            />
            <span>{t.enclosure.raisedFloor}</span>
          </label>
          {enclosure.hasRaisedFloor && (
            <input
              type="number"
              step="0.05"
              min="0.1"
              value={enclosure.raisedFloorHeight}
              onChange={(e) => handleUpdate('raisedFloorHeight', parseFloat(e.target.value) || 0)}
              placeholder={`Height (${lengthUnit})`}
              className="w-full bg-slate-50 dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-lg p-1.5 text-xs text-slate-900 dark:text-white"
            />
          )}
        </div>

        <div>
          <label className="flex items-center gap-2 text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1 cursor-pointer">
            <input
              type="checkbox"
              checked={enclosure.hasCeilingVoid}
              onChange={(e) => handleUpdate('hasCeilingVoid', e.target.checked)}
              className="rounded text-engBlue focus:ring-engBlue"
            />
            <span>{t.enclosure.ceilingVoid}</span>
          </label>
          {enclosure.hasCeilingVoid && (
            <input
              type="number"
              step="0.05"
              min="0.1"
              value={enclosure.ceilingVoidHeight}
              onChange={(e) => handleUpdate('ceilingVoidHeight', parseFloat(e.target.value) || 0)}
              placeholder={`Height (${lengthUnit})`}
              className="w-full bg-slate-50 dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-lg p-1.5 text-xs text-slate-900 dark:text-white"
            />
          )}
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
            {t.enclosure.solidObstructions} ({volumeUnit})
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            value={enclosure.solidObstructions}
            onChange={(e) => handleUpdate('solidObstructions', parseFloat(e.target.value) || 0)}
            className="w-full bg-slate-50 dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-lg p-1.5 text-xs text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Atmospheric & Ambient Temperature Parameters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 border-t border-slate-100 dark:border-slate-800/80">
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
            <Thermometer className="w-3.5 h-3.5 text-amber-500" />
            <span>{t.enclosure.minTemp} ({tempUnit})</span>
          </label>
          <input
            type="number"
            step="1"
            value={enclosure.minTemp}
            onChange={(e) => handleUpdate('minTemp', parseFloat(e.target.value) || 0)}
            className="w-full bg-slate-50 dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-semibold text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
            <Thermometer className="w-3.5 h-3.5 text-red-500" />
            <span>{t.enclosure.maxTemp} ({tempUnit})</span>
          </label>
          <input
            type="number"
            step="1"
            value={enclosure.maxTemp}
            onChange={(e) => handleUpdate('maxTemp', parseFloat(e.target.value) || 0)}
            className="w-full bg-slate-50 dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-semibold text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
            <Mountain className="w-3.5 h-3.5 text-slate-400" />
            <span>{t.enclosure.elevation} ({elevationUnit})</span>
          </label>
          <input
            type="number"
            step="10"
            min="0"
            value={enclosure.elevation}
            onChange={(e) => handleUpdate('elevation', parseFloat(e.target.value) || 0)}
            className="w-full bg-slate-50 dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-semibold text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
            {t.enclosure.altitudeFactor}
          </label>
          <div className="w-full bg-slate-100 dark:bg-navy-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs font-mono font-bold text-engBlue">
            Fa = {altitudeFactor.toFixed(3)}
          </div>
        </div>
      </div>
    </div>
  );
};
