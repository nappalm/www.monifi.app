import {
  Button,
  Input,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Portal,
} from "@chakra-ui/react";
import { IconChevronDown, IconTag } from "@tabler/icons-react";

export default function CategorySelect() {
  return (
    <Menu isLazy>
      <MenuButton
        size="xs"
        variant="unstyled"
        as={Button}
        leftIcon={<IconTag size={12} />}
        rightIcon={<IconChevronDown size={12} />}
        w="full"
        borderRadius="inherit"
        fontWeight="semibold"
      >
        Category
      </MenuButton>
      <Portal>
        <MenuList>
          <Input mb={1} placeholder="Search or create" />
          <MenuOptionGroup>
            <MenuItemOption>Category name</MenuItemOption>
            <MenuItemOption>Category name</MenuItemOption>
            <MenuItemOption>Category name</MenuItemOption>
            <MenuItemOption>Category name</MenuItemOption>
            <MenuItemOption>Category name</MenuItemOption>
          </MenuOptionGroup>
        </MenuList>
      </Portal>
    </Menu>
  );
}
