import { cardAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(cardAnatomy.keys);

const baseStyle = definePartsStyle({
  container: {
    borderRadius: "xl",
  },
  header: {},
  body: {
    borderRadius: "inherit",
  },
  footer: {},
});

const solidVariant = definePartsStyle((props) => ({
  container: {
    boxShadow: "none",
    transition: "all ease-in-out 300ms",
    bg: mode(`gray.100`, `whiteAlpha.50`)(props),
  },
  body: {
    bg: mode(`gray.200`, `whiteAlpha.200`)(props),
    borderRadius: "xl",
  },
}));

const outlineVariant = definePartsStyle((props) => ({
  container: {
    boxShadow: "none",
    transition: "all ease-in-out 300ms",
    borderWidth: "1px",
    borderColor: mode("gray.300", "whiteAlpha.300")(props),
    bg: "transparent",
  },
  body: {
    bg: "transparent",
  },
  header: {
    borderRadius: "inherit",
    borderBottomRadius: 0,
    bg: mode("gray.200", "whiteAlpha.200")(props),
  },
  footer: {
    borderTopWidth: "1px",
  },
}));

const sizes = {};
const variants = {
  solid: solidVariant,
  outline: outlineVariant,
};

export default defineMultiStyleConfig({
  baseStyle,
  sizes,
  variants,
  defaultProps: {
    variant: "outline",
  },
});
