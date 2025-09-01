import { ChakraProvider, ReactQueryClient } from "@/lib";
import RouterProvider from "./router";
import { AuthProvider } from "@/features/auth";

export default function Providers() {
  return (
    <ChakraProvider>
      <ReactQueryClient>
        <AuthProvider>
          <RouterProvider />
        </AuthProvider>
      </ReactQueryClient>
    </ChakraProvider>
  );
}
