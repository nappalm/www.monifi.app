import { useDisclosure } from "@chakra-ui/react";
import { useState, type PropsWithChildren } from "react";
import { AlertModal } from "./components/AlertModal";
import { GlobalUIContext, type AlertModalState } from "./context";

export function GlobalUIProvider({ children }: PropsWithChildren) {
  const alertDisclosure = useDisclosure();
  const [alertState, setAlertState] = useState<AlertModalState>({ title: "" });

  const handleAlertOpen = (state: AlertModalState) => {
    setAlertState(state);
    alertDisclosure.onOpen();
  };

  return (
    <GlobalUIContext.Provider
      value={{
        alert: { onOpen: handleAlertOpen },
      }}
    >
      {children}
      <AlertModal
        {...alertState}
        isOpen={alertDisclosure.isOpen}
        onClose={alertDisclosure.onClose}
      />
    </GlobalUIContext.Provider>
  );
}
