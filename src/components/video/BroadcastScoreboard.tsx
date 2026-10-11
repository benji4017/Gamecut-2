import React from 'react';
import { useRallyCut } from '../../context/RallyCutContext';

interface BroadcastScoreboardProps {
  position?: 'top-left' | 'bottom-left' | 'bottom-center';
  className?: string;
}

export const BroadcastScoreboard: React.FC<BroadcastScoreboardProps> = ({
  position = 'top-left',
  className = '',
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

  // Find the most recent rally at or before current time if not currently active
  const displayRally =
    activeRally ||
    [...rallies]
      .reverse()
      .find((r) => !r.excluded && currentTime >= r.startTime) ||
    rallies[0];

  if (!displayRally) return null;

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'bottom-left': 'bottom-16 left-4',
    'bottom-center': 'bottom-16 left-1/2 -translate-x-1/2',
  }[position];

  const strokeLabel = displayRally.endingStroke.replace('_', ' ').toUpperCase();
  const isCurrentlyInPlay = !!activeRally;

  return (
    <div
      className={`absolute ${positionClasses} z-30 pointer-events-none select-none transition-all duration-200 ${className}`}
    >
      <div className="bg-[#0B0F17]/92 backdrop-blur-md border border-white/15 rounded-xl shadow-2xl shadow-black/90 overflow-hidden flex flex-col min-w-[310px] max-w-[360px]">
        {/* Tournament Bar & Replay Tag */}
        <div className="flex items-center justify-between px-3 py-1 bg-slate-900/95 border-b border-white/10 text-[10px] font-mono tracking-wider">
          <span className="text-slate-300 font-bold flex items-center gap-1.5 truncate max-w-[180px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F5D4]" />
            {branding.eventTitle}
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            {replayState.isActive ? (
              <span className="text-[#FF6B35] font-extrabold animate-pulse bg-[#FF6B35]/20 px-1.5 py-0.2 rounded border border-[#FF6B35]/40">
                ● REPLAY {replayState.slowMoSpeed}x
              </span>
            ) : displayRally.isMatchPoint ? (
              <span className="text-[#CCFF00] font-bold animate-pulse">MATCH POINT</span>
            ) : displayRally.isGamePoint ? (
              <span className="text-[#FF6B35] font-bold">GAME POINT</span>
            ) : (
              <span className="text-slate-400">G{displayRally.gameNumber}</span>
            )}
            <span className="text-slate-600">|</span>
            <span className={isCurrentlyInPlay ? 'text-[#00F5D4] font-bold' : 'text-slate-500'}>
              {isCurrentlyInPlay ? 'IN PLAY' : 'PAUSED'}
            </span>
          </div>
        </div>

        {/* Players & Scores with Club Badges */}
        <div className="px-3.5 py-2.5 space-y-2">
          {/* Player 1 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base" title={branding.p1Club.name}>
                {branding.p1Club.badgeEmoji}
              </span>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-white tracking-wide">
                    {player1.name}
                  </span>
                  {displayRally.server === 1 && (
                    <span className="text-xs" title="Serving">🏓</span>
                  )}
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  {branding.p1Club.name} · <span className="text-slate-300">{branding.p1Club.brand}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-slate-400">
                ({displayRally.gamesWonP1})
              </span>
              <span className="font-mono font-bold text-xl text-[#00F5D4] min-w-[24px] text-right tabular-nums">
                {displayRally.scoreP1}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/10" />

          {/* Player 2 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base" title={branding.p2Club.name}>
                {branding.p2Club.badgeEmoji}
              </span>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-slate-200 tracking-wide">
                    {player2.name}
                  </span>
                  {displayRally.server === 2 && (
                    <span className="text-xs" title="Serving">🏓</span>
                  )}
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  {branding.p2Club.name} · <span className="text-slate-300">{branding.p2Club.brand}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-slate-400">
                ({displayRally.gamesWonP2})
              </span>
              <span className="font-mono font-bold text-xl text-[#3B82F6] min-w-[24px] text-right tabular-nums">
                {displayRally.scoreP2}
              </span>
            </div>
          </div>
        </div>

        {/* Live Rally Action Tag & Sponsor Watermark */}
        <div className="px-3 py-1.5 bg-black/50 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-300">
          <span className="text-[#00F5D4] truncate font-semibold">
            {strokeLabel}
          </span>
          <span className="text-slate-400 shrink-0 ml-2">
            {displayRally.shotCount} SHOTS {displayRally.isThirdBallAttack ? '· 3RD BALL' : ''}
          </span>
        </div>
      </div>
    </div>
  );
};
