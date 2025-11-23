
import React, { useState, useEffect } from 'react';
import { Settings, X, Volume2, VolumeX, MousePointer2, Zap, Gauge, Server, Cloud, Database, RefreshCw, AlertTriangle } from 'lucide-react';
import { AppSettings, SuggestionLevel, AIProvider } from '../types';
import { getOllamaModels } from '../services/ollamaService';

interface SettingsModalProps {
  settings: AppSettings;
  onUpdate: (newSettings: AppSettings) => void;
  onClose: () => void;
}

const FALLBACK_MODELS = [
  'llama3', 
  'mistral', 
  'codellama', 
  'qwen2.5-coder', 
  'gemma', 
  'deepseek-coder',
  'phi3'
];

export const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onUpdate, onClose }) => {
  
  const [activeTab, setActiveTab] = useState<'general' | 'backend'>('general');
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [isFetchingModels, setIsFetchingModels] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch models when tab opens or URL changes
  useEffect(() => {
    if (activeTab === 'backend' && settings.aiProvider === 'ollama') {
        fetchModels();
    }
  }, [activeTab, settings.aiProvider]);

  const fetchModels = async () => {
    setIsFetchingModels(true);
    setFetchError(null);
    try {
      const models = await getOllamaModels(settings.ollamaUrl);
      if (models.length === 0) throw new Error("No models returned");
      setAvailableModels(models);
    } catch (e: any) {
      console.warn("Auto-fetch failed, using fallbacks", e);
      setFetchError("Connection blocked or failed.");
      setAvailableModels(FALLBACK_MODELS); // Fallback so user can still select
    } finally {
      setIsFetchingModels(false);
    }
  };

  const handleToggle = (key: keyof AppSettings) => {
    if (key === 'suggestionLevel' || key === 'aiProvider' || key === 'ollamaUrl' || key === 'ollamaGeneralModel' || key === 'ollamaCodingModel') return; 
    onUpdate({
      ...settings,
      [key]: !settings[key]
    });
  };

  const handleLevelChange = (level: SuggestionLevel) => {
    onUpdate({
      ...settings,
      suggestionLevel: level
    });
  };

  const handleProviderChange = (provider: AIProvider) => {
    onUpdate({
        ...settings,
        aiProvider: provider
    });
  };

  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8 animate-fade-in">
      <div className="w-full max-w-md bg-nexus-900 border border-nexus-border shadow-[0_0_30px_rgba(0,0,0,0.5)] flex flex-col rounded relative overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-nexus-border bg-nexus-800/50 flex items-center justify-between">
           <div className="flex items-center gap-2 text-nexus-dim">
              <Settings size={16} />
              <span className="text-sm font-mono font-bold tracking-widest text-gray-200">SYSTEM CONFIGURATION</span>
           </div>
           <button onClick={onClose} className="text-nexus-dim hover:text-white transition-colors">
              <X size={18} />
           </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-nexus-border">
            <button 
                onClick={() => setActiveTab('general')}
                className={`flex-1 py-2 text-[10px] font-bold uppercase transition-colors ${activeTab === 'general' ? 'bg-nexus-800 text-nexus-accent' : 'text-nexus-dim hover:bg-nexus-800/50'}`}
            >
                Interface & Agents
            </button>
            <button 
                onClick={() => setActiveTab('backend')}
                className={`flex-1 py-2 text-[10px] font-bold uppercase transition-colors ${activeTab === 'backend' ? 'bg-nexus-800 text-nexus-accent' : 'text-nexus-dim hover:bg-nexus-800/50'}`}
            >
                Backend Services
            </button>
        </div>

        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          
          {activeTab === 'general' && (
              <>
                {/* Suggestion Level */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-nexus-accent">
                        <Gauge size={16} />
                        <label className="text-xs font-bold font-mono uppercase">Orchestrator Suggestion Level</label>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {(['low', 'medium', 'high'] as SuggestionLevel[]).map((level) => (
                        <button
                            key={level}
                            onClick={() => handleLevelChange(level)}
                            className={`
                            py-2 px-3 rounded border text-xs font-mono uppercase transition-all
                            ${settings.suggestionLevel === level 
                                ? 'bg-nexus-accent/10 border-nexus-accent text-nexus-accent shadow-[0_0_10px_rgba(0,255,157,0.1)]' 
                                : 'bg-nexus-800 border-nexus-border text-gray-500 hover:border-gray-600'
                            }
                            `}
                        >
                            {level}
                        </button>
                        ))}
                    </div>
                    <p className="text-[10px] text-nexus-dim leading-relaxed">
                        {settings.suggestionLevel === 'low' && "Conservative. Only suggests switches for critical context mismatches."}
                        {settings.suggestionLevel === 'medium' && "Balanced. Standard flow for most development tasks."}
                        {settings.suggestionLevel === 'high' && "Aggressive. Proactively suggests specialists for every sub-task."}
                    </p>
                </div>

                <div className="h-px w-full bg-nexus-border/50" />

                {/* Toggles */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 hover:bg-nexus-800/30 rounded cursor-pointer" onClick={() => handleToggle('soundEnabled')}>
                        <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded ${settings.soundEnabled ? 'text-nexus-accent bg-nexus-accent/10' : 'text-gray-600 bg-nexus-900'}`}>
                            {settings.soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-gray-300">Interface Sounds</span>
                            <span className="text-[9px] text-nexus-dim">Enable haptic audio feedback</span>
                        </div>
                        </div>
                        <div className={`w-8 h-4 rounded-full relative transition-colors ${settings.soundEnabled ? 'bg-nexus-accent' : 'bg-gray-700'}`}>
                            <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${settings.soundEnabled ? 'left-4.5' : 'left-0.5'}`} />
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-2 hover:bg-nexus-800/30 rounded cursor-pointer" onClick={() => handleToggle('autoScroll')}>
                        <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded ${settings.autoScroll ? 'text-blue-400 bg-blue-400/10' : 'text-gray-600 bg-nexus-900'}`}>
                            <MousePointer2 size={14} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-gray-300">Auto-Scroll</span>
                            <span className="text-[9px] text-nexus-dim">Follow new messages automatically</span>
                        </div>
                        </div>
                        <div className={`w-8 h-4 rounded-full relative transition-colors ${settings.autoScroll ? 'bg-nexus-accent' : 'bg-gray-700'}`}>
                            <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${settings.autoScroll ? 'left-4.5' : 'left-0.5'}`} />
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-2 hover:bg-nexus-800/30 rounded cursor-pointer" onClick={() => handleToggle('animations')}>
                        <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded ${settings.animations ? 'text-purple-400 bg-purple-400/10' : 'text-gray-600 bg-nexus-900'}`}>
                            <Zap size={14} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-gray-300">Reduced Motion</span>
                            <span className="text-[9px] text-nexus-dim">Disable CRT scanlines and heavy animations</span>
                        </div>
                        </div>
                        <div className={`w-8 h-4 rounded-full relative transition-colors ${!settings.animations ? 'bg-nexus-accent' : 'bg-gray-700'}`}>
                            <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${!settings.animations ? 'left-4.5' : 'left-0.5'}`} />
                        </div>
                    </div>
                </div>
            </>
          )}

          {activeTab === 'backend' && (
             <div className="space-y-6">
                 {/* Provider Selector */}
                 <div className="space-y-3">
                    <div className="flex items-center gap-2 text-nexus-accent">
                        <Server size={16} />
                        <label className="text-xs font-bold font-mono uppercase">AI Inference Backend</label>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                           onClick={() => handleProviderChange('gemini')}
                           className={`p-3 rounded border flex flex-col items-center gap-2 transition-all ${settings.aiProvider === 'gemini' ? 'bg-nexus-accent/10 border-nexus-accent text-nexus-accent' : 'bg-nexus-800 border-nexus-border text-gray-500'}`}
                        >
                           <Cloud size={20} />
                           <span className="text-xs font-bold">GOOGLE GEMINI</span>
                           <span className="text-[9px] opacity-60">Cloud API</span>
                        </button>
                        <button
                           onClick={() => handleProviderChange('ollama')}
                           className={`p-3 rounded border flex flex-col items-center gap-2 transition-all ${settings.aiProvider === 'ollama' ? 'bg-orange-500/10 border-orange-500 text-orange-500' : 'bg-nexus-800 border-nexus-border text-gray-500'}`}
                        >
                           <Database size={20} />
                           <span className="text-xs font-bold">OLLAMA LOCAL</span>
                           <span className="text-[9px] opacity-60">Localhost API</span>
                        </button>
                    </div>
                 </div>

                 {/* Ollama Specifics */}
                 {settings.aiProvider === 'ollama' && (
                    <div className="p-4 rounded bg-nexus-800/30 border border-orange-500/30 space-y-4 animate-fade-in">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] text-orange-400 uppercase font-bold">Connection URL</label>
                            <button onClick={fetchModels} className="text-orange-400 hover:text-white" title="Refresh Models">
                                <RefreshCw size={12} className={isFetchingModels ? 'animate-spin' : ''}/>
                            </button>
                        </div>
                        <input 
                            type="text" 
                            value={settings.ollamaUrl}
                            onChange={(e) => onUpdate({ ...settings, ollamaUrl: e.target.value })}
                            className="w-full bg-nexus-900 border border-nexus-border text-xs p-2 text-gray-300 rounded focus:border-orange-500 focus:outline-none font-mono"
                            placeholder="http://localhost:11434"
                        />
                        
                        {/* Error Notice */}
                        {fetchError && (
                             <div className="text-[9px] bg-red-500/10 border border-red-500/30 p-2 rounded text-red-300 flex gap-2 items-start">
                                <AlertTriangle size={12} className="shrink-0 mt-0.5" />
                                <div>
                                    <div className="font-bold mb-1">{fetchError}</div>
                                    Using fallback model list. To fix, ensure Ollama is running and allow browser origins:
                                    <code className="block bg-black/30 p-1 mt-1 rounded text-orange-300 select-all">
                                       launchctl setenv OLLAMA_ORIGINS "*"
                                    </code>
                                    (Restart Ollama after setting)
                                </div>
                             </div>
                        )}

                        {/* Model Selection - General */}
                        <div className="space-y-1">
                            <label className="text-[10px] text-orange-400 uppercase font-bold">General/Orchestrator Model</label>
                            <div className="text-[9px] text-nexus-dim mb-1">Used by: CHAT, PLAN, MONITOR</div>
                            <select 
                                value={settings.ollamaGeneralModel}
                                onChange={(e) => onUpdate({ ...settings, ollamaGeneralModel: e.target.value })}
                                className="w-full bg-nexus-900 border border-nexus-border text-xs p-2 text-gray-300 rounded focus:border-orange-500 focus:outline-none font-mono"
                            >
                                <option value="">-- Select Model --</option>
                                {availableModels.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>

                         {/* Model Selection - Coding */}
                         <div className="space-y-1 border-t border-nexus-border/50 pt-2">
                            <label className="text-[10px] text-orange-400 uppercase font-bold">Specialist/Coding Model</label>
                            <div className="text-[9px] text-nexus-dim mb-1">Used by: CODER, ARCHITECT, TEST, SECURE, DEPLOY</div>
                            <select 
                                value={settings.ollamaCodingModel}
                                onChange={(e) => onUpdate({ ...settings, ollamaCodingModel: e.target.value })}
                                className="w-full bg-nexus-900 border border-nexus-border text-xs p-2 text-gray-300 rounded focus:border-orange-500 focus:outline-none font-mono"
                            >
                                <option value="">-- Same as General --</option>
                                {availableModels.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                    </div>
                 )}
             </div>
          )}

        </div>
      </div>
    </div>
  );
};
