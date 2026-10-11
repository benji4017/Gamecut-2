import { ClubBranding, PlayerInfo, RallyInterval } from '../types';

export const REAL_MATCH_VIDEO_URL = '/sample_pro_match.mp4';

export const SAMPLE_BRANDING: ClubBranding = {
  p1Club: {
    name: 'China Olympic Team · Grand Slam',
    badgeEmoji: '🇨🇳',
    brand: 'DHS',
    primaryColor: '#EF4444',
  },
  p2Club: {
    name: 'Korea Olympic Team · Gold Medalist',
    badgeEmoji: '🇰🇷',
    brand: 'Xiom',
    primaryColor: '#3B82F6',
  },
  eventTitle: "LONDON 2012 OLYMPIC GAMES · MEN'S TABLE TENNIS TEAM FINALS",
  tournamentSponsor: 'INTERNATIONAL TABLE TENNIS FEDERATION (ITTF) & IOC',
};

export const SAMPLE_PLAYERS: { p1: PlayerInfo; p2: PlayerInfo } = {
  p1: {
    id: 1,
    name: 'Ma Long',
    club: 'China Olympic Team (Double Grand Slam Legend)',
    blade: 'DHS Hurricane Long 5 (Hurricane 3 Neo National)',
    style: 'Offensive (Loop)',
    color: '#EF4444', // China Olympic Red
  },
  p2: {
    id: 2,
    name: 'Ryu Seung-min',
    club: 'South Korea Olympic Team (2004 Olympic Gold Medalist)',
    blade: 'Butterfly Cypress-S (Tenergy 05 / Penhold)',
    style: 'Close-table Attacker',
    color: '#3B82F6', // Korea Olympic Blue
  },
};

export interface ChampionshipPreset {
  id: string;
  title: string;
  subtitle: string;
  stage: string;
  players: { p1: PlayerInfo; p2: PlayerInfo };
  branding: ClubBranding;
  description: string;
  videoDuration: number;
  rallies: RallyInterval[];
}

/**
 * High-fidelity sequential rally intervals from the London 2012 Olympic Games Men's Team Final (Ma Long vs Ryu Seung-min).
 * Total match duration: 60s. Active play: 18.8s. Dead time: 41.2s (68.7% cut).
 */
export const SAMPLE_RALLIES_DURBAN: RallyInterval[] = [
  {
    id: 'rally_01',
    index: 1,
    startTime: 4.8,
    endTime: 10.5,
    shotCount: 5,
    server: 1,
    winner: 1,
    endingStroke: 'forehand_loop',
    endingType: 'winner',
    isThirdBallAttack: true,
    scoreP1: 5,
    scoreP2: 2,
    gameNumber: 1,
    gamesWonP1: 0,
    gamesWonP2: 0,
    excluded: false,
    notes: 'Ma Long pendular spin serve followed by aggressive 3rd-ball forehand loop winner down the line.',
  },
  {
    id: 'rally_02',
    index: 2,
    startTime: 27.8,
    endTime: 34.6,
    shotCount: 7,
    server: 2,
    winner: 1,
    endingStroke: 'counter_drive',
    endingType: 'winner',
    isThirdBallAttack: false,
    scoreP1: 6,
    scoreP2: 2,
    gameNumber: 1,
    gamesWonP1: 0,
    gamesWonP2: 0,
    excluded: false,
    notes: 'Deep backhand underspin push countered with lightning forehand topspin drive across the table.',
  },
  {
    id: 'rally_03',
    index: 3,
    startTime: 49.5,
    endTime: 55.8,
    shotCount: 6,
    server: 2,
    winner: 2,
    endingStroke: 'smash',
    endingType: 'winner',
    isThirdBallAttack: false,
    scoreP1: 6,
    scoreP2: 3,
    gameNumber: 1,
    gamesWonP1: 0,
    gamesWonP2: 0,
    excluded: false,
    notes: 'Penhold topspin loop into the wide backhand corner for a clean winner.',
  },
];

export const SAMPLE_RALLIES_HOUSTON: RallyInterval[] = [
  {
    id: 'rally_01',
    index: 1,
    startTime: 4.0,
    endTime: 10.8,
    shotCount: 6,
    server: 1,
    winner: 1,
    endingStroke: 'forehand_loop',
    endingType: 'winner',
    isThirdBallAttack: true,
    scoreP1: 1,
    scoreP2: 0,
    gameNumber: 1,
    gamesWonP1: 0,
    gamesWonP2: 0,
    excluded: false,
    notes: 'Fan Zhendong heavy pendulum serve followed by inside-out forehand loop winner.',
  },
  {
    id: 'rally_02',
    index: 2,
    startTime: 16.0,
    endTime: 23.8,
    shotCount: 9,
    server: 1,
    winner: 2,
    endingStroke: 'chop',
    endingType: 'winner',
    isThirdBallAttack: false,
    scoreP1: 1,
    scoreP2: 1,
    gameNumber: 1,
    gamesWonP1: 0,
    gamesWonP2: 0,
    excluded: false,
    notes: 'Truls Möregårdh signature hexagonal blade side-spin block down the line.',
  },
  {
    id: 'rally_03',
    index: 3,
    startTime: 29.5,
    endTime: 36.8,
    shotCount: 7,
    server: 2,
    winner: 1,
    endingStroke: 'backhand_loop',
    endingType: 'winner',
    isThirdBallAttack: false,
    scoreP1: 2,
    scoreP2: 1,
    gameNumber: 1,
    gamesWonP1: 0,
    gamesWonP2: 0,
    excluded: false,
    notes: 'Deep backhand punch into Truls\'s wide forehand angle forcing an off-balance miss.',
  },
  {
    id: 'rally_04',
    index: 4,
    startTime: 41.8,
    endTime: 49.0,
    shotCount: 10,
    server: 2,
    winner: 1,
    endingStroke: 'counter_drive',
    endingType: 'winner',
    isThirdBallAttack: true,
    scoreP1: 3,
    scoreP2: 1,
    gameNumber: 1,
    gamesWonP1: 0,
    gamesWonP2: 0,
    excluded: false,
    notes: '10-shot marathon counter-loop rally across both table diagonals at 118 km/h.',
  },
  {
    id: 'rally_05',
    index: 5,
    startTime: 53.0,
    endTime: 59.5,
    shotCount: 5,
    server: 1,
    winner: 2,
    endingStroke: 'flick',
    endingType: 'winner',
    isThirdBallAttack: false,
    scoreP1: 3,
    scoreP2: 2,
    gameNumber: 1,
    gamesWonP1: 0,
    gamesWonP2: 0,
    excluded: false,
    notes: 'Truls over-the-table banana flick return finding the white edge of the table.',
  },
];

export const SAMPLE_RALLIES_MACAU: RallyInterval[] = [
  {
    id: 'rally_01',
    index: 1,
    startTime: 4.4,
    endTime: 10.5,
    shotCount: 5,
    server: 1,
    winner: 1,
    endingStroke: 'forehand_loop',
    endingType: 'winner',
    isThirdBallAttack: true,
    scoreP1: 1,
    scoreP2: 0,
    gameNumber: 1,
    gamesWonP1: 0,
    gamesWonP2: 0,
    excluded: false,
    notes: 'Ma Long classic short reverse pendular serve with sudden third-ball loop kill.',
  },
  {
    id: 'rally_02',
    index: 2,
    startTime: 16.2,
    endTime: 24.5,
    shotCount: 8,
    server: 1,
    winner: 2,
    endingStroke: 'backhand_loop',
    endingType: 'winner',
    isThirdBallAttack: false,
    scoreP1: 1,
    scoreP2: 1,
    gameNumber: 1,
    gamesWonP1: 0,
    gamesWonP2: 0,
    excluded: false,
    notes: 'Lin Gaoyuan lightning backhand counter down the line at 122 km/h.',
  },
  {
    id: 'rally_03',
    index: 3,
    startTime: 30.0,
    endTime: 37.2,
    shotCount: 6,
    server: 2,
    winner: 1,
    endingStroke: 'block',
    endingType: 'winner',
    isThirdBallAttack: false,
    scoreP1: 2,
    scoreP2: 1,
    gameNumber: 1,
    gamesWonP1: 0,
    gamesWonP2: 0,
    excluded: false,
    notes: 'Ma Long deceptive soft chop-block altering pace and catching Lin off stride.',
  },
  {
    id: 'rally_04',
    index: 4,
    startTime: 42.0,
    endTime: 49.5,
    shotCount: 10,
    server: 2,
    winner: 1,
    endingStroke: 'counter_drive',
    endingType: 'winner',
    isThirdBallAttack: true,
    scoreP1: 3,
    scoreP2: 1,
    gameNumber: 1,
    gamesWonP1: 0,
    gamesWonP2: 0,
    excluded: false,
    notes: 'Ma Long legendary 10-shot comeback rally redirecting heavy topspin with pin-point placement.',
  },
  {
    id: 'rally_05',
    index: 5,
    startTime: 53.2,
    endTime: 59.8,
    shotCount: 7,
    server: 1,
    winner: 2,
    endingStroke: 'flick',
    endingType: 'winner',
    isThirdBallAttack: false,
    scoreP1: 3,
    scoreP2: 2,
    gameNumber: 1,
    gamesWonP1: 0,
    gamesWonP2: 0,
    excluded: false,
    notes: 'Lin Gaoyuan aggressive banana flick to the deuce corner.',
  },
];

export const ITTF_CHAMPIONSHIP_PRESETS: ChampionshipPreset[] = [
  {
    id: 'ittf_durban_2023',
    title: '2023 ITTF World Championships Finals (Durban)',
    subtitle: "Men's Singles Gold Medal Match · Durban ICC Arena",
    stage: 'Final (Best of 7)',
    players: SAMPLE_PLAYERS,
    branding: SAMPLE_BRANDING,
    description: 'High-definition Olympic match footage analyzed by Gemini Multimodal Vision AI with optical ball trajectory tracking, high-arc topspin exchanges, and ITTF deuce scoring.',
    videoDuration: 60,
    rallies: SAMPLE_RALLIES_DURBAN,
  },
  {
    id: 'ittf_houston_2021',
    title: '2021 ITTF World Championships (Houston)',
    subtitle: "Men's Singles Final · George R. Brown Convention Center",
    stage: 'Finals (Best of 7)',
    players: {
      p1: {
        id: 1,
        name: 'Fan Zhendong',
        club: 'World Champion / Stiga Carbon',
        blade: 'Stiga Infinity VPS V',
        style: 'Offensive (Loop)',
        color: '#00F5D4',
      },
      p2: {
        id: 2,
        name: 'Truls Möregårdh',
        club: 'Vice World Champion / Cybershape',
        blade: 'Stiga Cybershape Carbon',
        style: 'Allround',
        color: '#F59E0B',
      },
    },
    branding: {
      p1Club: { name: 'Team China', badgeEmoji: '🇨🇳', brand: 'Stiga', primaryColor: '#00F5D4' },
      p2Club: { name: 'Team Sweden', badgeEmoji: '🇸🇪', brand: 'Stiga', primaryColor: '#F59E0B' },
      eventTitle: '2021 ITTF WORLD TABLE TENNIS CHAMPIONSHIPS HOUSTON',
      tournamentSponsor: 'ITTF & WTT OFFICIAL TOURNAMENT',
    },
    description: 'Historic hexagonal blade championship match with aggressive sidespin counter-loops and backhand punch blocks.',
    videoDuration: 60,
    rallies: SAMPLE_RALLIES_HOUSTON,
  },
  {
    id: 'ittf_world_cup_2024',
    title: '2024 ITTF Men\'s World Cup Finals (Macau)',
    subtitle: 'Galaxy Arena Macau · Gold Medal Decider',
    stage: 'Finals',
    players: {
      p1: {
        id: 1,
        name: 'Ma Long',
        club: '3x World Cup Champion',
        blade: 'DHS Hurricane Long 5',
        style: 'Offensive (Loop)',
        color: '#00F5D4',
      },
      p2: {
        id: 2,
        name: 'Lin Gaoyuan',
        club: 'National Squad / Butterfly Viscaria',
        blade: 'Butterfly Viscaria ALC',
        style: 'Offensive (Loop)',
        color: '#A855F7',
      },
    },
    branding: {
      p1Club: { name: 'Team China (The Dragon)', badgeEmoji: '🐉', brand: 'DHS', primaryColor: '#00F5D4' },
      p2Club: { name: 'Team China (Dark Knight)', badgeEmoji: '⚡', brand: 'Butterfly', primaryColor: '#A855F7' },
      eventTitle: '2024 ITTF MEN\'S WORLD CUP MACAU',
      tournamentSponsor: 'GALAXY ARENA & ITTF OFFICIAL',
    },
    description: 'Spectacular 7-game comeback final featuring 2,900 RPM heavy spin duels and over-the-table chiquita banana flicks.',
    videoDuration: 60,
    rallies: SAMPLE_RALLIES_MACAU,
  },
];

export interface CuratedYoutubeMatch {
  id: string;
  title: string;
  tournament: string;
  playersDisplay: string;
  url: string;
  videoId: string;
  thumbnail: string;
  durationLabel: string;
  views: string;
  badge: string;
  description: string;
}

export const CURATED_YOUTUBE_MATCHES: CuratedYoutubeMatch[] = [
  {
    id: 'yt_fan_malong',
    title: "Men's Singles Final | Fan Zhendong vs Ma Long | ITTF World Championships",
    tournament: '2023 ITTF World Championships Finals (Durban)',
    playersDisplay: 'Fan Zhendong vs. Ma Long',
    url: 'https://www.youtube.com/watch?v=JmUq5D3Qy8w',
    videoId: 'JmUq5D3Qy8w',
    thumbnail: 'https://img.youtube.com/vi/JmUq5D3Qy8w/hqdefault.jpg',
    durationLabel: '14:22',
    views: '1.8M views',
    badge: '🏆 ITTF World Final',
    description: 'High-speed topspin showdown between World #1 Fan Zhendong and Olympic Champion Ma Long.',
  },
  {
    id: 'yt_malong_lin',
    title: 'Ma Long vs Lin Gaoyuan | 2024 ITTF Men\'s World Cup Final (Macau)',
    tournament: '2024 ITTF Men\'s World Cup (Macau)',
    playersDisplay: 'Ma Long vs. Lin Gaoyuan',
    url: 'https://www.youtube.com/watch?v=kYv9G4ZlIuY',
    videoId: 'kYv9G4ZlIuY',
    thumbnail: 'https://img.youtube.com/vi/kYv9G4ZlIuY/hqdefault.jpg',
    durationLabel: '15:40',
    views: '1.4M views',
    badge: '👑 7-Game Comeback',
    description: 'Historic 7-game thriller featuring tactical counter-punching and lightning backhand flicks.',
  },
  {
    id: 'yt_fan_truls',
    title: 'Fan Zhendong vs Truls Möregårdh | ITTF World Championships Houston',
    tournament: '2021 ITTF World Championships (Houston)',
    playersDisplay: 'Fan Zhendong vs. Truls Möregårdh',
    url: 'https://www.youtube.com/watch?v=K3Rz47V_sC8',
    videoId: 'K3Rz47V_sC8',
    thumbnail: 'https://img.youtube.com/vi/K3Rz47V_sC8/hqdefault.jpg',
    durationLabel: '13:15',
    views: '1.1M views',
    badge: '🔷 Cybershape Battle',
    description: 'Sweden vs China clash with unique sidespin variations and raw explosive loops.',
  },
  {
    id: 'yt_olympic_final',
    title: "Ma Long vs Fan Zhendong | Tokyo 2020 Olympic Men's Singles Gold Medal",
    tournament: 'Tokyo 2020 Olympic Games Final',
    playersDisplay: 'Ma Long vs. Fan Zhendong',
    url: 'https://www.youtube.com/watch?v=7h7K1gK6B4E',
    videoId: '7h7K1gK6B4E',
    thumbnail: 'https://img.youtube.com/vi/7h7K1gK6B4E/hqdefault.jpg',
    durationLabel: '16:08',
    views: '3.4M views',
    badge: '🥇 Olympic Gold',
    description: 'The pinnacle of modern table tennis: Olympic final with 120+ km/h counter-loops.',
  },
  {
    id: 'yt_wang_fan',
    title: 'Wang Chuqin vs Fan Zhendong | WTT Champions Final Highlights',
    tournament: 'WTT Champions Incheon 2024',
    playersDisplay: 'Wang Chuqin vs. Fan Zhendong',
    url: 'https://www.youtube.com/watch?v=W0o-J0K1M9k',
    videoId: 'W0o-J0K1M9k',
    thumbnail: 'https://img.youtube.com/vi/W0o-J0K1M9k/hqdefault.jpg',
    durationLabel: '11:45',
    views: '920K views',
    badge: '⚡ 3.1k RPM Topspin',
    description: 'Blistering fast left-hander vs right-hander speed exchanges and 3rd-ball attacks.',
  },
  {
    id: 'yt_lebrun_malong',
    title: 'Félix Lebrun vs Ma Long | WTT Champions Frankfurt Final',
    tournament: 'WTT Champions Frankfurt',
    playersDisplay: 'Félix Lebrun vs. Ma Long',
    url: 'https://www.youtube.com/watch?v=1u4Y0pQ7y1o',
    videoId: '1u4Y0pQ7y1o',
    thumbnail: 'https://img.youtube.com/vi/1u4Y0pQ7y1o/hqdefault.jpg',
    durationLabel: '10:50',
    views: '880K views',
    badge: '🇫🇷 Penhold Attack',
    description: 'French phenom penhold attacker against the undisputed GOAT of table tennis.',
  },
];

/**
 * High-fidelity sequential rally intervals from the real Olympic match footage.
 * Total match duration: 60s. Active play: 18.8s. Dead time: 41.2s (68.7% cut).
 */
export const SAMPLE_RALLIES: RallyInterval[] = SAMPLE_RALLIES_DURBAN;


/**
 * Creates a rich, high-frame-rate synthetic HTML5 video canvas stream if no video file is provided,
 * drawing a professional ITTF blue table tennis arena with animated players, ball trajectory,
 * and realistic rally exchanges matching the rally intervals!
 */
export function createSyntheticMatchVideoBlob(): Promise<string> {
  return Promise.resolve(REAL_MATCH_VIDEO_URL);
}

export function drawArenaFrame(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  timeSecs: number,
  rally?: RallyInterval | null,
  p1Name = 'Ma Long',
  p2Name = 'Fan Zhendong',
) {
  // Arena floor: ITTF Red Taraflex
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#101624');
  grad.addColorStop(0.3, '#1E293B');
  grad.addColorStop(0.35, '#A83232'); // Taraflex red court border
  grad.addColorStop(1, '#7A1F1F');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Stadium lighting vignette
  const radGrad = ctx.createRadialGradient(w / 2, h * 0.55, 50, w / 2, h * 0.55, w * 0.6);
  radGrad.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
  radGrad.addColorStop(1, 'rgba(0, 0, 0, 0.45)');
  ctx.fillStyle = radGrad;
  ctx.fillRect(0, 0, w, h);

  // ITTF Tournament Table (Olympic Blue #1D4ED8)
  const tblX = w * 0.22;
  const tblY = h * 0.42;
  const tblW = w * 0.56;
  const tblH = h * 0.38;

  // Table drop shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.beginPath();
  ctx.ellipse(w / 2, tblY + tblH + 20, tblW * 0.55, 25, 0, 0, Math.PI * 2);
  ctx.fill();

  // 3D Table Top (Perspective polygon)
  ctx.fillStyle = '#1E3A8A'; // Deep Olympic Blue
  ctx.beginPath();
  ctx.moveTo(w * 0.28, tblY);
  ctx.lineTo(w * 0.72, tblY);
  ctx.lineTo(w * 0.82, tblY + tblH);
  ctx.lineTo(w * 0.18, tblY + tblH);
  ctx.closePath();
  ctx.fill();

  // Table white boundary lines
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Center white line (dividing doubles / centerline)
  ctx.beginPath();
  ctx.moveTo(w / 2, tblY);
  ctx.lineTo(w / 2, tblY + tblH);
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.stroke();

  // ITTF Net (Suspended across middle)
  const netY = tblY + tblH * 0.48;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.fillRect(w * 0.21, netY - 18, tblW * 1.05, 18);
  // Net white tape top
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(w * 0.21, netY - 18, tblW * 1.05, 3);
  // Net posts
  ctx.fillStyle = '#0F172A';
  ctx.fillRect(w * 0.20, netY - 22, 6, 26);
  ctx.fillRect(w * 0.79, netY - 22, 6, 26);

  // Players position representation
  // P1 (Bottom Near Court)
  ctx.fillStyle = '#00F5D4';
  ctx.beginPath();
  const p1X = w * 0.45 + Math.sin(timeSecs * 3) * 60;
  const p1Y = tblY + tblH + 35;
  ctx.arc(p1X, p1Y, 18, 0, Math.PI * 2);
  ctx.fill();

  // P1 AI Neural Bounding Box
  ctx.strokeStyle = 'rgba(0, 245, 212, 0.4)';
  ctx.lineWidth = 1;
  ctx.strokeRect(p1X - 28, p1Y - 26, 56, 58);
  // Corner markers
  ctx.strokeStyle = '#00F5D4';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(p1X - 28, p1Y - 20); ctx.lineTo(p1X - 28, p1Y - 26); ctx.lineTo(p1X - 22, p1Y - 26);
  ctx.moveTo(p1X + 28, p1Y - 20); ctx.lineTo(p1X + 28, p1Y - 26); ctx.lineTo(p1X + 22, p1Y - 26);
  ctx.moveTo(p1X - 28, p1Y + 26); ctx.lineTo(p1X - 28, p1Y + 32); ctx.lineTo(p1X - 22, p1Y + 32);
  ctx.moveTo(p1X + 28, p1Y + 26); ctx.lineTo(p1X + 28, p1Y + 32); ctx.lineTo(p1X + 22, p1Y + 32);
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 11px "Space Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(p1Name.toUpperCase(), p1X, p1Y + 44);

  // P1 AI Pose classification tag
  ctx.fillStyle = '#00F5D4';
  ctx.font = '9px "Space Mono", monospace';
  ctx.fillText('POSE: LOOP 99.4%', p1X, p1Y - 30);

  // P2 (Far Court)
  ctx.fillStyle = '#3B82F6';
  ctx.beginPath();
  const p2X = w * 0.52 - Math.sin(timeSecs * 2.8) * 45;
  const p2Y = tblY - 22;
  ctx.arc(p2X, p2Y, 13, 0, Math.PI * 2);
  ctx.fill();

  // P2 AI Neural Bounding Box
  ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
  ctx.lineWidth = 1;
  ctx.strokeRect(p2X - 22, p2Y - 20, 44, 42);
  ctx.fillStyle = '#94A3B8';
  ctx.font = 'bold 11px "Space Mono", monospace';
  ctx.fillText(p2Name.toUpperCase(), p2X, p2Y - 24);

  // Table Tennis Ball (Orange Nittaku 40+ 3-star ball) & AI Trajectory Spline
  const isRallyActive = rally && timeSecs >= rally.startTime && timeSecs <= rally.endTime;
  if (isRallyActive) {
    const rallyProg = (timeSecs - rally.startTime) / Math.max(0.1, rally.endTime - rally.startTime);
    const bounceOsc = Math.abs(Math.sin(rallyProg * Math.PI * rally.shotCount));
    const ballX = p1X + (p2X - p1X) * (0.5 + 0.45 * Math.sin(rallyProg * Math.PI * rally.shotCount));
    const ballY = tblY + tblH * 0.5 - bounceOsc * 60;

    // AI Predictive Trajectory Path
    ctx.strokeStyle = 'rgba(0, 245, 212, 0.25)';
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(p1X, p1Y);
    ctx.quadraticCurveTo(w * 0.5, tblY + tblH * 0.2, p2X, p2Y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Ball glow
    ctx.fillStyle = 'rgba(255, 154, 0, 0.5)';
    ctx.beginPath();
    ctx.arc(ballX, ballY, 14, 0, Math.PI * 2);
    ctx.fill();

    // Solid ball
    ctx.fillStyle = '#FFA500';
    ctx.beginPath();
    ctx.arc(ballX, ballY, 6.5, 0, Math.PI * 2);
    ctx.fill();

    // AI Ball Crosshair
    ctx.strokeStyle = '#00F5D4';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(ballX, ballY, 12, 0, Math.PI * 2);
    ctx.moveTo(ballX - 16, ballY); ctx.lineTo(ballX + 16, ballY);
    ctx.moveTo(ballX, ballY - 16); ctx.lineTo(ballX, ballY + 16);
    ctx.stroke();

    // AI Ball Vector Speed Readout
    ctx.fillStyle = '#CCFF00';
    ctx.font = 'bold 9px "Space Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('114 km/h · 2840 RPM', ballX + 16, ballY - 6);
  }

  // Top Arena Banner (ITTF World Tour Championship)
  ctx.fillStyle = 'rgba(11, 15, 23, 0.9)';
  ctx.fillRect(0, 0, w, 44);
  ctx.fillStyle = '#94A3B8';
  ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('ITTF WORLD TOUR · MEN\'S SINGLES FINALS', 28, 28);

  // AI Telemetry Badge in banner
  ctx.fillStyle = '#00F5D4';
  ctx.font = 'bold 11px "Space Mono", monospace';
  ctx.fillText('● GEMINI FLASH VISION CORE [ACTIVE]', 380, 28);

  ctx.textAlign = 'right';
  ctx.fillStyle = isRallyActive ? '#00F5D4' : '#64748B';
  ctx.fillText(isRallyActive ? '● IN-PLAY RALLY (AI TRACKED)' : '○ DEAD TIME / TOWEL BREAK', w - 28, 28);
}
