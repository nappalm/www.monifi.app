import { FormProvider, RHFSelect } from "@/shared";
import { Button, Stack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";

export default function BaseQuestionsForm() {
  const methods = useForm();

  return (
    <FormProvider methods={methods} onSubmit={methods.handleSubmit(() => {})}>
      <Stack>
        <RHFSelect name="priority" label="What is your current priority?">
          <option value="">Select</option>
          <option value="saving">Saving</option>
          <option value="debt">Getting out of debt</option>
          <option value="spending">Improve spending control</option>
          <option value="goals">Plan goals (e.g., vacation, car, house)</option>
        </RHFSelect>
        <RHFSelect
          name="finance_management"
          label="How do you manage your finances today?"
        >
          <option value="">Select</option>
          <option value="notebook">Notebook/Excel</option>
          <option value="apps">Apps</option>
          <option value="no_track">I don't keep track</option>
        </RHFSelect>
        <Button type="submit">Next</Button>
      </Stack>
    </FormProvider>
  );
}
