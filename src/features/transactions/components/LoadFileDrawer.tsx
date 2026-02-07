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
import { useMemo, useState } from "react";
import LoadFilePC from "./LoadFilePC";
import TransactionsTable from "./TransactionsTable";
import useTransactionExtract from "../hooks/useTransactionExtract";
import extractMock from "../_mocks_/extractMock.json";

type Props = UseDisclosureProps;

export default function LoadFileDrawer({ isOpen = false, onClose }: Props) {
  const transactionExtract = useTransactionExtract();

  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState<"upload" | "verify">("verify");

  const handleSendfile = () => {
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    transactionExtract.mutate(form, {
      onSuccess: () => {
        setStep("verify");
      },
    });
  };

  const normalizeDataTable = useMemo(() => {
    const mock = extractMock;
    return mock.data.map(({ date, ...item }) => ({
      occurred_at: date,
      ...item,
      category_id: null,
      account_id: null,
    }));

    if (transactionExtract.data) {
      return transactionExtract.data?.data.map((item, index) => {
        return {
          ...item,
          id: index,
          account_id: null,
          category_id: null,
          enabled: true,
        };
      });
    }

    return [];
  }, [transactionExtract.data]);

  return (
    <Drawer
      isOpen={isOpen || !!file}
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
              <LoadFilePC onFileSelect={setFile} />
              <Button
                variant="solid"
                colorScheme="cyan"
                onClick={handleSendfile}
                isLoading={transactionExtract.isPending}
              >
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
              <TransactionsTable data={normalizeDataTable} />
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
