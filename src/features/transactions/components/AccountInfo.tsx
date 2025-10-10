import { Tables } from "@/lib";
import _colors from "@/lib/chakra-ui/_colors";
import { formatCurrency, useAccounts, useAuthenticatedUser } from "@/shared";
import {
  Card,
  CardBody,
  HStack,
  IconButton,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  IconChevronLeft,
  IconChevronRight,
  IconWallet,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { isEmpty } from "lodash";
import { useMemo, useState } from "react";

type Props = {
  transactions: Tables<"transactions">[];
};

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
  }),
};

export default function AccountInfo({ transactions }: Props) {
  const { data: accounts } = useAccounts();
  const { profile } = useAuthenticatedUser();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const accountsWithTotals = useMemo(() => {
    if (!accounts || !transactions) return [];

    const accountTotals = transactions.reduce(
      (acc, transaction) => {
        if (transaction.account_id) {
          if (transaction.type === "income") {
            acc[transaction.account_id] =
              (acc[transaction.account_id] || 0) + transaction.amount;
          } else {
            acc[transaction.account_id] =
              (acc[transaction.account_id] || 0) - transaction.amount;
          }
        }
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(accountTotals)
      .map(([accountId, total]) => {
        const account = accounts.find((a) => a.id === parseInt(accountId, 10));
        return {
          id: accountId,
          name: account?.name || "Unknown",
          total,
        };
      })
      .sort((a, b) => b.total - a.total);
  }, [accounts, transactions]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % accountsWithTotals.length);
  };

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentIndex(
      (prev) =>
        (prev - 1 + accountsWithTotals.length) % accountsWithTotals.length,
    );
  };

  const currentAccount = accountsWithTotals[currentIndex];

  if (isEmpty(accountsWithTotals)) return null;
  return (
    <Card size="sm">
      <CardBody>
        <HStack justify="space-between">
          <IconButton
            aria-label="Previous Account"
            icon={<IconChevronLeft size={18} />}
            size="sm"
            ml={-2}
            variant="ghost"
            onClick={handlePrevious}
            isDisabled={accountsWithTotals.length <= 1}
          />
          <Stack position="relative" w="full" h="40px" overflow="hidden">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                style={{ position: "absolute", width: "100%" }}
              >
                {currentAccount && (
                  <HStack gap={3} w="full">
                    <IconWallet style={{ color: _colors.gray[500] }} />
                    <Stack gap={0}>
                      <Text>{currentAccount.name}</Text>
                      <Text fontFamily="Roboto Mono" fontSize="xs">
                        {formatCurrency(currentAccount.total, profile?.currency)}
                      </Text>
                    </Stack>
                  </HStack>
                )}
              </motion.div>
            </AnimatePresence>
          </Stack>
          <IconButton
            aria-label="Next Account"
            icon={<IconChevronRight size={18} />}
            size="sm"
            mr={-2}
            variant="ghost"
            onClick={handleNext}
            isDisabled={accountsWithTotals.length <= 1}
          />
        </HStack>
      </CardBody>
    </Card>
  );
}
