import { useMemo, useRef } from "react";
import type { ComputedColumn, DataRow, GridColumn } from "../types";
import {
  DEFAULT_COLUMN_WIDTH,
  DEFAULT_MIN_COLUMN_WIDTH,
  DEFAULT_MAX_COLUMN_WIDTH,
} from "../constants";

function columnsEqual<T extends DataRow>(
  a: GridColumn<T>[],
  b: GridColumn<T>[],
): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    const ca = a[i];
    const cb = b[i];
    if (
      ca.accessor !== cb.accessor ||
      ca.header !== cb.header ||
      ca.width !== cb.width ||
      ca.minWidth !== cb.minWidth ||
      ca.maxWidth !== cb.maxWidth ||
      ca.isEditable !== cb.isEditable ||
      ca.isAmount !== cb.isAmount ||
      ca.isVisible !== cb.isVisible ||
      ca.isDraggable !== cb.isDraggable ||
      ca.align !== cb.align ||
      ca.isResizable !== cb.isResizable ||
      ca.pin !== cb.pin
    ) {
      return false;
    }
  }
  return true;
}

export function useStableColumns<T extends DataRow>(
  rawColumns: GridColumn<T>[],
  columnWidths: Map<string, number>,
): { columns: ComputedColumn<T>[]; totalWidth: number } {
  const prevRef = useRef<GridColumn<T>[]>(rawColumns);

  const stableRaw = useMemo(() => {
    if (columnsEqual(prevRef.current, rawColumns)) {
      return prevRef.current;
    }
    prevRef.current = rawColumns;
    return rawColumns;
  }, [rawColumns]);

  return useMemo(() => {
    const visible = stableRaw.filter((c) => c.isVisible !== false);
    let offset = 0;
    const computed: ComputedColumn<T>[] = visible.map((col, index) => {
      const accessor = col.accessor as string;
      const resizedWidth = columnWidths.get(accessor);
      const baseWidth = resizedWidth ?? col.width ?? DEFAULT_COLUMN_WIDTH;
      const min = col.minWidth ?? DEFAULT_MIN_COLUMN_WIDTH;
      const max = col.maxWidth ?? DEFAULT_MAX_COLUMN_WIDTH;
      const computedWidth = Math.max(min, Math.min(max, baseWidth));
      const offsetLeft = offset;
      offset += computedWidth;
      return { ...col, computedWidth, offsetLeft, index };
    });
    return { columns: computed, totalWidth: offset };
  }, [stableRaw, columnWidths]);
}
