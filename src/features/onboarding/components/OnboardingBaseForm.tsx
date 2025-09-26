import { FormProvider, RHFSelect } from "@/shared";
import { Button, Stack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { CommmonFormProps, OnboardingBaseFormValues } from "../utils/types";

type Props = {
  onSubmit: (values: OnboardingBaseFormValues) => void;
} & Omit<CommmonFormProps, "onSubmit">;

export default function OnboardingBaseForm({ onSubmit }: Props) {
  const methods = useForm<OnboardingBaseFormValues>({
    defaultValues: {
      currency: "USD",
      language: "en",
    },
  });

  return (
    <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
      <Stack>
        <RHFSelect name="language" label="Select your language">
          <option value="en">English</option>
          <option value="es">Español</option>
        </RHFSelect>
        <RHFSelect name="currency" label="Select your currency">
          <option value="USD">USD (United States Dollar)</option>
          <option value="EUR">EUR (Euro)</option>
          <option value="JPY">JPY (Japanese Yen)</option>
          <option value="GBP">GBP (British Pound Sterling)</option>
          <option value="AUD">AUD (Australian Dollar)</option>
          <option value="CAD">CAD (Canadian Dollar)</option>
          <option value="CHF">CHF (Swiss Franc)</option>
          <option value="CNH">CNH (Chinese Yuan Renminbi)</option>
          <option value="HKD">HKD (Hong Kong Dollar)</option>
          <option value="NZD">NZD (New Zealand Dollar)</option>
          <option value="MXN">MXN (Mexican Peso)</option>
        </RHFSelect>
        <br />
        <Button w="full" colorScheme="cyan" type="submit" variant="outline">
          Get Started
        </Button>
      </Stack>
    </FormProvider>
  );
}
