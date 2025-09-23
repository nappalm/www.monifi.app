import { useState, useCallback } from "react";
import _colors from "@/lib/chakra-ui/_colors";
import { formatCurrency } from "@/shared";
import {
  Card,
  CardBody,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Housing", value: 1200 },
  { name: "Transportation", value: 400 },
  { name: "Food", value: 600 },
  { name: "Entertainment", value: 300 },
  { name: "Utilities", value: 500 },
];

export default function SpendingByCategoryChart() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const tooltipBg = useColorModeValue(_colors.gray[200], _colors.gray[500]);
  const labelColor = useColorModeValue(_colors.gray[600], _colors.gray[400]);
  const gray500 = useColorModeValue(_colors.gray[500], _colors.gray[500]);
  const cyan500 = useColorModeValue(_colors.cyan[500], _colors.cyan[500]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload }: any) => {
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
          <p className="label">{`${payload[0].name}`}</p>
          <p className="intro">{`Value: ${formatCurrency(
            payload[0].value,
            "USD",
          )}`}</p>
        </div>
      );
    }
    return null;
  };

  const renderLabel = useCallback(
    (props: {
      name: string;
      cx: number;
      cy: number;
      midAngle: number;
      outerRadius: number;
    }) => {
      const { name, cx, cy, midAngle, outerRadius } = props;
      const RADIAN = Math.PI / 180;
      const radius = outerRadius + 15;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);

      return (
        <text
          x={x}
          y={y}
          textAnchor={x > cx ? "start" : "end"}
          dominantBaseline="central"
          fontSize={10}
          fill={labelColor}
        >
          {name}
        </text>
      );
    },
    [labelColor],
  );

  return (
    <Card size="sm">
      <CardBody>
        <Stack>
          <Text color="gray.500">Spending by Category</Text>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart margin={{ top: 5, right: 40, left: 40, bottom: 5 }}>
              <defs>
                <linearGradient id="colorGray" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={gray500} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={gray500} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCyan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={cyan500} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={cyan500} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine
                label={renderLabel}
                outerRadius={60}
                innerRadius={30}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={2}
                isAnimationActive={false}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      activeIndex === index
                        ? "url(#colorCyan)"
                        : "url(#colorGray)"
                    }
                    stroke={activeIndex === index ? cyan500 : gray500}
                  />
                ))}
              </Pie>
              <Tooltip
                cursor={{ fill: "rgba(174, 174, 178, 0.1)" }}
                content={CustomTooltip}
              />
            </PieChart>
          </ResponsiveContainer>
        </Stack>
      </CardBody>
    </Card>
  );
}
