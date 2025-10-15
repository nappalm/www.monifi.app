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
import { useTranslation } from "react-i18next";
import OnboardingAnimatedPage from "../components/OnboardingAnimatedPage";
import OnboardingGridDotted from "../components/OnboardingGridDotted";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import BackButton from "../components/BackButton";
import { useNavigate } from "react-router-dom";
import { ONBOARDING_PATHS } from "../router";

export default function OnboardingAppFeaturesPage() {
  const { t } = useTranslation();
  const { user } = useAuthenticatedUser();
  const navigate = useNavigate();

  const updateProfile = useUpdateProfile();

  const handleGetStarted = () => {
    if (!user?.id) return;
    updateProfile.mutate(
      {
        id: user?.id,
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
    <>
      <BackButton
        total={5}
        step={5}
        onClick={() => navigate(ONBOARDING_PATHS.categories)}
      />
      <OnboardingAnimatedPage>
        <OnboardingGridDotted>
          <Container maxW="500px">
            <Stack align="center" justify="center" pt="30%">
              <Logo w="40px" h="40px" />
              <Heading variant="onboarding-title">
                {t("onboarding.appFeatures.title")}
              </Heading>
              <Text textAlign="center" color="gray.500" maxW="400px">
                {t("onboarding.appFeatures.description")}
              </Text>
              <br />
              <SimpleGrid columns={2} gap={2} w="full">
                <Card size="sm">
                  <CardBody>
                    <HStack>
                      <IconReceipt />
                      <Text fontSize="sm">
                        {t(
                          "onboarding.appFeatures.features.transactions.title",
                        )}
                      </Text>
                    </HStack>
                    <Text fontSize="sm" color="gray.500">
                      {t(
                        "onboarding.appFeatures.features.transactions.description",
                      )}
                    </Text>
                  </CardBody>
                </Card>
                <Card size="sm">
                  <CardBody>
                    <HStack>
                      <IconChartPie />
                      <Text fontSize="sm">
                        {t("onboarding.appFeatures.features.statistics.title")}
                      </Text>
                    </HStack>
                    <Text fontSize="xs" color="gray.500">
                      {t(
                        "onboarding.appFeatures.features.statistics.description",
                      )}
                    </Text>
                  </CardBody>
                </Card>
                <Card size="sm">
                  <CardBody>
                    <HStack>
                      <IconCash />
                      <Text fontSize="sm">
                        {t("onboarding.appFeatures.features.budgets.title")}
                        <Tag size="sm" colorScheme="cyan" ml={1}>
                          {t("common.soon")}
                        </Tag>
                      </Text>
                    </HStack>
                    <Text fontSize="xs" color="gray.500">
                      {t("onboarding.appFeatures.features.budgets.description")}
                    </Text>
                  </CardBody>
                </Card>
                <Card size="sm">
                  <CardBody>
                    <HStack>
                      <IconBug />
                      <Text fontSize="sm">
                        {t("onboarding.appFeatures.features.debts.title")}
                        <Tag size="sm" colorScheme="cyan" ml={1}>
                          {t("common.soon")}
                        </Tag>
                      </Text>
                    </HStack>
                    <Text fontSize="xs" color="gray.500">
                      {t("onboarding.appFeatures.features.debts.description")}
                    </Text>
                  </CardBody>
                </Card>
                <Card size="sm">
                  <CardBody>
                    <HStack>
                      <IconCreditCard />
                      <Text fontSize="sm">
                        {t("onboarding.appFeatures.features.creditCards.title")}
                        <Tag size="sm" colorScheme="cyan" ml={1}>
                          {t("common.soon")}
                        </Tag>
                      </Text>
                    </HStack>
                    <Text fontSize="xs" color="gray.500">
                      {t(
                        "onboarding.appFeatures.features.creditCards.description",
                      )}
                    </Text>
                  </CardBody>
                </Card>
                <Card size="sm">
                  <CardBody>
                    <HStack>
                      <IconSparkles />
                      <Text fontSize="sm">
                        {t("onboarding.appFeatures.features.aiSupport.title")}
                        <Tag size="sm" colorScheme="cyan" ml={1}>
                          {t("common.soon")}
                        </Tag>
                      </Text>
                    </HStack>
                    <Text fontSize="xs" color="gray.500">
                      {t(
                        "onboarding.appFeatures.features.aiSupport.description",
                      )}
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
                {t("onboarding.appFeatures.getStarted")}
              </Button>
            </Stack>
          </Container>
        </OnboardingGridDotted>
      </OnboardingAnimatedPage>
    </>
  );
}
