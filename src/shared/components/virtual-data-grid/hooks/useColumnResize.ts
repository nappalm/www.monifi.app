import { useCallback, useEffect, useRef, useState } from "react";

export function useColumnResize(enabled: boolean) {
  const [columnWidths, setColumnWidths] = useState<Map<string, number>>(
    () => new Map(),
  );
  const [resizing, setResizing] = useState<{
    accessor: string;
    startX: number;
    startWidth: number;
  } | null>(null);

  const resizingRef = useRef(resizing);
  resizingRef.current = resizing;

  const onColumnResize = useCallback(
    (accessor: string, width: number) => {
      if (!enabled) return;
      setColumnWidths((prev) => {
        const next = new Map(prev);
        next.set(accessor, width);
        return next;
      });
    },
    [enabled],
  );

  const startResize = useCallback(
    (accessor: string, startX: number, currentWidth: number) => {
      if (!enabled) return;
      setResizing({ accessor, startX, startWidth: currentWidth });
    },
    [enabled],
  );

  useEffect(() => {
    if (!resizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const r = resizingRef.current;
      if (!r) return;
      const delta = e.clientX - r.startX;
      const newWidth = Math.max(50, r.startWidth + delta);
      setColumnWidths((prev) => {
        const next = new Map(prev);
        next.set(r.accessor, newWidth);
        return next;
      });
    };

    const handleMouseUp = () => {
      setResizing(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [resizing]);

  return {
    columnWidths,
    onColumnResize,
    startResize,
    isResizing: resizing !== null,
  };
}
