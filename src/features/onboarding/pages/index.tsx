import { useAuthenticatedUser } from "@/shared";
import { Container, Heading, Image, Stack, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import AnimatedPage from "../components/AnimatedPage";
import GridDotted from "../components/GridDotted";
import OnboardingBaseForm from "../components/OnboardingBaseForm";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { ONBOARDING_PATHS } from "../router";
import { OnboardingBaseFormValues } from "../utils/types";

export default function Onboarding() {
  const { user } = useAuthenticatedUser();
  const navigate = useNavigate();
  const updateProfile = useUpdateProfile();

  const handleGetStarted = (values: OnboardingBaseFormValues) => {
    if (!user?.id) return;

    updateProfile.mutate(
      {
        uuid: user?.id,
        ...values,
      },
      {
        onSuccess: () => navigate(ONBOARDING_PATHS.baseQuestions),
      },
    );
  };

  return (
    <AnimatedPage>
      <GridDotted>
        <Container maxW="500px">
          <Stack align="center" pt="40%" justify="center" w="full">
            <Image src="/logo.png" alt="logo" width="60px" />
            <Heading variant="onboarding-title" textAlign="center">
              Welcome aboard Monify!
            </Heading>
            <Text textAlign="center" fontSize="md" color="gray.500">
              You are about to take control of your finances. Find out where
              your money is going and how you can optimize your savings.
            </Text>
          </Stack>
          <br />
          <OnboardingBaseForm onSubmit={handleGetStarted} />
        </Container>
      </GridDotted>
    </AnimatedPage>
  );
}
