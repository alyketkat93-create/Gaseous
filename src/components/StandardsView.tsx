import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  FileText,
  Bookmark,
} from 'lucide-react';
import { STANDARDS_DATABASE, StandardReference } from '../data/standardsData';
import { Language, DICTIONARY } from '../i18n/translations';

interface StandardsViewProps {
  lang: Language;
}

export const StandardsView: React.FC<StandardsViewProps> = ({ lang }) => {
  const t = DICTIONARY[lang];
  const [search, setSearch] = useState('');
  const [selectedStandard, setSelectedStandard] = useState<StandardReference | null>(null);

  const filtered = STANDARDS_DATABASE.filter(
    (s) =>
      s.code.toLowerCase().includes(search.toLowerCase()) ||
      s.officialTitle.toLowerCase().includes(search.toLowerCase()) ||
      s.applicableSystems.some((sys) => sys.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-400" />
            <span>{t.nav.standards}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {lang === 'ar'
              ? 'مكتبة الأكواد والاشتراطات الإلزامية المعتمدة (NFPA, كود البناء السعودي SBC 801, الكود المصري)'
              : 'Searchable library of verified NFPA standards, Saudi Building Code SBC 801, and Egyptian Civil Defense directives'}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search standards by designation (e.g. NFPA 2001), keywords, or system type..."
            className="w-full bg-slate-800/80 text-xs text-slate-200 pl-9 pr-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Grid of Standards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((std) => (
          <div
            key={std.code}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 flex flex-col justify-between transition"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-purple-400 px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
                  {std.code}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  {std.edition}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white mb-2">{std.officialTitle}</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">{std.scope}</p>

              {/* Mandatory Clauses */}
              <div className="space-y-1.5 mb-4">
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wide block">
                  Key Mandatory Provisions:
                </span>
                {std.mandatoryClauses.map((clause, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs bg-slate-950 p-2 rounded border border-slate-800">
                    <span className="text-purple-400 font-mono font-bold shrink-0">{clause.clause}</span>
                    <span className="text-slate-300">{clause.summary}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="text-[11px]">Verified: {std.verificationDate}</span>
              <a
                href={std.officialSourceUrl}
                target="_blank"
                rel="noreferrer"
                className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
              >
                <span>Official Source</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
