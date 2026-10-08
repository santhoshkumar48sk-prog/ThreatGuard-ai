import React, { useState } from 'react';
import { useSecurity } from '../../context/SecurityContext';
import { VulnerabilityItem } from '../../types/security';
import {
  Bug,
  Search,
  ArrowRight,
  X
} from 'lucide-react';

export const VulnerabilitiesView: React.FC = () => {
  const { currentProject, setSelectedThreatId, setActiveTab } = useSecurity();

  const [search, setSearch] = useState<string>('');
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [selectedVuln, setSelectedVuln] = useState<VulnerabilityItem | null>(null);

  const filteredVulns = currentProject.vulnerabilities.filter((v) => {
    const matchesSev = severityFilter === 'All' || v.severity === severityFilter;
    const matchesSearch =
      search === '' ||
      v.cveId.toLowerCase().includes(search.toLowerCase()) ||
      v.cwe.toLowerCase().includes(search.toLowerCase()) ||
      v.affectedComponent.toLowerCase().includes(search.toLowerCase()) ||
      v.description.toLowerCase().includes(search.toLowerCase());
    return matchesSev && matchesSearch;
  });

  return (
    <div className="p-3.5 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 sm:pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider font-mono">
              CVE / CWE Intelligence
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400 font-mono">
              NIST NVD &amp; Embedded Security Feeds
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mt-1">
            Vulnerability Intelligence
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Correlated known vulnerabilities (CVEs), Common Weakness Enumerations (CWEs), and security advisories mapped to your firmware bill of materials (SBOM).
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-rose-300 font-bold bg-gradient-to-r from-rose-950/80 to-red-950/80 border border-rose-700/60 px-3 py-1.5 rounded-lg shadow-sm shadow-rose-900/30">
            {currentProject.vulnerabilities.filter(v => v.severity === 'Critical').length} Critical CVEs
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-3 rounded-xl shadow-xs">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-400" />
          <input
            type="text"
            placeholder="Search CVE ID (CVE-2023-45866), CWE, or component..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-950/90 pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-xs font-semibold text-slate-400 mr-1 font-mono shrink-0">Severity:</span>
          {[
            { id: 'All', active: 'bg-indigo-600 text-white shadow-xs' },
            { id: 'Critical', active: 'bg-rose-600 text-white shadow-xs shadow-rose-900/50' },
            { id: 'High', active: 'bg-amber-600 text-white shadow-xs shadow-amber-900/50' },
            { id: 'Medium', active: 'bg-sky-600 text-white shadow-xs' },
          ].map((sev) => (
            <button
              key={sev.id}
              onClick={() => setSeverityFilter(sev.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                severityFilter === sev.id
                  ? `${sev.active} font-bold`
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {sev.id}
            </button>
          ))}
        </div>
      </div>

      {/* Vulnerabilities Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
        {filteredVulns.map((vuln) => {
          const isCritical = vuln.severity === 'Critical';

          return (
            <div
              key={vuln.cveId}
              onClick={() => setSelectedVuln(vuln)}
              className="rounded-xl border border-slate-800/90 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-4 sm:p-5 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-950/20 transition-all cursor-pointer flex flex-col justify-between space-y-2.5 group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/50 border border-cyan-800/50 px-2 py-0.5 rounded shadow-xs">{vuln.cveId}</span>
                    <span className="text-[10px] font-mono text-slate-400">{vuln.publishedDate}</span>
                  </div>
                  <h3 className="text-xs font-semibold text-white mt-1.5 truncate group-hover:text-cyan-300 transition-colors">{vuln.cwe}</h3>
                </div>

                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border shrink-0 ${
                  isCritical
                    ? 'bg-rose-950/80 text-rose-300 border-rose-700/60 shadow-xs shadow-rose-950/50'
                    : 'bg-amber-950/80 text-amber-300 border-amber-700/60'
                }`}>
                  CVSS {vuln.cvssScore} · {vuln.severity}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                {vuln.description}
              </p>

              <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-mono tracking-wider">Affected Component</span>
                  <span className="text-violet-300 font-semibold">{vuln.affectedComponent}</span>
                </div>
                <Bug className="h-4 w-4 text-slate-600 group-hover:text-rose-400 transition-colors" />
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                {vuln.mappedThreatId ? (
                  <span className="text-cyan-400 font-mono font-semibold text-[11px] bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.5 rounded">
                    Mapped: {vuln.mappedThreatId}
                  </span>
                ) : (
                  <span className="text-slate-500 font-mono text-[11px]">Unmapped</span>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (vuln.mappedThreatId) {
                      setSelectedThreatId(vuln.mappedThreatId);
                      setActiveTab('threat-model');
                    }
                  }}
                  className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 text-xs group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Map to Threat</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Vulnerability Detail Modal */}
      {selectedVuln && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                    {selectedVuln.cveId}
                  </span>
                  <span className="text-xs font-mono text-red-400 font-bold bg-red-950 px-2 py-0.5 rounded border border-red-900">
                    CVSS {selectedVuln.cvssScore} ({selectedVuln.severity})
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white mt-1">{selectedVuln.cwe}</h3>
              </div>
              <button onClick={() => setSelectedVuln(null)} className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Affected Subsystem
                </label>
                <div className="mt-1 font-mono text-blue-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  {selectedVuln.affectedComponent}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Vulnerability Description
                </label>
                <p className="mt-1 text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
                  {selectedVuln.description}
                </p>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Exploitability Vector
                </label>
                <p className="mt-1 text-slate-300 leading-relaxed bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  {selectedVuln.exploitability}
                </p>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Recommended Patch &amp; Remediation
                </label>
                <p className="mt-1 text-emerald-400 bg-emerald-950/20 border border-emerald-900/40 p-3 rounded-lg leading-relaxed">
                  {selectedVuln.recommendedFix}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  setSelectedVuln(null);
                  setActiveTab('security-tests');
                }}
                className="rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700"
              >
                Generate Security Test
              </button>
              <button
                onClick={() => {
                  if (selectedVuln.mappedThreatId) {
                    setSelectedThreatId(selectedVuln.mappedThreatId);
                    setSelectedVuln(null);
                    setActiveTab('threat-model');
                  }
                }}
                className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 shadow-sm"
              >
                View Mapped Threat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
