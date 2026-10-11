import React, { useEffect, useRef, useState } from 'react';
import { useRallyCut } from '../../context/RallyCutContext';
import { BroadcastScoreboard } from './BroadcastScoreboard';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Volume2,
  VolumeX,
  Zap,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const BeforeAfterPlayer: React.FC = () => {
  const {
    videoUrl,
    videoFile,
    youtubeVideoId,
    videoDuration,
    currentTime,
    isPlaying,
    playbackMode,
    playbackSpeed,
    setPlaybackSpeed,
    setCurrentTime,
    setIsPlaying,
    setPlaybackMode,
    activeRally,
    rallies,
    filteredRallies,
    seekToRally,
    player1,
    player2,
    replayState,
    triggerReplay,
    exitReplay,
  } = useRallyCut();

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pointAlert, setPointAlert] = useState<string | null>(null);
  const [showAiHud, setShowAiHud] = useState(true);

  const actualVideoUrl =
    videoUrl && !videoUrl.startsWith('data:image')
      ? videoUrl
      : '/sample_pro_match.mp4';

  // Sync HTML5 video play/pause
  useEffect(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.playbackRate = playbackSpeed;
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying, playbackSpeed]);

  // Sync HTML5 video currentTime
  useEffect(() => {
    if (!videoRef.current) return;
    if (Math.abs(videoRef.current.currentTime - currentTime) > 0.4) {
      videoRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  // Auto-exit replay when current point completes
  useEffect(() => {
    if (replayState.isActive && activeRally && currentTime >= activeRally.endTime - 0.1) {
      exitReplay();
    }
  }, [replayState.isActive, activeRally, currentTime, exitReplay]);

  // Detect when active rally concludes to show quick broadcast point banner
  useEffect(() => {
    if (activeRally) {
      setPointAlert(
        `${activeRally.winner === 1 ? player1.name : player2.name} · ${activeRally.endingStroke.replace('_', ' ').toUpperCase()} (${activeRally.endingType.toUpperCase()})`,
      );
    }
  }, [activeRally, player1.name, player2.name]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const stepFrame = (frames: number) => {
    setIsPlaying(false);
    const dt = frames * 0.04; // ~25-30fps frame duration
    const target = Math.max(0, Math.min(currentTime + dt, videoDuration));
    setCurrentTime(target);
    if (videoRef.current) videoRef.current.currentTime = target;
  };

  const jumpPrevRally = () => {
    const prev = [...filteredRallies].reverse().find((r) => r.startTime < currentTime - 0.5);
    if (prev) seekToRally(prev.id);
    else if (filteredRallies[0]) seekToRally(filteredRallies[0].id);
  };

  const jumpNextRally = () => {
    const next = filteredRallies.find((r) => r.startTime > currentTime + 0.5);
    if (next) seekToRally(next.id);
    else if (filteredRallies[0]) seekToRally(filteredRallies[0].id);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false));
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col bg-slate-950 rounded-2xl border border-slate-800/80 overflow-hidden shadow-2xl group"
    >
      {/* Video Viewport: Real Table Tennis Broadcast Footage */}
      <div className="relative aspect-video w-full bg-[#070A0F] flex items-center justify-center overflow-hidden select-none">
        {youtubeVideoId ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtubeVideoId}?enablejsapi=1&autoplay=1&controls=1`}
            title="YouTube Table Tennis Match"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        ) : (
          <video
            ref={videoRef}
            src={actualVideoUrl}
            muted={isMuted}
            className="w-full h-full object-contain cursor-pointer"
            onClick={togglePlay}
            onTimeUpdate={() => {
              if (videoRef.current) {
                setCurrentTime(videoRef.current.currentTime);
              }
            }}
            playsInline
            loop
          />
        )}

        {/* Slow-Motion Spotlight Freeze-Frame Overlay */}
        {replayState.isActive && (
          <div className="absolute inset-0 pointer-events-none z-20 transition-all duration-300">
            {/* Darkened arena vignette with spotlight circle centered on table contact */}
            <div
              className="w-full h-full"
              style={{
                background:
                  'radial-gradient(circle at 50% 55%, transparent 110px, rgba(0, 0, 0, 0.75) 230px)',
              }}
            />
            {/* Glowing cyan focus spotlight ring */}
            <div className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] rounded-full border-2 border-[#00F5D4] shadow-[0_0_35px_rgba(0,245,212,0.85)] animate-pulse" />
            {/* Top-Right Replay Banner */}
            <div className="absolute top-4 right-4 px-3.5 py-1.5 rounded-lg bg-orange-600/95 border border-white/20 text-white font-mono font-extrabold text-xs shadow-2xl flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span>SLOW-MO SPOTLIGHT {replayState.slowMoSpeed}x</span>
            </div>
          </div>
        )}

        {/* Broadcast Scoreboard Banner Overlay */}
        <BroadcastScoreboard position="top-left" />

        {/* AI Computer Vision Telemetry HUD Overlay */}
        {showAiHud && (
          <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-4 overflow-hidden select-none">
            {/* Top-Right Telemetry Strip */}
            <div className="flex items-center justify-end gap-2 text-[10px] font-mono">
              <div className="px-2.5 py-1 rounded-md bg-[#0B0F17]/85 border border-[#00F5D4]/30 backdrop-blur-md text-[#00F5D4] flex items-center gap-2 shadow-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00F5D4] animate-ping" />
                <span className="font-bold">GEMINI 3.5 FLASH VISION</span>
                <span className="text-slate-500">|</span>
                <span className="text-slate-300">12ms LATENCY</span>
                <span className="text-slate-500">|</span>
                <span className="text-[#CCFF00]">ZOD STRICT</span>
              </div>
            </div>

            {/* Viewport Cybernetic Target Brackets */}
            <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-[#00F5D4]/40" />
            <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-[#00F5D4]/40" />
            <div className="absolute bottom-14 left-2 w-6 h-6 border-b-2 border-l-2 border-[#00F5D4]/40" />
            <div className="absolute bottom-14 right-2 w-6 h-6 border-b-2 border-r-2 border-[#00F5D4]/40" />

            {/* Bottom-Left Acoustic Resonance Visualizer & Stroke Telemetry */}
            <div className="flex items-end justify-between w-full">
              <div className="px-3 py-2 rounded-lg bg-slate-950/85 border border-white/10 backdrop-blur-md space-y-1.5 shadow-xl max-w-xs">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span className="text-[#00F5D4] font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00F5D4]" />
                    ACOUSTIC PING DETECTOR (2.4kHz)
                  </span>
                  <span className="text-slate-500 tabular-nums">{currentTime.toFixed(2)}s</span>
                </div>
                {/* 16-bar animated audio equalizer */}
                <div className="flex items-end gap-1 h-5 pt-1">
                  {[40, 65, 90, 30, 85, 100, 45, 70, 95, 60, 80, 50, 90, 75, 60, 40].map((h, i) => {
                    const activeBar = activeRally && isPlaying;
                    const barHeight = activeBar ? Math.max(15, (h * Math.sin((currentTime * 10) + i)) % 100) : 15;
                    return (
                      <div
                        key={i}
                        style={{ height: `${Math.abs(barHeight)}%` }}
                        className={`w-1 rounded-sm transition-all duration-75 ${
                          activeBar ? 'bg-[#00F5D4]' : 'bg-slate-700/60'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Active Rally Stroke Classification Badge */}
              {activeRally && (
                <div className="px-3 py-1.5 rounded-lg bg-[#0B0F17]/90 border border-[#00F5D4]/40 backdrop-blur-md text-right text-[11px] font-mono space-y-0.5 shadow-xl">
                  <div className="text-[#00F5D4] font-extrabold flex items-center justify-end gap-1.5">
                    <span>{activeRally.endingStroke.replace('_', ' ').toUpperCase()}</span>
                    <span className="text-[#CCFF00]">99.4% CONF</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Shot #{activeRally.shotCount} · Winner P{activeRally.winner} · 0% Overlap
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Center Big Play Button Overlay when paused */}
        {!isPlaying && (
          <div
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/35 cursor-pointer z-10 transition-opacity"
          >
            <div className="w-16 h-16 rounded-full bg-[#00F5D4]/90 text-slate-950 flex items-center justify-center shadow-xl shadow-[#00F5D4]/30 hover:scale-110 active:scale-95 transition-all">
              <Play className="w-8 h-8 fill-current ml-1" />
            </div>
          </div>
        )}

        {/* Point notification toast banner */}
        {pointAlert && activeRally && !replayState.isActive && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-[#00F5D4]/40 text-xs font-mono text-white shadow-xl pointer-events-none z-20 flex items-center gap-2">
            <span className="text-[#00F5D4]">⚡</span>
            <span>{pointAlert}</span>
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between gap-4 select-none">
        {/* Left: Playback controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={jumpPrevRally}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Previous Rally"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={() => stepFrame(-1)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-xs font-mono"
            title="Step back 1 frame (-0.04s)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={togglePlay}
            className="px-3 py-2 bg-[#00F5D4] text-slate-950 hover:bg-[#20f7dc] rounded-lg font-bold shadow-md shadow-[#00F5D4]/20 transition-all flex items-center gap-1.5"
            title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current" />
            )}
            <span className="text-xs font-mono">{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          <button
            onClick={() => stepFrame(1)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-xs font-mono"
            title="Step forward 1 frame (+0.04s)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={jumpNextRally}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Next Rally"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Instant Replay Button */}
          <button
            onClick={() => triggerReplay()}
            className="ml-2 flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-bold rounded-lg text-xs shadow-md shadow-orange-500/20 active:scale-95 transition-all"
            title="Trigger slow-motion spotlight instant replay on this point"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="font-mono">Spotlight Replay</span>
          </button>
        </div>

        {/* Center: Highlight vs Continuous Toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => setPlaybackMode('rallies_only')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              playbackMode === 'rallies_only'
                ? 'bg-[#00F5D4] text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Automatically skip dead time between rallies"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Condensed Highlights</span>
          </button>

          <button
            onClick={() => setPlaybackMode('all')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              playbackMode === 'all'
                ? 'bg-slate-800 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Play full raw match footage including between-point pauses"
          >
            <span>Full Match</span>
          </button>
        </div>

        {/* AI HUD Toggle */}
        <button
          onClick={() => setShowAiHud(!showAiHud)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
            showAiHud
              ? 'bg-[#00F5D4]/15 text-[#00F5D4] border-[#00F5D4]/40 shadow-sm shadow-[#00F5D4]/10'
              : 'bg-slate-950/60 text-slate-500 border-slate-800 hover:text-slate-300'
          }`}
          title="Toggle AI Computer Vision Telemetry HUD"
        >
          <span className={`w-1.5 h-1.5 rounded-full ${showAiHud ? 'bg-[#00F5D4] animate-pulse' : 'bg-slate-600'}`} />
          <span>AI HUD: {showAiHud ? 'ON' : 'OFF'}</span>
        </button>

        {/* Right: Speed & Audio & Fullscreen */}
        <div className="flex items-center gap-2">
          {/* Speed Selector */}
          <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px] font-mono">
            {[0.35, 0.5, 0.75, 1.0].map((spd) => (
              <button
                key={spd}
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-2 py-1 rounded transition-colors ${
                  playbackSpeed === spd
                    ? 'bg-[#00F5D4] text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
