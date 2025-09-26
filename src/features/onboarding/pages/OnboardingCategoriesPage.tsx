import { Container, Heading, Image, Stack, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import OnboardingAnimatedPage from "../components/OnboardingAnimatedPage";
import OnboardingCategoriesForm from "../components/OnboardingCategoriesForm";
import OnboardingFormButtons from "../components/OnboardingFormButtons";
import OnboardingGridDotted from "../components/OnboardingGridDotted";
import { ONBOARDING_PATHS } from "../router";
import { Logo } from "@/shared";

export default function OnboardingCategoriesPage() {
  const navigate = useNavigate();

  const onBack = () => navigate(ONBOARDING_PATHS.accounts);
  const onNext = () => navigate(ONBOARDING_PATHS.appFeatures);
  const onSkip = () => navigate(ONBOARDING_PATHS.appFeatures);

  return (
    <OnboardingAnimatedPage>
      <OnboardingGridDotted>
        <Container maxW={"500px"}>
          <Stack align="center" justify="center" pt="30%">
            <Logo w="40px" h="40px" />
            <Heading variant="onboarding-title" size="md">
              Categories
            </Heading>
            <Text fontSize="sm" color="gray.500">
              Create categories to classify your income and expenses. This will
              help you understand where your money is coming from and where it
              is going.
            </Text>
          </Stack>
          <br />
          <OnboardingCategoriesForm />
          <br />
          <OnboardingFormButtons
            onBack={onBack}
            onNext={onNext}
            onSkip={onSkip}
          />
        </Container>
      </OnboardingGridDotted>
    </OnboardingAnimatedPage>
  );
}
