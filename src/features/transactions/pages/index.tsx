import { Button, Heading, HStack, Stack } from "@chakra-ui/react";
import { IconArrowBarToDownDashed } from "@tabler/icons-react";
import { useState } from "react";
import {
  useCreateTransaction,
  useDeleteTransaction,
  useTransactions,
  useUpdateTransaction,
} from "@/features/transactions/hooks/useTransactions";
import { Tables, TablesInsert } from "@/lib/supabase/database.types";
import FilterButton from "../components/FilterButton";
import FilterDate from "../components/FilterDate";
import TransactionsTable from "../components/TransactionsTable";
import { TransactionFilters } from "../hooks/useTransactionFilters";
import { DetailsDrawer } from "../components/DetailsDrawer";

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
    const newTransaction: TablesInsert<"transactions"> = {
      amount: 0,
      account_id: 1, // Replace with a valid account_id
      category_id: null,
      occurred_at: new Date().toISOString(),
      description: "",
      type: "expense",
    };
    createTransaction.mutate(newTransaction);
  };

  const handleUpdateRow = (data: Partial<Tables<"transactions">>) => {
    updateTransaction.mutate(data[0]);
  };

  const handleRemoveRow = (id: number) => {
    deleteTransaction.mutate(id);
  };

  const handleDisabledRow = (id: number) => {
    updateTransaction.mutate({ id, transaction: { is_enabled: false } });
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
        onDataChange={handleUpdateRow}
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
