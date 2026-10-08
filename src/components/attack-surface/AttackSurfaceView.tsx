import React, { useState } from 'react';
import { useSecurity } from '../../context/SecurityContext';
import { AttackSurface, SeverityLevel } from '../../types/security';
import {
  Crosshair,
  Search,
  ArrowRight,
  FileCode,
  X
} from 'lucide-react';

export const AttackSurfaceView: React.FC = () => {
  const { currentProject, setActiveTab } = useSecurity();

  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [selectedSurface, setSelectedSurface] = useState<AttackSurface | null>(null);

  const categories = ['All', 'Network', 'Wireless', 'Physical', 'Software'];
  const severities = ['All', 'Critical', 'High', 'Medium', 'Low'];

  const filteredSurfaces = currentProject.attackSurfaces.filter((item) => {
    const matchesSeverity = severityFilter === 'All' || item.risk === severityFilter;
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesSearch =
      search === '' ||
      item.component.toLowerCase().includes(search.toLowerCase()) ||
      item.interface.toLowerCase().includes(search.toLowerCase()) ||
      item.potentialAttack.toLowerCase().includes(search.toLowerCase()) ||
      item.entryPoint.toLowerCase().includes(search.toLowerCase());
    return matchesSeverity && matchesCategory && matchesSearch;
  });

  return (
    <div className="p-3.5 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 sm:pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider font-mono bg-cyan-950/50 border border-cyan-800/50 px-2 py-0.5 rounded">
              Perimeter Defense
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-indigo-300 font-mono bg-indigo-950/40 border border-indigo-800/40 px-2 py-0.5 rounded">
              {currentProject.attackSurfaces.length} Exposed Points
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white mt-1.5">
            Attack Surface Discovery
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Automatically analyzed ingress vectors, communication sockets, wireless peripherals, and hardware debugging ports.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-rose-300 font-bold bg-rose-950/70 border border-rose-800/80 px-2.5 py-1 rounded-lg shadow-xs">
            🔴 {currentProject.attackSurfaces.filter(a => a.risk === 'Critical').length} Critical
          </span>
          <span className="text-amber-300 font-bold bg-amber-950/70 border border-amber-800/80 px-2.5 py-1 rounded-lg shadow-xs">
            🟠 {currentProject.attackSurfaces.filter(a => a.risk === 'High').length} High
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-3 sm:p-4 rounded-xl shadow-xs">
        {/* Search */}
        <div className="relative flex-1 w-full lg:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-400" />
          <input
            type="text"
            placeholder="Search component, interface (CAN, Bluetooth...), or entry point..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-950/90 pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        {/* Category & Severity Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg p-1 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 sm:px-3 py-1 rounded text-xs font-semibold whitespace-nowrap transition-colors ${
                  categoryFilter === cat
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Severity Filter */}
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg p-1 overflow-x-auto no-scrollbar">
            {severities.map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2.5 sm:px-3 py-1 rounded text-xs font-semibold whitespace-nowrap transition-colors ${
                  severityFilter === sev
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Card List (< md screens) */}
      <div className="md:hidden space-y-3">
        {filteredSurfaces.map((surface) => {
          const isCritical = surface.risk === 'Critical';
          const isHigh = surface.risk === 'High';

          return (
            <div
              key={surface.id}
              onClick={() => setSelectedSurface(surface)}
              className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-2.5 active:bg-slate-850 cursor-pointer shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-xs font-bold text-white">{surface.component}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5 font-mono text-[11px] text-blue-400">
                    <span>{surface.interface}</span>
                    {surface.portOrAddress && (
                      <span className="text-slate-500">· {surface.portOrAddress}</span>
                    )}
                  </div>
                </div>

                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border shrink-0 ${
                  isCritical
                    ? 'bg-red-950 text-red-300 border-red-900'
                    : isHigh
                    ? 'bg-amber-950 text-amber-300 border-amber-900'
                    : 'bg-emerald-950 text-emerald-300 border-emerald-900'
                }`}>
                  {surface.risk}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[10px] font-mono">
                <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                  {surface.exposureType}
                </span>
                <span className="text-slate-400 truncate">
                  Entry: {surface.entryPoint}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80 line-clamp-2">
                {surface.potentialAttack}
              </p>

              <div className="flex items-center justify-between pt-1 text-[11px] text-blue-400 font-medium">
                <span className="text-slate-500 font-mono text-[10px]">{surface.id}</span>
                <span className="flex items-center gap-1">
                  Inspect Surface <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Attack Surface Table (>= md screens) */}
      <div className="hidden md:block rounded-xl border border-slate-800 bg-slate-900/70 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              <tr>
                <th className="px-4 py-3">Component &amp; Interface</th>
                <th className="px-4 py-3">Exposure</th>
                <th className="px-4 py-3">Entry Point</th>
                <th className="px-4 py-3">Potential Impact</th>
                <th className="px-4 py-3">Risk</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredSurfaces.map((surface) => {
                const isCritical = surface.risk === 'Critical';
                const isHigh = surface.risk === 'High';

                return (
                  <tr
                    key={surface.id}
                    onClick={() => setSelectedSurface(surface)}
                    className="hover:bg-slate-800/50 transition-colors cursor-pointer group"
                  >
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                        {surface.component}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5 font-mono text-[11px] text-blue-400">
                        <span>{surface.interface}</span>
                        {surface.portOrAddress && (
                          <span className="text-slate-500">· {surface.portOrAddress}</span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                        {surface.exposureType}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="font-mono text-slate-300">{surface.entryPoint}</span>
                    </td>

                    <td className="px-4 py-3.5 max-w-xs">
                      <p className="text-slate-300 line-clamp-2 leading-relaxed">
                        {surface.potentialAttack}
                      </p>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                        isCritical
                          ? 'bg-red-950 text-red-300 border-red-900'
                          : isHigh
                          ? 'bg-amber-950 text-amber-300 border-amber-900'
                          : 'bg-emerald-950 text-emerald-300 border-emerald-900'
                      }`}>
                        {surface.risk}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-right font-medium text-blue-400 group-hover:text-blue-300">
                      <span className="flex items-center justify-end gap-1">
                        Inspect <ArrowRight className="h-3 w-3" />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attack Surface Detail Modal */}
      {selectedSurface && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase font-bold text-blue-400">
                    Attack Surface Vector
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    selectedSurface.risk === 'Critical'
                      ? 'bg-red-950 text-red-300 border-red-900'
                      : 'bg-amber-950 text-amber-300 border-amber-900'
                  }`}>
                    {selectedSurface.risk} Risk
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white mt-1">
                  {selectedSurface.interface} on {selectedSurface.component}
                </h2>
              </div>
              <button
                onClick={() => setSelectedSurface(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Entry Point &amp; Port
                </label>
                <div className="mt-1 font-mono text-blue-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  {selectedSurface.entryPoint} {selectedSurface.portOrAddress && `(${selectedSurface.portOrAddress})`}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Potential Attack Mechanism
                </label>
                <p className="mt-1 text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
                  {selectedSurface.potentialAttack}
                </p>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Required Exploit Preconditions
                </label>
                <p className="mt-1 text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
                  {selectedSurface.preconditions}
                </p>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-mono">
                  <FileCode className="h-3.5 w-3.5 text-blue-400" />
                  Firmware &amp; Architecture Evidence
                </label>
                <div className="mt-1 font-mono text-emerald-400 bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] leading-relaxed">
                  {selectedSurface.evidence}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <span className="text-[11px] text-slate-400 font-mono">Mapped to STRIDE model</span>
              <button
                onClick={() => {
                  setSelectedSurface(null);
                  setActiveTab('threat-model');
                }}
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition-colors shadow-sm"
              >
                <span>View Correlated Threats</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
