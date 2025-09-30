import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import { IconDiamondFilled } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

type Props = {
  activeSubscriptionName?: string | null;
  onUpgrade: VoidFunction;
  onCancel: VoidFunction;
};

const FREE_PLAN = "FREE";
export default function ActiveSubscription({
  onUpgrade,
  onCancel,
  activeSubscriptionName = FREE_PLAN,
}: Props) {
  const { t } = useTranslation();
  return (
    <Card size="sm">
      <CardHeader>
        <HStack justify="space-between">
          <HStack gap={3} alignItems="flex-start">
            <IconDiamondFilled />
            <Stack gap={0}>
              <Text fontWeight="bold">
                {t("settings.licensing.proPlan.title")}
              </Text>
              <Text color="gray.500">
                {t("settings.licensing.proPlan.description")}
              </Text>
            </Stack>
          </HStack>
          {activeSubscriptionName === FREE_PLAN && (
            <Button colorScheme="cyan" size="sm" onClick={onUpgrade}>
              {t("settings.licensing.upgradePlan")}
            </Button>
          )}
        </HStack>
      </CardHeader>
      <CardBody>
        <Stack gap={0}>
          <Text fontWeight="bold">
            {t("settings.licensing.activeSubscription")}
          </Text>
          <Text>{activeSubscriptionName ?? FREE_PLAN}</Text>
        </Stack>
      </CardBody>
      {activeSubscriptionName !== FREE_PLAN && (
        <CardFooter>
          <Text>
            {t("settings.licensing.cancelInfo")}
            <Text
              as="span"
              color="cyan.500"
              mx={1}
              cursor="pointer"
              onClick={onCancel}
              _hover={{
                textDecoration: "underline",
              }}
            >
              {t("settings.licensing.clickHere")}{" "}
            </Text>
            {t("settings.licensing.cancelDetails")}
          </Text>
        </CardFooter>
      )}
    </Card>
  );
}
