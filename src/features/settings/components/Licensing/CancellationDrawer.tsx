import {
  Alert,
  AlertIcon,
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Stack,
  Switch,
  Text,
  UseDisclosureProps,
} from "@chakra-ui/react";

import { StripeProduct } from "@/lib";
import { useState } from "react";

type Props = {
  isLoading?: boolean;
  productDetail?: StripeProduct | null;
  onCancel: VoidFunction;
  isError?: boolean;
  error?: string | null;
} & UseDisclosureProps;

export default function CancellationDrawer({
  isOpen = false,
  isLoading = false,
  onClose,
  onCancel,
  productDetail,
  isError = false,
  error = null,
}: Props) {
  const [confirmCancel, setConfirmCancel] = useState(false);

  return (
    <Drawer isOpen={isOpen} onClose={() => onClose?.()} size="sm">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Subscription cancelled</DrawerHeader>
        <DrawerBody>
          <Stack>
            {isError && (
              <Alert status="error">
                <AlertIcon />
                {error}
              </Alert>
            )}
            <Card size="sm" variant="solid">
              <CardHeader>
                <Text>
                  If you cancel, you will immediately lose access to all premium
                  features included in your current {productDetail?.name} plan
                </Text>
              </CardHeader>
              <CardBody>
                <Stack>
                  <HStack>
                    <Stack gap={0}>
                      <Text>Continue as a FREE member</Text>
                      <Text color="gray.500">
                        You will still get to access all features under the free
                        tier
                      </Text>
                    </Stack>

                    <Switch isChecked isReadOnly />
                  </HStack>
                </Stack>
              </CardBody>
            </Card>
          </Stack>
        </DrawerBody>
        <DrawerFooter>
          <Stack w="full" gap={2}>
            <Checkbox
              color="red.500"
              colorScheme="red"
              onChange={(e) => setConfirmCancel(e.target.checked)}
            >
              I confirm that I want to cancel my {productDetail?.name} plan
            </Checkbox>
            <Button
              onClick={onCancel}
              colorScheme="red"
              isLoading={isLoading}
              isDisabled={!confirmCancel}
            >
              Done
            </Button>
          </Stack>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
