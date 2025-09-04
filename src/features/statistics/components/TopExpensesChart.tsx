import { Card, CardBody, CardHeader } from "@chakra-ui/react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { name: "Alquiler", Monto: 1500 },
  { name: "Hipoteca", Monto: 1200 },
  { name: "Coche", Monto: 450 },
  { name: "Supermercado", Monto: 380 },
  { name: "Restaurantes", Monto: 250 },
];

export default function TopExpensesChart() {
  return (
    <Card size="sm">
      <CardHeader>Top 5 Gastos</CardHeader>
      <CardBody>
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
            <defs>
              <linearGradient id="colorMonto" x1="0" y1="0" x2="1" y2="0">
                <stop offset="5%" stopColor="#0A84FF" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#0A84FF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis type="number" stroke="#C7C7CC" tick={{ fill: "#8E8E93" }} />
            <YAxis
              dataKey="name"
              type="category"
              stroke="#C7C7CC"
              tick={{ fill: "#8E8E93" }}
            />
            <Tooltip
              cursor={{ fill: "rgba(174, 174, 178, 0.1)" }}
              contentStyle={{ borderRadius: "12px", borderColor: "gray.300" }}
            />
            <Bar
              dataKey="Monto"
              fill="url(#colorMonto)"
              stroke="#0A84FF"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
}
