import {
  ButtonSpinner,
  FormProvider,
  RHFCurrency,
  RHFLanguage,
} from "@/shared";
import { Button, Stack } from "@chakra-ui/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { CommmonFormProps, OnboardingBaseFormValues } from "../utils/types";
import { IconArrowNarrowRight } from "@tabler/icons-react";

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
      <Stack gap={3}>
        <RHFLanguage />
        <RHFCurrency />
        <Stack mt={3} align="end">
          <Button
            w="fit-content"
            colorScheme="cyan"
            type="submit"
            variant="solid"
            isLoading={isLoading}
            spinner={<ButtonSpinner />}
            loadingText={t("onboarding.welcome.getStarted") + "..."}
            rightIcon={<IconArrowNarrowRight size={16} />}
          >
            {t("onboarding.welcome.getStarted")}
          </Button>
        </Stack>
      </Stack>
    </FormProvider>
  );
}
