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
  Stack,
  Text,
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

function getBudgetDescription(
  budget: Tables<"budgets">,
  t: (key: string) => string,
) {
  if (budget.recurrent) return t("budgets.selector.recurrent");
  if (!budget.specific_year) return t("budgets.selector.repeatsYearly");
  if (Number(budget.specific_year) < new Date().getFullYear())
    return t("budgets.selector.expired");
  return t("budgets.selector.custom");
}

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
          {data.map((budget) => {
            const description = getBudgetDescription(budget, t);
            const isExpired = description === t("budgets.selector.expired");
            return (
              <MenuItem
                key={budget.id}
                icon={<IconBucket size={16} />}
                opacity={isExpired ? 0.5 : 1}
                onClick={() => onSelect(budget)}
              >
                <Stack gap={0}>
                  <Text color={isExpired ? "gray.500" : undefined}>
                    {budget.name}
                  </Text>
                  <Text color={isExpired ? "red.500" : "gray.500"}>
                    {description}
                  </Text>
                </Stack>
              </MenuItem>
            );
          })}
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
