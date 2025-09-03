import { Button, Heading, HStack, IconButton, Stack } from "@chakra-ui/react";
import {
  IconArrowBarToDownDashed,
  IconCylinder,
  IconFilter2,
} from "@tabler/icons-react";
import TransactionsTable from "../components/TransactionsTable";

export default function TransactionsPage() {
  return (
    <Stack gap={5}>
      <Heading size="lg">Transactions</Heading>
      <HStack justifyContent="space-between">
        <HStack gap="1px">
          <IconButton
            aria-label="Filter"
            icon={<IconFilter2 size={16} />}
            size="sm"
            borderRightRadius={0}
          />
          <Button
            leftIcon={<IconCylinder size={16} />}
            size="sm"
            borderLeftRadius={0}
          >
            Jun to Ago 2025
          </Button>
        </HStack>
        <Button
          colorScheme="green"
          color="#000"
          size="sm"
          leftIcon={<IconArrowBarToDownDashed size={16} />}
        >
          New row
        </Button>
      </HStack>
      <TransactionsTable />
    </Stack>
  );
}
