import { TablesUpdate } from "@/lib";
import { Logo, useAuthenticatedUser } from "@/shared";
import { Container, Heading, Stack, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import OnboardingAnimatedPage from "../components/OnboardingAnimatedPage";
import OnboardingBaseForm from "../components/OnboardingBaseForm";
import OnboardingGridDotted from "../components/OnboardingGridDotted";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { ONBOARDING_PATHS } from "../router";

export default function OnboardingPage() {
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
        <Container maxW="500px">
          <Stack align="center" pt="40%" justify="center" w="full">
            <Logo w="40px" h="40px" />
            <Heading variant="onboarding-title" textAlign="center">
              Welcome aboard Monifi
            </Heading>
            <Text textAlign="center" fontSize="md" color="gray.500">
              You are about to take control of your finances. Find out where
              your money is going and how you can optimize your savings.
            </Text>
          </Stack>
          <br />
          <OnboardingBaseForm
            isLoading={updateProfile.isPending}
            onSubmit={handleGetStarted}
          />
        </Container>
      </OnboardingGridDotted>
    </OnboardingAnimatedPage>
  );
}
