import { PaymentMethod } from "@stripe/stripe-js";
import {
  Card,
  CardBody,
  CardFooter,
  HStack,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";
import { IconCreditCard } from "@tabler/icons-react";
import { StripeProduct } from "@/lib";
import { formatCurrency } from "@/shared";

type Props = {
  paymentMethods: PaymentMethod[];
  productDetail?: StripeProduct | null;
  onPaymentMethodChange: (id: string) => void;
};

export default function PaymentMethods({
  paymentMethods,
  productDetail,
  onPaymentMethodChange,
}: Props) {
  return (
    <Card size="sm" variant="solid">
      <CardBody>
        <Stack>
          <Text>Select a payment method:</Text>
          {paymentMethods.length > 0 && (
            <RadioGroup
              name="card"
              onChange={(value) => onPaymentMethodChange(value)}
            >
              <Stack>
                {paymentMethods.map((paymentMethod) => (
                  <Radio value={paymentMethod.id} key={paymentMethod.id}>
                    <HStack>
                      <IconCreditCard size={18} />
                      <Text fontSize="sm">
                        {paymentMethod.card?.brand.toUpperCase()} ****
                        {paymentMethod.card?.last4}
                      </Text>
                    </HStack>
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
          )}
        </Stack>
      </CardBody>
      <CardFooter>
        <HStack justify="space-between" w="full" align="flex-start" gap={5}>
          <Stack>
            <Text fontWeight="bold" color="blue.500">
              {productDetail?.name}
            </Text>
            {productDetail?.description && (
              <Text
                fontSize="sm"
                color="gray.500"
                noOfLines={2}
                title={productDetail?.description}
              >
                {productDetail?.description}
              </Text>
            )}
          </Stack>
          <HStack>
            <Text>
              {formatCurrency(
                productDetail?.price.unit_amount ?? 0,
                productDetail?.price.currency ?? "usd",
              )}
            </Text>
            <Text>{productDetail?.price.currency.toUpperCase()}</Text>
          </HStack>
        </HStack>
      </CardFooter>
    </Card>
  );
}
