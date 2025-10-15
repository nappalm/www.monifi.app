import { FormProvider, Logo, RHFInput } from "@/shared";
import { Button, Heading, HStack, Link, Stack, Text } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { IconBrandGoogleFilled } from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import { Link as RouterLink } from "react-router-dom";
import { AUTH_PATHS } from "../router/paths";
import { OnSubmitEmailPassword, OnSubmitOAuth } from "../utils/types";
import { emailPasswordSchema } from "../utils/yup";

type Props = {
  isLoading?: boolean;
  error?: string;
  onSubmitEmailPassword: (values: OnSubmitEmailPassword) => void;
  onSubmitOAuth: (provider: OnSubmitOAuth) => void;
};

export default function SignInForm({
  onSubmitEmailPassword,
  onSubmitOAuth,
  error,
  isLoading,
}: Props) {
  const methods = useForm<OnSubmitEmailPassword>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(emailPasswordSchema),
  });

  const handleSignIn = async ({ email, password }: OnSubmitEmailPassword) => {
    onSubmitEmailPassword({ email, password });
  };

  return (
    <Stack>
      <Stack align="center">
        <Logo h="30px" w="30px" />
        <Heading mb={4}>Sign In</Heading>
      </Stack>
      <FormProvider
        methods={methods}
        onSubmit={methods.handleSubmit(handleSignIn)}
      >
        <Stack>
          <RHFInput name="email" label="Email" />
          <RHFInput name="password" label="Password" type="password" />
          {error && <Text color="red.500">{error}</Text>}
          <HStack justify="flex-end">
            <Link as={RouterLink} to={AUTH_PATHS.recovery} color="cyan.500">
              Recovery password
            </Link>
          </HStack>
          <Button type="submit" colorScheme="cyan" isLoading={isLoading}>
            Sign In
          </Button>
        </Stack>
      </FormProvider>

      <Text mt={4} textAlign="center">
        Or sign in with:
      </Text>

      <Stack mt={4} justify="center">
        <Button
          onClick={() => onSubmitOAuth("google")}
          isLoading={isLoading}
          leftIcon={<IconBrandGoogleFilled size={18} />}
        >
          Google
        </Button>
      </Stack>
      <Text mt={4} textAlign="center">
        Don't have an account?{" "}
        <Link as={RouterLink} to={AUTH_PATHS.signUp} color="cyan.500">
          Sign Up
        </Link>
      </Text>
    </Stack>
  );
}
