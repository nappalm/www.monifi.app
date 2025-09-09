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
  IconArrowRight,
  IconCancel,
  IconDots,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";

type Props = {
  onConfig: () => void;
  onEdit: () => void;
  onDisabled: () => void;
  onDelete: () => void;
};

export default function TableRowMenu({
  onConfig,
  onEdit,
  onDisabled,
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
        icon={<IconDots size={15} />}
      />
      <Portal>
        <MenuList>
          <MenuItem
            icon={<IconArrowRight size={16} />}
            color="cyan.500"
            onClick={onConfig}
          >
            Config budget
          </MenuItem>
          <MenuDivider />
          <MenuItem icon={<IconPencil size={16} />} onClick={onEdit}>
            Edit information
          </MenuItem>
          <MenuItem icon={<IconCancel size={16} />} onClick={onDisabled}>
            Disabled
          </MenuItem>
          <MenuDivider />
          <MenuItem
            icon={<IconTrash size={16} />}
            color="red.500"
            onClick={onDelete}
          >
            Delete budget
          </MenuItem>
        </MenuList>
      </Portal>
    </Menu>
  );
}
