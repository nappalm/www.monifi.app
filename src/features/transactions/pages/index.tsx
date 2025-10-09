import {
  useCreateTransaction,
  useDeleteTransaction,
  useTransactions,
  useUpdateTransaction,
} from "@/features/transactions/hooks/useTransactions";
import { Tables } from "@/lib/supabase/database.types";
import {
  AccountsDrawer,
  CategoriesDrawer,
  FilterButtonMenu,
  FilterDateMenu,
  UndoRedoButtons,
  useAccounts,
  useCategories,
  useFilters,
  useKeyPress,
} from "@/shared";
import {
  Button,
  Grid,
  Heading,
  HStack,
  Stack,
  Text,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import {
  IconArrowBarToDownDashed,
  IconLineHeight,
  IconReceiptDollarFilled,
  IconTagFilled,
} from "@tabler/icons-react";
import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import AccountInfo from "../components/AccountInfo";
import CategoriesInfo from "../components/CategoriesInfo";
import { DetailsDrawer } from "../components/DetailsDrawer";
import ExpenseIncomeInfo from "../components/ExpenseIncomeInfo";
import TransactionsTable from "../components/TransactionsTable";
import { useTransactionHistory } from "../hooks/useTransactionHistory";
import { filterTransactions } from "../utils/filtered";
import { getNewTransaction } from "../utils/helpers";

export default function TransactionsPage() {
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const { data: transactions, isLoading } = useTransactions(dateRange);

  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();
  const deleteTransaction = useDeleteTransaction();

  const adminCategories = useDisclosure();
  const adminAccounts = useDisclosure();

  const [detailsRow, setDetailsRow] = useState<Tables<"transactions"> | null>(
    null,
  );

  const { data: categories } = useCategories();
  const { data: accounts } = useAccounts();

  const { addToHistory, undo, redo, canUndo, canRedo } =
    useTransactionHistory();
  const previousStateRef = useRef<Record<number, Tables<"transactions">>>({});

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [categories, accounts],
  );

  const filteredTransactions = useMemo(() => {
    const filtered = filterTransactions(transactions || [], filters);
    return filtered.filter(
      (t: unknown): t is Tables<"transactions"> =>
        typeof t === "object" && t !== null,
    );
  }, [transactions, filters]);

  const transactionsEnabled = useMemo(() => {
    if (!filteredTransactions) return [];
    return filteredTransactions.filter((t) => t.enabled);
  }, [filteredTransactions]);

  const handleNewRow = () => {
    createTransaction.mutate(getNewTransaction());
  };

  useKeyPress("i", handleNewRow, "ctrlKey");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleUpdateRow = (data: Tables<"transactions">) => {
    // Guardar estado previo antes de actualizar
    const currentTransaction = transactions?.find((t) => t.id === data.id);
    if (currentTransaction) {
      previousStateRef.current[data.id] = currentTransaction;
      addToHistory(data, currentTransaction);
    }

    updateTransaction.mutate(data, {
      onError: () => {
        // React Query ya maneja el rollback automático en caso de error
      },
    });
  };

  const handleUndo = () => {
    const previousStates = undo();
    if (previousStates && previousStates.length > 0) {
      // Aplicar todos los cambios en batch
      previousStates.forEach((state) => {
        updateTransaction.mutate(state);
      });
    }
  };

  const handleRedo = () => {
    const nextStates = redo();
    if (nextStates && nextStates.length > 0) {
      // Aplicar todos los cambios en batch
      nextStates.forEach((state) => {
        updateTransaction.mutate(state);
      });
    }
  };

  const handleRemoveRow = (id: number) => {
    deleteTransaction.mutate(id);
  };

  const handleDisabledRow = (id: number, previous: boolean) => {
    updateTransaction.mutate({ id, enabled: !previous });
  };

  const handleSeeDetailsRow = (id: number) => {
    const row = filteredTransactions?.find(
      (transaction) => transaction.id === id,
    );
    setDetailsRow(row || null);
  };

  const isSmallScreen =
    useBreakpointValue({ base: true, lg: false }, { ssr: false }) ?? false;

  return (
    <>
      <Grid
        gridAutoFlow={isSmallScreen ? "row" : "column"}
        gridTemplateColumns={
          isSmallScreen
            ? "minmax(0, 1fr)"
            : "minmax(0, calc(100% - 296px - 24px)) 296px"
        }
        gridGap="24px"
        py={5}
      >
        <Stack gap={5}>
          <Heading size="lg">{t("transactions.title")}</Heading>
          <HStack justifyContent="space-between">
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
            <HStack gap="1px">
              <UndoRedoButtons
                onUndo={handleUndo}
                onRedo={handleRedo}
                canUndo={canUndo}
                canRedo={canRedo}
              />
              <Button
                colorScheme="cyan"
                size="sm"
                leftIcon={<IconArrowBarToDownDashed size={16} />}
                onClick={handleNewRow}
                isLoading={createTransaction.isPending}
                rightIcon={
                  <Text fontSize="xs" opacity={0.5}>
                    Ctrl + I
                  </Text>
                }
              >
                {t("transactions.newRow")}
              </Button>
            </HStack>
          </HStack>
          <TransactionsTable
            data={filteredTransactions || []}
            isLoading={isLoading}
            onRowChange={handleUpdateRow}
            onRemoveRow={handleRemoveRow}
            onSeeDetailsRow={handleSeeDetailsRow}
            onDisabledRow={handleDisabledRow}
            onAdminCategories={adminCategories.onToggle}
            onAdminAccounts={adminAccounts.onToggle}
          />

          <DetailsDrawer
            isOpen={!!detailsRow}
            onClose={() => setDetailsRow(null)}
            transaction={detailsRow}
          />
        </Stack>

        <Stack>
          <ExpenseIncomeInfo transactions={transactionsEnabled} />
          <AccountInfo transactions={transactionsEnabled} />
          <CategoriesInfo transactions={transactionsEnabled} />
        </Stack>
      </Grid>

      <CategoriesDrawer {...adminCategories} />
      <AccountsDrawer {...adminAccounts} />
    </>
  );
}
