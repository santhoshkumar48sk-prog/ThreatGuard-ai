import { ProjectData, SystemType } from '../types/security';
import { demoProject } from './demoProject';

export function createProjectFromTemplate(params: {
  name: string;
  systemType: SystemType;
  industry: string;
  description: string;
  version: string;
  uploadedArchitecture?: string;
  uploadedCode?: string;
}): ProjectData {
  if (params.systemType === 'Automotive ECU') {
    return {
      ...demoProject,
      id: 'proj-' + Math.random().toString(36).substring(2, 9),
      name: params.name || 'Automotive Domain Controller & Gateway',
      industry: params.industry || 'Automotive',
      version: params.version || 'v1.0.0',
      description: params.description || demoProject.description,
      createdAt: new Date().toISOString(),
    };
  }

  if (params.systemType === 'Medical Devices') {
    return {
      id: 'proj-' + Math.random().toString(36).substring(2, 9),
      name: params.name || 'Connected Medical Infusion Pump & Monitor',
      systemType: 'Medical Devices',
      industry: params.industry || 'Healthcare & Life Sciences',
      version: params.version || 'v1.2.0',
      description: params.description || 'Class IIb safety-critical embedded wireless drug delivery pump with BLE patient sensor telemetry, drug dose calculator, and hospital HL7/FHIR EHR gateway.',
      createdAt: new Date().toISOString(),
      securityScore: 68,
      previousScore: 55,
      components: [
        {
          id: 'comp-med-1',
          name: 'Infusion Pump Motor Controller',
          type: 'ecu',
          role: 'Regulates stepper motor dosing pulses, occlusion pressure transducers, and air-in-line ultrasonic sensors.',
          interfaces: ['SPI Motor Drive', 'UART Inter-MCU', 'Hardware E-Stop'],
          dataHandled: 'Hourly bolus rates, medication library dosage limits, battery health.',
          dataSensitivity: 'Safety-Critical',
          trustBoundary: 'Isolated Safety Domain',
          attackSurfaceCount: 3,
          threatsCount: 2,
          riskLevel: 'Critical',
          firmwareVersion: 'SafeRTOS ASIL-D / STM32F429',
          osType: 'SafeRTOS',
          x: 480,
          y: 200,
        },
        {
          id: 'comp-med-2',
          name: 'Wireless Connectivity Module',
          type: 'gateway',
          role: 'Handles hospital Wi-Fi 802.11ac, BLE patient tag beaconing, and TLS HL7 EHR synchronization.',
          interfaces: ['Wi-Fi 802.11ac', 'BLE 5.0', 'USB Nurse Console', 'UART to Safety MCU'],
          dataHandled: 'Patient PHI/PII, infusion logs, physician prescription commands.',
          dataSensitivity: 'Confidential',
          trustBoundary: 'Untrusted External',
          attackSurfaceCount: 4,
          threatsCount: 3,
          riskLevel: 'Critical',
          firmwareVersion: 'Embedded Linux 5.15 / NXP i.MX6ULL',
          osType: 'Yocto Linux',
          x: 180,
          y: 120,
        },
        {
          id: 'comp-med-3',
          name: 'Hospital EHR & Telemetry Server',
          type: 'cloud',
          role: 'Central hospital server dispatching drug library updates and receiving real-time alarm telemetry.',
          interfaces: ['HTTPS / mTLS REST', 'HL7 / FHIR protocol'],
          dataHandled: 'Patient medical records, dose prescription tokens, pump serial numbers.',
          dataSensitivity: 'Confidential',
          trustBoundary: 'Cloud Edge',
          attackSurfaceCount: 2,
          threatsCount: 1,
          riskLevel: 'High',
          firmwareVersion: 'Kubernetes / Epic EHR Gateway',
          osType: 'Hospital Cloud',
          x: 180,
          y: 380,
        }
      ],
      connections: [
        {
          id: 'med-conn-1',
          source: 'comp-med-2',
          target: 'comp-med-1',
          protocol: 'UART Optical Isolation with CRC32',
          direction: 'bidirectional',
          isExposed: false,
          trustBoundaryCrossing: true,
          riskLevel: 'Critical'
        },
        {
          id: 'med-conn-2',
          source: 'comp-med-3',
          target: 'comp-med-2',
          protocol: 'Hospital Wi-Fi / mTLS HTTPS',
          direction: 'bidirectional',
          isExposed: true,
          trustBoundaryCrossing: true,
          riskLevel: 'High'
        }
      ],
      attackSurfaces: [
        {
          id: 'med-as-1',
          component: 'Wireless Connectivity Module',
          interface: 'BLE 5.0',
          exposureType: 'Wireless',
          entryPoint: 'GATT Service 0x180D Custom Dose Endpoint',
          potentialAttack: 'Unauthenticated write to dose adjustment characteristic resulting in lethal medication overdose.',
          risk: 'Critical',
          evidence: 'BLE GATT service has WriteWithoutResponse permission enabled without PIN bonding.',
          category: 'Wireless',
          preconditions: 'Within 15 meters of hospital bed.',
          portOrAddress: 'GATT Handle 0x0024'
        },
        {
          id: 'med-as-2',
          component: 'Infusion Pump Motor Controller',
          interface: 'UART Inter-MCU',
          exposureType: 'Software',
          entryPoint: 'Packet Parser State Machine',
          potentialAttack: 'Buffer overflow injection bypassing dose limit safety checks.',
          risk: 'Critical',
          evidence: 'UART parser uses fixed 64-byte stack buffer without bounds checking on payload length.',
          category: 'Software',
          preconditions: 'Compromised Wi-Fi module or rogue debug attachment.',
          portOrAddress: 'UART1 @ 57600'
        }
      ],
      threats: [
        {
          id: 'THR-MED-001',
          category: 'Tampering',
          component: 'Wireless Connectivity Module',
          attackVector: 'BLE GATT Dose Command Injection',
          title: 'Unauthenticated Remote Drug Bolus Infusion Override',
          description: 'An attacker within hospital proximity connects to the BLE GATT service and transmits unauthorized dose rate commands without doctor authentication.',
          impact: 'Critical',
          likelihood: 'High',
          exploitability: 8.9,
          riskScore: 9.4,
          evidence: 'GATT characteristic permits unencrypted write operations without passkey confirmation.',
          recommendedMitigation: 'Enforce BLE Secure Connections with Out-of-Band (OOB) NFC pairing between patient wristband and pump.',
          cvss: 9.4,
          relatedCwe: 'CWE-306: Missing Authentication for Critical Function',
          likelihoodScore: 4,
          impactScore: 5,
          status: 'Open'
        },
        {
          id: 'THR-MED-002',
          category: 'Information Disclosure',
          component: 'Wireless Connectivity Module',
          attackVector: 'Unencrypted Wi-Fi PHI Broadcast',
          title: 'Patient Health Information (PHI) Exposure over Hospital WLAN',
          description: 'Pump transmits patient name, room number, and medication history in cleartext JSON before TLS session is established.',
          impact: 'High',
          likelihood: 'High',
          exploitability: 8.0,
          riskScore: 8.1,
          evidence: 'Packet capture shows cleartext HTTP telemetry fallback when TLS certificate validation encounters hospital proxy.',
          recommendedMitigation: 'Strictly prohibit plain HTTP fallback; pin hospital root CA certificates in TPM secure storage.',
          cvss: 7.9,
          relatedCwe: 'CWE-319: Cleartext Transmission of Sensitive Information',
          likelihoodScore: 4,
          impactScore: 4,
          status: 'Open'
        }
      ],
      attackTree: {
        id: 'at-med-root',
        label: 'Fatal Overdose / Underdose on Patient Infusion',
        technique: 'Goal: Force lethal medication dosage delivery or shut down infusion during critical therapy.',
        requiredConditions: 'Proximity to hospital room or compromised hospital EHR network.',
        difficulty: 'Medium',
        impact: 'Safety Critical',
        riskLevel: 'Critical',
        status: 'Active Vector',
        isExpanded: true,
        children: [
          {
            id: 'at-med-ble',
            label: 'Exploit BLE GATT Dosing Profile',
            technique: 'Direct RF pairing bypass to write unauthorized dosage parameters.',
            requiredConditions: 'Target pump in BLE discovery mode.',
            difficulty: 'Low',
            impact: 'Safety Critical',
            relatedThreatId: 'THR-MED-001',
            riskLevel: 'Critical',
            status: 'Active Vector'
          }
        ]
      },
      testCases: [
        {
          id: 'SEC-TEST-MED-001',
          threatId: 'THR-MED-001',
          threatTitle: 'Unauthenticated Remote Drug Bolus Infusion Override',
          component: 'Wireless Connectivity Module',
          objective: 'Verify that write requests to GATT dose control characteristic without authenticated encryption are rejected.',
          precondition: 'BLE sniffer and automated GATT client connected to test pump in clinical test setup.',
          testSteps: [
            '1. Initiate BLE connection without pairing exchange.',
            '2. Send write request to UUID 0000FF01-0000-1000-8000-00805F9B34FB with 100mL/hr bolus value.',
            '3. Monitor pump LCD and audio alarm indicator.',
            '4. Verify pump triggers Security Error and rejects dosing command.'
          ],
          expectedResult: 'Pump rejects write with ATT_ERR_INSUFFICIENT_AUTHENTICATION (0x05); motor does not move.',
          status: 'Failed',
          lastRun: '2026-10-04 08:12:00 UTC',
          toolFramework: 'GATTTool / Scapy BLE'
        }
      ],
      vulnerabilities: [
        {
          cveId: 'CVE-2022-38141',
          cwe: 'CWE-306: Missing Authentication for Critical Function',
          affectedComponent: 'Medical Wireless Module',
          severity: 'Critical',
          cvssScore: 9.6,
          description: 'Vulnerability in medical infusion pump firmware allows unauthenticated attackers to alter drug library limits.',
          exploitability: 'Adjacent network via BLE; zero credentials required.',
          recommendedFix: 'Install FDA-approved Patch v1.2.4 enforcing cryptographic signing on all drug library updates.',
          mappedThreatId: 'THR-MED-001',
          publishedDate: '2022-09-15'
        }
      ],
      mitigations: [
        {
          id: 'MIT-MED-001',
          threatId: 'THR-MED-001',
          threatTitle: 'Unauthenticated Remote Drug Bolus Infusion Override',
          component: 'Wireless Connectivity Module',
          title: 'Implement Cryptographic Dose Confirmation with Dual Physical Nurse Button Interlock',
          actionableSteps: [
            'Require physical nurse confirmation button press on hardware casing for any remote dosage change exceeding 5%.',
            'Enforce BLE LE Secure Connections with ECDH P-256 pairing.',
            'Store dose bounds in hardware write-protected EEPROM.'
          ],
          currentRisk: 'Critical',
          currentScore: 9.4,
          expectedRisk: 'Low',
          expectedScore: 2.2,
          status: 'Planned',
          complexity: 'High',
          implementationEta: '2 Weeks',
          securityStandardReference: 'FDA Premarket Cybersecurity Guidelines / IEC 62304'
        }
      ],
      controls: demoProject.controls
    };
  }

  // Default / Industrial / IoT
  return {
    ...demoProject,
    id: 'proj-' + Math.random().toString(36).substring(2, 9),
    name: params.name || `${params.systemType} Security Architecture`,
    systemType: params.systemType,
    industry: params.industry || 'Industrial Automation',
    version: params.version || 'v1.0.0',
    description: params.description || `Security threat model and attack surface analysis for ${params.systemType}.`,
    createdAt: new Date().toISOString(),
  };
}
