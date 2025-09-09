import type { TableCellProps } from "@chakra-ui/react";

// T is the type for a single row of data
export type DataRow = Record<string, any>;

export interface Column<T extends DataRow> {
  header: string;
  accessor: keyof T | (string & {});
  render?: (
    value: T[keyof T],
    row: T,
    onChange: (newValue: any) => void,
  ) => React.ReactNode;
  isEditable?: boolean;
  isAmount?: boolean;
  sx?: TableCellProps;
  isVisible?: boolean;
}

export interface CellChange<T extends DataRow> {
  value: any;
  previousValue: any;
  rowIndex: number;
  columnAccessor: keyof T | (string & {});
  row: T;
}

export interface InlineEditorGridProps<T extends DataRow> {
  columns: Column<T>[];
  data: T[];
  onDataChange: (newData: T[]) => void;
  onCellChange?: (change: CellChange<T>) => void;
  isLoading?: boolean;
}

export interface UseInlineEditorProps<T extends DataRow> {
  columns: Column<T>[];
  data: T[];
  onDataChange: (newData: T[]) => void;
  onCellChange?: (change: CellChange<T>) => void;
}

