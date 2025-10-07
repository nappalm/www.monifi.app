import { LICENSING_PRO_FEATURES } from "@/shared/utils/licensing";
import {
  Alert,
  AlertIcon,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Link,
  List,
  ListItem,
  Stack,
  Text,
  UseDisclosureProps,
} from "@chakra-ui/react";
import { PaymentMethod } from "@stripe/stripe-js";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import { SETTINGS_PATHS } from "../../router";

import { StripeProduct } from "@/lib";
import { OnUpgrade } from "../../utils/types";
import LicensingFeatureIcon from "./LicensingFeatureIcon";
import PaymentMethods from "./PaymentMethods";

type Props = {
  isLoading?: boolean;
  paymentMethods?: PaymentMethod[];
  productDetail?: StripeProduct | null;
  onUpgrade?: (values: OnUpgrade) => void;
  isError?: boolean;
  error?: string | null;
} & UseDisclosureProps;

export default function UpgradePlanDrawer({
  isOpen = false,
  isLoading = false,
  onClose,
  onUpgrade,
  paymentMethods = [],
  productDetail,
  isError = false,
  error = null,
}: Props) {
  const { t } = useTranslation();
  const [paymentMethodId, setPaymentMethodId] = useState<string | null>(null);

  const handleUpgrade = () => {
    if (!paymentMethodId || !productDetail) return;

    onUpgrade?.({
      paymentMethodId,
      priceId: productDetail.price.id,
    });
  };

  return (
    <Drawer isOpen={isOpen} onClose={() => onClose?.()} size="sm">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>
          {t("settings.licensing.upgradeDrawer.title")}
        </DrawerHeader>
        <DrawerBody>
          <List spacing={2}>
            {LICENSING_PRO_FEATURES.map((item) => (
              <ListItem key={item.labelKey}>
                <LicensingFeatureIcon type={item.type} color="cyan.500" />
                {t(item.labelKey)}
              </ListItem>
            ))}
          </List>
        </DrawerBody>
        <DrawerFooter>
          <Stack w="full">
            {isError && (
              <Alert status="error">
                <AlertIcon />
                {error}
              </Alert>
            )}
            {paymentMethods.length > 0 && (
              <PaymentMethods
                paymentMethods={paymentMethods}
                productDetail={productDetail}
                onPaymentMethodChange={setPaymentMethodId}
              />
            )}
            <Text fontSize="sm">
              {t("settings.licensing.upgradeDrawer.noPaymentMethod")}
              <Link
                as={RouterLink}
                to={SETTINGS_PATHS.paymentInformation}
                color="cyan.500"
                ml={1}
              >
                <Text as="span">
                  {t("settings.licensing.upgradeDrawer.addPaymentMethod")}
                </Text>
              </Link>
            </Text>

            <Button
              w="full"
              colorScheme="cyan"
              isDisabled={!paymentMethodId}
              onClick={handleUpgrade}
              isLoading={isLoading}
            >
              {t("settings.licensing.upgradeDrawer.upgradeButton")}
            </Button>
          </Stack>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
