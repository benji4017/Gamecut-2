export type EndingStroke =
  | 'forehand_loop'
  | 'backhand_loop'
  | 'counter_drive'
  | 'smash'
  | 'chop'
  | 'push'
  | 'flick'
  | 'serve_ace'
  | 'block';

export type EndingType = 'winner' | 'unforced_error' | 'forced_error';

export type ErrorReason = 'net' | 'long' | 'wide' | 'missed_return' | 'double_bounce';

export interface RallyInterval {
  id: string;
  index: number;
  startTime: number;        // in seconds (palm toss / serve initiation)
  endTime: number;          // in seconds (dead ball / double bounce)
  shotCount: number;
  server: 1 | 2;
  winner: 1 | 2;
  endingStroke: EndingStroke;
  endingType: EndingType;
  errorReason?: ErrorReason;
  isThirdBallAttack?: boolean;
  scoreP1: number;
  scoreP2: number;
  gameNumber: number;
  gamesWonP1: number;
  gamesWonP2: number;
  isGamePoint?: boolean;
  isMatchPoint?: boolean;
  excluded: boolean;
  notes?: string;
}

export interface PlayerInfo {
  id: 1 | 2;
  name: string;
  club?: string;
  blade?: string;
  style: 'Offensive (Loop)' | 'Allround' | 'Defensive (Chopper)' | 'Close-table Attacker';
  color: string;
}

export interface PlayerStats {
  pointsWon: number;
  winners: number;
  unforcedErrors: number;
  forcedErrors: number;
  servePointsTotal: number;
  servePointsWon: number;
  serveWinPct: number;
  receivePointsTotal: number;
  receivePointsWon: number;
  receiveWinPct: number;
  thirdBallAttacksAttempted: number;
  thirdBallAttacksWon: number;
  thirdBallConversionPct: number;
  forehandLoops: number;
  backhandLoops: number;
  smashes: number;
}

export interface MomentumPoint {
  rallyIndex: number;
  rallyId: string;
  timestamp: number;
  differential: number; // P1 - P2
  winner: 1 | 2;
  endingStroke: EndingStroke;
  isGamePoint: boolean;
  p1Score: number;
  p2Score: number;
  gameNumber: number;
}

export interface MatchAnalytics {
  totalRallies: number;
  activeRalliesCount: number;
  totalMatchDurationSecs: number;
  activePlayDurationSecs: number;
  deadTimeSavedSecs: number;
  deadTimePercent: number;
  avgRallyLengthShots: number;
  maxRallyLengthShots: number;
  rallyLengthDistribution: {
    short: number;   // 1-3 shots
    medium: number;  // 4-7 shots
    long: number;    // 8+ shots
  };
  p1Stats: PlayerStats;
  p2Stats: PlayerStats;
  momentumTimeline: MomentumPoint[];
  gamesSummary: {
    gameNumber: number;
    scoreP1: number;
    scoreP2: number;
    winner: 1 | 2;
    durationSecs: number;
  }[];
}

export type FilterPreset =
  | 'all'
  | 'best'            // 8+ shots or highlight winners
  | 'third_ball'      // 3rd ball attacks
  | 'game_points'     // Game / match points
  | 'fh_loops'        // Forehand loop endings
  | 'bh_loops'        // Backhand loop endings
  | 'winners'         // Clean winners
  | 'errors';         // Unforced & forced errors

export interface ClubBranding {
  p1Club: {
    name: string;
    badgeEmoji: string;
    brand: 'Butterfly' | 'DHS' | 'Stiga' | 'Yasaka' | 'Xiom' | 'Custom';
    primaryColor: string;
  };
  p2Club: {
    name: string;
    badgeEmoji: string;
    brand: 'Butterfly' | 'DHS' | 'Stiga' | 'Yasaka' | 'Xiom' | 'Custom';
    primaryColor: string;
  };
  eventTitle: string;
  tournamentSponsor: string;
}

export interface ReplayState {
  isActive: boolean;
  rallyId: string | null;
  slowMoSpeed: number; // e.g. 0.35x
  spotlightEnabled: boolean;
}

export interface ExportSettings {
  includeScoreboard: boolean;
  aspectRatio: '16:9' | '9:16';
  quality: '720p' | '1080p';
  scoreboardPosition: 'top-left' | 'bottom-left' | 'bottom-center';
  showStrokeTag: boolean;
  filterPreset: FilterPreset;
  includeSlowMoReplays?: boolean;
}

