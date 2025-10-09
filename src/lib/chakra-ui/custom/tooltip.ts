import { defineStyle, defineStyleConfig } from "@chakra-ui/styled-system";
import { cssVar } from "@chakra-ui/theme-tools";

const $arrowBg = cssVar("popper-arrow-bg");

const baseStyle = defineStyle((props) => {
  const { colorMode } = props;
  const bgColor = colorMode === "dark" ? "gray.900" : "#000";

  return {
    bg: bgColor,
    color: "#fff",
    [$arrowBg.variable]: `colors.${bgColor}`,
    p: 2,
    border: "none",
    borderRadius: "lg",
    textAlign: "center",
    fontWeight: 500,
    fontSize: "12px",
    boxShadow: "md",
    maxW: "xs",
    zIndex: "tooltip",
  };
});

export default defineStyleConfig({
  baseStyle,
});
