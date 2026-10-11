import { ExportSettings, PlayerInfo, RallyInterval } from '../types';
import { formatClockTime } from './analyticsService';

export interface ExportProgress {
  currentRallyIndex: number;
  totalRallies: number;
  percent: number;
  elapsedSecs: number;
  status: 'idle' | 'rendering' | 'encoding' | 'completed' | 'error';
  error?: string;
  downloadUrl?: string;
}

/**
 * Draws the TV broadcast scoreboard banner overlay onto a canvas context.
 */
export function drawBroadcastScoreboardBanner(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  rally: RallyInterval,
  p1: PlayerInfo,
  p2: PlayerInfo,
  settings: ExportSettings,
) {
  if (!settings.includeScoreboard) return;

  const isVertical = settings.aspectRatio === '9:16';
  const scale = w / 1280;

  // Banner geometry
  const boxW = Math.min(w * 0.9, (isVertical ? 480 : 420) * scale);
  const boxH = (isVertical ? 85 : 74) * scale;
  let boxX = 24 * scale;
  let boxY = 24 * scale;

  if (settings.scoreboardPosition === 'bottom-left') {
    boxY = h - boxH - 32 * scale;
  } else if (settings.scoreboardPosition === 'bottom-center') {
    boxX = (w - boxW) / 2;
    boxY = h - boxH - 32 * scale;
  }

  ctx.save();

  // Glass backdrop with border
  ctx.fillStyle = 'rgba(11, 15, 23, 0.88)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1.5 * scale;
  ctx.beginPath();
  ctx.roundRect(boxX, boxY, boxW, boxH, 10 * scale);
  ctx.fill();
  ctx.stroke();

  // Left neon brand tag
  ctx.fillStyle = '#00F5D4';
  ctx.beginPath();
  ctx.roundRect(boxX, boxY, 6 * scale, boxH, [10 * scale, 0, 0, 10 * scale]);
  ctx.fill();

  // Row 1: Player 1
  const row1Y = boxY + 28 * scale;
  // P1 Name
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `bold ${Math.round(15 * scale)}px "Plus Jakarta Sans", sans-serif`;
  ctx.textAlign = 'left';
  ctx.fillText(p1.name.toUpperCase(), boxX + 20 * scale, row1Y);

  // P1 Server paddle icon if server === 1
  if (rally.server === 1) {
    ctx.fillStyle = '#CCFF00';
    ctx.font = `bold ${Math.round(12 * scale)}px "Space Mono", monospace`;
    ctx.fillText('🏓', boxX + 175 * scale, row1Y);
  }

  // P1 Score
  ctx.fillStyle = '#00F5D4';
  ctx.font = `bold ${Math.round(20 * scale)}px "Space Mono", monospace`;
  ctx.textAlign = 'right';
  ctx.fillText(String(rally.scoreP1), boxX + boxW - 55 * scale, row1Y);

  // Row 2: Player 2
  const row2Y = boxY + 54 * scale;
  ctx.fillStyle = '#E2E8F0';
  ctx.font = `bold ${Math.round(15 * scale)}px "Plus Jakarta Sans", sans-serif`;
  ctx.textAlign = 'left';
  ctx.fillText(p2.name.toUpperCase(), boxX + 20 * scale, row2Y);

  if (rally.server === 2) {
    ctx.fillStyle = '#CCFF00';
    ctx.font = `bold ${Math.round(12 * scale)}px "Space Mono", monospace`;
    ctx.fillText('🏓', boxX + 175 * scale, row2Y);
  }

  // P2 Score
  ctx.fillStyle = '#3B82F6';
  ctx.font = `bold ${Math.round(20 * scale)}px "Space Mono", monospace`;
  ctx.textAlign = 'right';
  ctx.fillText(String(rally.scoreP2), boxX + boxW - 55 * scale, row2Y);

  // Game badge divider on the far right
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.fillRect(boxX + boxW - 44 * scale, boxY + 8 * scale, 1 * scale, boxH - 16 * scale);

  ctx.fillStyle = '#94A3B8';
  ctx.font = `bold ${Math.round(11 * scale)}px "Space Mono", monospace`;
  ctx.textAlign = 'center';
  ctx.fillText(`G${rally.gameNumber}`, boxX + boxW - 22 * scale, boxY + 28 * scale);

  // Stroke tag banner pill below main box if enabled
  if (settings.showStrokeTag) {
    const strokeName = rally.endingStroke.replace('_', ' ').toUpperCase();
    const tagText = `${strokeName} · ${rally.shotCount} SHOTS${rally.isThirdBallAttack ? ' · 3RD BALL' : ''}`;
    const tagW = Math.min(boxW, 260 * scale);
    const tagH = 22 * scale;
    const tagY = boxY + boxH + 6 * scale;

    ctx.fillStyle = 'rgba(0, 245, 212, 0.15)';
    ctx.strokeStyle = '#00F5D4';
    ctx.lineWidth = 1 * scale;
    ctx.beginPath();
    ctx.roundRect(boxX, tagY, tagW, tagH, 4 * scale);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#00F5D4';
    ctx.font = `bold ${Math.round(10 * scale)}px "Space Mono", monospace`;
    ctx.textAlign = 'left';
    ctx.fillText(tagText, boxX + 8 * scale, tagY + 15 * scale);
  }

  ctx.restore();
}

/**
 * Generates an EDL (Edit Decision List) text file for Adobe Premiere Pro / Final Cut Pro / DaVinci Resolve.
 */
export function generateEDL(rallies: RallyInterval[]): string {
  const active = rallies.filter((r) => !r.excluded);
  let edl = `TITLE: RallyCut Table Tennis Highlights\nFCM: NON-DROP FRAME\n\n`;

  active.forEach((rally, i) => {
    const eventNum = (i + 1).toString().padStart(3, '0');
    const inTime = formatClockTime(rally.startTime) + ':00';
    const outTime = formatClockTime(rally.endTime) + ':00';
    edl += `${eventNum}  AX       V     C        ${inTime} ${outTime} ${inTime} ${outTime}\n`;
    edl += `* FROM CLIP: Rally #${rally.index} - ${rally.endingStroke} (${rally.shotCount} shots)\n\n`;
  });

  return edl;
}

/**
 * Generates a clean CSV file with all rally metrics and ITTF scoring state.
 */
export function generateMatchCSV(
  rallies: RallyInterval[],
  p1Name = 'Player 1',
  p2Name = 'Player 2',
): string {
  const headers = [
    'Rally #',
    'Start Time (s)',
    'End Time (s)',
    'Duration (s)',
    'Shot Count',
    'Server',
    'Winner',
    'Ending Stroke',
    'Ending Type',
    '3rd-Ball Attack',
    `${p1Name} Score`,
    `${p2Name} Score`,
    'Game #',
    'Excluded',
    'Notes',
  ];

  const rows = rallies.map((r) => [
    r.index,
    r.startTime.toFixed(2),
    r.endTime.toFixed(2),
    (r.endTime - r.startTime).toFixed(2),
    r.shotCount,
    r.server === 1 ? p1Name : p2Name,
    r.winner === 1 ? p1Name : p2Name,
    r.endingStroke,
    r.endingType,
    r.isThirdBallAttack ? 'YES' : 'NO',
    r.scoreP1,
    r.scoreP2,
    r.gameNumber,
    r.excluded ? 'YES' : 'NO',
    `"${(r.notes || '').replace(/"/g, '""')}"`,
  ]);

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
}
