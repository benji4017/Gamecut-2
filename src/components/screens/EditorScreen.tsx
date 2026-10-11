import React from 'react';
import { useRallyCut } from '../../context/RallyCutContext';
import { BeforeAfterPlayer } from '../video/BeforeAfterPlayer';
import { RallyScrubber } from '../video/RallyScrubber';
import { RallyFilterBar } from '../editor/RallyFilterBar';
import { RallyClipCard } from '../video/RallyClipCard';
import { Download, Scissors, Sparkles, Zap } from 'lucide-react';

export const EditorScreen: React.FC = () => {
  const {
    filteredRallies,
    rallies,
    analytics,
    setActiveScreen,
    playbackMode,
    setPlaybackMode,
    runAiAnalysis,
    isAnalyzing,
    moveRally,
    geminiApiKey,
    setIsKeyModalOpen,
    analyzedBy,
    cutTightness,
    applyCutTightness,
    player1,
    player2,
  } = useRallyCut();

  const activeCount = rallies.filter((r) => !r.excluded).length;

  const handleGeminiAnalyzeClick = () => {
    if (!geminiApiKey) {
      setIsKeyModalOpen(true);
    } else {
      runAiAnalysis();
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-4 px-4 space-y-6">
      {/* Top Banner: Quick Reel Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#00F5D4]/15 text-[#00F5D4] flex items-center justify-center font-bold">
            <Scissors className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Match Timeline & Highlight Editor</span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#00F5D4]/15 text-[#00F5D4] border border-[#00F5D4]/30">
                ITTF Official Rules
              </span>
            </h2>
            <div className="text-xs font-mono text-slate-400">
              {activeCount} of {rallies.length} rallies included ·{' '}
              <span className="text-[#00F5D4] font-bold">{analytics.deadTimePercent}% dead time cut</span> ·{' '}
              {analytics.activePlayDurationSecs}s highlight reel
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Global Cut Buffer / Tightness Control */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
            <span className="text-[10px] text-slate-400 pl-1.5 pr-0.5">Cut Buffer:</span>
            {(['tight', 'crisp', 'relaxed'] as const).map((t) => (
              <button
                key={t}
                onClick={() => applyCutTightness(t)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                  cutTightness === t
                    ? 'bg-[#00F5D4] text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title={
                  t === 'tight'
                    ? 'Instant 0.0s cut on dead ball'
                    : t === 'crisp'
                    ? 'Crisp 0.2s breathing room'
                    : 'Relaxed 0.4s buffer'
                }
              >
                {t === 'tight' ? 'Instant (0s)' : t === 'crisp' ? 'Crisp (0.2s)' : 'Relaxed (0.4s)'}
              </button>
            ))}
          </div>

          {analyzedBy === 'gemini-2.5-flash' ? (
            <span className="text-[10px] font-mono text-[#00F5D4] flex items-center gap-1.5 bg-[#00F5D4]/10 border border-[#00F5D4]/30 px-2 py-1 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00F5D4] animate-pulse" />
              <span>Gemini 2.5 Flash</span>
            </span>
          ) : (
            <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-2 py-1 rounded-lg">
              <span>Local Engine</span>
            </span>
          )}

          <button
            onClick={handleGeminiAnalyzeClick}
            disabled={isAnalyzing}
            className={`flex items-center gap-1.5 py-2 px-3.5 rounded-lg border font-bold text-xs disabled:opacity-50 transition-all shadow-sm active:scale-95 ${
              geminiApiKey
                ? 'bg-slate-800 hover:bg-slate-700 text-[#00F5D4] border-[#00F5D4]/30'
                : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30'
            }`}
            title={
              geminiApiKey
                ? 'Analyze with Google Gemini 2.5 Flash Vision'
                : 'Connect Gemini API Key to run Multimodal Vision'
            }
            aria-label="Re-analyze match with Gemini"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {isAnalyzing
                ? 'Analyzing...'
                : geminiApiKey
                ? 'Gemini Vision Analyze'
                : 'Connect Gemini Key'}
            </span>
          </button>

          <button
            onClick={() => setActiveScreen('export')}
            className="flex items-center gap-2 py-2 px-4 rounded-lg bg-[#00F5D4] text-slate-950 hover:bg-[#20f7dc] font-bold text-xs shadow-md shadow-[#00F5D4]/20 transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Highlight Reel</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Player on top/left, Clips list on bottom/right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Player & Scrubber) - 7 cols on desktop */}
        <div className="lg:col-span-7 space-y-4 lg:sticky lg:top-20">
          <BeforeAfterPlayer />
          <RallyScrubber />
        </div>

        {/* Right Column (Filter Bar & Rally Clip Cards) - 5 cols on desktop */}
        <div className="lg:col-span-5 space-y-4">
          {/* Filter Bar */}
          <RallyFilterBar />

          {/* Clips List */}
          <div className="space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
            {filteredRallies.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 font-mono text-xs">
                No rallies match this filter. Try selecting "All Points".
              </div>
            ) : (
              filteredRallies.map((rally, index) => (
                <RallyClipCard
                  key={rally.id}
                  rally={rally}
                  onMoveUp={index > 0 ? () => moveRally(index, index - 1) : undefined}
                  onMoveDown={index < filteredRallies.length - 1 ? () => moveRally(index, index + 1) : undefined}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
