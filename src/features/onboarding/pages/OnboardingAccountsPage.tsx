import { Button, Container, Stack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import OnboardingAccountsForm from "../components/OnboardingAccountsForm";
import OnboardingAnimatedPage from "../components/OnboardingAnimatedPage";
import OnboardingGridDotted from "../components/OnboardingGridDotted";
import PageTitle from "../components/PageTitle";
import { ONBOARDING_PATHS } from "../router";

export default function OnboardingAccountsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onNext = () => navigate(ONBOARDING_PATHS.categories);
  const onBack = () => navigate(ONBOARDING_PATHS.baseQuestions);

  return (
    <>
      <BackButton total={5} step={3} onClick={onBack} />
      <OnboardingAnimatedPage>
        <OnboardingGridDotted>
          <Container>
            <Stack gap={3}>
              <PageTitle
                title={t("onboarding.accounts.title")}
                description={t("onboarding.accounts.description")}
              />
              <OnboardingAccountsForm />
              <Button onClick={onNext}>{t("common.continue")}</Button>
            </Stack>
          </Container>
        </OnboardingGridDotted>
      </OnboardingAnimatedPage>
    </>
  );
}
