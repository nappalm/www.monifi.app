import { Card, CardBody, CardHeader } from "@chakra-ui/react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Vivienda", value: 1200 },
  { name: "Transporte", value: 400 },
  { name: "Comida", value: 600 },
  { name: "Entretenimiento", value: 300 },
  { name: "Servicios", value: 500 },
];

const APPLE_COLORS = [
  "#0A84FF",
  "#30D158",
  "#FF9F0A",
  "#FF453A",
  "#BF5AF2",
  "#5E5CE6",
];

export default function SpendingByCategoryChart() {
  return (
    <Card size="sm">
      <CardHeader>Gastos por Categoría</CardHeader>
      <CardBody>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={110}
              innerRadius={70}
              fill="#8884d8"
              dataKey="value"
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={APPLE_COLORS[index % APPLE_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              cursor={{ fill: "rgba(174, 174, 178, 0.1)" }}
              contentStyle={{ borderRadius: "12px", borderColor: "gray.300" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
}
