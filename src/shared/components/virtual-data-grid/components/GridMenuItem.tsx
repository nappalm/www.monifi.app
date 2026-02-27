import { Box, type BoxProps } from "@chakra-ui/react";
import { memo } from "react";

interface GridMenuItemProps extends BoxProps {
  isDanger?: boolean;
}

export const GridMenuItem = memo(function GridMenuItem({
  children,
  isDanger,
  ...rest
}: GridMenuItemProps) {
  return (
    <Box
      px={3}
      py={2}
      cursor="pointer"
      fontSize="sm"
      transition="background 0.1s ease"
      color={isDanger ? "red.400" : undefined}
      _hover={{ bg: "whiteAlpha.100" }}
      {...rest}
    >
      {children}
    </Box>
  );
});
