import _colors from "@/lib/chakra-ui/_colors";
import { formatCurrency } from "@/shared";
import {
  Card,
  CardBody,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { name: "Income", value: 5000 },
  { name: "Expenses", value: 3000 },
];

const GRADIENT_COLORS = ["url(#colorIncome)", "url(#colorExpenses)"];
const STROKE_COLORS = [_colors.commons[100], _colors.commons[200]];

const formatYAxis = (tick: number) => {
  if (tick >= 1000) {
    return `${(tick / 1000).toFixed(0)}k`;
  }
  return tick.toString();
};

export default function IncomeVsExpensesChart() {
  const incomeStopColor = useColorModeValue(
    _colors.commons[100],
    _colors.commons[100],
  );
  const incomeStopColor2 = useColorModeValue(
    _colors.commons[100],
    _colors.commons[100],
  );
  const expenseStopColor = useColorModeValue(
    _colors.commons[200],
    _colors.commons[200],
  );
  const expenseStopColor2 = useColorModeValue(
    _colors.commons[200],
    _colors.commons[200],
  );
  const tooltipBg = useColorModeValue(_colors.gray[200], _colors.gray[500]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: tooltipBg,
            padding: "10px",
            border: "none",
            borderRadius: "4px",
            fontSize: "12px",
            color: "black",
          }}
        >
          <p className="label">{`${label}`}</p>
          <p className="intro">{`Value: ${formatCurrency(
            payload[0].value,
            "USD",
          )}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card size="sm">
      <CardBody>
        <Stack>
          <Text color="gray.500">Income vs. Expenses</Text>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: -30,
                bottom: 5,
              }}
            >
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={incomeStopColor}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={incomeStopColor2}
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={expenseStopColor}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={expenseStopColor2}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10 }}
                dy={10}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10 }}
                tickFormatter={formatYAxis}
              />
              <Tooltip
                cursor={{ fill: "rgba(174, 174, 178, 0.1)" }}
                content={CustomTooltip}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={GRADIENT_COLORS[index % GRADIENT_COLORS.length]}
                    stroke={STROKE_COLORS[index % STROKE_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Stack>
      </CardBody>
    </Card>
  );
}

