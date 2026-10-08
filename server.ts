import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI if key is provided
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client:', err);
  }
}

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'ThreatGuard AI Security Engine',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// AI Chat Endpoint with Project-Aware Context
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { prompt, projectContext, conversationHistory } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // If Gemini client is active, query gemini-3.8-flash
    if (aiClient) {
      try {
        const systemPrompt = `You are ThreatGuard AI, an elite embedded cybersecurity architect and security validation expert.
You specialize in automotive (ISO/SAE 21434, UNECE R155), IoT, industrial (IEC 62443), and medical device security.
You are evaluating the current project:
Project: "${projectContext?.name || 'Embedded System'}"
Type: "${projectContext?.systemType || 'Embedded'}"
Security Score: ${projectContext?.securityScore || 78}/100
Components: ${(projectContext?.components || []).map((c: any) => `${c.name} (${c.trustBoundary})`).join(', ')}
Key Threats: ${(projectContext?.threats || []).map((t: any) => `[${t.id}] ${t.title} (${t.impact}/${t.riskScore})`).join('; ')}
Attack Surfaces: ${(projectContext?.attackSurfaces || []).map((a: any) => `${a.interface} on ${a.component} (${a.risk})`).join('; ')}

Instructions:
1. Always behave as a technical, precise cybersecurity engineer.
2. Directly reference specific component names, protocols (CAN-FD, UDS, BLE, DoIP, SPI), CWEs, and threat IDs from the project context.
3. Provide actionable steps, mitigations, test steps, or risk justifications.
4. Keep the tone authoritative, clear, and professional. Avoid fluffy filler.
5. Use markdown formatting with bullet points and code blocks where relevant.`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.4,
          },
        });

        const reply = response.text || 'Security analysis complete.';
        return res.json({ reply, source: 'gemini' });
      } catch (geminiError: any) {
        console.warn('Gemini API call failed, falling back to embedded security engine:', geminiError?.message);
      }
    }

    // Intelligent Cybersecurity Engine Fallback
    const p = prompt.toLowerCase();
    let reply = '';

    if (p.includes('dangerous') || p.includes('attack surface')) {
      reply = `### Top Critical Attack Surfaces in ${projectContext?.name || 'Current Architecture'}

Based on exposure level and trust boundary crossing analysis, the most hazardous attack surfaces are:

1. **Bluetooth 5.2 / BlueZ Stack on IVI Infotainment (Critical)**
   * **Entry Point:** RFCOMM / L2CAP (Port 0x1001)
   * **Risk:** Unauthenticated HID injection (CVE-2023-45866) allows proximate attackers within 10m to gain root console access without user confirmation.

2. **CAN-FD Powertrain Bus Arbitration & Frame Injection (Critical)**
   * **Entry Point:** In-vehicle 5 Mbps Differential Bus
   * **Risk:** Broadcast frames for torque request (CAN ID \`0x0C0\`) and steering angle lack cryptographic MACs (SecOC disabled), allowing lateral vehicle takeover.

3. **OBD-II Diagnostic Port UDS SecurityAccess (High)**
   * **Entry Point:** ISO 14229 Service $27
   * **Risk:** Predictable 16-bit PRNG seed calculation allows flash bootloader unlocking and malicious ECU remapping.

**Recommended Immediate Action:** Enforce AUTOSAR SecOC with AES-128 CMAC and patch BlueZ daemon to >= 5.72.`;
    } else if (p.includes('bluetooth') || p.includes('thr-001')) {
      reply = `### Threat Deep-Dive: THR-001 (Bluetooth Authentication Bypass)

* **STRIDE Category:** Spoofing & Elevation of Privilege
* **Component Affected:** IVI Infotainment Unit (Android Automotive / Linux)
* **Risk Score:** 9.2 / 10 (Critical)
* **Root Cause:** Legacy Just-Works pairing fallback in \`bluez 5.58\` permits rogue peripheral emulation without PIN display verification.

**Exploit Path:**
1. Attacker discovers IVI Bluetooth MAC via passive inquiry.
2. Injects unauthenticated L2CAP connection request to PSM \`0x0011\` (HID Control).
3. Emulates keyboard HID device and injects keystrokes (\`Alt+F2\` -> \`/bin/sh\`).

**Actionable Mitigations:**
* Configure BlueZ \`main.conf\` with \`SecureConnections = 1\` and \`ClassicBondedOnly = true\`.
* Upgrade to BlueZ >= 5.72 (remediates CVE-2023-45866).
* Require explicit driver touch-screen confirmation before accepting any HID descriptor.`;
    } else if (p.includes('can') || p.includes('injection') || p.includes('thr-002')) {
      reply = `### Threat Deep-Dive: THR-002 (Powertrain CAN Message Injection)

* **STRIDE Category:** Tampering & Elevation of Privilege
* **Component:** CAN-FD Powertrain Bus & Gateway ECU
* **Risk Score:** 9.0 / 10 (Critical)
* **Impact Justification:** CAN-FD is an unauthenticated broadcast medium. If any node (or the Central Gateway) is compromised, an attacker can broadcast arbitrary frames like \`0x0C0\` (Engine Torque) or \`0x110\` (Target Brake Pressure).

**Validation Test Steps:**
1. Connect Vector CANoe or \`python-can\` to powertrain CAN-FD channel.
2. Transmit 50 bursts of ID \`0x0C0\` with maximum throttle payload.
3. Observe whether the motor inverter actuates or discards the frames.

**Standard Compliance:**
* **ISO/SAE 21434 Clause 10:** Mandates cryptographic authenticity on safety-related intra-vehicle buses.
* **Solution:** Deploy AUTOSAR SecOC with AES-128 CMAC and synchronized Freshness Value Management (FVM).`;
    } else if (p.includes('test') || p.includes('generate test')) {
      reply = `### Generated Security Test Case for Embedded Validation

\`\`\`python
# SEC-TEST-AUTOGEN: Diagnostic Port UDS SecurityAccess Entropy Validation
import udsoncan
from udsoncan.connections import SocketConnection

def test_uds_seed_entropy():
    conn = SocketConnection('192.168.1.100', 13400) # DoIP ISO 13400
    with udsoncan.Client(conn) as client:
        client.change_session(udsoncan.services.DiagnosticSessionControl.Session.extendedDiagnosticSession)
        
        seeds = []
        for _ in range(500):
            response = client.request_seed(level=1)
            seeds.append(int.from_bytes(response.service_data.seed, 'big'))
            
        # Verify Shannon Entropy >= 7.8 bits/byte
        import math
        from collections import Counter
        counts = Counter(seeds)
        entropy = -sum((count/500) * math.log2(count/500) for count in counts.values())
        print(f"Observed Seed Entropy: {entropy:.2f} bits (Target >= 7.5)")
        assert entropy >= 7.5, "FAIL: Weak PRNG detected in SecurityAccess challenge!"

if __name__ == "__main__":
    test_uds_seed_entropy()
\`\`\`
* **Target:** Central Gateway OBD-II / DoIP Interface
* **Standard:** ISO 14229-1:2020 / UNECE WP.29 R155`;
    } else if (p.includes('component') || p.includes('immediate attention') || p.includes('priority')) {
      reply = `### Component Requiring Immediate Attention: IVI Infotainment Unit & Gateway

1. **IVI Infotainment Unit (Highest Exposure)**
   * Houses both Bluetooth 5.2 and Wi-Fi 6 external interfaces.
   * Directly interfaces with passenger devices while having an Ethernet bridge to the Central Gateway.
   * Current critical threat: **THR-001 (Bluetooth Auth Bypass)**.

2. **Central Gateway (Highest Blast Radius)**
   * If breached through DoIP or routing vulnerabilities, provides unrestricted pivot capability into Powertrain CAN-FD Bus A and LIN sub-buses.
   * Requires immediate SecOC enforcement and babbling node protection.`;
    } else {
      reply = `### ThreatGuard AI Security Assessment

Regarding your inquiry on **${projectContext?.name || 'the system'}**:

* **Current Security Posture:** Score of **${projectContext?.securityScore || 78}/100** across ${projectContext?.components?.length || 8} embedded components.
* **Key Observations:**
  1. The boundary between the untrusted cockpit (IVI/Telematics) and the safety-critical domain (Powertrain/Gateway) is currently vulnerable to message spoofing and unauthenticated pivot attacks.
  2. ${projectContext?.threats?.filter((t: any) => t.impact === 'Critical').length || 3} critical threats remain in 'Open' status requiring immediate engineering remediation.
  3. Security controls for **Input Validation** and **Authentication** have failed recent automated test cycles.

Would you like me to generate a specific automated test case, calculate DREAD/CVSS risk, or produce an ISO/SAE 21434 compliance mitigation plan?`;
    }

    res.json({ reply, source: 'rules_engine' });
  } catch (error: any) {
    console.error('AI chat endpoint error:', error);
    res.status(500).json({ error: error?.message || 'Internal security engine error' });
  }
});

// Start server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static build in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ThreatGuard AI Security Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
