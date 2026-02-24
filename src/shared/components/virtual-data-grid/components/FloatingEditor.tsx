import { Input, useColorModeValue } from "@chakra-ui/react";
import { memo, useEffect, useRef } from "react";
import type { EditState, ComputedColumn, DataRow } from "../types";
import { ROW_NUMBER_WIDTH } from "../constants";

interface FloatingEditorProps {
  editState: EditState;
  inputValue: string;
  setInputValue: (value: string) => void;
  stopEditing: (update?: boolean) => void;
  columns: ComputedColumn<DataRow>[];
  rowHeight: number;
  headerHeight: number;
  scrollTop: number;
  containerHeight: number;
  showRowNumber: boolean;
}

export const FloatingEditor = memo(function FloatingEditor({
  editState,
  inputValue,
  setInputValue,
  stopEditing,
  columns,
  rowHeight,
  headerHeight,
  scrollTop,
  containerHeight,
  showRowNumber,
}: FloatingEditorProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputBg = useColorModeValue("white", "gray.700");

  useEffect(() => {
    if (editState.status === "editing" && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editState.status]);

  if (editState.status !== "editing") return null;

  const { coord } = editState;
  const column = columns[coord.col];
  if (!column || column.isEditable === false) return null;

  // Position in CONTENT coordinates (no scroll compensation —
  // the editor lives inside the scroll container so it scrolls naturally)
  const cellTop = coord.row * rowHeight + headerHeight;
  const cellLeft = column.offsetLeft + (showRowNumber ? ROW_NUMBER_WIDTH : 0);
  const cellWidth = column.computedWidth;
  const cellHeight = rowHeight;

  // Visibility check in VIEWPORT coordinates
  const viewportTop = cellTop - scrollTop;
  if (viewportTop + cellHeight < headerHeight || viewportTop > containerHeight) {
    return null;
  }

  const inputType = column.isAmount ? "number" : "text";

  return (
    <Input
      ref={inputRef}
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onBlur={() => stopEditing()}
      type={inputType}
      step={column.isAmount ? "0.01" : undefined}
      size="sm"
      variant="unstyled"
      bg={inputBg}
      fontSize="sm"
      fontWeight="semibold"
      px="3"
      position="absolute"
      zIndex={20}
      sx={{
        top: `${cellTop}px`,
        left: `${cellLeft}px`,
        width: `${cellWidth}px`,
        height: `${cellHeight}px`,
        boxSizing: "border-box",
        border: "1px solid",
        borderColor: "cyan.500",
        background: inputBg,
        borderRadius: "md",
        color: "cyan.500",
        _focus: { outline: "none" },
      }}
    />
  );
});
