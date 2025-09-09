import {
  Button,
  Heading,
  HStack,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import BudgetsTable from "../components/BudgetsTable";
import { IconArrowBarToDownDashed } from "@tabler/icons-react";
import BudgetForm from "../components/BudgetForm";
import { OnSubmitBudget } from "../utils/types";
import { useState } from "react";

const mockData = [
  {
    id: "1",
    rowNumber: 1,
    name: "Groceries",
    period: "Monthly",
    current: "$250.00",
    limit: "200",
  },
  {
    id: "2",
    rowNumber: 2,
    name: "Entertainment",
    period: "Monthly",
    current: "$400.50",
    limit: "2000",
  },
  {
    id: "3",
    rowNumber: 3,
    name: "Vacation Savings",
    period: "Yearly",
    current: "$1,200.00",
    limit: "2000",
  },
];

export default function Budgets() {
  const navigate = useNavigate();
  const budgetForm = useDisclosure();
  const [data, setData] = useState(mockData);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleNew = (values: OnSubmitBudget) => {
    navigate("/budgets/1/categories");
  };

  const handleDataChange = (newData: any) => {
    setData(newData);
  };

  const handleRemoveRow = (id: string) => {
    setData((prev) => prev.filter((row) => row.id !== id));
  };

  const handleDisabledRow = (id: string) => {
    console.log("Disable row:", id);
  };

  const handleConfigRow = (id: string) => {
    navigate(`/budgets/${id}/categories`);
  };

  const handleEditRow = (id: string) => {
    console.log("Edit row:", id);
  };

  return (
    <Stack gap={5}>
      <HStack justify="space-between">
        <Stack gap={0}>
          <Heading size="lg">Budgets</Heading>
          <Text color="gray.500">
            Here you can create and manage your budgets to keep your finances
            always under control
          </Text>
        </Stack>
        <Button
          colorScheme="cyan"
          size="sm"
          color="#000"
          leftIcon={<IconArrowBarToDownDashed size={16} />}
          onClick={() => budgetForm.onOpen()}
        >
          Create budget
        </Button>
      </HStack>

      <BudgetsTable
        data={data}
        onDataChange={handleDataChange}
        onRemoveRow={handleRemoveRow}
        onDisabledRow={handleDisabledRow}
        onConfigRow={handleConfigRow}
        onEditRow={handleEditRow}
      />
      <BudgetForm {...budgetForm} onSubmit={handleNew} />
    </Stack>
  );
}
