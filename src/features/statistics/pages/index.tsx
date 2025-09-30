import { Tables } from "@/lib/supabase/database.types";
import {
  FilterButtonMenu,
  FilterDateMenu,
  useAccounts,
  useCategories,
  useFilters,
} from "@/shared";
import { Heading, HStack, SimpleGrid, Stack } from "@chakra-ui/react";
import {
  IconLineHeight,
  IconReceiptDollarFilled,
  IconTagFilled,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useTransactions } from "../../transactions/hooks/useTransactions";
import { filterTransactions } from "../../transactions/utils/filtered";
import IncomeVsExpensesChart from "../components/IncomeVsExpensesChart";
import SpendingByCategoryChart from "../components/SpendingByCategoryChart";
import TopAccountsChart from "../components/TopAccountsChart";
import TopExpensesChart from "../components/TopExpensesChart";

export default function Statistics() {
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const { data: transactions } = useTransactions(dateRange);

  const transactionsEnabled = useMemo(() => {
    if (!transactions) return [];
    return transactions.filter((t) => t.enabled);
  }, [transactions]);

  const { data: categories } = useCategories();
  const { data: accounts } = useAccounts();

  const { filters, setFilter, clearFilters, areFiltersActive } = useFilters({
    categories: [],
    accounts: [],
    types: [],
  });

  const handleFilterChange = (key: string, value: string[]) => {
    if (["categories", "accounts", "types"].includes(key)) {
      setFilter(key as "categories" | "accounts" | "types", value);
    }
  };

  const filterGroups = useMemo(
    () => [
      {
        key: "categories",
        label: t("transactions.filters.category"),
        icon: <IconTagFilled size={16} />,
        options:
          categories?.map((c) => ({
            label: c.name,
            value: c.id.toString(),
          })) || [],
      },
      {
        key: "accounts",
        label: t("transactions.filters.account"),
        icon: <IconReceiptDollarFilled size={16} />,
        options:
          accounts?.map((a) => ({ label: a.name, value: a.id.toString() })) ||
          [],
      },
      {
        key: "types",
        label: t("transactions.filters.type"),
        icon: <IconLineHeight size={16} />,
        options: [
          { label: t("transactions.types.income"), value: "income" },
          { label: t("transactions.types.expense"), value: "expense" },
        ],
      },
    ],
    [categories, accounts, t],
  );

  const filteredTransactions = useMemo(() => {
    const filtered = filterTransactions(transactionsEnabled || [], filters);
    return filtered.filter(
      (t: unknown): t is Tables<"transactions"> =>
        typeof t === "object" && t !== null,
    );
  }, [transactionsEnabled, filters]);

  return (
    <Stack gap={5}>
      <Heading size="lg">{t("statistics.title")}</Heading>
      <HStack gap="1px">
        <FilterButtonMenu
          filterGroups={filterGroups}
          appliedFilters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
          areFiltersActive={areFiltersActive}
        />
        <FilterDateMenu onChange={(i, e) => setDateRange([i, e])} />
      </HStack>
      <SimpleGrid columns={[1, 1, 2, 3, 4]} spacing={6}>
        <IncomeVsExpensesChart transactions={filteredTransactions} />
        <SpendingByCategoryChart transactions={filteredTransactions} />
        <TopExpensesChart transactions={filteredTransactions} />
        <TopAccountsChart transactions={filteredTransactions} />
      </SimpleGrid>
    </Stack>
  );
}
