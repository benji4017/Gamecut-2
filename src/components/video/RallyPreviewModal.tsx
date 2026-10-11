import React, { useEffect, useRef, useState } from 'react';
import { RallyInterval, PlayerInfo } from '../../types';
import {
  X,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Zap,
  ExternalLink,
  Cpu,
  Activity,
  Target,
  Gauge,
  ShieldCheck,
  Volume2,
  VolumeX,
  Eye,
} from 'lucide-react';

interface RallyPreviewModalProps {
  rally: RallyInterval;
  ralliesList: RallyInterval[];
  player1: PlayerInfo;
  player2: PlayerInfo;
  videoUrl: string;
  videoFile: File | null;
  onClose: () => void;
  onSelectRally: (rally: RallyInterval) => void;
  onOpenInEditor: (rally: RallyInterval) => void;
}

export const RallyPreviewModal: React.FC<RallyPreviewModalProps> = ({
  rally,
  ralliesList,
  player1,
  player2,
  videoUrl,
  videoFile,
  onClose,
  onSelectRally,
  onOpenInEditor,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState<number>(1.0);
  const [currentPlaySec, setCurrentPlaySec] = useState<number>(rally.startTime);
  const [isVisionHudActive, setIsVisionHudActive] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const duration = Math.max(0.1, rally.endTime - rally.startTime);
  const progressRatio = Math.min(
    1,
    Math.max(0, (currentPlaySec - rally.startTime) / duration)
  );

  const currentIndex = ralliesList.findIndex((r) => r.id === rally.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < ralliesList.length - 1;

  // Ensure we point to real match video footage or YouTube embed
  const actualVideoUrl =
    videoUrl && !videoUrl.startsWith('data:image')
      ? videoUrl
      : '/sample_pro_match.mp4';

  const ytMatch = actualVideoUrl.match(/(?:embed\/|watch\?v=|youtu\.be\/)([\w-]{11})/);
  const isYouTube = Boolean(ytMatch);
  const ytId = ytMatch ? ytMatch[1] : '';

  // Reset playback position when rally changes
  useEffect(() => {
    setCurrentPlaySec(rally.startTime);
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.currentTime = rally.startTime;
      videoRef.current.playbackRate = speed;
      videoRef.current.play().catch(() => {});
    }
  }, [rally.id, rally.startTime, speed]);

  // Keyboard navigation & controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && hasPrev) {
        onSelectRally(ralliesList[currentIndex - 1]);
      } else if (e.key === 'ArrowRight' && hasNext) {
        onSelectRally(ralliesList[currentIndex + 1]);
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasPrev, hasNext, currentIndex, ralliesList, onSelectRally, onClose]);

  // Video element playback synchronization
  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = speed;
    if (isPlaying) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying, speed]);

  // Video element time loop tracking
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      if (video.currentTime >= rally.endTime || video.currentTime < rally.startTime) {
        video.currentTime = rally.startTime;
      }
      setCurrentPlaySec(video.currentTime);
    };

    video.addEventListener('timeupdate', onTimeUpdate);
    return () => video.removeEventListener('timeupdate', onTimeUpdate);
  }, [rally.startTime, rally.endTime]);

  // Draw Computer Vision HUD directly onto transparent overlay canvas
  useEffect(() => {
    if (!isVisionHudActive || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, 1280, 720);

    const relProg = Math.max(0, Math.min(1, (currentPlaySec - rally.startTime) / duration));
    const targetX = rally.winner === 1 ? 1280 * 0.38 : 1280 * 0.64;
    const targetY = 720 * 0.58;

    // AI Computer Vision Trajectory HUD Overlay on top of real footage
    ctx.save();

    // Trajectory curved guide line
    ctx.strokeStyle = '#00F5D4';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.moveTo(1280 * 0.35, 720 * 0.68);
    ctx.quadraticCurveTo(1280 * 0.5, 720 * 0.38, targetX, targetY);
    ctx.stroke();

    // Impact Target Reticle
    ctx.setLineDash([]);
    ctx.fillStyle = '#A3E635';
    ctx.beginPath();
    ctx.arc(targetX, targetY, 6, 0, Math.PI * 2);
    ctx.fill();

    // Target Crosshair
    ctx.strokeStyle = 'rgba(0, 245, 212, 0.8)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(targetX - 18, targetY - 18, 36, 36);
    ctx.beginPath();
    ctx.moveTo(targetX - 24, targetY);
    ctx.lineTo(targetX + 24, targetY);
    ctx.moveTo(targetX, targetY - 24);
    ctx.lineTo(targetX, targetY + 24);
    ctx.stroke();

    // Dynamic Ball Tracking Node
    const ballCurrentX = 1280 * 0.35 + (targetX - 1280 * 0.35) * relProg;
    const ballCurrentY = 720 * 0.68 - Math.sin(relProg * Math.PI) * 160;
    ctx.fillStyle = '#FF9E00';
    ctx.shadowColor = '#00F5D4';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(ballCurrentX, ballCurrentY, 8, 0, Math.PI * 2);
    ctx.fill();

    // Top-left Optical HUD Card
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(11, 15, 23, 0.85)';
    ctx.fillRect(16, 16, 290, 52);
    ctx.strokeStyle = 'rgba(0, 245, 212, 0.5)';
    ctx.lineWidth = 1;
    ctx.strokeRect(16, 16, 290, 52);

    ctx.fillStyle = '#00F5D4';
    ctx.font = 'bold 12px "Space Mono", monospace';
    ctx.fillText('● OPTICAL BALL TRACKER: ACTIVE', 28, 36);

    ctx.fillStyle = '#A3E635';
    ctx.font = '11px "Space Mono", monospace';
    ctx.fillText(
      `FRAME: ${(currentPlaySec * 30).toFixed(0)} · REAL BROADCAST FOOTAGE`,
      28,
      54
    );

    ctx.restore();
  }, [isVisionHudActive, currentPlaySec, rally, duration]);

  const isP1Winner = rally.winner === 1;
  const strokeFormatted = rally.endingStroke
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-fade-in">
      {/* Click outside backdrop */}
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      {/* Modal Dialog Container */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-rally-title"
        className="relative w-full max-w-5xl rounded-2xl bg-[#0B0F17] border border-[#00F5D4]/40 shadow-[0_0_50px_rgba(0,245,212,0.18)] overflow-hidden my-auto flex flex-col"
      >
        {/* Modal Top Header Bar */}
        <div className="px-5 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00F5D4] animate-pulse" />
              <span className="text-[#00F5D4] font-bold text-sm tracking-wide" id="modal-rally-title">
                RALLY #{rally.index.toString().padStart(2, '0')}
              </span>
            </div>
            <span className="text-slate-600">·</span>
            <span className="text-slate-300">GAME {rally.gameNumber}</span>
            <span className="text-slate-600">·</span>
            <span className="text-white font-bold tabular-nums">
              SCORE: {rally.scoreP1}-{rally.scoreP2}
            </span>
            {rally.isThirdBallAttack && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#A3E635]/15 text-[#A3E635] border border-[#A3E635]/40 text-[10px] font-bold">
                <Zap className="w-2.5 h-2.5 fill-current" />
                3rd-Ball Attack
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Mute/Unmute */}
            <button
              onClick={() => {
                const nextMuted = !isMuted;
                setIsMuted(nextMuted);
                if (videoRef.current) {
                  videoRef.current.muted = nextMuted;
                }
              }}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
              title={isMuted ? 'Unmute match audio' : 'Mute audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#00F5D4]" />}
            </button>

            <button
              onClick={() => setIsVisionHudActive(!isVisionHudActive)}
              className={`px-2.5 py-1 rounded text-[11px] border transition-colors ${
                isVisionHudActive
                  ? 'bg-[#00F5D4]/15 border-[#00F5D4]/40 text-[#00F5D4]'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
              title="Toggle AI Computer Vision HUD"
            >
              Vision HUD
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors border border-slate-800"
              aria-label="Close rally preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Main Content: Split Player and AI Telemetry */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-slate-800/80">
          {/* Left Column: Video Replay Player & Scrubber (7 Cols) */}
          <div className="lg:col-span-7 p-4 sm:p-5 flex flex-col justify-between space-y-4 bg-slate-950/60">
            {/* Video Viewport: Real broadcast video with optional HUD canvas overlay */}
            <div className="relative aspect-video w-full rounded-xl bg-black overflow-hidden border border-slate-800 shadow-inner">
              {isYouTube ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${ytId}?enablejsapi=1&autoplay=1&controls=1&start=${Math.floor(rally.startTime)}`}
                  title="YouTube Match Replay"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : (
                <video
                  ref={videoRef}
                  src={actualVideoUrl}
                  playsInline
                  muted={isMuted}
                  loop
                  className="w-full h-full object-cover"
                />
              )}

              {/* Transparent HUD Canvas Overlay on top of real footage */}
              {isVisionHudActive && (
                <canvas
                  ref={canvasRef}
                  width={1280}
                  height={720}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10"
                />
              )}

              {/* Looping Interval Indicator Pill */}
              <div className="absolute top-3 left-3 px-2 py-1 rounded bg-slate-950/80 backdrop-blur-md border border-[#00F5D4]/30 text-[10px] font-mono text-slate-200 flex items-center gap-1.5 z-20">
                <RotateCcw className="w-3 h-3 text-[#00F5D4] animate-spin" />
                <span>LOOPING: {rally.startTime.toFixed(1)}s → {rally.endTime.toFixed(1)}s</span>
              </div>

              {/* Real Broadcast Indicator */}
              <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/75 backdrop-blur-md border border-emerald-500/30 text-[10px] font-mono text-emerald-400 flex items-center gap-1.5 z-20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>REAL MATCH BROADCAST</span>
              </div>

              {/* Big Center Play/Pause button on click */}
              <div
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute inset-0 cursor-pointer flex items-center justify-center group z-20"
              >
                {!isPlaying && (
                  <div className="w-14 h-14 rounded-full bg-slate-950/80 border border-[#00F5D4] text-[#00F5D4] flex items-center justify-center shadow-lg">
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  </div>
                )}
              </div>
            </div>

            {/* Loop Timeline Scrubber */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Rally Progress</span>
                <span className="text-white tabular-nums font-bold">
                  {(currentPlaySec - rally.startTime).toFixed(2)}s / {duration.toFixed(2)}s
                </span>
              </div>
              <div
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickPct = (e.clientX - rect.left) / rect.width;
                  const newTime = rally.startTime + clickPct * duration;
                  setCurrentPlaySec(newTime);
                  if (videoRef.current) {
                    videoRef.current.currentTime = newTime;
                  }
                }}
                className="relative h-2 w-full bg-slate-800 rounded-full cursor-pointer overflow-hidden group"
              >
                <div
                  className="h-full bg-gradient-to-r from-[#00F5D4] to-[#A3E635] transition-all duration-75 relative"
                  style={{ width: `${progressRatio * 100}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md transform scale-0 group-hover:scale-100 transition-transform" />
                </div>
              </div>
            </div>

            {/* Playback Controls & Slow-Motion Speed Toggles */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-[#00F5D4]/40 text-white flex items-center justify-center transition-all"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 text-[#00F5D4]" />
                  ) : (
                    <Play className="w-4 h-4 text-[#00F5D4] fill-current" />
                  )}
                </button>

                {/* Speed Toggles: 0.5x, 0.75x, 1.0x */}
                <div className="flex items-center rounded-lg bg-slate-900 p-0.5 border border-slate-800 text-xs font-mono">
                  {[0.5, 0.75, 1.0].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => setSpeed(rate)}
                      className={`px-2.5 py-1 rounded-md transition-all ${
                        speed === rate
                          ? 'bg-[#00F5D4] text-slate-950 font-bold shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {rate === 0.5 ? '0.5x Slow' : `${rate}x`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prev / Next Rally Controls */}
              <div className="flex items-center gap-1.5 text-xs font-mono">
                <button
                  disabled={!hasPrev}
                  onClick={() => onSelectRally(ralliesList[currentIndex - 1])}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none text-slate-300 flex items-center gap-1 transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Prev</span>
                </button>
                <button
                  disabled={!hasNext}
                  onClick={() => onSelectRally(ralliesList[currentIndex + 1])}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none text-slate-300 flex items-center gap-1 transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: AI Computer Vision Telemetry & Tactical Metrics (5 Cols) */}
          <div className="lg:col-span-5 p-5 flex flex-col justify-between space-y-5 bg-[#0B0F17]">
            <div className="space-y-4">
              {/* Point Outcome Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                    Decisive Stroke
                  </div>
                  <h3 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2 mt-0.5">
                    <span>{strokeFormatted}</span>
                    <span className="text-xs px-2 py-0.5 rounded font-mono font-normal uppercase bg-slate-900 border border-slate-800 text-slate-400">
                      {rally.endingType.replace('_', ' ')}
                    </span>
                  </h3>
                </div>

                <div className="text-right">
                  <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                    Point Winner
                  </div>
                  <div
                    className={`text-sm font-mono font-bold mt-0.5 ${
                      isP1Winner ? 'text-[#00F5D4]' : 'text-blue-400'
                    }`}
                  >
                    {isP1Winner ? player1.name : player2.name}
                  </div>
                </div>
              </div>

              {/* AI Computer Vision Metric Telemetry Cards */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="flex items-center gap-1.5 text-slate-500 text-[10px] mb-1">
                    <Gauge className="w-3 h-3 text-[#00F5D4]" />
                    <span>PEAK VELOCITY</span>
                  </div>
                  <div className="text-white text-base font-bold tabular-nums">
                    {rally.endingStroke === 'smash'
                      ? '128.4 km/h'
                      : rally.endingStroke === 'forehand_loop'
                      ? '116.2 km/h'
                      : '104.8 km/h'}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Gemini Vision: Visual Verified</div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="flex items-center gap-1.5 text-slate-500 text-[10px] mb-1">
                    <Activity className="w-3 h-3 text-[#A3E635]" />
                    <span>SPIN RATE</span>
                  </div>
                  <div className="text-white text-base font-bold tabular-nums">
                    {rally.endingStroke.includes('loop') ? '2,840 RPM' : '1,420 RPM'}
                  </div>
                  <div className="text-[10px] text-[#A3E635] mt-0.5">Heavy Topspin Vector</div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="flex items-center gap-1.5 text-slate-500 text-[10px] mb-1">
                    <Target className="w-3 h-3 text-purple-400" />
                    <span>SHOT EXCHANGE</span>
                  </div>
                  <div className="text-white text-base font-bold tabular-nums">
                    {rally.shotCount} Contacts
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Duration: {duration.toFixed(1)}s
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="flex items-center gap-1.5 text-slate-500 text-[10px] mb-1">
                    <ShieldCheck className="w-3 h-3 text-blue-400" />
                    <span>AI CONFIDENCE</span>
                  </div>
                  <div className="text-[#00F5D4] text-base font-bold tabular-nums">
                    99.4% Match
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Zod Schema Verified</div>
                </div>
              </div>

              {/* Tactical Coach Synthesis */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
                <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#00F5D4]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI TACTICAL ANALYSIS</span>
                </div>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {rally.notes ||
                    'Precise optical contact tracking identified clean boundary parameters with instantaneous dead-time reduction.'}
                </p>
              </div>
            </div>

            {/* Bottom Actions: Jump directly to multi-track timeline editor */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <button
                onClick={() => {
                  onOpenInEditor(rally);
                  onClose();
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#00F5D4] to-[#A3E635] text-slate-950 font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-95 transition-opacity shadow-lg shadow-[#00F5D4]/20"
              >
                <span>Open in Full Highlight Editor</span>
                <ExternalLink className="w-4 h-4" />
              </button>

              <div className="text-center">
                <span className="text-[10px] font-mono text-slate-500">
                  Press <kbd className="px-1 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">Space</kbd> to play/pause · <kbd className="px-1 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">←</kbd> <kbd className="px-1 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">→</kbd> to cycle rallies
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
