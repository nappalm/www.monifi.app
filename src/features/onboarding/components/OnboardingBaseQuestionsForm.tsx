import { FormProvider, RHFSelect } from "@/shared";
import { Stack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { BaseQuestionsFormValues, CommmonFormProps } from "../utils/types";
import OnboardingFormButtons from "./OnboardingFormButtons";

type Props = {
  onSubmit: (values: BaseQuestionsFormValues) => void;
} & Omit<CommmonFormProps, "onSubmit">;

export default function OnboardingBaseQuestionsForm({
  onSkip,
  onSubmit,
  onBack,
  isLoading,
}: Props) {
  const { t } = useTranslation();
  const methods = useForm<BaseQuestionsFormValues>({
    defaultValues: {
      priority: "",
      finance_management: "",
    },
  });

  return (
    <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
      <Stack>
        <RHFSelect
          name="priority"
          label={t("onboarding.baseQuestions.priority.label")}
        >
          <option value="saving">
            {t("onboarding.baseQuestions.priority.saving")}
          </option>
          <option value="debt">
            {t("onboarding.baseQuestions.priority.debt")}
          </option>
          <option value="spending">
            {t("onboarding.baseQuestions.priority.spending")}
          </option>
          <option value="goals">
            {t("onboarding.baseQuestions.priority.goals")}
          </option>
        </RHFSelect>
        <RHFSelect
          name="finance_management"
          label={t("onboarding.baseQuestions.financeManagement.label")}
        >
          <option value="notebook">
            {t("onboarding.baseQuestions.financeManagement.notebook")}
          </option>
          <option value="apps">
            {t("onboarding.baseQuestions.financeManagement.apps")}
          </option>
          <option value="no_track">
            {t("onboarding.baseQuestions.financeManagement.noTrack")}
          </option>
        </RHFSelect>
        <br />
        <OnboardingFormButtons
          isLoading={isLoading}
          onSkip={onSkip}
          onBack={onBack}
        />
      </Stack>
    </FormProvider>
  );
}
