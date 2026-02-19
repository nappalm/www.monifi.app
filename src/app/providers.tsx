import { ChakraProvider, GlobalUIProvider, ReactQueryClient } from "@/lib";
import RouterProvider from "./router";
import { AuthProvider } from "@/features/auth";

import "../lib/i18n";

export default function Providers() {
  return (
    <ChakraProvider>
      <ReactQueryClient>
        <AuthProvider>
          <GlobalUIProvider>
            <RouterProvider />
          </GlobalUIProvider>
        </AuthProvider>
      </ReactQueryClient>
    </ChakraProvider>
  );
}
