import { SETTINGS_PATHS } from "@/features/settings";
import { ButtonSound, IconButtonSound } from "@/shared/components/button-sound";
import { useAuthenticatedUser } from "@/shared/hooks";
import {
  Avatar,
  Badge,
  ButtonGroup,
  HStack,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  Blocks,
  BottleWine,
  ChartBarBig,
  ChevronRight,
  Goal,
  LightbulbOff,
  User,
  Volume2,
} from "pixelarticons/react";
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
        <ChevronRight height={16} width={16} opacity={0.3} />
        <ButtonGroup size="sm" variant="sidebar">
          <ButtonSound
            isActive={isPathActive("/transactions")}
            leftIcon={<Blocks height={16} width={16} />}
            onClick={() => handleNavigate("/transactions")}
          >
            {t("components.bottombar.transactions")}
          </ButtonSound>
          <ButtonSound
            leftIcon={<BottleWine height={16} width={16} />}
            isActive={isPathActive("/budgets")}
            onClick={() => handleNavigate("/budgets")}
          >
            {t("components.bottombar.budgets")}
          </ButtonSound>
          <ButtonSound
            leftIcon={<Goal height={16} width={16} />}
            isActive={isPathActive("/goals")}
            onClick={() => handleNavigate("/goals")}
          >
            {t("components.bottombar.goals")}
          </ButtonSound>
          <ButtonSound
            onClick={() => handleNavigate("/statistics")}
            leftIcon={<ChartBarBig height={16} width={16} />}
            isActive={isPathActive("/statistics")}
          >
            {t("components.bottombar.statistics")}
          </ButtonSound>
        </ButtonGroup>
      </HStack>
      <HStack>
        <IconButtonSound
          aria-label={t("components.bottombar.themeToggle")}
          size="sm"
          variant="ghost"
          icon={<Volume2 height={17} width={17} />}
        />
        <IconButtonSound
          aria-label={t("components.bottombar.themeToggle")}
          size="sm"
          variant="ghost"
          icon={<LightbulbOff height={17} width={17} />}
          onClick={colorMode.toggleColorMode}
        />

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
              icon={<User width={18} height={18} />}
              bg="transparent"
            />
          </HStack>
        </Link>
      </HStack>
    </HStack>
  );
}
