import React, { useState } from "react"; // Import useState
import {
  Button,
  Heading,
  HStack,
  IconButton,
  Stack,
  Td,
} from "@chakra-ui/react";
import {
  IconArrowBarToDownDashed,
  IconCylinder,
  IconFilter2,
  IconChevronsDown,
  IconChevronsUp,
  IconDots,
} from "@tabler/icons-react";
import { InlineEditorGrid } from "@/shared/components";

export default function TransactionsPage() {
  const columns = [
    {
      header: "",
      accessor: "rowNumber",
      render: (value: any) => value,
    },
    {
      header: "",
      accessor: "icon",
      render: (value: any) =>
        value === "down" ? (
          <IconChevronsDown size={16} />
        ) : (
          <IconChevronsUp size={16} />
        ),
    },
    { header: "Date", accessor: "date" },
    { header: "Category", accessor: "category" },
    { header: "Account", accessor: "account" },
    { header: "Type", accessor: "type" },
    { header: "Notes", accessor: "notes" },
    { header: "Amount", accessor: "amount" },
    {
      header: "",
      accessor: "options",
      render: () => (
        <IconButton
          w="full"
          aria-label="Row options"
          size="xs"
          variant="unstyled"
          pl="7px"
          icon={<IconDots size={15} />}
        />
      ),
    },
  ];

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
      amount: "$2590,99.4",
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
      amount: "$2590,99.4",
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
      amount: "$2590,99.4",
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
      amount: "$2590,99.4",
      options: null,
    },
  ];

  const [tableData, setTableData] = useState(initialData);

  return (
    <Stack gap={5}>
      <Heading size="lg">Transactions</Heading>
      <HStack justifyContent="space-between">
        <HStack gap="1px">
          <IconButton
            aria-label="Filter"
            icon={<IconFilter2 size={16} />}
            size="sm"
            borderRightRadius={0}
          />
          <Button
            leftIcon={<IconCylinder size={16} />}
            size="sm"
            borderLeftRadius={0}
          >
            Jun to Ago 2025
          </Button>
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
      <InlineEditorGrid
        columns={columns}
        data={tableData}
        onDataChange={setTableData}
      />
    </Stack>
  );
}
