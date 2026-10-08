import React, { useState } from 'react';
import { useSecurity } from '../../context/SecurityContext';
import { StrideThreat, SeverityLevel } from '../../types/security';
import {
  Activity,
  ArrowUpDown,
  X,
  ArrowRight
} from 'lucide-react';

export const RiskMatrixView: React.FC = () => {
  const { currentProject, setActiveTab } = useSecurity();

  const [sortField, setSortField] = useState<'riskScore' | 'impact' | 'likelihood' | 'component' | 'category'>('riskScore');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [selectedCell, setSelectedCell] = useState<{ l: number; i: number } | null>(null);
  const [inspectThreat, setInspectThreat] = useState<StrideThreat | null>(null);
  const [viewMode, setViewMode] = useState<'matrix' | 'tiers'>('matrix');

  const likelihoodLabels = ['Rare', 'Unlikely', 'Moderate', 'Likely', 'Almost Certain'];
  const impactLabels = ['Negligible', 'Minor', 'Moderate', 'Major', 'Catastrophic'];

  const getCellRiskLevel = (l: number, i: number): SeverityLevel => {
    const score = l * i;
    if (score >= 15) return 'Critical';
    if (score >= 10) return 'High';
    if (score >= 5) return 'Medium';
    return 'Low';
  };

  const getCellBg = (l: number, i: number, isSelected: boolean) => {
    const level = getCellRiskLevel(l, i);
    if (isSelected) return 'ring-2 ring-cyan-400 bg-gradient-to-br from-cyan-900/90 to-indigo-900/80 border-cyan-400 text-white shadow-lg shadow-cyan-500/25 scale-[1.03] z-10';
    if (level === 'Critical') return 'bg-gradient-to-br from-rose-950/85 to-red-900/60 hover:from-rose-900/90 hover:to-red-800/70 border-rose-600/80 text-rose-100 shadow-xs';
    if (level === 'High') return 'bg-gradient-to-br from-amber-950/85 to-orange-900/60 hover:from-amber-900/90 hover:to-orange-800/70 border-amber-600/80 text-amber-100 shadow-xs';
    if (level === 'Medium') return 'bg-gradient-to-br from-yellow-950/70 to-amber-900/50 hover:from-yellow-900/80 hover:to-amber-800/60 border-yellow-600/70 text-yellow-100 shadow-xs';
    return 'bg-gradient-to-br from-emerald-950/70 to-teal-900/50 hover:from-emerald-900/80 hover:to-teal-800/60 border-emerald-600/70 text-emerald-100 shadow-xs';
  };

  const filteredThreats = currentProject.threats.filter((t) => {
    if (!selectedCell) return true;
    return t.likelihoodScore === selectedCell.l && t.impactScore === selectedCell.i;
  });

  const sortedThreats = [...filteredThreats].sort((a, b) => {
    let compA = a[sortField];
    let compB = b[sortField];

    if (sortField === 'impact' || sortField === 'likelihood') {
      const order: Record<string, number> = { Critical: 4, High: 3, Medium: 2, Low: 1 };
      compA = order[a[sortField]] || 0;
      compB = order[b[sortField]] || 0;
    }

    if (compA < compB) return sortAsc ? -1 : 1;
    if (compA > compB) return sortAsc ? 1 : -1;
    return 0;
  });

  return (
    <div className="p-3.5 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 sm:pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider font-mono bg-cyan-950/50 border border-cyan-800/50 px-2 py-0.5 rounded">
              Quantitative TARA
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-indigo-300 font-mono bg-indigo-950/40 border border-indigo-800/40 px-2 py-0.5 rounded">Likelihood × Impact</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white mt-1.5">
            Risk Analysis &amp; 5x5 Threat Matrix
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            ISO/SAE 21434 risk assessment. Click any cell to inspect threats situated within that quadrant.
          </p>
        </div>

        {selectedCell && (
          <button
            onClick={() => setSelectedCell(null)}
            className="flex items-center gap-1.5 text-xs text-cyan-300 hover:text-white bg-cyan-950/60 px-3 py-1.5 rounded-lg border border-cyan-700/60 shadow-xs"
          >
            <span>L:{selectedCell.l}, I:{selectedCell.i} · Clear Filter</span>
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Grid: 5x5 Matrix on left, Threat ranking on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Interactive 5x5 Matrix or Risk Tiers */}
        <div className="lg:col-span-7 rounded-xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5 space-y-3 sm:space-y-4 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-white">Risk Heatmap &amp; Assessment</h2>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setViewMode('matrix')}
                className={`px-3 py-1 rounded font-semibold transition-colors ${
                  viewMode === 'matrix'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                5x5 Matrix
              </button>
              <button
                onClick={() => setViewMode('tiers')}
                className={`px-3 py-1 rounded font-semibold transition-colors ${
                  viewMode === 'tiers'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Risk Tiers
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-mono justify-end">
            <span className="text-rose-400 font-bold bg-rose-950/50 px-2 py-0.5 rounded border border-rose-900/50">🔴 Crit (&ge;15)</span>
            <span className="text-amber-400 font-bold bg-amber-950/50 px-2 py-0.5 rounded border border-amber-900/50">🟠 High (&ge;10)</span>
            <span className="text-yellow-400 font-bold bg-yellow-950/50 px-2 py-0.5 rounded border border-yellow-900/50">🟡 Med (&ge;5)</span>
            <span className="text-emerald-400 font-bold bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-900/50">🟢 Low</span>
          </div>

          {viewMode === 'tiers' ? (
            /* Mobile-friendly Risk Tier Breakdown Cards */
            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {[
                { title: 'Critical Risk (Immediate Action)', min: 15, max: 25, badge: 'bg-rose-950/80 text-rose-200 border-rose-700 font-bold shadow-xs', border: 'border-rose-500/40', bg: 'bg-gradient-to-b from-rose-950/25 to-slate-900/90' },
                { title: 'High Risk (Short-Term Mitigation)', min: 10, max: 14, badge: 'bg-amber-950/80 text-amber-200 border-amber-700 font-bold shadow-xs', border: 'border-amber-500/40', bg: 'bg-gradient-to-b from-amber-950/25 to-slate-900/90' },
                { title: 'Medium Risk (Planned Controls)', min: 5, max: 9, badge: 'bg-yellow-950/60 text-yellow-200 border-yellow-700 font-bold shadow-xs', border: 'border-yellow-500/35', bg: 'bg-gradient-to-b from-yellow-950/20 to-slate-900/90' },
                { title: 'Low Risk (Continuous Monitoring)', min: 1, max: 4, badge: 'bg-emerald-950/80 text-emerald-200 border-emerald-700 font-bold shadow-xs', border: 'border-emerald-500/35', bg: 'bg-gradient-to-b from-emerald-950/20 to-slate-900/90' },
              ].map((tier) => {
                const tierThreats = currentProject.threats.filter(
                  t => (t.likelihoodScore * t.impactScore) >= tier.min && (t.likelihoodScore * t.impactScore) <= tier.max
                );

                return (
                  <div key={tier.title} className={`rounded-xl border ${tier.border} ${tier.bg} p-3 sm:p-4 space-y-2`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{tier.title}</span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${tier.badge}`}>
                        {tierThreats.length} Threats
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {tierThreats.map((threat) => (
                        <div
                          key={threat.id}
                          onClick={() => setInspectThreat(threat)}
                          className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition-colors cursor-pointer flex items-center justify-between text-xs"
                        >
                          <div className="min-w-0 pr-2">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-blue-400 font-bold">{threat.id}</span>
                              <span className="text-white font-medium truncate">{threat.title}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono truncate block mt-0.5">{threat.component}</span>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 shrink-0">
                            Score {threat.riskScore}
                          </span>
                        </div>
                      ))}
                      {tierThreats.length === 0 && (
                        <p className="text-[11px] text-slate-500 italic py-1">No threats situated in this tier.</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Matrix Container - Horizontal scroll on mobile */
            <div className="overflow-x-auto pt-1 pb-2">
              <div className="min-w-[420px]">
                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                  ▲ Impact (1 = Negligible → 5 = Catastrophic)
                </div>

                {/* Grid (Impact 5 down to 1) */}
                <div className="space-y-1.5">
                  {[5, 4, 3, 2, 1].map((impactVal) => (
                    <div key={impactVal} className="flex items-center gap-2">
                      <div className="w-20 text-right text-[10px] font-mono text-slate-400 truncate">
                        {impactLabels[impactVal - 1]} ({impactVal})
                      </div>

                      <div className="grid grid-cols-5 gap-1.5 flex-1">
                        {[1, 2, 3, 4, 5].map((likelihoodVal) => {
                          const threatsInCell = currentProject.threats.filter(
                            (t) => t.likelihoodScore === likelihoodVal && t.impactScore === impactVal
                          );
                          const count = threatsInCell.length;
                          const isSelected =
                            selectedCell?.l === likelihoodVal && selectedCell?.i === impactVal;

                          return (
                            <button
                              key={`${likelihoodVal}-${impactVal}`}
                              onClick={() => {
                                if (isSelected) setSelectedCell(null);
                                else setSelectedCell({ l: likelihoodVal, i: impactVal });
                              }}
                              className={`min-h-[44px] h-12 rounded-lg border flex flex-col items-center justify-center p-1 transition-all ${getCellBg(
                                likelihoodVal,
                                impactVal,
                                isSelected
                              )}`}
                            >
                              <span className="text-[9px] font-mono opacity-60">
                                L{likelihoodVal}×I{impactVal}
                              </span>
                              {count > 0 ? (
                                <span className="text-[11px] font-mono font-bold bg-slate-950 px-1.5 py-0.2 rounded mt-0.5 border border-slate-700">
                                  {count} {count === 1 ? 'threat' : 'threats'}
                                </span>
                              ) : (
                                <span className="text-[9px] text-slate-500">-</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {/* X Axis Labels */}
                  <div className="flex items-center gap-2 pt-2">
                    <div className="w-20" />
                    <div className="grid grid-cols-5 gap-1.5 flex-1 text-center text-[10px] font-mono text-slate-400">
                      {likelihoodLabels.map((lbl, idx) => (
                        <span key={lbl} className="truncate">
                          {lbl} ({idx + 1})
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-center text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider pt-1">
                    ► Likelihood (1 = Rare → 5 = Almost Certain)
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Threat Ranking & Details Panel */}
        <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5 space-y-3.5 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-2">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-white">Prioritized Threats</h3>
                <span className="text-[11px] text-slate-400">
                  {sortedThreats.length} vectors situated
                </span>
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400">Sort:</span>
                <select
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value as any)}
                  className="rounded-lg border border-slate-800 bg-slate-950 px-2 py-1 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="riskScore">Risk Score</option>
                  <option value="impact">Impact</option>
                  <option value="likelihood">Likelihood</option>
                  <option value="component">Component</option>
                  <option value="category">STRIDE</option>
                </select>
                <button
                  onClick={() => setSortAsc(!sortAsc)}
                  className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white"
                  title="Toggle order"
                >
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Threat List */}
            <div className="space-y-2 mt-3 max-h-[380px] overflow-y-auto pr-1">
              {sortedThreats.map((threat) => {
                const isCritical = threat.riskScore >= 9.0;
                const isHigh = threat.riskScore >= 7.0 && threat.riskScore < 9.0;

                return (
                  <div
                    key={threat.id}
                    onClick={() => setInspectThreat(threat)}
                    className="p-3 rounded-lg border border-slate-800 bg-slate-950 hover:border-slate-700 hover:bg-slate-850 transition-all cursor-pointer flex flex-col space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono font-bold text-blue-400">{threat.id}</span>
                        <span className="text-[10px] text-slate-400 font-mono">[{threat.category}]</span>
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                        isCritical
                          ? 'bg-red-950 text-red-300 border-red-900'
                          : isHigh
                          ? 'bg-amber-950 text-amber-300 border-amber-900'
                          : 'bg-yellow-950 text-yellow-300 border-yellow-900'
                      }`}>
                        Score {threat.riskScore}
                      </span>
                    </div>

                    <h4 className="text-xs font-semibold text-white truncate">{threat.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{threat.attackVector}</p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 font-mono">
                      <span>{threat.component}</span>
                      <span className="text-blue-400">Inspect →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('threat-model')}
            className="w-full mt-2 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
          >
            Open Full STRIDE Threat Model
          </button>
        </div>
      </div>

      {/* DREAD Risk Calculation Modal */}
      {inspectThreat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-blue-400">{inspectThreat.id} Risk Profile</span>
                <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">{inspectThreat.title}</h3>
              </div>
              <button onClick={() => setInspectThreat(null)} className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="text-[10px] font-mono uppercase font-bold text-slate-400">Risk Calculation</div>
                <div className="text-sm font-mono font-bold text-white mt-0.5">
                  Likelihood ({inspectThreat.likelihoodScore}/5) × Impact ({inspectThreat.impactScore}/5) = {inspectThreat.likelihoodScore * inspectThreat.impactScore} / 25
                </div>
                <div className="text-xs text-red-400 mt-1 font-mono">
                  Normalized CVSS v3.1 Risk Score: {inspectThreat.riskScore} / 10.0
                </div>
              </div>

              {/* DREAD Factors */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  DREAD Evaluation Factors
                </label>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <span className="font-mono text-blue-400">Damage Potential:</span> 9/10
                  </div>
                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <span className="font-mono text-blue-400">Reproducibility:</span> 8/10
                  </div>
                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <span className="font-mono text-blue-400">Exploitability:</span> {inspectThreat.exploitability}/10
                  </div>
                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <span className="font-mono text-blue-400">Discoverability:</span> 8/10
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Recommended Mitigation
                </label>
                <p className="mt-1 text-emerald-400 bg-emerald-950/20 border border-emerald-900/40 p-2.5 rounded-lg">
                  {inspectThreat.recommendedMitigation}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  setInspectThreat(null);
                  setActiveTab('threat-model');
                }}
                className="text-xs text-slate-400 hover:text-white"
              >
                View in Threat Model →
              </button>
              <button
                onClick={() => {
                  setInspectThreat(null);
                  setActiveTab('mitigations');
                }}
                className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 shadow-sm"
              >
                Apply Mitigation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
