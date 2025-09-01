import { useAuthenticatedUser } from "@/shared";
import {
  Alert,
  AlertIcon,
  Heading,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useMemo } from "react";
import ActiveSubscription from "../components/licensing/ActiveSubscription";
import CancellationDrawer from "../components/licensing/CancellationDrawer";
import FreePlanDetails from "../components/licensing/FreePlanDetails";
import UpgradePlanDrawer from "../components/licensing/UpgradePlanDrawer";

import {
  useStripeCreateSubscription,
  useStripePaymentMethods,
  useStripeProducts,
  useStripeSubscriptionCancellation,
} from "../hooks/useStripe";
import { OnUpgrade } from "../utils/types";

export default function LicensingPage() {
  const { profile } = useAuthenticatedUser();

  const products = useStripeProducts();
  const paymentMethods = useStripePaymentMethods();
  const createSubscription = useStripeCreateSubscription();
  const cancelSubscription = useStripeSubscriptionCancellation();

  const upgradePlanDrawer = useDisclosure();
  const cancellationDrawer = useDisclosure();

  useEffect(() => {
    if (createSubscription.isSuccess) upgradePlanDrawer.onClose();
    if (cancelSubscription.isSuccess) cancellationDrawer.onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createSubscription.isSuccess, cancelSubscription.isSuccess]);

  const productProDetail = useMemo(() => {
    if (!products.data) return null;
    return products.data.find((item) => item.id === "prod_SrouXqUzX8ZqXt");
  }, [products]);

  const handleUpgradePlan = (values: OnUpgrade) => {
    createSubscription.mutate(values);
  };

  const handleCancelPlan = () => {
    cancelSubscription.mutate();
  };

  return (
    <Stack>
      <Heading fontWeight={500} size="lg">
        Licensing
      </Heading>

      {products.isError && (
        <Alert status="error">
          <AlertIcon />
          {products.error.message}
        </Alert>
      )}

      <ActiveSubscription
        onUpgrade={upgradePlanDrawer.onOpen}
        onCancel={cancellationDrawer.onOpen}
        activeSubscriptionName={profile?.subscription}
      />

      <FreePlanDetails />

      <UpgradePlanDrawer
        {...upgradePlanDrawer}
        paymentMethods={paymentMethods.data ?? []}
        productDetail={productProDetail}
        onUpgrade={handleUpgradePlan}
        isLoading={createSubscription.isPending}
        isError={createSubscription.isError}
        error={createSubscription.error?.message}
      />

      <CancellationDrawer
        {...cancellationDrawer}
        productDetail={productProDetail}
        onCancel={handleCancelPlan}
        isLoading={cancelSubscription.isPending}
        isError={cancelSubscription.isError}
        error={cancelSubscription.error?.message}
      />
    </Stack>
  );
}
