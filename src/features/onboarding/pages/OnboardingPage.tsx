import { TablesUpdate } from "@/lib";
import { useAuthenticatedUser } from "@/shared";
import { Container, Stack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import OnboardingBaseForm from "../components/OnboardingBaseForm";
import PageTitle from "../components/PageTitle";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import StepLayout from "../layout/StepLayout";
import { ONBOARDING_PATHS } from "../router";

export default function OnboardingPage() {
  const { t } = useTranslation();
  const { user } = useAuthenticatedUser();
  const navigate = useNavigate();
  const updateProfile = useUpdateProfile();

  const handleGetStarted = (values: TablesUpdate<"profiles">) => {
    if (!user?.id) return;

    updateProfile.mutate(
      {
        id: user?.id,
        ...values,
      },
      {
        onSuccess: () => navigate(ONBOARDING_PATHS.baseQuestions),
      },
    );
  };

  return (
    <StepLayout activeStep={0}>
      <Container>
        <Stack gap={3}>
          <PageTitle
            title={t("onboarding.welcome.title")}
            description={t("onboarding.welcome.description")}
          />
          <OnboardingBaseForm
            isLoading={updateProfile.isPending}
            onSubmit={handleGetStarted}
          />
        </Stack>
      </Container>
    </StepLayout>
  );
}
