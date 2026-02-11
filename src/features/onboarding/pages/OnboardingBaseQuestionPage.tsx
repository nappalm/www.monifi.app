import { useAuthenticatedUser } from "@/shared";
import { Container, Stack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import OnboardingBaseQuestionsForm from "../components/OnboardingBaseQuestionsForm";
import PageTitle from "../components/PageTitle";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import StepLayout from "../layout/StepLayout";
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
      <StepLayout activeStep={1}>
        <Container>
          <Stack gap={3}>
            <PageTitle
              title={t("onboarding.baseQuestions.title")}
              description={t("onboarding.baseQuestions.description")}
              onBack={() => navigate(ONBOARDING_PATHS.base)}
            />
            <OnboardingBaseQuestionsForm
              isLoading={updateProfile.isPending}
              onSubmit={handleSubmit}
            />
          </Stack>
        </Container>
      </StepLayout>
    </>
  );
}
