import {
  FormProvider,
  RHFCurrency,
  RHFInput,
  RHFLanguage,
  useAuthenticatedUser,
} from "@/shared";
import {
  Button,
  Checkbox,
  SimpleGrid,
  Stack,
  Text,
  useBoolean,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
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
      language: profile?.language ?? "en",
      currency: profile?.currency ?? "USD",
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
        <SimpleGrid columns={2} gap={2}>
          <RHFCurrency />
          <RHFLanguage />
        </SimpleGrid>
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
