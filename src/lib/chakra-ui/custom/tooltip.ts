import { defineStyle, defineStyleConfig } from "@chakra-ui/styled-system";
import { cssVar } from "@chakra-ui/theme-tools";

const $arrowBg = cssVar("popper-arrow-bg");

const baseStyle = defineStyle({
  bg: "#000",
  color: "#fff",
  [$arrowBg.variable]: "#000",
  p: 2,
  border: "none",
  borderRadius: "lg",
  textAlign: "center",
  fontWeight: 500,
  fontSize: "12px",
  boxShadow: "md",
  maxW: "xs",
  zIndex: "tooltip",
});

export default defineStyleConfig({
  baseStyle,
});
