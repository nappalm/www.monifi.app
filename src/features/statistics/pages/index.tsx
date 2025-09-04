import { Box, SimpleGrid, Heading } from "@chakra-ui/react";
import IncomeVsExpensesChart from "../components/IncomeVsExpensesChart";
import SpendingByCategoryChart from "../components/SpendingByCategoryChart";
import BudgetVsActualChart from "../components/BudgetVsActualChart";
import FinancialTrendsChart from "../components/FinancialTrendsChart";
import TopExpensesChart from "../components/TopExpensesChart";
import NetSavingsChart from "../components/NetSavingsChart";

export default function Statistics() {
  return (
    <Box p={5}>
      <Heading as="h1" size="xl" mb={6}>
        Dashboard de Estadísticas Financieras
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        <IncomeVsExpensesChart />
        <SpendingByCategoryChart />
        <BudgetVsActualChart />
        <FinancialTrendsChart />
        <TopExpensesChart />
        <NetSavingsChart />
      </SimpleGrid>
    </Box>
  );
}
