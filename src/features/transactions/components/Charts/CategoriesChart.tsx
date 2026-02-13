import {
  Box,
  Card,
  CardBody,
  Grid,
  HStack,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Tables } from "@/lib/supabase/database.types";
import { useMemo } from "react";
import { useCategories } from "@/shared";

interface CategoriesChartProps {
  transactions: Tables<"transactions">[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, tooltipBg, tooltipColor }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const categoryName = data.name;
    const value = data.value;

    return (
      <Box
        bg={tooltipBg}
        color={tooltipColor}
        p={2}
        borderRadius="md"
        boxShadow="lg"
        fontSize="sm"
      >
        <Text fontWeight="bold">{categoryName}</Text>
        <Text>${value.toLocaleString()}</Text>
      </Box>
    );
  }
  return null;
}

export default function CategoriesChart({
  transactions,
}: CategoriesChartProps) {
  const { data: categories } = useCategories();
  const tooltipBg = useColorModeValue("white", "gray.800");
  const tooltipColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.200", "gray.800");
  const hatchBg = useColorModeValue(
    "var(--chakra-colors-gray-100)",
    "var(--chakra-colors-gray-900)",
  );
  const hatchStroke = useColorModeValue(
    "var(--chakra-colors-gray-300)",
    "var(--chakra-colors-gray-700)",
  );
  const barStroke = useColorModeValue(
    "var(--chakra-colors-gray-400)",
    "var(--chakra-colors-gray-600)",
  );
  const cursorStroke = useColorModeValue("gray", "white");

  const { topCategory, chartData, percentageChange } = useMemo(() => {
    const enabledTransactions = transactions.filter(
      (t) => t.enabled && t.type === "expense",
    );

    // Si no hay transacciones, retornar valores por defecto
    if (enabledTransactions.length === 0) {
      return {
        topCategory: "Sin datos",
        chartData: [],
        percentageChange: 0,
      };
    }

    // Agrupar gastos por categoría
    const categoryTotals: { [key: number]: number } = {};
    enabledTransactions.forEach((t) => {
      if (t.category_id) {
        categoryTotals[t.category_id] =
          (categoryTotals[t.category_id] || 0) + (t.amount || 0);
      }
    });

    // Encontrar la categoría con más gastos
    let topCategoryId: number | null = null;
    let maxAmount = 0;
    Object.entries(categoryTotals).forEach(([catId, amount]) => {
      if (amount > maxAmount) {
        maxAmount = amount;
        topCategoryId = Number(catId);
      }
    });

    const topCategoryName =
      topCategoryId && categories
        ? categories.find((c) => c.id === topCategoryId)?.name ||
          "Sin categoría"
        : "Sin categoría";

    // Generar datos para el gráfico - una barra por categoría
    const chartData = Object.entries(categoryTotals)
      .map(([catId, amount]) => {
        const categoryName =
          categories?.find((c) => c.id === Number(catId))?.name ||
          "Sin categoría";
        return {
          name: categoryName,
          categoryId: Number(catId),
          value: amount,
        };
      })
      .sort((a, b) => b.value - a.value); // Ordenar de mayor a menor

    // Calcular cambio porcentual (comparar con el mes anterior si hay datos históricos)
    const change = 0;
    // Por ahora dejamos el cambio en 0, se puede calcular comparando con un período anterior

    return {
      topCategory: topCategoryName,
      chartData,
      percentageChange: change,
    };
  }, [transactions, categories]);
  return (
    <Card size="sm">
      <CardBody p={1}>
        <Grid templateColumns="150px 1fr">
          <Stack justify="center" align="center">
            <Text fontSize="xs" color="gray.500">
              Top expenses
            </Text>
            <HStack>
              <Text fontWeight="semibold" fontSize="xl">
                {topCategory}
              </Text>
            </HStack>
            <HStack gap={2}>
              <Text
                color={percentageChange >= 0 ? "green.500" : "red.500"}
                fontSize="xs"
              >
                {percentageChange >= 0 ? "+" : ""}
                {percentageChange.toFixed(1)}%
              </Text>
              <Text fontSize="xs" color="gray.500">
                este mes
              </Text>
            </HStack>
          </Stack>

          <Box
            flex={1}
            h="100px"
            border="1px solid"
            borderColor={borderColor}
            borderRadius="md"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 3, bottom: 6, left: 3 }}
              >
                <defs>
                  <pattern
                    id="hatch"
                    patternUnits="userSpaceOnUse"
                    width="4"
                    height="4"
                    patternTransform="rotate(45)"
                  >
                    <rect width="4" height="4" fill={hatchBg} />
                    <line
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="4"
                      stroke={hatchStroke}
                      strokeWidth="2"
                    />
                  </pattern>
                </defs>
                <XAxis hide dataKey="name" />
                <YAxis hide domain={[0, "auto"]} />
                <Tooltip
                  content={
                    <CustomTooltip
                      tooltipBg={tooltipBg}
                      tooltipColor={tooltipColor}
                    />
                  }
                  cursor={{
                    stroke: cursorStroke,
                    strokeWidth: 1,
                    strokeDasharray: "3 3",
                  }}
                />
                <Bar
                  dataKey="value"
                  fill="url(#hatch)"
                  stroke={barStroke}
                  strokeWidth={1}
                  radius={[2, 2, 0, 0]}
                  minPointSize={2}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
      </CardBody>
    </Card>
  );
}
