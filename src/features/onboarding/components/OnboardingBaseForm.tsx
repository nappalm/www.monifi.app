import { FormProvider, RHFSelect } from "@/shared";
import { Button, Stack } from "@chakra-ui/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { CommmonFormProps, OnboardingBaseFormValues } from "../utils/types";

type Props = {
  onSubmit: (values: OnboardingBaseFormValues) => void;
} & Omit<CommmonFormProps, "onSubmit">;

export default function OnboardingBaseForm({ onSubmit, isLoading }: Props) {
  const { t, i18n } = useTranslation();
  const methods = useForm<OnboardingBaseFormValues>({
    defaultValues: {
      currency: "USD",
      language: "en",
    },
  });

  const language = methods.watch("language");

  useEffect(() => {
    if (language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  return (
    <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
      <Stack>
        <RHFSelect name="language" label={t("onboarding.form.language.label")}>
          <option value="en">
            {t("onboarding.form.language.english")}
          </option>
          <option value="es">
            {t("onboarding.form.language.spanish")}
          </option>
        </RHFSelect>
        <RHFSelect name="currency" label={t("onboarding.form.currency.label")}>
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
        <Button
          w="full"
          colorScheme="cyan"
          type="submit"
          variant="outline"
          isLoading={isLoading}
        >
          {t("onboarding.welcome.getStarted")}
        </Button>
      </Stack>
    </FormProvider>
  );
}
