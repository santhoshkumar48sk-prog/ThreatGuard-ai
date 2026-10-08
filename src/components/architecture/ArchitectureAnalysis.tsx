import React, { useState } from 'react';
import { useSecurity } from '../../context/SecurityContext';
import { ArchitectureComponent } from '../../types/security';
import {
  Cpu,
  Layers,
  Shield,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ExternalLink,
  X,
  Radio,
  HardDrive,
  Info,
  ArrowRight,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';

export const ArchitectureAnalysis: React.FC = () => {
  const { 
    currentProject, 
    selectedComponentId, 
    setSelectedComponentId, 
    setSelectedThreatId,
    setActiveTab 
  } = useSecurity();

  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [filterBoundary, setFilterBoundary] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'diagram' | 'explorer'>('diagram');

  const selectedComponent = currentProject.components.find(c => c.id === selectedComponentId) 
    || currentProject.components[0];

  const trustBoundaries = [
    'All',
    'Untrusted External',
    'Vehicle Perimeter',
    'Isolated Safety Domain',
    'Cloud Edge'
  ];

  const filteredComponents = currentProject.components.filter(c => {
    if (filterBoundary === 'All') return true;
    return c.trustBoundary === filterBoundary;
  });

  // Associated threats for selected component
  const componentThreats = currentProject.threats.filter(t => 
    t.component.toLowerCase().includes(selectedComponent?.name.toLowerCase()) ||
    selectedComponent?.name.toLowerCase().includes(t.component.toLowerCase())
  );

  // Associated attack surfaces
  const componentSurfaces = currentProject.attackSurfaces.filter(a =>
    a.component.toLowerCase().includes(selectedComponent?.name.toLowerCase()) ||
    selectedComponent?.name.toLowerCase().includes(a.component.toLowerCase())
  );

  return (
    <div className="p-3.5 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 max-w-7xl mx-auto">
      {/* Page Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 sm:pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider font-mono bg-cyan-950/50 border border-cyan-800/50 px-2 py-0.5 rounded">
              System Topology
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-indigo-300 font-mono bg-indigo-950/40 border border-indigo-800/40 px-2 py-0.5 rounded">Hardware &amp; Bus Schematic</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white mt-1.5">
            Architecture &amp; Trust Boundaries
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Inspect hardware ECUs, physical transceivers, data buses, and external perimeter interfaces across trust domains.
          </p>
        </div>

        {/* Zoom & Canvas Actions & View Mode Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs shadow-xs">
            <button
              onClick={() => setViewMode('diagram')}
              className={`px-3 py-1.5 rounded font-semibold transition-colors ${
                viewMode === 'diagram'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Diagram
            </button>
            <button
              onClick={() => setViewMode('explorer')}
              className={`px-3 py-1.5 rounded font-semibold transition-colors ${
                viewMode === 'explorer'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Components ({filteredComponents.length})
            </button>
          </div>

          {viewMode === 'diagram' && (
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
              <button
                onClick={() => setZoomLevel(prev => Math.max(0.6, prev - 0.1))}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="px-2 text-xs font-mono text-slate-300">{Math.round(zoomLevel * 100)}%</span>
              <button
                onClick={() => setZoomLevel(prev => Math.min(1.4, prev + 0.1))}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                title="Reset Zoom"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter by Trust Boundary Segmented Controls (scrollable on mobile) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        <span className="font-semibold text-slate-400 mr-1 shrink-0">Domain:</span>
        {trustBoundaries.map((b) => (
          <button
            key={b}
            onClick={() => setFilterBoundary(b)}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
              filterBoundary === b
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {b}
          </button>
        ))}
      </div>

      {/* Main Interactive Diagram & Component Drawer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Interactive Diagram Canvas (SVG) OR Responsive Explorer List */}
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5 overflow-hidden flex flex-col justify-between">
          {viewMode === 'explorer' ? (
            /* Mobile-friendly Subsystems Explorer Grid */
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white">Subsystems &amp; Controllers</h3>
                  <p className="text-xs text-slate-400">Select any hardware unit to inspect trust boundary and interfaces</p>
                </div>
                <span className="text-xs font-mono text-blue-400 font-semibold">
                  {filteredComponents.length} Units
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[520px] overflow-y-auto pr-1">
                {filteredComponents.map((comp) => {
                  const isSelected = comp.id === selectedComponent?.id;
                  const isCritical = comp.riskLevel === 'Critical';
                  const isHigh = comp.riskLevel === 'High';

                  const badgeClass = isCritical
                    ? 'bg-red-950/60 text-red-300 border-red-900'
                    : isHigh
                    ? 'bg-amber-950/60 text-amber-300 border-amber-900'
                    : 'bg-emerald-950/60 text-emerald-300 border-emerald-900';

                  return (
                    <div
                      key={comp.id}
                      onClick={() => setSelectedComponentId(comp.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-2.5 ${
                        isSelected
                          ? 'bg-slate-900 border-blue-500 shadow-md ring-1 ring-blue-500/50'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={`p-1.5 rounded-lg shrink-0 ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-800 text-blue-400'}`}>
                            <Cpu className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-white truncate">{comp.name}</h4>
                            <p className="text-[10px] text-slate-400 font-mono truncate">{comp.osType}</p>
                          </div>
                        </div>

                        <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border shrink-0 ${badgeClass}`}>
                          {comp.riskLevel}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-300 bg-slate-950/70 p-2 rounded-lg border border-slate-800 line-clamp-2 leading-relaxed">
                        {comp.role}
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-1 text-[10px] font-mono text-slate-400">
                        <span className="truncate max-w-[140px] text-blue-300">{comp.trustBoundary}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span>{comp.interfaces.length} Ifaces</span>
                          <span>·</span>
                          <span className="text-red-400 font-bold">{comp.threatsCount} Threats</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Interactive Diagram View */
            <>
              {/* Top Canvas Legend */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-900 text-[11px] text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    <span className="text-red-400 font-semibold">Exposed Attack Interface</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                    <span>Internal Bus / Domain</span>
                  </span>
                </div>
                <span className="font-mono text-slate-500 hidden sm:inline">Tap node to inspect · Pinch or scroll to pan</span>
              </div>

              {/* SVG Canvas Area - Horizontal scrollable on small mobile */}
              <div className="relative flex-1 flex items-center justify-center my-3 overflow-x-auto overflow-y-hidden">
                <svg
                  className="min-w-[680px] sm:min-w-[800px] w-full h-[400px] sm:h-[460px] transition-transform duration-200 select-none"
                  style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center' }}
                  viewBox="0 0 1000 560"
                >
                  {/* Trust Boundary Group Boxes */}
                  {/* Untrusted External Boundary */}
                  <rect
                    x="30"
                    y="30"
                    width="240"
                    height="500"
                    rx="12"
                    fill="rgba(220, 38, 38, 0.04)"
                    stroke="rgba(220, 38, 38, 0.35)"
                    strokeDasharray="6 4"
                  />
                  <text x="45" y="58" fill="#f87171" fontSize="11" fontWeight="bold" letterSpacing="0.05em">
                    UNTRUSTED EXTERIOR PERIMETER
                  </text>

                  {/* Central Vehicle Gateway Perimeter */}
                  <rect
                    x="300"
                    y="110"
                    width="200"
                    height="240"
                    rx="12"
                    fill="rgba(37, 99, 235, 0.04)"
                    stroke="rgba(37, 99, 235, 0.4)"
                    strokeDasharray="6 4"
                  />
                  <text x="315" y="135" fill="#60a5fa" fontSize="11" fontWeight="bold">
                    GATEWAY FIREWALL DOMAIN
                  </text>

                  {/* Isolated Powertrain Safety Domain */}
                  <rect
                    x="530"
                    y="60"
                    width="440"
                    height="460"
                    rx="12"
                    fill="rgba(22, 163, 74, 0.04)"
                    stroke="rgba(22, 163, 74, 0.35)"
                    strokeDasharray="6 4"
                  />
                  <text x="545" y="88" fill="#4ade80" fontSize="11" fontWeight="bold">
                    ISOLATED SAFETY DOMAIN (ASIL-D)
                  </text>

                  {/* Connection Lines between components */}
                  <path d="M 230 110 L 320 200" stroke="#dc2626" strokeWidth="2.5" strokeDasharray="4 2" fill="none" />
                  <path d="M 230 330 L 320 230" stroke="#ea580c" strokeWidth="2" fill="none" />
                  <path d="M 230 480 L 330 250" stroke="#dc2626" strokeWidth="2.5" strokeDasharray="4 2" fill="none" />
                  <path d="M 460 210 L 560 240" stroke="#3b82f6" strokeWidth="3" fill="none" />
                  <path d="M 690 230 L 780 150" stroke="#16a34a" strokeWidth="2.5" fill="none" />
                  <path d="M 460 230 L 780 370" stroke="#3b82f6" strokeWidth="2" fill="none" />

                  {/* Badges along lines */}
                  <g transform="translate(235, 135)">
                    <rect width="90" height="20" rx="4" fill="#0f172a" stroke="#dc2626" strokeWidth="1" />
                    <text x="45" y="14" fill="#fca5a5" fontSize="9" fontWeight="bold" textAnchor="middle">
                      Bluetooth / Wi-Fi
                    </text>
                  </g>

                  <g transform="translate(235, 410)">
                    <rect width="85" height="20" rx="4" fill="#0f172a" stroke="#dc2626" strokeWidth="1" />
                    <text x="42" y="14" fill="#fca5a5" fontSize="9" fontWeight="bold" textAnchor="middle">
                      OBD-II / UDS $27
                    </text>
                  </g>

                  <g transform="translate(480, 195)">
                    <rect width="70" height="20" rx="4" fill="#0f172a" stroke="#2563eb" strokeWidth="1" />
                    <text x="35" y="14" fill="#93c5fd" fontSize="9" fontWeight="bold" textAnchor="middle">
                      CAN-FD 5M
                    </text>
                  </g>

                  {/* Render Component Nodes */}
                  {currentProject.components.map((comp) => {
                    const isSelected = comp.id === selectedComponent?.id;
                    const isCritical = comp.riskLevel === 'Critical';
                    const isHigh = comp.riskLevel === 'High';

                    const nodeX = comp.x || 100;
                    const nodeY = comp.y || 100;

                    return (
                      <g
                        key={comp.id}
                        transform={`translate(${nodeX}, ${nodeY})`}
                        onClick={() => setSelectedComponentId(comp.id)}
                        className="cursor-pointer transition-transform hover:scale-105"
                      >
                        {/* Card container */}
                        <rect
                          x="0"
                          y="0"
                          width="180"
                          height="80"
                          rx="10"
                          fill={isSelected ? '#1e293b' : '#0f172a'}
                          stroke={
                            isSelected
                              ? '#3b82f6'
                              : isCritical
                              ? '#dc2626'
                              : isHigh
                              ? '#ea580c'
                              : '#334155'
                          }
                          strokeWidth={isSelected ? '2.5' : '1.5'}
                        />

                        {/* Node Header */}
                        <rect
                          x="0"
                          y="0"
                          width="180"
                          height="22"
                          rx="10"
                          fill={
                            isCritical
                              ? 'rgba(220, 38, 38, 0.2)'
                              : isHigh
                              ? 'rgba(234, 88, 12, 0.2)'
                              : 'rgba(59, 130, 246, 0.15)'
                          }
                        />

                        {/* Type / Risk Badge text */}
                        <text
                          x="10"
                          y="15"
                          fill={isCritical ? '#fca5a5' : isHigh ? '#fdba74' : '#93c5fd'}
                          fontSize="9"
                          fontWeight="bold"
                          fontFamily="monospace"
                        >
                          {comp.type.toUpperCase()} · {comp.riskLevel.toUpperCase()}
                        </text>

                        {/* Component Name */}
                        <text
                          x="10"
                          y="44"
                          fill="#ffffff"
                          fontSize="12"
                          fontWeight="bold"
                          className="select-none"
                        >
                          {comp.name.length > 20 ? comp.name.substring(0, 18) + '...' : comp.name}
                        </text>

                        {/* Subtitle / OS */}
                        <text
                          x="10"
                          y="62"
                          fill="#94a3b8"
                          fontSize="9"
                          fontFamily="monospace"
                          className="select-none"
                        >
                          {comp.interfaces[0] || 'Internal Bus'} · {comp.threatsCount} threats
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </>
          )}

          {/* Bottom helper bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-slate-900 text-xs text-slate-400">
            <span className="font-mono text-[11px]">
              <span className="text-blue-400 font-bold">ISO/SAE 21434:</span> Safety Domain Isolation ASIL-D
            </span>
            <button
              onClick={() => setActiveTab('attack-surface')}
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              All Attack Surfaces →
            </button>
          </div>
        </div>

        {/* Component Inspector Panel */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3.5">
            {/* Drawer Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold">
                  Component Inspector
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">{selectedComponent.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] font-mono text-slate-400">{selectedComponent.osType}</span>
                  <span className="text-slate-600">·</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                    selectedComponent.riskLevel === 'Critical'
                      ? 'bg-red-950 text-red-300 border-red-900'
                      : 'bg-amber-950 text-amber-300 border-amber-900'
                  }`}>
                    {selectedComponent.riskLevel} Risk
                  </span>
                </div>
              </div>
              <div className="p-2 rounded-lg bg-slate-800 text-blue-400 shrink-0">
                <Cpu className="h-4 w-4" />
              </div>
            </div>

            {/* Role & Function */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                Function &amp; Role
              </label>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                {selectedComponent.role}
              </p>
            </div>

            {/* Trust Boundary & Data Handled */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Domain</span>
                <span className="font-semibold text-blue-300 mt-0.5 block truncate">{selectedComponent.trustBoundary}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Data Sensitivity</span>
                <span className="font-semibold text-red-400 mt-0.5 block truncate">{selectedComponent.dataSensitivity}</span>
              </div>
            </div>

            {/* Interfaces List */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block font-mono">
                Interfaces ({selectedComponent.interfaces.length})
              </label>
              <div className="flex flex-wrap gap-1">
                {selectedComponent.interfaces.map((iface) => (
                  <span
                    key={iface}
                    className="text-[11px] font-mono bg-slate-950 text-slate-300 px-2 py-0.5 rounded border border-slate-800"
                  >
                    {iface}
                  </span>
                ))}
              </div>
            </div>

            {/* Linked Threats */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">Associated Threats</span>
                <span className="text-[10px] font-mono text-blue-400">{componentThreats.length} Active</span>
              </div>

              <div className="space-y-1.5">
                {componentThreats.slice(0, 2).map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      setSelectedThreatId(t.id);
                      setActiveTab('threat-model');
                    }}
                    className="p-2 rounded-lg bg-slate-950 hover:bg-slate-850 border border-slate-800 transition-all cursor-pointer flex items-center justify-between text-xs"
                  >
                    <div className="truncate mr-2">
                      <span className="font-mono text-blue-400 font-bold">{t.id} </span>
                      <span className="text-slate-200">{t.title}</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-red-400 shrink-0">
                      {t.riskScore}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => setActiveTab('attack-surface')}
            className="w-full mt-3 flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition-colors shadow-sm"
          >
            <span>Inspect Attack Surfaces ({componentSurfaces.length})</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
