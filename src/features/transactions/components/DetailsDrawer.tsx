import { Tables } from "@/lib/supabase/database.types";
import { formatCurrency, formatDate } from "@/shared";
import { useAccounts, useCategories } from "@/shared/hooks";
import {
  Box,
  Card,
  CardBody,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  Stack,
  Text,
  UseDisclosureProps,
} from "@chakra-ui/react";
import { IconChevronsDown, IconChevronsUp } from "@tabler/icons-react";

type DetailsDrawerProps = UseDisclosureProps & {
  transaction: Tables<"transactions"> | null;
};

export const DetailsDrawer = ({
  isOpen = false,
  onClose,
  transaction,
}: DetailsDrawerProps) => {
  const { data: accounts } = useAccounts();
  const { data: categories } = useCategories();

  const account = accounts?.find((acc) => acc.id === transaction?.account_id);
  const category = categories?.find(
    (cat) => cat.id === transaction?.category_id,
  );

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={() => onClose?.()}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Transaction details</DrawerHeader>

        <DrawerBody>
          {transaction ? (
            <Stack gap={1}>
              <Card size="sm" variant="solid" mb={2}>
                <CardBody>
                  <HStack w="full" justify="space-between">
                    <Stack
                      align="center"
                      justify="center"
                      borderRadius="full"
                      w="40px"
                      h="40px"
                      bg={
                        transaction.type === "income" ? "green.800" : "red.800"
                      }
                      color={
                        transaction.type === "income" ? "green.500" : "red.500"
                      }
                    >
                      {transaction.type === "income" ? (
                        <IconChevronsUp size={16} />
                      ) : (
                        <IconChevronsDown size={16} />
                      )}
                    </Stack>
                    <Stack gap={0} align="flex-end">
                      <Text fontSize="md" fontWeight="bold">
                        {formatCurrency(transaction.amount, "USD")}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        Amount
                      </Text>
                    </Stack>
                  </HStack>
                </CardBody>
              </Card>
              <Flex justify="space-between" align="center">
                <Text fontSize="sm" fontWeight="bold">
                  Account
                </Text>
                <Text fontSize="sm">{account?.name ?? "Unknown"}</Text>
              </Flex>
              <Flex justify="space-between" align="center">
                <Text fontSize="sm" fontWeight="bold">
                  Category
                </Text>
                <Text fontSize="sm">{category?.name ?? "Unknown"}</Text>
              </Flex>
              <Flex justify="space-between" align="center">
                <Text fontSize="sm" fontWeight="bold">
                  Date
                </Text>
                <Text fontSize="sm">{formatDate(transaction.occurred_at)}</Text>
              </Flex>
              <Box mt={4}>
                <Text fontSize="sm" fontWeight="bold" mb={2}>
                  Description
                </Text>
                <Text fontSize="md">{transaction.description}</Text>
              </Box>
            </Stack>
          ) : (
            <Text>No transaction details available.</Text>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
