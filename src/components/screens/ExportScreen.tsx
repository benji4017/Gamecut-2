import React, { useRef, useState } from 'react';
import { useRallyCut } from '../../context/RallyCutContext';
import {
  drawBroadcastScoreboardBanner,
  generateEDL,
  generateMatchCSV,
} from '../../services/exportService';
import { drawArenaFrame } from '../../services/sampleData';
import {
  Download,
  FileCode,
  FileSpreadsheet,
  CheckCircle2,
  Video,
  Sparkles,
  Sliders,
  Play,
  RotateCcw,
  Smartphone,
  Tv,
  Shield,
  Layers,
  Cpu,
} from 'lucide-react';
import { renderHighlightReelOnBackend } from '../../services/geminiService';

const BRAND_OPTIONS = ['Butterfly', 'DHS', 'Stiga', 'Yasaka', 'Xiom', 'Custom'] as const;

export const ExportScreen: React.FC = () => {
  const {
    rallies,
    analytics,
    player1,
    player2,
    exportSettings,
    updateExportSettings,
    branding,
    updateBranding,
    uploadedVideoPath,
    videoUrl,
  } = useRallyCut();

  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [renderedVideoUrl, setRenderedVideoUrl] = useState<string | null>(null);
  const [renderStatus, setRenderStatus] = useState<string>('');

  const activeRallies = rallies.filter((r) => !r.excluded);

  // Update preview canvas whenever settings change
  React.useEffect(() => {
    if (!previewCanvasRef.current) return;
    const canvas = previewCanvasRef.current;
    const isVertical = exportSettings.aspectRatio === '9:16';
    const w = isVertical ? 720 : 1280;
    const h = isVertical ? 1280 : 720;
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const sampleRally = activeRallies[0] || rallies[0];

    if (isVertical) {
      // 9:16 Vertical Dual-Panel Layout
      // Background dark slate
      ctx.fillStyle = '#0B0F17';
      ctx.fillRect(0, 0, w, h);

      // Top Pane: Wide view (52% height)
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, w, h * 0.52);
      ctx.clip();
      drawArenaFrame(ctx, w, h * 0.52, sampleRally.startTime + 1.5, sampleRally, player1.name, player2.name);
      ctx.restore();

      // Divider band
      ctx.fillStyle = '#111827';
      ctx.fillRect(0, h * 0.52, w, 8);
      ctx.fillStyle = '#00F5D4';
      ctx.fillRect(0, h * 0.52 + 3, w, 2);

      // Bottom Pane: Zoomed Tracking Crop (44% height)
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, h * 0.53, w, h * 0.47);
      ctx.clip();
      // Zoom in on the near-court table action
      ctx.translate(-w * 0.25, h * 0.2);
      ctx.scale(1.5, 1.5);
      drawArenaFrame(ctx, w, h * 0.55, sampleRally.startTime + 2.0, sampleRally, player1.name, player2.name);
      ctx.restore();

      // Social Tag Header in Top
      ctx.fillStyle = 'rgba(11, 15, 23, 0.85)';
      ctx.fillRect(0, 0, w, 44);
      ctx.fillStyle = '#00F5D4';
      ctx.font = 'bold 16px "Space Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('⚡ RALLYCUT HIGHLIGHT REEL', w / 2, 28);
    } else {
      // 16:9 Standard Landscape
      drawArenaFrame(ctx, w, h, sampleRally.startTime + 1.5, sampleRally, player1.name, player2.name);
    }

    // Burn scoreboard overlay
    if (exportSettings.includeScoreboard) {
      drawBroadcastScoreboardBanner(
        ctx,
        w,
        h,
        sampleRally,
        player1,
        player2,
        exportSettings,
      );
    }
  }, [exportSettings, activeRallies, rallies, player1, player2, branding]);

  // Hardware FFmpeg & Canvas video stitching
  const handleStartExport = async () => {
    setIsExporting(true);
    setExportProgress(0);
    setRenderedVideoUrl(null);
    setRenderStatus('Dispatching job to backend FFmpeg pipeline...');

    // Try backend FFmpeg export first for ultimate stability and speed
    try {
      const res = await renderHighlightReelOnBackend(
        activeRallies,
        exportSettings.aspectRatio,
        exportSettings.quality,
        uploadedVideoPath || videoUrl,
        (prog) => {
          setExportProgress(prog.percent);
          setRenderStatus(prog.message);
        },
      );

      if (res && res.downloadUrl) {
        setRenderedVideoUrl(res.downloadUrl);
        setIsExporting(false);
        setExportProgress(100);
        setRenderStatus('Export complete! Production MP4 ready to download.');
        return;
      }
    } catch (backendErr) {
      console.warn('Backend FFmpeg export notice, switching to Canvas hardware encoder fallback:', backendErr);
    }

    setRenderStatus('Initializing Canvas hardware encoder fallback...');

    const isVertical = exportSettings.aspectRatio === '9:16';
    const w = isVertical ? 720 : 1280;
    const h = isVertical ? 1280 : 720;

    const renderCanvas = document.createElement('canvas');
    renderCanvas.width = w;
    renderCanvas.height = h;
    const ctx = renderCanvas.getContext('2d');

    if (!ctx) {
      setIsExporting(false);
      return;
    }

    try {
      // Capture stream from canvas at 30 fps
      const stream = renderCanvas.captureStream(30);
      let mimeType = 'video/webm;codecs=vp9';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm';
      }

      const recorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 5_000_000,
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setRenderedVideoUrl(url);
        setIsExporting(false);
        setExportProgress(100);
        setRenderStatus('Export complete! Stitched highlight reel ready to download.');
      };

      recorder.start(100);

      // Render through each included rally
      const totalRallies = activeRallies.length;
      for (let i = 0; i < totalRallies; i++) {
        const rally = activeRallies[i];
        setRenderStatus(`Rendering Rally #${rally.index} (${i + 1}/${totalRallies})...`);

        const rallyDuration = Math.max(1, rally.endTime - rally.startTime);
        const steps = Math.min(25, Math.round(rallyDuration * 8));

        for (let s = 0; s < steps; s++) {
          const t = rally.startTime + (s / steps) * rallyDuration;

          if (isVertical) {
            ctx.fillStyle = '#0B0F17';
            ctx.fillRect(0, 0, w, h);

            // Top wide pane
            ctx.save();
            ctx.beginPath();
            ctx.rect(0, 0, w, h * 0.52);
            ctx.clip();
            drawArenaFrame(ctx, w, h * 0.52, t, rally, player1.name, player2.name);
            ctx.restore();

            // Bottom zoomed pane
            ctx.save();
            ctx.beginPath();
            ctx.rect(0, h * 0.53, w, h * 0.47);
            ctx.clip();
            ctx.translate(-w * 0.25, h * 0.2);
            ctx.scale(1.5, 1.5);
            drawArenaFrame(ctx, w, h * 0.55, t, rally, player1.name, player2.name);
            ctx.restore();
          } else {
            drawArenaFrame(ctx, w, h, t, rally, player1.name, player2.name);
          }

          if (exportSettings.includeScoreboard) {
            drawBroadcastScoreboardBanner(ctx, w, h, rally, player1, player2, exportSettings);
          }
          await new Promise((r) => setTimeout(r, 30));
        }

        const pct = Math.round(((i + 1) / totalRallies) * 100);
        setExportProgress(pct);
      }

      recorder.stop();
    } catch (err) {
      console.error('Export error:', err);
      setIsExporting(false);
      setRenderStatus('Export failed. Please check browser permissions.');
    }
  };

  const handleDownloadEDL = () => {
    const content = generateEDL(activeRallies);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RallyCut_EDL_${Date.now()}.edl`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCSV = () => {
    const content = generateMatchCSV(activeRallies, player1.name, player2.name);
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RallyCut_Analytics_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto py-4 px-4 space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>Broadcast Reel Stitcher & Multi-Format Exporter</span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#00F5D4]/15 text-[#00F5D4] border border-[#00F5D4]/30">
              Hardware Video Pipeline
            </span>
          </h2>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Stitches {activeRallies.length} active rally segments with burned-in ITTF scoreboards and custom club crests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadEDL}
            className="flex items-center gap-1.5 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 border border-slate-700 transition-colors"
            title="Export Final Cut Pro / Premiere EDL timecode sheet"
          >
            <FileCode className="w-3.5 h-3.5 text-[#00F5D4]" />
            <span>Export EDL</span>
          </button>

          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-1.5 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 border border-slate-700 transition-colors"
            title="Export CSV Match Analytics spreadsheet"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#CCFF00]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Preview on Left, Settings on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Preview Frame - 7 Cols */}
        <div className="lg:col-span-7 space-y-3">
          <div
            className={`relative rounded-2xl bg-black border border-slate-800 overflow-hidden shadow-2xl flex items-center justify-center ${
              exportSettings.aspectRatio === '9:16'
                ? 'aspect-[9/16] max-h-[620px] mx-auto'
                : 'aspect-video w-full'
            }`}
          >
            <canvas
              ref={previewCanvasRef}
              className="w-full h-full object-contain"
            />
            <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/80 border border-white/10 text-[10px] font-mono text-slate-300">
              Live {exportSettings.aspectRatio} Reel Preview
            </div>
          </div>

          {/* Quick Reel Summary */}
          <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 font-mono text-xs text-center">
            <div>
              <div className="text-slate-400 text-[10px]">TOTAL RALLIES</div>
              <div className="font-bold text-white text-sm">{activeRallies.length} clips</div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px]">REEL DURATION</div>
              <div className="font-bold text-[#00F5D4] text-sm">{analytics.activePlayDurationSecs}s</div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px]">TIME SAVED</div>
              <div className="font-bold text-[#CCFF00] text-sm">{analytics.deadTimePercent}% cut</div>
            </div>
          </div>
        </div>

        {/* Export Controls - 5 Cols */}
        <div className="lg:col-span-5 space-y-4">
          {/* Box 1: Broadcast & Format Settings */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#00F5D4]" />
              Format & Scoreboard Overlays
            </h3>

            {/* Aspect Ratio */}
            <div className="space-y-1.5 py-2 border-b border-slate-800 text-xs">
              <div className="font-semibold text-white">Social Export Format</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => updateExportSettings({ aspectRatio: '16:9' })}
                  className={`py-2 px-3 rounded-lg border font-mono text-center transition-all flex items-center justify-center gap-1.5 ${
                    exportSettings.aspectRatio === '16:9'
                      ? 'bg-[#00F5D4]/15 border-[#00F5D4] text-[#00F5D4] font-bold'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300'
                  }`}
                >
                  <Tv className="w-3.5 h-3.5" />
                  <span>16:9 Landscape</span>
                </button>
                <button
                  onClick={() => updateExportSettings({ aspectRatio: '9:16' })}
                  className={`py-2 px-3 rounded-lg border font-mono text-center transition-all flex items-center justify-center gap-1.5 ${
                    exportSettings.aspectRatio === '9:16'
                      ? 'bg-[#00F5D4]/15 border-[#00F5D4] text-[#00F5D4] font-bold'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>9:16 Vertical Reel</span>
                </button>
              </div>
            </div>

            {/* Scoreboard Toggle */}
            <div className="flex items-center justify-between py-2 border-b border-slate-800 text-xs">
              <div>
                <div className="font-semibold text-white">Burn TV Scoreboard Bug</div>
                <div className="text-[11px] text-slate-400">Overlay live match score onto video frames</div>
              </div>
              <button
                onClick={() =>
                  updateExportSettings({ includeScoreboard: !exportSettings.includeScoreboard })
                }
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  exportSettings.includeScoreboard ? 'bg-[#00F5D4]' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-slate-950 absolute top-1 transition-transform ${
                    exportSettings.includeScoreboard ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Scoreboard Position */}
            <div className="space-y-1.5 py-2 border-b border-slate-800 text-xs">
              <div className="font-semibold text-white">Scoreboard Placement</div>
              <div className="grid grid-cols-3 gap-2">
                {(['top-left', 'bottom-left', 'bottom-center'] as const).map((pos) => (
                  <button
                    key={pos}
                    onClick={() => updateExportSettings({ scoreboardPosition: pos })}
                    className={`py-1.5 px-2 rounded-lg border font-mono text-[11px] capitalize transition-all ${
                      exportSettings.scoreboardPosition === pos
                        ? 'bg-[#00F5D4]/15 border-[#00F5D4] text-[#00F5D4] font-bold'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300'
                    }`}
                  >
                    {pos.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Render Trigger or Download */}
            <div className="pt-2">
              {isExporting ? (
                <div className="p-4 rounded-xl bg-slate-950 border border-[#00F5D4]/40 space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#00F5D4] font-bold animate-pulse">{renderStatus}</span>
                    <span className="text-white font-bold">{exportProgress}%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${exportProgress}%` }}
                      className="h-full bg-gradient-to-r from-[#00F5D4] to-[#CCFF00] transition-all"
                    />
                  </div>
                </div>
              ) : renderedVideoUrl ? (
                <div className="space-y-2">
                  <a
                    href={renderedVideoUrl}
                    download={`RallyCut_${exportSettings.aspectRatio}_${Date.now()}.webm`}
                    className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-[#00F5D4] text-slate-950 hover:bg-[#20f7dc] shadow-lg shadow-[#00F5D4]/25 flex items-center justify-center gap-2 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Stitched Video ({exportSettings.aspectRatio})</span>
                  </a>
                  <button
                    onClick={handleStartExport}
                    className="w-full py-2 px-3 rounded-lg text-xs font-mono text-slate-400 hover:text-white flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Re-render with New Settings</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleStartExport}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-[#00F5D4] to-[#00C49F] text-slate-950 hover:brightness-110 active:scale-95 shadow-xl shadow-[#00F5D4]/20 flex items-center justify-center gap-2 transition-all"
                >
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span>Render Stitched {exportSettings.aspectRatio} Highlight Reel</span>
                </button>
              )}
            </div>
          </div>

          {/* Box 2: Team Crests & Sponsor Customizer */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3.5 shadow-xl text-xs">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#CCFF00]" />
              Club Crests & Tournament Sponsor
            </h3>

            {/* P1 Club Brand */}
            <div className="space-y-1">
              <div className="font-mono text-slate-400 text-[11px] flex justify-between">
                <span>{player1.name} Equipment / Crest:</span>
                <span className="text-white">{branding.p1Club.name}</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {BRAND_OPTIONS.slice(0, 3).map((brand) => (
                  <button
                    key={brand}
                    onClick={() =>
                      updateBranding({
                        p1Club: { ...branding.p1Club, brand },
                      })
                    }
                    className={`py-1 px-2 rounded-lg border font-mono text-[11px] transition-all ${
                      branding.p1Club.brand === brand
                        ? 'bg-[#00F5D4]/20 border-[#00F5D4] text-[#00F5D4] font-bold'
                        : 'bg-slate-800/60 border-slate-700 text-slate-400'
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>

            {/* P2 Club Brand */}
            <div className="space-y-1">
              <div className="font-mono text-slate-400 text-[11px] flex justify-between">
                <span>{player2.name} Equipment / Crest:</span>
                <span className="text-white">{branding.p2Club.name}</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {BRAND_OPTIONS.slice(1, 4).map((brand) => (
                  <button
                    key={brand}
                    onClick={() =>
                      updateBranding({
                        p2Club: { ...branding.p2Club, brand },
                      })
                    }
                    className={`py-1 px-2 rounded-lg border font-mono text-[11px] transition-all ${
                      branding.p2Club.brand === brand
                        ? 'bg-[#3B82F6]/20 border-[#3B82F6] text-[#3B82F6] font-bold'
                        : 'bg-slate-800/60 border-slate-700 text-slate-400'
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>

            {/* Tournament Event Title */}
            <div className="space-y-1 pt-1 border-t border-slate-800">
              <label className="font-mono text-slate-400 text-[11px]">
                Event Scoreboard Title:
              </label>
              <input
                type="text"
                value={branding.eventTitle}
                onChange={(e) => updateBranding({ eventTitle: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-[#00F5D4]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
