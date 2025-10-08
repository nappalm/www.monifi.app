import { Td } from "@chakra-ui/react";
import { memo } from "react";
import { formatCurrency } from "@/shared/utils/formats";
import type { DataRow } from "./types";

interface InlineEditableCellProps<T extends DataRow> {
  row: T;
  rowIndex: number;
  colIndex: number;
  column: any;
  cellValue: any;
  isCellActive: boolean;
  shouldShowInput: boolean;
  activeCell: { row: number; col: number } | null;
  getCellProps: (row: number, col: number) => any;
  updateCell: (row: number, col: number, value: any) => void;
  cyanTransparent: string;
  cyanTransparent50: string;
  cyanTransparent70: string;
  currency: string;
}

function InlineEditableCellComponent<T extends DataRow>({
  row,
  rowIndex,
  colIndex,
  column,
  cellValue,
  isCellActive,
  shouldShowInput,
  activeCell,
  getCellProps,
  updateCell,
  cyanTransparent,
  cyanTransparent50,
  cyanTransparent70,
  currency,
}: InlineEditableCellProps<T>) {
  const isNumericColumn =
    (column.accessor as string) === "amount" || column.isAmount;

  return (
    <Td
      key={column.accessor as string}
      {...getCellProps(rowIndex, colIndex)}
      data-active={isCellActive}
      isNumeric={isNumericColumn}
      sx={{
        outline: "none",
        cursor: "cell",
        position: "relative",
        fontFamily: "Roboto Mono",

        "&::after": {
          content: '""',
          position: "absolute",
          inset: 0,
          borderRadius: "md",
          border: "1px solid",
          borderColor: "cyan.500",
          background: cyanTransparent,
          zIndex: 1,
          pointerEvents: "none",

          opacity: 0,
          transform: "scale(0.95)",
          boxShadow: `0 0 0px ${cyanTransparent50}`,
          transition:
            "opacity 0.25s ease, transform 0.25s ease, box-shadow 0.4s ease",
        },

        "&:hover::after, &[data-active='true']::after": {
          opacity: 1,
          transform: "scale(1)",
          boxShadow: `0 0 15px 3px ${cyanTransparent70}`,
        },

        "> *": {
          position: "relative",
          zIndex: 2,
        },

        visibility:
          shouldShowInput &&
          activeCell?.row === rowIndex &&
          activeCell?.col === colIndex
            ? "hidden"
            : "visible",
        ...column.sx,
      }}
    >
      {(() => {
        if (column.render) {
          return column.render(cellValue, row, (newValue: any) =>
            updateCell(rowIndex, colIndex, newValue)
          );
        }
        if (column.isAmount) {
          return formatCurrency(cellValue || 0, currency);
        }
        return cellValue;
      })()}{" "}
    </Td>
  );
}

export const InlineEditableCell = memo(
  InlineEditableCellComponent
) as typeof InlineEditableCellComponent;
