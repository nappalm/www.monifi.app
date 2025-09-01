import _colors from "@/lib/chakra-ui/_colors";
import {
  Alert,
  AlertIcon,
  Button,
  Card,
  CardBody,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

type PaymentMethodFormProps = {
  onAdd: (paymentMethodId: string) => void;
  isLoading: boolean;
  error?: string | null;
  isError: boolean;
};

export default function PaymentMethodForm({
  onAdd,
  isLoading,
  error,
  isError,
}: PaymentMethodFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [formError, setFormError] = useState<string | null>(null);
  const [isCardComplete, setIsCardComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const combinedIsLoading = isSubmitting || isLoading;
  const activeError = useMemo(() => formError || error, [formError, error]);
  const hasError = isError || Boolean(formError);

  useEffect(() => {
    if (error) {
      setFormError(error);
      setIsSubmitting(false);
    }
  }, [error]);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!stripe || !elements || !isCardComplete) return;

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) return;

      setFormError(null);
      setIsSubmitting(true);

      const { error: stripeError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
        });

      if (stripeError) {
        setFormError(stripeError.message ?? "An unknown error occurred");
        setIsSubmitting(false);
        return;
      }

      if (paymentMethod) {
        onAdd(paymentMethod.id);
      } else {
        setIsSubmitting(false);
      }
    },
    [stripe, elements, isCardComplete, onAdd],
  );

  const color = useColorModeValue("#000", "#fff");
  const placeholderColor = useColorModeValue("#00000080", "#ffffff80");

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <Stack>
        <Text as="label" htmlFor="card-element">
          Credit or debit card
        </Text>

        <Card>
          <CardBody>
            <CardElement
              id="card-element"
              onReady={(el) => el.focus()}
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color,
                    "::placeholder": { color: placeholderColor },
                  },
                  invalid: {
                    color: _colors.red[500],
                    iconColor: _colors.red[500],
                  },
                },
              }}
              onChange={(e) => {
                setFormError(e.error?.message ?? null);
                setIsCardComplete(e.complete);
              }}
            />
          </CardBody>
        </Card>

        {hasError && activeError && (
          <Alert status="error">
            <AlertIcon />
            {activeError}
          </Alert>
        )}

        <Button
          type="submit"
          isDisabled={!stripe || combinedIsLoading || !isCardComplete}
          isLoading={combinedIsLoading}
          colorScheme="blue"
        >
          Add payment method
        </Button>
      </Stack>
    </form>
  );
}
