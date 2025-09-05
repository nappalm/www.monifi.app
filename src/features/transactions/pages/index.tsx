import { Button, Heading, HStack, Stack } from "@chakra-ui/react";
import { IconArrowBarToDownDashed } from "@tabler/icons-react";
import { useState } from "react";
import FilterButton from "../components/FilterButton";
import FilterDate from "../components/FilterDate";
import TransactionsTable from "../components/TransactionsTable";

export default function TransactionsPage() {
  const initialData = [
    {
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
    },
    {
      rowNumber: "#4",
      icon: "up",
      iconColor: "green.500",
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
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);

  return (
    <Stack gap={5}>
      <Heading size="lg">Transactions</Heading>
      <HStack justifyContent="space-between">
        <HStack gap="1px">
          <FilterButton />
          <FilterDate onChange={(i, e) => setDateRange([i, e])} />
        </HStack>
        <Button
          colorScheme="green"
          color="#000"
          size="sm"
          leftIcon={<IconArrowBarToDownDashed size={16} />}
        >
          New row
        </Button>
      </HStack>
      <TransactionsTable data={tableData} onDataChange={setTableData} />
    </Stack>
  );
}
