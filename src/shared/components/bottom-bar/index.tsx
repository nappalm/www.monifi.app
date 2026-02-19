import { SETTINGS_PATHS } from "@/features/settings";
import { useAuthenticatedUser } from "@/shared/hooks";
import {
  Avatar,
  Badge,
  Button,
  ButtonGroup,
  HStack,
  IconButton,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  IconBucket,
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
    >
      <HStack gap={3}>
        <Link to={SETTINGS_PATHS.base}>
          <HStack
            bg={isFree ? "transparent" : border}
            p="2px"
            borderRadius="full"
            gap="1px"
          >
            <Avatar
              src={user?.user_metadata?.avatar_url}
              size="xs"
              name={userName}
              icon={<IconUserFilled size={18} />}
              bg="transparent"
            />
            {!isFree && (
              <Badge mx={1} borderRadius="full">
                PRO
              </Badge>
            )}
          </HStack>
        </Link>
        <ButtonGroup size="sm" variant="ghost">
          <Button
            variant={isPathActive("/transactions") ? "solid" : "ghost"}
            leftIcon={<IconTransactionDollar size={16} />}
            onClick={() => handleNavigate("/transactions")}
          >
            {t("components.topnavbar.transactions")}
          </Button>
          <Button
            leftIcon={<IconBucket size={16} />}
            variant={isPathActive("/budgets") ? "solid" : "ghost"}
            onClick={() => handleNavigate("/budgets")}
          >
            Budget
          </Button>
          <Button
            onClick={() => handleNavigate("/statistics")}
            leftIcon={<IconVectorSpline size={16} />}
            variant={isPathActive("/statistics") ? "solid" : "ghost"}
          >
            {t("components.topnavbar.statistics")}
          </Button>
        </ButtonGroup>
        <IconButton
          aria-label="Theme toggle"
          size="sm"
          variant="ghost"
          icon={<IconSunFilled size={16} />}
          onClick={colorMode.toggleColorMode}
        />
      </HStack>
    </HStack>
  );
}
