import React from 'react';
import { useSecurity } from '../../context/SecurityContext';
import {
  FolderGit2,
  Plus,
  Play,
  CheckCircle2,
  HardDrive,
  Cpu,
  Shield,
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react';

export const ProjectsList: React.FC = () => {
  const { 
    projects, 
    currentProject, 
    setCurrentProject, 
    setIsCreateProjectOpen, 
    setActiveTab, 
    loadDemoProject 
  } = useSecurity();

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider font-mono">
              Project Management
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400 font-mono">{projects.length} System Scans</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Embedded Security Projects
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Switch between vehicle ECU architectures, medical infusion devices, robotics, and industrial RTU controllers.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadDemoProject}
            className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white"
          >
            <Play className="h-3 w-3 text-blue-400 fill-current" />
            <span>Reload Demo</span>
          </button>
          <button
            onClick={() => setIsCreateProjectOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-500 shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create New Project</span>
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((proj) => {
          const isActive = proj.id === currentProject.id;

          return (
            <div
              key={proj.id}
              onClick={() => {
                setCurrentProject(proj);
                setActiveTab('dashboard');
              }}
              className={`rounded-2xl border p-5 transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                isActive
                  ? 'bg-slate-900 border-blue-500 shadow-lg shadow-blue-500/10'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-blue-300 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                    {proj.systemType}
                  </span>
                  {isActive && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                      <CheckCircle2 className="h-3 w-3" /> Active
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white leading-snug">{proj.name}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {proj.description}
                </p>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/80 text-center text-xs font-mono">
                <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 uppercase block">Score</span>
                  <span className="text-sm font-bold text-blue-400">{proj.securityScore}/100</span>
                </div>
                <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 uppercase block">Threats</span>
                  <span className="text-sm font-bold text-rose-400">{proj.threats.length}</span>
                </div>
                <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 uppercase block">Tests</span>
                  <span className="text-sm font-bold text-emerald-400">{proj.testCases.length}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                <span>{proj.version}</span>
                <span className="text-blue-400 font-semibold flex items-center gap-1">
                  Open Project <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
