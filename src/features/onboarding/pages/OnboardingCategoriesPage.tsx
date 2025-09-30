import { Logo } from "@/shared";
import { Container, Heading, Stack, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import OnboardingAnimatedPage from "../components/OnboardingAnimatedPage";
import OnboardingCategoriesForm from "../components/OnboardingCategoriesForm";
import OnboardingFormButtons from "../components/OnboardingFormButtons";
import OnboardingGridDotted from "../components/OnboardingGridDotted";
import { ONBOARDING_PATHS } from "../router";

export default function OnboardingCategoriesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onBack = () => navigate(ONBOARDING_PATHS.accounts);
  const onNext = () => navigate(ONBOARDING_PATHS.appFeatures);
  const onSkip = () => navigate(ONBOARDING_PATHS.appFeatures);

  return (
    <OnboardingAnimatedPage>
      <OnboardingGridDotted>
        <Container maxW={"500px"}>
          <Stack align="center" justify="center" pt="30%">
            <Logo w="40px" h="40px" />
            <Heading variant="onboarding-title" size="md">
              {t("onboarding.categories.title")}
            </Heading>
            <Text fontSize="sm" color="gray.500">
              {t("onboarding.categories.description")}
            </Text>
          </Stack>
          <br />
          <OnboardingCategoriesForm />
          <br />
          <OnboardingFormButtons
            onBack={onBack}
            onNext={onNext}
            onSkip={onSkip}
          />
        </Container>
      </OnboardingGridDotted>
    </OnboardingAnimatedPage>
  );
}
