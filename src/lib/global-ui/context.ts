import { createContext, useContext, type ReactNode } from "react";

export type AlertModalState = {
  title: string;
  description?: string;
  colorScheme?: string;
  onOk?: () => void;
  onCancel?: () => void;
  render?: ReactNode;
  isLoading?: boolean | (() => boolean);
};

export type GlobalUIContextType = {
  alert: {
    onOpen: (state: AlertModalState) => void;
  };
};

export const GlobalUIContext = createContext<GlobalUIContextType | null>(null);

export function useGlobalUI() {
  const context = useContext(GlobalUIContext);
  if (!context) {
    throw new Error("useGlobalUI must be used within a GlobalUIProvider");
  }
  return context;
}
