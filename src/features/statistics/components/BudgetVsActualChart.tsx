import { useState } from "react";
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
  { name: "Housing", budgeted: 1000, actual: 1200 },
  { name: "Transportation", budgeted: 350, actual: 400 },
  { name: "Food", budgeted: 500, actual: 600 },
  { name: "Entertainment", budgeted: 250, actual: 300 },
  { name: "Utilities", budgeted: 450, actual: 500 },
];

const formatYAxis = (tick: number) => {
  if (tick >= 1000) {
    return `${(tick / 1000).toFixed(0)}k`;
  }
  return tick.toString();
};

export default function BudgetVsActualChart() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const tooltipBg = useColorModeValue(_colors.gray[200], _colors.gray[500]);
  const gray300 = useColorModeValue(_colors.gray[300], _colors.gray[300]);
  const gray500 = useColorModeValue(_colors.gray[500], _colors.gray[500]);
  const cyan300 = useColorModeValue(_colors.cyan[300], _colors.cyan[300]);
  const cyan500 = useColorModeValue(_colors.cyan[500], _colors.cyan[500]);

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
          <p className="intro">{`Budgeted: ${formatCurrency(
            payload[0].value,
            "USD",
          )}`}</p>
          <p className="intro">{`Actual: ${formatCurrency(
            payload[1].value,
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
          <Text color="gray.500">Budget vs. Actual Spending</Text>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
              onMouseMove={(state: any) => {
                if (state.isTooltipActive) {
                  setActiveCategory(state.activeLabel);
                } else {
                  setActiveCategory(null);
                }
              }}
              onMouseLeave={() => setActiveCategory(null)}
            >
              <defs>
                <linearGradient id="colorGrayLight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={gray300} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={gray300} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorGrayDark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={gray500} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={gray500} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCyanLight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={cyan300} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={cyan300} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCyanDark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={cyan500} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={cyan500} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={formatYAxis}
              />
              <Tooltip
                cursor={{ fill: "rgba(174, 174, 178, 0.1)" }}
                content={CustomTooltip}
              />
              <Bar dataKey="budgeted" radius={[4, 4, 0, 0]}>
                {data.map((entry) => (
                  <Cell
                    key={`cell-budgeted-${entry.name}`}
                    fill={
                      activeCategory === entry.name
                        ? "url(#colorCyanLight)"
                        : "url(#colorGrayLight)"
                    }
                  />
                ))}
              </Bar>
              <Bar dataKey="actual" radius={[4, 4, 0, 0]}>
                {data.map((entry) => (
                  <Cell
                    key={`cell-actual-${entry.name}`}
                    fill={
                      activeCategory === entry.name
                        ? "url(#colorCyanDark)"
                        : "url(#colorGrayDark)"
                    }
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
