import { formatCurrency, HatchBar } from "@/shared";
import { Card, CardBody, HStack, Stack, Tag, Text } from "@chakra-ui/react";
import { isEmpty } from "lodash";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import BottleChart from "./BottleChart";
import CategoryProgress from "./CategoryProgress";
import PeriodNavigation from "./PeriodNavigation";

type CategoryRow = {
  category_name: string;
  amount: number;
};

type Props = {
  categories: CategoryRow[];
  budgetAmount: number;
  spentAmount: number;
  period: { year: number; month: number };
  onPrevPeriod: () => void;
  onNextPeriod: () => void;
};

export default function RightPanel({
  categories,
  budgetAmount,
  spentAmount,
  period,
  onPrevPeriod,
  onNextPeriod,
}: Props) {
  const { t } = useTranslation();
  const allocatedAmount = useMemo(
    () => categories.reduce((sum, cat) => sum + cat.amount, 0),
    [categories],
  );

  const spentPct =
    budgetAmount > 0 ? Math.round((spentAmount / budgetAmount) * 100) : 0;
  const remainingAmount = budgetAmount - spentAmount;

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
      <HStack justify="space-between">
        <Stack gap={0}>
          <Text color="gray.500" fontSize="sm">
            {t("budgets.rightPanel.allocatedAmount")}
          </Text>
          <Text fontFamily="Geist Mono" fontSize="lg" fontWeight="semibold">
            {formatCurrency(allocatedAmount)}
          </Text>
        </Stack>
        <PeriodNavigation
          period={period}
          onPrev={onPrevPeriod}
          onNext={onNextPeriod}
        />
      </HStack>
      <BottleChart
        spentAmount={spentAmount}
        budgetAmount={budgetAmount}
        allocatedAmount={allocatedAmount}
      />
      <Card size="sm" mr={2} variant="solid">
        <CardBody>
          <Stack gap={1}>
            <Text fontSize="sm" color="gray.500">
              {t("budgets.rightPanel.spendingLimit")}
            </Text>
            <HatchBar value={spentAmount} max={budgetAmount} />
            <HStack justify="space-between">
              <Stack gap={0}>
                <Text color="gray.500" fontSize="sm">
                  {t("budgets.rightPanel.spent")}
                </Text>
                <HStack>
                  <Text fontFamily="Geist Mono">
                    {formatCurrency(spentAmount)}
                  </Text>
                  <Tag
                    size="sm"
                    colorScheme={remainingAmount < 0 ? "red" : "green"}
                  >
                    {spentPct}%
                  </Tag>
                </HStack>
              </Stack>
              <Stack gap={0} align="end">
                <Text color="gray.500" fontSize="sm">
                  {t("budgets.rightPanel.remaining")}
                </Text>
                <Text
                  color={remainingAmount < 0 ? "red.500" : undefined}
                  fontFamily="Geist Mono"
                >
                  {formatCurrency(remainingAmount)}
                </Text>
              </Stack>
            </HStack>
          </Stack>
        </CardBody>
      </Card>

      {!isEmpty(top5) && (
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
      )}
    </Stack>
  );
}
