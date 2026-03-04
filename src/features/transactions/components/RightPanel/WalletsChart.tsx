import { Tables } from "@/lib";
import { formatCurrency, useAccounts } from "@/shared";
import { HatchBar } from "@/shared/components/hatch-bar";
import { Grid, Text } from "@chakra-ui/react";
import { useMemo } from "react";

type Props = {
  transactions: Tables<"transactions">[];
};

export function WalletsChart({ transactions }: Props) {
  const { data: accounts } = useAccounts();

  const walletTotals = useMemo(() => {
    const enabled = transactions.filter((tx) => tx.enabled);

    const balances: Record<number, number> = {};
    for (const tx of enabled) {
      if (tx.account_id == null) continue;
      const delta = tx.type === "income" ? tx.amount : -tx.amount;
      balances[tx.account_id] = (balances[tx.account_id] || 0) + delta;
    }

    return (accounts ?? [])
      .map((account, i) => ({
        id: account.id,
        name: account.name,
        balance: balances[account.id] ?? 0,
        color: account.color ?? "var(--chakra-colors-gray-500)",
      }))
      .sort((a, b) => b.balance - a.balance);
  }, [transactions, accounts]);

  const maxBalance = Math.max(
    ...walletTotals.map((w) => Math.abs(w.balance)),
    1,
  );

  return (
    <Grid
      templateColumns="1fr auto 60px"
      gap={3}
      px={4}
      pb={4}
      alignItems="center"
    >
      {walletTotals.map((wallet) => (
        <>
          <Text key={`${wallet.id}-name`} noOfLines={1} fontSize="sm">
            {wallet.name}
          </Text>
          <Text
            key={`${wallet.id}-amount`}
            fontFamily="Geist Mono"
            textAlign="right"
            opacity={0.5}
            fontSize="sm"
          >
            {formatCurrency(wallet.balance)}
          </Text>
          <HatchBar
            key={`${wallet.id}-bar`}
            value={Math.abs(wallet.balance)}
            max={maxBalance}
            height="12px"
            color={wallet.color}
            isReverse
          />
        </>
      ))}
    </Grid>
  );
}
