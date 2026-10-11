import React from 'react';
import { useRallyCut } from '../../context/RallyCutContext';
import { AnimatedCounter } from '../common/AnimatedCounter';
import {
  Upload,
  Play,
} from 'lucide-react';

interface HeroSectionProps {
  onScrollToIngest: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onScrollToIngest }) => {
  const { loadSampleMatch, isAnalyzing } = useRallyCut();

  return (
    <div className="relative text-center space-y-6 max-w-4xl mx-auto pt-4">
      {/* Live AI Telemetry Status Chip */}
      <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-[#00F5D4]/30 text-xs font-mono text-slate-300 shadow-lg shadow-[#00F5D4]/10">
        <span className="w-2 h-2 rounded-full bg-[#00F5D4] animate-pulse" />
        <span className="text-[#00F5D4] font-bold">GEMINI 2.5 FLASH VISION CORE</span>
        <span className="text-slate-600">·</span>
        <span>60 FPS REAL-TIME INFERENCE</span>
        <span className="text-slate-600">·</span>
        <span className="text-[#CCFF00]">ZOD STRICT</span>
      </div>

      {/* High-Impact Headline */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
        Autonomous Computer Vision for{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F5D4] via-[#70FFDB] to-[#CCFF00]">
          Table Tennis Video
        </span>
      </h1>

      {/* Subhead */}
      <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
        Gemini Multimodal Vision AI visually tracks ball tosses, optical trajectory vectors, and table contact points. Eliminates 70–85% unplayable dead time, computes ITTF deuce scoreboards, and exports 9:16 vertical reels.
      </p>

      {/* Hero CTAs */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          onClick={() => loadSampleMatch()}
          disabled={isAnalyzing}
          className="py-3 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-[#00F5D4] to-[#00C2A8] text-slate-950 hover:brightness-110 shadow-lg shadow-[#00F5D4]/25 active:scale-95 transition-all flex items-center gap-2 group"
        >
          <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
          <span>Launch Olympic Finals AI Demo</span>
        </button>

        <button
          onClick={onScrollToIngest}
          className="py-3 px-6 rounded-xl font-bold text-sm bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 active:scale-95 transition-all flex items-center gap-2"
        >
          <Upload className="w-4 h-4 text-[#00F5D4]" />
          <span>Ingest Match Video</span>
        </button>
      </div>

      {/* Animated Telemetry Metrics Ribbon (#7) */}
      <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-1.5">
          <AnimatedCounter value={82} suffix="%" className="text-[#00F5D4] font-extrabold" />
          <span>Dead Time Cut</span>
        </div>
        <span aria-hidden="true" className="text-slate-700">·</span>
        <div className="flex items-center gap-1.5">
          <AnimatedCounter value={12.4} suffix="ms" decimals={1} className="text-white font-extrabold" />
          <span>Frame Latency</span>
        </div>
        <span aria-hidden="true" className="text-slate-700">·</span>
        <div className="flex items-center gap-1.5">
          <AnimatedCounter value={0} suffix="% Overlap" className="text-[#CCFF00] font-extrabold" />
          <span>Zod Guarantee</span>
        </div>
        <span aria-hidden="true" className="text-slate-700">·</span>
        <div className="flex items-center gap-1.5">
          <AnimatedCounter value={60} suffix=" FPS" className="text-purple-400 font-extrabold" />
          <span>Optical Tracking</span>
        </div>
      </div>
    </div>
  );
};
