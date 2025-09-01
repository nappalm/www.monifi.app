import { FormProvider, RHFInput, useAuthenticatedUser } from "@/shared";
import { Alert, AlertIcon, Button, Stack, Text } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useChangePassword } from "../../hooks/useAccount";
import { OnSubmitChangePassword } from "../../utils/types";
import { changePasswordSchema } from "../../utils/yup";

export default function ChangePasswordForm() {
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
          Your password is managed by your login provider
        </Alert>
        <Text color="gray.500">
          Since you access this account through an external service (
          {user?.app_metadata.provider}), we cannot change your password from
          here.
        </Text>
      </Stack>
    );
  }

  return (
    <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
      <Stack>
        <RHFInput name="password" label="New passsword" type="password" />
        <RHFInput
          name="repeat_password"
          label="Repeat new password"
          type="password"
        />
        <Button
          type="submit"
          w="fit-content"
          colorScheme="blue"
          isLoading={isPending}
        >
          Update password
        </Button>
      </Stack>
    </FormProvider>
  );
}
