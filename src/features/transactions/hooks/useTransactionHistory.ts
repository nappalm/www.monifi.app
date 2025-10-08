import { Tables } from "@/lib/supabase/database.types";
import { useCallback, useRef, useState } from "react";

interface TransactionHistoryState {
  transaction: Tables<"transactions">;
  previousState: Tables<"transactions">;
}

export function useTransactionHistory() {
  const [history, setHistory] = useState<TransactionHistoryState[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const isUndoRedoAction = useRef(false);

  const addToHistory = useCallback(
    (transaction: Tables<"transactions">, previousState: Tables<"transactions">) => {
      // No agregar al historial si es una acción de undo/redo
      if (isUndoRedoAction.current) {
        isUndoRedoAction.current = false;
        return;
      }

      // Eliminar historial futuro si estamos en medio del stack
      const newHistory = history.slice(0, currentIndex + 1);

      setHistory([...newHistory, { transaction, previousState }]);
      setCurrentIndex(currentIndex + 1);
    },
    [history, currentIndex]
  );

  const undo = useCallback(() => {
    if (currentIndex < 0) return null;

    const item = history[currentIndex];
    setCurrentIndex(currentIndex - 1);
    isUndoRedoAction.current = true;

    return item.previousState;
  }, [history, currentIndex]);

  const redo = useCallback(() => {
    if (currentIndex >= history.length - 1) return null;

    const item = history[currentIndex + 1];
    setCurrentIndex(currentIndex + 1);
    isUndoRedoAction.current = true;

    return item.transaction;
  }, [history, currentIndex]);

  const canUndo = currentIndex >= 0;
  const canRedo = currentIndex < history.length - 1;

  return {
    addToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
  };
}
