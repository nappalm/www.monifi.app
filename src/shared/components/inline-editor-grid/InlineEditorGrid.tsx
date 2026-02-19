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
  height,
}: InlineEditorGridProps<T>) {
  const { profile } = useAuthenticatedUser();

  const visibleColumns = useMemo(
    () => columns.filter((c) => c.isVisible !== false),
    [columns],
  );

  const {
    tableRef,
    activeCell,
    getCellProps,
    getInputProps,
    updateCell,
    handleDragHandleStart,
    isDragging,
    dragStartCell,
    dragEndCell,
  } = useInlineEditor<T>({
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
      background: "cyan.800",
      borderRadius: "md",
      color: "cyan.500",
    }),
    [],
  );

  const borderBgContainer = useColorModeValue("gray.200", "gray.800");

  const columnCount = useMemo(
    () => (showRowNumber ? visibleColumns.length + 1 : visibleColumns.length),
    [showRowNumber, visibleColumns.length],
  );

  const cyanTransparent = useMemo(
    () => transparentize("cyan.500", 0.15)({}),
    [],
  );

  const cyanTransparent50 = useMemo(
    () => transparentize("cyan.500", 0.5)({}),
    [],
  );

  const handleContainerFocus = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      if (e.target === tableRef.current) {
        tableRef.current
          ?.querySelector<HTMLElement>(
            `[data-row="${activeCell?.row || 0}"][data-col="${
              activeCell?.col || 0
            }"]`,
          )
          ?.focus();
      }
    },
    [tableRef, activeCell],
  );

  const renderTableBody = useCallback(() => {
    if (isLoading) {
      return <TableSkeletonRow rows={1} cols={columnCount} />;
    }

    if (data.length === 0) {
      return <TableEmptyRows cols={columnCount} height={height} />;
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
            // Permitir que los drag handles sobresalgan
            position: "relative",
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

            // Calcular si la celda está en el rango de arrastre
            let isInDragRange = false;
            if (isDragging && dragStartCell && dragEndCell) {
              const minRow = Math.min(dragStartCell.row, dragEndCell.row);
              const maxRow = Math.max(dragStartCell.row, dragEndCell.row);
              const minCol = Math.min(dragStartCell.col, dragEndCell.col);
              const maxCol = Math.max(dragStartCell.col, dragEndCell.col);

              isInDragRange =
                rowIndex >= minRow &&
                rowIndex <= maxRow &&
                colIndex >= minCol &&
                colIndex <= maxCol;
            }

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
                currency={profile?.currency ?? "USD"}
                onDragHandleStart={handleDragHandleStart}
                isInDragRange={isInDragRange}
                isDragging={isDragging}
                isDraggable={column.isDraggable !== false}
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
    profile,
    handleDragHandleStart,
    isDragging,
    dragStartCell,
    dragEndCell,
  ]);

  return (
    <TableContainer
      border="1px solid"
      borderColor={borderBgContainer}
      borderRadius="0px"
      pos="relative"
      overflow="auto"
      {...(height && { h: height })}
      tabIndex={0}
      ref={tableRef}
      onFocus={handleContainerFocus}
      sx={{
        "& table": {
          borderCollapse: "separate",
          borderSpacing: 0,
        },
      }}
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
                sx={column.sx}
              >
                {column.header}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody sx={{ "& > tr": { overflow: "visible !important" } }}>
          {renderTableBody()}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
