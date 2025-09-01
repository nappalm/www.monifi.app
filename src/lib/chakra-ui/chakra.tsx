import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { type PropsWithChildren } from "react";
import GlobalStyle from "./global-style";
import theme from "./theme";

export default function Chakra({ children }: PropsWithChildren) {
  return (
    <ChakraProvider theme={theme} portalZIndex={40}>
      {children}
      <GlobalStyle />
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    </ChakraProvider>
  );
}
