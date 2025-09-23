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
  { name: "Rent", value: 1500 },
  { name: "Mortgage", value: 1200 },
  { name: "Car", value: 450 },
  { name: "Groceries", value: 380 },
  { name: "Restaurants", value: 250 },
];

const THEME_COLORS = [
  _colors.commons[200],
  _colors.green[300],
  _colors.commons[100],
  _colors.red[300],
  _colors.purple[300],
];

const GRADIENT_URLS = data.map((_, i) => `url(#color${i})`);
const STROKE_COLORS = THEME_COLORS;

const formatYAxis = (tick: number) => {
  if (tick >= 1000) {
    return `${(tick / 1000).toFixed(0)}k`;
  }
  return tick.toString();
};

export default function TopExpensesChart() {
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
          <Text color="gray.500">Top 5 Expenses</Text>
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
                {data.map((_, index) => (
                  <linearGradient
                    key={`gradient-${index}`}
                    id={`color${index}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={THEME_COLORS[index % THEME_COLORS.length]}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={THEME_COLORS[index % THEME_COLORS.length]}
                      stopOpacity={0}
                    />
                  </linearGradient>
                ))}
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
                    fill={GRADIENT_URLS[index % GRADIENT_URLS.length]}
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

