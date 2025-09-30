import { IconButton, IconButtonProps, useColorMode } from "@chakra-ui/react";
import { IconMoonFilled, IconSunFilled } from "@tabler/icons-react";
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
          <IconMoonFilled size={18} />
        ) : (
          <IconSunFilled size={18} />
        )
      }
    />
  );
}
