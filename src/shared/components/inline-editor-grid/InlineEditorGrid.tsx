import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { useMemo, useCallback } from "react";
import { useAuthenticatedUser } from "@/shared/hooks";
import { useInlineEditor } from "./useInlineEditor";
import { transparentize } from "@chakra-ui/theme-tools";
import { TableSkeletonRow } from "../table-skeleton-row";
import type { DataRow, InlineEditorGridProps } from "./types";
import TableEmptyRows from "../table-empty-rows";
import { FloatingInput } from "./FloatingInput";
import { InlineEditableCell } from "./InlineEditableCell";

export function InlineEditorGrid<T extends DataRow>({
  columns,
  data,
  onDataChange,
  onCellChange,
  onRowChange,
  isLoading = false,
  showRowNumber = false,
}: InlineEditorGridProps<T>) {
  const { profile } = useAuthenticatedUser();

  const visibleColumns = useMemo(
    () => columns.filter((c) => c.isVisible !== false),
    [columns]
  );

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

  const cellEditStyle = useMemo(
    () => ({
      opacity: 1,
      transform: "scale(1)",
      border: "1px solid",
      borderColor: "cyan.500",
      background: "rgba(107,198,124,0.15)",
      borderRadius: "md",
    }),
    []
  );

  const borderBgContainer = useColorModeValue("gray.200", "gray.800");

  const columnCount = useMemo(
    () => (showRowNumber ? visibleColumns.length + 1 : visibleColumns.length),
    [showRowNumber, visibleColumns.length]
  );

  const cyanTransparent = useMemo(
    () => transparentize("cyan.500", 0.15)({}),
    []
  );

  const cyanTransparent50 = useMemo(
    () => transparentize("cyan.500", 0.5)({}),
    []
  );

  const cyanTransparent70 = useMemo(
    () => transparentize("cyan.500", 0.7)({}),
    []
  );

  const handleContainerFocus = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      if (e.target === tableRef.current) {
        tableRef.current
          ?.querySelector<HTMLElement>(
            `[data-row="${activeCell?.row || 0}"][data-col="${
              activeCell?.col || 0
            }"]`
          )
          ?.focus();
      }
    },
    [tableRef, activeCell]
  );

  const renderTableBody = useCallback(() => {
    if (isLoading) {
      return <TableSkeletonRow rows={1} cols={columnCount} />;
    }

    if (data.length === 0) {
      return <TableEmptyRows cols={columnCount} />;
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
            ...(row.enabled === false && {
              opacity: 0.5,
            }),
          }}
        >
          {showRowNumber && (
            <Td isNumeric color="gray.500">
              {rowIndex + 1}
            </Td>
          )}
          {visibleColumns.map((column, colIndex) => {
            const cellValue = row[column.accessor as keyof T];
            const isCellActive =
              activeCell?.row === rowIndex && activeCell?.col === colIndex;

            return (
              <InlineEditableCell
                key={column.accessor as string}
                row={row}
                rowIndex={rowIndex}
                colIndex={colIndex}
                column={column}
                cellValue={cellValue}
                isCellActive={isCellActive}
                shouldShowInput={inputProps.shouldShowInput ?? false}
                activeCell={activeCell}
                getCellProps={getCellProps}
                updateCell={updateCell}
                cyanTransparent={cyanTransparent}
                cyanTransparent50={cyanTransparent50}
                cyanTransparent70={cyanTransparent70}
                currency={profile?.currency ?? "USD"}
              />
            );
          })}
        </Tr>
      );
    });
  }, [
    isLoading,
    data,
    columnCount,
    activeCell,
    showRowNumber,
    visibleColumns,
    rowFocusBorderColor,
    inputProps.shouldShowInput,
    getCellProps,
    updateCell,
    cyanTransparent,
    cyanTransparent50,
    cyanTransparent70,
    profile,
  ]);

  return (
    <TableContainer
      border="1px solid"
      borderColor={borderBgContainer}
      borderRadius="xl"
      pos="relative"
      overflow="auto"
      tabIndex={0}
      ref={tableRef}
      onFocus={handleContainerFocus}
    >
      <FloatingInput inputProps={inputProps} cellEditStyle={cellEditStyle} />
      <Table variant="striped" size="sm">
        <Thead>
          <Tr>
            {showRowNumber && (
              <Th w="1%" px="2" isNumeric>
                #
              </Th>
            )}
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
        <Tbody>{renderTableBody()}</Tbody>
      </Table>
    </TableContainer>
  );
}
