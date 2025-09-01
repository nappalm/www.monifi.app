import {
  Alert,
  AlertIcon,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  HStack,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { IconInfoCircle } from "@tabler/icons-react";
import PaymentInformationDrawer from "../components/payment-information/PaymentInformationDrawer";
import PaymentMethodsTable from "../components/payment-information/PaymentMethodsTable";
import {
  useStripeCreatePaymentMethod,
  useStripePaymentMethods,
  useStripeRemovePaymentMethod,
} from "../hooks/useStripe";

export default function PaymentInformation() {
  const newPaymentMethodDrawer = useDisclosure();
  const paymentMethods = useStripePaymentMethods();
  const removePaymentMethod = useStripeRemovePaymentMethod();
  const createPaymentMethod = useStripeCreatePaymentMethod();

  const handleAddPaymentMethod = (paymentMethodId: string) => {
    createPaymentMethod.mutate(
      { paymentMethodId },
      {
        onSuccess: () => {
          newPaymentMethodDrawer.onClose();
        },
      },
    );
  };

  return (
    <Stack>
      <Heading fontWeight={500} size="lg">
        Payment Information
      </Heading>

      {removePaymentMethod.isError && (
        <Alert status="error">
          <AlertIcon />
          {removePaymentMethod.error.message}
        </Alert>
      )}
      {createPaymentMethod.isError && (
        <Alert status="error">
          <AlertIcon />
          {createPaymentMethod.error.message}
        </Alert>
      )}

      <Card>
        <CardHeader>
          <HStack align="flex-start">
            <IconInfoCircle style={{ flexShrink: 0 }} />
            <Stack gap={0}>
              <Text fontWeight="bold">Additional information</Text>
              <Text color="gray.500">
                Add payment details to your receipts, such as the cardholder’s
                name, card type, or the last four digits of the payment card
                used. This information will automatically appear on every
                receipt to make tracking your purchases easier.
              </Text>
            </Stack>
          </HStack>
        </CardHeader>
        <CardBody>
          <Button
            size="sm"
            colorScheme="blue"
            onClick={newPaymentMethodDrawer.onOpen}
          >
            Ad new payment method
          </Button>
        </CardBody>
      </Card>

      <PaymentMethodsTable
        isLoading={paymentMethods.isFetching}
        data={paymentMethods.data ?? []}
        onRemove={removePaymentMethod.mutate}
        deletingIds={removePaymentMethod.pendingPaymentIdsDeletion}
      />

      <PaymentInformationDrawer
        {...newPaymentMethodDrawer}
        onAdd={handleAddPaymentMethod}
        isLoading={createPaymentMethod.isPending}
        error={createPaymentMethod.error?.message}
        isError={createPaymentMethod.isError}
      />
    </Stack>
  );
}
