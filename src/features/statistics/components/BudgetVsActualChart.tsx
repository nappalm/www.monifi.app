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
  { name: "Vivienda", Presupuestado: 1000, Real: 1200 },
  { name: "Transporte", Presupuestado: 350, Real: 400 },
  { name: "Comida", Presupuestado: 500, Real: 600 },
  { name: "Entretenimiento", Presupuestado: 250, Real: 300 },
  { name: "Servicios", Presupuestado: 450, Real: 500 },
];

export default function BudgetVsActualChart() {
  return (
    <Card size="sm">
      <CardHeader>Presupuesto vs. Gasto Real</CardHeader>
      <CardBody>
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
            <defs>
              <linearGradient
                id="colorPresupuestado"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#AEAEB2" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#AEAEB2" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0A84FF" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#0A84FF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" stroke="#C7C7CC" tick={{ fill: "#8E8E93" }} />
            <YAxis stroke="#C7C7CC" tick={{ fill: "#8E8E93" }} />
            <Tooltip
              cursor={{ fill: "rgba(174, 174, 178, 0.1)" }}
              contentStyle={{ borderRadius: "12px", borderColor: "gray.300" }}
            />
            <Bar
              dataKey="Presupuestado"
              fill="url(#colorPresupuestado)"
              stroke="#AEAEB2"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="Real"
              fill="url(#colorReal)"
              stroke="#0A84FF"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
}
