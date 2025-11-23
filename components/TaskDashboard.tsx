import React from 'react';
import { Task, AgentMode } from '../types';
import { CheckCircle2, Circle, Clock, PlayCircle, X, ListTodo, BarChart } from 'lucide-react';

interface TaskDashboardProps {
  tasks: Task[];
  onClose: () => void;
  onUpdateStatus: (taskId: string, status: Task['status']) => void;
}

export const TaskDashboard: React.FC<TaskDashboardProps> = ({ tasks, onClose, onUpdateStatus }) => {
  const stats = {
    total: tasks.length,
    done: tasks.filter(t => t.status === 'done').length,
    progress: tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'done').length / tasks.length) * 100) : 0
  };

  const renderTaskColumn = (status: Task['status'], title: string, Icon: React.ElementType, color: string) => {
    const filteredTasks = tasks.filter(t => t.status === status);

    return (
      <div className="flex-1 flex flex-col gap-3 min-w-[250px]">
        <div className={`flex items-center gap-2 pb-2 border-b border-nexus-border ${color}`}>
          <Icon size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">{title}</span>
          <span className="ml-auto text-[10px] bg-nexus-800 px-2 py-0.5 rounded-full text-nexus-dim">
            {filteredTasks.length}
          </span>
        </div>
        <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-2">
          {filteredTasks.length === 0 && (
            <div className="p-4 border border-dashed border-nexus-border/30 rounded text-nexus-dim text-[10px] text-center italic">
              NO TASKS
            </div>
          )}
          {filteredTasks.map(task => (
            <div 
              key={task.id} 
              className="p-3 bg-nexus-800/30 border border-nexus-border hover:border-nexus-accent/50 transition-colors rounded-sm group"
            >
              <div className="text-xs font-mono text-gray-300 mb-2 leading-snug">{task.title}</div>
              <div className="flex items-center justify-between">
                 <span className="text-[9px] font-bold text-nexus-dim px-1.5 py-0.5 bg-nexus-900 rounded border border-nexus-border">
                    {task.agent}
                 </span>
                 <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {status !== 'in-progress' && status !== 'done' && (
                         <button onClick={() => onUpdateStatus(task.id, 'in-progress')} title="Start" className="text-blue-400 hover:text-white">
                            <PlayCircle size={14} />
                         </button>
                    )}
                     {status !== 'done' && (
                         <button onClick={() => onUpdateStatus(task.id, 'done')} title="Complete" className="text-nexus-accent hover:text-white">
                            <CheckCircle2 size={14} />
                         </button>
                    )}
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8 animate-fade-in">
      <div className="w-full max-w-5xl h-[80vh] bg-nexus-900 border border-nexus-accent/30 shadow-[0_0_30px_rgba(0,255,157,0.1)] flex flex-col rounded relative overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-nexus-border bg-nexus-800/50 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-nexus-accent/10 rounded text-nexus-accent">
                 <ListTodo size={20} />
              </div>
              <div>
                 <h2 className="text-lg font-bold tracking-widest text-white">PROJECT ORCHESTRATION</h2>
                 <div className="flex items-center gap-4 text-[10px] font-mono text-nexus-dim">
                    <span>TOTAL TASKS: {stats.total}</span>
                    <span>COMPLETION: {stats.progress}%</span>
                 </div>
              </div>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-nexus-700 rounded text-nexus-dim hover:text-white transition-colors">
              <X size={20} />
           </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 w-full bg-nexus-900">
           <div 
             className="h-full bg-gradient-to-r from-blue-500 to-nexus-accent transition-all duration-1000"
             style={{ width: `${stats.progress}%` }}
           />
        </div>

        {/* Content */}
        <div className="flex-1 flex gap-4 p-6 overflow-hidden">
           {renderTaskColumn('idle', 'PENDING', Circle, 'text-gray-400')}
           {renderTaskColumn('in-progress', 'IN PROGRESS', Clock, 'text-blue-400')}
           {renderTaskColumn('done', 'COMPLETED', CheckCircle2, 'text-nexus-accent')}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-nexus-border bg-nexus-900 text-[10px] text-nexus-dim font-mono flex items-center justify-between">
           <span>AUTO-GENERATED FROM [PLAN] AGENT</span>
           <div className="flex items-center gap-2">
              <BarChart size={12} />
              <span>SYNC ACTIVE</span>
           </div>
        </div>

      </div>
    </div>
  );
};