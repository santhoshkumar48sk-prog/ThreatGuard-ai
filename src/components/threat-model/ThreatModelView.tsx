import React, { useState } from 'react';
import { useSecurity } from '../../context/SecurityContext';
import { StrideThreat } from '../../types/security';
import {
  ShieldAlert,
  UserX,
  FileEdit,
  History,
  EyeOff,
  Flame,
  ArrowUpRight,
  Search,
  Activity,
  ArrowRight,
  X
} from 'lucide-react';

export const ThreatModelView: React.FC = () => {
  const { currentProject, selectedThreatId, setActiveTab } = useSecurity();

  const [activeStrideCategory, setActiveStrideCategory] = useState<string>('All');
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [inspectThreat, setInspectThreat] = useState<StrideThreat | null>(
    currentProject.threats.find(t => t.id === selectedThreatId) || null
  );

  const strideCategories = [
    { 
      id: 'All', 
      name: 'All STRIDE', 
      desc: 'All evaluated threat vectors', 
      icon: ShieldAlert,
      color: 'text-indigo-400',
      activeBg: 'bg-indigo-950/60 border-indigo-500 text-white shadow-md shadow-indigo-950/50',
      tagColor: 'bg-indigo-950/60 text-indigo-300 border-indigo-800'
    },
    { 
      id: 'Spoofing', 
      name: 'Spoofing', 
      desc: 'Attacker impersonates a legitimate user or device', 
      icon: UserX,
      color: 'text-purple-400',
      activeBg: 'bg-purple-950/60 border-purple-500 text-purple-100 shadow-md shadow-purple-950/50',
      tagColor: 'bg-purple-950/60 text-purple-300 border-purple-800'
    },
    { 
      id: 'Tampering', 
      name: 'Tampering', 
      desc: 'Attacker modifies data, firmware, or bus frames', 
      icon: FileEdit,
      color: 'text-amber-400',
      activeBg: 'bg-amber-950/60 border-amber-500 text-amber-100 shadow-md shadow-amber-950/50',
      tagColor: 'bg-amber-950/60 text-amber-300 border-amber-800'
    },
    { 
      id: 'Repudiation', 
      name: 'Repudiation', 
      desc: 'Actions cannot be reliably audited or traced', 
      icon: History,
      color: 'text-cyan-400',
      activeBg: 'bg-cyan-950/60 border-cyan-500 text-cyan-100 shadow-md shadow-cyan-950/50',
      tagColor: 'bg-cyan-950/60 text-cyan-300 border-cyan-800'
    },
    { 
      id: 'Information Disclosure', 
      name: 'Info Disclosure', 
      desc: 'Sensitive telemetry or keys are exposed', 
      icon: EyeOff,
      color: 'text-rose-400',
      activeBg: 'bg-rose-950/60 border-rose-500 text-rose-100 shadow-md shadow-rose-950/50',
      tagColor: 'bg-rose-950/60 text-rose-300 border-rose-800'
    },
    { 
      id: 'Denial of Service', 
      name: 'Denial of Service', 
      desc: 'System availability or bus arbitration is disrupted', 
      icon: Flame,
      color: 'text-orange-400',
      activeBg: 'bg-orange-950/60 border-orange-500 text-orange-100 shadow-md shadow-orange-950/50',
      tagColor: 'bg-orange-950/60 text-orange-300 border-orange-800'
    },
    { 
      id: 'Elevation of Privilege', 
      name: 'Elevation of Privilege', 
      desc: 'Attacker gains unauthorized root privileges', 
      icon: ArrowUpRight,
      color: 'text-red-400',
      activeBg: 'bg-red-950/60 border-red-500 text-red-100 shadow-md shadow-red-950/50',
      tagColor: 'bg-red-950/60 text-red-300 border-red-800'
    },
  ];

  const filteredThreats = currentProject.threats.filter((t) => {
    const matchesCat = activeStrideCategory === 'All' || t.category === activeStrideCategory;
    const matchesSev = severityFilter === 'All' || t.impact === severityFilter;
    const matchesSearch =
      search === '' ||
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.component.toLowerCase().includes(search.toLowerCase()) ||
      t.attackVector.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSev && matchesSearch;
  });

  return (
    <div className="p-3.5 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 sm:pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider font-mono bg-cyan-950/50 border border-cyan-800/50 px-2 py-0.5 rounded">
              STRIDE Threat Modeling
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-indigo-300 font-mono bg-indigo-950/40 border border-indigo-800/40 px-2 py-0.5 rounded">
              {currentProject.threats.length} Identified Vectors
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white mt-1.5">
            Threat Modeling &amp; STRIDE Analysis
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Protocol-grounded threat modeling conforming to Microsoft STRIDE and ISO/SAE 21434 threat analysis &amp; risk assessment (TARA).
          </p>
        </div>

        <button
          onClick={() => setActiveTab('risk-matrix')}
          className="flex items-center justify-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-950/40 px-3.5 py-2 text-xs font-semibold text-indigo-200 hover:bg-indigo-900/50 hover:border-indigo-400/50 hover:text-white transition-all shadow-xs"
        >
          <Activity className="h-3.5 w-3.5 text-cyan-400" />
          <span>Interactive Risk Matrix</span>
        </button>
      </div>

      {/* STRIDE Category Cards Selector - Scrollable on mobile */}
      <div className="flex sm:grid sm:grid-cols-4 lg:grid-cols-7 gap-2 overflow-x-auto pb-1 no-scrollbar">
        {strideCategories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = activeStrideCategory === cat.id;
          const count = cat.id === 'All' 
            ? currentProject.threats.length 
            : currentProject.threats.filter(t => t.category === cat.id).length;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveStrideCategory(cat.id)}
              className={`min-w-[125px] sm:min-w-0 p-3 rounded-xl border text-left transition-all flex flex-col justify-between shrink-0 sm:shrink group ${
                isSelected
                  ? cat.activeBg
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`h-4 w-4 transition-transform group-hover:scale-110 ${isSelected ? 'text-white' : cat.color}`} />
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border shadow-xs ${
                  isSelected ? 'bg-black/40 text-white border-white/20' : cat.tagColor
                }`}>
                  {count}
                </span>
              </div>
              <div>
                <div className="text-xs font-bold truncate">{cat.name}</div>
                <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{cat.desc}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-3 rounded-xl shadow-xs">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-400" />
          <input
            type="text"
            placeholder="Search by threat ID (THR-001), component, or vector..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-950/90 pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-400 mr-1 font-mono">Severity:</span>
          {[
            { id: 'All', label: 'All', active: 'bg-slate-800 text-white font-bold' },
            { id: 'Critical', label: 'Critical', active: 'bg-rose-950/70 text-rose-300 border border-rose-800/80 font-bold' },
            { id: 'High', label: 'High', active: 'bg-amber-950/70 text-amber-300 border border-amber-800/80 font-bold' },
            { id: 'Medium', label: 'Medium', active: 'bg-yellow-950/70 text-yellow-300 border border-yellow-800/80 font-bold' },
          ].map((sev) => (
            <button
              key={sev.id}
              onClick={() => setSeverityFilter(sev.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                severityFilter === sev.id
                  ? sev.active
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {sev.label}
            </button>
          ))}
        </div>
      </div>

      {/* Threats Grid */}
      <div className="space-y-3">
        {filteredThreats.map((threat) => {
          const isCritical = threat.impact === 'Critical' || threat.riskScore >= 9.0;
          const isHigh = threat.impact === 'High' || (threat.riskScore >= 7.0 && threat.riskScore < 9.0);

          const strideCategoryColors: Record<string, { tag: string; border: string }> = {
            'Spoofing': { tag: 'bg-purple-950/70 text-purple-300 border-purple-800/60', border: 'border-purple-500/25' },
            'Tampering': { tag: 'bg-amber-950/70 text-amber-300 border-amber-800/60', border: 'border-amber-500/25' },
            'Repudiation': { tag: 'bg-cyan-950/70 text-cyan-300 border-cyan-800/60', border: 'border-cyan-500/25' },
            'Information Disclosure': { tag: 'bg-rose-950/70 text-rose-300 border-rose-800/60', border: 'border-rose-500/25' },
            'Denial of Service': { tag: 'bg-orange-950/70 text-orange-300 border-orange-800/60', border: 'border-orange-500/25' },
            'Elevation of Privilege': { tag: 'bg-red-950/70 text-red-300 border-red-800/60', border: 'border-red-500/25' },
          };

          const catStyle = strideCategoryColors[threat.category] || { tag: 'bg-blue-950/70 text-blue-300 border-blue-800/60', border: 'border-slate-800' };

          return (
            <div
              key={threat.id}
              onClick={() => setInspectThreat(threat)}
              className={`rounded-xl border ${catStyle.border} bg-slate-900/90 p-4 sm:p-5 hover:border-indigo-500/50 hover:bg-slate-850 hover:shadow-lg hover:shadow-indigo-500/5 transition-all cursor-pointer space-y-2.5 group`}
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/50 border border-cyan-800/50 px-2 py-0.5 rounded shadow-xs">
                    {threat.id}
                  </span>
                  <span className={`text-xs font-semibold font-mono px-2 py-0.5 rounded border shadow-xs ${catStyle.tag}`}>
                    [{threat.category}]
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="text-xs text-slate-300">
                    Target: <strong className="text-white font-semibold">{threat.component}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-[11px] font-mono text-indigo-300 bg-indigo-950/40 border border-indigo-800/40 px-2 py-0.5 rounded">
                    CVSS {threat.cvss}
                  </span>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border shadow-xs ${
                    isCritical
                      ? 'bg-rose-950 text-rose-300 border-rose-800'
                      : isHigh
                      ? 'bg-amber-950 text-amber-300 border-amber-800'
                      : 'bg-yellow-950 text-yellow-300 border-yellow-800'
                  }`}>
                    Risk: {threat.riskScore}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-200 transition-colors">
                  {threat.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mt-1">
                  {threat.description}
                </p>
              </div>

              {/* Attack Vector & Evidence */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1 text-xs">
                <div className="bg-slate-950/90 p-2.5 rounded-lg border border-slate-800/90">
                  <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block mb-0.5">
                    Attack Vector
                  </span>
                  <span className="font-mono text-cyan-300 font-medium">{threat.attackVector}</span>
                </div>

                <div className="bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-900/40">
                  <span className="text-[10px] uppercase font-mono font-bold text-emerald-400 block mb-0.5">
                    Recommended Mitigation
                  </span>
                  <span className="text-emerald-300 font-medium">{threat.recommendedMitigation}</span>
                </div>
              </div>

              {/* Footer row */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400">
                <div className="flex flex-wrap items-center gap-3">
                  <span>Likelihood: <strong className="text-slate-200">{threat.likelihood}</strong></span>
                  <span>Impact: <strong className="text-slate-200">{threat.impact}</strong></span>
                  <span>Exploitability: <strong className="text-slate-200">{threat.exploitability}/10</strong></span>
                  <span className="text-slate-300">{threat.relatedCwe}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab('security-tests');
                  }}
                  className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
                >
                  <span>Generate Test Case</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Threat Modal */}
      {inspectThreat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                    {inspectThreat.id}
                  </span>
                  <span className="text-xs font-mono text-slate-300">
                    STRIDE: {inspectThreat.category}
                  </span>
                  <span className="text-xs font-mono text-red-400 font-bold bg-red-950 px-2 py-0.5 rounded border border-red-900">
                    Risk: {inspectThreat.riskScore}/10
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white mt-1.5">{inspectThreat.title}</h2>
              </div>
              <button onClick={() => setInspectThreat(null)} className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Target Component &amp; Vector
                </label>
                <div className="mt-1 font-mono text-blue-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  {inspectThreat.component} · Vector: {inspectThreat.attackVector}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Full Threat Mechanics
                </label>
                <p className="mt-1 text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
                  {inspectThreat.description}
                </p>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Technical Architecture Evidence
                </label>
                <div className="mt-1 font-mono text-emerald-400 bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] leading-relaxed">
                  {inspectThreat.evidence}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Likelihood</span>
                  <span className="font-bold text-white text-sm">{inspectThreat.likelihood}</span>
                </div>
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Impact</span>
                  <span className="font-bold text-red-400 text-sm">{inspectThreat.impact}</span>
                </div>
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">CVSS v3.1</span>
                  <span className="font-bold text-blue-400 text-sm">{inspectThreat.cvss}</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Recommended Mitigation
                </label>
                <p className="mt-1 text-emerald-300 leading-relaxed bg-emerald-950/20 border border-emerald-900/40 p-2.5 rounded-lg">
                  {inspectThreat.recommendedMitigation}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  setInspectThreat(null);
                  setActiveTab('risk-matrix');
                }}
                className="text-xs text-slate-400 hover:text-white"
              >
                Inspect in Risk Matrix →
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setInspectThreat(null);
                    setActiveTab('mitigations');
                  }}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700"
                >
                  Mitigations
                </button>
                <button
                  onClick={() => {
                    setInspectThreat(null);
                    setActiveTab('security-tests');
                  }}
                  className="rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 shadow-sm"
                >
                  Generate Test
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
