import { Box, Skeleton } from "@chakra-ui/react";
import { memo } from "react";

interface SkeletonRowsProps {
  rows?: number;
  cols: number;
  rowHeight: number;
  totalWidth: number;
}

export const SkeletonRows = memo(function SkeletonRows({
  rows = 5,
  cols,
  rowHeight,
  totalWidth,
}: SkeletonRowsProps) {
  return (
    <Box width={`${totalWidth}px`} minWidth="100%">
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <Box
          key={rowIdx}
          display="flex"
          height={`${rowHeight}px`}
          alignItems="center"
          gap={2}
          px={4}
        >
          {Array.from({ length: cols }).map((_, colIdx) => (
            <Skeleton key={colIdx} height="16px" flex={1} borderRadius="sm" />
          ))}
        </Box>
      ))}
    </Box>
  );
});
