import {
  Alert,
  AlertIcon,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Heading,
  HStack,
  Stack,
} from "@chakra-ui/react";
import {
  IconArrowBarToDownDashed,
  IconInfoCircleFilled,
} from "@tabler/icons-react";
import { useState } from "react";
import BudgetsCategoriesTable from "../components/BudgetsCategoriesTable";
import { BUDGETS_PATHS } from "../router";

const MOCK_DATA = [
  {
    id: "1",
    rowNumber: "#1",
    category: "food",
    description: "Monthly groceries",
    budget: 3000,
  },
  {
    id: "2",
    rowNumber: "#2",
    category: "services",
    description: "Streaming services",
    budget: 1000,
  },
  {
    id: "3",
    rowNumber: "#3",
    category: "transport",
    description: "Fuel and public transport",
    budget: 800,
  },
];

export default function BudgetCategories() {
  const [data, setData] = useState(MOCK_DATA);

  const handleNewRow = () => {
    const newRow = {
      id: data.length + 1,
      rowNumber: `#${data.length + 1}`,
      category: "",
      description: "",
      budget: 0,
    };

    setData((prevData) => [...prevData, newRow]);
  };

  const handleRemoveRow = (id: string) => {
    setData((prev) => prev.filter((row) => row.id !== id));
  };

  return (
    <Stack gap={5}>
      <Stack spacing={0}>
        <HStack justify="space-between">
          <Heading size="lg">My first budget</Heading>
          <Button
            colorScheme="cyan"
            size="sm"
            leftIcon={<IconArrowBarToDownDashed size={16} />}
            onClick={handleNewRow}
          >
            New row
          </Button>
        </HStack>
        <Breadcrumb color="gray.500">
          <BreadcrumbItem>
            <BreadcrumbLink href={BUDGETS_PATHS.base}>Budgets</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink href="#">Budgets categories</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </Stack>
      <Alert colorScheme="gray" fontSize="sm" color="gray.500">
        <AlertIcon>
          <IconInfoCircleFilled />
        </AlertIcon>
        Define how much you want to allocate to each category in this budget.
        Enter the values to set your spending limits
      </Alert>
      <BudgetsCategoriesTable
        data={data}
        onDataChange={setData}
        onRemoveRow={handleRemoveRow}
      />
    </Stack>
  );
}
