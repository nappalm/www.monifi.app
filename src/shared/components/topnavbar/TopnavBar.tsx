import {
  Box,
  Button,
  ButtonGroup,
  Container,
  HStack,
  IconButton,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconChartArea, IconDatabase, IconMenu2 } from "@tabler/icons-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const bg = useColorModeValue("transparent", "transparent");
  const borderColor = useColorModeValue("gray.200", "gray.800");

  const handleNavigate = (path: string) => navigate(path);
  const isPathActive = (path: string) => pathname === path;

  return (
    <Box borderBottom="1px solid" borderColor={borderColor} bg={bg}>
      <Container maxW="container.xl">
        <HStack w="full" justifyContent="space-between" p={3}>
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
              <Image src="/logo.png" alt="logo" w="32px" />
            </Link>
            <ButtonGroup size="sm" spacing={1}>
              <Button
                variant={isPathActive("/transactions") ? "outline" : "ghost"}
                leftIcon={<IconDatabase size={18} />}
                onClick={() => handleNavigate("/transactions")}
              >
                Transactions
              </Button>
              <Button
                leftIcon={<IconChartArea size={18} />}
                onClick={() => handleNavigate("/statistics")}
                variant={isPathActive("/statistics") ? "outline" : "ghost"}
              >
                Statistics
              </Button>
            </ButtonGroup>
          </HStack>
          <HStack>
            <ToggleThemeButton />
            <UserMenu />
          </HStack>
        </HStack>
      </Container>
    </Box>
  );
}
