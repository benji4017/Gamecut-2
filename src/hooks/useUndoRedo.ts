import { useState, useCallback, useRef } from 'react';

interface UndoRedoState<T> {
  past: T[];
  present: T;
  future: T[];
}

export function useUndoRedo<T>(initialState: T, maxHistory = 30) {
  const [state, setState] = useState<UndoRedoState<T>>({
    past: [],
    present: initialState,
    future: [],
  });

  const lastUpdateRef = useRef<number>(0);

  const set = useCallback(
    (newPresent: T | ((prev: T) => T), debounceMs = 0) => {
      const now = Date.now();

      setState((prev) => {
        const resolved =
          typeof newPresent === 'function'
            ? (newPresent as (prev: T) => T)(prev.present)
            : newPresent;

        // Debounce: skip adding to history if too recent
        const shouldAddToHistory = now - lastUpdateRef.current > debounceMs;
        lastUpdateRef.current = now;

        return {
          past: shouldAddToHistory
            ? [...prev.past, prev.present].slice(-maxHistory)
            : prev.past,
          present: resolved,
          future: [],
        };
      });
    },
    [maxHistory]
  );

  const undo = useCallback(() => {
    setState((prev) => {
      if (prev.past.length === 0) return prev;
      const newPast = [...prev.past];
      const previous = newPast.pop()!;
      return {
        past: newPast,
        present: previous,
        future: [prev.present, ...prev.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState((prev) => {
      if (prev.future.length === 0) return prev;
      const newFuture = [...prev.future];
      const next = newFuture.shift()!;
      return {
        past: [...prev.past, prev.present],
        present: next,
        future: newFuture,
      };
    });
  }, []);

  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  return {
    state: state.present,
    set,
    undo,
    redo,
    canUndo,
    canRedo,
    historyLength: state.past.length,
  };
}
