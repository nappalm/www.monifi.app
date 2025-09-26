import { Container, Heading, Stack, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import AccountsForm from "../components/AccountsForm";
import AnimatedPage from "../components/AnimatedPage";
import FormButtons from "../components/FormButtons";
import GridDotted from "../components/GridDotted";
import { ONBOARDING_PATHS } from "../router";

export default function AccountsPage() {
  const navigate = useNavigate();

  const onNext = () => navigate(ONBOARDING_PATHS.categories);
  const onBack = () => navigate(ONBOARDING_PATHS.baseQuestions);
  const onSkip = () => navigate(ONBOARDING_PATHS.categories);

  return (
    <AnimatedPage>
      <GridDotted>
        <Container maxW={"500px"}>
          <Stack pt="30%">
            <Heading variant="onboarding-title" size="md">
              Accounts
            </Heading>
            <Text fontSize="sm" color="gray.500">
              Add your wallets and manage all your finances in one place. You
              can register debit, credit, savings accounts, and even digital
              wallets to get a complete view of your transactions.
            </Text>
            <AccountsForm />
            <br />
            <FormButtons onNext={onNext} onSkip={onSkip} onBack={onBack} />
          </Stack>
        </Container>
      </GridDotted>
    </AnimatedPage>
  );
}
