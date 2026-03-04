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
  Checkbox,
  CheckboxOn,
  ChevronDown2,
  Delete,
  Eye,
} from "pixelarticons/react";
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
        icon={<ChevronDown2 width={16} height={16} />}
      />
      <Portal>
        <MenuList>
          <MenuItem
            icon={<Eye width={16} height={16} />}
            onClick={onSeeDetails}
          >
            {t("transactions.menu.seeDetails")}
          </MenuItem>
          <MenuItem
            icon={
              isDisabled ? (
                <CheckboxOn width={16} height={16} />
              ) : (
                <Checkbox width={16} height={16} />
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
