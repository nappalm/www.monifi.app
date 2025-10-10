import { Tables } from "@/lib/supabase/database.types";
import { useCallback, useRef, useState } from "react";

interface TransactionChange {
  transaction: Tables<"transactions">;
  previousState: Tables<"transactions">;
}

interface TransactionHistoryState {
  changes: TransactionChange[];
}

export function useTransactionHistory() {
  const [history, setHistory] = useState<TransactionHistoryState[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const isUndoRedoAction = useRef(false);
  const batchChanges = useRef<TransactionChange[]>([]);
  const batchTimerRef = useRef<NodeJS.Timeout | null>(null);

  const addToHistory = useCallback(
    (
      transaction: Tables<"transactions">,
      previousState: Tables<"transactions">,
    ) => {
      // No agregar al historial si es una acción de undo/redo
      if (isUndoRedoAction.current) {
        isUndoRedoAction.current = false;
        return;
      }

      // Agregar el cambio al batch
      batchChanges.current.push({ transaction, previousState });

      // Cancelar el timer anterior si existe
      if (batchTimerRef.current) {
        clearTimeout(batchTimerRef.current);
      }

      // Configurar un nuevo timer para agrupar cambios que ocurran en un intervalo corto
      batchTimerRef.current = setTimeout(() => {
        if (batchChanges.current.length > 0) {
          // Eliminar historial futuro si estamos en medio del stack
          const newHistory = history.slice(0, currentIndex + 1);

          setHistory([...newHistory, { changes: [...batchChanges.current] }]);
          setCurrentIndex(currentIndex + 1);

          // Limpiar el batch
          batchChanges.current = [];
        }
      }, 50); // 50ms de debounce para agrupar cambios rápidos
    },
    [history, currentIndex],
  );

  const undo = useCallback(() => {
    if (currentIndex < 0) return null;

    const item = history[currentIndex];
    setCurrentIndex(currentIndex - 1);
    isUndoRedoAction.current = true;

    // Retornar todos los estados previos
    return item.changes.map((change) => change.previousState);
  }, [history, currentIndex]);

  const redo = useCallback(() => {
    if (currentIndex >= history.length - 1) return null;

    const item = history[currentIndex + 1];
    setCurrentIndex(currentIndex + 1);
    isUndoRedoAction.current = true;

    // Retornar todos los nuevos estados
    return item.changes.map((change) => change.transaction);
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
