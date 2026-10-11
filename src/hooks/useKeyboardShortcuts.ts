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
  onCloseModal,
}: UseKeyboardShortcutsProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't interfere with input fields
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        // Only handle Escape in inputs
        if (e.key === 'Escape') {
          (target as HTMLInputElement).blur();
        }
        return;
      }

      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          setIsPlaying(!isPlaying);
          break;

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

        case 'e':
        case 'E':
          if (!e.metaKey && !e.ctrlKey) {
            e.preventDefault();
            setActiveScreen('editor');
          }
          break;

        case 'x':
        case 'X':
          if (!e.metaKey && !e.ctrlKey) {
            e.preventDefault();
            setActiveScreen('export');
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
          if (onCloseModal) onCloseModal();
          break;
      }
    },
    [isPlaying, setIsPlaying, rallies, selectedRallyId, setSelectedRallyId, seekToRally, setActiveScreen, activeScreen, onCloseModal]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
