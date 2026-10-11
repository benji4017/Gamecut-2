import React, { useState } from 'react';
import { useRallyCut } from '../../context/RallyCutContext';

interface BroadcastScoreboardProps {
  position?: 'top-left' | 'bottom-left' | 'bottom-center';
  className?: string;
  onClose?: () => void;
}

export const BroadcastScoreboard: React.FC<BroadcastScoreboardProps> = ({
  position = 'top-left',
  className = '',
  onClose,
}) => {
  const {
    activeRally,
    rallies,
    player1,
    player2,
    currentTime,
    branding,
    replayState,
  } = useRallyCut();

  const [isMinimized, setIsMinimized] = useState(false);

  // Find the most recent rally at or before current time if not currently active
  const displayRally =
    activeRally ||
    [...rallies]
      .reverse()
      .find((r) => !r.excluded && currentTime >= r.startTime) ||
    rallies[0];

  if (!displayRally) return null;

  const positionClasses = {
    'top-left': 'top-3 left-3',
    'bottom-left': 'bottom-16 left-3',
    'bottom-center': 'bottom-16 left-1/2 -translate-x-1/2',
  }[position];

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className={`absolute ${positionClasses} z-30 pointer-events-auto px-2 py-1 rounded-md bg-slate-950/80 hover:bg-slate-900 border border-white/20 text-[11px] font-mono text-[#00F5D4] flex items-center gap-1.5 shadow-lg backdrop-blur-md transition-all ${className}`}
        title="Expand Scoreboard"
      >
        <span>🏓</span>
        <span>{displayRally.scoreP1} - {displayRally.scoreP2}</span>
      </button>
    );
  }

  return (
    <div
      className={`absolute ${positionClasses} z-30 pointer-events-auto select-none transition-all duration-200 ${className}`}
    >
      <div className="bg-slate-950/85 hover:bg-slate-950/95 backdrop-blur-md border border-white/15 rounded-lg shadow-xl overflow-hidden flex items-center h-8 px-2.5 gap-2 text-xs font-mono">
        {/* Replay or Event pill */}
        {replayState.isActive ? (
          <span className="px-1.5 py-0.5 rounded bg-orange-500/20 border border-orange-500/40 text-orange-400 font-extrabold text-[10px] animate-pulse">
            REPLAY
          </span>
        ) : displayRally.isMatchPoint ? (
          <span className="px-1.5 py-0.5 rounded bg-lime-500/20 text-[#CCFF00] font-bold text-[10px] animate-pulse">
            MATCH PT
          </span>
        ) : (
          <span className="text-[10px] text-slate-400 font-bold hidden sm:inline">
            G{displayRally.gameNumber}
          </span>
        )}

        {/* Player 1 */}
        <div className="flex items-center gap-1.5">
          <span className="text-sm" title={branding.p1Club.name}>{branding.p1Club.badgeEmoji}</span>
          <span className="font-bold text-white max-w-[80px] sm:max-w-[100px] truncate">
            {player1.name.split(' ')[0]}
          </span>
          {displayRally.server === 1 && (
            <span className="text-[10px]" title="Serving">🏓</span>
          )}
        </div>

        {/* Score Box */}
        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/60 border border-white/10 font-bold tabular-nums">
          <span className="text-[#00F5D4]">{displayRally.scoreP1}</span>
          <span className="text-slate-600">-</span>
          <span className="text-white">{displayRally.scoreP2}</span>
        </div>

        {/* Player 2 */}
        <div className="flex items-center gap-1.5">
          {displayRally.server === 2 && (
            <span className="text-[10px]" title="Serving">🏓</span>
          )}
          <span className="font-bold text-slate-200 max-w-[80px] sm:max-w-[100px] truncate">
            {player2.name.split(' ')[0]}
          </span>
          <span className="text-sm" title={branding.p2Club.name}>{branding.p2Club.badgeEmoji}</span>
        </div>

        {/* Minimize / Close controls */}
        <div className="flex items-center gap-1 ml-1 pl-1 border-l border-white/10 text-slate-500">
          <button
            onClick={() => setIsMinimized(true)}
            className="hover:text-white p-0.5 rounded text-[10px] leading-none"
            title="Minimize Scoreboard"
            aria-label="Minimize Scoreboard"
          >
            _
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="hover:text-white p-0.5 rounded text-[10px] leading-none"
              title="Hide Scoreboard"
              aria-label="Hide Scoreboard"
            >
              ×
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
