import { Box, useColorModeValue } from "@chakra-ui/react";
import { transparentize } from "@chakra-ui/theme-tools";
import { memo } from "react";

interface DragHandleProps {
  position: "top" | "bottom";
  onDragStart: (e: React.MouseEvent, direction: "up" | "down") => void;
  isVisible: boolean;
}

export const DragHandle = memo(function DragHandle({
  position,
  onDragStart,
  isVisible,
}: DragHandleProps) {
  const handleBg = useColorModeValue(
    "cyan.500",
    transparentize("cyan.500", 0.5),
  ) as string;
  const handleBgHover = useColorModeValue("cyan.600", "cyan.300");

  const direction = position === "top" ? "up" : "down";

  return (
    <Box
      data-drag-handle
      position="absolute"
      left="50%"
      transform="translateX(-50%)"
      {...(position === "top" ? { top: "-2px" } : { bottom: "-2px" })}
      width="50px"
      height="5px"
      bg={handleBg}
      borderRadius="full"
      cursor={position === "top" ? "n-resize" : "s-resize"}
      zIndex={999}
      opacity={isVisible ? 1 : 0}
      transition="opacity 0.2s ease, transform 0.15s ease, background 0.15s ease"
      pointerEvents={isVisible ? "auto" : "none"}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onDragStart(e, direction);
      }}
      _hover={{
        bg: handleBgHover,
        transform: "translateX(-50%) scale(1.2)",
      }}
      _active={{
        transform: "translateX(-50%) scale(0.9)",
      }}
      sx={{
        position: "absolute !important",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      }}
    />
  );
});
