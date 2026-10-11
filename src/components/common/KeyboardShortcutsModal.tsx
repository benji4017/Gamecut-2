import React from 'react';
import { useRallyCut } from '../../context/RallyCutContext';
import { X, Keyboard, Scissors, Play, Navigation, Check } from 'lucide-react';

export const KeyboardShortcutsModal: React.FC = () => {
  const { isShortcutsModalOpen, setIsShortcutsModalOpen } = useRallyCut();

  if (!isShortcutsModalOpen) return null;

  const sections = [
    {
      title: 'Playback & Scrubbing',
      icon: <Play className="w-4 h-4 text-[#00F5D4]" />,
      shortcuts: [
        { key: 'Space', alt: 'K', desc: 'Play / Pause match video' },
        { key: 'J', desc: 'Jump back 1.0s' },
        { key: 'L', desc: 'Jump forward 1.0s' },
        { key: '← / →', desc: 'Frame step (±0.04s accurate)' },
      ],
    },
    {
      title: 'Precision Highlight Trimming',
      icon: <Scissors className="w-4 h-4 text-[#CCFF00]" />,
      shortcuts: [
        { key: '[', desc: 'Trim start earlier (-0.2s)' },
        { key: ']', desc: 'Trim start later (+0.2s)' },
        { key: '{', alt: 'Shift+[', desc: 'Trim end earlier (-0.2s)' },
        { key: '}', alt: 'Shift+]', desc: 'Trim end later (+0.2s)' },
        { key: 'X', desc: 'Exclude / Restore point from highlight reel' },
        { key: '1 / 2', desc: 'Set point winner to Player 1 / Player 2' },
      ],
    },
    {
      title: 'Navigation & Screens',
      icon: <Navigation className="w-4 h-4 text-blue-400" />,
      shortcuts: [
        { key: 'N', desc: 'Jump to Next rally' },
        { key: 'P', desc: 'Jump to Previous rally' },
        { key: 'E', desc: 'Switch to Timeline Editor' },
        { key: 'H', desc: 'Switch to Home / Ingest' },
        { key: 'A', desc: 'Switch to Match Analytics' },
        { key: '?', desc: 'Toggle keyboard shortcuts guide' },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0E131F] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden font-sans">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00F5D4]/15 text-[#00F5D4] flex items-center justify-center">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Pro Editor Keyboard Shortcuts</h3>
              <p className="text-xs text-slate-400 font-mono">Speed up highlight trimming with instant hotkeys</p>
            </div>
          </div>
          <button
            onClick={() => setIsShortcutsModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {sections.map((sec, idx) => (
            <div key={idx} className="space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-wider text-slate-300">
                {sec.icon}
                <span>{sec.title}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {sec.shortcuts.map((s, sIdx) => (
                  <div
                    key={sIdx}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-900/70 border border-slate-800/80 text-xs"
                  >
                    <span className="text-slate-300 text-[11px]">{s.desc}</span>
                    <div className="flex items-center gap-1">
                      <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-white font-mono font-bold text-[11px] shadow-sm">
                        {s.key}
                      </kbd>
                      {s.alt && (
                        <>
                          <span className="text-slate-500 text-[10px]">/</span>
                          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px]">
                            {s.alt}
                          </kbd>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-900/40 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-white font-bold">Esc</kbd> or click outside to close</span>
          <button
            onClick={() => setIsShortcutsModalOpen(false)}
            className="px-3.5 py-1.5 bg-[#00F5D4] text-slate-950 font-bold rounded-lg text-xs hover:bg-[#20f7dc] transition-all"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
