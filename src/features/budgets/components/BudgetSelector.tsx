import { Tables } from "@/lib/supabase/database.types";
import {
  Button,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { IconBucket, IconChevronDown, IconPlus } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

type Props = {
  data: Tables<"budgets">[];
  selected: Tables<"budgets"> | null;
  onSelect: (budget: Tables<"budgets">) => void;
  onEdit: (budget: Tables<"budgets">) => void;
  onNew: VoidFunction;
};

export default function BudgetSelector({
  data,
  selected,
  onNew,
  onSelect,
  onEdit,
}: Props) {
  const { t } = useTranslation();
  return (
    <HStack gap={0}>
      <Button
        size="sm"
        variant="solid"
        borderRightRadius={0}
        onClick={() => selected && onEdit(selected)}
        leftIcon={<IconBucket size={16} />}
      >
        {selected?.name ?? t("budgets.selector.selectBudget")}
      </Button>
      <Menu>
        <MenuButton
          size="sm"
          variant="solid"
          ml="-1px"
          as={IconButton}
          borderLeftRadius={0}
          icon={<IconChevronDown size={16} />}
        />
        <MenuList>
          {data.map((budget) => (
            <MenuItem
              key={budget.id}
              icon={<IconBucket size={16} />}
              onClick={() => onSelect(budget)}
            >
              {budget.name}
            </MenuItem>
          ))}
          <MenuDivider />
          <MenuItem
            color="green.500"
            icon={<IconPlus size={16} />}
            onClick={onNew}
          >
            {t("budgets.selector.addNew")}
          </MenuItem>
        </MenuList>
      </Menu>
    </HStack>
  );
}
