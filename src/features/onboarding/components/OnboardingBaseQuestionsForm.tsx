import { FormProvider, RHFSelect } from "@/shared";
import { Button, Stack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { BaseQuestionsFormValues, CommmonFormProps } from "../utils/types";

type Props = {
  onSubmit: (values: BaseQuestionsFormValues) => void;
} & Omit<CommmonFormProps, "onSubmit">;

export default function OnboardingBaseQuestionsForm({
  onSubmit,
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
      <Stack gap={3}>
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
        <Button colorScheme="cyan" type="submit" isLoading={isLoading}>
          {t("common.continue")}
        </Button>
      </Stack>
    </FormProvider>
  );
}
