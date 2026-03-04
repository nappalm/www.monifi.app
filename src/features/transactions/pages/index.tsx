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
  Text,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import {
  AlignEndHorizontal,
  ArrowBarLeft,
  ArrowBarRight,
  Box,
  BracketsContent,
  Plus,
  Upload,
  Wallet,
} from "pixelarticons/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Charts from "../components/Charts";
import { DetailsDrawer } from "../components/DetailsDrawer";
import RightPanel from "../components/RightPanel";
import TransactionsTable from "../components/TransactionsTable";
import { useTransactionHistory } from "../hooks/useTransactionHistory";
import { TRANSACTIONS_PATHS } from "../router";
import { filterTransactions } from "../utils/filtered";
import { getNewTransaction } from "../utils/helpers";

export default function TransactionsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const { data: transactions, isPending } = useTransactions(dateRange);

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
        icon: <Box width={16} height={16} />,
        options:
          categories?.map((c) => ({
            label: c.name,
            value: c.id.toString(),
          })) || [],
      },
      {
        key: "accounts",
        label: t("transactions.filters.account"),
        icon: <Wallet width={16} height={16} />,
        options:
          accounts?.map((a) => ({ label: a.name, value: a.id.toString() })) ||
          [],
      },
      {
        key: "types",
        label: t("transactions.filters.type"),
        icon: <AlignEndHorizontal width={16} height={16} />,
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

  const [focusPending, setFocusPending] = useState(false);
  const [focusRowIndex, setFocusRowIndex] = useState<number | null>(null);

  const handleNewRow = () => {
    createTransaction.mutate(getNewTransaction());
    setFocusPending(true);
  };

  const handleLoadFile = () => {
    navigate(TRANSACTIONS_PATHS.extract);
  };

  // Once the optimistic row appears in filteredTransactions (it has no id yet), focus it
  useEffect(() => {
    if (!focusPending) return;
    for (let i = filteredTransactions.length - 1; i >= 0; i--) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!(filteredTransactions[i] as any).id) {
        setFocusRowIndex(i);
        setFocusPending(false);
        break;
      }
    }
  }, [focusPending, filteredTransactions]);

  // Reset focusRowIndex after the grid has had time to process the focus
  useEffect(() => {
    if (focusRowIndex == null) return;
    const timeout = setTimeout(() => setFocusRowIndex(null), 500);
    return () => clearTimeout(timeout);
  }, [focusRowIndex]);

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

  const borderBottomColor = useColorModeValue("gray.100", "gray.800");

  return (
    <Stack pt="49px">
      <HStack
        position="fixed"
        top={0}
        height="50px"
        w="full"
        borderBottom="1px solid"
        borderColor={borderBottomColor}
        px={2}
      >
        <HStack gap={0} justify="space-between" w="full">
          <HStack gap={0}>
            <FilterButtonMenu
              filterGroups={filterGroups}
              appliedFilters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
              areFiltersActive={areFiltersActive}
            />
          </HStack>
          <FilterDateMenu onChange={(i, e) => setDateRange([i, e])} />
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
              leftIcon={<Plus height={16} width={16} />}
              onClick={handleNewRow}
              isLoading={createTransaction.isPending}
              borderRightRadius={0}
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
              icon={
                isRightPanelOpen ? (
                  <ArrowBarRight height={16} width={16} />
                ) : (
                  <ArrowBarLeft height={16} width={16} />
                )
              }
              onClick={() => setIsRightPanelOpen((prev) => !prev)}
              color={isRightPanelOpen ? "cyan.300" : undefined}
            />
          </HStack>
        </HStack>
      </HStack>
      <HStack align="stretch" overflow="hidden" gap={0} h="calc(100vh - 92px)">
        <Stack gap={0} flex={1} minW={0}>
          <Charts dateRange={dateRange} />
          <TransactionsTable
            data={filteredTransactions || []}
            isLoading={isPending}
            onRowChange={handleUpdateRow}
            onRemoveRow={handleRemoveRow}
            onSeeDetailsRow={handleSeeDetailsRow}
            onDisabledRow={handleDisabledRow}
            onAdminCategories={adminCategories.onToggle}
            onAdminAccounts={adminAccounts.onToggle}
            height="calc(100vh - 235px)"
            focusRowIndex={focusRowIndex}
            emptyState={
              <Stack align="center" color="gray.500">
                <BracketsContent />
                <Text>{t("transactions.emptyState.noTransactions")}</Text>
                <Stack>
                  <Button
                    leftIcon={<Plus height={16} width={16} />}
                    onClick={handleNewRow}
                    variant="solid"
                    rightIcon={
                      <Text fontSize="xs" opacity={0.5}>
                        Ctrl + I
                      </Text>
                    }
                  >
                    {t("transactions.emptyState.addRow")}
                  </Button>
                  <Button
                    leftIcon={<Upload height={16} width={16} />}
                    variant="solid"
                    onClick={handleLoadFile}
                  >
                    {t("transactions.emptyState.uploadFile")}
                  </Button>
                </Stack>
              </Stack>
            }
          />

          <DetailsDrawer
            isOpen={!!detailsRow}
            onClose={() => setDetailsRow(null)}
            transaction={detailsRow}
          />
        </Stack>
        {!isSmallScreen && (
          <Stack
            w="400px"
            minW="400px"
            h="full"
            mr={isRightPanelOpen ? "0px" : "-400px"}
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
