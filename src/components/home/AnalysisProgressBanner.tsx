import React from 'react';
import { Sparkles } from 'lucide-react';

interface AnalysisProgressBannerProps {
  progress: {
    stage: string;
    percent: number;
    message: string;
  };
}

export const AnalysisProgressBanner: React.FC<AnalysisProgressBannerProps> = ({ progress }) => {
  return (
    <div className="p-5 rounded-2xl bg-slate-900/95 border border-[#00F5D4]/40 shadow-2xl space-y-3 max-w-4xl mx-auto backdrop-blur-md">
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-[#00F5D4] font-bold flex items-center gap-2">
          <Sparkles className="w-4 h-4 animate-spin text-[#00F5D4]" />
          {progress.message}
        </span>
        <span className="text-white font-bold tabular-nums">{progress.percent}%</span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          style={{ width: `${progress.percent}%` }}
          className="h-full bg-gradient-to-r from-[#00F5D4] to-[#CCFF00] transition-all duration-300"
        />
      </div>
    </div>
  );
};
