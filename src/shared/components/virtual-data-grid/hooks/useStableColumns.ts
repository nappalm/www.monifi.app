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
      ca.fullWidth !== cb.fullWidth ||
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
  containerWidth: number,
  showRowNumber: boolean,
  rowNumberWidth: number,
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

    // Pass 1: compute fixed column widths and count fluid columns
    let fixedTotal = 0;
    let fluidCount = 0;
    const fixedWidths: number[] = visible.map((col) => {
      const accessor = col.accessor as string;
      const resizedWidth = columnWidths.get(accessor);
      if (col.fullWidth && !resizedWidth) {
        fluidCount++;
        return -1; // placeholder
      }
      const baseWidth =
        resizedWidth ?? (col.width as number) ?? DEFAULT_COLUMN_WIDTH;
      const min = col.minWidth ?? DEFAULT_MIN_COLUMN_WIDTH;
      const max = col.maxWidth ?? DEFAULT_MAX_COLUMN_WIDTH;
      const w = Math.max(min, Math.min(max, baseWidth));
      fixedTotal += w;
      return w;
    });

    // Pass 2: distribute remaining space equally among fluid columns
    const reserved = fixedTotal + (showRowNumber ? rowNumberWidth : 0);
    const available = Math.max(0, containerWidth - reserved);
    const fluidWidth = fluidCount > 0 ? Math.floor(available / fluidCount) : 0;

    // Pass 3: build computed columns with offsets
    let offset = 0;
    const computed: ComputedColumn<T>[] = visible.map((col, index) => {
      const accessor = col.accessor as string;
      const resizedWidth = columnWidths.get(accessor);
      let computedWidth: number;
      if (col.fullWidth && !resizedWidth) {
        computedWidth = Math.max(
          col.minWidth ?? DEFAULT_MIN_COLUMN_WIDTH,
          fluidWidth,
        );
      } else {
        computedWidth = fixedWidths[index];
      }
      const offsetLeft = offset;
      offset += computedWidth;
      return { ...col, computedWidth, offsetLeft, index };
    });

    return { columns: computed, totalWidth: offset };
  }, [stableRaw, columnWidths, containerWidth, showRowNumber, rowNumberWidth]);
}
