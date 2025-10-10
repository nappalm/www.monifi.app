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
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

type Props = {
  transactions: Tables<"transactions">[];
};
export default function SpendingByCategoryChart({ transactions = [] }: Props) {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { data: categories } = useCategories();
  const tooltipBg = useColorModeValue(_colors.gray[200], _colors.gray[500]);
  const labelColor = useColorModeValue(_colors.gray[600], _colors.gray[400]);
  const gray500 = useColorModeValue(_colors.gray[300], _colors.gray[500]);
  const cyan500 = useColorModeValue(_colors.cyan[400], _colors.cyan[500]);

  const data = useMemo(() => {
    const spending = transactions
      .filter((transaction) => transaction.type === "expense" && transaction.category_id)
      .reduce(
        (acc, transaction) => {
          const category = categories?.find((c) => c.id === transaction.category_id);
          const key = category?.name || t("statistics.labels.uncategorized");
          acc[key] = (acc[key] || 0) + transaction.amount;
          return acc;
        },
        {} as Record<string, number>,
      );

    return Object.entries(spending)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions, categories, t]);

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
      name?: string | number;
      cx?: number;
      cy?: number;
      midAngle?: number;
      outerRadius?: number;
    }) => {
      const { name, cx, cy, midAngle, outerRadius } = props;

      if (
        cx === undefined ||
        cy === undefined ||
        midAngle === undefined ||
        outerRadius === undefined ||
        name === undefined
      ) {
        return null;
      }

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
          <Text color="gray.500">
            {t("statistics.charts.spendingByCategory")}
          </Text>
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
                {t("statistics.noData")}
              </Text>
            </Stack>
          ) : (
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
          )}
        </Stack>
      </CardBody>
    </Card>
  );
}
