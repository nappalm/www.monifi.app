import { Tables } from "@/lib";
import { formatCurrency, useCategories } from "@/shared";
import { HatchBar } from "@/shared/components/hatch-bar";
import { Grid, Text } from "@chakra-ui/react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  transactions: Tables<"transactions">[];
};

export function CategoryGrid({ transactions }: Props) {
  const { t } = useTranslation();
  const { data: categories } = useCategories();

  const categoryTotals = useMemo(() => {
    const enabled = transactions.filter(
      (tx) => tx.enabled && tx.type === "expense",
    );

    const totals: Record<number | "uncategorized", number> = {};
    for (const tx of enabled) {
      const key = tx.category_id ?? "uncategorized";
      totals[key] = (totals[key] || 0) + (tx.amount || 0);
    }

    const result = (categories ?? []).map((c) => ({
      name: c.name,
      amount: totals[c.id] ?? 0,
    }));

    if (totals["uncategorized"]) {
      result.push({
        name: t("transactions.summary.uncategorized"),
        amount: totals["uncategorized"],
      });
    }

    return result.sort((a, b) => b.amount - a.amount);
  }, [transactions, categories, t]);

  const maxAmount = categoryTotals[0]?.amount || 1;

  return (
    <Grid
      templateColumns="1fr auto 1fr"
      gap={3}
      px={4}
      pb={4}
      overflowY="auto"
      alignItems="center"
    >
      {categoryTotals.map((cat) => (
        <>
          <Text key={`${cat.name}-name`} noOfLines={1}>
            {cat.name}
          </Text>
          <Text
            key={`${cat.name}-amount`}
            fontFamily="Geist Mono"
            textAlign="right"
            opacity={0.5}
          >
            {formatCurrency(cat.amount)}
          </Text>
          <HatchBar
            key={`${cat.name}-bar`}
            value={cat.amount}
            max={maxAmount}
            height="12px"
            isReverse
          />
        </>
      ))}
    </Grid>
  );
}
