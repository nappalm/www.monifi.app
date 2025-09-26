import { Logo } from "@/shared";
import { Container, Heading, Stack, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import OnboardingAccountsForm from "../components/OnboardingAccountsForm";
import OnboardingAnimatedPage from "../components/OnboardingAnimatedPage";
import OnboardingFormButtons from "../components/OnboardingFormButtons";
import OnboardingGridDotted from "../components/OnboardingGridDotted";
import { ONBOARDING_PATHS } from "../router";

export default function OnboardingAccountsPage() {
  const navigate = useNavigate();

  const onNext = () => navigate(ONBOARDING_PATHS.categories);
  const onBack = () => navigate(ONBOARDING_PATHS.baseQuestions);
  const onSkip = () => navigate(ONBOARDING_PATHS.categories);

  return (
    <OnboardingAnimatedPage>
      <OnboardingGridDotted>
        <Container maxW={"500px"}>
          <Stack align="center" pt="30%" justify="center" w="full">
            <Logo w="40px" h="40px" />
            <Heading variant="onboarding-title" size="md">
              Accounts
            </Heading>
            <Text fontSize="sm" color="gray.500" textAlign="center">
              Add your wallets and manage all your finances in one place. You
              can register debit, credit, savings accounts, and even digital
              wallets to get a complete view of your transactions.
            </Text>
          </Stack>
          <br />
          <OnboardingAccountsForm />
          <br />
          <OnboardingFormButtons
            onNext={onNext}
            onSkip={onSkip}
            onBack={onBack}
          />
        </Container>
      </OnboardingGridDotted>
    </OnboardingAnimatedPage>
  );
}
