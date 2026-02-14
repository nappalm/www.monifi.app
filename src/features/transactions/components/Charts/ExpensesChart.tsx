import {
  Box,
  Card,
  CardBody,
  Grid,
  HStack,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, YAxis } from "recharts";
import { Tables } from "@/lib/supabase/database.types";
import { useMemo } from "react";

interface ExpensesChartProps {
  transactions: Tables<"transactions">[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, tooltipBg, tooltipColor }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const date = data.date;
    const value = data.value;

    // Formatear la fecha
    const formattedDate = new Date(date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    return (
      <Box
        bg={tooltipBg}
        color={tooltipColor}
        p={2}
        borderRadius="md"
        boxShadow="lg"
        fontSize="sm"
      >
        <Text fontWeight="bold">{formattedDate}</Text>
        <Text>${value.toLocaleString()}</Text>
      </Box>
    );
  }
  return null;
}

export default function ExpensesChart({ transactions }: ExpensesChartProps) {
  const { currentBalance, chartData, percentageChange } = useMemo(() => {
    const enabledTransactions = transactions.filter((t) => t.enabled);

    // Calcular cambios netos diarios
    const dailyNetChanges = enabledTransactions.reduce(
      (acc, transaction) => {
        const date = transaction.occurred_at.split("T")[0];
        if (!acc[date]) {
          acc[date] = { date, netChange: 0 };
        }

        if (transaction.type === "income") {
          acc[date].netChange += transaction.amount || 0;
        } else {
          acc[date].netChange -= transaction.amount || 0;
        }

        return acc;
      },
      {} as Record<string, { date: string; netChange: number }>,
    );

    const sortedDates = Object.values(dailyNetChanges).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    // Calcular balance acumulativo
    let cumulativeBalance = 0;
    const cumulativeData = sortedDates.map((item) => {
      cumulativeBalance += item.netChange;
      return {
        date: item.date,
        value: cumulativeBalance,
      };
    });

    // Calcular cambio porcentual (comparar último día con el primero)
    let change = 0;
    if (cumulativeData.length >= 2) {
      const first = cumulativeData[0].value;
      const last = cumulativeData[cumulativeData.length - 1].value;
      if (first !== 0) {
        change = ((last - first) / Math.abs(first)) * 100;
      } else if (last !== 0) {
        change = 100;
      }
    }

    return {
      currentBalance: cumulativeBalance,
      chartData: cumulativeData.length > 0 ? cumulativeData : [{ value: 0 }],
      percentageChange: change,
    };
  }, [transactions]);

  const tooltipBg = useColorModeValue("white", "gray.800");
  const tooltipColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.200", "gray.800");
  const hatchBg = useColorModeValue(
    "var(--chakra-colors-gray-100)",
    "var(--chakra-colors-gray-900)",
  );
  const hatchStroke = useColorModeValue(
    "var(--chakra-colors-gray-300)",
    "var(--chakra-colors-gray-700)",
  );
  const areaStroke = useColorModeValue(
    "var(--chakra-colors-gray-400)",
    "var(--chakra-colors-gray-600)",
  );
  const cursorStroke = useColorModeValue("gray", "white");

  return (
    <Card size="sm">
      <CardBody p={1}>
        <Grid templateColumns="150px 1fr">
          <Stack justify="center" align="center">
            <Text fontSize="xs" color="gray.500">
              Balance
            </Text>
            <HStack>
              <Text fontWeight="semibold" fontSize="xl" fontFamily="Geist Mono">
                ${currentBalance.toLocaleString()}
              </Text>
            </HStack>
            <HStack gap={2}>
              <Text
                color={percentageChange >= 0 ? "green.500" : "red.500"}
                fontSize="xs"
                fontFamily="Geist Mono"
              >
                {percentageChange >= 0 ? "+" : ""}
                {percentageChange.toFixed(1)}%
              </Text>
              <Text fontSize="xs" color="gray.500">
                total
              </Text>
            </HStack>
          </Stack>

          <Box
            flex={1}
            h="100px"
            border="1px solid"
            borderColor={borderColor}
            borderRadius="md"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 40, right: 0, bottom: 0, left: 0 }}
              >
                <defs>
                  <pattern
                    id="hatch-area"
                    patternUnits="userSpaceOnUse"
                    width="4"
                    height="4"
                    patternTransform="rotate(45)"
                  >
                    <rect width="4" height="4" fill={hatchBg} />
                    <line
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="4"
                      stroke={hatchStroke}
                      strokeWidth="2"
                    />
                  </pattern>
                </defs>
                <YAxis hide domain={["dataMin", "dataMax"]} />
                <Tooltip
                  content={
                    <CustomTooltip
                      tooltipBg={tooltipBg}
                      tooltipColor={tooltipColor}
                    />
                  }
                  cursor={{
                    stroke: cursorStroke,
                    strokeWidth: 1,
                    strokeDasharray: "3 3",
                  }}
                />
                <Area
                  type="linear"
                  dataKey="value"
                  stroke={areaStroke}
                  strokeWidth={1.5}
                  fill="url(#hatch-area)"
                  baseValue="dataMin"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
      </CardBody>
    </Card>
  );
}
