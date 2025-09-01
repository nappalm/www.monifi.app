import { FormProvider, RHFInput } from "@/shared";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Heading, Link, Stack, Text } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { Link as RouterLink } from "react-router-dom";
import { AUTH_PATHS } from "../router/paths";
import { OnSubmitEmailPassword } from "../utils/types";
import { emailPasswordSchema } from "../utils/yup";

type Props = {
  isLoading?: boolean;
  onSubmit: (values: OnSubmitEmailPassword) => void;
};

export default function SignUpForm({ onSubmit, isLoading }: Props) {
  const methods = useForm<OnSubmitEmailPassword>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(emailPasswordSchema),
  });

  const handleSignUp = ({ email, password }: OnSubmitEmailPassword) => {
    onSubmit({ email, password });
  };

  return (
    <Stack>
      <Heading mb={4}>Sign Up</Heading>
      <FormProvider
        methods={methods}
        onSubmit={methods.handleSubmit(handleSignUp)}
      >
        <Stack>
          <RHFInput name="email" label="Email" />
          <RHFInput name="password" label="Password" type="password" />
          <Button type="submit" isLoading={isLoading}>
            Sign Up
          </Button>
        </Stack>
      </FormProvider>
      <Text mt={4} textAlign="center">
        Already have an account?{" "}
        <Link as={RouterLink} to={AUTH_PATHS.signIn} color="blue.500">
          Sign In
        </Link>
      </Text>
    </Stack>
  );
}
