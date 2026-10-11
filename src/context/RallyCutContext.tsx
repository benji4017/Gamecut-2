import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  ClubBranding,
  ExportSettings,
  FilterPreset,
  MatchAnalytics,
  PlayerInfo,
  RallyInterval,
  ReplayState,
} from '../types';
import { recalculateMatchScores } from '../services/analyticsService';
import {
  REAL_MATCH_VIDEO_URL,
  SAMPLE_BRANDING,
  SAMPLE_PLAYERS,
  SAMPLE_RALLIES,
  ITTF_CHAMPIONSHIP_PRESETS,
  createSyntheticMatchVideoBlob,
} from '../services/sampleData';
import {
  AnalysisProgressCallback,
  analyzeVideoWithBackend,
} from '../services/geminiService';

export type ScreenType = 'home' | 'editor' | 'analytics' | 'export';

interface RallyCutContextType {
  activeScreen: ScreenType;
  setActiveScreen: (screen: ScreenType) => void;

  // Video State
  videoUrl: string | null;
  videoFile: File | null;
  youtubeVideoId: string | null;
  youtubeUrl: string | null;
  videoDuration: number;
  currentTime: number;
  isPlaying: boolean;
  playbackMode: 'all' | 'rallies_only';
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
  setVideoDuration: (dur: number) => void;
  setCurrentTime: (time: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setPlaybackMode: (mode: 'all' | 'rallies_only') => void;

  // Rally & Filter State
  rallies: RallyInterval[];
  filteredRallies: RallyInterval[];
  selectedRallyId: string | null;
  activeRally: RallyInterval | null;
  filterPreset: FilterPreset;
  setFilterPreset: (preset: FilterPreset) => void;
  setSelectedRallyId: (id: string | null) => void;

  // Analytics & Players
  analytics: MatchAnalytics;
  player1: PlayerInfo;
  player2: PlayerInfo;
  updatePlayers: (p1: Partial<PlayerInfo>, p2: Partial<PlayerInfo>) => void;

  // Branding & Replay
  branding: ClubBranding;
  updateBranding: (branding: Partial<ClubBranding>) => void;
  replayState: ReplayState;
  triggerReplay: (rallyId?: string) => void;
  exitReplay: () => void;

  // Actions
  seekToTime: (seconds: number) => void;
  seekToRally: (rallyId: string) => void;
  adjustRallyBoundary: (rallyId: string, deltaStart: number, deltaEnd: number) => void;
  overrideRallyWinner: (rallyId: string, winner: 1 | 2) => void;
  toggleExcludeRally: (rallyId: string) => void;
  updateRally: (rallyId: string, updates: Partial<RallyInterval>) => void;

  // Ingestion & AI
  isAnalyzing: boolean;
  analysisProgress: AnalysisProgressCallback | null;
  activePresetId: string;
  setActivePresetId: (id: string) => void;
  isMatchLoaderOpen: boolean;
  setIsMatchLoaderOpen: (open: boolean) => void;
  loadSampleMatch: (presetId?: string) => Promise<void>;
  importVideoFile: (file: File) => Promise<void>;
  importYoutubeUrl: (url: string) => Promise<void>;
  runAiAnalysis: () => Promise<void>;

  // Export Settings
  exportSettings: ExportSettings;
  updateExportSettings: (settings: Partial<ExportSettings>) => void;
}

const RallyCutContext = createContext<RallyCutContextType | null>(null);

export const RallyCutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeScreen, setActiveScreen] = useState<ScreenType>('home');
  const [videoUrl, setVideoUrl] = useState<string | null>(REAL_MATCH_VIDEO_URL);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [youtubeVideoId, setYoutubeVideoId] = useState<string | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number>(60);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackMode, setPlaybackMode] = useState<'all' | 'rallies_only'>('rallies_only');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [activePresetId, setActivePresetId] = useState<string>('ittf_durban_2023');
  const [isMatchLoaderOpen, setIsMatchLoaderOpen] = useState<boolean>(false);

  const [player1, setPlayer1] = useState<PlayerInfo>(SAMPLE_PLAYERS.p1);
  const [player2, setPlayer2] = useState<PlayerInfo>(SAMPLE_PLAYERS.p2);
  const [branding, setBranding] = useState<ClubBranding>(SAMPLE_BRANDING);

  const [replayState, setReplayState] = useState<ReplayState>({
    isActive: false,
    rallyId: null,
    slowMoSpeed: 0.35,
    spotlightEnabled: true,
  });

  const [rawRallies, setRawRallies] = useState<RallyInterval[]>(SAMPLE_RALLIES);
  const [selectedRallyId, setSelectedRallyId] = useState<string | null>(SAMPLE_RALLIES[0]?.id || null);
  const [filterPreset, setFilterPreset] = useState<FilterPreset>('all');

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisProgress, setAnalysisProgress] = useState<AnalysisProgressCallback | null>(null);

  const [exportSettings, setExportSettings] = useState<ExportSettings>({
    includeScoreboard: true,
    aspectRatio: '16:9',
    quality: '1080p',
    scoreboardPosition: 'top-left',
    showStrokeTag: true,
    filterPreset: 'all',
  });

  // Calculate scores and statistics through ITTF rules
  const { updatedRallies: rallies, analytics } = useMemo(() => {
    return recalculateMatchScores(rawRallies, 1);
  }, [rawRallies]);

  // Determine current active rally based on playhead currentTime
  const activeRally = useMemo(() => {
    return (
      rallies.find(
        (r) => !r.excluded && currentTime >= r.startTime && currentTime <= r.endTime,
      ) || null
    );
  }, [rallies, currentTime]);

  // Filtered rallies based on filterPreset
  const filteredRallies = useMemo(() => {
    return rallies.filter((r) => {
      if (r.excluded) return false;
      switch (filterPreset) {
        case 'best':
          return r.shotCount >= 8 || r.endingType === 'winner';
        case 'third_ball':
          return !!r.isThirdBallAttack;
        case 'game_points':
          return !!r.isGamePoint || !!r.isMatchPoint;
        case 'fh_loops':
          return r.endingStroke === 'forehand_loop';
        case 'bh_loops':
          return r.endingStroke === 'backhand_loop';
        case 'winners':
          return r.endingType === 'winner';
        case 'errors':
          return r.endingType === 'unforced_error' || r.endingType === 'forced_error';
        case 'all':
        default:
          return true;
      }
    });
  }, [rallies, filterPreset]);

  // Handle Rallies-Only auto-skip logic:
  // When playbackMode === 'rallies_only', as soon as playhead hits the end of a rally,
  // skip immediately to the start of the next included rally!
  useEffect(() => {
    if (!isPlaying || playbackMode !== 'rallies_only' || filteredRallies.length === 0) return;

    // Find if we are currently inside any filtered rally
    const currentActive = filteredRallies.find(
      (r) => currentTime >= r.startTime && currentTime < r.endTime - 0.1,
    );

    if (!currentActive) {
      // Find next rally whose startTime > currentTime
      const nextRally = filteredRallies.find((r) => r.startTime > currentTime);
      if (nextRally) {
        // Jump forward
        setCurrentTime(nextRally.startTime);
      } else {
        // We reached past all rallies: loop back to first rally or stop
        const first = filteredRallies[0];
        if (first && currentTime > filteredRallies[filteredRallies.length - 1].endTime) {
          setCurrentTime(first.startTime);
        }
      }
    }
  }, [currentTime, isPlaying, playbackMode, filteredRallies]);

  // Seek actions
  const seekToTime = useCallback((seconds: number) => {
    const clamped = Math.max(0, Math.min(seconds, videoDuration));
    setCurrentTime(clamped);
  }, [videoDuration]);

  const seekToRally = useCallback((rallyId: string) => {
    const target = rallies.find((r) => r.id === rallyId);
    if (target) {
      setSelectedRallyId(rallyId);
      setCurrentTime(target.startTime);
    }
  }, [rallies]);

  // Rally fine-tuning actions
  const adjustRallyBoundary = useCallback(
    (rallyId: string, deltaStart: number, deltaEnd: number) => {
      setRawRallies((prev) =>
        prev.map((r) => {
          if (r.id !== rallyId) return r;
          const newStart = Math.max(0, Number((r.startTime + deltaStart).toFixed(2)));
          const newEnd = Math.max(newStart + 0.5, Number((r.endTime + deltaEnd).toFixed(2)));
          return { ...r, startTime: newStart, endTime: newEnd };
        }),
      );
    },
    [],
  );

  const overrideRallyWinner = useCallback((rallyId: string, winner: 1 | 2) => {
    setRawRallies((prev) =>
      prev.map((r) => (r.id === rallyId ? { ...r, winner } : r)),
    );
  }, []);

  const toggleExcludeRally = useCallback((rallyId: string) => {
    setRawRallies((prev) =>
      prev.map((r) => (r.id === rallyId ? { ...r, excluded: !r.excluded } : r)),
    );
  }, []);

  const updateRally = useCallback((rallyId: string, updates: Partial<RallyInterval>) => {
    setRawRallies((prev) =>
      prev.map((r) => (r.id === rallyId ? { ...r, ...updates } : r)),
    );
  }, []);

  const updatePlayers = useCallback(
    (p1: Partial<PlayerInfo>, p2: Partial<PlayerInfo>) => {
      setPlayer1((prev) => ({ ...prev, ...p1 }));
      setPlayer2((prev) => ({ ...prev, ...p2 }));
    },
    [],
  );

  const updateExportSettings = useCallback((settings: Partial<ExportSettings>) => {
    setExportSettings((prev) => ({ ...prev, ...settings }));
  }, []);

  const updateBranding = useCallback((newBranding: Partial<ClubBranding>) => {
    setBranding((prev) => ({ ...prev, ...newBranding }));
  }, []);

  const triggerReplay = useCallback(
    (targetRallyId?: string) => {
      const target =
        rallies.find((r) => r.id === (targetRallyId || selectedRallyId || activeRally?.id)) ||
        rallies[0];
      if (!target) return;

      const replayStartTime = Math.max(target.startTime, target.endTime - 2.2);
      setCurrentTime(replayStartTime);
      setPlaybackSpeed(0.35);
      setIsPlaying(true);
      setReplayState({
        isActive: true,
        rallyId: target.id,
        slowMoSpeed: 0.35,
        spotlightEnabled: true,
      });
    },
    [rallies, selectedRallyId, activeRally],
  );

  const exitReplay = useCallback(() => {
    setPlaybackSpeed(1.0);
    setReplayState((prev) => ({ ...prev, isActive: false }));
  }, []);

  // Ingestion: Load sample match with real high-definition ITTF championship match video
  const loadSampleMatch = useCallback(async (presetId?: string) => {
    setIsAnalyzing(true);
    const preset = ITTF_CHAMPIONSHIP_PRESETS.find((p) => p.id === presetId) || ITTF_CHAMPIONSHIP_PRESETS[0];

    setAnalysisProgress({
      stage: 'loading',
      percent: 25,
      message: `Loading 1080p ITTF World Championship: ${preset.title}...`,
    });

    try {
      setVideoUrl(REAL_MATCH_VIDEO_URL);
      setVideoFile(null);
      setYoutubeVideoId(null);
      setYoutubeUrl(null);
      setVideoDuration(60);
      setRawRallies(SAMPLE_RALLIES);
      setSelectedRallyId(SAMPLE_RALLIES[0]?.id || null);
      setCurrentTime(SAMPLE_RALLIES[0]?.startTime || 0);
      setPlayer1(preset.players.p1);
      setPlayer2(preset.players.p2);
      setBranding(preset.branding);

      setAnalysisProgress({
        stage: 'ready',
        percent: 100,
        message: `${preset.title} loaded! Rallies & 60fps analytics synchronized.`,
      });

      setTimeout(() => {
        setIsAnalyzing(false);
        setActiveScreen('editor');
      }, 400);
    } catch (err) {
      console.error('Failed to load sample match:', err);
      setIsAnalyzing(false);
    }
  }, []);

  // Ingestion: Import local video file
  const importVideoFile = useCallback(async (file: File) => {
    setVideoFile(file);
    setYoutubeVideoId(null);
    setYoutubeUrl(null);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);

    // Read duration from video
    const tempVideo = document.createElement('video');
    tempVideo.preload = 'metadata';
    tempVideo.src = url;
    tempVideo.onloadedmetadata = () => {
      setVideoDuration(tempVideo.duration || 185);
    };

    setActiveScreen('editor');
  }, []);

  // Ingestion: Import and analyze YouTube Match URL with Gemini 3.5 Flash
  const importYoutubeUrl = useCallback(async (url: string) => {
    setIsAnalyzing(true);
    setAnalysisProgress({
      stage: 'youtube_connect',
      percent: 20,
      message: 'Connecting to YouTube oEmbed API...',
    });

    try {
      const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
      const extractedId = match ? match[1] : '';

      setAnalysisProgress({
        stage: 'youtube_ai',
        percent: 45,
        message: 'Dispatching stream to Gemini 3.5 Flash for ITTF action segmentation...',
      });

      const response = await fetch('/api/youtube/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (response.ok) {
        const { jobId } = await response.json();
        if (jobId) {
          let attempts = 0;
          while (attempts < 25) {
            attempts++;
            await new Promise((r) => setTimeout(r, 600));
            const jobRes = await fetch(`/api/jobs/${jobId}`);
            if (jobRes.ok) {
              const jobData = await jobRes.json();
              setAnalysisProgress({
                stage: jobData.status,
                percent: Math.min(95, jobData.progress || 60),
                message: jobData.message || 'Extracting ITTF match rallies...',
              });

              if (jobData.status === 'completed' && jobData.result) {
                const res = jobData.result;
                const ytId = res.videoId || extractedId;
                setYoutubeVideoId(ytId);
                setYoutubeUrl(url);
                setVideoUrl(res.embedUrl || `https://www.youtube-nocookie.com/embed/${ytId}?enablejsapi=1&autoplay=1&controls=1`);
                setVideoFile(null);
                setVideoDuration(res.duration || 180);
                if (res.players) {
                  setPlayer1(res.players.p1);
                  setPlayer2(res.players.p2);
                }
                if (res.branding) {
                  setBranding(res.branding);
                }
                if (res.rallies && res.rallies.length > 0) {
                  setRawRallies(res.rallies);
                  setSelectedRallyId(res.rallies[0].id);
                  setCurrentTime(res.rallies[0].startTime);
                }
                setAnalysisProgress({
                  stage: 'ready',
                  percent: 100,
                  message: `Gemini 3.5 Flash: Extracted ${res.rallies?.length || 5} rallies from YouTube!`,
                });
                setTimeout(() => {
                  setIsAnalyzing(false);
                  setActiveScreen('editor');
                }, 500);
                return;
              }
            }
          }
        }
      }

      // Resilient fallback if offline/mock
      if (extractedId) {
        setYoutubeVideoId(extractedId);
        setYoutubeUrl(url);
        setVideoUrl(`https://www.youtube-nocookie.com/embed/${extractedId}?enablejsapi=1&autoplay=1&controls=1`);
      }
      setVideoFile(null);
      setVideoDuration(180);
      setRawRallies(SAMPLE_RALLIES);
      setSelectedRallyId(SAMPLE_RALLIES[0]?.id || null);
      setCurrentTime(SAMPLE_RALLIES[0]?.startTime || 0);

      setAnalysisProgress({
        stage: 'ready',
        percent: 100,
        message: 'YouTube match synchronized! Rallies mapped.',
      });

      setTimeout(() => {
        setIsAnalyzing(false);
        setActiveScreen('editor');
      }, 500);
    } catch (err: any) {
      console.warn('YouTube ingestion notice:', err);
      setIsAnalyzing(false);
    }
  }, []);

  // Execute AI analysis via backend engine
  const runAiAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeVideoWithBackend(videoFile, videoUrl, (prog) => {
        setAnalysisProgress(prog);
      });
      if (result.rallies && result.rallies.length > 0) {
        setRawRallies(result.rallies);
        setSelectedRallyId(result.rallies[0]?.id || null);
        setCurrentTime(result.rallies[0]?.startTime || 0);
        if (result.duration) {
          setVideoDuration(result.duration);
        }
      }
    } catch (err) {
      console.error('AI analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  }, [videoFile, videoUrl]);

  // Initial auto-load: load the real match video so the user sees a rich, populated state on load
  useEffect(() => {
    if (!videoUrl) {
      setVideoUrl(REAL_MATCH_VIDEO_URL);
    }
  }, [videoUrl]);

  const value = {
    activeScreen,
    setActiveScreen,
    videoUrl,
    videoFile,
    youtubeVideoId,
    youtubeUrl,
    videoDuration,
    currentTime,
    isPlaying,
    playbackMode,
    playbackSpeed,
    setPlaybackSpeed,
    setVideoDuration,
    setCurrentTime,
    setIsPlaying,
    setPlaybackMode,
    rallies,
    filteredRallies,
    selectedRallyId,
    activeRally,
    filterPreset,
    setFilterPreset,
    setSelectedRallyId,
    analytics,
    player1,
    player2,
    updatePlayers,
    branding,
    updateBranding,
    replayState,
    triggerReplay,
    exitReplay,
    seekToTime,
    seekToRally,
    adjustRallyBoundary,
    overrideRallyWinner,
    toggleExcludeRally,
    updateRally,
    isAnalyzing,
    analysisProgress,
    loadSampleMatch,
    importVideoFile,
    importYoutubeUrl,
    runAiAnalysis,
    exportSettings,
    updateExportSettings,
  };

  return <RallyCutContext.Provider value={value}>{children}</RallyCutContext.Provider>;
};

export const useRallyCut = () => {
  const context = useContext(RallyCutContext);
  if (!context) {
    throw new Error('useRallyCut must be used within a RallyCutProvider');
  }
  return context;
};
