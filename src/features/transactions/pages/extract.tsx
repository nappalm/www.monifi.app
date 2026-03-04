import { useGlobalUI } from "@/lib/global-ui";
import { Tables } from "@/lib/supabase/database.types";
import { AccountsDrawer, CategoriesDrawer, HatchBar } from "@/shared";
import {
  Badge,
  Button,
  Card,
  CardBody,
  HStack,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { Box as BoxIcon } from "pixelarticons/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const transactionExtract = useTransactionExtract();
  const createBulkTransactions = useCreateBulkTransactions();

  const { alert } = useGlobalUI();
  const adminCategories = useDisclosure();
  const adminAccounts = useDisclosure();

  const [tableData, setTableData] = useState<Tables<"transactions">[]>([]);
  const [detailsRow, setDetailsRow] = useState<Tables<"transactions"> | null>(
    null,
  );
  const [duplicateKeys, setDuplicateKeys] = useState<Set<string>>(new Set());
  const [isPanelReady, setIsPanelReady] = useState(false);

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

    setIsPanelReady(false);
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

  useEffect(() => {
    if (tableData.length > 0) setIsPanelReady(true);
  }, [tableData.length]);

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

  const doSave = () => {
    const request = tableData.map(({ id, ...rest }) => rest);
    createBulkTransactions.mutate(request);
  };

  const handleSave = () => {
    const warnings: string[] = [];
    if (duplicateCount > 0)
      warnings.push(t("transactions.extract.saveAlert.duplicateWarning", { count: duplicateCount }));
    if (uncategorizedCount > 0)
      warnings.push(t("transactions.extract.saveAlert.uncategorizedWarning", { count: uncategorizedCount }));
    if (noAccountCount > 0)
      warnings.push(t("transactions.extract.saveAlert.noAccountWarning", { count: noAccountCount }));

    if (warnings.length > 0) {
      alert.onOpen({
        title: t("transactions.extract.saveAlert.title"),
        description: warnings.join(" · "),
        colorScheme: "orange",
        onOk: doSave,
      });
    } else {
      doSave();
    }
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

  const totalRows = tableData.length;

  const duplicateCount = useMemo(
    () =>
      tableData.filter((t) => duplicateKeys.has(getTransactionKey(t))).length,
    [tableData, duplicateKeys],
  );

  const uncategorizedCount = useMemo(
    () => tableData.filter((t) => t.category_id === null).length,
    [tableData],
  );

  const noAccountCount = useMemo(
    () => tableData.filter((t) => t.account_id === null).length,
    [tableData],
  );

  return (
    <HStack align="stretch" overflow="hidden" gap={1}>
      <DetailsDrawer
        isOpen={!!detailsRow}
        onClose={() => setDetailsRow(null)}
        transaction={detailsRow}
      />
      <CategoriesDrawer {...adminCategories} />
      <AccountsDrawer {...adminAccounts} />

      <AnimatePresence>
        {isPanelReady && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 300 }}
            exit={{ width: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: "hidden", flexShrink: 0, display: "flex" }}
          >
            <Stack justify="space-between" w="300px" minW="300px">
              <Stack gap={1} pl={1} pt={1}>
                <Card variant="solid">
                  <CardBody>
                    <HStack gap={5}>
                      <BoxIcon />
                      <Stack gap={0}>
                        <Text fontFamily="Geist Mono">
                          {transactionExtract.data?.filename ?? t("transactions.extract.filename")}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          {t("transactions.extract.rows", { count: totalRows })}
                        </Text>
                      </Stack>
                    </HStack>
                  </CardBody>
                </Card>
                <Card>
                  <CardBody>
                    <Stack>
                      <Text fontFamily="Geist Mono" textTransform="uppercase">
                        {t("transactions.extract.duplicateRows.label")}
                      </Text>
                      <HStack>
                        <HatchBar value={duplicateCount} max={totalRows} />
                        <Badge
                          colorScheme={duplicateCount > 0 ? "orange" : "teal"}
                        >
                          {t("transactions.extract.rows", { count: duplicateCount })}
                        </Badge>
                      </HStack>
                      <Text color="gray.500" fontSize="xs">
                        {t("transactions.extract.duplicateRows.description")}
                      </Text>
                    </Stack>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody>
                    <Stack>
                      <Text fontFamily="Geist Mono" textTransform="uppercase">
                        {t("transactions.extract.uncategorizedRows.label")}
                      </Text>
                      <HStack>
                        <HatchBar value={uncategorizedCount} max={totalRows} />
                        <Badge
                          colorScheme={
                            uncategorizedCount > 0 ? "orange" : "teal"
                          }
                        >
                          {t("transactions.extract.rows", { count: uncategorizedCount })}
                        </Badge>
                      </HStack>
                      <Text color="gray.500" fontSize="xs">
                        {t("transactions.extract.uncategorizedRows.description")}
                      </Text>
                    </Stack>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody>
                    <Stack>
                      <Text fontFamily="Geist Mono" textTransform="uppercase">
                        {t("transactions.extract.noAccountRows.label")}
                      </Text>
                      <HStack>
                        <HatchBar value={noAccountCount} max={totalRows} />
                        <Badge
                          colorScheme={noAccountCount > 0 ? "orange" : "teal"}
                        >
                          {t("transactions.extract.rows", { count: noAccountCount })}
                        </Badge>
                      </HStack>
                      <Text color="gray.500" fontSize="xs">
                        {t("transactions.extract.noAccountRows.description")}
                      </Text>
                    </Stack>
                  </CardBody>
                </Card>
                <Button
                  variant="solid"
                  colorScheme="teal"
                  m={1}
                  onClick={handleSave}
                >
                  {t("transactions.extract.saveButton")}
                </Button>
              </Stack>
              <Stack p={5}>
                <Text color="gray.500" fontSize="sm">
                  {t("transactions.extract.saveInfo")}
                </Text>
              </Stack>
            </Stack>
          </motion.div>
        )}
      </AnimatePresence>
      <Stack flex={1} minW={0}>
        <TransactionsTable
          data={tableData}
          isLoading={transactionExtract.isPending}
          onRowChange={handleUpdateRow}
          onRemoveRow={handleRemoveRow}
          onSeeDetailsRow={handleSeeDetailsRow}
          onDisabledRow={handleDisabledRow}
          onAdminCategories={adminCategories.onToggle}
          onAdminAccounts={adminAccounts.onToggle}
          height="calc(100vh - 45px)"
          emptyState={
            <LoadFilePC
              onContinue={handleExtract}
              isLoading={transactionExtract.isPending}
            />
          }
        />
      </Stack>
    </HStack>
  );
}
