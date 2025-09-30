import {
  Box,
  Card,
  CardBody,
  Divider,
  Heading,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import TransactionsChart from "./TransactionsChart";
import { Tables } from "@/lib";
import { formatCurrency } from "@/shared";

type Props = {
  transactions: Tables<"transactions">[];
};
export default function ExpenseIncomeInfo({ transactions = [] }: Props) {
  const { t } = useTranslation();
  const { incomes, expenses, balance } = useMemo(() => {
    const incomes = transactions
      .filter((item) => item.type === "income")
      .reduce((acc, item) => acc + item.amount, 0);
    const expenses = transactions
      .filter((item) => item.type === "expense")
      .reduce((acc, item) => acc + item.amount, 0);
    const balance = incomes - expenses;
    return { incomes, expenses, balance };
  }, [transactions]);

  return (
    <Card size="sm">
      <CardBody>
        <Stack>
          <Stack align="center" py={5} gap={0}>
            <Heading fontFamily="Roboto Mono" letterSpacing="-2px">
              {formatCurrency(balance, "USD")}
            </Heading>
            <Text fontSize="sm" color="gray.500">
              {t("transactions.summary.balance")}
            </Text>
          </Stack>
          <Stack gap={0}>
            <TransactionsChart data={transactions} />
            <HStack justify="space-between" py={1}>
              <HStack>
                <Box w="8px" h="8px" bg="commons.100" borderRadius="full" />
                <Text fontSize="xs">
                  {t("transactions.summary.totalIncome")}
                </Text>
              </HStack>
              <Text fontSize="xs" fontFamily="Roboto Mono">
                {formatCurrency(incomes, "USD")}
              </Text>
            </HStack>
            <Divider />
            <HStack justify="space-between" py={1}>
              <HStack>
                <Box w="8px" h="8px" bg="commons.200" borderRadius="full" />
                <Text fontSize="xs">
                  {t("transactions.summary.totalExpenses")}
                </Text>
              </HStack>
              <Text fontSize="xs" fontFamily="Roboto Mono">
                {formatCurrency(expenses, "USD")}
              </Text>
            </HStack>
          </Stack>
        </Stack>
      </CardBody>
    </Card>
  );
}
