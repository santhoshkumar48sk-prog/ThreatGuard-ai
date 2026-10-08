import React from 'react';
import { useSecurity } from '../../context/SecurityContext';
import {
  LayoutDashboard,
  FolderGit2,
  Cpu,
  Crosshair,
  ShieldAlert,
  GitFork,
  Activity,
  FileCheck2,
  Bug,
  ShieldCheck,
  CheckSquare,
  FileText,
  Settings,
  Sparkles,
  ChevronRight,
  X
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  badge?: string | number;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    currentProject, 
    setIsCreateProjectOpen, 
    isMobileMenuOpen, 
    setIsMobileMenuOpen 
  } = useSecurity();

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, iconColor: 'text-sky-400' },
    { id: 'projects', label: 'Projects', icon: FolderGit2, iconColor: 'text-violet-400' },
    { id: 'architecture', label: 'Architecture Analysis', icon: Cpu, iconColor: 'text-cyan-400', badge: currentProject.components.length, badgeColor: 'text-cyan-300 bg-cyan-950/60 border-cyan-800/60' },
    { id: 'attack-surface', label: 'Attack Surface', icon: Crosshair, iconColor: 'text-amber-400', badge: currentProject.attackSurfaces.length, badgeColor: 'text-amber-300 bg-amber-950/60 border-amber-800/60' },
    { id: 'threat-model', label: 'Threat Model (STRIDE)', icon: ShieldAlert, iconColor: 'text-rose-400', badge: currentProject.threats.length, badgeColor: 'text-rose-300 bg-rose-950/60 border-rose-800/60' },
    { id: 'attack-trees', label: 'Attack Trees', icon: GitFork, iconColor: 'text-purple-400' },
    { id: 'risk-matrix', label: 'Risk Analysis', icon: Activity, iconColor: 'text-orange-400' },
    { id: 'security-tests', label: 'Security Tests', icon: FileCheck2, iconColor: 'text-emerald-400', badge: currentProject.testCases.length, badgeColor: 'text-emerald-300 bg-emerald-950/60 border-emerald-800/60' },
    { id: 'vulnerabilities', label: 'Vulnerabilities', icon: Bug, iconColor: 'text-fuchsia-400', badge: currentProject.vulnerabilities.length, badgeColor: 'text-fuchsia-300 bg-fuchsia-950/60 border-fuchsia-800/60' },
    { id: 'mitigations', label: 'Mitigations', icon: ShieldCheck, iconColor: 'text-teal-400', badge: currentProject.mitigations.length, badgeColor: 'text-teal-300 bg-teal-950/60 border-teal-800/60' },
    { id: 'validation', label: 'Security Validation', icon: CheckSquare, iconColor: 'text-green-400' },
    { id: 'reports', label: 'Security Reports', icon: FileText, iconColor: 'text-indigo-400' },
    { id: 'settings', label: 'Settings', icon: Settings, iconColor: 'text-slate-400' },
  ];

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full">
      <div className="p-3 space-y-4">
        {/* Navigation Category */}
        <div>
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
            Analysis &amp; Validation Pipeline
          </div>
          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600/25 via-indigo-600/15 to-transparent text-white font-semibold border-l-2 border-l-indigo-400 border-t border-r border-b border-indigo-500/20 shadow-xs'
                      : 'text-slate-300 hover:bg-slate-900/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? item.iconColor : 'text-slate-400 group-hover:' + item.iconColor}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border shadow-xs ${
                      item.badgeColor || (isActive ? 'bg-indigo-950 text-indigo-300 border-indigo-800' : 'bg-slate-900 text-slate-400 border-slate-800')
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* USP Statement card */}
        <div className="rounded-xl border border-indigo-500/30 bg-gradient-to-b from-indigo-950/40 to-slate-900/60 p-3 text-xs shadow-xs">
          <div className="flex items-center gap-1.5 text-indigo-300 font-semibold mb-1">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span className="bg-gradient-to-r from-cyan-400 to-indigo-300 bg-clip-text text-transparent">Architecture Engine</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Automating STRIDE threats, DREAD risk, and HIL test cases for embedded firmware.
          </p>
          <button
            onClick={() => {
              setIsCreateProjectOpen(true);
              setIsMobileMenuOpen(false);
            }}
            className="mt-2.5 flex items-center justify-between w-full text-[11px] font-semibold text-cyan-400 hover:text-cyan-300"
          >
            <span>New System Scan</span>
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* System Status Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950">
        <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
          <span className="text-slate-400">Security Score</span>
          <span className="font-mono font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            {currentProject.securityScore}/100
          </span>
        </div>
        <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
          <div 
            className="bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-sm" 
            style={{ width: `${currentProject.securityScore}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span className="text-indigo-300 font-semibold">{currentProject.systemType}</span>
          <span>{currentProject.version}</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 border-r border-slate-800/80 bg-slate-950 flex-col justify-between h-[calc(100vh-4rem)] sticky top-16 select-none overflow-y-auto">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-out Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative flex flex-col w-72 max-w-[85vw] bg-slate-950 border-r border-slate-800 shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                ThreatGuard Navigation
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {sidebarContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
