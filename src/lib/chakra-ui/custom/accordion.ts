import { accordionAnatomy as parts } from "@chakra-ui/anatomy";
import {
  createMultiStyleConfigHelpers,
  defineStyle,
} from "@chakra-ui/styled-system";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

const baseStyleContainer = defineStyle({
  borderTopWidth: "1px",
  //   borderColor: 'inherit',
  borderColor: "black2a",
  bg: "black2",
  _first: {
    borderTopWidth: 0,
    borderTopRadius: "xl",
  },
  _last: {
    borderBottomWidth: "1px",
    borderBottomRadius: "xl",
  },
});

const baseStyleButton = defineStyle({
  transitionProperty: "common",
  transitionDuration: "normal",
  fontSize: "md",
  _focusVisible: {
    boxShadow: "outline",
  },
  _hover: {
    bg: "blackAlpha.50",
  },
  _disabled: {
    opacity: 0.4,
    cursor: "not-allowed",
  },
  px: "4",
  py: "5",
});

const baseStylePanel = defineStyle({
  bg: "black2a",
  borderRadius: "xl",
  boxShadow: "sm",
  mx: 3,
  mb: 3,
  pt: "4",
  px: "4",
  pb: "6",
});

const baseStyleIcon = defineStyle({
  fontSize: "1.25em",
  color: "black3",
});

const baseStyle = definePartsStyle({
  container: baseStyleContainer,
  button: baseStyleButton,
  panel: baseStylePanel,
  icon: baseStyleIcon,
});

export default defineMultiStyleConfig({ baseStyle });
