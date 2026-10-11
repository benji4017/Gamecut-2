import React from 'react';
import { useRallyCut } from '../../context/RallyCutContext';

export const MomentumGraph: React.FC = () => {
  const { analytics, seekToRally, player1, player2, activeRally } = useRallyCut();
  const timeline = analytics.momentumTimeline;

  if (timeline.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 font-mono text-xs">
        No rally points recorded yet.
      </div>
    );
  }

  // Geometry
  const width = 800;
  const height = 240;
  const padding = { top: 30, right: 30, bottom: 40, left: 50 };

  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  // Differential scale
  const diffs = timeline.map((t) => t.differential);
  const maxDiff = Math.max(3, ...diffs.map((d) => Math.abs(d)));

  const getY = (diff: number) => {
    // 0 is centered at innerH / 2
    const norm = diff / maxDiff; // -1 to +1
    return padding.top + innerH / 2 - norm * (innerH / 2);
  };

  const getX = (idx: number) => {
    if (timeline.length <= 1) return padding.left + innerW / 2;
    return padding.left + (idx / (timeline.length - 1)) * innerW;
  };

  const zeroY = getY(0);

  // Build SVG path
  const points = timeline.map((t, i) => `${getX(i)},${getY(t.differential)}`);
  const pathD = `M ${points.join(' L ')}`;

  return (
    <div className="w-full bg-slate-900/80 rounded-xl border border-slate-800 p-4 shadow-xl">
      <div className="flex items-center justify-between mb-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white tracking-wide">Match Momentum & Score Differential</span>
          <span className="text-[11px] font-mono text-slate-400">
            (P1 lead ↑ / P2 lead ↓ · Click any node to jump to video)
          </span>
        </div>
        <div className="flex items-center gap-4 font-mono text-xs">
          <span className="flex items-center gap-1.5 text-[#00F5D4]">
            <span className="w-2.5 h-2 rounded bg-[#00F5D4]" />
            {player1.name} (+)
          </span>
          <span className="flex items-center gap-1.5 text-[#3B82F6]">
            <span className="w-2.5 h-2 rounded bg-[#3B82F6]" />
            {player2.name} (-)
          </span>
        </div>
      </div>

      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[600px] select-none"
        >
          {/* Zero Neutral Line */}
          <line
            x1={padding.left}
            y1={zeroY}
            x2={width - padding.right}
            y2={zeroY}
            stroke="#475569"
            strokeDasharray="4 4"
            strokeWidth="1.5"
          />
          <text
            x={padding.left - 12}
            y={zeroY + 4}
            textAnchor="end"
            className="fill-slate-500 font-mono text-[10px]"
          >
            TIE (0)
          </text>

          {/* +Max Diff Line */}
          <line
            x1={padding.left}
            y1={getY(maxDiff)}
            x2={width - padding.right}
            y2={getY(maxDiff)}
            stroke="#334155"
            strokeWidth="0.5"
          />
          <text
            x={padding.left - 12}
            y={getY(maxDiff) + 4}
            textAnchor="end"
            className="fill-[#00F5D4] font-mono text-[10px]"
          >
            +{maxDiff}
          </text>

          {/* -Max Diff Line */}
          <line
            x1={padding.left}
            y1={getY(-maxDiff)}
            x2={width - padding.right}
            y2={getY(-maxDiff)}
            stroke="#334155"
            strokeWidth="0.5"
          />
          <text
            x={padding.left - 12}
            y={getY(-maxDiff) + 4}
            textAnchor="end"
            className="fill-[#3B82F6] font-mono text-[10px]"
          >
            -{maxDiff}
          </text>

          {/* Momentum Line */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#momentumGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Gradient Definition */}
          <defs>
            <linearGradient id="momentumGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00F5D4" />
              <stop offset="50%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>

          {/* Nodes */}
          {timeline.map((point, i) => {
            const cx = getX(i);
            const cy = getY(point.differential);
            const isP1 = point.winner === 1;
            const isSelected = activeRally?.id === point.rallyId;

            return (
              <g
                key={point.rallyId}
                onClick={() => seekToRally(point.rallyId)}
                className="cursor-pointer group"
              >
                {/* Outer ring on hover/selected */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelected ? 8 : 6}
                  fill={isP1 ? '#00F5D4' : '#3B82F6'}
                  className="transition-all group-hover:r-8 group-hover:brightness-125"
                />
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelected ? 4 : 2}
                  fill="#0B0F17"
                />

                {/* Score label on hover or big point */}
                {point.isGamePoint && (
                  <text
                    x={cx}
                    y={cy - 12}
                    textAnchor="middle"
                    className="fill-[#CCFF00] font-mono font-bold text-[9px]"
                  >
                    GP
                  </text>
                )}

                {/* X axis point index */}
                <text
                  x={cx}
                  y={height - 12}
                  textAnchor="middle"
                  className="fill-slate-500 font-mono text-[9px] group-hover:fill-white"
                >
                  #{point.rallyIndex}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
