import React from 'react';
import { ScreenType, useRallyCut } from '../../context/RallyCutContext';
import {
  Scissors,
  BarChart3,
  Download,
  FolderOpen,
  Sparkles,
  Zap,
} from 'lucide-react';

export const TopBar: React.FC = () => {
  const {
    activeScreen,
    setActiveScreen,
    analytics,
    loadSampleMatch,
    isAnalyzing,
  } = useRallyCut();

  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 bg-[#0B0F17]/95 border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-50">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => setActiveScreen('home')}
          className="flex items-center gap-2.5 text-left group transition-transform focus-visible:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00F5D4] via-[#00C2A8] to-[#0B0F17] p-[1px] shadow-lg shadow-[#00F5D4]/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0B0F17] rounded-[7px] flex items-center justify-center text-[#00F5D4] font-black text-sm">
              ⚡
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold tracking-tight text-white whitespace-nowrap">
                RALLY<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F5D4] to-[#70FFDB]">CUT</span>
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#00F5D4]/10 text-[#00F5D4] border border-[#00F5D4]/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00F5D4] animate-pulse" />
                GEMINI VISION
              </span>
            </div>
          </div>
        </button>

        {/* Quiet unboxed metadata */}
        <div className="hidden xl:flex items-center gap-2 text-xs text-slate-400 font-mono pl-4 border-l border-slate-800/80">
          <span className="text-[#00F5D4]">{analytics.deadTimePercent}% Dead Time Cut</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>{analytics.activeRalliesCount} Rallies (Zod Verified)</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>60 FPS Inference</span>
        </div>
      </div>

      {/* Zone 2: Clean single-line navigation tabs */}
      <nav className="flex items-center gap-1 p-1 bg-slate-900/90 rounded-xl border border-slate-800">
        <button
          onClick={() => setActiveScreen('home')}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
            activeScreen === 'home'
              ? 'bg-[#00F5D4] text-slate-950 shadow-md shadow-[#00F5D4]/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <FolderOpen className="w-3.5 h-3.5" />
          <span>Import</span>
        </button>

        <button
          onClick={() => setActiveScreen('editor')}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
            activeScreen === 'editor'
              ? 'bg-[#00F5D4] text-slate-950 shadow-md shadow-[#00F5D4]/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Scissors className="w-3.5 h-3.5" />
          <span>Editor & Timeline</span>
        </button>

        <button
          onClick={() => setActiveScreen('analytics')}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
            activeScreen === 'analytics'
              ? 'bg-[#00F5D4] text-slate-950 shadow-md shadow-[#00F5D4]/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Match Analytics</span>
        </button>

        <button
          onClick={() => setActiveScreen('export')}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
            activeScreen === 'export'
              ? 'bg-[#00F5D4] text-slate-950 shadow-md shadow-[#00F5D4]/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Highlight</span>
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={loadSampleMatch}
          disabled={isAnalyzing}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-all whitespace-nowrap shrink-0 hover:text-white"
          title="Reload Olympic Table Tennis Sample match"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#00F5D4]" />
          <span>Sample Match</span>
        </button>

        <button
          onClick={() => setActiveScreen(activeScreen === 'export' ? 'editor' : 'export')}
          className="flex items-center gap-2 px-4 py-1.5 text-xs font-bold text-slate-950 bg-[#00F5D4] hover:bg-[#20f7dc] active:scale-95 rounded-lg shadow-md shadow-[#00F5D4]/25 transition-all whitespace-nowrap shrink-0"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>{activeScreen === 'export' ? 'Back to Editor' : 'Export Reel'}</span>
        </button>
      </div>
    </header>
  );
};
