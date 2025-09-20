import {
  useCreateTransaction,
  useDeleteTransaction,
  useTransactions,
  useUpdateTransaction,
} from "@/features/transactions/hooks/useTransactions";
import { Tables } from "@/lib/supabase/database.types";
import { useKeyPress } from "@/shared";
import { Button, Heading, HStack, Stack, Text } from "@chakra-ui/react";
import { IconArrowBarToDownDashed } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { DetailsDrawer } from "../components/DetailsDrawer";
import FilterButton from "../components/FilterButton";
import FilterDate from "../components/FilterDate";
import TransactionsTable from "../components/TransactionsTable";
import { TransactionFilters } from "../hooks/useTransactionFilters";
import { filterTransactions } from "../utils/filtered";
import { getNewTransaction } from "../utils/helpers";

export default function TransactionsPage() {
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const { data: transactions, isLoading } = useTransactions(dateRange);

  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();
  const deleteTransaction = useDeleteTransaction();

  const [detailsRow, setDetailsRow] = useState<Tables<"transactions"> | null>(
    null,
  );

  const [filters, setFilters] = useState<Partial<TransactionFilters>>({});

  const filteredTransactions = useMemo(
    () => filterTransactions(transactions || [], filters),
    [transactions, filters],
  );

  const handleNewRow = () => {
    createTransaction.mutate(getNewTransaction());
  };

  useKeyPress("i", handleNewRow, "ctrlKey");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleUpdateRow = (data: Tables<"transactions">) => {
    updateTransaction.mutate(data);
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

  return (
    <Stack gap={5}>
      <Heading size="lg">Transactions</Heading>
      <HStack justifyContent="space-between">
        <HStack gap="1px">
          <FilterButton filters={filters} onChange={setFilters} />
          <FilterDate onChange={(i, e) => setDateRange([i, e])} />
        </HStack>
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
          New row
        </Button>
      </HStack>
      <TransactionsTable
        data={filteredTransactions || []}
        isLoading={isLoading}
        onRowChange={handleUpdateRow}
        onRemoveRow={handleRemoveRow}
        onSeeDetailsRow={handleSeeDetailsRow}
        onDisabledRow={handleDisabledRow}
      />

      <DetailsDrawer
        isOpen={!!detailsRow}
        onClose={() => setDetailsRow(null)}
        transaction={detailsRow}
      />
    </Stack>
  );
}
