import { drawerAnatomy as parts } from "@chakra-ui/anatomy";
import {
  createMultiStyleConfigHelpers,
  cssVar,
  defineStyle,
} from "@chakra-ui/styled-system";
import { runIfFn } from "../utils/run-if-fn";
import { mode } from "@chakra-ui/theme-tools";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

const $bg = cssVar("drawer-bg");
const $bs = cssVar("drawer-box-shadow");

/**
 * Since the `maxWidth` prop references theme.sizes internally,
 * we can leverage that to size our modals.
 */
function getSize(value: string) {
  if (value === "full") {
    return definePartsStyle({
      dialog: { maxW: "100vw", h: "100vh" },
    });
  }
  return definePartsStyle({
    dialog: { maxW: value },
  });
}

const baseStyleOverlay = defineStyle((props) => ({
  bg: mode("whiteAlpha.500", "blackAlpha.500")(props),
  zIndex: "modal",
  backdropFilter: "blur(9px)",
}));

const baseStyleDialogContainer = defineStyle({
  display: "flex",
  zIndex: "modal",
  justifyContent: "center",
});

const baseStyleDialog = defineStyle((props) => {
  const { isFullHeight } = props;

  return {
    ...(isFullHeight && { height: "100vh" }),
    zIndex: "modal",
    maxH: "100vh",
    color: "inherit",
    [$bg.variable]: "colors.white",
    [$bs.variable]: "none",
    _dark: {
      [$bg.variable]: "colors.gray.900",
      [$bs.variable]: "none",
    },
    bg: $bg.reference,
    boxShadow: $bs.reference,
    m: 3,
    borderRadius: "2xl",
    borderWidth: "1px",
    borderColor: mode("gray.200", "gray.800")(props),
  };
});

const baseStyleHeader = defineStyle({
  px: "6",
  py: "4",
  fontSize: "xl",
  fontWeight: 400,
});

const baseStyleCloseButton = defineStyle({
  position: "absolute",
  top: "2",
  insetEnd: "3",
  borderRadius: "xl",
  color: "gray.500",
});

const baseStyleBody = defineStyle({
  px: "6",
  py: "2",
  flex: "1",
  overflow: "auto",
});

const baseStyleFooter = defineStyle({
  px: "6",
  py: "4",
});

const baseStyle = definePartsStyle((props) => ({
  overlay: baseStyleOverlay(props),
  dialogContainer: baseStyleDialogContainer,
  dialog: runIfFn(baseStyleDialog, props),
  header: baseStyleHeader,
  closeButton: baseStyleCloseButton,
  body: baseStyleBody,
  footer: baseStyleFooter,
}));

const sizes = {
  xs: getSize("xs"),
  sm: getSize("md"),
  md: getSize("lg"),
  lg: getSize("2xl"),
  xl: getSize("4xl"),
  full: getSize("full"),
};

export default defineMultiStyleConfig({
  baseStyle,
  sizes,
  defaultProps: {
    size: "xs",
  },
});
