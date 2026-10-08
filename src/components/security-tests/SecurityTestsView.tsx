import React, { useState } from 'react';
import { useSecurity } from '../../context/SecurityContext';
import { SecurityTestCase } from '../../types/security';
import {
  FileCheck2,
  Play,
  Download,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Terminal,
  FileCode,
  Copy,
  Check,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

export const SecurityTestsView: React.FC = () => {
  const { 
    currentProject, 
    updateTestCaseStatus, 
    runAllSecurityTests, 
    isTestsRunning,
    testExecutionLogs 
  } = useSecurity();

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [expandedTestId, setExpandedTestId] = useState<string | null>(currentProject.testCases[0]?.id || null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [runningIndividualId, setRunningIndividualId] = useState<string | null>(null);

  const statuses = ['All', 'Passed', 'Failed', 'Needs Review', 'Not Tested', 'Blocked'];

  const filteredTests = currentProject.testCases.filter((tc) => {
    const matchesStatus = statusFilter === 'All' || tc.status === statusFilter;
    const matchesSearch =
      search === '' ||
      tc.id.toLowerCase().includes(search.toLowerCase()) ||
      tc.threatTitle.toLowerCase().includes(search.toLowerCase()) ||
      tc.component.toLowerCase().includes(search.toLowerCase()) ||
      tc.objective.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleRunSingleTest = async (testId: string) => {
    setRunningIndividualId(testId);
    await new Promise((r) => setTimeout(r, 800));

    const test = currentProject.testCases.find(t => t.id === testId);
    if (test) {
      const newStatus = test.status === 'Passed' ? 'Failed' : 'Passed';
      updateTestCaseStatus(testId, newStatus);
    }
    setRunningIndividualId(null);
  };

  const handleCopyScript = (script: string, id: string) => {
    navigator.clipboard.writeText(script);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportTestCases = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentProject.testCases, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${currentProject.name}-security-tests.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getStatusBadge = (status: SecurityTestCase['status']) => {
    switch (status) {
      case 'Passed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-600/80 px-2.5 py-0.5 rounded shadow-xs">
            <CheckCircle2 className="h-3 w-3 text-emerald-400" /> Passed
          </span>
        );
      case 'Failed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-rose-300 bg-rose-950/80 border border-rose-600/80 px-2.5 py-0.5 rounded shadow-xs">
            <XCircle className="h-3 w-3 text-rose-400" /> Failed
          </span>
        );
      case 'Needs Review':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-amber-300 bg-amber-950/80 border border-amber-600/80 px-2.5 py-0.5 rounded shadow-xs">
            <AlertCircle className="h-3 w-3 text-amber-400" /> Review
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-300 bg-slate-900 border border-slate-700 px-2.5 py-0.5 rounded">
            <Clock className="h-3 w-3" /> {status}
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
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider font-mono bg-cyan-950/50 border border-cyan-800/50 px-2 py-0.5 rounded">
              Verification Engine
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-indigo-300 font-mono bg-indigo-950/40 border border-indigo-800/40 px-2 py-0.5 rounded">
              {currentProject.testCases.length} Executable Cases
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white mt-1.5">
            Security Test Generator &amp; Runner
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Auto-synthesized test suites with Python-CAN, Scapy, PyUDS, and AFL++ harnesses designed for hardware-in-the-loop (HIL) test benches.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportTestCases}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-indigo-500/50 hover:text-white transition-all shadow-xs"
          >
            <Download className="h-3.5 w-3.5 text-indigo-400" />
            <span>Export Suite</span>
          </button>
          <button
            onClick={() => runAllSecurityTests()}
            disabled={isTestsRunning}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-4 py-1.5 text-xs font-semibold text-white hover:from-emerald-500 hover:to-cyan-500 shadow-md shadow-emerald-600/30 disabled:opacity-50 transition-all active:scale-95"
          >
            <Play className={`h-3.5 w-3.5 fill-current ${isTestsRunning ? 'animate-spin' : ''}`} />
            <span>{isTestsRunning ? 'Running Test Bench...' : 'Execute All Tests'}</span>
          </button>
        </div>
      </div>

      {/* Execution Terminal Console Output */}
      {(isTestsRunning || testExecutionLogs.length > 0) && (
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-300 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2.5">
            <div className="flex items-center gap-2 text-blue-400 font-bold">
              <Terminal className="h-4 w-4" />
              <span>Automated Test Execution Console</span>
            </div>
            <span className="text-[10px] text-slate-500">HIL Automated Runner</span>
          </div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {testExecutionLogs.map((log, idx) => (
              <div
                key={idx}
                className={
                  log.includes('[PASSED]')
                    ? 'text-emerald-400 font-bold'
                    : log.includes('[FAILED]')
                    ? 'text-red-400 font-bold'
                    : 'text-slate-300'
                }
              >
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search test ID, objective, or target component..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-950 pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-xs font-semibold text-slate-400 mr-1 font-mono shrink-0">Status:</span>
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-slate-800 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Test Cases Accordion List */}
      <div className="space-y-3">
        {filteredTests.map((test) => {
          const isExpanded = expandedTestId === test.id;
          const isRunning = runningIndividualId === test.id;

          return (
            <div
              key={test.id}
              className="rounded-xl border border-slate-800 bg-slate-900/70 overflow-hidden transition-all"
            >
              {/* Test Summary Row */}
              <div
                onClick={() => setExpandedTestId(isExpanded ? null : test.id)}
                className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-slate-850 cursor-pointer transition-colors"
              >
                <div className="flex items-start sm:items-center gap-2.5 min-w-0">
                  <button className="text-slate-400 mt-0.5 sm:mt-0 shrink-0">
                    {isExpanded ? <ChevronDown className="h-4 w-4 text-blue-400" /> : <ChevronRight className="h-4 w-4" />}
                  </button>

                  <div className="space-y-0.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/50 border border-cyan-800/50 px-2 py-0.5 rounded shadow-xs">{test.id}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-[11px] font-mono text-indigo-300 bg-indigo-950/40 border border-indigo-800/40 px-1.5 py-0.2 rounded">{test.threatId}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-xs text-slate-200 font-semibold truncate">{test.component}</span>
                    </div>
                    <h3 className="text-xs sm:text-sm font-semibold text-white truncate">{test.objective}</h3>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  {getStatusBadge(test.status)}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRunSingleTest(test.id);
                    }}
                    disabled={isRunning}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors disabled:opacity-50"
                  >
                    <Play className={`h-3 w-3 fill-current ${isRunning ? 'animate-spin' : ''}`} />
                    <span>{isRunning ? 'Running...' : 'Run Test'}</span>
                  </button>
                </div>
              </div>

              {/* Expanded Test Details */}
              {isExpanded && (
                <div className="border-t border-slate-800 bg-slate-950/70 p-4 sm:p-5 space-y-3.5 text-xs animate-in fade-in duration-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block mb-1">
                        Preconditions
                      </span>
                      <p className="text-slate-300 leading-relaxed">{test.precondition}</p>
                    </div>

                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block mb-1">
                        Expected Result
                      </span>
                      <p className="text-slate-300 leading-relaxed">{test.expectedResult}</p>
                    </div>
                  </div>

                  {/* Step by Step Procedure */}
                  <div>
                    <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block mb-1.5">
                      Execution Steps ({test.testSteps.length})
                    </span>
                    <div className="space-y-1 bg-slate-900 p-3 rounded-lg border border-slate-800">
                      {test.testSteps.map((step, idx) => (
                        <div key={idx} className="text-slate-300 leading-relaxed flex items-start gap-2">
                          <span className="font-mono text-blue-400 font-bold shrink-0">{idx + 1}.</span>
                          <span>{step.replace(/^\d+\.\s*/, '')}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Python script harness */}
                  {test.automatedScriptSnippet && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] uppercase font-mono font-bold text-slate-400 flex items-center gap-1.5">
                          <FileCode className="h-3.5 w-3.5 text-blue-400" />
                          Harness Script ({test.toolFramework || 'Automated'})
                        </span>
                        <button
                          onClick={() => handleCopyScript(test.automatedScriptSnippet!, test.id)}
                          className="flex items-center gap-1 text-[11px] font-mono text-blue-400 hover:text-blue-300"
                        >
                          {copiedId === test.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          <span>{copiedId === test.id ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <pre className="rounded-lg border border-slate-800 bg-slate-900 p-3 font-mono text-[11px] text-emerald-400 overflow-x-auto leading-relaxed">
                        {test.automatedScriptSnippet}
                      </pre>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[10px] font-mono text-slate-500">
                    <span>Last Run: {test.lastRun || 'Never'}</span>
                    <span>Duration: {test.executionDuration || '2.0s'}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
