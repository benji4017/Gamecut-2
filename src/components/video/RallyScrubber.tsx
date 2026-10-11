import React, { useRef, useState } from 'react';
import { useRallyCut } from '../../context/RallyCutContext';
import { formatClockTime } from '../../services/analyticsService';

export const RallyScrubber: React.FC = () => {
  const {
    videoDuration,
    currentTime,
    seekToTime,
    rallies,
    filteredRallies,
    activeRally,
    seekToRally,
  } = useRallyCut();

  const trackRef = useRef<HTMLDivElement>(null);
  const [hoverInfo, setHoverInfo] = useState<{
    percent: number;
    time: number;
    rallyTitle?: string;
  } | null>(null);

  const duration = Math.max(1, videoDuration);
  const progressPercent = Math.min(100, Math.max(0, (currentTime / duration) * 100));

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    const time = (percent / 100) * duration;

    // Check if hovering over a rally
    const match = rallies.find((r) => !r.excluded && time >= r.startTime && time <= r.endTime);
    setHoverInfo({
      percent,
      time,
      rallyTitle: match
        ? `Rally #${match.index}: ${match.endingStroke.replace('_', ' ')} (${match.shotCount} shots)`
        : undefined,
    });
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const time = (x / rect.width) * duration;
    seekToTime(time);
  };

  return (
    <div className="w-full select-none py-1">
      {/* Legend & Current Time */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
        <div className="flex items-center gap-3">
          <span className="text-white font-bold tabular-nums">
            {formatClockTime(currentTime)}
          </span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400 tabular-nums">
            {formatClockTime(duration)}
          </span>
          {activeRally && (
            <span className="px-2 py-0.5 rounded bg-[#00F5D4]/15 text-[#00F5D4] text-[10px] font-bold border border-[#00F5D4]/30">
              Rally #{activeRally.index} ({activeRally.shotCount} shots)
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2.5 h-2 rounded bg-[#00F5D4]" />
            In-Play Rally
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2.5 h-2 rounded bg-[#CCFF00]" />
            3rd Ball Attack
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2.5 h-2 rounded bg-slate-800 border border-slate-700" />
            Dead Time
          </span>
        </div>
      </div>

      {/* Main Scrubber Track */}
      <div
        ref={trackRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setHoverInfo(null)}
        onPointerDown={handlePointerDown}
        className="relative h-8 bg-slate-900/90 rounded-lg border border-slate-800 cursor-pointer overflow-hidden group shadow-inner"
      >
        {/* Dead time subtle hatch background */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:6px_6px]" />

        {/* Rally Zones */}
        {rallies.map((rally) => {
          if (rally.excluded) return null;
          const leftPct = (rally.startTime / duration) * 100;
          const widthPct = Math.max(0.4, ((rally.endTime - rally.startTime) / duration) * 100);
          const isFiltered = filteredRallies.some((fr) => fr.id === rally.id);
          const isActive = activeRally?.id === rally.id;

          let bgClass = 'bg-[#00F5D4]';
          if (rally.isThirdBallAttack) bgClass = 'bg-[#CCFF00]';
          if (rally.shotCount >= 8) bgClass = 'bg-[#FF6B35]';

          return (
            <div
              key={rally.id}
              onClick={(e) => {
                e.stopPropagation();
                seekToRally(rally.id);
              }}
              style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
              className={`absolute top-0 bottom-0 transition-opacity ${bgClass} ${
                isFiltered ? 'opacity-90' : 'opacity-25'
              } ${isActive ? 'ring-2 ring-white ring-inset shadow-lg' : 'hover:brightness-125'}`}
              title={`Rally #${rally.index}: ${rally.shotCount} shots`}
            >
              {/* Rally index label inside block if wide enough */}
              {widthPct > 3 && (
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-bold text-slate-950 pointer-events-none">
                  #{rally.index}
                </span>
              )}
            </div>
          );
        })}

        {/* Playhead Progress Bar & Line */}
        <div
          style={{ width: `${progressPercent}%` }}
          className="absolute top-0 bottom-0 bg-white/5 pointer-events-none border-r-2 border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)] z-20"
        />

        {/* Hover Indicator & Tooltip */}
        {hoverInfo && (
          <>
            <div
              style={{ left: `${hoverInfo.percent}%` }}
              className="absolute top-0 bottom-0 w-0.5 bg-white/40 pointer-events-none z-10"
            />
            <div
              style={{ left: `${Math.min(92, Math.max(8, hoverInfo.percent))}%` }}
              className="absolute -top-7 -translate-x-1/2 px-2 py-0.5 bg-slate-950 border border-slate-700 rounded text-[10px] font-mono text-white pointer-events-none shadow-xl whitespace-nowrap z-30"
            >
              {formatClockTime(hoverInfo.time)}
              {hoverInfo.rallyTitle && ` · ${hoverInfo.rallyTitle}`}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
