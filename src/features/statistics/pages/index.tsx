import { Heading, HStack, SimpleGrid, Stack } from "@chakra-ui/react";
import BudgetVsActualChart from "../components/BudgetVsActualChart";
import FinancialTrendsChart from "../components/FinancialTrendsChart";
import IncomeVsExpensesChart from "../components/IncomeVsExpensesChart";
import NetSavingsChart from "../components/NetSavingsChart";
import SpendingByCategoryChart from "../components/SpendingByCategoryChart";
import TopExpensesChart from "../components/TopExpensesChart";

export default function Statistics() {
  return (
    <Stack gap={5}>
      <Heading size="lg">Statistics</Heading>
      <HStack></HStack>
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
        <IncomeVsExpensesChart />
        <SpendingByCategoryChart />
        {/* <BudgetVsActualChart /> */}
        {/* <FinancialTrendsChart /> */}
        <TopExpensesChart />
        {/* <NetSavingsChart /> */}
      </SimpleGrid>
    </Stack>
  );
}
