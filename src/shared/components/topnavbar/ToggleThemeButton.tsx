import { IconButton, IconButtonProps, useColorMode } from "@chakra-ui/react";
import { Moon, Lightbulb } from "pixelarticons/react";
import { useTranslation } from "react-i18next";

export default function ToggleThemeButton(
  props?: Omit<IconButtonProps, "aria-label">,
) {
  const { t } = useTranslation();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      {...props}
      aria-label={t("components.toggleThemeButton.toggleTheme")}
      variant="ghost"
      onClick={toggleColorMode}
      size="sm"
      icon={
        colorMode === "light" ? (
          <Moon width={18} height={18} />
        ) : (
          <Lightbulb width={18} height={18} />
        )
      }
    />
  );
}
