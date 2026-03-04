import { SETTINGS_PATHS } from "@/features/settings";
import { useAuthenticatedUser, useSignOut } from "@/shared/hooks";
import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  useDisclosure,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import {
  Bug,
  ChevronDown,
  DiamondGem,
  Logout,
  SettingsCog,
  User,
} from "pixelarticons/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ReportProblemDrawer } from "../report-problem-drawer";

const popInAnimation = keyframes`
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

export default function UserMenu() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const reports = useDisclosure();

  const { mutate: signOut, isPending: loadingLogout } = useSignOut();
  const { user, isLoadingSession, isFree, profile } = useAuthenticatedUser();

  const handleNavigate = (path: string) => navigate(path);

  const userName = profile?.name ?? user?.user_metadata?.name;

  return (
    <HStack>
      <Box
        bg={
          isFree
            ? "transparent"
            : "linear-gradient(135deg, #006FEE 30%, #000 100%)"
        }
        p="3px"
        borderRadius="full"
      >
        <Avatar
          src={user?.user_metadata?.avatar_url}
          size="xs"
          name={userName}
          icon={<User width={18} height={18} />}
          bg="transparent"
        >
          {!isFree && (
            <AvatarBadge
              boxSize="2em"
              bg="linear-gradient(135deg, #006FEE 30%, #000 100%)"
              color="white"
            >
              <Box animation={`${popInAnimation} 0.4s ease-out forwards`}>
                <DiamondGem width={15} height={15} />
              </Box>
            </AvatarBadge>
          )}
        </Avatar>
      </Box>
      <Menu>
        <MenuButton
          as={Button}
          size="sm"
          variant="outline"
          isLoading={isLoadingSession || loadingLogout}
          rightIcon={<ChevronDown width={16} height={16} />}
        >
          {userName ?? user?.email}
        </MenuButton>
        <MenuList>
          <MenuItem
            onClick={() => handleNavigate(SETTINGS_PATHS.myProfile)}
            icon={<SettingsCog width={18} height={18} />}
          >
            {t("components.userMenu.profileSettings")}
          </MenuItem>
          <MenuItem icon={<Bug width={18} height={18} />} onClick={reports.onToggle}>
            {t("components.userMenu.reportProblem")}
          </MenuItem>
          {/* <MenuItem icon={<IconMessage size={18} />}> */}
          {/*   {t("components.userMenu.sendComments")} */}
          {/* </MenuItem> */}
          <MenuDivider />
          <MenuItem
            onClick={() => signOut()}
            icon={<Logout width={18} height={18} />}
            color="red.500"
          >
            {t("components.userMenu.logout")}
          </MenuItem>
        </MenuList>
      </Menu>

      <ReportProblemDrawer {...reports} />
    </HStack>
  );
}
