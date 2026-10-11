import React from 'react';
import { FilterPreset } from '../../types';
import { useRallyCut } from '../../context/RallyCutContext';
import { Filter } from 'lucide-react';

export const RallyFilterBar: React.FC = () => {
  const { filterPreset, setFilterPreset, rallies } = useRallyCut();

  const activeRallies = rallies.filter((r) => !r.excluded);

  const filters: { id: FilterPreset; label: string; count: number }[] = [
    { id: 'all', label: 'All Points', count: activeRallies.length },
    {
      id: 'best',
      label: 'Best Points (8+ shots)',
      count: activeRallies.filter((r) => r.shotCount >= 8 || r.endingType === 'winner').length,
    },
    {
      id: 'third_ball',
      label: '3rd-Ball Attacks',
      count: activeRallies.filter((r) => r.isThirdBallAttack).length,
    },
    {
      id: 'game_points',
      label: 'Big / Game Points',
      count: activeRallies.filter((r) => r.isGamePoint || r.isMatchPoint).length,
    },
    {
      id: 'fh_loops',
      label: 'Forehand Loops',
      count: activeRallies.filter((r) => r.endingStroke === 'forehand_loop').length,
    },
    {
      id: 'bh_loops',
      label: 'Backhand Loops',
      count: activeRallies.filter((r) => r.endingStroke === 'backhand_loop').length,
    },
    {
      id: 'winners',
      label: 'Winners Only',
      count: activeRallies.filter((r) => r.endingType === 'winner').length,
    },
    {
      id: 'errors',
      label: 'Errors',
      count: activeRallies.filter((r) => r.endingType === 'unforced_error' || r.endingType === 'forced_error').length,
    },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar">
      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono shrink-0 pr-2 border-r border-slate-800">
        <Filter className="w-3.5 h-3.5 text-[#00F5D4]" />
        <span>Filter Reel:</span>
      </div>

      <div className="flex items-center gap-1.5">
        {filters.map((f) => {
          const isActive = filterPreset === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setFilterPreset(f.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                isActive
                  ? 'bg-[#00F5D4] text-slate-950 shadow-md shadow-[#00F5D4]/20 font-bold'
                  : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <span>{f.label}</span>
              <span
                className={`font-mono text-[10px] px-1.5 py-0.2 rounded ${
                  isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {f.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
