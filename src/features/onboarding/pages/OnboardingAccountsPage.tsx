import { Container, Stack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import OnboardingAccountsForm from "../components/OnboardingAccountsForm";
import PageTitle from "../components/PageTitle";
import StepLayout from "../layout/StepLayout";
import { ONBOARDING_PATHS } from "../router";

export default function OnboardingAccountsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onNext = () => navigate(ONBOARDING_PATHS.categories);
  const onBack = () => navigate(ONBOARDING_PATHS.baseQuestions);

  return (
    <>
      <StepLayout activeStep={2}>
        <Container>
          <Stack gap={3}>
            <PageTitle
              title={t("onboarding.accounts.title")}
              description={t("onboarding.accounts.description")}
              onBack={onBack}
            />
            <OnboardingAccountsForm onContinue={onNext} />
          </Stack>
        </Container>
      </StepLayout>
    </>
  );
}
