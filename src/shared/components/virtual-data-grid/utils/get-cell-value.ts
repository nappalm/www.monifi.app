import type { DataRow } from "../types";

export function getCellValue<T extends DataRow>(
  row: T,
  accessor: keyof T | (string & {}),
): any {
  if (typeof accessor === "string" && accessor.includes(".")) {
    return accessor.split(".").reduce<any>((obj, key) => obj?.[key], row);
  }
  return row[accessor as keyof T];
}
