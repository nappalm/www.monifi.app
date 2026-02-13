import { Box, Card, CardBody, Text, useColorModeValue } from "@chakra-ui/react";
import { Tables } from "@/lib/supabase/database.types";
import { useMemo } from "react";

interface ExpensesVsIncomesProps {
  transactions: Tables<"transactions">[];
}

export default function ExpensesVsIncomes({ transactions }: ExpensesVsIncomesProps) {
  const { expenses, incomes } = useMemo(() => {
    const enabledTransactions = transactions.filter((t) => t.enabled);

    const totalExpenses = enabledTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const totalIncomes = enabledTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    return {
      expenses: totalExpenses,
      incomes: totalIncomes,
    };
  }, [transactions]);

  const max = Math.max(expenses, incomes);
  const expensePct = max > 0 ? (expenses / max) * 100 : 0;
  const incomePct = max > 0 ? (incomes / max) * 100 : 0;

  const hatchExpBg = useColorModeValue("var(--chakra-colors-gray-100)", "var(--chakra-colors-gray-900)");
  const hatchExpStroke = useColorModeValue("var(--chakra-colors-gray-300)", "var(--chakra-colors-gray-700)");
  const hatchIncBg = useColorModeValue("var(--chakra-colors-gray-200)", "var(--chakra-colors-gray-800)");
  const hatchIncStroke = useColorModeValue("var(--chakra-colors-gray-400)", "var(--chakra-colors-gray-600)");
  const barStroke = useColorModeValue("var(--chakra-colors-gray-400)", "var(--chakra-colors-gray-600)");
  const dividerBg = useColorModeValue("gray.300", "gray.700");

  return (
    <Card size="sm">
      <CardBody display="flex" alignItems="center" h="100px" gap="6px">
        <svg width="0" height="0">
          <defs>
            <pattern
              id="hatch-expenses"
              patternUnits="userSpaceOnUse"
              width="4"
              height="4"
              patternTransform="rotate(45)"
            >
              <rect width="4" height="4" fill={hatchExpBg} />
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="4"
                stroke={hatchExpStroke}
                strokeWidth="2"
              />
            </pattern>
            <pattern
              id="hatch-incomes"
              patternUnits="userSpaceOnUse"
              width="4"
              height="4"
              patternTransform="rotate(45)"
            >
              <rect width="4" height="4" fill={hatchIncBg} />
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="4"
                stroke={hatchIncStroke}
                strokeWidth="2"
              />
            </pattern>
          </defs>
        </svg>

        <Box
          flex={1}
          display="flex"
          flexDir="column"
          alignItems="flex-end"
          gap="2px"
        >
          <Text fontSize="xs" color="gray.500">
            Gastos
          </Text>
          <Box w="100%" display="flex" justifyContent="flex-end" h="18px">
            <svg width={`${expensePct}%`} height="18">
              <rect
                width="100%"
                height="18"
                fill="url(#hatch-expenses)"
                rx="2"
                stroke={barStroke}
                strokeWidth="1"
              />
            </svg>
          </Box>
          <Text fontSize="xs" color="gray.400">
            ${expenses.toLocaleString()}
          </Text>
        </Box>

        {/* Center line */}
        <Box w="1px" h="45px" bg={dividerBg} flexShrink={0} />

        {/* Incomes bar */}
        <Box
          flex={1}
          display="flex"
          flexDir="column"
          alignItems="flex-start"
          gap="2px"
        >
          <Text fontSize="xs" color="gray.500">
            Ingresos
          </Text>
          <Box w="100%" display="flex" justifyContent="flex-start" h="18px">
            <svg width={`${incomePct}%`} height="18">
              <rect
                width="100%"
                height="18"
                fill="url(#hatch-incomes)"
                rx="2"
                stroke={barStroke}
                strokeWidth="1"
              />
            </svg>
          </Box>
          <Text fontSize="xs" color="gray.400">
            ${incomes.toLocaleString()}
          </Text>
        </Box>
      </CardBody>
    </Card>
  );
}
