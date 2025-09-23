import _colors from "@/lib/chakra-ui/_colors";
import { formatCurrency } from "@/shared";
import {
  Card,
  CardBody,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Vivienda", value: 1200 },
  { name: "Transporte", value: 400 },
  { name: "Comida", value: 600 },
  { name: "Entretenimiento", value: 300 },
  { name: "Servicios", value: 500 },
];

const THEME_COLORS = [
  _colors.blue[300],
  _colors.green[300],
  _colors.commons[100],
  _colors.red[300],
  _colors.purple[300],
  _colors.cyan[300],
];

const GRADIENT_URLS = data.map((_, i) => `url(#color${i})`);

export default function SpendingByCategoryChart() {
  const tooltipBg = useColorModeValue(_colors.gray[200], _colors.gray[500]);
  const labelColor = useColorModeValue(_colors.gray[600], _colors.gray[400]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: tooltipBg,
            padding: "10px",
            border: "none",
            borderRadius: "4px",
            fontSize: "12px",
            color: "black",
          }}
        >
          <p className="label">{`${payload[0].name}`}</p>
          <p className="intro">{`Value: ${formatCurrency(
            payload[0].value,
            "USD",
          )}`}</p>
        </div>
      );
    }
    return null;
  };

  const renderLabel = (props: { name: string, cx: number, cy: number, midAngle: number, outerRadius: number, }) => {
    const { name, cx, cy, midAngle, outerRadius } = props;
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 15;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={10}
        fill={labelColor}
      >
        {name}
      </text>
    );
  };

  return (
    <Card size="sm">
      <CardBody>
        <Stack>
          <Text color="gray.500">Gastos por Categoría</Text>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart margin={{ top: 5, right: 40, left: 40, bottom: 5 }}>
              <defs>
                {data.map((entry, index) => (
                  <linearGradient
                    key={`gradient-${index}`}
                    id={`color${index}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={THEME_COLORS[index % THEME_COLORS.length]}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={THEME_COLORS[index % THEME_COLORS.length]}
                      stopOpacity={0}
                    />
                  </linearGradient>
                ))}
              </defs>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine
                label={renderLabel}
                outerRadius={60}
                innerRadius={30}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={2}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={GRADIENT_URLS[index % GRADIENT_URLS.length]}
                    stroke={THEME_COLORS[index % THEME_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                cursor={{ fill: "rgba(174, 174, 178, 0.1)" }}
                content={CustomTooltip}
              />
            </PieChart>
          </ResponsiveContainer>
        </Stack>
      </CardBody>
    </Card>
  );
}