import { Button, Container, Image, Stack, Text } from "@chakra-ui/react";
import RecoveryForm from "../components/RecoveryForm";
import { useRecoveryPassword } from "@/shared";
import { Link } from "react-router-dom";
import { AUTH_PATHS } from "../router";

export default function RecoveryPage() {
  const { mutate, isPending, isSuccess } = useRecoveryPassword();

  if (isSuccess) {
    return (
      <Stack justify="center" align="center" h="full">
        <Container maxW="400px">
          <Stack align="center">
            <Image src="/logo.png" alt="logo" height="32px" width="32px" />
            <Text textAlign="center">
              Please check your inbox and follow the instructions we sent by
              email to restore your account
            </Text>
            <Link to={AUTH_PATHS.signIn}>
              <Button colorScheme="blue">Go to sign in</Button>
            </Link>
          </Stack>
        </Container>
      </Stack>
    );
  }

  return (
    <Stack justify="center" align="center" h="full">
      <Container maxW="400px">
        <RecoveryForm
          isLoading={isPending}
          onSubmit={({ email }) => mutate(email)}
        />
      </Container>
    </Stack>
  );
}
