import { FormProvider, RHFInput, useAuthenticatedUser } from "@/shared";
import { Button, Checkbox, Stack, Text, useBoolean } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { OnSubmitProfile } from "../../utils/types";
import { profileSchema } from "../../utils/yup";

type Props = {
  onSubmit: (values: OnSubmitProfile) => void;
  isLoading?: boolean;
};

export default function ProfileForm({ onSubmit, isLoading = false }: Props) {
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
        <RHFInput name="name" label="Name" />
        <RHFInput name="email" label="Email" isDisabled={!enabledEmail} />
        {isEmail && (
          <>
            <Checkbox onChange={setEnabledEmail.toggle}>
              Change my email account
            </Checkbox>
            <Text fontSize="xs" color="gray.500">
              If you decide to update your email account, we will send a
              confirmation link to the new address you provide
            </Text>
          </>
        )}
        <Button
          type="submit"
          w="fit-content"
          colorScheme="blue"
          isLoading={isLoading}
        >
          Update profile
        </Button>
      </Stack>
    </FormProvider>
  );
}
