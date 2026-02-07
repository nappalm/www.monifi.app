import { Tables } from "@/lib/supabase/database.types";
import { AccountsDrawer, CategoriesDrawer } from "@/shared";
import {
  Button,
  Grid,
  Heading,
  HStack,
  Stack,
  Text,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { IconArrowNarrowLeft } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import { DetailsDrawer } from "../components/DetailsDrawer";
import LoadFilePC from "../components/LoadFilePC";
import TransactionsTable from "../components/TransactionsTable";
import useTransactionExtract from "../hooks/useTransactionExtract";
import { useCreateBulkTransactions } from "../hooks/useTransactions";

export default function ExtractPage() {
  const transactionExtract = useTransactionExtract();
  const createBulkTransactions = useCreateBulkTransactions();

  const [file, setFile] = useState<File | null>(null);
  const isSmallScreen =
    useBreakpointValue({ base: true, lg: false }, { ssr: false }) ?? false;

  const adminCategories = useDisclosure();
  const adminAccounts = useDisclosure();

  const [tableData, setTableData] = useState<Tables<"transactions">[]>([]);
  const [detailsRow, setDetailsRow] = useState<Tables<"transactions"> | null>(
    null,
  );

  useEffect(() => {
    if (transactionExtract.isSuccess) {
      setTableData(() => {
        return transactionExtract.data.data.map(({ date, ...item }, index) => ({
          id: index + 1,
          occurred_at: date,
          ...item,
          enabled: true,
          category_id: null,
          account_id: null,
        })) as Tables<"transactions">[];
      });
    }
  }, [transactionExtract.data, transactionExtract.isSuccess]);

  const handleExtract = () => {
    if (!file) return;
    transactionExtract.mutate({ file });
  };

  const handleSave = () => {
    const request = tableData.map(({ id, ...rest }) => rest);
    createBulkTransactions.mutate(request);
  };

  const handleUpdateRow = useCallback((data: Tables<"transactions">) => {
    setTableData((prev) =>
      prev.map((row) => (row.id === data.id ? { ...row, ...data } : row)),
    );
  }, []);

  const handleRemoveRow = useCallback((id: number) => {
    setTableData((prev) => prev.filter((row) => row.id !== id));
  }, []);

  const handleSeeDetailsRow = useCallback(
    (id: number) => {
      const row = tableData.find((t) => t.id === id);
      setDetailsRow(row || null);
    },
    [tableData],
  );

  const handleDisabledRow = useCallback((id: number, previous: boolean) => {
    setTableData((prev) =>
      prev.map((row) => (row.id === id ? { ...row, enabled: !previous } : row)),
    );
  }, []);

  return (
    <>
      <Stack>
        <HStack justify="space-between">
          <Stack gap={1}>
            <Heading size="lg">Extrae información de tu archivo</Heading>
            <Text opacity={0.5}>
              Carga tu estado de cuenta y obtén automáticamente los datos clave
              listos para analizar.
            </Text>
          </Stack>
          <Button leftIcon={<IconArrowNarrowLeft size={16} />} variant="ghost">
            Back
          </Button>
        </HStack>
        <Grid
          gridAutoFlow={isSmallScreen ? "row" : "column"}
          gridTemplateColumns={
            isSmallScreen
              ? "minmax(0, 1fr)"
              : "296px minmax(0, calc(100% - 296px - 24px))"
          }
          gridGap="24px"
          py={5}
        >
          <Stack gap={2}>
            <LoadFilePC onFileSelect={setFile} />
            <Button
              colorScheme="cyan"
              variant="solid"
              onClick={handleExtract}
              isDisabled={!file}
              isLoading={transactionExtract.isPending}
            >
              Extraer información
            </Button>
            <Button
              colorScheme="cyan"
              variant="solid"
              onClick={handleSave}
              isDisabled={!file}
            >
              Guardar transacciones
            </Button>
          </Stack>
          <Stack>
            <TransactionsTable
              data={tableData}
              isLoading={transactionExtract.isPending}
              onRowChange={handleUpdateRow}
              onRemoveRow={handleRemoveRow}
              onSeeDetailsRow={handleSeeDetailsRow}
              onDisabledRow={handleDisabledRow}
              onAdminCategories={adminCategories.onToggle}
              onAdminAccounts={adminAccounts.onToggle}
            />
          </Stack>
        </Grid>
      </Stack>

      <DetailsDrawer
        isOpen={!!detailsRow}
        onClose={() => setDetailsRow(null)}
        transaction={detailsRow}
      />
      <CategoriesDrawer {...adminCategories} />
      <AccountsDrawer {...adminAccounts} />
    </>
  );
}
