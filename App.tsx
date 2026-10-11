import React from 'react';
import { RallyCutProvider, useRallyCut } from './src/context/RallyCutContext';
import { TopBar } from './src/components/common/TopBar';
import { HomeScreen } from './src/components/screens/HomeScreen';
import { EditorScreen } from './src/components/screens/EditorScreen';
import { MatchAnalyticsDashboard } from './src/components/analytics/MatchAnalyticsDashboard';
import { ExportScreen } from './src/components/screens/ExportScreen';

const MainContent: React.FC = () => {
  const { activeScreen } = useRallyCut();

  return (
    <main className="min-h-[calc(100vh-60px)] flex flex-col bg-[#0B0F17] text-slate-100">
      {activeScreen === 'home' && <HomeScreen />}
      {activeScreen === 'editor' && <EditorScreen />}
      {activeScreen === 'analytics' && (
        <div className="py-4 px-4">
          <MatchAnalyticsDashboard />
        </div>
      )}
      {activeScreen === 'export' && <ExportScreen />}
    </main>
  );
};

export default function App() {
  return (
    <RallyCutProvider>
      <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col selection:bg-[#00F5D4] selection:text-slate-950 font-sans">
        <TopBar />
        <MainContent />
      </div>
    </RallyCutProvider>
  );
}
