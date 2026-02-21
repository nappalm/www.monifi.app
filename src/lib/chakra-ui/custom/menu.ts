import { menuAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(menuAnatomy.keys);

const baseStyle = definePartsStyle((props) => ({
  list: {
    py: 0,
    bg: mode("gray.100", "gray.800")(props),
    p: 1,
    border: "1px solid",
    borderColor: mode("gray.200", "gray.800")(props),
    borderRadius: "xl",
    overflow: "hidden",
    letterSpacing: "-0.5px",
    boxShadow: mode(
      "inset 1px 1px 0px rgba(255, 255, 255, 0.5), inset -1px -1px 0px rgba(0, 0, 0, 0.1)",
      "inset 1px 1px 0px rgba(255, 255, 255, 0.1), inset -1px -1px 0px rgba(0, 0, 0, 0.1)",
    )(props),
  },
  item: {
    bg: "transparent",
    borderTopRadius: "md",
    borderBottomRadius: "md",
    fontWeight: 600,
    letterSpacing: "-0.5px",
    py: 1,
    fontSize: "sm",
    _focus: {
      bg: mode("gray.200", "gray.700")(props),
    },
  },
  groupTitle: {
    mx: 3,
    my: 2,
    fontWeight: "semibold",
    letterSpacing: "-0.5px",
    fontSize: "sm",
    opacity: 0.5,
  },
  divider: {
    my: 1,
    borderBottom: "1px solid",
    borderColor: mode("gray.300", "gray.700")(props),
  },
  icon: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
}));

export default defineMultiStyleConfig({ baseStyle });
