import React, { useRef, useState } from 'react';
import { useRallyCut } from '../../context/RallyCutContext';
import { Upload, Sparkles, KeyRound } from 'lucide-react';

const YoutubeIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export const IngestionConsole: React.FC = () => {
  const {
    loadSampleMatch,
    importVideoFile,
    importYoutubeUrl,
    isAnalyzing,
    geminiApiKey,
    setIsKeyModalOpen,
  } = useRallyCut();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeIngestTab, setActiveIngestTab] = useState<'demo' | 'upload' | 'youtube'>('demo');
  const [youtubeInput, setYoutubeInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      importVideoFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      importVideoFile(e.target.files[0]);
    }
  };

  const handleYoutubeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (youtubeInput.trim()) {
      importYoutubeUrl(youtubeInput.trim());
    }
  };

  return (
    <div id="ingest-console" className="max-w-5xl mx-auto rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
      <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white">Import Match Footage for Neural Analysis</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Choose your ingestion source. RallyCut handles multi-GB full games with frame-accurate boundary detection.
          </p>
        </div>

        {/* Segmented Ingest Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveIngestTab('demo')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeIngestTab === 'demo'
                ? 'bg-[#00F5D4] text-slate-950 font-bold shadow-md shadow-[#00F5D4]/20'
                : 'text-slate-400 hover:text-white'
            }`}
            aria-label="Olympic demo tab"
          >
            Olympic Demo
          </button>
          <button
            onClick={() => setActiveIngestTab('upload')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeIngestTab === 'upload'
                ? 'bg-[#00F5D4] text-slate-950 font-bold shadow-md shadow-[#00F5D4]/20'
                : 'text-slate-400 hover:text-white'
            }`}
            aria-label="Upload video tab"
          >
            Upload Video
          </button>
          <button
            onClick={() => setActiveIngestTab('youtube')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeIngestTab === 'youtube'
                ? 'bg-[#00F5D4] text-slate-950 font-bold shadow-md shadow-[#00F5D4]/20'
                : 'text-slate-400 hover:text-white'
            }`}
            aria-label="YouTube link tab"
          >
            YouTube Link
          </button>
        </div>
      </div>

      {/* Gemini Vision API Status Banner */}
      <div className="px-6 py-3 bg-slate-950/70 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className={`w-2.5 h-2.5 rounded-full ${geminiApiKey ? 'bg-[#00F5D4] animate-pulse shadow-sm shadow-[#00F5D4]' : 'bg-amber-400'}`} />
          <div>
            <span className="font-bold text-white">
              {geminiApiKey ? 'Gemini 2.5 Flash Vision: Active' : 'Gemini AI Vision Key Not Set'}
            </span>
            <span className="text-slate-400 ml-2 hidden sm:inline">
              {geminiApiKey
                ? 'Videos uploaded are sent directly to Google Gemini Multimodal Vision API.'
                : 'Uploads will run local motion engine unless Gemini API key is configured.'}
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsKeyModalOpen(true)}
          className={`px-3 py-1.5 rounded-lg font-mono font-bold text-[11px] transition-all flex items-center gap-1.5 shrink-0 ${
            geminiApiKey
              ? 'bg-slate-800 text-[#00F5D4] hover:bg-slate-700 border border-[#00F5D4]/30'
              : 'bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 border border-amber-500/30'
          }`}
          title="Configure Google Gemini API Key"
        >
          <Sparkles className="w-3 h-3" />
          <span>{geminiApiKey ? 'Change Gemini Key' : 'Connect Gemini API Key'}</span>
        </button>
      </div>

      {/* Tab Content Panels */}
      <div className="p-6">
        {activeIngestTab === 'demo' && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">🏓</span>
                <h3 className="text-base font-bold text-white">
                  Olympic Men's Singles Finals (Ma Long vs Fan Zhendong)
                </h3>
              </div>
              <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                High-definition real match footage with 11 pre-mapped rallies, 3rd-ball loop attacks, topspin counter duels, and official ITTF deuce scoring.
              </p>
              <div className="flex items-center gap-3 text-xs font-mono text-slate-500 pt-1">
                <span>1080p 60fps</span>
                <span>·</span>
                <span>11 Rallies</span>
                <span>·</span>
                <span className="text-[#00F5D4]">Zod Validated</span>
              </div>
            </div>

            <button
              onClick={() => loadSampleMatch()}
              disabled={isAnalyzing}
              className="py-3 px-6 rounded-xl font-bold text-xs bg-[#00F5D4] text-slate-950 hover:bg-[#20f7dc] shadow-md shadow-[#00F5D4]/20 active:scale-95 transition-all whitespace-nowrap"
              aria-label="Launch demo editor"
            >
              Launch Demo Editor
            </button>
          </div>
        )}

        {activeIngestTab === 'upload' && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`p-10 rounded-xl border-2 border-dashed cursor-pointer text-center space-y-3 transition-all ${
              isDragging
                ? 'border-[#00F5D4] bg-[#00F5D4]/5'
                : 'border-slate-800 hover:border-slate-700 bg-slate-950/40'
            }`}
            role="button"
            aria-label="Drop video file or click to browse"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleFileSelect}
            />
            <div className="w-12 h-12 rounded-xl bg-slate-800 text-[#00F5D4] flex items-center justify-center mx-auto">
              <Upload className="w-6 h-6" />
            </div>
            <div className="text-sm font-bold text-white">
              Drag and drop raw game video here, or click to browse
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Supports MP4, MOV, WebM files from phones, GoPros, and streaming cameras (up to 4K)
            </p>
          </div>
        )}

        {activeIngestTab === 'youtube' && (
          <form onSubmit={handleYoutubeSubmit} className="space-y-4 max-w-2xl mx-auto py-4">
            <div className="space-y-1.5">
              <label htmlFor="youtube-url-input" className="text-xs font-mono text-slate-300">
                YouTube Match URL
              </label>
              <div className="flex gap-2">
                <input
                  id="youtube-url-input"
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={youtubeInput}
                  onChange={(e) => setYoutubeInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00F5D4]"
                  aria-label="YouTube video URL"
                />
                <button
                  type="submit"
                  disabled={!youtubeInput.trim() || isAnalyzing}
                  className="py-2.5 px-6 rounded-xl font-bold text-xs bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white shadow-md shadow-red-600/20 transition-all flex items-center gap-2"
                  aria-label="Import from YouTube"
                >
                  <YoutubeIcon className="w-4 h-4" />
                  <span>Import</span>
                </button>
              </div>
            </div>
            <p className="text-[11px] font-mono text-slate-500">
              Pulls match stream and runs multimodal AI action extraction on the footage.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
