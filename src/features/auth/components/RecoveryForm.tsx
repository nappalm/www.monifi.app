import { FormProvider, RHFInput } from "@/shared";
import { Button, Heading, Link, Stack, Text } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Link as RouterLink } from "react-router-dom";
import { AUTH_PATHS } from "../router/paths";
import { OnSubmitRecovery } from "../utils/types";
import { recoverySchema } from "../utils/yup";

type Props = {
  isLoading?: boolean;
  onSubmit: (values: OnSubmitRecovery) => void;
};

export default function RecoveryForm({ onSubmit, isLoading }: Props) {
  const methods = useForm<OnSubmitRecovery>({
    defaultValues: {
      email: "",
    },
    resolver: yupResolver(recoverySchema),
  });

  const handleRecovery = async ({ email }: OnSubmitRecovery) => {
    onSubmit({ email });
  };

  return (
    <Stack>
      <Heading mb={4}>Forgot Password?</Heading>
      <Text>
        Enter your email address and we'll send you a link to reset your
        password.
      </Text>
      <FormProvider
        methods={methods}
        onSubmit={methods.handleSubmit(handleRecovery)}
      >
        <Stack>
          <RHFInput name="email" label="Email" autoFocus />
          <Button type="submit" colorScheme="blue" isLoading={isLoading}>
            Send Recovery Email
          </Button>
        </Stack>
      </FormProvider>

      <Text mt={4} textAlign="center">
        Remembered your password?{" "}
        <Link as={RouterLink} to={AUTH_PATHS.signIn} color="blue.500">
          Sign In
        </Link>
      </Text>
    </Stack>
  );
}
