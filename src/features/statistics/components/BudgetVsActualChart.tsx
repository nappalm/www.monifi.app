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
  { name: "Vivienda", Presupuestado: 1000, Real: 1200 },
  { name: "Transporte", Presupuestado: 350, Real: 400 },
  { name: "Comida", Presupuestado: 500, Real: 600 },
  { name: "Entretenimiento", Presupuestado: 250, Real: 300 },
  { name: "Servicios", Presupuestado: 450, Real: 500 },
];

export default function BudgetVsActualChart() {
  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" mb={6}>
      <Heading as="h3" size="md" mb={4}>
        Presupuesto vs. Gasto Real
      </Heading>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{
            top: 20,
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
          <Bar dataKey="Presupuestado" fill="#82ca9d" />
          <Bar dataKey="Real" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
