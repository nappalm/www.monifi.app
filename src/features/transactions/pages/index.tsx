import {
  useCreateTransaction,
  useDeleteTransaction,
  useTransactions,
  useUpdateTransaction,
} from "@/features/transactions/hooks/useTransactions";
import { Tables, TablesInsert } from "@/lib/supabase/database.types";
import { Button, Heading, HStack, Stack } from "@chakra-ui/react";
import { IconArrowBarToDownDashed } from "@tabler/icons-react";
import { debounce } from "lodash";
import { useCallback, useState } from "react";
import { DetailsDrawer } from "../components/DetailsDrawer";
import FilterButton from "../components/FilterButton";
import FilterDate from "../components/FilterDate";
import TransactionsTable from "../components/TransactionsTable";
import { TransactionFilters } from "../hooks/useTransactionFilters";

export default function TransactionsPage() {
  const { data: transactions, isLoading } = useTransactions();

  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();
  const deleteTransaction = useDeleteTransaction();

  const [detailsRow, setDetailsRow] = useState<Tables<"transactions"> | null>(
    null,
  );

  const [, setDateRange] = useState<[string, string] | null>(null);
  const [filters, setFilters] = useState<Partial<TransactionFilters>>({});

  const handleNewRow = () => {
    const newTransaction: Omit<TablesInsert<"transactions">, "user_id"> = {
      amount: 0,
      account_id: 1,
      category_id: null,
      occurred_at: new Date().toISOString(),
      description: "",
      type: "expense",
    };

    createTransaction.mutate(newTransaction);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleUpdateRow = useCallback(
    debounce((data: Tables<"transactions">) => {
      updateTransaction.mutate(data);
    }, 500),
    [],
  );

  const handleRemoveRow = (id: number) => {
    deleteTransaction.mutate(id);
  };

  const handleDisabledRow = (id: number, previous: boolean) => {
    updateTransaction.mutate({ id, enabled: !previous });
  };

  const handleSeeDetailsRow = (id: number) => {
    const row = transactions?.find((transaction) => transaction.id === id);
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
        >
          New row
        </Button>
      </HStack>
      <TransactionsTable
        data={transactions || []}
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
