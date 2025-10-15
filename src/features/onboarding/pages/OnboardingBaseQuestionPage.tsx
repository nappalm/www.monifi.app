import { useAuthenticatedUser } from "@/shared";
import { Container, Stack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import OnboardingAnimatedPage from "../components/OnboardingAnimatedPage";
import OnboardingBaseQuestionsForm from "../components/OnboardingBaseQuestionsForm";
import OnboardingGridDotted from "../components/OnboardingGridDotted";
import PageTitle from "../components/PageTitle";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { ONBOARDING_PATHS } from "../router";
import { BaseQuestionsFormValues } from "../utils/types";

export default function OnboardingBaseQuestionPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthenticatedUser();
  const updateProfile = useUpdateProfile();

  const handleSubmit = async (values: BaseQuestionsFormValues) => {
    if (!user?.id) return;
    if (!values.priority && !values.finance_management) {
      navigate(ONBOARDING_PATHS.accounts);
      return;
    }

    try {
      await updateProfile.mutateAsync({
        id: user?.id,
        ...values,
      });
      navigate(ONBOARDING_PATHS.accounts);
    } finally {
      // ---
    }
  };

  return (
    <>
      <BackButton
        onClick={() => navigate(ONBOARDING_PATHS.base)}
        total={5}
        step={2}
      />

      <OnboardingAnimatedPage>
        <OnboardingGridDotted>
          <Container>
            <Stack gap={3}>
              <PageTitle
                title={t("onboarding.baseQuestions.title")}
                description={t("onboarding.baseQuestions.description")}
              />
              <OnboardingBaseQuestionsForm
                isLoading={updateProfile.isPending}
                onSubmit={handleSubmit}
              />
            </Stack>
          </Container>
        </OnboardingGridDotted>
      </OnboardingAnimatedPage>
    </>
  );
}
