import _colors from "@/lib/chakra-ui/_colors";
import { Tables } from "@/lib/supabase/database.types";
import { formatCurrency, useAccounts } from "@/shared";
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
  CartesianGrid,
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

export default function TopAccountsChart({
  transactions = [],
}: {
  transactions: Tables<"transactions">[];
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { data: accounts } = useAccounts();
  const tooltipBg = useColorModeValue(_colors.gray[200], _colors.gray[500]);
  const cartesianGridColor = useColorModeValue(
    _colors.gray[200],
    _colors.gray[900],
  );
  const gray500 = useColorModeValue(_colors.gray[500], _colors.gray[500]);
  const red500 = useColorModeValue(_colors.red[500], _colors.red[500]);
  const green500 = useColorModeValue(_colors.green[500], _colors.green[500]);

  const data = useMemo(() => {
    const spending = transactions.reduce(
      (acc, t) => {
        const account = accounts?.find((a) => a.id === t.account_id);
        const key = account?.name || "Uncategorized";
        if (!acc[key]) {
          acc[key] = { income: 0, expense: 0 };
        }
        if (t.type === "income") {
          acc[key].income += t.amount;
        } else {
          acc[key].expense += t.amount;
        }
        return acc;
      },
      {} as Record<string, { income: number; expense: number }>,
    );

    return Object.entries(spending)
      .map(([name, values]) => ({ name, ...values }))
      .sort((a, b) => b.income + b.expense - (a.income + a.expense))
      .slice(0, 3);
  }, [transactions, accounts]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (
      active &&
      payload &&
      payload.length &&
      !String(label).startsWith("__pad__")
    ) {
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
          <p className="intro">{`Income: ${formatCurrency(
            payload[0].value,
            "USD",
          )}`}</p>
          <p className="intro">{`Expense: ${formatCurrency(
            payload[1].value,
            "USD",
          )}`}</p>
        </div>
      );
    }
    return null;
  };

  const displayData = [...data];
  if (!isEmpty(data)) {
    const minLength = 3;
    while (displayData.length < minLength) {
      displayData.push({
        name: `__pad__${displayData.length}`,
        income: undefined,
        expense: undefined,
      });
    }
  }

  return (
    <Card size="sm">
      <CardBody>
        <Stack>
          <Text color="gray.500">Top 3 Accounts</Text>
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
                data={displayData}
                margin={{
                  top: 5,
                  right: 10,
                  left: -30,
                  bottom: 5,
                }}
                barGap={10}
                onMouseMove={(state) => {
                  if (state.isTooltipActive) {
                    setActiveIndex(state.activeTooltipIndex);
                  } else {
                    setActiveIndex(null);
                  }
                }}
              >
                <CartesianGrid
                  vertical={false}
                  stroke={cartesianGridColor}
                  strokeDasharray="3 3"
                />
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={gray500} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={gray500} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={gray500} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={gray500} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="colorActiveIncome"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor={green500} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={green500} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="colorActiveExpense"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor={red500} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={red500} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10 }}
                  dy={10}
                  tickFormatter={(value) =>
                    String(value).startsWith("__pad__") ? "" : value
                  }
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
                <Bar dataKey="income" radius={[4, 4, 0, 0]} barSize={20}>
                  {displayData.map((_entry, index) => (
                    <Cell
                      key={`cell-income-${index}`}
                      fill={
                        activeIndex === index
                          ? "url(#colorActiveIncome)"
                          : "url(#colorIncome)"
                      }
                      stroke={activeIndex === index ? green500 : gray500}
                    />
                  ))}
                </Bar>
                <Bar dataKey="expense" radius={[4, 4, 0, 0]} barSize={20}>
                  {displayData.map((_entry, index) => (
                    <Cell
                      key={`cell-expense-${index}`}
                      fill={
                        activeIndex === index
                          ? "url(#colorActiveExpense)"
                          : "url(#colorExpense)"
                      }
                      stroke={activeIndex === index ? red500 : gray500}
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
