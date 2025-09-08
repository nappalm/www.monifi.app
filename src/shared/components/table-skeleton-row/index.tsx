import { Skeleton, Td, Tr } from "@chakra-ui/react";

interface TableSkeletonRowProps {
  rows: number;
  cols: number;
}

export const TableSkeletonRow = ({
  rows = 3,
  cols = 5,
}: TableSkeletonRowProps) => {
  return Array.from({ length: rows }).map((_, rowIndex) => (
    <Tr key={`skeleton-row-${rowIndex}`}>
      {Array.from({ length: cols }).map((_, colIndex) => (
        <Td key={`skeleton-col-${rowIndex}-${colIndex}`}>
          <Skeleton height="20px" />
        </Td>
      ))}
    </Tr>
  ));
};
