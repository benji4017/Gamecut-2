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
  } = useRallyCut();

  const activeCount = rallies.filter((r) => !r.excluded).length;

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

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveScreen('export')}
            className="flex items-center gap-2 py-2 px-4 rounded-lg bg-[#00F5D4] text-slate-950 hover:bg-[#20f7dc] font-bold text-xs shadow-md shadow-[#00F5D4]/20 transition-all"
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
              filteredRallies.map((rally) => (
                <RallyClipCard key={rally.id} rally={rally} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
