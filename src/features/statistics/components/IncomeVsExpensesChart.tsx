import { Card, CardBody, CardHeader } from "@chakra-ui/react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { name: "Ingresos", value: 5000 },
  { name: "Gastos", value: 3000 },
];

const GRADIENT_COLORS = ["url(#colorIngresos)", "url(#colorGastos)"];

export default function IncomeVsExpensesChart() {
  return (
    <Card size="sm">
      <CardHeader>Ingresos vs. Gastos</CardHeader>
      <CardBody>
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
            <defs>
              <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0A84FF" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#0A84FF" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorGastos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#AEAEB2" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#AEAEB2" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" stroke="#C7C7CC" tick={{ fill: "#8E8E93" }} />
            <YAxis stroke="#C7C7CC" tick={{ fill: "#8E8E93" }} />
            <Tooltip
              cursor={{ fill: "rgba(174, 174, 178, 0.1)" }}
              contentStyle={{ borderRadius: "12px", borderColor: "gray.300" }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={GRADIENT_COLORS[index % GRADIENT_COLORS.length]}
                  stroke={index === 0 ? "#0A84FF" : "#AEAEB2"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
}
