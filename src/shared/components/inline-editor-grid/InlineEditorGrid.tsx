import {
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { formatCurrency } from "@/shared/utils/formats";
import { useInlineEditor } from "./useInlineEditor";
import { transparentize } from "@chakra-ui/theme-tools";
import { TableSkeletonRow } from "../table-skeleton-row";
import type { DataRow, InlineEditorGridProps } from "./types";
import TableEmptyRows from "../table-empty-rows";

export function InlineEditorGrid<T extends DataRow>({
  columns,
  data,
  onDataChange,
  onCellChange,
  onRowChange,
  isLoading = false,
}: InlineEditorGridProps<T>) {
  const visibleColumns = columns.filter((c) => c.isVisible !== false);
  const { tableRef, activeCell, getCellProps, getInputProps, updateCell } =
    useInlineEditor<T>({
      columns: visibleColumns,
      data: data,
      onDataChange,
      onCellChange,
      onRowChange,
    });

  const inputProps = getInputProps();

  const rowFocusBorderColor = useColorModeValue("red.500", "red.300");
  const cellEditStyle = {
    opacity: 1,
    transform: "scale(1)",
    border: "1px solid",
    borderColor: "cyan.500",
    background: "rgba(107,198,124,0.15)",
    borderRadius: "md",
  };

  const inputBg = useColorModeValue("white", "gray.700");
  const borderBgContainer = useColorModeValue("gray.200", "gray.800");

  return (
    <TableContainer
      border="1px solid"
      borderColor={borderBgContainer}
      borderRadius="xl"
      pos="relative"
      overflow="auto"
      tabIndex={0} // Make the container focusable
      ref={tableRef}
      onFocus={(e) => {
        // If the focus event originated from the container itself, not a child cell
        if (e.target === tableRef.current) {
          // Focus the active cell (which defaults to 0,0 or the last active cell)
          tableRef.current
            ?.querySelector<HTMLElement>(
              `[data-row="${activeCell?.row || 0}"][data-col="${
                activeCell?.col || 0
              }"]`,
            )
            ?.focus();
        }
      }}
    >
      <Input
        {...inputProps}
        size="sm"
        variant="unstyled"
        bg={inputBg}
        fontSize="sm"
        px="3"
        sx={{
          ...inputProps.style,
          ...cellEditStyle,
          boxSizing: "border-box",
          _focus: {
            outline: "none",
          },
        }}
      />
      <Table variant="striped" size="sm">
        <Thead>
          <Tr>
            {visibleColumns.map((column) => (
              <Th
                key={column.accessor as string}
                isNumeric={
                  (column.accessor as string) === "amount" || column.isAmount
                }
              >
                {column.header}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {(() => {
            if (isLoading) {
              return <TableSkeletonRow rows={1} cols={visibleColumns.length} />;
            }

            if (data.length === 0) {
              return <TableEmptyRows cols={visibleColumns.length} />;
            }

            return data.map((row, rowIndex) => {
              const isRowActive = activeCell?.row === rowIndex;
              return (
                <Tr
                  key={rowIndex}
                  sx={{
                    ...(isRowActive && {
                      "& > td": {
                        boxShadow: `inset 0 0 0 1px ${rowFocusBorderColor}`,
                      },
                    }),
                    ...(row.is_enabled === false && {
                      opacity: 0.5,
                    }),
                  }}
                >
                  {visibleColumns.map((column, colIndex) => {
                    const cellValue = row[column.accessor as keyof T]; // Get value using accessor
                    const isNumericColumn =
                      (column.accessor as string) === "amount" ||
                      column.isAmount; // Check if column is numeric
                    const isCellActive =
                      activeCell?.row === rowIndex &&
                      activeCell?.col === colIndex;
                    return (
                      <Td
                        key={column.accessor as string} // Use accessor as key for the cell
                        {...getCellProps(rowIndex, colIndex)}
                        data-active={isCellActive}
                        isNumeric={isNumericColumn} // Pass isNumeric based on column
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
                            background: transparentize("cyan.500", 0.15),
                            zIndex: 1,
                            pointerEvents: "none",

                            opacity: 0,
                            transform: "scale(0.95)",
                            boxShadow: `0 0 0px ${transparentize(
                              "cyan.500",
                              0.5,
                            )}`,
                            transition:
                              "opacity 0.25s ease, transform 0.25s ease, box-shadow 0.4s ease",
                          },

                          "&:hover::after, &[data-active='true']::after": {
                            opacity: 1,
                            transform: "scale(1)",
                            boxShadow: `0 0 15px 3px ${transparentize(
                              "cyan.500",
                              0.7,
                            )}`,
                          },

                          "> *": {
                            position: "relative",
                            zIndex: 2,
                          },

                          visibility:
                            inputProps.shouldShowInput &&
                            activeCell?.row === rowIndex &&
                            activeCell?.col === colIndex
                              ? "hidden"
                              : "visible",
                          ...column.sx,
                        }}
                      >
                        {(() => {
                          if (column.render) {
                            return column.render(
                              cellValue,
                              row,
                              (newValue: any) =>
                                updateCell(rowIndex, colIndex, newValue),
                            );
                          }
                          if (column.isAmount) {
                            return formatCurrency(cellValue || 0, "USD");
                          }
                          return cellValue;
                        })()}{" "}
                      </Td>
                    );
                  })}
                </Tr>
              );
            });
          })()}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
