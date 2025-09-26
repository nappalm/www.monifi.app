import { useAuthenticatedUser } from "@/shared";
import { Container, Heading, Stack, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import AnimatedPage from "../components/AnimatedPage";
import BaseQuestionsForm from "../components/BaseQuestionsForm";
import GridDotted from "../components/GridDotted";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { ONBOARDING_PATHS } from "../router";
import { BaseQuestionsFormValues } from "../utils/types";

export default function BaseQuestionPage() {
  const navigate = useNavigate();
  const { user } = useAuthenticatedUser();
  const updateProfile = useUpdateProfile();

  const handleSubmit = (values: BaseQuestionsFormValues) => {
    if (!user?.id) return;
    updateProfile.mutate(
      {
        uuid: user?.id,
        ...values,
      },
      {
        onSuccess: () => navigate(ONBOARDING_PATHS.accounts),
      },
    );
  };

  return (
    <AnimatedPage>
      <GridDotted>
        <Container maxW="500px">
          <Stack align="center" justify="center" pt="30%" gap={4}>
            <Heading variant="onboarding-title">Set up your profile</Heading>
            <Text textAlign="center" color="gray.500" maxW="400px">
              To personalize your experience, tell us about your priorities and
              how you currently manage your finances.
            </Text>
            <BaseQuestionsForm
              isLoading={updateProfile.isPending}
              onSkip={() => navigate(ONBOARDING_PATHS.accounts)}
              onBack={() => navigate(ONBOARDING_PATHS.base)}
              onSubmit={handleSubmit}
            />
          </Stack>
        </Container>
      </GridDotted>
    </AnimatedPage>
  );
}
