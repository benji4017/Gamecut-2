import React from 'react';
import { useRallyCut } from '../../context/RallyCutContext';
import { RallyGrid } from '../video/RallyGrid';
import { RallyGridSkeleton } from '../common/Skeleton';
import { HeroSection } from '../home/HeroSection';
import { AnalysisProgressBanner } from '../home/AnalysisProgressBanner';
import { CockpitPreview } from '../home/CockpitPreview';
import { RallyInspector } from '../home/RallyInspector';
import { TacticalCoachConsole } from '../home/TacticalCoachConsole';
import { IngestionConsole } from '../home/IngestionConsole';
import { FeatureShowcase } from '../home/FeatureShowcase';
import {
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const {
    isAnalyzing,
    analysisProgress,
    videoFile,
    videoUrl,
    setActiveScreen,
    rallies,
    seekToRally,
    player1,
    player2,
  } = useRallyCut();

  const handleScrollToIngest = () => {
    const el = document.getElementById('ingest-console');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen py-8 px-4 sm:px-6 lg:px-8 space-y-16 overflow-hidden">
      {/* Background Neural Grid and Ambient Glows */}
      <div className="absolute inset-0 ai-dot-grid opacity-30 pointer-events-none" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-[#00F5D4]/15 via-[#3B82F6]/10 to-transparent blur-3xl pointer-events-none" />

      {/* Hero Section (#14 decomposed) with Animated Counters (#7) */}
      <HeroSection onScrollToIngest={handleScrollToIngest} />

      {/* Progress Telemetry Banner if processing */}
      {isAnalyzing && analysisProgress && (
        <AnalysisProgressBanner progress={analysisProgress} />
      )}

      {/* Interactive Hero Showcase Preview (#14 decomposed) */}
      <CockpitPreview />

      {/* AI-Detected Rallies: GameCut Responsive Thumbnail Grid */}
      <section className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#00F5D4]/10 border border-[#00F5D4]/30 text-xs font-mono text-[#00F5D4] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>GAMECUT AI HIGHLIGHT GRID</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              AI-Detected Match Rallies
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl font-sans leading-relaxed">
              Segmented by Gemini Multimodal Vision AI via optical trajectory tracking and ITTF rule boundary detection. Hover for cyber cyan and laser lime neon halo effects or click any card for instant video replay with AI vision metrics.
            </p>
          </div>

          <button
            onClick={() => setActiveScreen('editor')}
            className="px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 hover:border-[#00F5D4]/50 text-xs font-mono flex items-center gap-2 self-start sm:self-auto transition-all shadow-sm"
            aria-label="Open timeline editor"
          >
            <span>Open in Timeline Editor</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#00F5D4]" />
          </button>
        </div>

        {/* Skeleton loading state (#4) or real grid */}
        {rallies.length === 0 ? (
          <RallyGridSkeleton count={8} />
        ) : (
          <RallyGrid
            rallies={rallies}
            player1={player1}
            player2={player2}
            videoFile={videoFile}
            videoUrl={videoUrl || ''}
            onSeekToRally={seekToRally}
            onOpenInEditor={(rallyId) => {
              seekToRally(rallyId);
              setActiveScreen('editor');
            }}
          />
        )}
      </section>

      {/* Rally Inspector with Search & Sort (#11, #14) */}
      <RallyInspector />

      {/* AI Tactical Coach with Free-Text Input (#19, #14) */}
      <TacticalCoachConsole />

      {/* Ingestion Console (#14 decomposed) */}
      <IngestionConsole />

      {/* Feature Showcase with Hover Effects (#9, #14) */}
      <FeatureShowcase />
    </div>
  );
};
