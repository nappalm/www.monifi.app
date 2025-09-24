import _colors from "@/lib/chakra-ui/_colors";
import { Tables } from "@/lib/supabase/database.types";
import { formatCurrency, useCategories } from "@/shared";
import {
  Card,
  CardBody,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconChartInfographic } from "@tabler/icons-react";
import { isEmpty } from "lodash";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const formatYAxis = (tick: number) => {
  if (tick >= 1000) {
    return `${(tick / 1000).toFixed(0)}k`;
  }
  return tick.toString();
};

export default function TopExpensesChart({
  transactions = [],
}: {
  transactions: Tables<"transactions">[];
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { data: categories } = useCategories();
  const tooltipBg = useColorModeValue(_colors.gray[200], _colors.gray[500]);
  const gray500 = useColorModeValue(_colors.gray[500], _colors.gray[500]);
  const cyan500 = useColorModeValue(_colors.cyan[500], _colors.cyan[500]);

  const data = useMemo(() => {
    const spending = transactions
      .filter((t) => t.type === "expense" && t.category_id)
      .reduce(
        (acc, t) => {
          const category = categories?.find((c) => c.id === t.category_id);
          const key = category?.name || "Uncategorized";
          acc[key] = (acc[key] || 0) + t.amount;
          return acc;
        },
        {} as Record<string, number>,
      );

    return Object.entries(spending)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [transactions, categories]);

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
          {isEmpty(data) ? (
            <Stack
              w="full"
              h="200px"
              align="center"
              justify="center"
              color="gray.500"
              gap={0}
            >
              <IconChartInfographic size={30} />
              <Text fontSize="xs" w="50%" textAlign="center">
                We couldn’t find any data to show right now
              </Text>
            </Stack>
          ) : (
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
                  <linearGradient id="colorGray" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={gray500} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={gray500} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCyan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={cyan500} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={cyan500} stopOpacity={0} />
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
                <Bar
                  dataKey="value"
                  radius={[4, 4, 0, 0]}
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
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Stack>
      </CardBody>
    </Card>
  );
}
