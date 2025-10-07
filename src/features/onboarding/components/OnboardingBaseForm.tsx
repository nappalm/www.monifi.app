import { FormProvider, RHFCurrency, RHFLanguage } from "@/shared";
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
        <RHFLanguage />
        <RHFCurrency />
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
