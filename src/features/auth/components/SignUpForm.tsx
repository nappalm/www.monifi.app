import { FormProvider, Logo, RHFInput } from "@/shared";
import { Button, Heading, Link, Stack, Text } from "@chakra-ui/react";
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
  onSubmit: (values: OnSubmitEmailPassword) => void;
  onSubmitOAuth: (provider: OnSubmitOAuth) => void;
};

export default function SignUpForm({
  onSubmit,
  onSubmitOAuth,
  isLoading,
  error,
}: Props) {
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
      <Stack align="center">
        <Logo h="30px" w="30px" />
        <Heading mb={4}>Sign Up</Heading>
        <Text color="gray.500">Sign up with your email and password</Text>
      </Stack>
      <FormProvider
        methods={methods}
        onSubmit={methods.handleSubmit(handleSignUp)}
      >
        <Stack>
          <RHFInput name="email" label="Email" />
          <RHFInput name="password" label="Password" type="password" />
          {error && <Text color="red.500">{error}</Text>}
          <Button type="submit" isLoading={isLoading} colorScheme="cyan">
            Sign Up
          </Button>
        </Stack>
      </FormProvider>

      <Text mt={4} textAlign="center">
        Or sign up with:
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
        Already have an account?{" "}
        <Link as={RouterLink} to={AUTH_PATHS.signIn} color="cyan.500">
          Sign In
        </Link>
      </Text>
      <Text fontSize="sm" color="gray.500" textAlign="center">
        By creating an account, you agree to accept our{" "}
        <Link href="https://www.monifi.app/terms" color="cyan.500" isExternal>
          Terms of Service
        </Link>{" "}
        and acknowledge that you have read and understood our{" "}
        <Link href="https://www.monifi.app/privacy" color="cyan.500" isExternal>
          Privacy Policy
        </Link>
        .
      </Text>
    </Stack>
  );
}
