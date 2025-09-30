import { FormProvider, RHFInput, useAuthenticatedUser } from "@/shared";
import { Button, Checkbox, Stack, Text, useBoolean } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import { OnSubmitProfile } from "../../utils/types";
import { profileSchema } from "../../utils/yup";

type Props = {
  onSubmit: (values: OnSubmitProfile) => void;
  isLoading?: boolean;
};

export default function ProfileForm({ onSubmit, isLoading = false }: Props) {
  const { t } = useTranslation();
  const [enabledEmail, setEnabledEmail] = useBoolean();

  const { user, profile } = useAuthenticatedUser();

  const methods = useForm<OnSubmitProfile>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      email: user?.email,
      name: profile?.name ?? user?.user_metadata?.name,
    },
  });

  const isEmail = user?.app_metadata.providers.includes("email");

  return (
    <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
      <Stack>
        <RHFInput name="name" label={t("settings.myProfile.name")} />
        <RHFInput
          name="email"
          label={t("settings.myProfile.email")}
          isDisabled={!enabledEmail}
        />
        {isEmail && (
          <>
            <Checkbox onChange={setEnabledEmail.toggle}>
              {t("settings.myProfile.changeEmail")}
            </Checkbox>
            <Text fontSize="xs" color="gray.500">
              {t("settings.myProfile.emailChangeInfo")}
            </Text>
          </>
        )}
        <Button
          type="submit"
          w="fit-content"
          colorScheme="cyan"
          isLoading={isLoading}
        >
          {t("settings.myProfile.updateProfile")}
        </Button>
      </Stack>
    </FormProvider>
  );
}
