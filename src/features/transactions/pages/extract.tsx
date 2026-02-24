import { Tables } from "@/lib/supabase/database.types";
import { AccountsDrawer, ButtonSpinner, CategoriesDrawer } from "@/shared";
import {
  Button,
  Container,
  Heading,
  HStack,
  IconButton,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { IconX } from "@tabler/icons-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DetailsDrawer } from "../components/DetailsDrawer";
import LoadFilePC from "../components/LoadFilePC";
import TransactionsTable from "../components/TransactionsTable";
import useTransactionExtract from "../hooks/useTransactionExtract";
import {
  useCreateBulkTransactions,
  useTransactions,
} from "../hooks/useTransactions";

const normalizeDescription = (d: string | null | undefined) =>
  (d || "").replace(/[*]/g, " ").replace(/\s+/g, " ").trim().toLowerCase();

const getTransactionKey = (t: {
  description?: string | null;
  amount: number;
  type: string;
}) => `${normalizeDescription(t.description)}|${t.amount}|${t.type}`;

export default function ExtractPage() {
  const transactionExtract = useTransactionExtract();
  const createBulkTransactions = useCreateBulkTransactions();

  const adminCategories = useDisclosure();
  const adminAccounts = useDisclosure();

  const [tableData, setTableData] = useState<Tables<"transactions">[]>([]);
  const [detailsRow, setDetailsRow] = useState<Tables<"transactions"> | null>(
    null,
  );
  const [duplicateKeys, setDuplicateKeys] = useState<Set<string>>(new Set());

  const extractDateRange = useMemo<[string, string] | null>(() => {
    if (!transactionExtract.isSuccess || !transactionExtract.data.data.length)
      return null;
    const dates = transactionExtract.data.data.map((t) => t.date);
    const sorted = [...dates].sort();

    const MARGIN_DAYS = 7;
    const start = new Date(sorted[0]);
    start.setDate(start.getDate() - MARGIN_DAYS);
    const end = new Date(sorted[sorted.length - 1]);
    end.setDate(end.getDate() + MARGIN_DAYS);

    return [start.toISOString().split("T")[0], end.toISOString().split("T")[0]];
  }, [transactionExtract.isSuccess, transactionExtract.data]);

  const existingTransactions = useTransactions(extractDateRange);

  useEffect(() => {
    if (!transactionExtract.isSuccess) return;

    setTableData(
      transactionExtract.data.data.map(({ date, ...item }, index) => ({
        id: index + 1,
        occurred_at: date + "T00:00:00",
        ...item,
        enabled: true,
        category_id: null,
        account_id: null,
      })) as Tables<"transactions">[],
    );
    setDuplicateKeys(new Set());
  }, [transactionExtract.data, transactionExtract.isSuccess]);

  // Detect duplicates when existing transactions are available
  useEffect(() => {
    if (!existingTransactions.data || !transactionExtract.isSuccess) return;

    const existingKeys = new Set(
      existingTransactions.data.map(getTransactionKey),
    );

    setDuplicateKeys(existingKeys);

    if (existingKeys.size > 0) {
      setTableData((prev) =>
        prev.map((t) =>
          existingKeys.has(getTransactionKey(t)) ? { ...t, enabled: false } : t,
        ),
      );
    }
  }, [
    existingTransactions.data,
    transactionExtract.isSuccess,
    transactionExtract.data,
  ]);

  const handleExtract = (file: File) => {
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
          {transactionExtract.isSuccess && (
            <HStack>
              <Button
                colorScheme="cyan"
                variant="solid"
                isLoading={createBulkTransactions.isPending}
                onClick={handleSave}
                spinner={<ButtonSpinner />}
                loadingText="Guardando transacciones"
              >
                Save transactions
              </Button>
              <IconButton
                aria-label="Cancel extract file"
                icon={<IconX size={16} />}
              />
            </HStack>
          )}
        </HStack>
        {!transactionExtract.isSuccess && (
          <Container mt={20} maxWidth="container.md">
            <LoadFilePC
              onContinue={handleExtract}
              isLoading={transactionExtract.isPending}
            />
          </Container>
        )}

        {transactionExtract.isSuccess && (
          <>
            {duplicateKeys.size > 0 && (
              <Text color="orange.300" fontSize="sm">
                {
                  tableData.filter((t) =>
                    duplicateKeys.has(getTransactionKey(t)),
                  ).length
                }{" "}
                transacción(es) duplicada(s) detectada(s) y deshabilitada(s).
              </Text>
            )}
            <TransactionsTable
              data={tableData}
              isLoading={transactionExtract.isPending}
              duplicateKeys={duplicateKeys}
              onRowChange={handleUpdateRow}
              onRemoveRow={handleRemoveRow}
              onSeeDetailsRow={handleSeeDetailsRow}
              onDisabledRow={handleDisabledRow}
              onAdminCategories={adminCategories.onToggle}
              onAdminAccounts={adminAccounts.onToggle}
            />
          </>
        )}
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
