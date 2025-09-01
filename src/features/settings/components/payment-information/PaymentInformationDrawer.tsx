import { stripeClient } from "@/lib";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  UseDisclosureProps,
} from "@chakra-ui/react";
import { Elements } from "@stripe/react-stripe-js";
import PaymentMethodForm from "./PaymentMethodForm";

type PaymentInformationDrawerProps = {
  onAdd: (paymentMethodId: string) => void;
  isLoading: boolean;
  error?: string | null;
  isError: boolean;
} & UseDisclosureProps;

export default function PaymentInformationDrawer({
  isOpen = false,
  onClose,
  onAdd,
  isLoading,
  error,
  isError,
}: PaymentInformationDrawerProps) {
  return (
    <>
      <Drawer isOpen={isOpen} onClose={() => onClose?.()} size="sm">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Add new payment method</DrawerHeader>
          <DrawerBody>
            <Elements stripe={stripeClient}>
              <PaymentMethodForm
                onAdd={onAdd}
                isLoading={isLoading}
                error={error}
                isError={isError}
              />
            </Elements>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
