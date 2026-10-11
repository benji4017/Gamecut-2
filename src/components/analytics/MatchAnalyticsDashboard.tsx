import React from 'react';
import { useRallyCut } from '../../context/RallyCutContext';
import { MomentumGraph } from './MomentumGraph';
import {
  Trophy,
  Zap,
  Flame,
  Clock,
  TrendingUp,
  Activity,
  CheckCircle2,
} from 'lucide-react';

export const MatchAnalyticsDashboard: React.FC = () => {
  const { analytics, player1, player2 } = useRallyCut();
  const { p1Stats, p2Stats, rallyLengthDistribution, gamesSummary } = analytics;

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2">
      {/* Top Headline Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: Dead Time Cut */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>DEAD TIME ELIMINATED</span>
            <Zap className="w-4 h-4 text-[#00F5D4]" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-[#00F5D4] tabular-nums">
            {analytics.deadTimePercent}%
          </div>
          <div className="text-xs font-mono text-slate-400 mt-1">
            {analytics.deadTimeSavedSecs}s cut from match
          </div>
        </div>

        {/* Card 2: Active Rallies */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>ACTIVE RALLIES</span>
            <Activity className="w-4 h-4 text-[#CCFF00]" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white tabular-nums">
            {analytics.activeRalliesCount}
          </div>
          <div className="text-xs font-mono text-slate-400 mt-1">
            {analytics.activePlayDurationSecs}s pure action
          </div>
        </div>

        {/* Card 3: Avg Rally Length */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>AVG SHOTS / RALLY</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-purple-300 tabular-nums">
            {analytics.avgRallyLengthShots}
          </div>
          <div className="text-xs font-mono text-slate-400 mt-1">
            Max rally: {analytics.maxRallyLengthShots} shots
          </div>
        </div>

        {/* Card 4: Match Leader */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>POINTS LEADER</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-white truncate">
            {p1Stats.pointsWon >= p2Stats.pointsWon ? player1.name : player2.name}
          </div>
          <div className="text-xs font-mono text-slate-400 mt-1">
            {Math.max(p1Stats.pointsWon, p2Stats.pointsWon)} vs {Math.min(p1Stats.pointsWon, p2Stats.pointsWon)} points
          </div>
        </div>
      </div>

      {/* Head-to-Head Tactical Comparison */}
      <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-6 shadow-xl">
        <h3 className="text-base font-bold text-white mb-6 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00F5D4]" />
            Player Head-to-Head Tactical Metrics
          </span>
          <span className="text-xs font-mono text-slate-400">Official ITTF Rule Computation</span>
        </h3>

        {/* Comparison Header */}
        <div className="grid grid-cols-3 text-center font-mono text-xs border-b border-slate-800 pb-3 mb-4">
          <div className="text-left font-bold text-[#00F5D4] text-sm">
            {player1.name}
            <div className="text-[11px] text-slate-500 font-normal">{player1.style}</div>
          </div>
          <div className="text-slate-400 uppercase tracking-wider text-[11px]">Metric</div>
          <div className="text-right font-bold text-[#3B82F6] text-sm">
            {player2.name}
            <div className="text-[11px] text-slate-500 font-normal">{player2.style}</div>
          </div>
        </div>

        {/* Metric Rows */}
        <div className="space-y-4">
          {/* Total Points */}
          <ComparisonRow
            label="Total Points Won"
            val1={p1Stats.pointsWon}
            val2={p2Stats.pointsWon}
            unit=""
          />

          {/* Serve Effectiveness */}
          <ComparisonRow
            label="Serve Win Rate"
            val1={p1Stats.serveWinPct}
            val2={p2Stats.serveWinPct}
            unit="%"
            bar
          />

          {/* Receive Effectiveness */}
          <ComparisonRow
            label="Receive Win Rate"
            val1={p1Stats.receiveWinPct}
            val2={p2Stats.receiveWinPct}
            unit="%"
            bar
          />

          {/* 3rd-Ball Attack Conversion */}
          <ComparisonRow
            label="3rd-Ball Attack Conversion"
            val1={p1Stats.thirdBallConversionPct}
            val2={p2Stats.thirdBallConversionPct}
            unit="%"
            bar
          />

          {/* Clean Winners */}
          <ComparisonRow
            label="Clean Winners"
            val1={p1Stats.winners}
            val2={p2Stats.winners}
            unit=""
          />

          {/* Unforced Errors */}
          <ComparisonRow
            label="Unforced Errors (Lower is better)"
            val1={p1Stats.unforcedErrors}
            val2={p2Stats.unforcedErrors}
            unit=""
            invertBetter
          />

          {/* Forehand Loops */}
          <ComparisonRow
            label="Forehand Loop Winners"
            val1={p1Stats.forehandLoops}
            val2={p2Stats.forehandLoops}
            unit=""
          />

          {/* Backhand Loops */}
          <ComparisonRow
            label="Backhand Loop Winners"
            val1={p1Stats.backhandLoops}
            val2={p2Stats.backhandLoops}
            unit=""
          />
        </div>
      </div>

      {/* Momentum Differential Graph */}
      <MomentumGraph />

      {/* Rally Length Distribution & Games Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Distribution */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#00F5D4]" />
            Rally Length Distribution
          </h4>
          <div className="space-y-3 font-mono text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Short (1–3 shots / Serve & 3rd ball)</span>
                <span className="font-bold">{rallyLengthDistribution.short} rallies</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  style={{
                    width: `${(rallyLengthDistribution.short / Math.max(1, analytics.activeRalliesCount)) * 100}%`,
                  }}
                  className="h-full bg-[#CCFF00]"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Medium (4–7 shots / Transition rallies)</span>
                <span className="font-bold">{rallyLengthDistribution.medium} rallies</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  style={{
                    width: `${(rallyLengthDistribution.medium / Math.max(1, analytics.activeRalliesCount)) * 100}%`,
                  }}
                  className="h-full bg-[#00F5D4]"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Long (8+ shots / Topspin counter duels)</span>
                <span className="font-bold">{rallyLengthDistribution.long} rallies</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  style={{
                    width: `${(rallyLengthDistribution.long / Math.max(1, analytics.activeRalliesCount)) * 100}%`,
                  }}
                  className="h-full bg-[#FF6B35]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Game summary */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            Games Progression Summary
          </h4>
          {gamesSummary.length === 0 ? (
            <div className="text-xs font-mono text-slate-500 py-4">
              Game in progress... (Game 1 current)
            </div>
          ) : (
            <div className="space-y-2 font-mono text-xs">
              {gamesSummary.map((g) => (
                <div
                  key={g.gameNumber}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800"
                >
                  <span className="font-bold text-white">Game {g.gameNumber}</span>
                  <div className="flex items-center gap-3">
                    <span className={g.winner === 1 ? 'text-[#00F5D4] font-bold' : 'text-slate-400'}>
                      {g.scoreP1}
                    </span>
                    <span className="text-slate-600">-</span>
                    <span className={g.winner === 2 ? 'text-[#3B82F6] font-bold' : 'text-slate-400'}>
                      {g.scoreP2}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Won by {g.winner === 1 ? (player1.name.toLowerCase().startsWith('player') ? player1.name : player1.name.split(' ')[0]) : (player2.name.toLowerCase().startsWith('player') ? player2.name : player2.name.split(' ')[0])}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ComparisonRow: React.FC<{
  label: string;
  val1: number;
  val2: number;
  unit: string;
  bar?: boolean;
  invertBetter?: boolean;
}> = ({ label, val1, val2, unit, bar, invertBetter }) => {
  const isP1Better = invertBetter ? val1 < val2 : val1 > val2;
  const isP2Better = invertBetter ? val2 < val1 : val2 > val1;

  return (
    <div className="space-y-1">
      <div className="grid grid-cols-3 items-center text-xs font-mono">
        {/* Player 1 Value */}
        <div className={`text-left font-bold tabular-nums ${isP1Better ? 'text-[#00F5D4]' : 'text-slate-400'}`}>
          {val1}{unit}
        </div>

        {/* Metric Label */}
        <div className="text-center text-slate-300 text-[11px] truncate">
          {label}
        </div>

        {/* Player 2 Value */}
        <div className={`text-right font-bold tabular-nums ${isP2Better ? 'text-[#3B82F6]' : 'text-slate-400'}`}>
          {val2}{unit}
        </div>
      </div>

      {/* Optional Proportional Bar */}
      {bar && (
        <div className="grid grid-cols-2 gap-1 h-1.5 bg-slate-950 rounded-full overflow-hidden">
          <div className="flex justify-end">
            <div
              style={{ width: `${Math.min(100, val1)}%` }}
              className="h-full bg-[#00F5D4] rounded-l-full"
            />
          </div>
          <div className="flex justify-start">
            <div
              style={{ width: `${Math.min(100, val2)}%` }}
              className="h-full bg-[#3B82F6] rounded-r-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};
