import React, { useState } from 'react';
import { useSecurity } from '../../context/SecurityContext';
import { 
  Shield, 
  ChevronDown, 
  Search, 
  Sparkles, 
  Sun, 
  Moon, 
  Bell, 
  Plus, 
  Play, 
  CheckCircle2, 
  AlertTriangle,
  HardDrive,
  Menu,
  X
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentProject, 
    projects, 
    setCurrentProject, 
    setIsCreateProjectOpen, 
    loadDemoProject, 
    activeTab, 
    setActiveTab, 
    isAiAssistantOpen, 
    setIsAiAssistantOpen,
    searchQuery,
    setSearchQuery,
    theme,
    toggleTheme,
    isMobileMenuOpen,
    setIsMobileMenuOpen
  } = useSecurity();

  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-14 sm:h-16 w-full items-center justify-between border-b border-slate-800/80 bg-slate-950/95 px-3 sm:px-6 backdrop-blur-md">
      {/* Brand & Mobile Hamburger */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile menu button when in dashboard / tabs */}
        {activeTab !== 'landing' && (
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        )}

        <button 
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-2.5 text-left focus:outline-none group"
        >
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 transition-transform group-hover:scale-105 group-hover:shadow-indigo-500/50">
            <Shield className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm sm:text-base font-bold tracking-tight text-white group-hover:text-indigo-200 transition-colors">
                ThreatGuard
              </span>
              <span className="rounded-md bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 px-1.5 py-0.2 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-cyan-300 border border-cyan-500/40 shadow-xs">
                AI
              </span>
            </div>
            <p className="hidden sm:block text-[10px] text-slate-400 font-medium leading-none">Embedded Security</p>
          </div>
        </button>

        {activeTab !== 'landing' && (
          <div className="hidden lg:flex items-center text-slate-700 mx-1">/</div>
        )}

        {/* Project Selector Dropdown */}
        {activeTab !== 'landing' && (
          <div className="relative">
            <button
              onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
              className="flex items-center gap-1.5 sm:gap-2 rounded-lg border border-slate-800 bg-slate-900/90 px-2 sm:px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-indigo-500/50 hover:bg-slate-850 hover:shadow-xs hover:shadow-indigo-500/10 transition-all"
            >
              <div className="relative flex items-center justify-center">
                <HardDrive className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                <span className={`absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full ${
                  currentProject.securityScore >= 75 ? 'bg-emerald-400 ring-2 ring-emerald-950' : 'bg-amber-400 ring-2 ring-amber-950'
                }`} />
              </div>
              <span className="max-w-[100px] xs:max-w-[140px] sm:max-w-[200px] truncate font-medium">
                {currentProject.name}
              </span>
              <ChevronDown className="h-3 w-3 text-slate-400 shrink-0" />
            </button>

            {isProjectDropdownOpen && (
              <div 
                className="absolute left-0 mt-2 w-[calc(100vw-2rem)] max-w-xs sm:w-72 rounded-xl border border-slate-700/80 bg-slate-900/98 p-2 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setIsProjectDropdownOpen(false)}
              >
                <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-indigo-300 font-mono flex items-center justify-between">
                  <span>Switch Active Project</span>
                  <span className="text-[9px] text-slate-500 font-normal">TARA Verified</span>
                </div>
                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {projects.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setCurrentProject(p);
                        setIsProjectDropdownOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition-colors ${
                        p.id === currentProject.id
                          ? 'bg-blue-600/15 text-blue-300 font-semibold border border-blue-500/30'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <div className="truncate">
                        <div className="font-medium truncate">{p.name}</div>
                        <div className="text-[10px] text-slate-400">{p.systemType} · Score: {p.securityScore}/100</div>
                      </div>
                      {p.id === currentProject.id && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-400 shrink-0 ml-2" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="my-2 border-t border-slate-800" />

                <button
                  onClick={() => {
                    setIsProjectDropdownOpen(false);
                    setIsCreateProjectOpen(true);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-blue-400 hover:bg-slate-800 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Create New Analysis Project</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Center Search Input (hidden on mobile, visible on desktop) */}
      {activeTab !== 'landing' && (
        <div className="hidden xl:flex items-center flex-1 max-w-sm mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search components, threats, or CVEs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-900/80 pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Quick Demo Button */}
        <button
          onClick={loadDemoProject}
          title="Load pre-configured Smart Vehicle ECU demo project"
          className="flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-950/40 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-indigo-200 hover:bg-indigo-900/50 hover:border-indigo-400/50 hover:text-white transition-all shadow-xs"
        >
          <Play className="h-3 w-3 fill-current text-cyan-400" />
          <span className="hidden sm:inline">Load Demo</span>
          <span className="sm:hidden text-[11px]">Demo</span>
        </button>

        {/* Start Analysis Button */}
        <button
          onClick={() => setIsCreateProjectOpen(true)}
          className="hidden md:flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:from-blue-500 hover:to-purple-500 transition-all shadow-md shadow-indigo-600/25 active:scale-95"
        >
          <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
          <span>New Analysis</span>
        </button>

        {/* AI Assistant Drawer Toggle */}
        <button
          onClick={() => setIsAiAssistantOpen(!isAiAssistantOpen)}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1.5 text-xs font-medium transition-all ${
            isAiAssistantOpen
              ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-semibold shadow-md shadow-cyan-600/30 ring-1 ring-cyan-400'
              : 'border border-cyan-500/30 bg-cyan-950/30 text-cyan-300 hover:bg-cyan-900/40 hover:border-cyan-400/60 hover:text-white'
          }`}
          title="Open AI Security Assistant"
        >
          <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
          <span className="hidden sm:inline">Copilot</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            title="Security Notifications"
          >
            <Bell className="h-3.5 w-3.5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
          </button>

          {showNotifications && (
            <div 
              className="absolute right-0 mt-2 w-72 sm:w-80 rounded-xl border border-slate-800 bg-slate-900 p-3 shadow-2xl backdrop-blur-xl z-50 text-xs"
              onClick={() => setShowNotifications(false)}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 font-medium">
                <span className="font-semibold text-white">Security Alerts (2)</span>
                <span className="text-[10px] text-blue-400 cursor-pointer">Mark read</span>
              </div>
              <div className="mt-2 space-y-2">
                <div className="p-2.5 rounded-lg bg-red-950/30 border border-red-900/50 text-red-200">
                  <div className="font-semibold text-red-300 flex items-center gap-1.5">
                    <AlertTriangle className="h-3 w-3" /> Critical: Bluetooth Bypass
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    THR-001 active on IVI Infotainment unit without PIN enforcement.
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-900/50 text-amber-200">
                  <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                    <AlertTriangle className="h-3 w-3" /> Missing SecOC Protection
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Powertrain CAN-FD bus lacks cryptographic MAC verification.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun className="h-3.5 w-3.5 text-amber-400" /> : <Moon className="h-3.5 w-3.5 text-slate-400" />}
        </button>
      </div>
    </header>
  );
};
