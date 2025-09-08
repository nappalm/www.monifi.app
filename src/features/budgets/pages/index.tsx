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

export default function Budgets() {
  const navigate = useNavigate();
  const budgetForm = useDisclosure();

  const handleView = () => navigate("/budgets/1/categories");

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

      <BudgetsTable onConfig={handleView} />
      <BudgetForm {...budgetForm} />
    </Stack>
  );
}
