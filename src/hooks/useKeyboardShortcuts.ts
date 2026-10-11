import { useCallback, useEffect } from 'react';
import { ScreenType } from '../context/RallyCutContext';

interface UseKeyboardShortcutsProps {
  setActiveScreen: (screen: ScreenType) => void;
  activeScreen: ScreenType;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  seekToRally: (id: string) => void;
  rallies: { id: string }[];
  selectedRallyId: string | null;
  setSelectedRallyId: (id: string | null) => void;
  adjustRallyBoundary?: (rallyId: string, deltaStart: number, deltaEnd: number) => void;
  toggleExcludeRally?: (rallyId: string) => void;
  overrideRallyWinner?: (rallyId: string, winner: 1 | 2) => void;
  currentTime?: number;
  setCurrentTime?: (time: number) => void;
  setIsShortcutsModalOpen?: (open: boolean) => void;
  onCloseModal?: () => void;
}

export function useKeyboardShortcuts({
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
  onCloseModal,
}: UseKeyboardShortcutsProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't interfere with active input fields
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        if (e.key === 'Escape') {
          (target as HTMLInputElement).blur();
        }
        return;
      }

      // Check current rally id
      const currentId = selectedRallyId || rallies[0]?.id;

      switch (e.key) {
        case ' ':
        case 'k':
        case 'K':
          e.preventDefault();
          setIsPlaying(!isPlaying);
          break;

        case 'j':
        case 'J':
          if (typeof currentTime === 'number' && setCurrentTime) {
            e.preventDefault();
            setCurrentTime(Math.max(0, currentTime - 1.0));
          }
          break;

        case 'l':
        case 'L':
          if (typeof currentTime === 'number' && setCurrentTime) {
            e.preventDefault();
            setCurrentTime(currentTime + 1.0);
          }
          break;

        case '[':
          if (currentId && adjustRallyBoundary) {
            e.preventDefault();
            adjustRallyBoundary(currentId, -0.2, 0);
          }
          break;

        case ']':
          if (currentId && adjustRallyBoundary) {
            e.preventDefault();
            adjustRallyBoundary(currentId, 0.2, 0);
          }
          break;

        case '{':
          if (currentId && adjustRallyBoundary) {
            e.preventDefault();
            adjustRallyBoundary(currentId, 0, -0.2);
          }
          break;

        case '}':
          if (currentId && adjustRallyBoundary) {
            e.preventDefault();
            adjustRallyBoundary(currentId, 0, 0.2);
          }
          break;

        case 'x':
        case 'X':
          if (!e.metaKey && !e.ctrlKey) {
            e.preventDefault();
            if (activeScreen === 'editor' && currentId && toggleExcludeRally) {
              toggleExcludeRally(currentId);
            } else {
              setActiveScreen('export');
            }
          }
          break;

        case '1':
          if (currentId && overrideRallyWinner && activeScreen === 'editor') {
            e.preventDefault();
            overrideRallyWinner(currentId, 1);
          }
          break;

        case '2':
          if (currentId && overrideRallyWinner && activeScreen === 'editor') {
            e.preventDefault();
            overrideRallyWinner(currentId, 2);
          }
          break;

        case 'n':
        case 'N':
        case 'ArrowRight': {
          e.preventDefault();
          const currentIdx = rallies.findIndex((r) => r.id === selectedRallyId);
          const nextIdx = Math.min(rallies.length - 1, currentIdx + 1);
          if (rallies[nextIdx]) {
            setSelectedRallyId(rallies[nextIdx].id);
            seekToRally(rallies[nextIdx].id);
          }
          break;
        }

        case 'p':
        case 'P':
        case 'ArrowLeft': {
          e.preventDefault();
          const currentIdx = rallies.findIndex((r) => r.id === selectedRallyId);
          const prevIdx = Math.max(0, currentIdx - 1);
          if (rallies[prevIdx]) {
            setSelectedRallyId(rallies[prevIdx].id);
            seekToRally(rallies[prevIdx].id);
          }
          break;
        }

        case '?':
          e.preventDefault();
          if (setIsShortcutsModalOpen) {
            setIsShortcutsModalOpen(true);
          }
          break;

        case 'e':
        case 'E':
          if (!e.metaKey && !e.ctrlKey) {
            e.preventDefault();
            setActiveScreen('editor');
          }
          break;

        case 'h':
        case 'H':
          if (!e.metaKey && !e.ctrlKey) {
            e.preventDefault();
            setActiveScreen('home');
          }
          break;

        case 'a':
        case 'A':
          if (!e.metaKey && !e.ctrlKey) {
            e.preventDefault();
            setActiveScreen('analytics');
          }
          break;

        case 'Escape':
          e.preventDefault();
          if (setIsShortcutsModalOpen) setIsShortcutsModalOpen(false);
          if (onCloseModal) onCloseModal();
          break;
      }
    },
    [
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
      setActiveScreen,
      activeScreen,
      setIsShortcutsModalOpen,
      onCloseModal,
    ]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
