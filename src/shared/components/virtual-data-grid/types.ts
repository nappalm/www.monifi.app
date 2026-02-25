import type { CSSProperties, ReactNode } from "react";

export type DataRow = Record<string, any>;

export interface GridColumn<T extends DataRow> {
  accessor: keyof T | (string & {});
  header: string;
  render?: (
    value: T[keyof T],
    row: T,
    onChange: (newValue: any) => void,
    rowIndex: number,
  ) => ReactNode;
  isEditable?: boolean;
  isAmount?: boolean;
  isVisible?: boolean;
  isDraggable?: boolean;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  align?: "left" | "right" | "center";
  cellStyle?: CSSProperties;
  isResizable?: boolean;
  fullWidth?: boolean;
  pin?: "left" | "right";
  /** @deprecated Use cellStyle instead */
  sx?: any;
}

export interface CellCoord {
  row: number;
  col: number;
}

export type EditState =
  | { status: "idle" }
  | { status: "editing"; coord: CellCoord; initialValue: string }
  | { status: "committing"; coord: CellCoord; value: string };

export interface CellChange<T extends DataRow> {
  value: any;
  previousValue: any;
  rowIndex: number;
  columnAccessor: keyof T | (string & {});
  row: T;
}

export interface ComputedColumn<T extends DataRow> extends GridColumn<T> {
  computedWidth: number;
  offsetLeft: number;
  index: number;
}

export interface VirtualDataGridProps<T extends DataRow> {
  columns: GridColumn<T>[];
  data: T[];
  onDataChange?: (newData: T[]) => void;
  onCellChange?: (change: CellChange<T>) => void;
  onRowChange?: (row: T, rowIndex: number, colIndex: number) => void;
  isLoading?: boolean;
  showRowNumber?: boolean;
  height?: string;
  rowHeight?: number;
  overscan?: number;
  enableSelection?: boolean;
  enableColumnResize?: boolean;
  enableFilter?: boolean;
  filterFn?: (row: T, filterValue: string) => boolean;
  rowKey?: keyof T;
  currency?: string;
  renderMenu?: (row: T, rowIndex: number, closeMenu: () => void) => ReactNode;
}

export interface MenuState<T extends DataRow> {
  row: T;
  rowIndex: number;
  anchorRect: { top: number; left: number };
}

export interface GridContextValue<T extends DataRow> {
  // Data
  data: T[];
  columns: ComputedColumn<T>[];
  totalWidth: number;

  // Active cell & editing
  activeCell: CellCoord | null;
  setActiveCell: (cell: CellCoord | null) => void;
  editState: EditState;
  startEditing: (row: number, col: number) => void;
  stopEditing: (update?: boolean) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  updateCell: (rowIndex: number, colIndex: number, value: any) => void;

  // Drag-to-fill
  isDragging: boolean;
  dragStartCell: CellCoord | null;
  dragEndCell: CellCoord | null;
  handleDragHandleStart: (
    e: React.MouseEvent,
    direction: "up" | "down",
    rowIndex: number,
    colIndex: number,
  ) => void;

  // Selection
  selectionRange: { start: CellCoord; end: CellCoord } | null;

  // Sizing
  rowHeight: number;
  headerHeight: number;
  showRowNumber: boolean;
  rowNumberWidth: number;
  currency: string;

  // Column resize
  columnWidths: Map<string, number>;
  onColumnResize: (accessor: string, width: number) => void;

  // Shared menu
  menuState: MenuState<T> | null;
  openMenu: (
    row: T,
    rowIndex: number,
    anchorRect: { top: number; left: number },
  ) => void;
  closeMenu: () => void;
}
