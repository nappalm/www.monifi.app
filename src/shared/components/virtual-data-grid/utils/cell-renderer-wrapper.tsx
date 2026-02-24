import { memo, type ReactNode } from "react";
import type { DataRow } from "../types";

interface CellRendererWrapperProps<T extends DataRow> {
  render: (
    value: T[keyof T],
    row: T,
    onChange: (newValue: any) => void,
  ) => ReactNode;
  value: T[keyof T];
  row: T;
  onChange: (newValue: any) => void;
}

function CellRendererWrapperComponent<T extends DataRow>({
  render,
  value,
  row,
  onChange,
}: CellRendererWrapperProps<T>) {
  return <>{render(value, row, onChange)}</>;
}

export const CellRendererWrapper = memo(
  CellRendererWrapperComponent,
) as typeof CellRendererWrapperComponent;
