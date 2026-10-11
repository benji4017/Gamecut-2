import React from 'react';
import { useRallyCut } from '../../context/RallyCutContext';
import {
  Scissors,
  ShieldCheck,
  Tv,
  Smartphone,
  ArrowRight,
} from 'lucide-react';

const FEATURES = [
  {
    icon: Scissors,
    iconBg: 'bg-[#00F5D4]/15',
    iconColor: 'text-[#00F5D4]',
    title: 'Gemini Vision Ball-in-Play Tracking',
    description:
      'Gemini Multimodal Vision visually detects service tosses, optical ball trajectory, paddle strikes, and double bounces to eliminate dead time without relying on arena audio.',
  },
  {
    icon: ShieldCheck,
    iconBg: 'bg-[#CCFF00]/15',
    iconColor: 'text-[#CCFF00]',
    title: 'Zod-Hardened Rally Boundaries',
    description:
      'Mathematical guarantees eliminate corrupted or overlapping intervals. Strictly enforces positive durations, chronological monotonic order, and ITTF scoring continuity.',
  },
  {
    icon: Tv,
    iconBg: 'bg-orange-500/15',
    iconColor: 'text-orange-400',
    title: 'Broadcast Scoreboards with Team Crests',
    description:
      'Overlay TV broadcast score banners directly onto video frames. Tracks service rotation rules, deuce sudden death, and official club crests (Butterfly, DHS, Stiga).',
  },
  {
    icon: Smartphone,
    iconBg: 'bg-purple-500/15',
    iconColor: 'text-purple-400',
    title: '9:16 Vertical Dual-Panel Social Reels',
    description:
      'Converts horizontal broadcast match footage into a stacked two-tier vertical layout for TikTok and Instagram Reels with centered score bug and zero letterboxing.',
  },
];

export const FeatureShowcase: React.FC = () => {
  const { setActiveScreen } = useRallyCut();

  return (
    <>
      {/* Feature Showcase Bento Grid */}
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Built with Racket Sport Computer Vision
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-mono">
            Tuned specifically for high-speed table tennis trajectory physics and ITTF rules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3 gamecut-neon-card group"
              >
                <div className={`relative z-10 w-10 h-10 rounded-xl ${feature.iconBg} ${feature.iconColor} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="relative z-10 text-base font-bold text-white">{feature.title}</h3>
                <p className="relative z-10 text-xs text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Launch Banner */}
      <div className="max-w-5xl mx-auto p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-xl font-bold text-white">Ready to condense your match footage?</h3>
          <p className="text-xs text-slate-400">
            Open the timeline editor to slice rallies, trigger slow-motion spotlight replays, and export reels.
          </p>
        </div>

        <button
          onClick={() => setActiveScreen('editor')}
          className="py-3 px-6 rounded-xl font-bold text-xs bg-[#00F5D4] text-slate-950 hover:bg-[#20f7dc] shadow-lg shadow-[#00F5D4]/20 active:scale-95 transition-all flex items-center gap-2 shrink-0"
          aria-label="Open highlight editor"
        >
          <span>Open Highlight Editor</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </>
  );
};
