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
  { name: "Ingresos", value: 5000 },
  { name: "Gastos", value: 3000 },
];

export default function IncomeVsExpensesChart() {
  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" mb={6}>
      <Heading as="h3" size="md" mb={4}>
        Ingresos vs. Gastos
      </Heading>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
