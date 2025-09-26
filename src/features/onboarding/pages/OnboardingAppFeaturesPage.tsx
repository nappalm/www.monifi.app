import { Logo, useAuthenticatedUser } from "@/shared";
import {
  Button,
  Card,
  CardBody,
  Container,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react";
import {
  IconBug,
  IconCash,
  IconChartPie,
  IconCreditCard,
  IconReceipt,
  IconSparkles,
} from "@tabler/icons-react";
import OnboardingAnimatedPage from "../components/OnboardingAnimatedPage";
import OnboardingGridDotted from "../components/OnboardingGridDotted";
import { useUpdateProfile } from "../hooks/useUpdateProfile";

export default function OnboardingAppFeaturesPage() {
  const { user } = useAuthenticatedUser();
  const updateProfile = useUpdateProfile();

  const handleGetStarted = () => {
    if (!user?.id) return;
    updateProfile.mutate(
      {
        uuid: user?.id,
        onboarding: true,
      },
      {
        onSuccess: () => {
          window.location.href = "/";
        },
      },
    );
  };

  return (
    <OnboardingAnimatedPage>
      <OnboardingGridDotted>
        <Container maxW="500px">
          <Stack align="center" justify="center" pt="30%">
            <Logo w="40px" h="40px" />
            <Heading variant="onboarding-title">You're all set!</Heading>
            <Text textAlign="center" color="gray.500" maxW="400px">
              Welcome aboard! You're now ready to take control of your finances.
              Dive in to track spending, create budgets, and gain insights into
              your financial habits. Happy budgeting!
            </Text>
            <br />
            <SimpleGrid columns={2} gap={2} w="full">
              <Card size="sm">
                <CardBody>
                  <HStack>
                    <IconReceipt />
                    <Text fontSize="sm">Transactions</Text>
                  </HStack>
                  <Text fontSize="sm" color="gray.500">
                    Easily track all your financial transactions in one place
                    for a clear overview.
                  </Text>
                </CardBody>
              </Card>
              <Card size="sm">
                <CardBody>
                  <HStack>
                    <IconChartPie />
                    <Text fontSize="sm">Statistics</Text>
                  </HStack>
                  <Text fontSize="xs" color="gray.500">
                    Visualize your spending habits and financial progress with
                    insightful charts and graphs.
                  </Text>
                </CardBody>
              </Card>
              <Card size="sm">
                <CardBody>
                  <HStack>
                    <IconCash />
                    <Text fontSize="sm">
                      Budgets
                      <Tag size="sm" colorScheme="cyan" ml={1}>
                        Soon
                      </Tag>
                    </Text>
                  </HStack>
                  <Text fontSize="xs" color="gray.500">
                    Create and manage budgets to stay on top of your spending
                    and achieve your financial goals.
                  </Text>
                </CardBody>
              </Card>
              <Card size="sm">
                <CardBody>
                  <HStack>
                    <IconBug />
                    <Text fontSize="sm">
                      Depts
                      <Tag size="sm" colorScheme="cyan" ml={1}>
                        Soon
                      </Tag>
                    </Text>
                  </HStack>
                  <Text fontSize="xs" color="gray.500">
                    Keep track of your debts and manage repayments effectively.
                  </Text>
                </CardBody>
              </Card>
              <Card size="sm">
                <CardBody>
                  <HStack>
                    <IconCreditCard />
                    <Text fontSize="sm">
                      Credit cards
                      <Tag size="sm" colorScheme="cyan" ml={1}>
                        Soon
                      </Tag>
                    </Text>
                  </HStack>
                  <Text fontSize="xs" color="gray.500">
                    Monitor your credit card spending and balances to maintain
                    financial health.
                  </Text>
                </CardBody>
              </Card>
              <Card size="sm">
                <CardBody>
                  <HStack>
                    <IconSparkles />
                    <Text fontSize="sm">
                      AI Support
                      <Tag size="sm" colorScheme="cyan" ml={1}>
                        Soon
                      </Tag>
                    </Text>
                  </HStack>
                  <Text fontSize="xs" color="gray.500">
                    Get personalized financial advice and insights from our AI
                    assistant.
                  </Text>
                </CardBody>
              </Card>
            </SimpleGrid>
            <Button
              colorScheme="cyan"
              w="full"
              variant="outline"
              onClick={handleGetStarted}
              isLoading={updateProfile.isPending}
            >
              Get started
            </Button>
          </Stack>
        </Container>
      </OnboardingGridDotted>
    </OnboardingAnimatedPage>
  );
}
