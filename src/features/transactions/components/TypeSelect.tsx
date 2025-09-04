import _colors from "@/lib/chakra-ui/_colors";
import {
  Button,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Portal,
} from "@chakra-ui/react";
import { IconChevronDown, IconChevronsDown } from "@tabler/icons-react";

export default function TypeSelect() {
  return (
    <Menu isLazy>
      <MenuButton
        size="xs"
        variant="unstyled"
        as={Button}
        leftIcon={<IconChevronsDown color={_colors.red[500]} size={12} />}
        rightIcon={<IconChevronDown size={12} />}
        w="full"
        borderRadius="inherit"
      >
        Expense
      </MenuButton>
      <Portal>
        <MenuList>
          <MenuOptionGroup>
            <MenuItemOption>Income</MenuItemOption>
            <MenuItemOption>Expense</MenuItemOption>
          </MenuOptionGroup>
        </MenuList>
      </Portal>
    </Menu>
  );
}
