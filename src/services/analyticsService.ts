import { z } from 'zod';
import {
  EndingStroke,
  EndingType,
  ErrorReason,
  MatchAnalytics,
  MomentumPoint,
  PlayerStats,
  RallyInterval,
} from '../types';

export const VALID_ENDING_STROKES: EndingStroke[] = [
  'forehand_loop',
  'backhand_loop',
  'counter_drive',
  'smash',
  'chop',
  'push',
  'flick',
  'serve_ace',
  'block',
];

export const VALID_ENDING_TYPES: EndingType[] = [
  'winner',
  'unforced_error',
  'forced_error',
];

export const VALID_ERROR_REASONS: ErrorReason[] = [
  'net',
  'long',
  'wide',
  'missed_return',
  'double_bounce',
];

export const EndingStrokeSchema = z.enum([
  'forehand_loop',
  'backhand_loop',
  'counter_drive',
  'smash',
  'chop',
  'push',
  'flick',
  'serve_ace',
  'block',
]);

export const EndingTypeSchema = z.enum([
  'winner',
  'unforced_error',
  'forced_error',
]);

export const ErrorReasonSchema = z.enum([
  'net',
  'long',
  'wide',
  'missed_return',
  'double_bounce',
]);

/**
 * Normalizes any freeform stroke string to one of the 9 ITTF ending strokes.
 */
export function normalizeEndingStroke(input: unknown): EndingStroke {
  if (typeof input !== 'string') return 'forehand_loop';
  const clean = input.trim().toLowerCase().replace(/[-\s]+/g, '_');
  if (VALID_ENDING_STROKES.includes(clean as EndingStroke)) {
    return clean as EndingStroke;
  }
  if (clean.includes('backhand') || clean.includes('bh')) return 'backhand_loop';
  if (clean.includes('loop') || clean.includes('topspin') || clean.includes('forehand') || clean.includes('fh')) return 'forehand_loop';
  if (clean.includes('smash') || clean.includes('kill') || clean.includes('spike')) return 'smash';
  if (clean.includes('chop') || clean.includes('slice')) return 'chop';
  if (clean.includes('push')) return 'push';
  if (clean.includes('flick') || clean.includes('flip')) return 'flick';
  if (clean.includes('ace') || clean.includes('serve')) return 'serve_ace';
  if (clean.includes('block')) return 'block';
  if (clean.includes('drive') || clean.includes('counter')) return 'counter_drive';
  return 'forehand_loop';
}

/**
 * Normalizes outcome types into winner | unforced_error | forced_error
 */
export function normalizeEndingType(input: unknown): EndingType {
  if (typeof input !== 'string') return 'winner';
  const clean = input.trim().toLowerCase().replace(/[-\s]+/g, '_');
  if (VALID_ENDING_TYPES.includes(clean as EndingType)) {
    return clean as EndingType;
  }
  if (clean.includes('unforced') || clean.includes('error') || clean.includes('mistake') || clean.includes('miss')) {
    return 'unforced_error';
  }
  if (clean.includes('forced')) {
    return 'forced_error';
  }
  return 'winner';
}

/**
 * Normalizes error reason if provided
 */
export function normalizeErrorReason(input: unknown): ErrorReason | undefined {
  if (typeof input !== 'string') return undefined;
  const clean = input.trim().toLowerCase().replace(/[-\s]+/g, '_');
  if (VALID_ERROR_REASONS.includes(clean as ErrorReason)) {
    return clean as ErrorReason;
  }
  if (clean.includes('net')) return 'net';
  if (clean.includes('long') || clean.includes('deep')) return 'long';
  if (clean.includes('wide') || clean.includes('sideline')) return 'wide';
  if (clean.includes('miss') || clean.includes('whiff')) return 'missed_return';
  if (clean.includes('bounce')) return 'double_bounce';
  return undefined;
}

/**
 * Zod schema accepting raw Gemini API response items with flexible key formats (snake_case / camelCase).
 */
export const RawGeminiRallyInputSchema = z.object({
  start_time_seconds: z.union([z.number(), z.string()]).optional(),
  startTime: z.union([z.number(), z.string()]).optional(),
  start_time: z.union([z.number(), z.string()]).optional(),
  start: z.union([z.number(), z.string()]).optional(),

  end_time_seconds: z.union([z.number(), z.string()]).optional(),
  endTime: z.union([z.number(), z.string()]).optional(),
  end_time: z.union([z.number(), z.string()]).optional(),
  end: z.union([z.number(), z.string()]).optional(),

  shot_count: z.union([z.number(), z.string()]).optional(),
  shotCount: z.union([z.number(), z.string()]).optional(),
  shots: z.union([z.number(), z.string()]).optional(),

  server: z.union([z.number(), z.string()]).optional(),
  server_player: z.union([z.number(), z.string()]).optional(),

  winner: z.union([z.number(), z.string()]).optional(),
  winner_player: z.union([z.number(), z.string()]).optional(),

  ending_stroke: z.unknown().optional(),
  endingStroke: z.unknown().optional(),
  stroke: z.unknown().optional(),

  ending_type: z.unknown().optional(),
  endingType: z.unknown().optional(),

  error_reason: z.unknown().optional(),
  errorReason: z.unknown().optional(),

  is_third_ball_attack: z.unknown().optional(),
  isThirdBallAttack: z.unknown().optional(),

  notes: z.unknown().optional(),
  note: z.unknown().optional(),
  description: z.unknown().optional(),
}).passthrough();

export const RawGeminiBatchSchema = z.array(RawGeminiRallyInputSchema);

/**
 * Strict schema for fully formed, type-checked RallyInterval with boundary invariants.
 */
export const RallyIntervalSchema = z.object({
  id: z.string().min(1),
  index: z.number().int().positive(),
  startTime: z.number().min(0),
  endTime: z.number().min(0),
  shotCount: z.number().int().min(1),
  server: z.literal(1).or(z.literal(2)) as z.ZodType<1 | 2>,
  winner: z.literal(1).or(z.literal(2)) as z.ZodType<1 | 2>,
  endingStroke: EndingStrokeSchema,
  endingType: EndingTypeSchema,
  errorReason: ErrorReasonSchema.optional(),
  isThirdBallAttack: z.boolean().optional(),
  scoreP1: z.number().int().min(0),
  scoreP2: z.number().int().min(0),
  gameNumber: z.number().int().min(1),
  gamesWonP1: z.number().int().min(0),
  gamesWonP2: z.number().int().min(0),
  isGamePoint: z.boolean().optional(),
  isMatchPoint: z.boolean().optional(),
  excluded: z.boolean(),
  notes: z.string().optional(),
}).refine((data) => data.endTime > data.startTime, {
  message: 'Rally endTime must be strictly greater than startTime',
  path: ['endTime'],
});

export type ValidatedRallyInterval = z.infer<typeof RallyIntervalSchema>;

/**
 * Validates, sanitizes, clamps, orders, and removes overlaps from Gemini JSON output,
 * strictly transforming it into a collection of ITTF RallyInterval objects.
 *
 * Boundary consistency rules enforced:
 * 1. Positive duration: endTime > startTime (min duration 0.4s).
 * 2. Chronological ordering: sorted by startTime ascending.
 * 3. No overlaps: non-overlapping boundaries with overlap clamping or corruption drop.
 * 4. ITTF score progression: recalculates points, games, and server rotations.
 */
export function validateAndTransformGeminiRallies(rawInput: unknown): RallyInterval[] {
  let itemsToParse: unknown[] = [];

  // Parse string JSON if needed
  if (typeof rawInput === 'string') {
    const trimmed = rawInput.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        itemsToParse = parsed;
      } else if (parsed && typeof parsed === 'object') {
        const obj = parsed as Record<string, unknown>;
        if (Array.isArray(obj.rallies)) itemsToParse = obj.rallies;
        else if (Array.isArray(obj.data)) itemsToParse = obj.data;
        else if (Array.isArray(obj.intervals)) itemsToParse = obj.intervals;
      }
    } catch {
      // Handle markdown code blocks e.g. ```json [...] ``` or extract first JSON array
      const match = trimmed.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (match) {
        try {
          const parsedMatch = JSON.parse(match[0]);
          if (Array.isArray(parsedMatch)) itemsToParse = parsedMatch;
        } catch {
          return [];
        }
      } else {
        return [];
      }
    }
  } else if (Array.isArray(rawInput)) {
    itemsToParse = rawInput;
  } else if (rawInput && typeof rawInput === 'object') {
    const obj = rawInput as Record<string, unknown>;
    if (Array.isArray(obj.rallies)) itemsToParse = obj.rallies;
    else if (Array.isArray(obj.data)) itemsToParse = obj.data;
    else if (Array.isArray(obj.intervals)) itemsToParse = obj.intervals;
  }

  if (!itemsToParse || itemsToParse.length === 0) {
    return [];
  }

  interface CandidateRally {
    startTime: number;
    endTime: number;
    shotCount: number;
    server: 1 | 2;
    winner: 1 | 2;
    endingStroke: EndingStroke;
    endingType: EndingType;
    errorReason?: ErrorReason;
    isThirdBallAttack: boolean;
    notes?: string;
  }

  const MIN_DURATION = 0.4; // ITTF rallies must be at least 0.4 seconds
  const MIN_SEPARATION = 0.1; // Minimal separation between distinct points

  const candidateRallies: CandidateRally[] = [];

  // Validate and sanitize each entry individually (dropping only corrupt rallies)
  for (const rawItem of itemsToParse) {
    const result = RawGeminiRallyInputSchema.safeParse(rawItem);
    if (!result.success) {
      continue; // Drop corrupt entry
    }

    const data = result.data;

    // Extract start time
    const rawStart = data.start_time_seconds ?? data.startTime ?? data.start_time ?? data.start;
    const startNum = Number(rawStart);
    if (rawStart === undefined || rawStart === null || Number.isNaN(startNum) || !Number.isFinite(startNum)) {
      continue; // Drop corrupt entry
    }

    // Extract end time
    const rawEnd = data.end_time_seconds ?? data.endTime ?? data.end_time ?? data.end;
    const endNum = Number(rawEnd);
    if (rawEnd === undefined || rawEnd === null || Number.isNaN(endNum) || !Number.isFinite(endNum)) {
      continue; // Drop corrupt entry
    }

    // Clamp non-negative start time
    const startTime = Math.max(0, Number(startNum.toFixed(2)));
    const endTime = Math.max(0, Number(endNum.toFixed(2)));

    // Rule 1: Positive duration check (drop inverted/zero timestamp rallies)
    if (endTime <= startTime || endTime - startTime < MIN_DURATION) {
      continue; // Corrupt boundary
    }

    // Sanitize & clamp shot count
    const rawShots = data.shot_count ?? data.shotCount ?? data.shots;
    const parsedShots = Math.round(Number(rawShots));
    const shotCount = Number.isFinite(parsedShots) && parsedShots >= 1 ? Math.min(parsedShots, 99) : 4;

    // Sanitize server & winner (clamp strictly to 1 | 2)
    const rawServer = Number(data.server ?? data.server_player);
    const server: 1 | 2 = rawServer === 2 ? 2 : 1;

    const rawWinner = Number(data.winner ?? data.winner_player);
    const winner: 1 | 2 = rawWinner === 2 ? 2 : 1;

    // Normalize stroke & ending type
    const rawStroke = data.ending_stroke ?? data.endingStroke ?? data.stroke;
    const endingStroke = normalizeEndingStroke(rawStroke);

    const rawType = data.ending_type ?? data.endingType;
    const endingType = normalizeEndingType(rawType);

    const rawReason = data.error_reason ?? data.errorReason;
    const errorReason = normalizeErrorReason(rawReason);

    // 3rd ball attack
    const rawThird = data.is_third_ball_attack ?? data.isThirdBallAttack;
    const isThirdBallAttack =
      rawThird === true ||
      rawThird === 'true' ||
      rawThird === 1 ||
      (shotCount === 3 && (endingStroke === 'forehand_loop' || endingStroke === 'backhand_loop' || endingStroke === 'smash'));

    // Notes
    const rawNotes = data.notes ?? data.note ?? data.description;
    const notes = typeof rawNotes === 'string' ? rawNotes.trim().slice(0, 300) : undefined;

    candidateRallies.push({
      startTime,
      endTime,
      shotCount,
      server,
      winner,
      endingStroke,
      endingType,
      errorReason,
      isThirdBallAttack,
      notes,
    });
  }

  if (candidateRallies.length === 0) {
    return [];
  }

  // Rule 2: Chronological Ordering
  candidateRallies.sort((a, b) => a.startTime - b.startTime);

  // Rule 3: Enforce Strictly Non-Overlapping Boundaries & Positive Durations
  const nonOverlappingRallies: CandidateRally[] = [];

  for (const current of candidateRallies) {
    if (nonOverlappingRallies.length === 0) {
      nonOverlappingRallies.push(current);
      continue;
    }

    const previous = nonOverlappingRallies[nonOverlappingRallies.length - 1];

    if (current.startTime < previous.endTime) {
      // Overlap detected: sanitize/clamp or drop
      // If current rally ends before previous ended, or starts before/at previous start, it is a duplicate/corrupt sub-interval -> drop it
      if (current.endTime <= previous.endTime || current.startTime <= previous.startTime) {
        continue;
      }

      // Try clamping current.startTime to immediately after previous.endTime
      const clampedStart = Number((previous.endTime + MIN_SEPARATION).toFixed(2));
      if (current.endTime - clampedStart >= MIN_DURATION) {
        current.startTime = clampedStart;
        nonOverlappingRallies.push(current);
      } else {
        // Not enough remaining duration after clamping -> drop corrupt overlap
        continue;
      }
    } else {
      // No overlap: verify minimal separation
      if (current.endTime - current.startTime >= MIN_DURATION) {
        nonOverlappingRallies.push(current);
      }
    }
  }

  if (nonOverlappingRallies.length === 0) {
    return [];
  }

  // Transform candidates into typed RallyInterval records
  const baseRallies: RallyInterval[] = nonOverlappingRallies.map((rally, idx) => ({
    id: `rally_ai_${idx + 1}`,
    index: idx + 1,
    startTime: rally.startTime,
    endTime: rally.endTime,
    shotCount: rally.shotCount,
    server: rally.server,
    winner: rally.winner,
    endingStroke: rally.endingStroke,
    endingType: rally.endingType,
    errorReason: rally.errorReason,
    isThirdBallAttack: rally.isThirdBallAttack,
    scoreP1: 0,
    scoreP2: 0,
    gameNumber: 1,
    gamesWonP1: 0,
    gamesWonP2: 0,
    excluded: false,
    notes: rally.notes || `AI detected rally (${rally.shotCount} shots, ${rally.endingStroke.replace('_', ' ')})`,
  }));

  // Rule 4: Compute official ITTF scoring progression
  const { updatedRallies } = recalculateMatchScores(baseRallies, 1);

  // Validate each output rally strictly against RallyIntervalSchema
  const strictlyValidatedRallies: RallyInterval[] = [];
  for (const r of updatedRallies) {
    const parseResult = RallyIntervalSchema.safeParse(r);
    if (parseResult.success) {
      strictlyValidatedRallies.push(parseResult.data as RallyInterval);
    }
  }

  return strictlyValidatedRallies;
}

/**
 * Recomputes all sequential scores, servers, game numbers, and match states
 * according to official ITTF Table Tennis rules.
 */
export function recalculateMatchScores(
  rallies: RallyInterval[],
  initialServer: 1 | 2 = 1,
): { updatedRallies: RallyInterval[]; analytics: MatchAnalytics } {
  let currentGame = 1;
  let p1Score = 0;
  let p2Score = 0;
  let gamesWonP1 = 0;
  let gamesWonP2 = 0;

  // In ITTF, player who didn't serve first in Game 1 serves first in Game 2, etc.
  let gameInitialServer: 1 | 2 = initialServer;
  let currentServer: 1 | 2 = gameInitialServer;

  const gamesSummary: MatchAnalytics['gamesSummary'] = [];
  let gameStartTime = rallies[0]?.startTime || 0;

  const updatedRallies: RallyInterval[] = rallies.map((rally, idx) => {
    // Current server determination for point
    const totalPointsInGame = p1Score + p2Score;
    if (p1Score >= 10 && p2Score >= 10) {
      // Deuce: alternate every 1 point
      const pointsAfterDeuce = totalPointsInGame - 20;
      currentServer = pointsAfterDeuce % 2 === 0 ? gameInitialServer : (gameInitialServer === 1 ? 2 : 1);
    } else {
      // Normal: changes every 2 points
      const serveRotationIndex = Math.floor(totalPointsInGame / 2);
      currentServer = serveRotationIndex % 2 === 0 ? gameInitialServer : (gameInitialServer === 1 ? 2 : 1);
    }

    // Is this a Game Point before this rally starts?
    const isGamePoint =
      (p1Score >= 10 && p1Score > p2Score) || (p2Score >= 10 && p2Score > p1Score);
    const isMatchPoint =
      isGamePoint &&
      ((gamesWonP1 === 2 && p1Score > p2Score) || (gamesWonP2 === 2 && p2Score > p1Score));

    // Award point to winner
    if (rally.winner === 1) {
      p1Score += 1;
    } else {
      p2Score += 1;
    }

    const rallyRecord: RallyInterval = {
      ...rally,
      index: idx + 1,
      server: currentServer,
      gameNumber: currentGame,
      scoreP1: p1Score,
      scoreP2: p2Score,
      gamesWonP1,
      gamesWonP2,
      isGamePoint,
      isMatchPoint,
    };

    // Check if game has ended (11 points and lead by >= 2)
    const p1WonGame = p1Score >= 11 && p1Score - p2Score >= 2;
    const p2WonGame = p2Score >= 11 && p2Score - p1Score >= 2;

    if (p1WonGame || p2WonGame) {
      const winner: 1 | 2 = p1WonGame ? 1 : 2;
      if (winner === 1) gamesWonP1++;
      else gamesWonP2++;

      gamesSummary.push({
        gameNumber: currentGame,
        scoreP1: p1Score,
        scoreP2: p2Score,
        winner,
        durationSecs: Math.max(1, rally.endTime - gameStartTime),
      });

      // Prepare for next game
      currentGame++;
      p1Score = 0;
      p2Score = 0;
      gameStartTime = rally.endTime;
      gameInitialServer = gameInitialServer === 1 ? 2 : 1;
    }

    return rallyRecord;
  });

  const analytics = computeAnalytics(updatedRallies, gamesSummary);
  return { updatedRallies, analytics };
}

/**
 * Computes deep ITTF match analytics and momentum differentials.
 */
function computeAnalytics(
  rallies: RallyInterval[],
  gamesSummary: MatchAnalytics['gamesSummary'],
): MatchAnalytics {
  const activeRallies = rallies.filter((r) => !r.excluded);
  const totalRallies = rallies.length;
  const activeRalliesCount = activeRallies.length;

  let activePlayDurationSecs = 0;
  for (const r of activeRallies) {
    activePlayDurationSecs += Math.max(0, r.endTime - r.startTime);
  }

  const matchStartTime = rallies[0]?.startTime || 0;
  const matchEndTime = rallies[rallies.length - 1]?.endTime || 0;
  const totalMatchDurationSecs = Math.max(matchEndTime - matchStartTime, activePlayDurationSecs * 1.5, 60);

  const deadTimeSavedSecs = Math.max(0, totalMatchDurationSecs - activePlayDurationSecs);
  const deadTimePercent =
    totalMatchDurationSecs > 0
      ? Math.round((deadTimeSavedSecs / totalMatchDurationSecs) * 100)
      : 75;

  let totalShots = 0;
  let maxRallyLengthShots = 0;
  const lengthDist = { short: 0, medium: 0, long: 0 };

  const p1Stats: PlayerStats = {
    pointsWon: 0,
    winners: 0,
    unforcedErrors: 0,
    forcedErrors: 0,
    servePointsTotal: 0,
    servePointsWon: 0,
    serveWinPct: 0,
    receivePointsTotal: 0,
    receivePointsWon: 0,
    receiveWinPct: 0,
    thirdBallAttacksAttempted: 0,
    thirdBallAttacksWon: 0,
    thirdBallConversionPct: 0,
    forehandLoops: 0,
    backhandLoops: 0,
    smashes: 0,
  };

  const p2Stats: PlayerStats = {
    pointsWon: 0,
    winners: 0,
    unforcedErrors: 0,
    forcedErrors: 0,
    servePointsTotal: 0,
    servePointsWon: 0,
    serveWinPct: 0,
    receivePointsTotal: 0,
    receivePointsWon: 0,
    receiveWinPct: 0,
    thirdBallAttacksAttempted: 0,
    thirdBallAttacksWon: 0,
    thirdBallConversionPct: 0,
    forehandLoops: 0,
    backhandLoops: 0,
    smashes: 0,
  };

  const momentumTimeline: MomentumPoint[] = [];

  activeRallies.forEach((r, idx) => {
    totalShots += r.shotCount;
    if (r.shotCount > maxRallyLengthShots) maxRallyLengthShots = r.shotCount;

    if (r.shotCount <= 3) lengthDist.short++;
    else if (r.shotCount <= 7) lengthDist.medium++;
    else lengthDist.long++;

    const isP1 = r.winner === 1;
    const winnerStats = isP1 ? p1Stats : p2Stats;
    const loserStats = isP1 ? p2Stats : p1Stats;

    winnerStats.pointsWon++;

    if (r.endingType === 'winner') {
      winnerStats.winners++;
    } else if (r.endingType === 'unforced_error') {
      loserStats.unforcedErrors++;
    } else if (r.endingType === 'forced_error') {
      loserStats.forcedErrors++;
    }

    if (r.endingStroke === 'forehand_loop') winnerStats.forehandLoops++;
    if (r.endingStroke === 'backhand_loop') winnerStats.backhandLoops++;
    if (r.endingStroke === 'smash') winnerStats.smashes++;

    // Serve stats
    if (r.server === 1) {
      p1Stats.servePointsTotal++;
      if (r.winner === 1) p1Stats.servePointsWon++;
      p2Stats.receivePointsTotal++;
      if (r.winner === 2) p2Stats.receivePointsWon++;
    } else {
      p2Stats.servePointsTotal++;
      if (r.winner === 2) p2Stats.servePointsWon++;
      p1Stats.receivePointsTotal++;
      if (r.winner === 1) p1Stats.receivePointsWon++;
    }

    // 3rd Ball Attack tracking (shot count === 3 with attack, or flagged)
    if (r.isThirdBallAttack || (r.shotCount === 3 && (r.endingStroke === 'forehand_loop' || r.endingStroke === 'backhand_loop' || r.endingStroke === 'smash'))) {
      if (r.server === 1) {
        p1Stats.thirdBallAttacksAttempted++;
        if (r.winner === 1) p1Stats.thirdBallAttacksWon++;
      } else {
        p2Stats.thirdBallAttacksAttempted++;
        if (r.winner === 2) p2Stats.thirdBallAttacksWon++;
      }
    }

    momentumTimeline.push({
      rallyIndex: idx + 1,
      rallyId: r.id,
      timestamp: r.startTime,
      differential: r.scoreP1 - r.scoreP2,
      winner: r.winner,
      endingStroke: r.endingStroke,
      isGamePoint: !!r.isGamePoint,
      p1Score: r.scoreP1,
      p2Score: r.scoreP2,
      gameNumber: r.gameNumber,
    });
  });

  // Calculate percentages
  p1Stats.serveWinPct = p1Stats.servePointsTotal
    ? Math.round((p1Stats.servePointsWon / p1Stats.servePointsTotal) * 100)
    : 0;
  p1Stats.receiveWinPct = p1Stats.receivePointsTotal
    ? Math.round((p1Stats.receivePointsWon / p1Stats.receivePointsTotal) * 100)
    : 0;
  p1Stats.thirdBallConversionPct = p1Stats.thirdBallAttacksAttempted
    ? Math.round((p1Stats.thirdBallAttacksWon / p1Stats.thirdBallAttacksAttempted) * 100)
    : 0;

  p2Stats.serveWinPct = p2Stats.servePointsTotal
    ? Math.round((p2Stats.servePointsWon / p2Stats.servePointsTotal) * 100)
    : 0;
  p2Stats.receiveWinPct = p2Stats.receivePointsTotal
    ? Math.round((p2Stats.receivePointsWon / p2Stats.receivePointsTotal) * 100)
    : 0;
  p2Stats.thirdBallConversionPct = p2Stats.thirdBallAttacksAttempted
    ? Math.round((p2Stats.thirdBallAttacksWon / p2Stats.thirdBallAttacksAttempted) * 100)
    : 0;

  const avgRallyLengthShots =
    activeRalliesCount > 0 ? Number((totalShots / activeRalliesCount).toFixed(1)) : 0;

  return {
    totalRallies,
    activeRalliesCount,
    totalMatchDurationSecs,
    activePlayDurationSecs: Number(activePlayDurationSecs.toFixed(1)),
    deadTimeSavedSecs: Number(deadTimeSavedSecs.toFixed(1)),
    deadTimePercent,
    avgRallyLengthShots,
    maxRallyLengthShots,
    rallyLengthDistribution: lengthDist,
    p1Stats,
    p2Stats,
    momentumTimeline,
    gamesSummary,
  };
}

export function formatTimeSecs(totalSecs: number): string {
  const mins = Math.floor(totalSecs / 60);
  const secs = Math.floor(totalSecs % 60);
  const tenths = Math.floor((totalSecs % 1) * 10);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${tenths}`;
}

export function formatClockTime(totalSecs: number): string {
  const mins = Math.floor(totalSecs / 60);
  const secs = Math.floor(totalSecs % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
