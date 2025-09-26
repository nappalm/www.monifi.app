import { FormProvider, RHFSelect } from "@/shared";
import { Stack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
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
  const methods = useForm<BaseQuestionsFormValues>({
    defaultValues: {
      priority: "",
      finance_management: "",
    },
  });

  return (
    <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
      <Stack>
        <RHFSelect name="priority" label="What is your current priority?">
          <option value="saving">Saving</option>
          <option value="debt">Getting out of debt</option>
          <option value="spending">Improve spending control</option>
          <option value="goals">Plan goals (e.g., vacation, car, house)</option>
        </RHFSelect>
        <RHFSelect
          name="finance_management"
          label="How do you manage your finances today?"
        >
          <option value="notebook">Notebook/Excel</option>
          <option value="apps">Apps</option>
          <option value="no_track">I don't keep track</option>
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
