import React from 'react';
import { BeforeAfterPlayer } from '../video/BeforeAfterPlayer';
import { Cpu } from 'lucide-react';

export const CockpitPreview: React.FC = () => {
  return (
    <div className="relative max-w-5xl mx-auto rounded-2xl p-1 bg-gradient-to-b from-slate-800/80 via-slate-900/60 to-slate-950 border border-slate-700 shadow-2xl overflow-hidden ai-glass-card">
      {/* Terminal Header Bar */}
      <div className="p-3.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
        </div>
        <div className="hidden sm:flex items-center gap-3 text-slate-400">
          <span className="text-[#00F5D4] font-bold flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5" />
            Gemini Vision Core
          </span>
          <span>·</span>
          <span>ITTF Rule Compliance</span>
        </div>
      </div>

      <div className="p-2 sm:p-4 bg-slate-950/90">
        <BeforeAfterPlayer />
      </div>
    </div>
  );
};
