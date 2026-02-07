import { defineStyleConfig } from "@chakra-ui/react";

export default defineStyleConfig({
  variants: {
    "onboarding-title": {
      textDecoration: "underline",
      fontSize: 20,
      textUnderlineOffset: 6,
      textDecorationThickness: 4,
      marginTop: 3,
      marginBottom: 4,
    },
  },
  baseStyle: {
    fontWeight: 400,
  },
});
