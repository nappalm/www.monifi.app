import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Box, Heading } from "@chakra-ui/react";

const data = [
  { name: "Alquiler", Monto: 1500 },
  { name: "Hipoteca", Monto: 1200 },
  { name: "Coche", Monto: 450 },
  { name: "Supermercado", Monto: 380 },
  { name: "Restaurantes", Monto: 250 },
];

export default function TopExpensesChart() {
  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" mb={6}>
      <Heading as="h3" size="md" mb={4}>
        Top 5 Gastos
      </Heading>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          layout="vertical"
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" />
          <Tooltip />
          <Legend />
          <Bar dataKey="Monto" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
