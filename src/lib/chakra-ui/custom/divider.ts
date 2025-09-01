import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const brandPrimary = defineStyle({
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "divider.border",
});

export default defineStyleConfig({
  variants: {
    brandPrimary,
  },
  defaultProps: {
    variant: "brandPrimary",
  },
});
