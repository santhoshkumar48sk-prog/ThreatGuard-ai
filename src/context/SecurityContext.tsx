import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProjectData, SecurityControl, SecurityTestCase, MitigationItem } from '../types/security';
import { demoProject } from '../data/demoProject';

interface SecurityContextType {
  currentProject: ProjectData;
  setCurrentProject: React.Dispatch<React.SetStateAction<ProjectData>>;
  projects: ProjectData[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCreateProjectOpen: boolean;
  setIsCreateProjectOpen: (open: boolean) => void;
  isAiAssistantOpen: boolean;
  setIsAiAssistantOpen: (open: boolean) => void;
  selectedThreatId: string | null;
  setSelectedThreatId: (id: string | null) => void;
  selectedComponentId: string | null;
  setSelectedComponentId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  loadDemoProject: () => void;
  createProject: (newProj: ProjectData) => void;
  updateTestCaseStatus: (testId: string, status: SecurityTestCase['status']) => void;
  updateMitigationStatus: (mitigationId: string, status: MitigationItem['status']) => void;
  runValidationSuite: () => Promise<void>;
  isValidationRunning: boolean;
  validationLogs: string[];
  runAllSecurityTests: () => Promise<void>;
  isTestsRunning: boolean;
  testExecutionLogs: string[];
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<ProjectData[]>([demoProject]);
  const [currentProject, setCurrentProject] = useState<ProjectData>(demoProject);
  const [activeTab, setActiveTabState] = useState<string>('landing');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    setIsMobileMenuOpen(false);
  };
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState<boolean>(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState<boolean>(false);
  const [selectedThreatId, setSelectedThreatId] = useState<string | null>(null);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isValidationRunning, setIsValidationRunning] = useState<boolean>(false);
  const [validationLogs, setValidationLogs] = useState<string[]>([]);
  const [isTestsRunning, setIsTestsRunning] = useState<boolean>(false);
  const [testExecutionLogs, setTestExecutionLogs] = useState<string[]>([]);

  // Apply theme class to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const loadDemoProject = () => {
    setCurrentProject(demoProject);
    setActiveTab('dashboard');
  };

  const createProject = (newProj: ProjectData) => {
    setProjects(prev => [newProj, ...prev]);
    setCurrentProject(newProj);
    setActiveTab('dashboard');
    setIsCreateProjectOpen(false);
  };

  const updateTestCaseStatus = (testId: string, status: SecurityTestCase['status']) => {
    setCurrentProject(prev => {
      const updatedTests = prev.testCases.map(tc => 
        tc.id === testId ? { ...tc, status, lastRun: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC' } : tc
      );
      return {
        ...prev,
        testCases: updatedTests,
      };
    });
  };

  const updateMitigationStatus = (mitigationId: string, status: MitigationItem['status']) => {
    setCurrentProject(prev => {
      const updatedMitigations = prev.mitigations.map(m =>
        m.id === mitigationId ? { ...m, status } : m
      );

      // Recalculate security score dynamically!
      // Implemented mitigations raise the score
      const implementedCount = updatedMitigations.filter(m => m.status === 'Implemented').length;
      const inProgressCount = updatedMitigations.filter(m => m.status === 'In Progress').length;
      const newScore = Math.min(96, Math.max(60, 68 + (implementedCount * 5) + (inProgressCount * 2)));

      return {
        ...prev,
        mitigations: updatedMitigations,
        securityScore: newScore,
      };
    });
  };

  const runValidationSuite = async () => {
    setIsValidationRunning(true);
    setValidationLogs([
      '[VALIDATOR] Initializing ISO/SAE 21434 & UNECE R155 Security Control Suite...',
      '[CHECK] Testing Authentication & Key Management in HSM...',
    ]);

    await new Promise(r => setTimeout(r, 600));
    setValidationLogs(prev => [...prev, '[PASS] HSM AES-128/256 secure storage and TRNG randomness confirmed.']);

    await new Promise(r => setTimeout(r, 700));
    setValidationLogs(prev => [
      ...prev,
      '[CHECK] Testing Input Validation & CAN-FD protocol fuzzing...',
      '[FAIL] Detected missing message MAC on Powertrain CAN ID 0x0C0 (SecOC not active).',
    ]);

    await new Promise(r => setTimeout(r, 800));
    setValidationLogs(prev => [
      ...prev,
      '[CHECK] Auditing UDS Diagnostic SecurityAccess entropy...',
      '[WARN] PRNG algorithm exhibits linear autocorrelation below NIST SP 800-22 standard.',
      '[COMPLETED] Security Control Validation run finished: 4 Passed, 3 Needs Review, 1 Failed.',
    ]);

    setIsValidationRunning(false);
  };

  const runAllSecurityTests = async () => {
    setIsTestsRunning(true);
    setTestExecutionLogs([
      '[RUNNER] Starting automated embedded security test runner...',
      '[EXEC] Initializing SocketCAN virtual bus interface on channel can0...',
    ]);

    await new Promise(r => setTimeout(r, 500));
    setTestExecutionLogs(prev => [
      ...prev,
      '[TEST: SEC-TEST-001] Injecting unauthenticated torque frames (ID 0x0C0)...',
      ' -> Motor inverter accepted packet without SecOC CMAC! [FAILED]',
    ]);

    await new Promise(r => setTimeout(r, 600));
    setTestExecutionLogs(prev => [
      ...prev,
      '[TEST: SEC-TEST-002] Probing IVI Bluetooth pairing daemon for Just-Works HID...',
      ' -> L2CAP HID channel opened without PIN confirmation! [FAILED]',
    ]);

    await new Promise(r => setTimeout(r, 600));
    setTestExecutionLogs(prev => [
      ...prev,
      '[TEST: SEC-TEST-004] Stress testing Gateway with 100% bus-load packet flood...',
      ' -> Babbling node isolated within 38ms. Powertrain jitter < 1.4ms. [PASSED]',
    ]);

    await new Promise(r => setTimeout(r, 500));
    setTestExecutionLogs(prev => [
      ...prev,
      '[TEST: SEC-TEST-006] FOTA update anti-rollback monotonic counter verification...',
      ' -> Monotonic counter mismatch detected. Downgrade firmware rejected. [PASSED]',
      '[SUITE COMPLETE] 8 tests executed (4 Passed, 3 Failed, 1 Needs Review).',
    ]);

    setIsTestsRunning(false);
  };

  return (
    <SecurityContext.Provider
      value={{
        currentProject,
        setCurrentProject,
        projects,
        activeTab,
        setActiveTab,
        isCreateProjectOpen,
        setIsCreateProjectOpen,
        isAiAssistantOpen,
        setIsAiAssistantOpen,
        selectedThreatId,
        setSelectedThreatId,
        selectedComponentId,
        setSelectedComponentId,
        searchQuery,
        setSearchQuery,
        theme,
        toggleTheme,
        loadDemoProject,
        createProject,
        updateTestCaseStatus,
        updateMitigationStatus,
        runValidationSuite,
        isValidationRunning,
        validationLogs,
        runAllSecurityTests,
        isTestsRunning,
        testExecutionLogs,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
      }}
    >
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};
