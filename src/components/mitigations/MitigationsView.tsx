import React, { useState } from 'react';
import { useSecurity } from '../../context/SecurityContext';
import { MitigationItem } from '../../types/security';
import {
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Search
} from 'lucide-react';

export const MitigationsView: React.FC = () => {
  const { currentProject, updateMitigationStatus } = useSecurity();

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [search, setSearch] = useState<string>('');

  const filteredMitigations = currentProject.mitigations.filter((m) => {
    const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
    const matchesSearch =
      search === '' ||
      m.threatTitle.toLowerCase().includes(search.toLowerCase()) ||
      m.component.toLowerCase().includes(search.toLowerCase()) ||
      m.title.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const implementedCount = currentProject.mitigations.filter(m => m.status === 'Implemented').length;

  return (
    <div className="p-3.5 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 sm:pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider font-mono">
              Actionable Hardening
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400 font-mono">
              ISO/SAE 21434 &amp; UNECE R155 Countermeasures
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mt-1">
            Mitigation Recommendations
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Prioritized engineering remediation actions with projected risk reduction deltas and security standard mappings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-slate-900 to-emerald-950/40 border border-emerald-800/40 p-2.5 sm:p-3 rounded-xl shadow-md text-left sm:text-right">
            <div className="text-[10px] uppercase font-mono text-emerald-400/80 font-semibold tracking-wider">Implementation Progress</div>
            <div className="text-xs sm:text-sm font-mono font-bold text-emerald-300 flex items-center justify-end gap-1.5 mt-0.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>{implementedCount} / {currentProject.mitigations.length} Resolved</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-3 rounded-xl shadow-xs">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400" />
          <input
            type="text"
            placeholder="Search mitigations, threats, or components..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-950/90 pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-xs font-semibold text-slate-400 mr-1 font-mono shrink-0">Status:</span>
          {[
            { id: 'All', active: 'bg-indigo-600 text-white shadow-xs' },
            { id: 'Planned', active: 'bg-slate-700 text-white shadow-xs' },
            { id: 'In Progress', active: 'bg-amber-600 text-white shadow-xs shadow-amber-900/50' },
            { id: 'Implemented', active: 'bg-emerald-600 text-white shadow-xs shadow-emerald-900/50' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                statusFilter === st.id
                  ? `${st.active} font-bold`
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {st.id}
            </button>
          ))}
        </div>
      </div>

      {/* Mitigations List */}
      <div className="space-y-4">
        {filteredMitigations.map((mitigation) => {
          const isImplemented = mitigation.status === 'Implemented';

          return (
            <div
              key={mitigation.id}
              className={`rounded-xl border p-4 sm:p-5 transition-all space-y-3.5 ${
                isImplemented
                  ? 'bg-emerald-950/10 border-emerald-900/50 shadow-sm'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-blue-400">{mitigation.threatId}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-xs font-semibold text-slate-300 font-mono">
                      {mitigation.component}
                    </span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-white mt-1">{mitigation.title}</h3>
                </div>

                {/* Status Toggle Buttons - tap friendly on mobile */}
                <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-1 rounded-lg self-start sm:self-auto overflow-x-auto">
                  {(['Planned', 'In Progress', 'Implemented'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => updateMitigationStatus(mitigation.id, st)}
                      className={`px-2.5 py-1 rounded text-[11px] font-mono font-semibold transition-all whitespace-nowrap ${
                        mitigation.status === st
                          ? st === 'Implemented'
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : st === 'In Progress'
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-slate-800 text-slate-200'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actionable Recommendations Checklist */}
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block mb-1.5">
                  Actionable Steps
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {mitigation.actionableSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-300"
                    >
                      <CheckCircle2
                        className={`h-4 w-4 shrink-0 mt-0.5 ${
                          isImplemented ? 'text-emerald-400' : 'text-slate-600'
                        }`}
                      />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Reduction Diff & Architecture Delta */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800 text-xs">
                {/* Visual Risk Diff: Current Risk -> Expected Risk */}
                <div className="flex items-center gap-2.5 bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <div className="text-right">
                    <span className="text-[9px] uppercase font-mono text-slate-400 block">Current</span>
                    <span className="text-xs font-mono font-bold text-red-400">
                      {mitigation.currentRisk} ({mitigation.currentScore})
                    </span>
                  </div>

                  <ArrowRight className="h-3.5 w-3.5 text-emerald-400 shrink-0" />

                  <div className="bg-emerald-950/40 border border-emerald-900/40 px-2.5 py-0.5 rounded">
                    <span className="text-[9px] uppercase font-mono text-emerald-400 block font-semibold">
                      Projected
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-300">
                      {mitigation.expectedRisk} ({mitigation.expectedScore})
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-400">
                  <span>Complexity: <strong className="text-slate-200">{mitigation.complexity}</strong></span>
                  <span>ETA: <strong className="text-slate-200">{mitigation.implementationEta}</strong></span>
                  <span className="text-blue-400">{mitigation.securityStandardReference}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
