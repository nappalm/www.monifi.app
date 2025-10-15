import { Button, Container, Stack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import OnboardingAnimatedPage from "../components/OnboardingAnimatedPage";
import OnboardingCategoriesForm from "../components/OnboardingCategoriesForm";
import OnboardingGridDotted from "../components/OnboardingGridDotted";
import PageTitle from "../components/PageTitle";
import { ONBOARDING_PATHS } from "../router";

export default function OnboardingCategoriesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onBack = () => navigate(ONBOARDING_PATHS.accounts);
  const onNext = () => navigate(ONBOARDING_PATHS.appFeatures);

  return (
    <>
      <BackButton total={5} step={4} onClick={onBack} />
      <OnboardingAnimatedPage>
        <OnboardingGridDotted>
          <Container>
            <Stack gap={3}>
              <PageTitle
                title={t("onboarding.categories.title")}
                description={t("onboarding.categories.description")}
              />
              <OnboardingCategoriesForm />
              <Button colorScheme="cyan" onClick={onNext}>
                {t("common.continue")}
              </Button>
            </Stack>
          </Container>
        </OnboardingGridDotted>
      </OnboardingAnimatedPage>
    </>
  );
}
