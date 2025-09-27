import { TablesUpdate } from "@/lib";
import { Logo, useAuthenticatedUser } from "@/shared";
import { Container, Heading, Stack, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import OnboardingAnimatedPage from "../components/OnboardingAnimatedPage";
import OnboardingBaseQuestionsForm from "../components/OnboardingBaseQuestionsForm";
import OnboardingGridDotted from "../components/OnboardingGridDotted";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { ONBOARDING_PATHS } from "../router";

export default function OnboardingBaseQuestionPage() {
  const navigate = useNavigate();
  const { user } = useAuthenticatedUser();
  const updateProfile = useUpdateProfile();

  const handleSubmit = (values: TablesUpdate<"profiles">) => {
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
            <Heading variant="onboarding-title">Set up your profile</Heading>
            <Text textAlign="center" color="gray.500" maxW="400px">
              To personalize your experience, tell us about your priorities and
              how you currently manage your finances.
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
