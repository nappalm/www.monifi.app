import { HStack, IconButton, Image, useColorModeValue } from "@chakra-ui/react";
import { IconMenu2 } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import ToggleThemeButton from "./ToggleThemeButton";
import UserMenu from "./UserMenu";

type Props = {
  onMenuClick?: VoidFunction;
  hideResponseMenu?: boolean;
};

export default function Topnavbar({
  onMenuClick,
  hideResponseMenu = false,
}: Props) {
  const bg = useColorModeValue("transparent", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.800");

  return (
    <HStack
      w="full"
      justifyContent="space-between"
      p={3}
      bg={bg}
      borderBottom="1px solid"
      borderColor={borderColor}
    >
      <HStack>
        {!hideResponseMenu && (
          <IconButton
            variant="ghost"
            display={["flex", "flex", "flex", "none"]}
            aria-label="Sidebar menu"
            size="sm"
            icon={<IconMenu2 size={18} />}
            onClick={() => onMenuClick?.()}
          />
        )}
        <Link to="/">
          <Image src="/logo.png" alt="logo" w="32px" h="32px" />
        </Link>
      </HStack>
      <HStack>
        <ToggleThemeButton />
        <UserMenu />
      </HStack>
    </HStack>
  );
}
