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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

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
            {t("transactions.menu.seeDetails")}
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
            {isDisabled
              ? t("transactions.menu.enable")
              : t("transactions.menu.disable")}
          </MenuItem>
          <MenuDivider />
          <MenuItem
            icon={<IconTrash size={16} />}
            color="red.500"
            onClick={onDelete}
          >
            {t("transactions.menu.delete")}
          </MenuItem>
        </MenuList>
      </Portal>
    </Menu>
  );
}
