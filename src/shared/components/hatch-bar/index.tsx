import { Box, useColorModeValue } from "@chakra-ui/react";
import { useId } from "react";

type Props = {
  value: number;
  max: number;
  height?: string;
};

export function HatchBar({ value, max, height = "14px" }: Props) {
  const id = useId();
  const patternId = `hatch-pattern-${id.replace(/:/g, "")}`;
  const barFill = useColorModeValue(
    "var(--chakra-colors-gray-400)",
    "var(--chakra-colors-gray-500)",
  );
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;

  return (
    <Box w="full" h={height} overflow="hidden" borderRadius="4px">
      <svg width="100%" height={height} shapeRendering="crispEdges">
        <defs>
          <pattern
            id={patternId}
            patternUnits="userSpaceOnUse"
            width="4"
            height="4"
          >
            <rect width="4" height="4" fill="transparent" />
            <rect
              x="0"
              y="0"
              width="2"
              height="2"
              fill="rgba(255,255,255,0.18)"
            />
            <rect
              x="2"
              y="2"
              width="2"
              height="2"
              fill="rgba(255,255,255,0.18)"
            />
          </pattern>
        </defs>
        <rect width="100%" height={height} fill={`url(#${patternId})`} />
        <rect width={`${percentage}%`} height={height} fill={barFill} />
      </svg>
    </Box>
  );
}
