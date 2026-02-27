import { Tables } from "@/lib";
import { useCategories } from "@/shared";
import { useTranslation } from "react-i18next";
import { HatchBar } from "@/shared/components/hatch-bar";
import {
  Card,
  CardBody,
  Divider,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useMemo } from "react";
import ExpensesChart from "./Charts/ExpensesChart";
import ExpensesVsIncomes from "./Charts/ExpensesVsIncomes";

type Props = {
  transactions: Tables<"transactions">[];
};

const fmt = (n: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(n);

function SectionLabel({ children }: { children: string }) {
  return (
    <Text
      fontSize="10px"
      fontWeight="bold"
      letterSpacing="widest"
      textTransform="uppercase"
      color="gray.500"
    >
      {children}
    </Text>
  );
}

export default function RightPanel({ transactions = [] }: Props) {
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

    return Object.entries(totals)
      .map(([id, amount]) => {
        if (id === "uncategorized") return { name: t("transactions.summary.uncategorized"), amount };
        const cat = categories?.find((c) => c.id === Number(id));
        return { name: cat?.name ?? t("transactions.summary.uncategorized"), amount };
      })
      .sort((a, b) => b.amount - a.amount);
  }, [transactions, categories, t]);

  const maxAmount = categoryTotals[0]?.amount || 1;

  return (
    <Stack
      h="full"
      borderLeft="1px solid"
      borderColor="gray.800"
      overflow="hidden"
      gap={0}
    >
      {/* Balance chart — fijo arriba */}
      <Stack p={4} flexShrink={0}>
        <SectionLabel>{t("transactions.summary.balance")}</SectionLabel>
        <ExpensesChart transactions={transactions} />
      </Stack>

      <Divider borderColor="gray.800" />

      {/* Top categorías — scroll interno */}
      <Stack gap={0} flex={1} overflow="hidden">
        <Stack px={4} pt={4} pb={2} flexShrink={0}>
          <SectionLabel>{t("statistics.charts.spendingByCategory")}</SectionLabel>
        </Stack>

        <SimpleGrid columns={2} gap={2} px={4} pb={4} overflowY="auto">
          {categoryTotals.length === 0 ? (
            <Text fontSize="sm" color="gray.600" gridColumn="span 2">
              {t("transactions.charts.noData")}
            </Text>
          ) : (
            categoryTotals.map((cat) => (
              <Card size="sm" variant="solid">
                <CardBody>
                  <Stack key={cat.name} gap={1}>
                    <Text fontSize="xs" noOfLines={1}>
                      {cat.name}
                    </Text>
                    <Text fontSize="md" fontFamily="Geist Mono">
                      {fmt(cat.amount)}
                    </Text>
                    <HatchBar
                      value={cat.amount}
                      max={maxAmount}
                      height="10px"
                    />
                  </Stack>
                </CardBody>
              </Card>
            ))
          )}
        </SimpleGrid>
      </Stack>

      <Divider borderColor="gray.800" />

      {/* Gráfica ingresos vs gastos — fijo abajo */}
      <Stack p={4} flexShrink={0} pb="60px">
        <SectionLabel>{t("transactions.charts.distribution")}</SectionLabel>
        <ExpensesVsIncomes transactions={transactions} />
      </Stack>
    </Stack>
  );
}
