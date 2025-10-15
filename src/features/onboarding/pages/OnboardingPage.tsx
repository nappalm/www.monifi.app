import { TablesUpdate } from "@/lib";
import { Logo, useAuthenticatedUser } from "@/shared";
import { Container, Heading, Stack, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import OnboardingAnimatedPage from "../components/OnboardingAnimatedPage";
import OnboardingBaseForm from "../components/OnboardingBaseForm";
import OnboardingGridDotted from "../components/OnboardingGridDotted";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { ONBOARDING_PATHS } from "../router";
import PageTitle from "../components/PageTitle";

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
    <OnboardingAnimatedPage>
      <OnboardingGridDotted>
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
      </OnboardingGridDotted>
    </OnboardingAnimatedPage>
  );
}
