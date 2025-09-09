import { Button, Heading, HStack, Stack } from "@chakra-ui/react";
import { IconArrowBarToDownDashed } from "@tabler/icons-react";
import { useState } from "react";
import FilterButton from "../components/FilterButton";
import FilterDate from "../components/FilterDate";
import TransactionsTable from "../components/TransactionsTable";
import { TransactionFilters } from "../hooks/useTransactionFilters";
import { DetailsDrawer } from "../components/DetailsDrawer";
import { tableMock } from "../__mocks__/table-mock";

export default function TransactionsPage() {
  const [detailsRow, setDetailsRow] = useState(null);

  const [tableData, setTableData] = useState(tableMock);
  const [, setDateRange] = useState<[string, string] | null>(null);
  const [filters, setFilters] = useState<Partial<TransactionFilters>>({});

  const handleNewRow = () => {
    const newRow = {
      id: tableData.length + 1,
      rowNumber: `#${tableData.length + 1}`,
      icon: "down",
      iconColor: "red.500",
      date: "Jun 13, 2025",
      category: "",
      account: "",
      type: "Expense",
      notes: "",
      amount: "0",
      options: null,
    };
    setTableData((prevData) => [...prevData, newRow]);
  };

  const handleRemoveRow = (id: string) => {
    setTableData((prev) => prev.filter((row) => row.id !== id));
  };

  const handleDisabledRow = (id: string) => {
    setTableData((prev) =>
      prev.map((row) => (row.id === id ? { ...row, is_enabled: false } : row)),
    );
  };

  const handleSeeDetailsRow = (id: string) => {
    const row = tableData.find((row) => row.id === id);
    setDetailsRow(row);
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
        >
          New row
        </Button>
      </HStack>
      <TransactionsTable
        data={tableData}
        onDataChange={setTableData}
        onRemoveRow={handleRemoveRow}
        onSeeDetailsRow={handleSeeDetailsRow}
        onDisabledRow={handleDisabledRow}
      />

      <DetailsDrawer
        isOpen={!!detailsRow}
        onClose={() => setDetailsRow(null)}
      />
    </Stack>
  );
}
