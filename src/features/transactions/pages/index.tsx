import { Button, Heading, HStack, Stack } from "@chakra-ui/react";
import { IconArrowBarToDownDashed } from "@tabler/icons-react";
import { useState } from "react";
import FilterButton from "../components/FilterButton";
import FilterDate from "../components/FilterDate";
import TransactionsTable from "../components/TransactionsTable";
import { TransactionFilters } from "../hooks/useTransactionFilters";
import { DetailsDrawer } from "../components/DetailsDrawer";

export default function TransactionsPage() {
  const initialData = [
    {
      id: 1,
      rowNumber: "#1",
      icon: "down",
      iconColor: "red.500",
      date: "Jun 13, 2025",
      category: "Plans",
      account: "BBVA credit card",
      type: "Expense",
      notes: "",
      amount: "100",
      options: null,
    },
    {
      id: 2,
      rowNumber: "#2",
      icon: "down",
      iconColor: "red.500",
      date: "Jun 13, 2025",
      category: "Plans",
      account: "BBVA credit card",
      type: "Expense",
      notes: "",
      amount: "200",
      options: null,
    },
    {
      id: 3,
      rowNumber: "#3",
      icon: "down",
      iconColor: "red.500",
      date: "Jun 13, 2025",
      category: "Plans",
      account: "BBVA credit card",
      type: "Expense",
      notes: "",
      amount: "300",
      options: null,
      is_enabled: false,
    },
    {
      id: 4,
      rowNumber: "#4",
      icon: "up",
      iconColor: "cyan.500",
      date: "Jun 13, 2025",
      category: "Plans",
      account: "BBVA credit card",
      type: "Expense",
      notes: "",
      amount: "400",
      options: null,
    },
  ];

  const [tableData, setTableData] = useState(initialData);
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
      <TransactionsTable data={tableData} onDataChange={setTableData} />
      <DetailsDrawer />
    </Stack>
  );
}
