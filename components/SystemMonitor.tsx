
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Cpu, HardDrive, Wifi, Zap, Monitor } from 'lucide-react';

const generateData = () => {
  return Array.from({ length: 20 }, (_, i) => ({
    time: i,
    cpu: 20 + Math.random() * 30,
    mem: 40 + Math.random() * 20,
    net: 10 + Math.random() * 50
  }));
};

export const SystemMonitor: React.FC = () => {
  const [data, setData] = useState(generateData());
  const [vram, setVram] = useState(12.4); // Initial VRAM in GB
  const [osName, setOsName] = useState('UNKNOWN');

  useEffect(() => {
    // Detect OS
    const platform = navigator.platform.toLowerCase();
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (platform.includes('mac') || userAgent.includes('mac')) setOsName('MACOS KERNEL');
    else if (platform.includes('win') || userAgent.includes('win')) setOsName('WINDOWS NT');
    else if (platform.includes('linux') || userAgent.includes('linux')) setOsName('LINUX KERNEL');
    else setOsName('WEB ASSEMBLY');

    const interval = setInterval(() => {
      setData(prev => {
        const next = [...prev.slice(1), {
          time: prev[prev.length - 1].time + 1,
          cpu: 20 + Math.random() * 40, // Simulate variable load
          mem: 40 + Math.random() * 10,
          net: Math.random() * 80
        }];
        return next;
      });

      // Simulate VRAM usage fluctuation
      setVram(prev => {
        const change = (Math.random() - 0.5) * 1.5;
        let next = prev + change;
        if (next < 6) next = 6;
        if (next > 23.5) next = 23.5;
        return next;
      });

    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-4 p-4 bg-nexus-800/50 border-l border-nexus-border min-h-full">
      <h3 className="text-nexus-accent font-mono text-sm uppercase tracking-wider flex items-center gap-2">
        <Activity className="w-4 h-4" /> System Telemetry
      </h3>

      <div className="h-40 w-full bg-nexus-900 border border-nexus-border p-2 rounded-sm relative overflow-hidden shrink-0">
         <div className="absolute top-2 right-2 text-xs font-mono text-green-500 opacity-50">CPU_LOAD_AVG</div>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line type="monotone" dataKey="cpu" stroke="#00ff9d" strokeWidth={2} dot={false} isAnimationActive={false} />
            <YAxis domain={[0, 100]} hide />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="h-40 w-full bg-nexus-900 border border-nexus-border p-2 rounded-sm relative shrink-0">
         <div className="absolute top-2 right-2 text-xs font-mono text-purple-500 opacity-50">MEM_ALLOC</div>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line type="step" dataKey="mem" stroke="#a855f7" strokeWidth={2} dot={false} isAnimationActive={false} />
             <YAxis domain={[0, 100]} hide />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-2 shrink-0">
        <div className="bg-nexus-900 p-3 border border-nexus-border rounded-sm col-span-2">
            <div className="flex items-center justify-between text-nexus-dim mb-1">
                <div className="flex items-center gap-2">
                    <Monitor size={14} />
                    <span className="text-[10px] font-mono uppercase">Host OS</span>
                </div>
                <div className="text-[10px] font-mono text-white animate-pulse">
                    ONLINE
                </div>
            </div>
            <div className="text-lg font-mono text-nexus-accent tracking-wider">
                {osName}
            </div>
        </div>

        <div className="bg-nexus-900 p-3 border border-nexus-border rounded-sm">
            <div className="flex items-center gap-2 text-nexus-dim mb-1">
                <Cpu size={14} />
                <span className="text-[10px] font-mono uppercase">Threads</span>
            </div>
            <div className="text-xl font-mono text-white">{navigator.hardwareConcurrency || 8}</div>
        </div>
        <div className="bg-nexus-900 p-3 border border-nexus-border rounded-sm">
            <div className="flex items-center gap-2 text-nexus-dim mb-1">
                <HardDrive size={14} />
                <span className="text-[10px] font-mono uppercase">Local DB</span>
            </div>
            <div className="text-xl font-mono text-nexus-accent">ACTIVE</div>
        </div>
        
        {/* VRAM / GPU Section */}
        <div className="bg-nexus-900 p-3 border border-nexus-border rounded-sm col-span-2">
            <div className="flex items-center justify-between text-nexus-dim mb-2">
                <div className="flex items-center gap-2">
                    <Zap size={14} />
                    <span className="text-[10px] font-mono uppercase">VRAM Usage</span>
                </div>
                <div className="text-[10px] font-mono text-white">
                    {vram.toFixed(1)} <span className="text-nexus-dim">/ 24 GB</span>
                </div>
            </div>
            <div className="h-2 w-full bg-nexus-800 rounded-sm overflow-hidden border border-nexus-border/30 mb-1">
                <div 
                    className="h-full bg-nexus-accent/80 transition-all duration-1000 ease-in-out" 
                    style={{ width: `${(vram / 24) * 100}%` }}
                />
            </div>
            <div className="text-[9px] text-right text-nexus-dim font-mono">
               {(24 - vram).toFixed(1)} GB AVAILABLE
            </div>
        </div>

         <div className="bg-nexus-900 p-3 border border-nexus-border rounded-sm col-span-2">
            <div className="flex items-center gap-2 text-nexus-dim mb-1">
                <Wifi size={14} />
                <span className="text-[10px] font-mono uppercase">Latency</span>
            </div>
            <div className="text-xl font-mono text-white flex justify-between">
                <span>12ms</span>
                <span className="text-[10px] text-nexus-dim mt-2">LOCALHOST</span>
            </div>
        </div>
      </div>
    </div>
  );
};
