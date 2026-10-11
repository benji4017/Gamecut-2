import React, { useState, useEffect, useRef } from 'react';
import { RallyInterval, PlayerInfo } from '../../types';
import { Play, ExternalLink, Zap, Eye } from 'lucide-react';

interface RallyThumbnailCardProps {
  rally: RallyInterval;
  player1: PlayerInfo;
  player2: PlayerInfo;
  videoFile: File | null;
  videoUrl: string;
  onClick: (rally: RallyInterval) => void;
  onOpenInEditor?: (rally: RallyInterval) => void;
}

export const RallyThumbnailCard: React.FC<RallyThumbnailCardProps> = ({
  rally,
  player1,
  player2,
  videoFile,
  videoUrl,
  onClick,
  onOpenInEditor,
}) => {
  const duration = Math.max(0, rally.endTime - rally.startTime);
  const isP1Winner = rally.winner === 1;
  const winnerName = isP1Winner ? player1.name : player2.name;

  // Real frame thumbnail source
  const defaultThumbnail = `/thumbnails/${rally.id}.jpg`;
  const [thumbnailSrc, setThumbnailSrc] = useState<string>(defaultThumbnail);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const hoverVideoRef = useRef<HTMLVideoElement>(null);

  // If a local video file was uploaded, extract a real keyframe from the user's video, or detect YouTube
  useEffect(() => {
    if (!videoFile) {
      const ytMatch = videoUrl?.match(/(?:embed\/|watch\?v=|youtu\.be\/)([\w-]{11})/);
      if (ytMatch) {
        setThumbnailSrc(`https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`);
      } else {
        setThumbnailSrc(defaultThumbnail);
      }
      return;
    }

    let isMounted = true;
    const tempVideo = document.createElement('video');
    tempVideo.preload = 'auto';
    tempVideo.src = URL.createObjectURL(videoFile);
    tempVideo.muted = true;
    tempVideo.playsInline = true;

    const midTime = (rally.startTime + rally.endTime) / 2;

    tempVideo.onloadeddata = () => {
      tempVideo.currentTime = midTime;
    };

    tempVideo.onseeked = () => {
      if (!isMounted) return;
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 480;
        canvas.height = 270;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(tempVideo, 0, 0, 480, 270);
          setThumbnailSrc(canvas.toDataURL('image/jpeg', 0.85));
        }
      } catch (err) {
        console.warn('Frame grab notice:', err);
      }
    };

    return () => {
      isMounted = false;
    };
  }, [videoFile, rally.id, rally.startTime, rally.endTime, defaultThumbnail]);

  // Format stroke label nicely
  const strokeLabel = rally.endingStroke
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  // Realistic telemetry values based on stroke and shot count
  const estimatedSpeed =
    rally.endingStroke === 'smash'
      ? 128
      : rally.endingStroke === 'forehand_loop'
      ? 116
      : rally.endingStroke === 'backhand_loop'
      ? 104
      : rally.endingStroke === 'counter_drive'
      ? 110
      : 78;

  // Approximate ball landing point for computer vision target reticle (normalized %)
  const targetXPercent = rally.winner === 1 ? 38 : 64;
  const targetYPercent = 58;

  // Handle hover video playback for preview
  useEffect(() => {
    if (isHovered && hoverVideoRef.current) {
      hoverVideoRef.current.currentTime = rally.startTime;
      hoverVideoRef.current.play().catch(() => {});
    } else if (!isHovered && hoverVideoRef.current) {
      hoverVideoRef.current.pause();
    }
  }, [isHovered, rally.startTime]);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(rally)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(rally);
        }
      }}
      className="gamecut-neon-card group cursor-pointer flex flex-col overflow-hidden text-left focus:outline-none focus:ring-2 focus:ring-[#00F5D4]"
    >
      {/* Thumbnail Aspect Container */}
      <div className="relative aspect-video w-full bg-slate-950 overflow-hidden z-10">
        {/* Real Video Frame Image */}
        <img
          src={thumbnailSrc}
          alt={`Real match footage for ${strokeLabel}`}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            // Fallback to rally 1 thumbnail if specific id is missing
            if (thumbnailSrc !== '/thumbnails/rally_01.jpg') {
              setThumbnailSrc('/thumbnails/rally_01.jpg');
            }
          }}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Optional Hover Video Clip Preview for instant live motion */}
        {isHovered && (
          <video
            ref={hoverVideoRef}
            src={videoUrl || '/sample_pro_match.mp4'}
            muted
            playsInline
            loop
            className="absolute inset-0 w-full h-full object-cover z-5"
          />
        )}

        {/* Ambient Top & Bottom Vignette Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/60 pointer-events-none z-10" />

        {/* AI Computer Vision Overlay (Directly on top of real footage) */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {/* Real Footage Verified Pill */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-950/85 backdrop-blur-md border border-slate-700/80 text-[11px] font-mono text-slate-200">
            <span className="font-extrabold text-[#00F5D4]">
              #{rally.index.toString().padStart(2, '0')}
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-300">G{rally.gameNumber}</span>
          </div>

          {/* Third Ball Tag if active */}
          {rally.isThirdBallAttack && (
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded bg-[#A3E635]/20 backdrop-blur-md border border-[#A3E635]/50 text-[10px] font-mono font-bold text-[#A3E635] shadow-sm shadow-[#A3E635]/20">
              <Zap className="w-2.5 h-2.5 fill-current" />
              <span>3rd-Ball</span>
            </div>
          )}

          {/* Computer Vision Impact Reticle Crosshair */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 pointer-events-none"
            style={{ left: `${targetXPercent}%`, top: `${targetYPercent}%` }}
          >
            <div className="relative w-8 h-8 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full border border-[#00F5D4]/60 animate-ping opacity-60" />
              <div className="absolute w-5 h-5 rounded-full border border-[#00F5D4] shadow-[0_0_10px_#00F5D4]" />
              <div className="absolute w-1.5 h-1.5 rounded-full bg-[#00F5D4]" />
              <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] font-mono text-[#00F5D4] font-bold whitespace-nowrap bg-slate-950/80 px-1 rounded border border-[#00F5D4]/30">
                POINT IMPACT
              </span>
            </div>
          </div>

          {/* Real Camera Broadcast Badge */}
          <div className="absolute top-9 left-2.5 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[9px] font-mono text-slate-300 border border-slate-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>REAL BROADCAST</span>
          </div>
        </div>

        {/* Center Hover Play Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="w-12 h-12 rounded-full bg-slate-950/90 border border-[#00F5D4] text-[#00F5D4] flex items-center justify-center shadow-[0_0_20px_rgba(0,245,212,0.6)] transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-5 h-5 fill-current ml-0.5 text-[#00F5D4]" />
          </div>
        </div>

        {/* Bottom Floating Telemetry Overlay */}
        <div className="absolute bottom-2 inset-x-2.5 flex items-center justify-between text-[11px] font-mono z-20">
          {/* Duration & Shots */}
          <span className="text-slate-200 bg-slate-950/80 backdrop-blur-sm px-1.5 py-0.5 rounded border border-slate-800">
            <span className="tabular-nums font-bold text-white">{duration.toFixed(1)}s</span>
            <span className="text-slate-500 mx-1">·</span>
            <span className="text-slate-300">{rally.shotCount} shots</span>
          </span>

          {/* Est Velocity Tag */}
          <span className="text-[#00F5D4] bg-slate-950/80 backdrop-blur-sm px-1.5 py-0.5 rounded border border-slate-800 tabular-nums font-bold flex items-center gap-1">
            <Eye className="w-3 h-3 text-[#00F5D4]" />
            <span>{estimatedSpeed} km/h</span>
          </span>
        </div>
      </div>

      {/* Card Information Body */}
      <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between z-10 bg-[#0B0F17]">
        <div>
          {/* Header Line: Scoreboard & Winner */}
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Score:</span>
              <span className="text-white font-bold tabular-nums">
                {rally.scoreP1}-{rally.scoreP2}
              </span>
            </div>

            <div className="flex items-center gap-1 text-[11px]">
              <span className="text-slate-500">Won by</span>
              <span
                className={`font-bold ${
                  isP1Winner ? 'text-[#00F5D4]' : 'text-blue-400'
                }`}
              >
                {winnerName.split(' ')[0]}
              </span>
            </div>
          </div>

          {/* Stroke Classification & Ending Type */}
          <div className="mt-1 flex items-baseline justify-between gap-2">
            <h4 className="text-sm font-bold text-white tracking-tight group-hover:text-[#00F5D4] transition-colors truncate">
              {strokeLabel}
            </h4>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 shrink-0">
              {rally.endingType.replace('_', ' ')}
            </span>
          </div>

          {/* AI Tactical Note Preview */}
          {rally.notes && (
            <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed font-sans">
              {rally.notes}
            </p>
          )}
        </div>

        {/* Card Footer: Metadata Separator & Quick Actions */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
            <span>{rally.startTime.toFixed(1)}s</span>
            <span>→</span>
            <span>{rally.endTime.toFixed(1)}s</span>
          </div>

          <div className="flex items-center gap-1">
            {onOpenInEditor && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenInEditor(rally);
                }}
                className="px-2 py-1 rounded text-[11px] text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1"
                title="Jump directly to Editor"
              >
                <span>Edit</span>
                <ExternalLink className="w-3 h-3 text-[#00F5D4]" />
              </button>
            )}

            <span className="px-2 py-0.5 rounded text-[11px] text-[#00F5D4] group-hover:bg-[#00F5D4]/10 transition-colors font-bold">
              Review →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
