import React, { useState } from 'react';
import { ScreenType, useRallyCut } from '../../context/RallyCutContext';
import {
  Scissors,
  BarChart3,
  Download,
  FolderOpen,
  Sparkles,
  Zap,
  Menu,
  X,
  Sun,
  Moon,
  Undo2,
  Redo2,
  Keyboard,
  KeyRound,
} from 'lucide-react';

export const TopBar: React.FC = () => {
  const {
    activeScreen,
    setActiveScreen,
    analytics,
    loadSampleMatch,
    isAnalyzing,
    canUndo,
    canRedo,
    undo,
    redo,
    geminiApiKey,
    setIsKeyModalOpen,
  } = useRallyCut();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Dark/Light mode toggle (#1)
  const [isDarkMode, setIsDarkMode] = useState(true);
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('light-mode');
  };

  const navItems: { screen: ScreenType; icon: React.ReactNode; label: string }[] = [
    { screen: 'home', icon: <FolderOpen className="w-3.5 h-3.5" />, label: 'Import' },
    { screen: 'editor', icon: <Scissors className="w-3.5 h-3.5" />, label: 'Editor & Timeline' },
    { screen: 'analytics', icon: <BarChart3 className="w-3.5 h-3.5" />, label: 'Match Analytics' },
    { screen: 'export', icon: <Download className="w-3.5 h-3.5" />, label: 'Export Highlight' },
  ];

  return (
    <header className="flex items-center justify-between gap-4 lg:gap-8 px-4 lg:px-6 py-3.5 bg-[#0B0F17]/95 border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-50">
      {/* Zone 1: Wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => setActiveScreen('home')}
          className="flex items-center gap-2.5 text-left group transition-transform focus-visible:outline-none"
          aria-label="Go to home screen"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00F5D4] via-[#00C2A8] to-[#0B0F17] p-[1px] shadow-lg shadow-[#00F5D4]/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0B0F17] rounded-[7px] flex items-center justify-center text-[#00F5D4] font-black text-sm">
              ⚡
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold tracking-tight text-white whitespace-nowrap">
                RALLY<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F5D4] to-[#70FFDB]">CUT</span>
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#00F5D4]/10 text-[#00F5D4] border border-[#00F5D4]/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00F5D4] animate-pulse" />
                GEMINI VISION
              </span>
            </div>
          </div>
        </button>

        {/* Quiet unboxed metadata */}
        <div className="hidden xl:flex items-center gap-2 text-xs text-slate-400 font-mono pl-4 border-l border-slate-800/80">
          <span className="text-[#00F5D4]">{analytics.deadTimePercent}% Dead Time Cut</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>{analytics.activeRalliesCount} Rallies (Zod Verified)</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>60 FPS Inference</span>
        </div>
      </div>

      {/* Zone 2: Desktop Navigation (#3 responsive) */}
      <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-900/90 rounded-xl border border-slate-800">
        {navItems.map(({ screen, icon, label }) => (
          <button
            key={screen}
            onClick={() => setActiveScreen(screen)}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              activeScreen === screen
                ? 'bg-[#00F5D4] text-slate-950 shadow-md shadow-[#00F5D4]/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
            aria-label={`Navigate to ${label}`}
            aria-current={activeScreen === screen ? 'page' : undefined}
          >
            {icon}
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {/* Zone 3: Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Undo/Redo (#20) */}
        <div className="hidden sm:flex items-center gap-1 border-r border-slate-800 pr-2 mr-1">
          <button
            onClick={undo}
            disabled={!canUndo}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Undo (⌘Z)"
            aria-label="Undo"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Redo (⌘⇧Z)"
            aria-label="Redo"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Theme toggle (#1) */}
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label="Toggle theme"
        >
          {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </button>

        {/* Gemini API Key config button */}
        <button
          onClick={() => setIsKeyModalOpen(true)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono font-medium transition-all ${
            geminiApiKey
              ? 'bg-[#00F5D4]/15 border-[#00F5D4]/40 text-[#00F5D4]'
              : 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title={geminiApiKey ? 'Gemini 2.5 Flash API Connected' : 'Configure Google Gemini API Key'}
          aria-label="Configure Gemini API Key"
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">
            {geminiApiKey ? 'Gemini Active' : 'Gemini Key'}
          </span>
        </button>

        {/* Keyboard shortcuts hint (#2) */}
        <button
          onClick={() => setShowShortcuts(!showShortcuts)}
          className="hidden sm:block p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          title="Keyboard shortcuts"
          aria-label="Show keyboard shortcuts"
        >
          <Keyboard className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => loadSampleMatch()}
          disabled={isAnalyzing}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-all whitespace-nowrap shrink-0 hover:text-white"
          title="Reload Olympic Table Tennis Sample match"
          aria-label="Load sample match"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#00F5D4]" />
          <span>Sample Match</span>
        </button>

        <button
          onClick={() => setActiveScreen(activeScreen === 'export' ? 'editor' : 'export')}
          className="flex items-center gap-2 px-4 py-1.5 text-xs font-bold text-slate-950 bg-[#00F5D4] hover:bg-[#20f7dc] active:scale-95 rounded-lg shadow-md shadow-[#00F5D4]/25 transition-all whitespace-nowrap shrink-0"
          aria-label={activeScreen === 'export' ? 'Back to editor' : 'Export reel'}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>{activeScreen === 'export' ? 'Back to Editor' : 'Export Reel'}</span>
        </button>

        {/* Mobile hamburger (#3) */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer (#3) */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#0B0F17]/98 backdrop-blur-lg border-b border-slate-800 p-4 md:hidden z-50 animate-slide-down">
          <nav className="flex flex-col gap-1">
            {navItems.map(({ screen, icon, label }) => (
              <button
                key={screen}
                onClick={() => {
                  setActiveScreen(screen);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                  activeScreen === screen
                    ? 'bg-[#00F5D4] text-slate-950'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
                aria-label={`Navigate to ${label}`}
              >
                {icon}
                <span>{label}</span>
              </button>
            ))}
          </nav>

          {/* Mobile metadata */}
          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-3 text-xs font-mono text-slate-500">
            <span className="text-[#00F5D4]">{analytics.deadTimePercent}% Cut</span>
            <span>·</span>
            <span>{analytics.activeRalliesCount} Rallies</span>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Modal (#2) */}
      {showShortcuts && (
        <div className="absolute top-full right-4 mt-2 w-72 bg-slate-900/98 backdrop-blur-lg border border-slate-700 rounded-xl p-4 shadow-2xl z-50 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-white">Keyboard Shortcuts</span>
            <button onClick={() => setShowShortcuts(false)} className="text-slate-500 hover:text-white" aria-label="Close shortcuts">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2 text-xs">
            {[
              ['Space / K', 'Play / Pause'],
              ['← →', 'Prev / Next Rally'],
              ['H', 'Home'],
              ['E', 'Editor'],
              ['A', 'Analytics'],
              ['X', 'Export'],
              ['Esc', 'Close Modals'],
            ].map(([key, desc]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-slate-400">{desc}</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">{key}</kbd>
              </div>
            ))}
          </div>
        </div>
      )}

    </header>
  );
};
