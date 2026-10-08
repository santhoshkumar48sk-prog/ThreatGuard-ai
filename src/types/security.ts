export type SystemType = 
  | 'Automotive ECU'
  | 'IoT Devices'
  | 'Industrial Controllers'
  | 'Medical Devices'
  | 'Robotics'
  | 'Consumer Electronics'
  | 'Smart Devices'
  | 'Custom';

export type SeverityLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export type StrideCategory = 
  | 'Spoofing'
  | 'Tampering'
  | 'Repudiation'
  | 'Information Disclosure'
  | 'Denial of Service'
  | 'Elevation of Privilege';

export interface ArchitectureComponent {
  id: string;
  name: string;
  type: 'gateway' | 'ecu' | 'sensor' | 'actuator' | 'cloud' | 'interface' | 'bus' | 'storage';
  role: string;
  interfaces: string[];
  dataHandled: string;
  dataSensitivity: 'Public' | 'Internal' | 'Confidential' | 'Safety-Critical';
  trustBoundary: 'Untrusted External' | 'Vehicle Perimeter' | 'Isolated Safety Domain' | 'Cloud Edge';
  attackSurfaceCount: number;
  threatsCount: number;
  riskLevel: SeverityLevel;
  firmwareVersion?: string;
  osType?: string;
  x?: number;
  y?: number;
}

export interface ArchitectureConnection {
  id: string;
  source: string;
  target: string;
  protocol: string; // CAN, Bluetooth, Wi-Fi, USB, UART, SPI, I2C, Ethernet, etc.
  direction: 'unidirectional' | 'bidirectional';
  isExposed: boolean;
  trustBoundaryCrossing: boolean;
  riskLevel: SeverityLevel;
}

export interface AttackSurface {
  id: string;
  component: string;
  interface: string;
  exposureType: 'External' | 'Wireless' | 'Physical' | 'Network' | 'Software' | 'Internet';
  entryPoint: string;
  potentialAttack: string;
  risk: SeverityLevel;
  evidence: string;
  category: 'Network' | 'Wireless' | 'Physical' | 'Software';
  preconditions: string;
  portOrAddress?: string;
}

export interface StrideThreat {
  id: string;
  category: StrideCategory;
  component: string;
  attackVector: string;
  title: string;
  description: string;
  impact: SeverityLevel;
  likelihood: SeverityLevel;
  exploitability: number; // 1 - 10
  riskScore: number; // 1.0 - 10.0
  evidence: string;
  recommendedMitigation: string;
  cvss: number;
  relatedCwe: string;
  likelihoodScore: number; // 1 - 5 for matrix
  impactScore: number; // 1 - 5 for matrix
  status: 'Open' | 'Mitigating' | 'Resolved';
}

export interface AttackTreeNode {
  id: string;
  label: string;
  technique: string;
  requiredConditions: string;
  difficulty: 'Low' | 'Medium' | 'High' | 'Expert';
  impact: 'Safety Critical' | 'Privacy Violation' | 'Denial of Service' | 'Integrity Loss';
  relatedThreatId?: string;
  riskLevel: SeverityLevel;
  status: 'Active Vector' | 'Mitigated' | 'Under Test';
  children?: AttackTreeNode[];
  isExpanded?: boolean;
}

export interface SecurityTestCase {
  id: string;
  threatId: string;
  threatTitle: string;
  component: string;
  objective: string;
  precondition: string;
  testSteps: string[];
  expectedResult: string;
  status: 'Passed' | 'Failed' | 'Needs Review' | 'Not Tested' | 'Blocked';
  lastRun?: string;
  attackVector?: string;
  automatedScriptSnippet?: string;
  toolFramework?: string; // e.g. CANoe, Scapy, AFL++, PyUDS
  executionDuration?: string;
}

export interface VulnerabilityItem {
  cveId: string;
  cwe: string;
  affectedComponent: string;
  severity: SeverityLevel;
  cvssScore: number;
  description: string;
  exploitability: string;
  recommendedFix: string;
  mappedThreatId?: string;
  publishedDate: string;
}

export interface MitigationItem {
  id: string;
  threatId: string;
  threatTitle: string;
  component: string;
  title: string;
  actionableSteps: string[];
  currentRisk: SeverityLevel;
  currentScore: number;
  expectedRisk: SeverityLevel;
  expectedScore: number;
  status: 'Planned' | 'In Progress' | 'Implemented';
  complexity: 'Low' | 'Medium' | 'High';
  implementationEta: string;
  securityStandardReference: string; // e.g. ISO/SAE 21434, UNECE R155, AUTOSAR SecOC
}

export interface SecurityControl {
  id: string;
  name: string;
  category: string;
  status: 'Passed' | 'Needs Review' | 'Failed';
  description: string;
  verificationMethod: string;
  lastAudited: string;
  evidenceRef: string;
  standard: string;
}

export interface ProjectData {
  id: string;
  name: string;
  systemType: SystemType;
  industry: string;
  description: string;
  version: string;
  createdAt: string;
  securityScore: number; // 0 - 100
  previousScore?: number;
  components: ArchitectureComponent[];
  connections: ArchitectureConnection[];
  attackSurfaces: AttackSurface[];
  threats: StrideThreat[];
  attackTree: AttackTreeNode;
  testCases: SecurityTestCase[];
  vulnerabilities: VulnerabilityItem[];
  mitigations: MitigationItem[];
  controls: SecurityControl[];
}
