import { formatCurrency } from "@/shared";
import { Card, CardBody, HStack, Stack, Text } from "@chakra-ui/react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import BottleChart from "./BottleChart";
import CategoryProgress from "./CategoryProgress";

type CategoryRow = {
  category_name: string;
  amount: number;
};

type Props = {
  categories: CategoryRow[];
  budgetAmount: number;
};

export default function RightPanel({ categories, budgetAmount }: Props) {
  const { t } = useTranslation();
  const allocatedAmount = useMemo(
    () => categories.reduce((sum, cat) => sum + cat.amount, 0),
    [categories],
  );

  const top5 = useMemo(() => {
    const sorted = [...categories].sort((a, b) => b.amount - a.amount);
    return sorted.slice(0, 5).map((cat) => ({
      label: cat.category_name,
      value: cat.amount,
      progress:
        budgetAmount > 0 ? Math.round((cat.amount / budgetAmount) * 100) : 0,
    }));
  }, [categories, budgetAmount]);

  return (
    <Stack>
      <Text fontWeight="semibold" fontSize="lg">
        {t("budgets.rightPanel.title")}
      </Text>
      <Stack gap={0}>
        <Text color="gray.500" fontSize="sm">
          {t("budgets.rightPanel.allocatedAmount")}
        </Text>
        <Text fontFamily="Geist Mono" fontSize="lg" fontWeight="semibold">
          {formatCurrency(allocatedAmount)}
        </Text>
      </Stack>
      <BottleChart categories={categories} budgetAmount={budgetAmount} />
      <Card size="sm" mr={2} mt={3}>
        <CardBody>
          <HStack justify="space-between" align="flex-end">
            <Stack gap={0}>
              <Text fontSize="xs" color="gray.500">
                {t("budgets.rightPanel.budgetAmount")}
              </Text>
              <Text fontWeight="semibold" fontFamily="Geist Mono" fontSize="sm">
                {formatCurrency(budgetAmount)}
              </Text>
            </Stack>
            {budgetAmount > 0 &&
              (() => {
                const usedPct = Math.round(
                  (allocatedAmount / budgetAmount) * 100,
                );
                const availablePct = 100 - usedPct;
                const isOver = availablePct < 0;
                return (
                  <Stack gap={0} align="flex-end">
                    <Text
                      fontSize="xs"
                      color={isOver ? "red.400" : "green.400"}
                    >
                      {isOver
                        ? t("budgets.rightPanel.over", { pct: availablePct })
                        : t("budgets.rightPanel.available", {
                            pct: availablePct,
                          })}
                    </Text>
                  </Stack>
                );
              })()}
          </HStack>
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
            value={cat.value}
          />
        ))}
      </Stack>
    </Stack>
  );
}
