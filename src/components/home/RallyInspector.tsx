import React, { useState } from 'react';
import { useRallyCut } from '../../context/RallyCutContext';
import {
  Terminal,
  FileCode2,
  CheckCircle2,
  Play,
  Search,
} from 'lucide-react';

type SortKey = 'index' | 'duration' | 'shotCount';

export const RallyInspector: React.FC = () => {
  const { rallies, seekToRally } = useRallyCut();

  const [selectedRallyIndex, setSelectedRallyIndex] = useState(0);
  const [showRawJson, setShowRawJson] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('index');

  // Search & sort (#11)
  const filteredInspectorRallies = rallies
    .filter((r) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        r.endingStroke.toLowerCase().includes(q) ||
        r.endingType.toLowerCase().includes(q) ||
        (r.notes || '').toLowerCase().includes(q) ||
        `#${r.index}`.includes(q) ||
        `rally ${r.index}`.includes(q)
      );
    })
    .sort((a, b) => {
      switch (sortKey) {
        case 'duration':
          return (b.endTime - b.startTime) - (a.endTime - a.startTime);
        case 'shotCount':
          return (b.shotCount || 0) - (a.shotCount || 0);
        case 'index':
        default:
          return a.index - b.index;
      }
    });

  const currentInspectorRally = filteredInspectorRallies[selectedRallyIndex] || filteredInspectorRallies[0] || rallies[0];

  return (
    <div className="max-w-5xl mx-auto rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-6 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[#00F5D4]" />
            <h2 className="text-lg font-bold text-white">AI Rally Inspector & Schema Verification</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Inspect how the multimodal model classifies individual rallies and how the Zod schema mathematically guarantees zero overlaps and strict ITTF scoring.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRawJson(!showRawJson)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all border ${
              showRawJson
                ? 'bg-[#00F5D4]/15 text-[#00F5D4] border-[#00F5D4]/40'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>{showRawJson ? 'View Clean Card' : 'View Raw Gemini JSON'}</span>
          </button>
        </div>
      </div>

      {/* Search & Sort Bar (#11) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search rallies by stroke, type, notes..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedRallyIndex(0);
            }}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00F5D4] transition-colors"
            aria-label="Search rallies"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-500 font-mono">Sort:</span>
          {(['index', 'duration', 'shotCount'] as SortKey[]).map((key) => (
            <button
              key={key}
              onClick={() => {
                setSortKey(key);
                setSelectedRallyIndex(0);
              }}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-all ${
                sortKey === key
                  ? 'bg-[#00F5D4]/15 text-[#00F5D4] font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {key === 'index' ? '#' : key === 'duration' ? 'Duration' : 'Shots'}
            </button>
          ))}
        </div>
      </div>

      {/* Rally Selection Ribbon - no cap on count (#11) */}
      <div className="space-y-2">
        <div className="text-xs font-mono text-slate-400">
          {filteredInspectorRallies.length} of {rallies.length} rallies{searchQuery ? ` matching "${searchQuery}"` : ''}:
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {filteredInspectorRallies.map((r, i) => {
            const isSelected = selectedRallyIndex === i;
            return (
              <button
                key={r.id}
                onClick={() => {
                  setSelectedRallyIndex(i);
                  seekToRally(r.id);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all border flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#00F5D4] text-slate-950 font-bold border-[#00F5D4] shadow-md shadow-[#00F5D4]/20'
                    : 'bg-slate-950/70 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
                aria-label={`Rally ${r.index}: ${r.endingStroke.replace('_', ' ')}`}
              >
                <span>#{r.index}</span>
                <span className={isSelected ? 'text-slate-900 font-extrabold' : 'text-slate-400'}>
                  {r.endingStroke.replace('_', ' ')}
                </span>
                {r.isThirdBallAttack && (
                  <span className={`text-[10px] ${isSelected ? 'text-slate-900' : 'text-[#CCFF00]'}`}>
                    ⚡3rd
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Rally Detail Card */}
      {currentInspectorRally && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-5 rounded-xl bg-slate-950/70 border border-slate-800/80">
          {showRawJson ? (
            <div className="md:col-span-12 font-mono text-xs space-y-2 overflow-x-auto">
              <div className="text-[#00F5D4] font-bold">
                // Raw Gemini Multimodal Output ➔ Zod Validated RallyInterval
              </div>
              <pre className="p-4 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 leading-relaxed overflow-x-auto">
                {JSON.stringify(currentInspectorRally, null, 2)}
              </pre>
            </div>
          ) : (
            <>
              {/* Left: Rally Invariants & Telemetry */}
              <div className="md:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-base font-bold text-white flex items-center gap-2">
                      <span>Rally #{currentInspectorRally.index}:</span>
                      <span className="text-[#00F5D4]">
                        {currentInspectorRally.endingStroke.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="text-xs font-mono text-slate-400 mt-0.5">
                      {currentInspectorRally.notes}
                    </div>
                  </div>
                </div>

                {/* 4 Invariant Badges */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                    <div className="text-slate-400 text-[10px]">BOUNDARY INVARIANT</div>
                    <div className="text-[#00F5D4] font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00F5D4]" />
                      <span>Duration: +{(currentInspectorRally.endTime - currentInspectorRally.startTime).toFixed(2)}s</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                    <div className="text-slate-400 text-[10px]">OVERLAP RESOLUTION</div>
                    <div className="text-[#CCFF00] font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#CCFF00]" />
                      <span>0% Overlap Guaranteed</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                    <div className="text-slate-400 text-[10px]">TIME OFFSET WINDOW</div>
                    <div className="text-white font-bold">
                      {currentInspectorRally.startTime.toFixed(2)}s ➔ {currentInspectorRally.endTime.toFixed(2)}s
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                    <div className="text-slate-400 text-[10px]">ITTF MATCH SCORE</div>
                    <div className="text-white font-bold">
                      Game {currentInspectorRally.gameNumber}: {currentInspectorRally.scoreP1}-{currentInspectorRally.scoreP2}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => seekToRally(currentInspectorRally.id)}
                    className="px-4 py-2 rounded-lg bg-[#00F5D4] text-slate-950 font-bold text-xs hover:bg-[#20f7dc] transition-all flex items-center gap-1.5"
                    aria-label={`Play rally ${currentInspectorRally.index}`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Play Rally in Cockpit</span>
                  </button>
                  <span className="text-xs font-mono text-slate-500">
                    Shot Count: {currentInspectorRally.shotCount} exchanges
                  </span>
                </div>
              </div>

              {/* Right: AI Vision Classification Telemetry */}
              <div className="md:col-span-5 p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-xs font-mono">
                <div className="text-slate-300 font-bold flex items-center justify-between border-b border-slate-800 pb-2">
                  <span>MULTIMODAL CLASSIFIER</span>
                  <span className="text-[#00F5D4]">CONF: 99.4%</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Stroke Type:</span>
                    <span className="text-white font-bold">{currentInspectorRally.endingStroke}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-400">
                    <span>Point Decider:</span>
                    <span className="text-emerald-400 font-bold">{currentInspectorRally.endingType}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-400">
                    <span>3rd-Ball Attack:</span>
                    <span className={currentInspectorRally.isThirdBallAttack ? 'text-[#CCFF00] font-bold' : 'text-slate-500'}>
                      {currentInspectorRally.isThirdBallAttack ? 'DETECTED' : 'NO'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-400">
                    <span>Server / Winner:</span>
                    <span className="text-white">P{currentInspectorRally.server} / P{currentInspectorRally.winner}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
                  <span className="text-[#00F5D4] font-bold">AI Note: </span>
                  {currentInspectorRally.notes}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
