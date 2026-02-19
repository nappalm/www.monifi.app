import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
} from "@chakra-ui/react";
import { IconDots, IconTrashFilled } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

type Props = {
  onDelete: VoidFunction;
};

export default function TableRowMenu({ onDelete }: Props) {
  const { t } = useTranslation();

  return (
    <Menu isLazy>
      <MenuButton
        as={IconButton}
        w="full"
        aria-label="Row options"
        size="xs"
        display="flex"
        variant="unstyled"
        icon={<IconDots size={16} />}
      />
      <Portal>
        <MenuList>
          <MenuItem
            icon={<IconTrashFilled size={16} />}
            color="red.500"
            onClick={onDelete}
          >
            {t("budgets.menu.delete")}
          </MenuItem>
        </MenuList>
      </Portal>
    </Menu>
  );
}
