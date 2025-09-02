import { Heading, SimpleGrid, Stack } from "@chakra-ui/react";
import BudgetCart from "../components/BudgetCard";
import { useNavigate } from "react-router-dom";

export default function Budgets() {
  const navigate = useNavigate();

  const handleView = () => navigate("/budgets/1/categories");

  return (
    <Stack>
      <Heading size="lg">Budgets</Heading>
      <SimpleGrid columns={[1, 1, 2, 3]} gap={3}>
        <BudgetCart onView={handleView} />
        <BudgetCart />
        <BudgetCart />
        <BudgetCart />
        <BudgetCart />
      </SimpleGrid>
    </Stack>
  );
}
