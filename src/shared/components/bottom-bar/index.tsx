import { SETTINGS_PATHS } from "@/features/settings";
import { useAuthenticatedUser } from "@/shared/hooks";
import {
  Avatar,
  Badge,
  Button,
  ButtonGroup,
  HStack,
  IconButton,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  IconBucket,
  IconChevronRight,
  IconMountain,
  IconSunFilled,
  IconTransactionDollar,
  IconUserFilled,
  IconVectorSpline,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function BottomBar() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { user, isFree, profile } = useAuthenticatedUser();

  const navigate = useNavigate();
  const colorMode = useColorMode();
  const bg = useColorModeValue("gray.200", "gray.800");
  const border = useColorModeValue("gray.300", "gray.700");

  const userName = profile?.name ?? user?.user_metadata?.name;
  const isPathActive = (path: string) => pathname === path;

  const handleNavigate = (path: string) => navigate(path);

  return (
    <HStack
      position="fixed"
      zIndex={10}
      borderTop="1px solid"
      borderColor={border}
      bottom={0}
      height="45px"
      bg={bg}
      w="full"
      px={2}
      justify="space-between"
    >
      <HStack>
        <Text fontFamily="Geist Mono" pl={2} color="gray.500">
          {t("components.bottombar.pages")}
        </Text>
        <IconChevronRight size={16} opacity={0.3} />
        <ButtonGroup size="sm" variant="sidebar">
          <Button
            isActive={isPathActive("/transactions")}
            leftIcon={<IconTransactionDollar size={16} />}
            onClick={() => handleNavigate("/transactions")}
          >
            {t("components.bottombar.transactions")}
          </Button>
          <Button
            leftIcon={<IconBucket size={16} />}
            isActive={isPathActive("/budgets")}
            onClick={() => handleNavigate("/budgets")}
          >
            {t("components.bottombar.budgets")}
          </Button>
          <Button
            leftIcon={<IconMountain size={16} />}
            isActive={isPathActive("/goals")}
            onClick={() => handleNavigate("/goals")}
          >
            {t("components.bottombar.goals")}
          </Button>
          <Button
            onClick={() => handleNavigate("/statistics")}
            leftIcon={<IconVectorSpline size={16} />}
            isActive={isPathActive("/statistics")}
          >
            {t("components.bottombar.statistics")}
          </Button>
          <IconButton
            aria-label={t("components.bottombar.themeToggle")}
            size="sm"
            variant="ghost"
            icon={<IconSunFilled size={16} />}
            onClick={colorMode.toggleColorMode}
          />
        </ButtonGroup>
      </HStack>
      <Link to={SETTINGS_PATHS.base}>
        <HStack
          bg={isFree ? "transparent" : border}
          p="2px"
          borderRadius="full"
          gap="1px"
        >
          {!isFree && (
            <Badge mx={1} borderRadius="full">
              PRO
            </Badge>
          )}
          <Avatar
            src={user?.user_metadata?.avatar_url}
            size="xs"
            name={userName}
            icon={<IconUserFilled size={18} />}
            bg="transparent"
          />
        </HStack>
      </Link>
    </HStack>
  );
}
