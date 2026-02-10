import { defineStyleConfig } from "@chakra-ui/react";

export default defineStyleConfig({
  variants: {
    "onboarding-title": {
      textDecoration: "underline",
      fontSize: "30px",
      textUnderlineOffset: 6,
      textDecorationThickness: 4,
      marginTop: 3,
      marginBottom: 4,
    },
  },
  baseStyle: {
    fontFamily: "Geist Mono",
    fontWeight: 300,
  },
});
