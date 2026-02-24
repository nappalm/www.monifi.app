import { Box, Portal } from "@chakra-ui/react";
import { memo, useEffect, useRef, type ReactNode } from "react";

interface GridMenuProps {
  isOpen: boolean;
  anchorRect: { top: number; left: number } | null;
  onClose: () => void;
  children: ReactNode;
}

export const GridMenu = memo(function GridMenu({
  isOpen,
  anchorRect,
  onClose,
  children,
}: GridMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    // Defer to avoid the opening click closing immediately
    const id = requestAnimationFrame(() => {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    });
    return () => {
      cancelAnimationFrame(id);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !anchorRect) return null;

  return (
    <Portal>
      <Box
        ref={menuRef}
        position="fixed"
        top={`${anchorRect.top}px`}
        left={`${anchorRect.left}px`}
        zIndex="popover"
        bg="gray.800"
        borderRadius="md"
        border="1px solid"
        borderColor="gray.600"
        boxShadow="lg"
        py={1}
        minW="160px"
        overflow="hidden"
      >
        {children}
      </Box>
    </Portal>
  );
});
