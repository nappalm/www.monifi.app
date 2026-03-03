import { Tables } from "@/lib";
import { Divider, Stack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import ExpensesChart from "./ExpensesChart";
import { CategoryGrid } from "./CategoryGrid";
import { SectionLabel } from "./SectionLabel";
import { UploadCard } from "./UploadCard";

type Props = {
  transactions: Tables<"transactions">[];
};

export default function RightPanel({ transactions = [] }: Props) {
  const { t } = useTranslation();

  return (
    <Stack
      h="full"
      borderLeft="1px solid"
      borderColor="gray.800"
      overflow="hidden"
      gap={0}
    >
      <Stack p={4} flexShrink={0}>
        <SectionLabel>{t("transactions.summary.balance")}</SectionLabel>
        <ExpensesChart transactions={transactions} />
      </Stack>

      <Divider borderColor="gray.800" />

      <Stack gap={0} flex={1} overflow="hidden">
        <Stack px={4} pt={4} pb={2} flexShrink={0}>
          <SectionLabel>
            {t("statistics.charts.spendingByCategory")}
          </SectionLabel>
        </Stack>
        <CategoryGrid transactions={transactions} />
      </Stack>

      <UploadCard />
    </Stack>
  );
}
