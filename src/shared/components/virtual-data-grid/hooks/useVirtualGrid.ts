import { useRef, useState, useMemo, useCallback } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { CellCoord, DataRow, GridContextValue, MenuState, VirtualDataGridProps } from "../types";
import { DEFAULT_ROW_HEIGHT, DEFAULT_HEADER_HEIGHT, DEFAULT_OVERSCAN, ROW_NUMBER_WIDTH } from "../constants";
import { useStableColumns } from "./useStableColumns";
import { useGridEditing } from "./useGridEditing";
import { useGridNavigation } from "./useGridNavigation";
import { useDragToFill } from "./useDragToFill";
import { useGridSelection } from "./useGridSelection";
import { useColumnResize } from "./useColumnResize";
import { useDebouncedFilter } from "./useDebouncedFilter";

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
  } = props;

  const containerRef = useRef<HTMLDivElement>(null!);
  const [activeCell, setActiveCell] = useState<CellCoord | null>({ row: 0, col: 0 });

  // Column resize
  const { columnWidths, onColumnResize, startResize, isResizing } = useColumnResize(enableColumnResize);

  // Stable columns
  const { columns, totalWidth } = useStableColumns(rawColumns, columnWidths);

  // Filter
  const { filterValue, handleFilterChange, filteredData } = useDebouncedFilter(rawData, enableFilter, filterFn);

  const data = filteredData;

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
  const { isDragging, dragStartCell, dragEndCell, handleDragHandleStart } = useDragToFill({
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
  });

  const headerHeight = DEFAULT_HEADER_HEIGHT;
  const rowNumberWidth = ROW_NUMBER_WIDTH;

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
