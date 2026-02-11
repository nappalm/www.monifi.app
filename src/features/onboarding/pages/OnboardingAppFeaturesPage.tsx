import { useAuthenticatedUser } from "@/shared";
import {
  Badge,
  Button,
  ButtonSpinner,
  Card,
  CardBody,
  Container,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  IconArrowNarrowRight,
  IconAutomaticGearbox,
  IconChartPie,
  IconDisc,
  IconSatellite,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PageTitle from "../components/PageTitle";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import StepLayout from "../layout/StepLayout";
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
      <StepLayout activeStep={4}>
        <Container>
          <PageTitle
            title={t("onboarding.appFeatures.title")}
            description={t("onboarding.appFeatures.description")}
            onBack={() => navigate(ONBOARDING_PATHS.categories)}
          />

          <Stack>
            <Card variant="solid" size="sm">
              <CardBody>
                <Stack gap={0}>
                  <HStack>
                    <IconAutomaticGearbox />
                    <Text fontSize="sm">
                      {t("onboarding.appFeatures.features.transactions.title")}
                    </Text>
                  </HStack>
                  <Text fontSize="sm" color="gray.500" ml={8}>
                    {t(
                      "onboarding.appFeatures.features.transactions.description",
                    )}
                  </Text>
                </Stack>
              </CardBody>
            </Card>
            <Card variant="solid" size="sm">
              <CardBody>
                <Stack gap={0}>
                  <HStack>
                    <IconChartPie />
                    <Text fontSize="sm">
                      {t("onboarding.appFeatures.features.statistics.title")}
                    </Text>
                  </HStack>
                  <Text fontSize="sm" color="gray.500" ml={8}>
                    {t(
                      "onboarding.appFeatures.features.statistics.description",
                    )}
                  </Text>
                </Stack>
              </CardBody>
            </Card>
            <Card variant="solid" size="sm">
              <CardBody>
                <Stack gap={0}>
                  <HStack>
                    <IconDisc />
                    <Text fontSize="sm">
                      {t("onboarding.appFeatures.features.budgets.title")}
                    </Text>
                  </HStack>
                  <Text fontSize="xs" color="gray.500" ml={8}>
                    {t("onboarding.appFeatures.features.budgets.description")}
                  </Text>
                </Stack>
              </CardBody>
            </Card>
            <Card variant="solid" size="sm">
              <CardBody>
                <Stack gap={0}>
                  <HStack>
                    <IconSatellite />
                    <Text fontSize="sm">
                      {t("onboarding.appFeatures.features.aiSupport.title")}
                    </Text>
                  </HStack>
                  <Text fontSize="xs" color="gray.500" ml={8}>
                    {t("onboarding.appFeatures.features.aiSupport.description")}
                  </Text>
                </Stack>
                <Badge colorScheme="teal" position="absolute" right={2} top={2}>
                  Only PRO
                </Badge>
              </CardBody>
            </Card>
          </Stack>
          <Stack align="end" mt={5}>
            <Button
              colorScheme="cyan"
              variant="solid"
              onClick={handleGetStarted}
              isLoading={updateProfile.isPending}
              rightIcon={<IconArrowNarrowRight size={16} />}
              spinner={<ButtonSpinner />}
              loadingText={t("onboarding.appFeatures.getStarted") + "..."}
            >
              {t("onboarding.appFeatures.getStarted")}
            </Button>
          </Stack>
        </Container>
      </StepLayout>
    </>
  );
}
