import React from 'react';
import { useSecurity } from '../../context/SecurityContext';
import {
  Shield,
  ArrowRight,
  Play,
  Cpu,
  Crosshair,
  ShieldAlert,
  Activity,
  GitFork,
  FileCheck2,
  Bug,
  CheckCircle2,
  Car,
  Wifi,
  Factory,
  HeartPulse,
  Bot,
  Smartphone,
  ChevronRight,
  Sparkles,
  Lock,
  Layers
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { loadDemoProject, setIsCreateProjectOpen, setActiveTab } = useSecurity();

  const pipelineSteps = [
    { title: 'Architecture', desc: 'Hardware & Bus Topology', icon: Cpu, color: 'text-cyan-400', bg: 'bg-cyan-950/60 border-cyan-800/60', hover: 'hover:border-cyan-500/50' },
    { title: 'Attack Surface', desc: 'Interfaces & Exposed Ports', icon: Crosshair, color: 'text-amber-400', bg: 'bg-amber-950/60 border-amber-800/60', hover: 'hover:border-amber-500/50' },
    { title: 'Threats', desc: 'Automated STRIDE Matrix', icon: ShieldAlert, color: 'text-rose-400', bg: 'bg-rose-950/60 border-rose-800/60', hover: 'hover:border-rose-500/50' },
    { title: 'Risk', desc: 'Likelihood × Impact Scoring', icon: Activity, color: 'text-orange-400', bg: 'bg-orange-950/60 border-orange-800/60', hover: 'hover:border-orange-500/50' },
    { title: 'Security Tests', desc: 'Executable Validation Scripts', icon: FileCheck2, color: 'text-emerald-400', bg: 'bg-emerald-950/60 border-emerald-800/60', hover: 'hover:border-emerald-500/50' },
    { title: 'Mitigation', desc: 'Hardening & ISO 21434 Specs', icon: Shield, color: 'text-teal-400', bg: 'bg-teal-950/60 border-teal-800/60', hover: 'hover:border-teal-500/50' },
  ];

  const features = [
    {
      title: 'AI Threat Detection',
      desc: 'Machine-assisted inspection of embedded exploit vectors, firmware patterns, and microcontroller peripheral interfaces.',
      icon: Sparkles,
      tag: 'Autonomous',
      iconColor: 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60',
      tagColor: 'text-cyan-400'
    },
    {
      title: 'Attack Surface Discovery',
      desc: 'Automated discovery of physical testpads, unauthenticated CAN bus channels, wireless Bluetooth/Wi-Fi daemons, and debug ports.',
      icon: Crosshair,
      tag: 'Perimeter',
      iconColor: 'text-amber-400 bg-amber-950/60 border-amber-800/60',
      tagColor: 'text-amber-400'
    },
    {
      title: 'STRIDE Analysis',
      desc: 'Systematic classification across Spoofing, Tampering, Repudiation, Information Disclosure, DoS, and Elevation of Privilege.',
      icon: ShieldAlert,
      tag: 'Methodology',
      iconColor: 'text-purple-400 bg-purple-950/60 border-purple-800/60',
      tagColor: 'text-purple-400'
    },
    {
      title: 'Risk Scoring & DREAD',
      desc: 'Mathematical calculation of Likelihood × Impact with CVSS v3.1 integration and asset severity weighting.',
      icon: Activity,
      tag: 'Quantitative',
      iconColor: 'text-orange-400 bg-orange-950/60 border-orange-800/60',
      tagColor: 'text-orange-400'
    },
    {
      title: 'Attack Tree Generation',
      desc: 'Multi-stage hierarchical attack graphs detailing path traversal from untrusted peripherals down to motion actuators.',
      icon: GitFork,
      tag: 'Visual Graph',
      iconColor: 'text-rose-400 bg-rose-950/60 border-rose-800/60',
      tagColor: 'text-rose-400'
    },
    {
      title: 'Security Test Generation',
      desc: 'Automated test harness generation with Python-CAN, Scapy, PyUDS, and AFL++ test scripts ready for HIL test benches.',
      icon: FileCheck2,
      tag: 'Automated',
      iconColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60',
      tagColor: 'text-emerald-400'
    },
    {
      title: 'Vulnerability Intelligence',
      desc: 'Continuous correlation with NIST NVD CVEs, MITRE CWEs, and embedded security advisories affecting RTOS kernels.',
      icon: Bug,
      tag: 'Intelligence',
      iconColor: 'text-fuchsia-400 bg-fuchsia-950/60 border-fuchsia-800/60',
      tagColor: 'text-fuchsia-400'
    },
    {
      title: 'Continuous Security Validation',
      desc: 'Verification against ISO/SAE 21434, UNECE WP.29 R155, IEC 62443, and FDA medical device premarket security guidance.',
      icon: CheckCircle2,
      tag: 'Compliance',
      iconColor: 'text-teal-400 bg-teal-950/60 border-teal-800/60',
      tagColor: 'text-teal-400'
    },
  ];

  const embeddedDomains = [
    {
      title: 'Automotive ECU',
      subtitle: 'Domain Controllers & Telematics',
      icon: Car,
      iconColor: 'text-cyan-400 bg-cyan-950/60 border-cyan-800/50',
      protocols: ['CAN-FD', 'LIN', 'Automotive Ethernet', 'AUTOSAR SecOC', 'DoIP', 'UDS'],
      riskHighlight: 'Unintended torque actuation & bus spoofing',
      standard: 'ISO/SAE 21434 & UNECE R155'
    },
    {
      title: 'IoT Devices',
      subtitle: 'Edge Gateways & Sensor Nodes',
      icon: Wifi,
      iconColor: 'text-sky-400 bg-sky-950/60 border-sky-800/50',
      protocols: ['Zigbee', 'BLE 5.2', 'MQTT / mTLS', 'CoAP', 'Thread'],
      riskHighlight: 'Credential extraction & unauthorized pivot',
      standard: 'ETSI EN 303 645 & NIST IR 8259'
    },
    {
      title: 'Industrial Controllers',
      subtitle: 'PLCs, DCS & RTU Grid Units',
      icon: Factory,
      iconColor: 'text-amber-400 bg-amber-950/60 border-amber-800/50',
      protocols: ['Modbus TCP', 'PROFINET', 'EtherCAT', 'OPC-UA'],
      riskHighlight: 'Logic tampering & physical process shutdown',
      standard: 'IEC 62443-4-2 Security Level 3'
    },
    {
      title: 'Medical Devices',
      subtitle: 'Infusion Pumps & Vital Monitors',
      icon: HeartPulse,
      iconColor: 'text-rose-400 bg-rose-950/60 border-rose-800/50',
      protocols: ['BLE GATT', 'HL7 / FHIR', 'NFC OOB', 'SafeSPI'],
      riskHighlight: 'Dose alteration & patient PHI exposure',
      standard: 'FDA Cybersecurity Guidance & IEC 62304'
    },
    {
      title: 'Robotics & AGVs',
      subtitle: 'Autonomous Mobile Platforms',
      icon: Bot,
      iconColor: 'text-purple-400 bg-purple-950/60 border-purple-800/50',
      protocols: ['ROS2 / DDS', 'CANopen', 'LiDAR UDP', 'UART SafeIO'],
      riskHighlight: 'Sensor spoofing & path trajectory override',
      standard: 'ISO 3691-4 & ISO 13849 Safety Integrity'
    },
    {
      title: 'Smart Devices',
      subtitle: 'Wearables & Secure Enclaves',
      icon: Smartphone,
      iconColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/50',
      protocols: ['eSIM', 'ARM TrustZone', 'I2C Cryptochip', 'SWD Debug'],
      riskHighlight: 'Memory dump & bootloader key extraction',
      standard: 'Common Criteria EAL4+ / FIPS 140-3'
    }
  ];

  return (
    <div className="min-h-screen text-slate-100">
      {/* Hero Section */}
      <section className="relative px-4 pt-10 pb-16 sm:pt-16 sm:pb-20 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-4 sm:space-y-6 max-w-4xl mx-auto">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/40 bg-gradient-to-r from-indigo-950/60 to-purple-950/60 px-3.5 py-1 text-xs font-medium text-indigo-200 shadow-md shadow-indigo-950/40">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-semibold text-white">Enterprise Embedded Cybersecurity</span>
            <span className="text-indigo-400">·</span>
            <span className="text-cyan-300 font-mono font-bold">ISO/SAE 21434</span>
          </div>

          {/* Main Title - Attractive Colorful Gradient */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            AI-Powered Threat Modeling &amp;{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-fuchsia-400 bg-clip-text text-transparent">
              Security Validation
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Analyze architecture and code. Discover attack surfaces. Generate threats, security tests, and actionable mitigations with AI.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setIsCreateProjectOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 hover:from-blue-500 hover:to-purple-500 transition-all active:scale-95"
            >
              <span>Start Security Analysis</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={loadDemoProject}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-950/40 px-6 py-3 text-sm font-medium text-indigo-200 hover:bg-indigo-900/50 hover:border-indigo-400/50 hover:text-white transition-all shadow-xs"
            >
              <Play className="h-3.5 w-3.5 text-cyan-400 fill-current" />
              <span>View Demo (Smart Vehicle ECU)</span>
            </button>
          </div>

          {/* Key USP Card */}
          <div className="pt-6 sm:pt-8">
            <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/30 via-slate-900/90 to-slate-900/95 p-5 sm:p-6 shadow-xl shadow-indigo-950/20 max-w-4xl mx-auto text-left">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
                    Core Security Thesis
                  </div>
                  <div className="text-base sm:text-lg font-bold text-white leading-snug">
                    "From Architecture to Attack Surface to Security Validation — powered by AI."
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    ThreatGuard AI continuously transforms system architecture and code into actionable threat models, prioritized risks, security tests, and mitigation recommendations.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="shrink-0 self-start md:self-center flex items-center gap-1.5 text-xs font-semibold text-cyan-300 hover:text-white bg-indigo-950/60 px-4 py-2.5 rounded-lg border border-indigo-700/60 hover:border-cyan-400/60 transition-all shadow-xs"
                >
                  <span>Explore Dashboard</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Security Pipeline */}
        <div className="mt-14 sm:mt-20">
          <div className="text-center mb-6 sm:mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 font-mono">Automated Pipeline</span>
            <h2 className="text-xl sm:text-3xl font-bold text-white mt-1">End-to-End Threat &amp; Validation Flow</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl mx-auto">
              Automated deterministic analysis combined with generative cybersecurity intelligence.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
            {pipelineSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className={`rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 sm:p-4 ${step.hover} hover:bg-slate-900 hover:shadow-md transition-all flex flex-col justify-between group`}
                >
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className={`p-2 rounded-lg border ${step.bg} ${step.color} group-hover:scale-105 transition-transform shadow-xs`}>
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 font-bold">0{idx + 1}</span>
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-200 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 leading-snug">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="py-14 sm:py-20 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">Core Capabilities</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">Built specifically for hardware &amp; firmware teams</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            No generic prompts or generic advice. Purpose-built embedded threat modeling with protocol-level awareness.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="rounded-xl border border-slate-800/90 bg-slate-900/70 p-4 sm:p-5 hover:border-indigo-500/40 hover:bg-slate-900/90 hover:shadow-md hover:shadow-indigo-500/5 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg border ${f.iconColor} group-hover:scale-105 transition-transform shadow-xs`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className={`text-[10px] font-semibold tracking-wider ${f.tagColor} uppercase font-mono`}>
                      {f.tag}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-200 transition-colors mb-1.5">{f.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Built for Embedded Systems Section */}
      <section className="py-14 sm:py-20 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 font-mono">Mission-Critical Domains</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">Built for Embedded Systems</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Architected to understand CAN, LIN, SPI, UART, I2C, BLE, and JTAG hardware boundaries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {embeddedDomains.map((domain) => {
            const Icon = domain.icon;
            return (
              <div
                key={domain.title}
                className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6 hover:border-indigo-500/40 hover:bg-slate-900/95 hover:shadow-lg hover:shadow-indigo-500/5 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2.5 sm:p-3 rounded-xl border ${domain.iconColor} group-hover:scale-105 transition-transform shadow-xs`}>
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-mono font-semibold text-indigo-300 bg-indigo-950/60 border border-indigo-700/60 px-2 py-0.5 rounded shadow-xs">
                    {domain.standard}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-200 transition-colors">{domain.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{domain.subtitle}</p>

                <div className="mt-4 pt-3 border-t border-slate-800">
                  <div className="text-[11px] font-semibold text-slate-300 mb-1.5 font-mono">Key Protocols:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {domain.protocols.map((p) => (
                      <span key={p} className="text-[10px] font-mono bg-slate-950 text-cyan-300 px-2 py-0.5 rounded border border-slate-800">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-3.5 text-xs text-rose-300/90 bg-rose-950/30 border border-rose-900/50 p-2.5 rounded-lg shadow-xs">
                  <span className="font-semibold text-rose-400 font-mono">Primary Risk: </span>
                  {domain.riskHighlight}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="rounded-2xl border border-indigo-500/40 bg-gradient-to-br from-indigo-950/40 via-slate-900/90 to-purple-950/30 p-6 sm:p-10 shadow-2xl shadow-indigo-950/40 space-y-4 sm:space-y-5">
          <div className="inline-flex p-3 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30">
            <Shield className="h-6 w-6 sm:h-7 sm:w-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Secure Your Embedded Architecture Today
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Upload your system block diagrams or firmware codebases to automatically discover attack surfaces, synthesize STRIDE threats, and generate automated validation test suites.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <button
              onClick={() => setIsCreateProjectOpen(true)}
              className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white hover:from-blue-500 hover:to-purple-500 transition-all shadow-md shadow-indigo-600/30 active:scale-95"
            >
              Start Security Analysis
            </button>
            <button
              onClick={loadDemoProject}
              className="w-full sm:w-auto rounded-xl border border-indigo-500/30 bg-indigo-950/40 px-6 py-2.5 text-xs sm:text-sm font-medium text-indigo-200 hover:bg-indigo-900/50 hover:text-white transition-all shadow-xs"
            >
              Explore Live Demo Project
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
