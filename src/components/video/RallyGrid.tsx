import React, { useState, useMemo } from 'react';
import { RallyInterval, PlayerInfo } from '../../types';
import { RallyThumbnailCard } from './RallyThumbnailCard';
import { RallyPreviewModal } from './RallyPreviewModal';
import {
  Filter,
  ArrowUpDown,
  Search,
  Sparkles,
  Zap,
  Flame,
  Award,
  Clock,
  Activity,
  Layers,
} from 'lucide-react';

interface RallyGridProps {
  rallies: RallyInterval[];
  player1: PlayerInfo;
  player2: PlayerInfo;
  videoFile: File | null;
  videoUrl: string;
  onSeekToRally: (rallyId: string) => void;
  onOpenInEditor: (rallyId: string) => void;
}

type FilterCategory = 'all' | 'third_ball' | 'winners' | 'extended' | 'p1' | 'p2';
type SortOption = 'chronological' | 'duration' | 'shots' | 'recent';

export const RallyGrid: React.FC<RallyGridProps> = ({
  rallies,
  player1,
  player2,
  onSeekToRally,
  onOpenInEditor,
  videoFile,
  videoUrl,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('all');
  const [sortOption, setSortOption] = useState<SortOption>('chronological');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewRally, setPreviewRally] = useState<RallyInterval | null>(null);

  // Category counts
  const counts = useMemo(() => {
    return {
      all: rallies.length,
      third_ball: rallies.filter((r) => r.isThirdBallAttack).length,
      winners: rallies.filter((r) => r.endingType === 'winner').length,
      extended: rallies.filter((r) => r.shotCount >= 6).length,
      p1: rallies.filter((r) => r.winner === 1).length,
      p2: rallies.filter((r) => r.winner === 2).length,
    };
  }, [rallies]);

  // Filter & sort logic
  const filteredAndSortedRallies = useMemo(() => {
    let result = [...rallies];

    // Filter by category
    if (selectedCategory === 'third_ball') {
      result = result.filter((r) => r.isThirdBallAttack);
    } else if (selectedCategory === 'winners') {
      result = result.filter((r) => r.endingType === 'winner');
    } else if (selectedCategory === 'extended') {
      result = result.filter((r) => r.shotCount >= 6);
    } else if (selectedCategory === 'p1') {
      result = result.filter((r) => r.winner === 1);
    } else if (selectedCategory === 'p2') {
      result = result.filter((r) => r.winner === 2);
    }

    // Filter by search query (stroke, notes, or index)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.endingStroke.toLowerCase().includes(q) ||
          (r.notes && r.notes.toLowerCase().includes(q)) ||
          r.index.toString() === q ||
          `#${r.index}` === q
      );
    }

    // Sort
    if (sortOption === 'duration') {
      result.sort((a, b) => (b.endTime - b.startTime) - (a.endTime - a.startTime));
    } else if (sortOption === 'shots') {
      result.sort((a, b) => b.shotCount - a.shotCount);
    } else if (sortOption === 'recent') {
      result.sort((a, b) => b.index - a.index);
    } else {
      // Chronological
      result.sort((a, b) => a.index - b.index);
    }

    return result;
  }, [rallies, selectedCategory, searchQuery, sortOption]);

  // Summary statistics for current view
  const summary = useMemo(() => {
    const totalSecs = filteredAndSortedRallies.reduce(
      (sum, r) => sum + Math.max(0, r.endTime - r.startTime),
      0
    );
    const avgShots = filteredAndSortedRallies.length
      ? (
          filteredAndSortedRallies.reduce((sum, r) => sum + r.shotCount, 0) /
          filteredAndSortedRallies.length
        ).toFixed(1)
      : '0.0';

    return {
      count: filteredAndSortedRallies.length,
      totalSecs: totalSecs.toFixed(1),
      avgShots,
    };
  }, [filteredAndSortedRallies]);

  const handleCardClick = (rally: RallyInterval) => {
    setPreviewRally(rally);
    onSeekToRally(rally.id);
  };

  const handleEditorTransfer = (rally: RallyInterval) => {
    onSeekToRally(rally.id);
    onOpenInEditor(rally.id);
  };

  return (
    <div className="space-y-6">
      {/* Grid Controls Header: Filter Chips & Search */}
      <div className="space-y-4">
        {/* Top Control Bar: Category Filter Chips */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Category: All */}
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 border ${
                selectedCategory === 'all'
                  ? 'bg-[#00F5D4] text-slate-950 font-bold border-[#00F5D4] shadow-md shadow-[#00F5D4]/20'
                  : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All Rallies</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                selectedCategory === 'all' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}>
                {counts.all}
              </span>
            </button>

            {/* Category: 3rd-Ball Attacks */}
            <button
              onClick={() => setSelectedCategory('third_ball')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 border ${
                selectedCategory === 'third_ball'
                  ? 'bg-[#A3E635] text-slate-950 font-bold border-[#A3E635] shadow-md shadow-[#A3E635]/20'
                  : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>3rd-Ball Attacks</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                selectedCategory === 'third_ball' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}>
                {counts.third_ball}
              </span>
            </button>

            {/* Category: Winners */}
            <button
              onClick={() => setSelectedCategory('winners')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 border ${
                selectedCategory === 'winners'
                  ? 'bg-amber-400 text-slate-950 font-bold border-amber-400 shadow-md shadow-amber-400/20'
                  : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Decisive Winners</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                selectedCategory === 'winners' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}>
                {counts.winners}
              </span>
            </button>

            {/* Category: Extended Duels */}
            <button
              onClick={() => setSelectedCategory('extended')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 border ${
                selectedCategory === 'extended'
                  ? 'bg-rose-500 text-white font-bold border-rose-500 shadow-md shadow-rose-500/20'
                  : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Extended Duels (6+ shots)</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                selectedCategory === 'extended' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {counts.extended}
              </span>
            </button>

            {/* Category: P1 Victories */}
            <button
              onClick={() => setSelectedCategory('p1')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 border ${
                selectedCategory === 'p1'
                  ? 'bg-[#00F5D4] text-slate-950 font-bold border-[#00F5D4] shadow-md shadow-[#00F5D4]/20'
                  : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#00F5D4]" />
              <span>{player1.name.toLowerCase().startsWith('player') ? player1.name : player1.name.split(' ')[0]} Won</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                selectedCategory === 'p1' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}>
                {counts.p1}
              </span>
            </button>

            {/* Category: P2 Victories */}
            <button
              onClick={() => setSelectedCategory('p2')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 border ${
                selectedCategory === 'p2'
                  ? 'bg-blue-500 text-white font-bold border-blue-500 shadow-md shadow-blue-500/20'
                  : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>{player2.name.toLowerCase().startsWith('player') ? player2.name : player2.name.split(' ')[0]} Won</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                selectedCategory === 'p2' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {counts.p2}
              </span>
            </button>
          </div>

          {/* Right: Search & Sort Tools */}
          <div className="flex items-center gap-2">
            {/* Search Box */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search stroke..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00F5D4] w-36 sm:w-44"
              />
            </div>

            {/* Sort Select */}
            <div className="relative flex items-center">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="appearance-none pl-7 pr-7 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 focus:outline-none focus:border-[#00F5D4] cursor-pointer"
              >
                <option value="chronological">Chronological</option>
                <option value="duration">Longest Duration</option>
                <option value="shots">Most Shots</option>
                <option value="recent">Latest First</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Quiet Unboxed Telemetry Line (Zero-Pill Discipline) */}
        <div className="flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 pt-1 pb-1 border-b border-slate-850">
          <div className="flex items-center gap-2">
            <span>Showing</span>
            <span className="text-white font-bold tabular-nums">{summary.count}</span>
            <span>of</span>
            <span className="text-slate-300 font-bold tabular-nums">{rallies.length}</span>
            <span>detected rallies</span>
            <span className="text-slate-700">·</span>
            <span>Active Play:</span>
            <span className="text-[#00F5D4] font-bold tabular-nums">{summary.totalSecs}s</span>
            <span className="text-slate-700">·</span>
            <span>Avg Exchange:</span>
            <span className="text-[#A3E635] font-bold tabular-nums">{summary.avgShots} shots</span>
          </div>

          <div className="text-[11px] text-slate-500 hidden sm:block">
            Click any card for instant video replay and AI metrics HUD
          </div>
        </div>
      </div>

      {/* Responsive Rally Cards Grid */}
      {filteredAndSortedRallies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredAndSortedRallies.map((rally) => (
            <RallyThumbnailCard
              key={rally.id}
              rally={rally}
              player1={player1}
              player2={player2}
              videoFile={videoFile}
              videoUrl={videoUrl}
              onClick={handleCardClick}
              onOpenInEditor={handleEditorTransfer}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-16 text-center space-y-3 bg-slate-900/40 rounded-2xl border border-slate-800">
          <div className="w-12 h-12 rounded-xl bg-slate-800/80 text-slate-400 flex items-center justify-center mx-auto">
            <Filter className="w-6 h-6" />
          </div>
          <div className="text-sm font-bold text-white">No matching rallies found</div>
          <p className="text-xs text-slate-400 max-w-sm mx-auto font-mono">
            Try switching filter categories or clearing the search keyword.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="px-4 py-1.5 rounded-lg bg-[#00F5D4] text-slate-950 font-bold text-xs hover:brightness-110 transition-all"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Interactive Rally Preview Modal */}
      {previewRally && (
        <RallyPreviewModal
          rally={previewRally}
          ralliesList={filteredAndSortedRallies}
          player1={player1}
          player2={player2}
          videoUrl={videoUrl}
          videoFile={videoFile}
          onClose={() => setPreviewRally(null)}
          onSelectRally={(r) => {
            setPreviewRally(r);
            onSeekToRally(r.id);
          }}
          onOpenInEditor={(r) => {
            setPreviewRally(null);
            handleEditorTransfer(r);
          }}
        />
      )}
    </div>
  );
};
