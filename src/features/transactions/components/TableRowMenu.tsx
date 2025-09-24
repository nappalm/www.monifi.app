import {
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Portal,
} from "@chakra-ui/react";
import {
  IconDots,
  IconSwipe,
  IconToggleLeftFilled,
  IconToggleRightFilled,
  IconTrash,
} from "@tabler/icons-react";

type Props = {
  isDisabled: boolean;
  onDisabled: VoidFunction;
  onSeeDetails: VoidFunction;
  onDelete: VoidFunction;
};

export default function TableRowMenu({
  isDisabled,
  onDisabled,
  onSeeDetails,
  onDelete,
}: Props) {
  return (
    <Menu isLazy>
      <MenuButton
        as={IconButton}
        w="full"
        aria-label="Row options"
        size="xs"
        variant="unstyled"
        pl="7px"
        icon={<IconDots size={16} />}
      />
      <Portal>
        <MenuList>
          <MenuItem icon={<IconSwipe size={16} />} onClick={onSeeDetails}>
            See details
          </MenuItem>
          <MenuItem
            icon={
              isDisabled ? (
                <IconToggleRightFilled size={16} />
              ) : (
                <IconToggleLeftFilled size={16} />
              )
            }
            onClick={onDisabled}
          >
            {isDisabled ? "Enable" : "Disable"}
          </MenuItem>
          <MenuDivider />
          <MenuItem
            icon={<IconTrash size={16} />}
            color="red.500"
            onClick={onDelete}
          >
            Delete transaction
          </MenuItem>
        </MenuList>
      </Portal>
    </Menu>
  );
}
