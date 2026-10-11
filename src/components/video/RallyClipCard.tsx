import React from 'react';
import { EndingStroke, RallyInterval } from '../../types';
import { useRallyCut } from '../../context/RallyCutContext';
import { formatClockTime } from '../../services/analyticsService';
import {
  Play,
  Scissors,
  Check,
  EyeOff,
  Eye,
  Plus,
  Minus,
  Sparkles,
  RotateCcw,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

interface RallyClipCardProps {
  rally: RallyInterval;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

const STROKE_OPTIONS: { id: EndingStroke; label: string }[] = [
  { id: 'forehand_loop', label: 'Forehand Loop' },
  { id: 'backhand_loop', label: 'Backhand Loop' },
  { id: 'counter_drive', label: 'Counter Drive' },
  { id: 'smash', label: 'Smash' },
  { id: 'chop', label: 'Chop' },
  { id: 'push', label: 'Push' },
  { id: 'flick', label: 'Flick / Banana' },
  { id: 'block', label: 'Block' },
  { id: 'serve_ace', label: 'Ace Serve' },
];

export const RallyClipCard: React.FC<RallyClipCardProps> = ({
  rally,
  onMoveUp,
  onMoveDown,
}) => {
  const {
    activeRally,
    seekToRally,
    adjustRallyBoundary,
    overrideRallyWinner,
    toggleExcludeRally,
    updateRally,
    triggerReplay,
    player1,
    player2,
  } = useRallyCut();

  const isActive = activeRally?.id === rally.id;
  const duration = Math.max(0, rally.endTime - rally.startTime);

  return (
    <div
      className={`p-4 rounded-xl border transition-all ${
        rally.excluded
          ? 'bg-slate-950/40 border-slate-900 opacity-60'
          : isActive
          ? 'bg-slate-900/90 border-[#00F5D4] shadow-lg shadow-[#00F5D4]/10'
          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
      }`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => seekToRally(rally.id)}
              className="w-7 h-7 rounded-lg bg-[#00F5D4]/15 hover:bg-[#00F5D4] text-[#00F5D4] hover:text-slate-950 flex items-center justify-center transition-all group"
              title="Seek and play this rally"
            >
              <Play className="w-3.5 h-3.5 fill-current ml-0.5 group-hover:scale-110" />
            </button>

            <button
              onClick={() => triggerReplay(rally.id)}
              className="w-7 h-7 rounded-lg bg-orange-500/15 hover:bg-orange-500 text-orange-400 hover:text-slate-950 border border-orange-500/30 flex items-center justify-center transition-all group"
              title="Replay Point"
            >
              <RotateCcw className="w-3.5 h-3.5 group-hover:-rotate-45 transition-transform" />
            </button>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-white">
                Rally #{rally.index.toString().padStart(2, '0')}
              </span>
              {(onMoveUp || onMoveDown) && (
                <div className="flex items-center gap-0.5 bg-slate-800/80 rounded p-0.5 border border-slate-700/60">
                  <button
                    disabled={!onMoveUp}
                    onClick={onMoveUp}
                    className="p-0.5 rounded hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-20 disabled:hover:bg-transparent transition-colors"
                    title="Move rally earlier in reel"
                    aria-label="Move rally up"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    disabled={!onMoveDown}
                    onClick={onMoveDown}
                    className="p-0.5 rounded hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-20 disabled:hover:bg-transparent transition-colors"
                    title="Move rally later in reel"
                    aria-label="Move rally down"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                </div>
              )}
              <span className="text-xs text-slate-400 font-mono">
                Game {rally.gameNumber}
              </span>
              {rally.isThirdBallAttack && (
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#CCFF00]/15 text-[#CCFF00] border border-[#CCFF00]/30 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  3rd Ball
                </span>
              )}
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              {formatClockTime(rally.startTime)} → {formatClockTime(rally.endTime)} (
              {duration.toFixed(1)}s) · {rally.shotCount} shots
            </div>
          </div>
        </div>

        {/* Exclude Toggle & Score Preview */}
        <div className="flex items-center gap-2">
          <div className="text-right font-mono text-xs">
            <span className="text-[#00F5D4] font-bold">{rally.scoreP1}</span>
            <span className="text-slate-600 mx-1">-</span>
            <span className="text-[#3B82F6] font-bold">{rally.scoreP2}</span>
          </div>

          <button
            onClick={() => toggleExcludeRally(rally.id)}
            className={`p-1.5 rounded-lg border text-xs transition-colors ${
              rally.excluded
                ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title={rally.excluded ? 'Restore to highlight reel' : 'Exclude from reel'}
          >
            {rally.excluded ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Controls Grid (Winner & Fine-Tune Trimming) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800/80 text-xs">
        {/* Column 1: Winner & Server */}
        <div className="space-y-1.5">
          <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between">
            <span>Point Winner:</span>
            <span className="text-slate-500 text-[10px]">Server: {rally.server === 1 ? player1.name : player2.name}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => overrideRallyWinner(rally.id, 1)}
              className={`flex-1 py-1.5 px-2.5 rounded-lg font-semibold text-center border transition-all ${
                rally.winner === 1
                  ? 'bg-[#00F5D4]/20 border-[#00F5D4] text-[#00F5D4] shadow-sm'
                  : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              {player1.name.toLowerCase().startsWith('player') ? player1.name : player1.name.split(' ')[0]} {rally.winner === 1 && '✓'}
            </button>
            <button
              onClick={() => overrideRallyWinner(rally.id, 2)}
              className={`flex-1 py-1.5 px-2.5 rounded-lg font-semibold text-center border transition-all ${
                rally.winner === 2
                  ? 'bg-[#3B82F6]/20 border-[#3B82F6] text-[#3B82F6] shadow-sm'
                  : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              {player2.name.toLowerCase().startsWith('player') ? player2.name : player2.name.split(' ')[0]} {rally.winner === 2 && '✓'}
            </button>
          </div>
        </div>

        {/* Column 2: Fine-Tune Trimming */}
        <div className="space-y-1.5">
          <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between">
            <span>Trim Start:</span>
            <span>Trim End:</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Start Trim */}
            <div className="flex items-center gap-0.5 flex-1 bg-slate-800/80 rounded-lg p-0.5 border border-slate-700/80">
              <button
                onClick={() => adjustRallyBoundary(rally.id, -0.5, 0)}
                className="p-1 hover:bg-slate-700 text-slate-400 hover:text-white rounded"
                title="Start 0.5s earlier"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="flex-1 text-center font-mono text-[10px] text-slate-300">
                {rally.startTime.toFixed(1)}s
              </span>
              <button
                onClick={() => adjustRallyBoundary(rally.id, 0.5, 0)}
                className="p-1 hover:bg-slate-700 text-slate-400 hover:text-white rounded"
                title="Start 0.5s later"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            {/* End Trim */}
            <div className="flex items-center gap-0.5 flex-1 bg-slate-800/80 rounded-lg p-0.5 border border-slate-700/80">
              <button
                onClick={() => adjustRallyBoundary(rally.id, 0, -0.5)}
                className="p-1 hover:bg-slate-700 text-slate-400 hover:text-white rounded"
                title="End 0.5s earlier"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="flex-1 text-center font-mono text-[10px] text-slate-300">
                {rally.endTime.toFixed(1)}s
              </span>
              <button
                onClick={() => adjustRallyBoundary(rally.id, 0, 0.5)}
                className="p-1 hover:bg-slate-700 text-slate-400 hover:text-white rounded"
                title="End 0.5s later"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Optional Tactical Note */}
      {rally.notes && (
        <div className="mt-2.5 pt-2 border-t border-slate-800/60 text-[11px] text-slate-400 font-mono italic">
          "{rally.notes}"
        </div>
      )}
    </div>
  );
};
