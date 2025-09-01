import { defineStyleConfig } from "@chakra-ui/react";

export default defineStyleConfig({
  variants: {
    titleUnderline: {
      textDecoration: "underline",
      fontSize: 20,
      textUnderlineOffset: 6,
      textDecorationColor: "initial",
      textDecorationThickness: 4,
      marginTop: 3,
      marginBottom: 4,
    },
    title: {
      fontSize: 20,
      fontWeight: 500,
    },
    number: {
      fontFamily: "Inconsolata",
    },
  },
  defaultProps: {
    variant: "title",
  },
});
