import { AuthContext } from "@/features/auth";
import { useContext } from "react";

export default function useAuthenticatedUser() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthenticatedUser must be used within an AuthProvider");
  }
  return context;
}
