import { Card, CardBody, CardHeader } from "@chakra-ui/react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { name: "Ene", Ingresos: 4000, Gastos: 2400 },
  { name: "Feb", Ingresos: 3000, Gastos: 1398 },
  { name: "Mar", Ingresos: 2000, Gastos: 9800 },
  { name: "Abr", Ingresos: 2780, Gastos: 3908 },
  { name: "May", Ingresos: 1890, Gastos: 4800 },
  { name: "Jun", Ingresos: 2390, Gastos: 3800 },
  { name: "Jul", Ingresos: 3490, Gastos: 4300 },
];

export default function FinancialTrendsChart() {
  return (
    <Card size="sm">
      <CardHeader>Tendencias Financieras Mensuales</CardHeader>
      <CardBody>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <defs>
              <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0A84FF" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#0A84FF" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorGastos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#30D158" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#30D158" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" stroke="#C7C7CC" tick={{ fill: "#8E8E93" }} />
            <YAxis stroke="#C7C7CC" tick={{ fill: "#8E8E93" }} />
            <Tooltip
              cursor={{ stroke: "#AEAEB2", strokeDasharray: "3 3" }}
              contentStyle={{ borderRadius: "12px", borderColor: "gray.300" }}
            />
            <Area
              type="monotone"
              dataKey="Ingresos"
              stroke="#0A84FF"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorIngresos)"
              activeDot={{ r: 6 }}
            />
            <Area
              type="monotone"
              dataKey="Gastos"
              stroke="#30D158"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorGastos)"
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
}
