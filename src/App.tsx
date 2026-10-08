/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SecurityProvider, useSecurity } from './context/SecurityContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LandingPage } from './components/landing/LandingPage';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { ProjectsList } from './components/projects/ProjectsList';
import { ArchitectureAnalysis } from './components/architecture/ArchitectureAnalysis';
import { AttackSurfaceView } from './components/attack-surface/AttackSurfaceView';
import { ThreatModelView } from './components/threat-model/ThreatModelView';
import { AttackTreeView } from './components/attack-tree/AttackTreeView';
import { RiskMatrixView } from './components/risk-matrix/RiskMatrixView';
import { SecurityTestsView } from './components/security-tests/SecurityTestsView';
import { VulnerabilitiesView } from './components/vulnerabilities/VulnerabilitiesView';
import { MitigationsView } from './components/mitigations/MitigationsView';
import { SecurityValidationView } from './components/validation/SecurityValidationView';
import { SecurityReportsView } from './components/reports/SecurityReportsView';
import { SettingsView } from './components/settings/SettingsView';
import { CreateProjectModal } from './components/projects/CreateProjectModal';
import { AiSecurityAssistant } from './components/ai-assistant/AiSecurityAssistant';
import { 
  LayoutDashboard, 
  Cpu, 
  ShieldAlert, 
  Activity, 
  FileCheck2, 
  Menu 
} from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, isMobileMenuOpen, setIsMobileMenuOpen } = useSecurity();

  if (activeTab === 'landing') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar />
        <main className="flex-1">
          <LandingPage />
        </main>
        <CreateProjectModal />
        <AiSecurityAssistant />
      </div>
    );
  }

  const mobileNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'architecture', label: 'Architecture', icon: Cpu },
    { id: 'threat-model', label: 'STRIDE', icon: ShieldAlert },
    { id: 'risk-matrix', label: 'Risk', icon: Activity },
    { id: 'security-tests', label: 'Tests', icon: FileCheck2 },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto min-h-[calc(100vh-4rem)] bg-slate-950 pb-24 md:pb-16">
          {activeTab === 'dashboard' && <DashboardOverview />}
          {activeTab === 'projects' && <ProjectsList />}
          {activeTab === 'architecture' && <ArchitectureAnalysis />}
          {activeTab === 'attack-surface' && <AttackSurfaceView />}
          {activeTab === 'threat-model' && <ThreatModelView />}
          {activeTab === 'attack-trees' && <AttackTreeView />}
          {activeTab === 'risk-matrix' && <RiskMatrixView />}
          {activeTab === 'security-tests' && <SecurityTestsView />}
          {activeTab === 'vulnerabilities' && <VulnerabilitiesView />}
          {activeTab === 'mitigations' && <MitigationsView />}
          {activeTab === 'validation' && <SecurityValidationView />}
          {activeTab === 'reports' && <SecurityReportsView />}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Mobile Sticky Bottom Navigation Bar */}
      <nav 
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/98 border-t border-slate-800/90 backdrop-blur-xl px-2 py-1.5 flex items-center justify-around safe-area-bottom shadow-2xl"
      >
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-semibold transition-all ${
                isActive
                  ? 'text-cyan-300 bg-gradient-to-b from-indigo-950/80 to-slate-900 border border-indigo-700/60 shadow-md shadow-indigo-950/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className={`h-4 w-4 mb-0.5 ${isActive ? 'text-cyan-400 scale-110' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}

        {/* Menu Drawer Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-semibold transition-all ${
            isMobileMenuOpen
              ? 'text-cyan-300 bg-gradient-to-b from-indigo-950/80 to-slate-900 border border-indigo-700/60 shadow-md shadow-indigo-950/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Menu className="h-4 w-4 mb-0.5 text-slate-400" />
          <span>More</span>
        </button>
      </nav>

      <CreateProjectModal />
      <AiSecurityAssistant />
    </div>
  );
};

export default function App() {
  return (
    <SecurityProvider>
      <AppContent />
    </SecurityProvider>
  );
}
