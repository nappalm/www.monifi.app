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
  HStack,
  IconButton,
  Stack,
  Tag,
  Text,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import {
  IconArrowBarToDownDashed,
  IconLayoutSidebarRightFilled,
  IconLineHeight,
  IconReceiptDollarFilled,
  IconTagFilled,
} from "@tabler/icons-react";
import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Charts from "../components/Charts";
import { DetailsDrawer } from "../components/DetailsDrawer";
import RightPanel from "../components/RightPanel";
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
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);

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
    <Stack pt="49px">
      <HStack
        position="fixed"
        top={0}
        height="50px"
        bg="gray.900"
        w="full"
        borderBottom="1px solid"
        borderColor="gray.800"
        px={2}
      >
        <HStack gap={0} justify="space-between" w="full">
          <HStack>
            <Tag colorScheme="teal">Transactions</Tag>
            <FilterButtonMenu
              filterGroups={filterGroups}
              appliedFilters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
              areFiltersActive={areFiltersActive}
            />
            <FilterDateMenu onChange={(i, e) => setDateRange([i, e])} />
          </HStack>
          <HStack gap={2}>
            <UndoRedoButtons
              onUndo={handleUndo}
              onRedo={handleRedo}
              canUndo={canUndo}
              canRedo={canRedo}
            />
            <Button
              colorScheme="cyan"
              w={["full", "full", "fit-content"]}
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
            <IconButton
              size="sm"
              variant="ghost"
              aria-label="Toggle right panel"
              icon={<IconLayoutSidebarRightFilled size={18} />}
              onClick={() => setIsRightPanelOpen((prev) => !prev)}
              color={isRightPanelOpen ? "cyan.300" : undefined}
            />
          </HStack>
        </HStack>
      </HStack>
      <HStack align="stretch" overflow="hidden" gap={0}>
        <Stack gap={0} flex={1} minW={0}>
          <Charts transactions={filteredTransactions} />
          <TransactionsTable
            data={filteredTransactions || []}
            isLoading={isLoading}
            onRowChange={handleUpdateRow}
            onRemoveRow={handleRemoveRow}
            onSeeDetailsRow={handleSeeDetailsRow}
            onDisabledRow={handleDisabledRow}
            onAdminCategories={adminCategories.onToggle}
            onAdminAccounts={adminAccounts.onToggle}
            height="calc(100vh - 175px)"
          />

          <DetailsDrawer
            isOpen={!!detailsRow}
            onClose={() => setDetailsRow(null)}
            transaction={detailsRow}
          />
        </Stack>
        {!isSmallScreen && (
          <Stack
            w="296px"
            minW="296px"
            mr={isRightPanelOpen ? "0px" : "-296px"}
            transition="margin-right 0.3s ease-in-out"
            overflow="hidden"
          >
            <RightPanel transactions={filteredTransactions} />
          </Stack>
        )}
      </HStack>

      <CategoriesDrawer {...adminCategories} />
      <AccountsDrawer {...adminAccounts} />
    </Stack>
  );
}
