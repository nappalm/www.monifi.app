import { Logo, useAuthenticatedUser } from "@/shared";
import { Container, Heading, Stack, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import OnboardingAnimatedPage from "../components/OnboardingAnimatedPage";
import OnboardingBaseQuestionsForm from "../components/OnboardingBaseQuestionsForm";
import OnboardingGridDotted from "../components/OnboardingGridDotted";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { ONBOARDING_PATHS } from "../router";
import { BaseQuestionsFormValues } from "../utils/types";

export default function OnboardingBaseQuestionPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthenticatedUser();
  const updateProfile = useUpdateProfile();

  const handleSubmit = (values: BaseQuestionsFormValues) => {
    if (!user?.id) return;
    updateProfile.mutate(
      {
        id: user?.id,
        ...values,
      },
      {
        onSuccess: () => navigate(ONBOARDING_PATHS.accounts),
      },
    );
  };

  return (
    <OnboardingAnimatedPage>
      <OnboardingGridDotted>
        <Container maxW="500px">
          <Stack align="center" justify="center" pt="30%">
            <Logo w="40px" h="40px" />
            <Heading variant="onboarding-title">
              {t("onboarding.baseQuestions.title")}
            </Heading>
            <Text textAlign="center" color="gray.500" maxW="400px">
              {t("onboarding.baseQuestions.description")}
            </Text>
          </Stack>
          <br />
          <OnboardingBaseQuestionsForm
            isLoading={updateProfile.isPending}
            onSkip={() => navigate(ONBOARDING_PATHS.accounts)}
            onBack={() => navigate(ONBOARDING_PATHS.base)}
            onSubmit={handleSubmit}
          />
        </Container>
      </OnboardingGridDotted>
    </OnboardingAnimatedPage>
  );
}
