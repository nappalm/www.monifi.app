import { Heading, HStack, SimpleGrid, Stack } from "@chakra-ui/react";
import IncomeVsExpensesChart from "../components/IncomeVsExpensesChart";
import SpendingByCategoryChart from "../components/SpendingByCategoryChart";
import TopExpensesChart from "../components/TopExpensesChart";

// import BudgetVsActualChart from "../components/BudgetVsActualChart";
// import FinancialTrendsChart from "../components/FinancialTrendsChart";
// import NetSavingsChart from "../components/NetSavingsChart";

export default function Statistics() {
  return (
    <Stack gap={5}>
      <Heading size="lg">Statistics</Heading>
      <HStack></HStack>
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
        <IncomeVsExpensesChart />
        <SpendingByCategoryChart />
        <TopExpensesChart />
      </SimpleGrid>
    </Stack>
  );
}
