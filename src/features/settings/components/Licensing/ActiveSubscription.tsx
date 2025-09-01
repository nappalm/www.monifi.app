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
  return (
    <Card size="sm">
      <CardHeader>
        <HStack justify="space-between">
          <HStack gap={3} alignItems="flex-start">
            <IconDiamondFilled />
            <Stack gap={0}>
              <Text fontWeight="bold">Github Copilot</Text>
              <Text color="gray.500">Your AI pair programmer</Text>
            </Stack>
          </HStack>
          {activeSubscriptionName === FREE_PLAN && (
            <Button colorScheme="blue" size="sm" onClick={onUpgrade}>
              Upgrade plan
            </Button>
          )}
        </HStack>
      </CardHeader>
      <CardBody>
        <Stack gap={0}>
          <Text fontWeight="bold">Active subscription</Text>
          <Text>{activeSubscriptionName ?? FREE_PLAN}</Text>
        </Stack>
      </CardBody>
      {activeSubscriptionName !== FREE_PLAN && (
        <CardFooter>
          <Text>
            You can cancel your subscription at any time.
            <Text
              as="span"
              color="blue.500"
              mx={1}
              cursor="pointer"
              onClick={onCancel}
              _hover={{
                textDecoration: "underline",
              }}
            >
              Click here{" "}
            </Text>
            for more details on the process
          </Text>
        </CardFooter>
      )}
    </Card>
  );
}
