import { Tables } from "@/lib/supabase/database.types";
import { formatCurrency, HatchBar } from "@/shared";
import {
  Card,
  CardBody,
  HStack,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { SpendingByCategory } from "../hooks/useBudgetSpending";
import { SelectedPeriod } from "../utils/period";
import BottleChart from "./BottleChart";
import CategoryProgress from "./CategoryProgress";
import PeriodNavigator from "./PeriodNavigator";

type CategoryRow = {
  category_id: number;
  category_name: string;
  amount: number;
};

type Props = {
  categories: CategoryRow[];
  budgetAmount: number;
  budget: Tables<"budgets">;
  period: SelectedPeriod;
  onPeriodChange: (period: SelectedPeriod) => void;
  spentTotal: number;
  spentByCategory: SpendingByCategory;
};

export default function RightPanel({
  categories,
  budgetAmount,
  budget,
  period,
  onPeriodChange,
  spentTotal,
  spentByCategory,
}: Props) {
  const { t } = useTranslation();

  const spentPct =
    budgetAmount > 0 ? Math.round((spentTotal / budgetAmount) * 100) : 0;
  const remainingAmount = budgetAmount - spentTotal;

  const top5 = useMemo(() => {
    const sorted = [...categories].sort((a, b) => b.amount - a.amount);
    return sorted.slice(0, 5).map((cat) => ({
      label: cat.category_name,
      limit: cat.amount,
      spent: spentByCategory[cat.category_id] ?? 0,
      progress:
        cat.amount > 0
          ? Math.min(
              100,
              Math.round(((spentByCategory[cat.category_id] ?? 0) / cat.amount) * 100),
            )
          : 0,
    }));
  }, [categories, spentByCategory]);

  // Para el BottleChart seguimos usando las categorías con sus límites (vista de plan)
  const bottleCategories = useMemo(
    () => categories.map((c) => ({ category_name: c.category_name, amount: c.amount })),
    [categories],
  );

  return (
    <Stack>
      <Text fontWeight="semibold" fontSize="lg">
        {t("budgets.rightPanel.title")}
      </Text>
      <HStack justify="space-between">
        <Stack gap={0}>
          <Text color="gray.500" fontSize="sm">
            {t("budgets.rightPanel.allocatedAmount")}
          </Text>
          <Text fontFamily="Geist Mono" fontSize="lg" fontWeight="semibold">
            {formatCurrency(spentTotal)}
          </Text>
        </Stack>
        <PeriodNavigator
          budget={budget}
          period={period}
          onChange={onPeriodChange}
        />
      </HStack>
      <BottleChart categories={bottleCategories} budgetAmount={budgetAmount} />
      <Card size="sm" mr={2} variant="solid">
        <CardBody>
          <Stack gap={1}>
            <Text fontSize="sm" color="gray.500">
              {t("budgets.rightPanel.spendingLimit")}
            </Text>
            <HatchBar value={spentTotal} max={budgetAmount} />
            <HStack justify="space-between">
              <Stack gap={0}>
                <Text color="gray.500" fontSize="sm">
                  {t("budgets.rightPanel.spent")}
                </Text>
                <HStack>
                  <Text>{formatCurrency(spentTotal)}</Text>
                  <Tag size="sm">{spentPct}%</Tag>
                </HStack>
              </Stack>
              <Stack gap={0} align="end">
                <Text color="gray.500" fontSize="sm">
                  {t("budgets.rightPanel.remaining")}
                </Text>
                <Text>{formatCurrency(remainingAmount)}</Text>
              </Stack>
            </HStack>
          </Stack>
        </CardBody>
      </Card>

      <Stack gap={2} mt={4}>
        <Text fontWeight="semibold" fontSize="lg">
          {t("budgets.rightPanel.allocationTitle")}
        </Text>
        {top5.map((cat) => (
          <CategoryProgress
            key={cat.label}
            label={cat.label}
            progress={cat.progress}
            value={cat.spent}
          />
        ))}
      </Stack>
    </Stack>
  );
}
