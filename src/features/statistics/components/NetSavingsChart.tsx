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
    <Card size="sm">
      <CardHeader>Ahorro Neto Mensual</CardHeader>
      <CardBody>
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
            <defs>
              <linearGradient id="colorAhorro" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0A84FF" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#0A84FF" stopOpacity={0} />
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
              dataKey="AhorroNeto"
              stroke="#0A84FF"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorAhorro)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
}
