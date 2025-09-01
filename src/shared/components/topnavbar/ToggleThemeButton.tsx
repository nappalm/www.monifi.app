import { IconButton, useColorMode } from "@chakra-ui/react";
import { IconMoonFilled, IconSunFilled } from "@tabler/icons-react";

export default function ToggleThemeButton() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
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
