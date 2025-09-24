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
import { useTransactions } from "../../transactions/hooks/useTransactions";
import { filterTransactions } from "../../transactions/utils/filtered";
import IncomeVsExpensesChart from "../components/IncomeVsExpensesChart";
import SpendingByCategoryChart from "../components/SpendingByCategoryChart";
import TopExpensesChart from "../components/TopExpensesChart";

// import BudgetVsActualChart from "../components/BudgetVsActualChart";
// import FinancialTrendsChart from "../components/FinancialTrendsChart";
// import NetSavingsChart from "../components/NetSavingsChart";

export default function Statistics() {
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
        label: "Category",
        icon: <IconTagFilled size={16} />,
        options:
          categories?.map((c) => ({
            label: c.name,
            value: c.id.toString(),
          })) || [],
      },
      {
        key: "accounts",
        label: "Account",
        icon: <IconReceiptDollarFilled size={16} />,
        options:
          accounts?.map((a) => ({ label: a.name, value: a.id.toString() })) ||
          [],
      },
      {
        key: "types",
        label: "Type",
        icon: <IconLineHeight size={16} />,
        options: [
          { label: "Income", value: "income" },
          { label: "Expense", value: "expense" },
        ],
      },
    ],
    [categories, accounts],
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
      <Heading size="lg">Statistics</Heading>
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
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
        <IncomeVsExpensesChart transactions={filteredTransactions} />
        <SpendingByCategoryChart transactions={filteredTransactions} />
        <TopExpensesChart transactions={filteredTransactions} />
      </SimpleGrid>
    </Stack>
  );
}
