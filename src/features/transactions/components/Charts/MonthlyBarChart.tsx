import _colors from "@/lib/chakra-ui/_colors";
import { Box, HStack, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useMonthlySummaries } from "../../hooks/useMonthlySummary";

// commons[200] → expenses, commons[100] → incomes
const EXP = _colors.commons[200]; // "#2C6C94"
const INC = _colors.commons[100]; // "#3A418A"

function generateMonthRange(
  centerDate: Date,
  pastMonths: number,
  futureMonths: number,
) {
  const months: string[] = [];
  for (let i = -pastMonths; i <= futureMonths; i++) {
    const d = new Date(centerDate.getFullYear(), centerDate.getMonth() + i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    months.push(key);
  }
  return months;
}

function formatMonthLabel(key: string) {
  const [year, month] = key.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString(undefined, {
    month: "short",
    year: "2-digit",
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({
  active,
  payload,
  label,
  tooltipBg,
  tooltipColor,
  currentMonth,
}: any) {
  if (active && payload && payload.length) {
    const isCurrentMonth = label === currentMonth;
    return (
      <Box
        bg={tooltipBg}
        color={tooltipColor}
        p={2}
        borderRadius="md"
        boxShadow="lg"
        fontSize="xs"
        minW="130px"
      >
        <Text fontWeight="bold" mb={1}>
          {formatMonthLabel(label)}
          {isCurrentMonth && (
            <Text as="span" ml={1} opacity={0.6}>
              (actual)
            </Text>
          )}
        </Text>
        {payload.map((entry: { name: string; value: number }) => (
          <HStack key={entry.name} justify="space-between" gap={4}>
            <Text>{entry.name === "expenses" ? "Gastos" : "Ingresos"}</Text>
            <Text fontFamily="Geist Mono">${entry.value.toLocaleString()}</Text>
          </HStack>
        ))}
      </Box>
    );
  }
  return null;
}

export default function MonthlyBarChart() {
  const { data: summaries } = useMonthlySummaries();

  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthRange = generateMonthRange(now, 5, 3);

  const chartData = useMemo(() => {
    const summaryMap = (summaries ?? []).reduce(
      (acc, s) => {
        const key = `${s.year}-${String(s.month).padStart(2, "0")}`;
        acc[key] = s;
        return acc;
      },
      {} as Record<string, (typeof summaries)[number]>,
    );

    return monthRange.map((key) => ({
      month: key,
      expenses: Math.round(summaryMap[key]?.expense_total ?? 0),
      incomes: Math.round(summaryMap[key]?.income_total ?? 0),
    }));
  }, [summaries, monthRange]);

  const tooltipBg = useColorModeValue("white", "gray.800");
  const tooltipColor = useColorModeValue("gray.800", "white");
  const cursorStroke = useColorModeValue("gray", "white");
  const refLineColor = useColorModeValue(_colors.gray[400], _colors.gray[600]);

  // Hatch — expenses  (commons[100] = #3A418A)
  const expHatchBg = `${EXP}20`; // ~12% opacidad
  const expHatchStroke = `${EXP}70`; // ~44% opacidad
  const expBarStroke = `${EXP}AA`; // ~67% opacidad

  // Expenses — mes actual (más intenso)
  const expCurrHatchBg = `${EXP}45`;
  const expCurrHatchStroke = `${EXP}CC`;
  const expCurrBarStroke = EXP;

  // Hatch — incomes  (commons[200] = #2C6C94)
  const incHatchBg = `${INC}20`;
  const incHatchStroke = `${INC}70`;
  const incBarStroke = `${INC}AA`;

  // Incomes — mes actual (más intenso)
  const incCurrHatchBg = `${INC}45`;
  const incCurrHatchStroke = `${INC}CC`;
  const incCurrBarStroke = INC;

  return (
    <Stack p={1}>
      <HStack justify="space-between" px={2} pt={1} pb={0} align="center">
        <Text fontSize="xs" color="gray.500" fontWeight="medium">
          Gastos e ingresos por mes
        </Text>
        <HStack gap={3}>
          <HStack gap={1}>
            <svg width="10" height="10">
              <rect
                width="10"
                height="10"
                fill={expCurrHatchBg}
                stroke={expCurrBarStroke}
                strokeWidth="1"
                rx="1"
              />
            </svg>
            <Text fontSize="xs" color="gray.500">
              Gastos
            </Text>
          </HStack>
          <HStack gap={1}>
            <svg width="10" height="10">
              <rect
                width="10"
                height="10"
                fill={incCurrHatchBg}
                stroke={incCurrBarStroke}
                strokeWidth="1"
                rx="1"
              />
            </svg>
            <Text fontSize="xs" color="gray.500">
              Ingresos
            </Text>
          </HStack>
        </HStack>
      </HStack>

      <Box h="100px">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 8, right: 6, left: -20, bottom: 0 }}
            barCategoryGap="20%"
            barGap={1}
          >
            <defs>
              {/* Expenses — meses normales */}
              <pattern
                id="hatch-monthly-exp"
                patternUnits="userSpaceOnUse"
                width="4"
                height="4"
                patternTransform="rotate(45)"
              >
                <rect width="4" height="4" fill={expHatchBg} />
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="4"
                  stroke={expHatchStroke}
                  strokeWidth="2"
                />
              </pattern>
              {/* Expenses — mes actual */}
              <pattern
                id="hatch-monthly-exp-curr"
                patternUnits="userSpaceOnUse"
                width="4"
                height="4"
                patternTransform="rotate(45)"
              >
                <rect width="4" height="4" fill={expCurrHatchBg} />
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="4"
                  stroke={expCurrHatchStroke}
                  strokeWidth="2"
                />
              </pattern>
              {/* Incomes — meses normales */}
              <pattern
                id="hatch-monthly-inc"
                patternUnits="userSpaceOnUse"
                width="4"
                height="4"
                patternTransform="rotate(45)"
              >
                <rect width="4" height="4" fill={incHatchBg} />
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="4"
                  stroke={incHatchStroke}
                  strokeWidth="2"
                />
              </pattern>
              {/* Incomes — mes actual */}
              <pattern
                id="hatch-monthly-inc-curr"
                patternUnits="userSpaceOnUse"
                width="4"
                height="4"
                patternTransform="rotate(45)"
              >
                <rect width="4" height="4" fill={incCurrHatchBg} />
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="4"
                  stroke={incCurrHatchStroke}
                  strokeWidth="2"
                />
              </pattern>
            </defs>

            <XAxis
              dataKey="month"
              tickFormatter={formatMonthLabel}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
              dy={4}
            />
            <YAxis hide domain={[0, "auto"]} />
            <Tooltip
              content={
                <CustomTooltip
                  tooltipBg={tooltipBg}
                  tooltipColor={tooltipColor}
                  currentMonth={currentMonthKey}
                />
              }
              cursor={{
                stroke: cursorStroke,
                strokeWidth: 1,
                strokeDasharray: "3 3",
              }}
            />
            <ReferenceLine
              x={currentMonthKey}
              stroke={refLineColor}
              strokeDasharray="3 3"
              strokeWidth={1}
            />

            <Bar
              dataKey="expenses"
              name="expenses"
              radius={[2, 2, 0, 0]}
              maxBarSize={16}
              minPointSize={2}
            >
              {chartData.map((entry) =>
                entry.month === currentMonthKey ? (
                  <Cell
                    key={entry.month}
                    fill="url(#hatch-monthly-exp-curr)"
                    stroke={expCurrBarStroke}
                    strokeWidth={1}
                  />
                ) : (
                  <Cell
                    key={entry.month}
                    fill="url(#hatch-monthly-exp)"
                    stroke={expBarStroke}
                    strokeWidth={1}
                  />
                ),
              )}
            </Bar>

            <Bar
              dataKey="incomes"
              name="incomes"
              radius={[2, 2, 0, 0]}
              maxBarSize={16}
              minPointSize={2}
            >
              {chartData.map((entry) =>
                entry.month === currentMonthKey ? (
                  <Cell
                    key={entry.month}
                    fill="url(#hatch-monthly-inc-curr)"
                    stroke={incCurrBarStroke}
                    strokeWidth={1}
                  />
                ) : (
                  <Cell
                    key={entry.month}
                    fill="url(#hatch-monthly-inc)"
                    stroke={incBarStroke}
                    strokeWidth={1}
                  />
                ),
              )}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Stack>
  );
}
