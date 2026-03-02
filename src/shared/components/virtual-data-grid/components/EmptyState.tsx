import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import { memo, type ReactNode } from "react";

interface EmptyStateProps {
  height?: string;
  emptyState?: ReactNode;
}

export const EmptyState = memo(function EmptyState({
  height,
  emptyState,
}: EmptyStateProps) {
  const color = useColorModeValue("gray.500", "gray.400");

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight={height || "200px"}
      width="100%"
    >
      {emptyState ?? (
        <Text color={color} fontSize="sm">
          No data
        </Text>
      )}
    </Box>
  );
});
