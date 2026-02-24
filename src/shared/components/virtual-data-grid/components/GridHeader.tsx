import { Box, useColorModeValue } from "@chakra-ui/react";
import { memo, useCallback } from "react";
import { useGridContext } from "../GridContext";
import { RESIZE_HANDLE_WIDTH } from "../constants";

interface GridHeaderProps {
  startResize: (accessor: string, startX: number, currentWidth: number) => void;
  enableColumnResize: boolean;
}

export const GridHeader = memo(function GridHeader({
  startResize,
  enableColumnResize,
}: GridHeaderProps) {
  const {
    columns,
    totalWidth,
    headerHeight,
    showRowNumber,
    rowNumberWidth,
  } = useGridContext();

  const headerBg = useColorModeValue("gray.200", "gray.900");
  const headerColor = useColorModeValue("gray.600", "gray.400");

  const fullWidth = totalWidth + (showRowNumber ? rowNumberWidth : 0);

  return (
    <Box
      position="sticky"
      top={0}
      zIndex={10}
      height={`${headerHeight}px`}
      width={`${fullWidth}px`}
      minWidth="100%"
      display="flex"
      bg={headerBg}
      color={headerColor}
      fontFamily="'Geist Mono', monospace"
      fontWeight={400}
      textTransform="uppercase"
      letterSpacing="wider"
      fontSize="xs"
      lineHeight="4"
      userSelect="none"
    >
      {showRowNumber && (
        <Box
          width={`${rowNumberWidth}px`}
          minWidth={`${rowNumberWidth}px`}
          display="flex"
          alignItems="center"
          justifyContent="flex-end"
          px={2}
          borderTopLeftRadius="xl"
          borderBottomLeftRadius="xl"
        >
          #
        </Box>
      )}
      {columns.map((col, i) => (
        <HeaderCell
          key={col.accessor as string}
          accessor={col.accessor as string}
          header={col.header}
          width={col.computedWidth}
          offsetLeft={col.offsetLeft}
          align={col.align || (col.isAmount ? "right" : "left")}
          isFirst={i === 0 && !showRowNumber}
          isLast={i === columns.length - 1}
          isResizable={enableColumnResize && col.isResizable !== false}
          startResize={startResize}
        />
      ))}
    </Box>
  );
});

interface HeaderCellProps {
  accessor: string;
  header: string;
  width: number;
  offsetLeft: number;
  align: "left" | "right" | "center";
  isFirst: boolean;
  isLast: boolean;
  isResizable: boolean;
  startResize: (accessor: string, startX: number, currentWidth: number) => void;
}

const HeaderCell = memo(function HeaderCell({
  accessor,
  header,
  width,
  align,
  isFirst,
  isLast,
  isResizable,
  startResize,
}: HeaderCellProps) {
  const resizeHandleBg = useColorModeValue("gray.400", "gray.600");

  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      startResize(accessor, e.clientX, width);
    },
    [accessor, width, startResize],
  );

  return (
    <Box
      width={`${width}px`}
      minWidth={`${width}px`}
      display="flex"
      alignItems="center"
      px={4}
      py={2}
      position="relative"
      textAlign={align}
      justifyContent={
        align === "right" ? "flex-end" : align === "center" ? "center" : "flex-start"
      }
      {...(isFirst && {
        borderTopLeftRadius: "xl",
        borderBottomLeftRadius: "xl",
      })}
      {...(isLast && {
        borderTopRightRadius: "xl",
        borderBottomRightRadius: "xl",
      })}
    >
      {header}
      {isResizable && (
        <Box
          position="absolute"
          right={0}
          top={0}
          bottom={0}
          width={`${RESIZE_HANDLE_WIDTH}px`}
          cursor="col-resize"
          onMouseDown={handleResizeMouseDown}
          _hover={{ bg: resizeHandleBg }}
          transition="background 0.15s ease"
        />
      )}
    </Box>
  );
});
