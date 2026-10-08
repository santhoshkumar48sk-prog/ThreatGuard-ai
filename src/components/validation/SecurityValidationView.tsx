import React from 'react';
import { useSecurity } from '../../context/SecurityContext';
import { SecurityControl } from '../../types/security';
import {
  CheckSquare,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Play,
  Terminal
} from 'lucide-react';

export const SecurityValidationView: React.FC = () => {
  const { currentProject, runValidationSuite, isValidationRunning, validationLogs } = useSecurity();

  const passedControls = currentProject.controls.filter(c => c.status === 'Passed').length;
  const reviewControls = currentProject.controls.filter(c => c.status === 'Needs Review').length;
  const failedControls = currentProject.controls.filter(c => c.status === 'Failed').length;

  const getStatusIcon = (status: SecurityControl['status']) => {
    switch (status) {
      case 'Passed':
        return (
          <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-900/60 px-2.5 py-1 rounded-lg">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Passed
          </span>
        );
      case 'Needs Review':
        return (
          <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-amber-300 bg-amber-950/60 border border-amber-900/60 px-2.5 py-1 rounded-lg">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-400" /> Review
          </span>
        );
      case 'Failed':
        return (
          <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-red-300 bg-red-950/60 border border-red-900/60 px-2.5 py-1 rounded-lg">
            <XCircle className="h-3.5 w-3.5 text-red-400" /> Failed
          </span>
        );
    }
  };

  return (
    <div className="p-3.5 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 sm:pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider font-mono">
              Compliance &amp; Assurance
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400 font-mono">
              ISO/SAE 21434 &amp; UNECE WP.29 R155
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mt-1">
            Security Controls Validation
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Audit hardware root of trust, memory isolation, bus rate limits, cryptographic key storage, and firmware integrity controls.
          </p>
        </div>

        <button
          onClick={() => runValidationSuite()}
          disabled={isValidationRunning}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 shadow-sm disabled:opacity-50"
        >
          <Play className={`h-3.5 w-3.5 fill-current ${isValidationRunning ? 'animate-spin' : ''}`} />
          <span>{isValidationRunning ? 'Validating...' : 'Run Validation Test'}</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-emerald-400">Passed Controls</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono mt-1">{passedControls}</div>
          </div>
          <CheckCircle2 className="h-7 w-7 text-emerald-500/50" />
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-amber-400">Needs Review / Audit</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono mt-1">{reviewControls}</div>
          </div>
          <AlertTriangle className="h-7 w-7 text-amber-500/50" />
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-red-400">Failed Verification</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono mt-1">{failedControls}</div>
          </div>
          <XCircle className="h-7 w-7 text-red-500/50" />
        </div>
      </div>

      {/* Live Validation Console Logs */}
      {(isValidationRunning || validationLogs.length > 0) && (
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-300 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2.5">
            <div className="flex items-center gap-2 text-blue-400 font-bold">
              <Terminal className="h-4 w-4" />
              <span>Automated Control Verification Harness</span>
            </div>
            <span className="text-[10px] text-slate-500">ISO 21434 Audit</span>
          </div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {validationLogs.map((log, idx) => (
              <div
                key={idx}
                className={
                  log.includes('[PASS]')
                    ? 'text-emerald-400 font-bold'
                    : log.includes('[FAIL]')
                    ? 'text-red-400 font-bold'
                    : log.includes('[WARN]')
                    ? 'text-amber-400 font-bold'
                    : 'text-slate-300'
                }
              >
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security Controls Table - with horizontal scroll on mobile */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[650px]">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              <tr>
                <th className="px-4 py-3">Security Control</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Verification Method</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {currentProject.controls.map((ctrl) => (
                <tr key={ctrl.id} className="hover:bg-slate-850/60 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-white text-xs sm:text-sm">{ctrl.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Ref: {ctrl.evidenceRef}
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="text-blue-400 font-mono font-medium">{ctrl.category}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{ctrl.standard}</div>
                  </td>

                  <td className="px-4 py-3.5 max-w-xs">
                    <p className="text-slate-300 leading-relaxed line-clamp-2">{ctrl.description}</p>
                  </td>

                  <td className="px-4 py-3.5 max-w-xs">
                    <p className="text-slate-400 font-mono text-[11px] leading-relaxed line-clamp-2">
                      {ctrl.verificationMethod}
                    </p>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Audited: {ctrl.lastAudited}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 text-right">
                    <div className="flex justify-end">{getStatusIcon(ctrl.status)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
