import React from 'react';
import { AgentMode, AGENTS } from '../types';
import { 
  MessageSquare, 
  Map as MapIcon, 
  Cpu, 
  Code, 
  FlaskConical, 
  ShieldAlert, 
  Rocket, 
  Activity 
} from 'lucide-react';

interface AgentGridProps {
  activeAgent: AgentMode;
}

const AGENT_ICONS: Record<string, React.ElementType> = {
  'MessageSquare': MessageSquare,
  'Map': MapIcon,
  'Cpu': Cpu,
  'Code': Code,
  'FlaskConical': FlaskConical,
  'ShieldAlert': ShieldAlert,
  'Rocket': Rocket,
  'Activity': Activity
};

export const AgentGrid: React.FC<AgentGridProps> = ({ activeAgent }) => {
  return (
    <div className="grid grid-cols-2 gap-3 p-4">
      {Object.values(AGENTS).map((agent) => {
        // Safe check for icon existence to prevent runtime errors
        const IconComponent = AGENT_ICONS[agent.icon] || MessageSquare;
        const isActive = activeAgent === agent.id;

        return (
          <div
            key={agent.id}
            className={`
              relative group p-3 border rounded-sm transition-all duration-200
              ${isActive 
                ? 'bg-nexus-800 border-nexus-accent shadow-[0_0_10px_rgba(0,255,157,0.2)]' 
                : 'bg-nexus-900/50 border-nexus-border opacity-60 hover:opacity-100'
              }
            `}
          >
            {isActive && (
                <span className="absolute top-1 right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nexus-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-nexus-accent"></span>
                </span>
            )}
            
            <div className="flex items-start gap-3">
              <div className={`${isActive ? agent.color : 'text-gray-500'}`}>
                <IconComponent size={20} />
              </div>
              <div>
                <h4 className={`font-mono text-xs font-bold ${isActive ? 'text-white' : 'text-gray-400'}`}>
                  {agent.name}
                </h4>
                <p className="text-[10px] text-gray-500 leading-tight mt-1">
                  {agent.id} MODULE
                </p>
              </div>
            </div>
          </div>
        );
      })}
      
      <div className="col-span-2 mt-4 p-3 bg-blue-900/20 border border-blue-800/50 rounded text-[10px] text-blue-300 font-mono">
        <span className="font-bold">TIP:</span> Use <span className="bg-blue-900 px-1 rounded border border-blue-700">/chat</span>, <span className="bg-blue-900 px-1 rounded border border-blue-700">/coder</span> to jump channels, or <span className="bg-blue-900 px-1 rounded border border-blue-700">TAB</span> to cycle.
      </div>
    </div>
  );
};