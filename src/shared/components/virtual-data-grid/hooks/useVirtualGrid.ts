import { useRef, useState, useMemo, useCallback, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type {
  CellCoord,
  DataRow,
  GridContextValue,
  MenuState,
  VirtualDataGridProps,
} from "../types";
import {
  DEFAULT_ROW_HEIGHT,
  DEFAULT_HEADER_HEIGHT,
  DEFAULT_OVERSCAN,
  ROW_NUMBER_WIDTH,
  DEFAULT_SCROLL_PADDING_END,
} from "../constants";
import { useStableColumns } from "./useStableColumns";
import { useGridEditing } from "./useGridEditing";
import { useGridNavigation } from "./useGridNavigation";
import { useDragToFill } from "./useDragToFill";
import { useGridSelection } from "./useGridSelection";
import { useColumnResize } from "./useColumnResize";
import { useDebouncedFilter } from "./useDebouncedFilter";
import { useGridSort } from "./useGridSort";

export function useVirtualGrid<T extends DataRow>(
  props: VirtualDataGridProps<T>,
) {
  const {
    columns: rawColumns,
    data: rawData,
    onDataChange,
    onCellChange,
    onRowChange,
    rowHeight = DEFAULT_ROW_HEIGHT,
    overscan = DEFAULT_OVERSCAN,
    enableSelection = false,
    enableColumnResize = false,
    enableFilter = false,
    filterFn,
    showRowNumber = false,
    currency = "USD",
    focusRowIndex,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null!);
  const [activeCell, setActiveCell] = useState<CellCoord | null>({
    row: 0,
    col: 0,
  });
  const [containerWidth, setContainerWidth] = useState(0);

  // Observe container width only when there are fullWidth columns
  const hasFluidColumns = rawColumns.some((c) => c.fullWidth);
  useEffect(() => {
    if (!hasFluidColumns) return;
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      setContainerWidth(entries[0]?.contentRect.width ?? 0);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [hasFluidColumns]);

  // Column resize
  const { columnWidths, onColumnResize, startResize, isResizing } =
    useColumnResize(enableColumnResize);

  // Stable columns
  const rowNumberWidth = ROW_NUMBER_WIDTH;
  const { columns, totalWidth } = useStableColumns(
    rawColumns,
    columnWidths,
    containerWidth,
    showRowNumber,
    rowNumberWidth,
  );

  // Filter
  const { filterValue, handleFilterChange, filteredData } = useDebouncedFilter(
    rawData,
    enableFilter,
    filterFn,
  );

  // Sort (client-side only, does not mutate original data)
  const { sortedData, sortColumn, sortDirection, onSort } =
    useGridSort(filteredData);

  const data = sortedData;

  // Editing
  const {
    editState,
    inputValue,
    setInputValue,
    startEditing,
    stopEditing,
    updateCell,
  } = useGridEditing({
    columns,
    data,
    onDataChange,
    onCellChange,
    onRowChange,
  });

  // Navigation
  useGridNavigation({
    containerRef,
    activeCell,
    setActiveCell,
    editState,
    startEditing,
    stopEditing,
    setInputValue,
    numRows: data.length,
    numCols: columns.length,
  });

  // Drag to fill
  const { isDragging, dragStartCell, dragEndCell, handleDragHandleStart } =
    useDragToFill({
      containerRef,
      columns,
      data,
      rowHeight,
      headerHeight: DEFAULT_HEADER_HEIGHT,
      showRowNumber,
      onDataChange,
      onRowChange,
    });

  // Selection
  const { selectionRange } = useGridSelection(enableSelection);

  // Row highlight
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  // Shared menu
  const [menuState, setMenuState] = useState<MenuState<T> | null>(null);
  const openMenu = useCallback(
    (row: T, rowIndex: number, anchorRect: { top: number; left: number }) => {
      setMenuState({ row, rowIndex, anchorRect });
    },
    [],
  );
  const closeMenu = useCallback(() => setMenuState(null), []);

  // Virtualizer
  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => rowHeight,
    overscan,
    paddingEnd: DEFAULT_SCROLL_PADDING_END,
  });

  // Keep a stable ref to the virtualizer so we don't need it in effect deps
  const virtualizerRef = useRef(virtualizer);
  useEffect(() => {
    virtualizerRef.current = virtualizer;
  });

  // When focusRowIndex changes to a non-null value, scroll to that row and focus its first cell
  useEffect(() => {
    if (focusRowIndex == null) return;
    const idx = focusRowIndex;
    virtualizerRef.current.scrollToIndex(idx, { align: "end" });
    // Double rAF: first lets the scroll settle, second lets the virtualizer re-render the row
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        containerRef.current
          ?.querySelector<HTMLElement>(`[data-row="${idx}"][data-col="0"]`)
          ?.focus();
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [focusRowIndex, containerRef]);

  const headerHeight = DEFAULT_HEADER_HEIGHT;

  const contextValue = useMemo<GridContextValue<T>>(
    () => ({
      data,
      columns,
      totalWidth,
      activeCell,
      setActiveCell,
      editState,
      startEditing,
      stopEditing,
      inputValue,
      setInputValue,
      updateCell,
      isDragging,
      dragStartCell,
      dragEndCell,
      handleDragHandleStart,
      selectionRange,
      rowHeight,
      headerHeight,
      showRowNumber,
      rowNumberWidth,
      currency,
      columnWidths,
      onColumnResize,
      sortColumn,
      sortDirection,
      onSort,
      selectedRow,
      setSelectedRow,
      menuState,
      openMenu,
      closeMenu,
    }),
    [
      data,
      columns,
      totalWidth,
      activeCell,
      setActiveCell,
      editState,
      startEditing,
      stopEditing,
      inputValue,
      setInputValue,
      updateCell,
      isDragging,
      dragStartCell,
      dragEndCell,
      handleDragHandleStart,
      selectionRange,
      rowHeight,
      headerHeight,
      showRowNumber,
      rowNumberWidth,
      currency,
      columnWidths,
      onColumnResize,
      sortColumn,
      sortDirection,
      onSort,
      selectedRow,
      setSelectedRow,
      menuState,
      openMenu,
      closeMenu,
    ],
  );

  return {
    containerRef,
    virtualizer,
    contextValue,
    // Filter
    filterValue,
    handleFilterChange,
    // Resize
    startResize,
    isResizing,
  };
}
