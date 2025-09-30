import { Logo } from "@/shared";
import { Container, Heading, Stack, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import OnboardingAccountsForm from "../components/OnboardingAccountsForm";
import OnboardingAnimatedPage from "../components/OnboardingAnimatedPage";
import OnboardingFormButtons from "../components/OnboardingFormButtons";
import OnboardingGridDotted from "../components/OnboardingGridDotted";
import { ONBOARDING_PATHS } from "../router";

export default function OnboardingAccountsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onNext = () => navigate(ONBOARDING_PATHS.categories);
  const onBack = () => navigate(ONBOARDING_PATHS.baseQuestions);
  const onSkip = () => navigate(ONBOARDING_PATHS.categories);

  return (
    <OnboardingAnimatedPage>
      <OnboardingGridDotted>
        <Container maxW={"500px"}>
          <Stack align="center" pt="30%" justify="center" w="full">
            <Logo w="40px" h="40px" />
            <Heading variant="onboarding-title" size="md">
              {t("onboarding.accounts.title")}
            </Heading>
            <Text fontSize="sm" color="gray.500" textAlign="center">
              {t("onboarding.accounts.description")}
            </Text>
          </Stack>
          <br />
          <OnboardingAccountsForm />
          <br />
          <OnboardingFormButtons
            onNext={onNext}
            onSkip={onSkip}
            onBack={onBack}
          />
        </Container>
      </OnboardingGridDotted>
    </OnboardingAnimatedPage>
  );
}
