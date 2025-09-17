import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  UseDisclosureProps,
} from "@chakra-ui/react";
import { Tables } from "@/lib/supabase/database.types";

type DetailsDrawerProps = UseDisclosureProps & {
  transaction: Tables<"transactions"> | null;
};

export const DetailsDrawer = ({
  isOpen = false,
  onClose,
  transaction,
}: DetailsDrawerProps) => {
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={() => onClose?.()}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Transaction Details</DrawerHeader>

        <DrawerBody>
          {transaction ? (
            <>
              <p>Transaction ID: {transaction.id}</p>
              <p>Amount: ${transaction.amount}</p>
              <p>Date: {transaction.occurred_at}</p>
              <p>Description: {transaction.description}</p>
            </>
          ) : (
            <p>No transaction details available.</p>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
