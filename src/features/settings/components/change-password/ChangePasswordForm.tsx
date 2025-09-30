import { FormProvider, RHFInput, useAuthenticatedUser } from "@/shared";
import { Alert, AlertIcon, Button, Stack, Text } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useChangePassword } from "../../hooks/useAccount";
import { OnSubmitChangePassword } from "../../utils/types";
import { changePasswordSchema } from "../../utils/yup";

export default function ChangePasswordForm() {
  const { t } = useTranslation();
  const methods = useForm<OnSubmitChangePassword>({
    resolver: yupResolver(changePasswordSchema),
    defaultValues: {
      password: "",
      repeat_password: "",
    },
  });

  const { user } = useAuthenticatedUser();

  const { mutate, isPending } = useChangePassword();

  const onSubmit = ({ password }: OnSubmitChangePassword) => {
    mutate(password);
  };

  const isEmail = user?.app_metadata.providers.includes("email");

  if (!isEmail) {
    return (
      <Stack>
        <Alert>
          <AlertIcon />
          {t("settings.changePassword.managedByProvider")}
        </Alert>
        <Text color="gray.500">
          {t("settings.changePassword.externalServiceInfo", {
            provider: user?.app_metadata.provider,
          })}
        </Text>
      </Stack>
    );
  }

  return (
    <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
      <Stack>
        <RHFInput
          name="password"
          label={t("settings.changePassword.newPassword")}
          type="password"
        />
        <RHFInput
          name="repeat_password"
          label={t("settings.changePassword.repeatPassword")}
          type="password"
        />
        <Button
          type="submit"
          w="fit-content"
          colorScheme="cyan"
          isLoading={isPending}
        >
          {t("settings.changePassword.updatePassword")}
        </Button>
      </Stack>
    </FormProvider>
  );
}
