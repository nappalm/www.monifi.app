import {
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Portal,
} from "@chakra-ui/react";
import { Delete, Hand, MoreVertical, Switch } from "pixelarticons/react";
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
        icon={<MoreVertical width={16} height={16} />}
      />
      <Portal>
        <MenuList>
          <MenuItem icon={<Hand width={16} height={16} />} onClick={onSeeDetails}>
            {t("transactions.menu.seeDetails")}
          </MenuItem>
          <MenuItem
            icon={
              isDisabled ? (
                <Switch width={16} height={16} />
              ) : (
                <Switch width={16} height={16} />
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
            icon={<Delete width={16} height={16} />}
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
