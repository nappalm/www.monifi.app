import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Box, Heading } from "@chakra-ui/react";

const data = [
  { name: "Vivienda", value: 1200 },
  { name: "Transporte", value: 400 },
  { name: "Comida", value: 600 },
  { name: "Entretenimiento", value: 300 },
  { name: "Servicios", value: 500 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF"];

export default function SpendingByCategoryChart() {
  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" mb={6}>
      <Heading as="h3" size="md" mb={4}>
        Gastos por Categoría
      </Heading>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
}
