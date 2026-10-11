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
  } = useRallyCut();

  // Keyboard shortcuts (#2)
  useKeyboardShortcuts({
    setActiveScreen,
    activeScreen,
    isPlaying,
    setIsPlaying,
    seekToRally,
    rallies,
    selectedRallyId,
    setSelectedRallyId,
  });

  return (
    <main className="min-h-[calc(100vh-60px)] flex flex-col bg-[#0B0F17] text-slate-100">
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
            <MainContent />
          </div>
        </RallyCutProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}
