import type { TableCellProps } from "@chakra-ui/react";

export interface Column {
  header: string;
  accessor: string;
  render?: (
    value: any,
    row: any,
    onChange: (newValue: any) => void,
  ) => React.ReactNode;
  isEditable?: boolean;
  isAmount?: boolean;
  sx?: TableCellProps;
}

export interface CellChange {
  value: any;
  previousValue: any;
  rowIndex: number;
  columnAccessor: string;
  row: any;
}

export interface InlineEditorGridProps {
  columns: Column[];
  data: any[];
  onDataChange: (newData: any[]) => void;
  onCellChange?: (change: CellChange) => void;
  isLoading?: boolean;
}

export interface UseInlineEditorProps {
  columns: Column[];
  data: any[];
  onDataChange: (newData: any[]) => void;
  onCellChange?: (change: CellChange) => void;
}
