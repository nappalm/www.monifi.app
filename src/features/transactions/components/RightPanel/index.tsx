import { Tables } from "@/lib";
import { Stack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { CategoryGrid } from "./CategoryGrid";
import ExpensesChart from "./ExpensesChart";
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
      <Stack flexShrink={0}>
        <SectionLabel px={2} pt={2}>
          {t("transactions.summary.balance")}
        </SectionLabel>
        <ExpensesChart transactions={transactions} />
      </Stack>
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
