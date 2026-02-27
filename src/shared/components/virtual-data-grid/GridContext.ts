import { createContext, useContext } from "react";
import type { DataRow, GridContextValue } from "./types";

export const GridContext = createContext<GridContextValue<any> | null>(null);

export function useGridContext<T extends DataRow>(): GridContextValue<T> {
  const ctx = useContext(GridContext);
  if (!ctx) {
    throw new Error("useGridContext must be used within a VirtualDataGrid");
  }
  return ctx as GridContextValue<T>;
}
