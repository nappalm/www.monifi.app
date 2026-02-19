import { formatCurrency } from "@/shared";
import { Box, HStack, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

type Props = {
  progress: number;
  label: string;
  value: number;
  size?: number;
};

const GAP_DEGREES = 14;

export default function CategoryProgress({
  progress,
  label,
  value = 0,
  size = 50,
}: Props) {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const remaining = 100 - clampedProgress;

  const data = [
    { name: "used", value: clampedProgress },
    { name: "remaining", value: remaining },
  ];

  const trackColor = useColorModeValue(
    "var(--chakra-colors-gray-200)",
    "var(--chakra-colors-gray-800)",
  );
  const progressColor = clampedProgress >= 80 ? "red.500" : "gray.500";

  const segmentFill =
    clampedProgress >= 80
      ? "var(--chakra-colors-red-500)"
      : "var(--chakra-colors-gray-500)";

  const segmentStroke =
    clampedProgress >= 80
      ? "var(--chakra-colors-red-600)"
      : "var(--chakra-colors-gray-600)";

  const patternId = `hatch-pie-${label.replace(/\s+/g, "-")}`;

  return (
    <HStack>
      <Box w={`${size}px`} h={`${size}px`} flexShrink={0} position="relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <defs>
              <pattern
                id={patternId}
                patternUnits="userSpaceOnUse"
                width="4"
                height="4"
                patternTransform="rotate(45)"
              >
                <rect width="4" height="4" fill={segmentFill} opacity={0.2} />
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="4"
                  stroke={segmentFill}
                  strokeWidth="2"
                  opacity={0.5}
                />
              </pattern>
            </defs>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="65%"
              outerRadius="100%"
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              paddingAngle={GAP_DEGREES}
              cornerRadius={4}
              stroke="none"
              animationDuration={600}
            >
              <Cell
                fill={`url(#${patternId})`}
                stroke={segmentStroke}
                strokeWidth={1}
              />
              <Cell fill={trackColor} stroke={trackColor} strokeWidth={1} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <Text
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          fontSize="xs"
          fontWeight="semibold"
          fontFamily="Geist Mono"
          color={progressColor}
          lineHeight={1}
        >
          {clampedProgress}
        </Text>
      </Box>
      <Stack gap={0}>
        <Text>{label}</Text>
        <Text color="gray.500" fontFamily="Geist Mono">
          {formatCurrency(value)}
        </Text>
      </Stack>
    </HStack>
  );
}
