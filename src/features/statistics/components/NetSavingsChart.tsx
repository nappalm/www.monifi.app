import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Box, Heading } from "@chakra-ui/react";

const data = [
  { name: "Ene", AhorroNeto: 1000 },
  { name: "Feb", AhorroNeto: 1200 },
  { name: "Mar", AhorroNeto: 800 },
  { name: "Abr", AhorroNeto: 1500 },
  { name: "May", AhorroNeto: 900 },
  { name: "Jun", AhorroNeto: 1800 },
  { name: "Jul", AhorroNeto: 1300 },
];

export default function NetSavingsChart() {
  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" mb={6}>
      <Heading as="h3" size="md" mb={4}>
        Ahorro Neto Mensual
      </Heading>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="AhorroNeto"
            stroke="#8884d8"
            fill="#8884d8"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
}
