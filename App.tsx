import React, { useRef, useEffect, useState } from 'react';
import { RallyCutProvider, useRallyCut } from './src/context/RallyCutContext';
import { TopBar } from './src/components/common/TopBar';
import { HomeScreen } from './src/components/screens/HomeScreen';
import { EditorScreen } from './src/components/screens/EditorScreen';
import { MatchAnalyticsDashboard } from './src/components/analytics/MatchAnalyticsDashboard';
import { ExportScreen } from './src/components/screens/ExportScreen';
import { ErrorBoundary } from './src/components/common/ErrorBoundary';
import { ToastProvider } from './src/components/common/Toast';
import { useKeyboardShortcuts } from './src/hooks/useKeyboardShortcuts';
import { GeminiKeyModal } from './src/components/common/GeminiKeyModal';

/** Page transition wrapper (#6) */
const PageTransition: React.FC<{ screen: string; children: React.ReactNode }> = ({ screen, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const prevScreenRef = useRef(screen);

  useEffect(() => {
    if (prevScreenRef.current !== screen) {
      setIsVisible(false);
      const timer = setTimeout(() => setIsVisible(true), 30);
      prevScreenRef.current = screen;
      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
    }
  }, [screen]);

  return (
    <div
      className={`transition-all duration-300 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
    >
      {children}
    </div>
  );
};

const MainContent: React.FC = () => {
  const {
    activeScreen,
    setActiveScreen,
    isPlaying,
    setIsPlaying,
    rallies,
    selectedRallyId,
    setSelectedRallyId,
    seekToRally,
    adjustRallyBoundary,
    toggleExcludeRally,
    overrideRallyWinner,
    currentTime,
    setCurrentTime,
    setIsShortcutsModalOpen,
    importVideoFile,
  } = useRallyCut();

  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const dragCounter = useRef(0);

  // Pro Editor Keyboard shortcuts
  useKeyboardShortcuts({
    setActiveScreen,
    activeScreen,
    isPlaying,
    setIsPlaying,
    seekToRally,
    rallies,
    selectedRallyId,
    setSelectedRallyId,
    adjustRallyBoundary,
    toggleExcludeRally,
    overrideRallyWinner,
    currentTime,
    setCurrentTime,
    setIsShortcutsModalOpen,
  });

  // Global Drag-and-Drop Ingestion Listener
  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current++;
      if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
        setIsDraggingFile(true);
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current--;
      if (dragCounter.current <= 0) {
        setIsDraggingFile(false);
        dragCounter.current = 0;
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingFile(false);
      dragCounter.current = 0;

      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('video/') || file.name.match(/\.(mp4|mov|avi|mkv|webm)$/i)) {
          importVideoFile(file);
        } else {
          window.dispatchEvent(
            new CustomEvent('rallycut-toast', {
              detail: { type: 'error', message: 'Please drop a valid video file (.mp4, .mov, .webm).' },
            }),
          );
        }
      }
    };

    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('drop', handleDrop);
    };
  }, [importVideoFile]);

  return (
    <main className="relative min-h-[calc(100vh-60px)] flex flex-col bg-[#0B0F17] text-slate-100">
      {/* Full-Screen Drag & Drop Overlay */}
      {isDraggingFile && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-md border-4 border-dashed border-[#00F5D4] p-8 animate-in fade-in duration-150">
          <div className="w-20 h-20 rounded-3xl bg-[#00F5D4]/15 border border-[#00F5D4]/40 text-[#00F5D4] flex items-center justify-center mb-4 shadow-[0_0_40px_rgba(0,245,212,0.4)] animate-bounce">
            <span className="text-4xl">🏓</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Drop Match Video Here</h2>
          <p className="text-sm font-mono text-[#00F5D4] mt-1">
            Instantly ingest, extract rallies & cut all dead time
          </p>
          <span className="text-xs font-mono text-slate-400 mt-3 px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
            Supports MP4, MOV, WEBM (Up to 4K 60fps)
          </span>
        </div>
      )}

      <PageTransition screen={activeScreen}>
        {activeScreen === 'home' && <HomeScreen />}
        {activeScreen === 'editor' && <EditorScreen />}
        {activeScreen === 'analytics' && (
          <div className="py-4 px-4">
            <MatchAnalyticsDashboard />
          </div>
        )}
        {activeScreen === 'export' && <ExportScreen />}
      </PageTransition>
    </main>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <RallyCutProvider>
          <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col selection:bg-[#00F5D4] selection:text-slate-950 font-sans">
            <TopBar />
            <GeminiKeyModal />
            <KeyboardShortcutsModal />
            <MainContent />
          </div>
        </RallyCutProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}
