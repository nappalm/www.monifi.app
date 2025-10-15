import { SETTINGS_PATHS } from "@/features/settings";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Stack,
  Text,
  UseDisclosureProps,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { Logo } from "../logo";
import ToggleThemeButton from "./ToggleThemeButton";

export default function TopnavbarMobile({
  isOpen = false,
  onClose,
}: UseDisclosureProps) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose?.();
  };

  const isPathActive = (path: string) => pathname === path;

  return (
    <Drawer placement="left" isOpen={isOpen} onClose={() => onClose?.()}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>
          <HStack gap={3}>
            <Logo />
            <Text>Monifi</Text>
          </HStack>
        </DrawerHeader>
        <DrawerBody>
          <Stack justify="space-between" h="100%">
            <Stack gap="1px">
              <Box
                position="relative"
                w="full"
                _before={{
                  content: "''",
                  position: "absolute",
                  w: "4px",
                  h: "70%",
                  bg: "cyan.500",
                  left: -2,
                  top: "10%",
                  borderRadius: "full",
                  opacity: isPathActive("/transactions") ? 1 : 0,
                  transition: "opacity 0.2s ease-in-out",
                }}
              >
                <Button
                  variant={isPathActive("/transactions") ? "solid" : "ghost"}
                  onClick={() => handleNavigate("/transactions")}
                  justifyContent="start"
                  w="full"
                >
                  {t("components.topnavbar.transactions")}
                </Button>
              </Box>
              <Box
                position="relative"
                w="full"
                _before={{
                  content: "''",
                  position: "absolute",
                  w: "4px",
                  h: "70%",
                  bg: "cyan.500",
                  left: -2,
                  top: "10%",
                  borderRadius: "full",
                  opacity: isPathActive("/statistics") ? 1 : 0,
                  transition: "opacity 0.2s ease-in-out",
                }}
              >
                <Button
                  onClick={() => handleNavigate("/statistics")}
                  variant={isPathActive("/statistics") ? "solid" : "ghost"}
                  justifyContent="start"
                  w="full"
                >
                  {t("components.topnavbar.statistics")}
                </Button>
              </Box>
            </Stack>
            <Stack>
              <HStack>
                <ToggleThemeButton />
                <Button
                  w="full"
                  onClick={() => handleNavigate(SETTINGS_PATHS.myProfile)}
                >
                  {t("components.userMenu.profileSettings")}
                </Button>
              </HStack>
            </Stack>
          </Stack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
