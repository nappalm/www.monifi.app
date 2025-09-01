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
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import {
  IconChevronDown,
  IconDiamondFilled,
  IconLogout,
  IconSettings,
  IconUserFilled,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

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
          icon={<IconUserFilled size={18} />}
          bg="transparent"
        >
          {!isFree && (
            <AvatarBadge
              boxSize="2em"
              bg="linear-gradient(135deg, #006FEE 30%, #000 100%)"
              color="white"
            >
              <Box animation={`${popInAnimation} 0.4s ease-out forwards`}>
                <IconDiamondFilled size={15} />
              </Box>
            </AvatarBadge>
          )}
        </Avatar>
      </Box>
      <Menu>
        <MenuButton
          as={Button}
          size="sm"
          isLoading={isLoadingSession || loadingLogout}
          rightIcon={<IconChevronDown size={16} />}
        >
          {userName ?? user?.email}
        </MenuButton>
        <MenuList>
          <MenuItem
            onClick={() => handleNavigate(SETTINGS_PATHS.myProfile)}
            icon={<IconSettings size={18} />}
          >
            Profile settings
          </MenuItem>
          <MenuDivider />
          <MenuItem
            onClick={signOut}
            icon={<IconLogout size={18} />}
            color="red.500"
          >
            Logout
          </MenuItem>
        </MenuList>
      </Menu>
    </HStack>
  );
}
