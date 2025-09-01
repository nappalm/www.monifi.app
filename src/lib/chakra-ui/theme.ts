import type { StyleFunctionProps } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import colors from "./_colors";

import Components from "./custom";

const styles = {
  global: (props: StyleFunctionProps) => ({
    body: {
      bg: mode("#ffffff", "#000000")(props),
      color: "text.body",
      fontWeight: 500,
      fontSize: "14px",
    },
  }),
};

const fonts = {
  heading: "Inter",
  body: "Inter",
};

const fontSizes = {
  xs: "0.75rem", // 12px
  sm: "0.8125rem", // 13px
  md: "0.875rem", // 14px
  lg: "1rem", // 16px
  xl: "1.125rem", // 18px
  "2xl": "1.25rem", // 20px
  "3xl": "1.5rem", // 24px
  "4xl": "1.875rem", // 30px
  "5xl": "2.25rem", // 36px
  "6xl": "3rem", // 48px
  "7xl": "3.75rem", // 60px
  "8xl": "5rem", // 80px
  "9xl": "6.5rem", // 104px
};

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

export default extendTheme({
  styles,
  components: Components,
  fonts,
  fontSizes,
  colors, // Posiblemente innecesario
  config,
  semanticTokens: {
    colors,
  },
});
