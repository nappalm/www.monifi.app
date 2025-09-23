import _colors from "@/lib/chakra-ui/_colors";
import { Tables } from "@/lib/supabase/database.types";
import { formatCurrency } from "@/shared";
import { useColorModeValue } from "@chakra-ui/react";
import { useMemo } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Props = {
  data?: Tables<"transactions">[];
};

const formatYAxis = (tick: number) => {
  if (tick >= 1000) {
    return `${(tick / 1000).toFixed(0)}k`;
  }
  return tick.toString();
};

const formatXAxis = (tick: string) => {
  const date = new Date(tick);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
};

export default function TransactionsChart({ data = [] }: Props) {
  const chartData = useMemo(() => {
    const transactions = data;

    const dailyNetChanges = transactions.reduce(
      (acc, transaction) => {
        const date = transaction.occurred_at.split("T")[0];
        if (!acc[date]) {
          acc[date] = { date, netChange: 0 };
        }

        if (transaction.type === "income") {
          acc[date].netChange += transaction.amount;
        } else {
          acc[date].netChange -= transaction.amount;
        }

        return acc;
      },
      {} as Record<string, { date: string; netChange: number }>,
    );

    const sortedDates = Object.values(dailyNetChanges).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    let cumulativeBalance = 0;
    const cumulativeData = sortedDates.map((item) => {
      cumulativeBalance += item.netChange;
      return {
        date: item.date,
        balance: cumulativeBalance,
      };
    });

    return cumulativeData;
  }, [data]);

  const stopColor = useColorModeValue(_colors.gray[300], _colors.gray[500]);
  const stopColor2 = useColorModeValue(_colors.gray[200], _colors.gray[900]);
  const strokeColor = useColorModeValue(_colors.gray[200], _colors.gray[900]);
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
          <p className="label">{`${formatXAxis(label)}`}</p>
          <p className="intro">{`Balance: ${formatCurrency(
            payload[0].value,
            "USD",
          )}`}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={120}>
      <AreaChart
        data={chartData}
        margin={{
          top: 0,
          right: 10,
          left: -30,
          bottom: 20,
        }}
      >
        <defs>
          <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={stopColor} stopOpacity={0.8} />
            <stop offset="95%" stopColor={stopColor2} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Tooltip content={CustomTooltip} />

        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 10 }}
          tickFormatter={formatYAxis}
        />
        <XAxis
          dataKey="date"
          tickFormatter={formatXAxis}
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 10 }}
          dy={10}
        />
        <Area
          type="monotone"
          dataKey="balance"
          stroke={strokeColor}
          fillOpacity={1}
          fill="url(#colorBalance)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
