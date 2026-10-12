import React, { useState } from 'react';
import {
  FolderKanban,
  PlusCircle,
  Search,
  Filter,
  Building2,
  Calendar,
  Layers,
  Edit3,
  Copy,
  Archive,
  Trash2,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { Project, ProjectZone, FacilityType, SuppressionTechnology } from '../types';
import { Language, DICTIONARY } from '../i18n/translations';
import { NavTab } from './common/Sidebar';

interface ProjectsViewProps {
  projects: Project[];
  activeProject: Project;
  onSelectProject: (proj: Project) => void;
  onUpdateProject: (proj: Project) => void;
  onCreateProject: (proj: Project) => void;
  onNavigate: (tab: NavTab) => void;
  lang: Language;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  activeProject,
  onSelectProject,
  onUpdateProject,
  onCreateProject,
  onNavigate,
  lang,
}) => {
  const t = DICTIONARY[lang];
  const [searchTerm, setSearchTerm] = useState('');
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showNewModal, setShowNewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form state for creating/editing
  const [formName, setFormName] = useState('');
  const [formNumber, setFormNumber] = useState('');
  const [formClient, setFormClient] = useState('');
  const [formConsultant, setFormConsultant] = useState('');
  const [formContractor, setFormContractor] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formCountry, setFormCountry] = useState<Project['country']>('Saudi Arabia');
  const [formAuthority, setFormAuthority] = useState('Saudi Civil Defense (SBC 801)');
  const [formDesigner, setFormDesigner] = useState('Aly Ketkat');
  const [formReviewer, setFormReviewer] = useState('Eng. Fahad Al-Otaibi, Lead FPE');
  const [formRevision, setFormRevision] = useState('Rev 00');
  const [formNotes, setFormNotes] = useState('');

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.projectNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = countryFilter === 'all' || p.country === countryFilter;
    const matchesStatus =
      statusFilter === 'all' || p.zones.some((z) => z.reviewStatus === statusFilter);
    return matchesSearch && matchesCountry && matchesStatus;
  });

  const handleOpenCreateModal = () => {
    setFormName('');
    setFormNumber(`PRJ-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
    setFormClient('');
    setFormConsultant('');
    setFormContractor('');
    setFormLocation('');
    setFormCountry('Saudi Arabia');
    setFormAuthority('Saudi Civil Defense (SBC 801)');
    setFormDesigner('Aly Ketkat');
    setFormReviewer('Eng. Fahad Al-Otaibi, Lead FPE');
    setFormRevision('Rev 00');
    setFormNotes('');
    setShowNewModal(true);
  };

  const handleSaveNewProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const newProj: Project = {
      id: `proj-${Date.now()}`,
      projectNumber: formNumber || `PRJ-${Date.now().toString().slice(-4)}`,
      projectName: formName,
      client: formClient || 'Confidential Client',
      consultant: formConsultant || 'Lead Engineering Consultant',
      mainContractor: formContractor || 'Specialized Fire Contractor',
      location: formLocation || 'Riyadh / Cairo / GCC',
      country: formCountry,
      authority: formAuthority,
      applicableCodes: ['NFPA 2001 (2022)', 'NFPA 72', 'SBC 801'],
      designer: formDesigner,
      reviewer: formReviewer,
      revision: formRevision,
      date: new Date().toISOString().split('T')[0],
      notes: formNotes,
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      zones: [
        {
          id: `zone-${Date.now()}-1`,
          zoneName: 'Protected Area 01',
          facilityType: 'data_center',
          technology: 'fk5112',
          reviewStatus: 'draft',
          enclosure: {
            shape: 'rectangular',
            length: 12.0,
            width: 8.0,
            height: 3.5,
            quantity: 1,
            hasRaisedFloor: true,
            raisedFloorHeight: 0.5,
            hasCeilingVoid: false,
            ceilingVoidHeight: 0,
            solidObstructions: 4.0,
            minTemp: 20,
            maxTemp: 30,
            elevation: 100,
            integrityTested: false,
            holdTimeTargetMin: 10,
          },
          boqItems: [],
        },
      ],
      costEstimate: {
        currency: formCountry === 'Saudi Arabia' ? 'SAR' : formCountry === 'Egypt' ? 'EGP' : formCountry === 'UAE' ? 'AED' : 'USD',
        materialDirectCost: 95000,
        installationDirectCost: 20000,
        otherDirectCosts: 0,
        subtotalDirect: 115000,
        overheadPercent: 10,
        overheadAmount: 11500,
        profitPercent: 15,
        profitAmount: 18975,
        contingencyPercent: 5,
        contingencyAmount: 5750,
        totalBeforeTax: 151225,
        vatPercent: 15,
        vatAmount: 22684,
        grandTotal: 173909,
      },
      reviewComments: [],
    };

    onCreateProject(newProj);
    setShowNewModal(false);
    onSelectProject(newProj);
  };

  const handleDuplicateProject = (proj: Project) => {
    const copy: Project = {
      ...proj,
      id: `proj-${Date.now()}`,
      projectNumber: `${proj.projectNumber}-COPY`,
      projectName: `${proj.projectName} (Copy)`,
      revision: 'Rev 00',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onCreateProject(copy);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-orange-500" />
            <span>{t.nav.projects}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {lang === 'ar'
              ? 'إنشاء وإدارة وتوثيق مشاريع وأنظمة الإطفاء المتخصصة بالمملكة ومصر والخليج'
              : 'Manage fire suppression engineering designs, multi-zone facilities, and code submittals'}
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs shadow-lg shadow-orange-500/20 transition cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{lang === 'ar' ? 'إضافة مشروع جديد' : 'Create New Project'}</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.common.search}
            className="w-full bg-slate-800/80 text-xs text-slate-200 pl-9 pr-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'الدولة:' : 'Country:'}</span>
          </div>
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-orange-500"
          >
            <option value="all">{lang === 'ar' ? 'جميع الدول' : 'All Countries'}</option>
            <option value="Saudi Arabia">Saudi Arabia</option>
            <option value="Egypt">Egypt</option>
            <option value="UAE">UAE</option>
            <option value="International">International</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-orange-500"
          >
            <option value="all">{lang === 'ar' ? 'جميع الحالات' : 'All Statuses'}</option>
            <option value="draft">Draft</option>
            <option value="calc_completed">Calculation Completed</option>
            <option value="review_required">Review Required</option>
            <option value="consultant_review">Consultant Review</option>
            <option value="approved_for_construction">Approved for Construction</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((proj) => {
          const isCurrentActive = proj.id === activeProject.id;
          const mainZone = proj.zones[0];
          return (
            <div
              key={proj.id}
              onClick={() => onSelectProject(proj)}
              className={`bg-slate-900 border rounded-xl p-5 flex flex-col justify-between transition group cursor-pointer ${
                isCurrentActive
                  ? 'border-orange-500 ring-1 ring-orange-500/50 shadow-lg shadow-orange-500/5'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Header row: Project number & Status */}
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-mono font-bold text-orange-400 px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/20">
                    {proj.projectNumber}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {proj.revision}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                        mainZone?.reviewStatus === 'approved_for_construction'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : mainZone?.reviewStatus === 'consultant_review'
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {t.statuses[mainZone?.reviewStatus || 'draft']}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-2 mb-2">
                  {proj.projectName}
                </h3>

                {/* Meta details */}
                <div className="space-y-1 text-[11px] text-slate-400 mb-4">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{proj.client}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{proj.country} · {proj.authority}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{proj.date} · {proj.designer}</span>
                  </div>
                </div>

                {/* Protected Zones Pills */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {proj.zones.map((zone) => (
                    <span
                      key={zone.id}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/80 flex items-center gap-1"
                    >
                      <span className="font-semibold">{zone.zoneName}</span>
                      <span className="text-orange-400 font-mono">({zone.technology.toUpperCase()})</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDuplicateProject(proj);
                    }}
                    className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
                    title="Duplicate Project"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProject(proj);
                      onNavigate('reports');
                    }}
                    className="text-xs text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1"
                  >
                    <span>{lang === 'ar' ? 'المذكرة الحسابية' : 'Open Sizing Sheet'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Project Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-orange-500" />
                <span>{lang === 'ar' ? 'إنشاء مشروع إطفاء جديد' : 'New Fire Suppression Project'}</span>
              </h2>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNewProject} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">{t.common.projectName} *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Riyadh Central Data Center Hall 2"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Project Code / Number</label>
                  <input
                    type="text"
                    value={formNumber}
                    onChange={(e) => setFormNumber(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">{t.common.client}</label>
                  <input
                    type="text"
                    value={formClient}
                    onChange={(e) => setFormClient(e.target.value)}
                    placeholder="e.g. Saudi Aramco / STC"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">{t.common.consultant}</label>
                  <input
                    type="text"
                    value={formConsultant}
                    onChange={(e) => setFormConsultant(e.target.value)}
                    placeholder="e.g. Dar Al-Handasah"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">{t.common.contractor}</label>
                  <input
                    type="text"
                    value={formContractor}
                    onChange={(e) => setFormContractor(e.target.value)}
                    placeholder="e.g. Al-Bawani / Nesma"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Country</label>
                  <select
                    value={formCountry}
                    onChange={(e) => setFormCountry(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="Saudi Arabia">Saudi Arabia (KSA)</option>
                    <option value="Egypt">Egypt</option>
                    <option value="UAE">United Arab Emirates</option>
                    <option value="Qatar">Qatar</option>
                    <option value="Kuwait">Kuwait</option>
                    <option value="Oman">Oman</option>
                    <option value="International">International</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Location / City</label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="e.g. Riyadh, KAFD"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Applicable Authority / Code</label>
                  <input
                    type="text"
                    value={formAuthority}
                    onChange={(e) => setFormAuthority(e.target.value)}
                    placeholder="e.g. Saudi Civil Defense (SBC 801)"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">{t.common.designer}</label>
                  <input
                    type="text"
                    value={formDesigner}
                    onChange={(e) => setFormDesigner(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">{t.common.reviewer}</label>
                  <input
                    type="text"
                    value={formReviewer}
                    onChange={(e) => setFormReviewer(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">{t.common.revision}</label>
                  <input
                    type="text"
                    value={formRevision}
                    onChange={(e) => setFormRevision(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Engineering Scope & Notes</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Key hazard descriptions, enclosure boundaries, client special requirements..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg shadow-orange-500/20"
                >
                  {lang === 'ar' ? 'حفظ المشروع والبدء' : 'Create & Open Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
