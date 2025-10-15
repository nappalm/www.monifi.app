import {
  Box,
  Button,
  ButtonGroup,
  Container,
  HStack,
  IconButton,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconMenu2 } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Logo } from "../logo";
import ToggleThemeButton from "./ToggleThemeButton";
import UserMenu from "./UserMenu";

type Props = {
  onMenuClick?: VoidFunction;
};

export default function Topnavbar({ onMenuClick }: Props) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const bg = useColorModeValue("transparent", "transparent");
  const borderColor = useColorModeValue("gray.200", "gray.800");

  const handleNavigate = (path: string) => navigate(path);
  const isPathActive = (path: string) => pathname === path;
  const isSmallScreen = useBreakpointValue({ base: true, lg: false });

  return (
    <Box borderBottom="1px solid" borderColor={borderColor} bg={bg}>
      <Container maxW="1400px">
        <HStack w="full" justifyContent="space-between" p={3}>
          <HStack>
            <IconButton
              variant="ghost"
              display={["flex", "flex", "flex", "none"]}
              aria-label={t("components.topnavbar.sidebarMenu")}
              size="sm"
              icon={<IconMenu2 size={18} />}
              onClick={() => onMenuClick?.()}
            />
            {!isSmallScreen && (
              <Link to="/">
                <Logo
                  w="20px"
                  h="20px"
                  mr={2}
                  opacity={0.5}
                  _hover={{
                    transition: "all 300ms ease-in-out",
                    opacity: 1,
                    transform: "rotate(-10deg)",
                    w: "21px",
                    h: "21px",
                  }}
                />
              </Link>
            )}
            <ButtonGroup size="sm" spacing={1}>
              <Button
                variant="solid"
                fontWeight={isPathActive("/transactions") ? "bold" : undefined}
                opacity={isPathActive("/transactions") ? 1 : 0.5}
                onClick={() => handleNavigate("/transactions")}
                bg="transparent"
              >
                {t("components.topnavbar.transactions")}
              </Button>
              <Button
                onClick={() => handleNavigate("/statistics")}
                variant="solid"
                bg="transparent"
                fontWeight={isPathActive("/statistics") ? "bold" : undefined}
                opacity={isPathActive("/statistics") ? 1 : 0.5}
              >
                {t("components.topnavbar.statistics")}
              </Button>
            </ButtonGroup>
          </HStack>
          <HStack display={["none", "none", "none", "flex"]}>
            <ToggleThemeButton />
            <UserMenu />
          </HStack>
        </HStack>
      </Container>
    </Box>
  );
}
