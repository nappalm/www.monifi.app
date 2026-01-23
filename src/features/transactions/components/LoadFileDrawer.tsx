import {
  Alert,
  AlertIcon,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Highlight,
  Stack,
  Text,
  UseDisclosureProps,
} from "@chakra-ui/react";
import { Icon3dCubeSphere } from "@tabler/icons-react";
import { useState } from "react";
import LoadFilePC from "./LoadFilePC";
import TransactionsTable from "./TransactionsTable";

type Props = UseDisclosureProps;

export default function LoadFileDrawer({ isOpen = false, onClose }: Props) {
  const [step] = useState<"upload" | "verify">("verify");

  return (
    <Drawer
      isOpen={isOpen}
      onClose={() => onClose?.()}
      size={step === "upload" ? "sm" : "xl"}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader display="flex" gap={2}>
          <Icon3dCubeSphere />
          Load transactions from file
        </DrawerHeader>
        <DrawerBody>
          {step === "upload" && (
            <Stack gap={3}>
              <Text>
                Usaremos Inteligencia artificial para procesar tus
                transacciones.
              </Text>
              <LoadFilePC />
              <Button variant="solid" colorScheme="cyan">
                Inicializar reconocimiento
              </Button>
            </Stack>
          )}
          {step === "verify" && (
            <Stack gap={5}>
              <Alert colorScheme="cyan">
                <AlertIcon />
                <Highlight
                  query={["Category", "Account"]}
                  styles={{
                    px: "2",
                    py: "2px",
                    rounded: "md",
                    color: "cyan.500",
                  }}
                >
                  Revisa las columnas Category y Account para identificar el
                  monto que debe procesarse.
                </Highlight>
              </Alert>
              <TransactionsTable data={[]} />
            </Stack>
          )}
        </DrawerBody>
        <DrawerFooter>
          <Button colorScheme="cyan" variant="solid">
            Accept and save
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
