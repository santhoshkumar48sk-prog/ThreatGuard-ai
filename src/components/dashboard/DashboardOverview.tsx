import React from 'react';
import { useSecurity } from '../../context/SecurityContext';
import {
  Shield,
  Crosshair,
  AlertTriangle,
  FileCheck2,
  ShieldCheck,
  TrendingUp,
  Activity,
  ArrowRight,
  Play,
  Download,
  Cpu,
  Radio,
  Clock,
  Sparkles
} from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const { 
    currentProject, 
    setActiveTab, 
    setSelectedThreatId, 
    setSelectedComponentId,
    runAllSecurityTests,
    isTestsRunning,
    runValidationSuite,
    isValidationRunning
  } = useSecurity();

  // Metrics calculations
  const totalAttackSurfaces = currentProject.attackSurfaces.length;
  const criticalThreats = currentProject.threats.filter(t => t.impact === 'Critical' || t.riskScore >= 9.0).length;
  const highRiskThreats = currentProject.threats.filter(t => t.impact === 'High' || (t.riskScore >= 7.0 && t.riskScore < 9.0)).length;
  const mediumRiskThreats = currentProject.threats.filter(t => t.impact === 'Medium').length;
  const lowRiskThreats = currentProject.threats.filter(t => t.impact === 'Low').length;

  const passedTests = currentProject.testCases.filter(tc => tc.status === 'Passed').length;
  const failedTests = currentProject.testCases.filter(tc => tc.status === 'Failed').length;

  const implementedMitigations = currentProject.mitigations.filter(m => m.status === 'Implemented').length;
  const totalMitigations = currentProject.mitigations.length;

  // Interface counts
  const interfaceDistribution: Record<string, number> = {
    'CAN-FD': 4,
    'Bluetooth': 3,
    'Ethernet': 5,
    'USB/OBD': 3,
    'Cellular 5G': 2,
    'SPI/I2C': 3,
    'UART/JTAG': 3,
    'Wi-Fi': 1,
  };

  return (
    <div className="p-3.5 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 max-w-7xl mx-auto">
      {/* Top Banner / Project Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 sm:pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider font-mono bg-cyan-950/50 border border-cyan-800/50 px-2 py-0.5 rounded">
              {currentProject.systemType}
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-indigo-300 font-mono bg-indigo-950/40 border border-indigo-800/40 px-2 py-0.5 rounded">{currentProject.version}</span>
            <span className="text-slate-600">·</span>
            <span className="inline-flex items-center gap-1 rounded bg-emerald-950/60 px-2 py-0.5 text-[10px] font-medium text-emerald-300 border border-emerald-800/60 shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active Analysis
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white mt-1.5">
            {currentProject.name}
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl line-clamp-1">
            {currentProject.description}
          </p>
        </div>

        <div className="flex items-center gap-2 pt-1 sm:pt-0">
          <button
            onClick={() => setActiveTab('reports')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/90 px-3.5 py-2 text-xs font-medium text-slate-200 hover:border-indigo-500/50 hover:bg-slate-800 hover:text-white transition-all shadow-xs"
          >
            <Download className="h-3.5 w-3.5 text-indigo-400" />
            <span>Report</span>
          </button>
          <button
            onClick={() => runAllSecurityTests()}
            disabled={isTestsRunning}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-4 py-2 text-xs font-semibold text-white hover:from-emerald-500 hover:to-cyan-500 transition-all shadow-md shadow-emerald-600/30 disabled:opacity-50 active:scale-95"
          >
            <Play className={`h-3.5 w-3.5 fill-current ${isTestsRunning ? 'animate-spin' : ''}`} />
            <span>{isTestsRunning ? 'Testing...' : 'Run Test Suite'}</span>
          </button>
        </div>
      </div>

      {/* Main KPI Metric Cards - responsive for mobile & desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Security Score Card */}
        <div className="col-span-2 sm:col-span-3 lg:col-span-2 rounded-xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-slate-900/95 to-slate-900/90 p-4 sm:p-5 flex flex-col justify-between shadow-lg shadow-indigo-950/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-200 font-mono">Security Score</span>
            <div className="p-1.5 rounded-lg bg-indigo-950/60 border border-indigo-700/50 text-cyan-400 shadow-xs">
              <Shield className="h-4 w-4" />
            </div>
          </div>
          
          <div className="my-2.5 flex items-baseline gap-2.5">
            <div className="text-3xl sm:text-4xl font-extrabold font-mono bg-gradient-to-r from-white via-indigo-100 to-cyan-300 bg-clip-text text-transparent">
              {currentProject.securityScore}
            </div>
            <div className="text-xs text-slate-400 font-mono">/ 100</div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-700/60 shadow-xs">
              <TrendingUp className="h-3 w-3 text-emerald-400" />
              <span>+{currentProject.securityScore - (currentProject.previousScore || 64)}%</span>
            </div>
          </div>

          <div>
            <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
              <div 
                className="bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${currentProject.securityScore}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
              <span>Target: <strong className="text-slate-300">85 (ISO 21434)</strong></span>
              <button onClick={() => setActiveTab('validation')} className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                Audit Controls →
              </button>
            </div>
          </div>
        </div>

        {/* Attack Surfaces Card */}
        <div 
          onClick={() => setActiveTab('attack-surface')}
          className="rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-950/25 to-slate-900/90 p-3.5 sm:p-4 hover:border-amber-400/60 hover:shadow-md hover:shadow-amber-500/10 transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-xs font-semibold text-amber-200">Attack Surfaces</span>
            <div className="p-1.5 rounded-lg bg-amber-950/60 border border-amber-800/60 text-amber-400 group-hover:scale-105 transition-transform">
              <Crosshair className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="my-1.5 sm:my-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono">{totalAttackSurfaces}</div>
            <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">8 Interfaces</div>
          </div>
          <span className="text-[11px] text-amber-400 group-hover:text-amber-300 font-semibold flex items-center gap-1">
            Inventory <ArrowRight className="h-2.5 w-2.5" />
          </span>
        </div>

        {/* Critical Threats */}
        <div 
          onClick={() => setActiveTab('threat-model')}
          className="rounded-xl border border-rose-500/40 bg-gradient-to-br from-rose-950/30 to-slate-900/90 p-3.5 sm:p-4 hover:border-rose-400/70 hover:shadow-md hover:shadow-rose-500/15 transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between text-rose-300">
            <span className="text-xs font-semibold text-rose-200">Critical Threats</span>
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
          </div>
          <div className="my-1.5 sm:my-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-rose-300 font-mono">{criticalThreats}</div>
            <div className="text-[10px] sm:text-[11px] text-rose-400/90 mt-0.5 font-medium">Immediate Risk</div>
          </div>
          <span className="text-[11px] text-rose-400 group-hover:text-rose-300 font-semibold flex items-center gap-1">
            STRIDE <ArrowRight className="h-2.5 w-2.5" />
          </span>
        </div>

        {/* High Risk Threats */}
        <div 
          onClick={() => setActiveTab('risk-matrix')}
          className="rounded-xl border border-orange-500/35 bg-gradient-to-br from-orange-950/25 to-slate-900/90 p-3.5 sm:p-4 hover:border-orange-400/60 hover:shadow-md hover:shadow-orange-500/10 transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between text-orange-300">
            <span className="text-xs font-semibold text-orange-200">High Risk</span>
            <span className="text-xs">🟠</span>
          </div>
          <div className="my-1.5 sm:my-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-orange-300 font-mono">{highRiskThreats}</div>
            <div className="text-[10px] sm:text-[11px] text-orange-300/80 mt-0.5 font-mono">CVSS &gt;= 7.0</div>
          </div>
          <span className="text-[11px] text-orange-400 group-hover:text-orange-300 font-semibold flex items-center gap-1">
            Matrix <ArrowRight className="h-2.5 w-2.5" />
          </span>
        </div>

        {/* Security Tests Card */}
        <div 
          onClick={() => setActiveTab('security-tests')}
          className="rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/25 to-slate-900/90 p-3.5 sm:p-4 hover:border-emerald-400/60 hover:shadow-md hover:shadow-emerald-500/10 transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-xs font-semibold text-emerald-200">Security Tests</span>
            <div className="p-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 group-hover:scale-105 transition-transform">
              <FileCheck2 className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="my-1.5 sm:my-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-300 font-mono">{currentProject.testCases.length}</div>
            <div className="text-[10px] sm:text-[11px] mt-0.5 flex items-center gap-1 font-mono">
              <span className="text-emerald-400 font-bold">{passedTests} Pass</span>
              <span className="text-slate-600">·</span>
              <span className="text-rose-400 font-bold">{failedTests} Fail</span>
            </div>
          </div>
          <span className="text-[11px] text-emerald-400 group-hover:text-emerald-300 font-semibold flex items-center gap-1">
            Test Runner <ArrowRight className="h-2.5 w-2.5" />
          </span>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Threat Severity Breakdown & Risk by Component */}
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 space-y-4 sm:space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">Threat Severity &amp; Component Profile</h2>
              <p className="text-xs text-slate-400">Quantitative evaluation across embedded subsystems</p>
            </div>
            <button
              onClick={() => setActiveTab('architecture')}
              className="text-xs font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <span>Architecture</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          {/* Severity Distribution Bar */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 gap-1">
              <span className="font-semibold text-slate-300">Severity Breakdown</span>
              <div className="flex items-center gap-2.5 text-[11px] font-mono">
                <span className="text-red-400 font-bold">🔴 Crit ({criticalThreats})</span>
                <span className="text-amber-400 font-bold">🟠 High ({highRiskThreats})</span>
                <span className="text-yellow-400 font-bold">🟡 Med ({mediumRiskThreats})</span>
                <span className="text-emerald-400 font-bold">🟢 Low ({lowRiskThreats})</span>
              </div>
            </div>
            <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
              <div style={{ width: `${(criticalThreats / currentProject.threats.length) * 100}%` }} className="bg-red-500 h-full" title="Critical Threats" />
              <div style={{ width: `${(highRiskThreats / currentProject.threats.length) * 100}%` }} className="bg-amber-500 h-full" title="High Risk Threats" />
              <div style={{ width: `${(mediumRiskThreats / currentProject.threats.length) * 100}%` }} className="bg-yellow-400 h-full" title="Medium Risk Threats" />
              <div style={{ width: `${(lowRiskThreats / currentProject.threats.length) * 100}%` }} className="bg-emerald-500 h-full" title="Low Risk Threats" />
            </div>
          </div>

          {/* Component Risk Table */}
          <div className="space-y-2 pt-1">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Risk by Subsystem &amp; Microcontroller
            </div>
            <div className="space-y-2">
              {currentProject.components.slice(0, 5).map((comp, idx) => {
                const riskBadge = 
                  comp.riskLevel === 'Critical' ? 'bg-rose-950/70 text-rose-300 border-rose-800/80 shadow-xs' :
                  comp.riskLevel === 'High' ? 'bg-amber-950/70 text-amber-300 border-amber-800/80 shadow-xs' :
                  comp.riskLevel === 'Medium' ? 'bg-yellow-950/50 text-yellow-300 border-yellow-800/60' : 'bg-emerald-950/70 text-emerald-300 border-emerald-800/80';

                const iconColors = [
                  'bg-cyan-950/60 text-cyan-400 border-cyan-800/50',
                  'bg-purple-950/60 text-purple-400 border-purple-800/50',
                  'bg-emerald-950/60 text-emerald-400 border-emerald-800/50',
                  'bg-amber-950/60 text-amber-400 border-amber-800/50',
                  'bg-rose-950/60 text-rose-400 border-rose-800/50'
                ];

                return (
                  <div
                    key={comp.id}
                    onClick={() => {
                      setSelectedComponentId(comp.id);
                      setActiveTab('architecture');
                    }}
                    className="flex items-center justify-between rounded-xl border border-slate-800/90 bg-slate-900/90 px-3.5 py-2.5 hover:border-indigo-500/50 hover:bg-slate-850 hover:shadow-md hover:shadow-indigo-500/5 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <div className={`p-2 rounded-lg border ${iconColors[idx % iconColors.length]} shrink-0 group-hover:scale-105 transition-transform`}>
                        <Cpu className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors truncate">
                          {comp.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono truncate">
                          <span className="text-indigo-300">{comp.trustBoundary}</span> · {comp.interfaces.slice(0, 2).join(', ')}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="hidden sm:inline text-[10px] font-mono text-slate-400">
                        {comp.threatsCount} Threats
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${riskBadge}`}>
                        {comp.riskLevel}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Interface Distribution & Mitigations */}
        <div className="space-y-5">
          {/* Interface Breakdown */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-xs sm:text-sm font-bold text-white">Attack Surfaces by Interface</h2>
              <div className="p-1 rounded bg-indigo-950/50 text-indigo-400 border border-indigo-800/40">
                <Radio className="h-3.5 w-3.5" />
              </div>
            </div>

            <div className="space-y-2">
              {Object.entries(interfaceDistribution).map(([iface, count]) => {
                const ifaceColorMap: Record<string, { bar: string; text: string }> = {
                  'CAN-FD': { bar: 'bg-emerald-400', text: 'text-emerald-300' },
                  'Bluetooth': { bar: 'bg-sky-400', text: 'text-sky-300' },
                  'Ethernet': { bar: 'bg-cyan-400', text: 'text-cyan-300' },
                  'USB/OBD': { bar: 'bg-amber-400', text: 'text-amber-300' },
                  'Cellular 5G': { bar: 'bg-purple-400', text: 'text-purple-300' },
                  'SPI/I2C': { bar: 'bg-orange-400', text: 'text-orange-300' },
                  'UART/JTAG': { bar: 'bg-rose-400', text: 'text-rose-300' },
                  'Wi-Fi': { bar: 'bg-teal-400', text: 'text-teal-300' },
                };
                const colors = ifaceColorMap[iface] || { bar: 'bg-blue-400', text: 'text-blue-300' };

                return (
                  <div key={iface} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className={`font-semibold ${colors.text}`}>{iface}</span>
                      <span className="text-slate-400 font-bold">{count} surfaces</span>
                    </div>
                    <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`${colors.bar} h-full rounded-full shadow-xs`}
                        style={{ width: `${(count / 6) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setActiveTab('attack-surface')}
              className="w-full mt-2 py-2 rounded-lg border border-indigo-500/30 bg-indigo-950/30 text-xs font-semibold text-indigo-300 hover:text-white hover:bg-indigo-900/40 hover:border-indigo-400/50 transition-all shadow-xs"
            >
              Inspect All {totalAttackSurfaces} Surfaces
            </button>
          </div>

          {/* Mitigation Progress Card */}
          <div className="rounded-xl border border-teal-500/30 bg-gradient-to-b from-teal-950/20 to-slate-900/80 p-4 sm:p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-xs sm:text-sm font-bold text-white">Mitigation Progress</h2>
              <div className="p-1 rounded bg-teal-950/60 text-teal-400 border border-teal-700/50">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Applying hardening controls directly reduces likelihood and elevates system security score.
            </p>

            <div className="flex items-baseline justify-between text-xs font-mono pt-1">
              <span className="text-slate-400">Resolved / Total</span>
              <span className="text-teal-300 font-bold">{implementedMitigations} of {totalMitigations}</span>
            </div>
            <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
              <div 
                className="bg-gradient-to-r from-teal-400 to-emerald-400 h-full rounded-full transition-all shadow-xs"
                style={{ width: `${(implementedMitigations / Math.max(1, totalMitigations)) * 100}%` }}
              />
            </div>

            <button
              onClick={() => setActiveTab('mitigations')}
              className="w-full py-2 text-xs font-semibold text-emerald-300 hover:text-emerald-200 border border-emerald-700/50 bg-emerald-950/40 rounded-lg hover:bg-emerald-900/50 transition-all shadow-xs"
            >
              Manage Actionable Mitigations →
            </button>
          </div>
        </div>
      </div>

      {/* Critical Threat Alerts */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5 space-y-3.5 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-rose-400" />
            <h2 className="text-sm sm:text-base font-bold text-white">Active Critical &amp; High Vectors</h2>
          </div>
          <button 
            onClick={() => setActiveTab('threat-model')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>Open STRIDE Model</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {currentProject.threats.slice(0, 4).map((threat) => {
            const strideCategoryColors: Record<string, { tag: string; border: string }> = {
              'Spoofing': { tag: 'bg-purple-950/70 text-purple-300 border-purple-800/60', border: 'border-purple-500/20' },
              'Tampering': { tag: 'bg-amber-950/70 text-amber-300 border-amber-800/60', border: 'border-amber-500/20' },
              'Repudiation': { tag: 'bg-cyan-950/70 text-cyan-300 border-cyan-800/60', border: 'border-cyan-500/20' },
              'Information Disclosure': { tag: 'bg-rose-950/70 text-rose-300 border-rose-800/60', border: 'border-rose-500/20' },
              'Denial of Service': { tag: 'bg-orange-950/70 text-orange-300 border-orange-800/60', border: 'border-orange-500/20' },
              'Elevation of Privilege': { tag: 'bg-red-950/70 text-red-300 border-red-800/60', border: 'border-red-500/20' },
            };

            const catStyle = strideCategoryColors[threat.category] || { tag: 'bg-blue-950/70 text-blue-300 border-blue-800/60', border: 'border-slate-800' };

            return (
              <div
                key={threat.id}
                onClick={() => {
                  setSelectedThreatId(threat.id);
                  setActiveTab('threat-model');
                }}
                className={`p-3.5 sm:p-4 rounded-xl border ${catStyle.border} bg-slate-900/90 hover:border-indigo-500/50 hover:bg-slate-850 hover:shadow-md hover:shadow-indigo-500/5 transition-all cursor-pointer flex flex-col justify-between space-y-2 group`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/50 border border-cyan-800/50 px-2 py-0.5 rounded">
                        {threat.id}
                      </span>
                      <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border font-semibold ${catStyle.tag}`}>
                        {threat.category}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-white group-hover:text-indigo-200 transition-colors truncate mt-1">{threat.title}</h3>
                  </div>

                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border shrink-0 ${
                    threat.impact === 'Critical' ? 'bg-rose-950 text-rose-300 border-rose-800 shadow-xs' : 'bg-amber-950 text-amber-300 border-amber-800 shadow-xs'
                  }`}>
                    Risk {threat.riskScore}
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                  {threat.description}
                </p>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span className="truncate mr-2 text-indigo-300 font-semibold">{threat.component}</span>
                  <span className="text-cyan-400 shrink-0 font-medium">{threat.relatedCwe}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
