import { Stack } from "@chakra-ui/react";
import ExpensesChart from "./Charts/ExpensesChart";
import CategoriesChart from "./Charts/CategoriesChart";
import BottleChart from "./Charts/BottleChart";
import ExpensesVsIncomes from "./Charts/ExpensesVsIncomes";
import { Tables } from "@/lib";

type Props = {
  transactions: Tables<"transactions">[];
};

export default function RightPanel({ transactions = [] }: Props) {
  return (
    <Stack p={3}>
      <ExpensesChart transactions={transactions} />
      <CategoriesChart transactions={transactions} />
      <BottleChart />
      <ExpensesVsIncomes transactions={transactions} />
    </Stack>
  );
}
