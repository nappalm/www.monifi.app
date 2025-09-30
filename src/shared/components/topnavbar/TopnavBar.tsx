import {
  Box,
  Button,
  ButtonGroup,
  Container,
  HStack,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconMenu2 } from "@tabler/icons-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Logo } from "../logo";
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
      <Container maxW="1400px">
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
            <ButtonGroup size="sm" spacing={1}>
              <Button
                variant="solid"
                fontWeight={isPathActive("/transactions") ? "bold" : undefined}
                opacity={isPathActive("/transactions") ? 1 : 0.5}
                onClick={() => handleNavigate("/transactions")}
                bg="transparent"
              >
                Transactions
              </Button>
              <Button
                onClick={() => handleNavigate("/statistics")}
                variant="solid"
                bg="transparent"
                fontWeight={isPathActive("/statistics") ? "bold" : undefined}
                opacity={isPathActive("/statistics") ? 1 : 0.5}
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
