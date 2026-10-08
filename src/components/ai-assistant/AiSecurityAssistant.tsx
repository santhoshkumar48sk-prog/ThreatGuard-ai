import React, { useState, useRef, useEffect } from 'react';
import { useSecurity } from '../../context/SecurityContext';
import {
  Sparkles,
  X,
  Send,
  Loader2,
  Bot,
  User,
  Shield,
  FileCode,
  Copy,
  Check,
  ChevronDown
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: 'gemini' | 'rules_engine';
}

export const AiSecurityAssistant: React.FC = () => {
  const { currentProject, isAiAssistantOpen, setIsAiAssistantOpen } = useSecurity();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      text: `Hello! I am your **ThreatGuard AI Embedded Security Copilot**. I have parsed the **${currentProject.name}** architecture (${currentProject.components.length} components, ${currentProject.attackSurfaces.length} attack surfaces, ${currentProject.threats.length} STRIDE threats).

How can I assist your security engineering or ISO/SAE 21434 compliance analysis today?`,
      timestamp: 'Just now',
      source: 'gemini',
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAiAssistantOpen) {
      scrollToBottom();
    }
  }, [messages, isAiAssistantOpen]);

  const quickPrompts = [
    'What are the most dangerous attack surfaces?',
    'Explain THR-001 (Bluetooth bypass)',
    'Why is CAN injection high risk?',
    'Generate a security test for unauthorized CAN command',
    'How can I mitigate the diagnostic port vulnerability?',
    'Which component needs immediate attention?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const promptText = (textToSend || input).trim();
    if (!promptText || isLoading) return;

    const userMessage: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          projectContext: {
            name: currentProject.name,
            systemType: currentProject.systemType,
            securityScore: currentProject.securityScore,
            components: currentProject.components,
            threats: currentProject.threats,
            attackSurfaces: currentProject.attackSurfaces,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('AI response error: ' + response.statusText);
      }

      const data = await response.json();

      const botMessage: ChatMessage = {
        id: 'msg-resp-' + Date.now(),
        sender: 'assistant',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source || 'gemini',
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.warn('Backend chat failed, generating local embedded cybersecurity answer:', err);

      // Local fallback
      const botMessage: ChatMessage = {
        id: 'msg-resp-' + Date.now(),
        sender: 'assistant',
        text: `### ThreatGuard AI Technical Assessment

Regarding **"${promptText}"** on ${currentProject.name}:

* **Context Analysis:** Evaluated across ${currentProject.components.length} ECUs and ${currentProject.threats.length} STRIDE threats.
* **Primary Exposure:** IVI Infotainment Bluetooth 5.2 and Powertrain CAN-FD are high-risk entry points.
* **Remediation Recommendation:** Enforce AUTOSAR SecOC with AES-128 CMAC and restrict BlueZ Just-Works pairing in compliance with UNECE WP.29 R155.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'rules_engine',
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAiAssistantOpen) return null;

  return (
    <div className="fixed inset-x-2 bottom-2 sm:inset-auto sm:bottom-4 sm:right-4 z-50 sm:w-[460px] h-[calc(100vh-1rem)] sm:h-[580px] max-h-[94vh] rounded-2xl border border-indigo-500/30 bg-slate-900/98 shadow-2xl shadow-indigo-950/50 backdrop-blur-xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3 bg-gradient-to-r from-slate-950 via-indigo-950/30 to-slate-950">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/30">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white">Security Copilot</span>
              <span className="text-[10px] font-mono bg-cyan-950/80 text-cyan-300 px-1.5 py-0.2 rounded border border-cyan-700/60 shadow-xs">
                TARA-Aware
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono truncate max-w-[200px] sm:max-w-[240px]">
              Target: <span className="text-indigo-300 font-semibold">{currentProject.name}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAiAssistantOpen(false)}
          className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Close Copilot"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3.5 text-xs">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                  isUser
                    ? 'bg-slate-800 text-slate-200 border border-slate-700'
                    : 'bg-indigo-950 text-cyan-300 border border-indigo-700/60 shadow-xs'
                }`}
              >
                {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
              </div>

              <div
                className={`rounded-2xl p-3 sm:p-3.5 max-w-[85%] leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-tr-none shadow-md shadow-indigo-600/20'
                    : 'bg-slate-950 text-slate-200 border border-slate-800/90 rounded-tl-none space-y-1.5 shadow-xs'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans text-xs">
                  {msg.text}
                </div>
                <div
                  className={`text-[9px] font-mono mt-1 ${
                    isUser ? 'text-indigo-100 text-right' : 'text-slate-500 flex items-center justify-between'
                  }`}
                >
                  {!isUser && <span className="text-cyan-400 font-semibold">{msg.source === 'gemini' ? 'Gemini 3.8 Flash' : 'ThreatGuard Engine'}</span>}
                  <span>{msg.timestamp}</span>
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-indigo-300 bg-indigo-950/40 p-3 rounded-xl border border-indigo-800/50 w-fit shadow-xs">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-cyan-400" />
            <span>Analyzing architecture telemetry...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Row */}
      <div className="p-2 border-t border-slate-800 bg-slate-950/60">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSendMessage(prompt)}
              className="shrink-0 rounded-full border border-cyan-800/50 bg-cyan-950/30 px-2.5 py-1 text-cyan-300 hover:border-cyan-400 hover:bg-cyan-900/50 hover:text-white transition-all shadow-xs"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 p-3 border-t border-slate-800 bg-slate-950"
      >
        <input
          type="text"
          placeholder="Ask about threats, attack surfaces, test scripts, or mitigations..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          className="flex-1 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 transition-all disabled:opacity-40 shadow-md shadow-indigo-600/30 active:scale-95"
          aria-label="Send message"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </form>
    </div>
  );
};
