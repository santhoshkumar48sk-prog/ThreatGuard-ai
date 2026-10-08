import React, { useState } from 'react';
import { useSecurity } from '../../context/SecurityContext';
import {
  Settings,
  Shield,
  Cpu,
  Key,
  Database,
  Terminal,
  Save,
  Check,
  AlertTriangle,
  FileCode
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { currentProject, theme, toggleTheme } = useSecurity();

  const [taraStandard, setTaraStandard] = useState('ISO/SAE 21434 (Automotive)');
  const [fuzzingIntensity, setFuzzingIntensity] = useState('High (10,000 iterations)');
  const [enableSecOcAutoCheck, setEnableSecOcAutoCheck] = useState(true);
  const [enableJtagFuseCheck, setEnableJtagFuseCheck] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider font-mono">
            Platform Configuration
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
          Cybersecurity &amp; Rule Engine Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure threat modeling standards, HIL test runner integrations, and automated compliance thresholds.
        </p>
      </div>

      <div className="space-y-6 text-xs">
        {/* Compliance Standards */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-400" />
            <span>Assurance &amp; Compliance Target Standards</span>
          </h2>

          <div className="space-y-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Primary Threat Analysis &amp; Risk Assessment (TARA) Framework
              </label>
              <select
                value={taraStandard}
                onChange={(e) => setTaraStandard(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="ISO/SAE 21434 (Automotive)">ISO/SAE 21434 (Road Vehicles Cybersecurity Engineering)</option>
                <option value="UNECE WP.29 R155 / R156">UNECE WP.29 R155 / R156 (Cybersecurity & Software Updates)</option>
                <option value="IEC 62443-4-2 (Industrial Automation)">IEC 62443-4-2 (Industrial Component Security)</option>
                <option value="FDA Medical Device Premarket Guidance">FDA Medical Device Premarket Cybersecurity Guidance</option>
                <option value="ETSI EN 303 645 (Consumer IoT)">ETSI EN 303 645 (Consumer IoT Security)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Automated Protocol Fuzzing Intensity
              </label>
              <select
                value={fuzzingIntensity}
                onChange={(e) => setFuzzingIntensity(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="Low (1,000 iterations)">Low (1,000 iterations) - Quick Regression</option>
                <option value="Medium (5,000 iterations)">Medium (5,000 iterations) - Balanced Scan</option>
                <option value="High (10,000 iterations)">High (10,000 iterations) - Full Pre-Production Gate</option>
              </select>
            </div>
          </div>
        </div>

        {/* Embedded Security Enforcement Toggles */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Cpu className="h-4 w-4 text-blue-400" />
            <span>Automated Hardware &amp; Bus Rule Verification</span>
          </h2>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800 cursor-pointer">
              <div>
                <div className="font-semibold text-white">AUTOSAR SecOC Enforcement Rule</div>
                <div className="text-[11px] text-slate-400">Flag any unauthenticated CAN/CAN-FD frame injection as Critical safety risk.</div>
              </div>
              <input
                type="checkbox"
                checked={enableSecOcAutoCheck}
                onChange={(e) => setEnableSecOcAutoCheck(e.target.checked)}
                className="h-4 w-4 rounded accent-blue-600 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800 cursor-pointer">
              <div>
                <div className="font-semibold text-white">JTAG &amp; Hardware Debug Fuse Audit</div>
                <div className="text-[11px] text-slate-400">Enforce OTP fuse blowing check for microcontroller debugging interfaces.</div>
              </div>
              <input
                type="checkbox"
                checked={enableJtagFuseCheck}
                onChange={(e) => setEnableJtagFuseCheck(e.target.checked)}
                className="h-4 w-4 rounded accent-blue-600 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Appearance & Save */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Theme:</span>
            <button
              onClick={toggleTheme}
              className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 font-mono"
            >
              Mode: {theme.toUpperCase()}
            </button>
          </div>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-500 transition-colors shadow-sm"
          >
            {isSaved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            <span>{isSaved ? 'Settings Saved' : 'Save Configurations'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
