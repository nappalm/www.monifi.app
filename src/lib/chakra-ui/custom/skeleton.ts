import {
  cssVar,
  defineStyle,
  defineStyleConfig,
} from "@chakra-ui/styled-system";

const $startColor = cssVar("skeleton-start-color");
const $endColor = cssVar("skeleton-end-color");

const baseStyle = defineStyle({
  [$startColor.variable]: "colors.gray.300",
  [$endColor.variable]: "colors.gray.200",
  _dark: {
    [$startColor.variable]: "colors.gray.900",
    [$endColor.variable]: "colors.gray.800",
  },
  background: $startColor.reference,
  borderColor: $endColor.reference,
  opacity: 0.7,
  borderRadius: "xl",
});

export default defineStyleConfig({
  baseStyle,
});
