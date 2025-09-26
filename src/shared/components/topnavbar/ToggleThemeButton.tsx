import { IconButton, IconButtonProps, useColorMode } from "@chakra-ui/react";
import { IconMoonFilled, IconSunFilled } from "@tabler/icons-react";

export default function ToggleThemeButton(
  props?: Omit<IconButtonProps, "aria-label">,
) {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      {...props}
      aria-label="toggle theme"
      variant="ghost"
      onClick={toggleColorMode}
      size="sm"
      icon={
        colorMode === "light" ? (
          <IconMoonFilled size={18} />
        ) : (
          <IconSunFilled size={18} />
        )
      }
    />
  );
}
