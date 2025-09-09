import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  UseDisclosureProps,
} from "@chakra-ui/react";

type DetailsDrawerProps = UseDisclosureProps & {
  // transaction: Transaction; // Assuming you have a Transaction type
};

export const DetailsDrawer = ({
  isOpen = false,
  onClose,
}: DetailsDrawerProps) => {
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={() => onClose?.()}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Transaction Details</DrawerHeader>

        <DrawerBody>
          {/* Add transaction details here */}
          <p>Transaction ID: 12345</p>
          <p>Amount: $100.00</p>
          <p>Date: 2025-09-08</p>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
