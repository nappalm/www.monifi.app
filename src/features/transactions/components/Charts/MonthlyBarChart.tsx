import _colors from "@/lib/chakra-ui/_colors";
import { Box, HStack, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Bar,
  BarChart,
  Cell,
  Customized,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  useOffset,
  usePlotArea,
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
  const { t } = useTranslation();
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
              {t("transactions.charts.currentMonth")}
            </Text>
          )}
        </Text>
        {payload.map((entry: { name: string; value: number }) => (
          <HStack key={entry.name} justify="space-between" gap={4}>
            <Text>
              {entry.name === "expenses"
                ? t("statistics.labels.expenses")
                : t("statistics.labels.income")}
            </Text>
            <Text fontFamily="Geist Mono">${entry.value.toLocaleString()}</Text>
          </HStack>
        ))}
      </Box>
    );
  }
  return null;
}

// Rendered inside the recharts SVG context via <Customized component={TimelineSVG} />
// so useOffset / usePlotArea hooks have access to the chart's Redux store.
function TimelineSVG({
  monthRange,
  currentMonthKey,
  filterStart,
  filterEnd,
  tlActive,
  tlInactive,
  tlCurrent,
}: {
  monthRange: string[];
  currentMonthKey: string;
  filterStart: string;
  filterEnd: string;
  tlActive: string;
  tlInactive: string;
  tlCurrent: string;
}) {
  const plotArea = usePlotArea();
  const offset = useOffset();

  if (!plotArea || !offset) return null;

  const N = monthRange.length;
  const bw = plotArea.width / N;
  // SVGHeight = plotArea.y + plotArea.height + offset.bottom
  // Timeline center sits 5px above the SVG bottom edge (middle of the 10px margin)
  const cy = plotArea.y + plotArea.height + offset.bottom - 5;

  const blockH = 4;

  return (
    <g shapeRendering="crispEdges">
      {monthRange.map((month, i) => {
        const x = plotArea.x + i * bw;
        const inRange = month >= filterStart && month <= filterEnd;
        const isCurrent = month === currentMonthKey;
        const color = inRange ? tlActive : isCurrent ? tlCurrent : tlInactive;
        const patternFill = isCurrent
          ? "url(#hatch-tl-current)"
          : "url(#hatch-tl-inactive)";
        return (
          <rect
            key={month}
            x={x + 2}
            y={cy - blockH / 2}
            width={Math.max(0, bw - 4)}
            height={blockH}
            fill={inRange ? color : patternFill}
            strokeWidth={0}
          />
        );
      })}
    </g>
  );
}

export default function MonthlyBarChart({
  dateRange,
}: {
  dateRange?: [string, string] | null;
}) {
  const { t } = useTranslation();
  const { data: summaries } = useMonthlySummaries();

  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthRange = generateMonthRange(now, 5, 3);
  const currentMonthIndex = monthRange.indexOf(currentMonthKey);

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
  const cursorFill = useColorModeValue(
    "rgba(0,0,0,0.04)",
    "rgba(255,255,255,0.06)",
  );
  const refLineColor = useColorModeValue(_colors.gray[400], _colors.gray[600]);

  // Hatch — expenses  (commons[100] = #3A418A)
  const expHatchBg = `${EXP}08`; // ~3% opacidad
  const expHatchStroke = `${EXP}30`; // ~19% opacidad
  const expBarStroke = `${EXP}AA`; // ~67% opacidad

  // Expenses — mes actual (más intenso)
  const expCurrHatchBg = `${EXP}18`;
  const expCurrHatchStroke = `${EXP}60`;
  const expCurrBarStroke = EXP;

  // Hatch — incomes  (commons[200] = #2C6C94)
  const incHatchBg = `${INC}08`;
  const incHatchStroke = `${INC}30`;
  const incBarStroke = `${INC}AA`;

  // Incomes — mes actual (más intenso)
  const incCurrHatchBg = `${INC}18`;
  const incCurrHatchStroke = `${INC}60`;
  const incCurrBarStroke = INC;

  // Timeline de filtro
  const tlActive = useColorModeValue("#22D3EE", "#06B6D4"); // cyan.400 / cyan.500
  const tlInactive = useColorModeValue("#E2E8F0", "#2D3748"); // gray.200 / gray.700
  const tlCurrent = useColorModeValue("#9CA3AF", "#6B7280"); // gray.400 / gray.500

  return (
    <Stack p={1}>
      <HStack justify="space-between" px={2} pt={1} pb={0} align="center">
        <Text fontSize="xs" color="gray.500" fontWeight="medium">
          {t("transactions.charts.expensesVsIncomesByMonth")}
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
              {t("statistics.labels.expenses")}
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
              {t("statistics.labels.income")}
            </Text>
          </HStack>
        </HStack>
      </HStack>

      <Box
        h={dateRange ? "110px" : "100px"}
        sx={{ "& *:focus": { outline: "none" } }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 8, right: 6, left: -20, bottom: dateRange ? 10 : 0 }}
            barCategoryGap="20%"
            barGap={1}
            style={{ outline: "none", shapeRendering: "crispEdges" }}
          >
            <defs>
              {/* Expenses — meses normales */}
              <pattern
                id="hatch-monthly-exp"
                patternUnits="userSpaceOnUse"
                width="4"
                height="4"
              >
                <rect width="4" height="4" fill={expHatchBg} />
                <rect x="0" y="0" width="2" height="2" fill={expHatchStroke} />
                <rect x="2" y="2" width="2" height="2" fill={expHatchStroke} />
              </pattern>
              {/* Expenses — mes actual */}
              <pattern
                id="hatch-monthly-exp-curr"
                patternUnits="userSpaceOnUse"
                width="4"
                height="4"
              >
                <rect width="4" height="4" fill={expCurrHatchBg} />
                <rect x="0" y="0" width="2" height="2" fill={expCurrHatchStroke} />
                <rect x="2" y="2" width="2" height="2" fill={expCurrHatchStroke} />
              </pattern>
              {/* Incomes — meses normales */}
              <pattern
                id="hatch-monthly-inc"
                patternUnits="userSpaceOnUse"
                width="4"
                height="4"
              >
                <rect width="4" height="4" fill={incHatchBg} />
                <rect x="0" y="0" width="2" height="2" fill={incHatchStroke} />
                <rect x="2" y="2" width="2" height="2" fill={incHatchStroke} />
              </pattern>
              {/* Incomes — mes actual */}
              <pattern
                id="hatch-monthly-inc-curr"
                patternUnits="userSpaceOnUse"
                width="4"
                height="4"
              >
                <rect width="4" height="4" fill={incCurrHatchBg} />
                <rect x="0" y="0" width="2" height="2" fill={incCurrHatchStroke} />
                <rect x="2" y="2" width="2" height="2" fill={incCurrHatchStroke} />
              </pattern>
              {/* Timeline — inactivo */}
              <pattern
                id="hatch-tl-inactive"
                patternUnits="userSpaceOnUse"
                width="4"
                height="4"
              >
                <rect width="4" height="4" fill="none" />
                <rect x="0" y="0" width="2" height="2" fill={tlInactive} />
                <rect x="2" y="2" width="2" height="2" fill={tlInactive} />
              </pattern>
              {/* Timeline — mes actual */}
              <pattern
                id="hatch-tl-current"
                patternUnits="userSpaceOnUse"
                width="4"
                height="4"
              >
                <rect width="4" height="4" fill="none" />
                <rect x="0" y="0" width="2" height="2" fill={tlCurrent} />
                <rect x="2" y="2" width="2" height="2" fill={tlCurrent} />
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
              position={{ y: 55 }}
              wrapperStyle={{ zIndex: 1000 }}
              cursor={{
                fill: cursorFill,
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
              radius={0}
              maxBarSize={16}
              minPointSize={2}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              background={(props: any) => (
                <rect
                  x={props.x}
                  y={props.y}
                  width={props.width}
                  height={props.height}
                  fill={`url(#${props.index === currentMonthIndex ? "hatch-monthly-exp-curr" : "hatch-monthly-exp"})`}
                />
              )}
            >
              {chartData.map((entry) =>
                entry.month === currentMonthKey ? (
                  <Cell
                    key={entry.month}
                    fill={expCurrBarStroke}
                    strokeWidth={0}
                  />
                ) : (
                  <Cell
                    key={entry.month}
                    fill={EXP}
                    strokeWidth={0}
                  />
                ),
              )}
            </Bar>

            <Bar
              dataKey="incomes"
              name="incomes"
              radius={0}
              maxBarSize={16}
              minPointSize={2}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              background={(props: any) => (
                <rect
                  x={props.x}
                  y={props.y}
                  width={props.width}
                  height={props.height}
                  fill={`url(#${props.index === currentMonthIndex ? "hatch-monthly-inc-curr" : "hatch-monthly-inc"})`}
                />
              )}
            >
              {chartData.map((entry) =>
                entry.month === currentMonthKey ? (
                  <Cell
                    key={entry.month}
                    fill={incCurrBarStroke}
                    strokeWidth={0}
                  />
                ) : (
                  <Cell
                    key={entry.month}
                    fill={INC}
                    strokeWidth={0}
                  />
                ),
              )}
            </Bar>
            {dateRange && (
              <Customized
                component={TimelineSVG}
                monthRange={monthRange}
                currentMonthKey={currentMonthKey}
                filterStart={dateRange[0].substring(0, 7)}
                filterEnd={dateRange[1].substring(0, 7)}
                tlActive={tlActive}
                tlInactive={tlInactive}
                tlCurrent={tlCurrent}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Stack>
  );
}
