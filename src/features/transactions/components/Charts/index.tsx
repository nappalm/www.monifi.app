import { SimpleGrid } from "@chakra-ui/react";
import ExpensesChart from "./ExpensesChart";
import CategoriesChart from "./CategoriesChart";
import ExpensesVsIncomes from "./ExpensesVsIncomes";
import { Tables } from "@/lib/supabase/database.types";
import BottleChart from "./BottleChart";

interface ChartsProps {
  transactions: Tables<"transactions">[];
}

export default function Charts({ transactions }: ChartsProps) {
  return (
    <SimpleGrid columns={[1, 1, 2, 3, 4]} gap={2} p={2}>
      <ExpensesChart transactions={transactions} />
      <CategoriesChart transactions={transactions} />
      <BottleChart />
      <ExpensesVsIncomes transactions={transactions} />
    </SimpleGrid>
  );
}
