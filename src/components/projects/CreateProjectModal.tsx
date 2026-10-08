import React, { useState } from 'react';
import { useSecurity } from '../../context/SecurityContext';
import { SystemType } from '../../types/security';
import { createProjectFromTemplate } from '../../data/projectTemplates';
import {
  X,
  Upload,
  Cpu,
  FileCode,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  Loader2,
  HardDrive,
  FileText
} from 'lucide-react';

export const CreateProjectModal: React.FC = () => {
  const { isCreateProjectOpen, setIsCreateProjectOpen, createProject } = useSecurity();

  const [name, setName] = useState('');
  const [systemType, setSystemType] = useState<SystemType>('Automotive ECU');
  const [industry, setIndustry] = useState('Connected Autonomous Mobility');
  const [description, setDescription] = useState('');
  const [version, setVersion] = useState('v1.0.0');

  const [archFileName, setArchFileName] = useState<string | null>(null);
  const [codeFileName, setCodeFileName] = useState<string | null>(null);
  const [secFileName, setSecFileName] = useState<string | null>(null);

  const [isScanning, setIsScanning] = useState(false);
  const [scanStepIndex, setScanStepIndex] = useState(0);

  const scanSteps = [
    'Parsing architecture specification and block diagrams...',
    'Analyzing hardware components, microcontrollers, and bus transceivers...',
    'Identifying interfaces (CAN-FD, Ethernet, Bluetooth, SPI, UART, OBD-II)...',
    'Detecting exposed attack surfaces and boundary crossings...',
    'Generating STRIDE threat model with protocol exploit intelligence...',
    'Calculating deterministic risk scores (Likelihood × Impact)...',
    'Synthesizing automated security test cases and fuzzing scripts...',
    'Recommending actionable mitigations and ISO/SAE 21434 security controls...',
  ];

  if (!isCreateProjectOpen) return null;

  const handleStartAnalysis = async () => {
    setIsScanning(true);
    setScanStepIndex(0);

    for (let i = 0; i < scanSteps.length; i++) {
      setScanStepIndex(i);
      await new Promise((r) => setTimeout(r, 650));
    }

    // Create the project from template
    const newProject = createProjectFromTemplate({
      name: name || `${systemType} Security Validation`,
      systemType,
      industry: industry || 'Embedded Systems',
      description: description || `Automated threat model and attack surface analysis for ${systemType}.`,
      version: version || 'v1.0.0',
    });

    setIsScanning(false);
    createProject(newProject);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-4 sm:px-6 py-3.5 sm:py-4 bg-gradient-to-r from-slate-950 via-indigo-950/20 to-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/30">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">Create Security Analysis Project</h2>
              <p className="text-[11px] sm:text-xs text-slate-300">Initialize architecture parsing and AI threat modeling</p>
            </div>
          </div>
          <button
            onClick={() => !isScanning && setIsCreateProjectOpen(false)}
            disabled={isScanning}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-30"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 flex-1">
          {isScanning ? (
            <div className="py-8 sm:py-10 space-y-5 sm:space-y-6 text-center">
              <div className="inline-flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500/20 via-indigo-600/20 to-purple-600/20 text-cyan-400 border border-cyan-500/40 animate-pulse shadow-lg shadow-cyan-500/20">
                <Loader2 className="h-7 w-7 sm:h-8 sm:w-8 animate-spin" />
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">Cybersecurity Analysis Engine Active</h3>
                <p className="text-xs text-indigo-300 mt-1">Executing multi-stage embedded threat analysis &amp; STRIDE mapping</p>
              </div>

              {/* Step indicator */}
              <div className="max-w-md mx-auto space-y-2 text-left">
                {scanSteps.map((step, idx) => {
                  const isDone = idx < scanStepIndex;
                  const isCurrent = idx === scanStepIndex;
                  return (
                    <div
                      key={step}
                      className={`flex items-center gap-2.5 text-xs transition-colors ${
                        isCurrent
                          ? 'text-cyan-300 font-bold'
                          : isDone
                          ? 'text-emerald-400 font-medium'
                          : 'text-slate-400'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      ) : isCurrent ? (
                        <Loader2 className="h-4 w-4 text-cyan-400 animate-spin shrink-0" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-slate-700 shrink-0 flex items-center justify-center text-[9px]">
                          {idx + 1}
                        </div>
                      )}
                      <span className="truncate">{step}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <>
              {/* Basic Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. NextGen Telematics Gateway & Domain Controller"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    System Type *
                  </label>
                  <select
                    value={systemType}
                    onChange={(e) => setSystemType(e.target.value as SystemType)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Automotive ECU">Automotive ECU</option>
                    <option value="IoT Devices">IoT Devices</option>
                    <option value="Industrial Controllers">Industrial Controllers</option>
                    <option value="Medical Devices">Medical Devices</option>
                    <option value="Robotics">Robotics</option>
                    <option value="Consumer Electronics">Consumer Electronics</option>
                    <option value="Smart Devices">Smart Devices</option>
                    <option value="Custom">Custom Embedded System</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Industry / Vertical
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Connected Autonomous Mobility"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Description &amp; Operational Scope
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Describe microcontroller models, RTOS, trust boundaries, connected buses, and safety integrity levels (ASIL/SIL)..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Hardware / Firmware Version
                  </label>
                  <input
                    type="text"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Upload Sections */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Upload Architecture &amp; Firmware Assets (Optional for Demo)
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Architecture Diagram */}
                  <label className="rounded-xl border border-dashed border-slate-800 hover:border-blue-500/50 bg-slate-950/60 p-3.5 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group">
                    <Cpu className="h-6 w-6 text-slate-400 group-hover:text-blue-400 mb-1.5 transition-colors" />
                    <span className="text-xs font-semibold text-slate-200">Architecture</span>
                    <span className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[180px]">
                      {archFileName || 'PNG, JPG, PDF, AUTOSAR XML'}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".png,.jpg,.jpeg,.pdf,.xml"
                      onChange={(e) => e.target.files?.[0] && setArchFileName(e.target.files[0].name)}
                    />
                  </label>

                  {/* Source Code */}
                  <label className="rounded-xl border border-dashed border-slate-800 hover:border-emerald-500/50 bg-slate-950/60 p-3.5 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group">
                    <FileCode className="h-6 w-6 text-slate-400 group-hover:text-emerald-400 mb-1.5 transition-colors" />
                    <span className="text-xs font-semibold text-slate-200">Source Code</span>
                    <span className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[180px]">
                      {codeFileName || 'ZIP, C, C++, Python'}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".zip,.c,.cpp,.h,.py,.java,.js"
                      onChange={(e) => e.target.files?.[0] && setCodeFileName(e.target.files[0].name)}
                    />
                  </label>

                  {/* Security Data */}
                  <label className="rounded-xl border border-dashed border-slate-800 hover:border-amber-500/50 bg-slate-950/60 p-3.5 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group">
                    <ShieldAlert className="h-6 w-6 text-slate-400 group-hover:text-amber-400 mb-1.5 transition-colors" />
                    <span className="text-xs font-semibold text-slate-200">Security Data</span>
                    <span className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[180px]">
                      {secFileName || 'CVE, CWE, Advisories'}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".json,.csv,.xml,.txt"
                      onChange={(e) => e.target.files?.[0] && setSecFileName(e.target.files[0].name)}
                    />
                  </label>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        {!isScanning && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-800 px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-950/70">
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Deterministic rule engine + AI analysis pipeline
            </span>
            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsCreateProjectOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleStartAnalysis}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-5 py-2.5 text-xs font-semibold text-white hover:from-blue-500 hover:to-purple-500 transition-all shadow-md shadow-indigo-600/30 active:scale-95"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Start AI Security Analysis</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
