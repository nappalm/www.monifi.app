import { tableAnatomy as parts } from "@chakra-ui/anatomy";
import {
  createMultiStyleConfigHelpers,
  defineStyle,
} from "@chakra-ui/styled-system";
import { mode, transparentize } from "@chakra-ui/theme-tools";

const { defineMultiStyleConfig, definePartsStyle } =
  createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle({
  table: {
    fontVariantNumeric: "lining-nums tabular-nums",
    borderCollapse: "collapse",
    width: "full",
  },
  th: {
    fontFamily: "heading",
    fontWeight: "bold",
    textTransform: "capitalize",
    letterSpacing: "wider",
    textAlign: "start",
  },
  td: {
    textAlign: "start",
  },
  caption: {
    mt: 4,
    fontFamily: "heading",
    textAlign: "center",
    fontWeight: "medium",
  },
});

const numericStyles = defineStyle({
  "&[data-is-numeric=true]": {
    textAlign: "end",
  },
});

const variantSimple = definePartsStyle((props) => {
  const { colorScheme: c } = props;

  return {
    th: {
      color: mode("gray.600", "gray.400")(props),
      borderBottom: "0px",
      borderColor: mode(`${c}.200`, `${c}.800`)(props),
      bg: mode("gray.200", "gray.900")(props),
      "&:first-of-type": {
        borderTopLeftRadius: "xl",
        borderBottomLeftRadius: "xl",
      },
      "&:last-of-type": {
        borderTopRightRadius: "xl",
        borderBottomRightRadius: "xl",
      },
      ...numericStyles,
    },
    td: {
      borderBottom: "1px",
      borderColor: mode(`${c}.200`, `${c}.800`)(props),
      ...numericStyles,
    },
    caption: {
      color: mode("gray.600", "gray.100")(props),
    },
    tfoot: {
      tr: {
        "&:last-of-type": {
          th: { borderBottomWidth: 0 },
        },
      },
    },
  };
});

const variantStripe = definePartsStyle((props) => {
  const { colorScheme: c, theme } = props;
  const stripedBgBase = mode(`${c}.100`, `${c}.900`)(props);
  const stripedBg = transparentize(stripedBgBase, 0.6)(theme);

  return {
    th: {
      color: mode("gray.600", "gray.400")(props),
      borderStyle: "solid",
      borderColor: mode(`${c}.200`, `${c}.800`)(props),
      ...numericStyles,
    },
    td: {
      borderWidth: "1px",
      borderLeftWidth: 0,
      borderStyle: "solid",
      borderColor: mode(`${c}.200`, `${c}.800`)(props),
      "&:last-of-type": {
        borderRight: 0,
      },
      ...numericStyles,
    },
    caption: {
      color: mode("gray.600", "gray.100")(props),
    },

    tbody: {
      tr: {
        "&:nth-of-type(odd)": {
          td: {
            background: stripedBg,
            borderColor: mode(`${c}.200`, `${c}.800`)(props),
            borderBottomWidth: 0,
            borderTopWidth: 0,
          },
        },

        td: {
          position: "relative",
          overflow: "hidden",
          cursor: "default",

          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            borderRadius: "md",
            border: "1px solid",
            borderColor: "cyan.500",
            background: transparentize("cyan.500", 0.15),
            zIndex: 1,
            pointerEvents: "none",

            opacity: 0,
            transform: "scale(0.95)",
            boxShadow: `0 0 0px ${transparentize("cyan.500", 0.5)}`,
            transition:
              "opacity 0.25s ease, transform 0.25s ease, box-shadow 0.4s ease",
          },

          "&:hover::after": {
            opacity: 1,
            transform: "scale(1)",
            boxShadow: `0 0 15px 3px ${transparentize("cyan.500", 0.7)}`,
          },

          "> *": {
            position: "relative",
            zIndex: 2,
          },
        },
      },
    },
    tfoot: {
      tr: {
        "&:last-of-type": {
          th: {
            borderBottomWidth: 0,
          },
        },
      },
    },
  };
});

const variants = {
  simple: variantSimple,
  striped: variantStripe,
  unstyled: defineStyle({}),
};

const sizes = {
  sm: definePartsStyle({
    th: {
      px: "4",
      py: "2",
      lineHeight: "4",
      fontSize: "xs",
    },
    td: {
      px: "4",
      py: "1",
      fontSize: "sm",
      lineHeight: "5",
    },
    caption: {
      px: "4",
      py: "2",
      fontSize: "xs",
    },
  }),
  md: definePartsStyle({
    th: {
      px: "6",
      py: "3",
      lineHeight: "4",
      fontSize: "xs",
    },
    td: {
      px: "6",
      py: "3",
      lineHeight: "5",
    },
    caption: {
      px: "6",
      py: "2",
      fontSize: "sm",
    },
  }),
  lg: definePartsStyle({
    th: {
      px: "8",
      py: "4",
      lineHeight: "5",
      fontSize: "sm",
    },
    td: {
      px: "8",
      py: "4",
      lineHeight: "6",
    },
    caption: {
      px: "6",
      py: "2",
      fontSize: "md",
    },
  }),
};

export default defineMultiStyleConfig({
  baseStyle,
  variants,
  sizes,
  defaultProps: {
    variant: "simple",
    size: "md",
    colorScheme: "gray",
  },
});
