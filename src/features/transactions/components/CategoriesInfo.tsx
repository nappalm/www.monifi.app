import { Tables } from "@/lib";
import { formatCurrency, useCategories, useAuthenticatedUser } from "@/shared";
import {
  Card,
  CardBody,
  HStack,
  Progress,
  Stack,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { isEmpty } from "lodash";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  transactions: Tables<"transactions">[];
};
export default function CategoriesInfo({ transactions = [] }: Props) {
  const { t } = useTranslation();
  const { data: categories } = useCategories();
  const { profile } = useAuthenticatedUser();

  const categoriesWithTotals = useMemo(() => {
    if (!categories || !transactions) return [];

    const categoryTotals = transactions.reduce(
      (acc, transaction) => {
        if (transaction.category_id && transaction.type === "expense") {
          acc[transaction.category_id] =
            (acc[transaction.category_id] || 0) + transaction.amount;
        }
        return acc;
      },
      {} as Record<string, number>,
    );

    const totalExpenses = Object.values(categoryTotals).reduce(
      (sum, amount) => sum + amount,
      0,
    );

    return Object.entries(categoryTotals)
      .map(([categoryId, total]) => {
        const category = categories.find(
          (c) => c.id === parseInt(categoryId, 10),
        );
        return {
          id: categoryId,
          name: category?.name || "Unknown",
          total,
          percentage: totalExpenses > 0 ? (total / totalExpenses) * 100 : 0,
        };
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [categories, transactions]);

  if (isEmpty(categoriesWithTotals)) return null;
  return (
    <Card size="sm">
      <CardBody>
        <Stack>
          <Text color="gray.500" fontSize="xs">
            {t("transactions.summary.top5Expenses")}
          </Text>
          {categoriesWithTotals.map((category) => (
            <HStack key={category.id}>
              <Text flexShrink="0" w="50%" fontSize="xs">
                {category.name}
              </Text>
              <Tooltip
                label={formatCurrency(category.total, profile.currency)}
                hasArrow
                placement="right"
              >
                <Progress value={category.percentage} w="full" />
              </Tooltip>
            </HStack>
          ))}
        </Stack>
      </CardBody>
    </Card>
  );
}
