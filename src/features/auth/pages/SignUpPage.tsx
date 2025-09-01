import { useSignUpWithEmail } from "@/shared";
import { Button, Container, Image, Stack, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import SignUpForm from "../components/SignUpForm";
import { AUTH_PATHS } from "../router";

export default function SignUpPage() {
  const email = useSignUpWithEmail();

  if (email.isSuccess) {
    return (
      <Stack justify="center" align="center" h="full">
        <Image src="/logo.png" alt="logo" height="32px" width="32px" />
        <Container maxW="400px" textAlign="center">
          <Stack align="center">
            <Text fontSize="lg">Thank you for registering with us!</Text>
            <Text fontSize="sm">
              We’ve sent a setup email to the address you provided. Please check
              your inbox and, if you don’t see it, also take a look in your spam
              or junk folder.
            </Text>
            <Text fontSize="sm">
              Once your email is confirmed, you’ll be able to access all the
              features of our platform.
            </Text>
            <Link to={AUTH_PATHS.signIn}>
              <Button w="full" colorScheme="blue">
                Sign In
              </Button>
            </Link>
          </Stack>
        </Container>
      </Stack>
    );
  }

  return (
    <Stack justify="center" align="center" h="full">
      <Container maxW="400px">
        <SignUpForm onSubmit={email.mutate} isLoading={email.isPending} />
      </Container>
    </Stack>
  );
}
