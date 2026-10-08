import React, { useState } from 'react';
import { useSecurity } from '../../context/SecurityContext';
import { AttackTreeNode } from '../../types/security';
import {
  GitFork,
  ChevronDown,
  ChevronRight,
  Play,
  Maximize2,
  Minimize2,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const AttackTreeView: React.FC = () => {
  const { currentProject, setSelectedThreatId, setActiveTab } = useSecurity();

  const [treeData, setTreeData] = useState<AttackTreeNode>(currentProject.attackTree);
  const [selectedNode, setSelectedNode] = useState<AttackTreeNode | null>(currentProject.attackTree);
  const [isSimulatingPath, setIsSimulatingPath] = useState(false);
  const [simulationStep, setSimulationStep] = useState<string | null>(null);

  const toggleExpand = (nodeId: string) => {
    const updateNode = (node: AttackTreeNode): AttackTreeNode => {
      if (node.id === nodeId) {
        return { ...node, isExpanded: !node.isExpanded };
      }
      if (node.children) {
        return { ...node, children: node.children.map(updateNode) };
      }
      return node;
    };
    setTreeData(updateNode(treeData));
  };

  const setAllExpanded = (expanded: boolean) => {
    const setExp = (node: AttackTreeNode): AttackTreeNode => ({
      ...node,
      isExpanded: expanded,
      children: node.children ? node.children.map(setExp) : undefined,
    });
    setTreeData(setExp(treeData));
  };

  const runPathSimulation = async () => {
    setIsSimulatingPath(true);
    setSimulationStep('Phase 1: Establishing RF Bluetooth inquiry with target IVI...');
    await new Promise((r) => setTimeout(r, 700));
    setSimulationStep('Phase 2: Triggering Just-Works pairing bypass without user PIN (THR-001)...');
    await new Promise((r) => setTimeout(r, 800));
    setSimulationStep('Phase 3: Injecting rogue HID keystrokes into IVI to attain shell access...');
    await new Promise((r) => setTimeout(r, 800));
    setSimulationStep('Phase 4: Traversing Central Gateway bridge to reach Powertrain CAN-FD...');
    await new Promise((r) => setTimeout(r, 900));
    setSimulationStep('Phase 5: Injected CAN ID 0x0C0 Torque Override! Motor Inverter Actuated! [GOAL ACHIEVED]');
    await new Promise((r) => setTimeout(r, 1200));
    setIsSimulatingPath(false);
  };

  const renderNode = (node: AttackTreeNode, depth = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = node.isExpanded !== false;
    const isSelected = selectedNode?.id === node.id;

    const difficultyColor =
      node.difficulty === 'Low'
        ? 'text-red-400 bg-red-950/60 border-red-900'
        : node.difficulty === 'Medium'
        ? 'text-amber-400 bg-amber-950/60 border-amber-900'
        : 'text-blue-400 bg-blue-950/60 border-blue-900';

    return (
      <div key={node.id} className="space-y-2">
        <div
          onClick={() => setSelectedNode(node)}
          style={{ paddingLeft: `${Math.min(depth * 10, 40)}px` }}
          className={`group flex items-start gap-2 sm:gap-3 rounded-xl border p-2.5 sm:p-3.5 transition-all cursor-pointer ${
            isSelected
              ? 'bg-slate-900 border-blue-500 shadow-sm ring-1 ring-blue-500/40'
              : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
          }`}
        >
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(node.id);
              }}
              className="mt-0.5 p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-blue-400" />
              ) : (
                <ChevronRight className="h-4 w-4 text-slate-400" />
              )}
            </button>
          ) : (
            <div className="w-5 mt-1.5 flex items-center justify-center shrink-0">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-600" />
            </div>
          )}

          <div className="flex-1 space-y-1 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-1.5">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors truncate">
                  {node.label}
                </span>
                {node.relatedThreatId && (
                  <span className="text-[10px] font-mono text-blue-400 bg-blue-950 px-1.5 py-0.2 rounded border border-blue-800 shrink-0">
                    {node.relatedThreatId}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-[10px] font-mono shrink-0">
                <span className={`px-2 py-0.5 rounded border ${difficultyColor}`}>
                  Diff: {node.difficulty}
                </span>
                <span className="text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {node.impact}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 line-clamp-1 leading-relaxed">
              {node.technique}
            </p>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="space-y-2 border-l border-slate-800/80 ml-3 sm:ml-5 pl-1 sm:pl-2">
            {node.children!.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-3.5 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 sm:pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider font-mono">
              Attack Path Analysis
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400 font-mono">Hierarchical Vector Tree</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mt-1">
            Interactive Attack Tree
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Explore adversary goals, required conditions, and lateral movement paths across vehicle electronic domains.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setAllExpanded(true)}
            className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white"
          >
            <Maximize2 className="h-3 w-3" />
            <span>Expand</span>
          </button>
          <button
            onClick={() => setAllExpanded(false)}
            className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white"
          >
            <Minimize2 className="h-3 w-3" />
            <span>Collapse</span>
          </button>
          <button
            onClick={runPathSimulation}
            disabled={isSimulatingPath}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 shadow-sm disabled:opacity-50"
          >
            <Play className={`h-3 w-3 fill-current ${isSimulatingPath ? 'animate-spin' : ''}`} />
            <span>{isSimulatingPath ? 'Simulating...' : 'Simulate Path'}</span>
          </button>
        </div>
      </div>

      {/* Path Simulation Banner */}
      {isSimulatingPath && (
        <div className="rounded-xl border border-blue-800 bg-blue-950/40 p-3.5 text-xs font-mono text-blue-200 animate-in fade-in flex items-center gap-3">
          <Sparkles className="h-4 w-4 text-blue-400 shrink-0 animate-spin" />
          <div className="flex-1">
            <span className="font-bold text-white">Live Attack Traversal: </span>
            <span>{simulationStep}</span>
          </div>
        </div>
      )}

      {/* Grid: Tree structure on left, Node inspector on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        <div className="lg:col-span-8 rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
              <GitFork className="h-4 w-4 text-blue-400" />
              <span>Goal: {treeData.label}</span>
            </h2>
            <span className="text-[10px] font-mono text-slate-400">
              {treeData.children?.length || 0} Attack Vectors
            </span>
          </div>

          <div className="space-y-2.5 pt-1 overflow-x-auto">{renderNode(treeData)}</div>
        </div>

        {/* Selected Node Inspector Drawer */}
        <div className="lg:col-span-4 rounded-xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5 space-y-4 flex flex-col justify-between">
          {selectedNode ? (
            <div className="space-y-3.5">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold">
                  Attack Technique Node
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">{selectedNode.label}</h3>
                <div className="flex items-center gap-2 mt-1 text-[11px] font-mono">
                  <span className="text-red-400 font-bold">{selectedNode.difficulty} Difficulty</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-300">{selectedNode.impact}</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Execution Mechanism
                </label>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  {selectedNode.technique}
                </p>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Required Preconditions
                </label>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  {selectedNode.requiredConditions}
                </p>
              </div>

              {selectedNode.relatedThreatId && (
                <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-xs space-y-1">
                  <div className="font-semibold text-blue-300 flex items-center justify-between">
                    <span>STRIDE Threat Mapping</span>
                    <span className="font-mono text-blue-400">{selectedNode.relatedThreatId}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Linked to verified CVE vulnerability and automated test harness.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-slate-500">
              Select an attack tree node to inspect conditions and lateral pivot paths.
            </div>
          )}

          {selectedNode?.relatedThreatId && (
            <button
              onClick={() => {
                setSelectedThreatId(selectedNode.relatedThreatId || null);
                setActiveTab('threat-model');
              }}
              className="w-full mt-3 flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition-colors shadow-sm"
            >
              <span>View Threat &amp; Mitigations</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
