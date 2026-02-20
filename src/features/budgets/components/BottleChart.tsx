import { Box, Stack, useColorModeValue } from "@chakra-ui/react";
import { useMemo } from "react";

const BOTTOM_PATH =
  "M1 61v37.359c0 2.364.737 4.683 2.277 6.478 5.203 6.066 14.128 14.03 21.975 13.55 1.14-.07 2.248.756 2.248 1.899 0 .946.767 1.714 1.714 1.714H46.77c1.114 0 2.19-.409 3.023-1.149l.27-.24a4.169 4.169 0 0 1 5.716.168A4.167 4.167 0 0 0 58.727 122h15.47a4.743 4.743 0 0 0 3.151-1.198 4.744 4.744 0 0 1 6.304 0A4.743 4.743 0 0 0 86.804 122h16.039a4 4 0 0 0 2.829-1.172 4 4 0 0 1 5.656 0 4 4 0 0 0 2.829 1.172h16.039a4.743 4.743 0 0 0 3.152-1.198 4.744 4.744 0 0 1 6.304 0 4.743 4.743 0 0 0 3.152 1.198h15.392a4.743 4.743 0 0 0 3.152-1.198 4.744 4.744 0 0 1 6.304 0 4.743 4.743 0 0 0 3.152 1.198h14.392a4.743 4.743 0 0 0 3.152-1.198 4.744 4.744 0 0 1 6.304 0 4.743 4.743 0 0 0 3.152 1.198h14.679a5.748 5.748 0 0 0 3.592-1.26 5.749 5.749 0 0 1 6.973-.16l.308.225a6.25 6.25 0 0 0 3.676 1.195h11.64a6.826 6.826 0 0 0 4.828-2 6.826 6.826 0 0 1 4.828-2h21.88c1.832 0 3.636-.458 5.246-1.332l60.796-32.99a5.601 5.601 0 0 1 2.673-.678h1.274c.827 0 1.613.362 2.151.99a2.835 2.835 0 0 0 4.304 0 2.832 2.832 0 0 1 2.151-.99h2.894c1.176 0 2.325.348 3.303 1 .978.652 2.127 1 3.303 1h7.681a7.592 7.592 0 0 0 3.766-1l.201-.115a6.72 6.72 0 0 1 3.333-.885A6.716 6.716 0 0 0 380 76.284V61.5";

const TOP_PATH =
  "M1 62V24.642c0-2.365.737-4.684 2.277-6.48 5.203-6.065 14.128-14.03 21.975-13.55 1.14.07 2.248-.755 2.248-1.898 0-.946.767-1.714 1.714-1.714H46.77a4.55 4.55 0 0 1 3.023 1.15l.27.239a4.168 4.168 0 0 0 5.716-.168A4.168 4.168 0 0 1 58.727 1h15.47c1.161 0 2.283.426 3.151 1.198a4.744 4.744 0 0 0 6.304 0A4.744 4.744 0 0 1 86.804 1h16.039c1.061 0 2.078.421 2.829 1.172a3.999 3.999 0 0 0 5.656 0A4.003 4.003 0 0 1 114.157 1h16.039c1.162 0 2.284.426 3.152 1.198a4.745 4.745 0 0 0 6.304 0A4.744 4.744 0 0 1 142.804 1h15.392c1.162 0 2.284.426 3.152 1.198a4.745 4.745 0 0 0 6.304 0A4.744 4.744 0 0 1 170.804 1h14.392c1.162 0 2.284.426 3.152 1.198a4.745 4.745 0 0 0 6.304 0A4.744 4.744 0 0 1 197.804 1h14.679a5.75 5.75 0 0 1 3.592 1.26 5.75 5.75 0 0 0 6.973.16l.308-.225A6.251 6.251 0 0 1 227.032 1h11.64c1.811 0 3.547.72 4.828 2a6.828 6.828 0 0 0 4.828 2h21.88c1.832 0 3.636.458 5.246 1.332l60.796 32.99c.82.445 1.739.678 2.673.678h1.274c.827 0 1.613-.361 2.151-.99a2.835 2.835 0 0 1 4.304 0c.538.629 1.324.99 2.151.99h2.894A5.953 5.953 0 0 0 355 39c.978-.652 2.127-1 3.303-1h7.681c1.321 0 2.619.345 3.766 1l.201.115a6.72 6.72 0 0 0 3.333.885A6.716 6.716 0 0 1 380 46.716V61.5";

interface BottleChartProps {
  spentAmount?: number;
  budgetAmount?: number;
  allocatedAmount?: number;
}

export default function BottleChart({
  spentAmount = 0,
  budgetAmount = 0,
  allocatedAmount = 0,
}: BottleChartProps) {
  const level = useMemo(() => {
    if (budgetAmount <= 0) return 0;
    return Math.min(1, spentAmount / budgetAmount);
  }, [spentAmount, budgetAmount]);

  const allocatedLevel = useMemo(() => {
    if (budgetAmount <= 0) return 0;
    return Math.min(1, Math.max(0, allocatedAmount / budgetAmount));
  }, [allocatedAmount, budgetAmount]);
  const strokeColor = useColorModeValue(
    "var(--chakra-colors-gray-400)",
    "var(--chakra-colors-gray-600)",
  );
  const strokeColorLight = useColorModeValue(
    "var(--chakra-colors-gray-300)",
    "var(--chakra-colors-gray-700)",
  );
  const fillColor = useColorModeValue(
    "var(--chakra-colors-gray-300)",
    "var(--chakra-colors-gray-800)",
  );
  // const borderColor = useColorModeValue("gray.200", "gray.800");

  // The bottle spans from y≈1 (top) to y≈122 (bottom)
  // fillY is where the fill starts (from top), going down to 123
  const fillY = 123 * (1 - Math.min(1, Math.max(0, level)));
  const markerY = 123 * (1 - allocatedLevel);

  const dotColor = useColorModeValue("gray.300", "gray.700");

  return (
    <Stack>
      <Box
        flex={1}
        py={10}
        borderRadius="md"
        display="flex"
        alignItems="center"
        justifyContent="center"
        position="relative"
        overflow="hidden"
      >
        {/* Dots on the left side */}
        <Stack
          position="absolute"
          left={1}
          top="50%"
          transform="translateY(-50%)"
          gap={10}
          zIndex={0}
        >
          {[...Array(10)].map((_, i) => (
            <Box
              key={`left-${i}`}
              w={1}
              h={1}
              borderRadius="full"
              bg={dotColor}
            />
          ))}
        </Stack>

        {/* Dots on the top */}
        <Stack
          position="absolute"
          top={1}
          left="50%"
          transform="translateX(-50%)"
          direction="row"
          gap={10}
          zIndex={0}
        >
          {[...Array(10)].map((_, i) => (
            <Box
              key={`top-${i}`}
              w={1}
              h={1}
              borderRadius="full"
              bg={dotColor}
            />
          ))}
        </Stack>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 381 123"
          width="80%"
          fill="none"
          style={{ maxWidth: 200, position: "relative", zIndex: 1 }}
        >
          <defs>
            <clipPath id="bottle-clip">
              <path d={BOTTOM_PATH} />
              <path d={TOP_PATH} />
            </clipPath>
          </defs>

          {/* Animated wave fill clipped to bottle interior */}
          <g clipPath="url(#bottle-clip)">
            <g>
              <path
                d={`M-381 ${fillY} Q-333.25 ${fillY - 6} -285.5 ${fillY} T-190 ${fillY} T-95 ${fillY} T0 ${fillY} T95 ${fillY} T190 ${fillY} T285.5 ${fillY} T381 ${fillY} T476.5 ${fillY} T572 ${fillY} T667 ${fillY} T762 ${fillY} V123 H-381 Z`}
                fill={fillColor}
              >
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  from="0 0"
                  to="190 0"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </path>
              <path
                d={`M-381 ${fillY + 2} Q-333.25 ${fillY + 4} -285.5 ${fillY + 2} T-190 ${fillY + 2} T-95 ${fillY + 2} T0 ${fillY + 2} T95 ${fillY + 2} T190 ${fillY + 2} T285.5 ${fillY + 2} T381 ${fillY + 2} T476.5 ${fillY + 2} T572 ${fillY + 2} T667 ${fillY + 2} T762 ${fillY + 2} V123 H-381 Z`}
                fill={fillColor}
              >
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  from="190 0"
                  to="0 0"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </path>
            </g>
          </g>

          {/* Bottle outline strokes */}
          <path stroke={strokeColor} strokeWidth={2} d={BOTTOM_PATH} />
          <path stroke={strokeColor} strokeWidth={2} d={TOP_PATH} />

          {/* Allocated amount marker — drawn on top, clipped to bottle */}
          {allocatedAmount > 0 && (
            <line
              x1={0}
              y1={markerY}
              x2={381}
              y2={markerY}
              stroke={strokeColor}
              strokeWidth={2}
              clipPath="url(#bottle-clip)"
            />
          )}

          {/* Detail lines */}
          <path stroke={strokeColorLight} d="M14.5 115V8" />
          <path stroke={strokeColor} strokeWidth={2} d="M264 5v113" />
          <path stroke={strokeColorLight} d="M258.5 5v113" />
        </svg>
      </Box>
    </Stack>
  );
}
