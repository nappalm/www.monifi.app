import { Logo, useRecoveryPassword } from "@/shared";
import { Button, Container, Stack, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import BackgroundImage from "../components/BackgroundImage";
import RecoveryForm from "../components/RecoveryForm";
import { AUTH_PATHS } from "../router";
import BackButton from "../components/BackButton";

export default function RecoveryPage() {
  const { mutate, isPending, isSuccess, error } = useRecoveryPassword();

  if (isSuccess) {
    return (
      <BackgroundImage>
        <Stack
          justify="center"
          align="center"
          h="full"
          position="relative"
          zIndex={1}
        >
          <Container maxW="400px">
            <Stack align="center">
              <Logo h="30px" w="30px" />
              <Text textAlign="center">
                Please check your inbox and follow the instructions we sent by
                email to restore your account
              </Text>
              <Link to={AUTH_PATHS.signIn}>
                <Button colorScheme="cyan">Go to sign in</Button>
              </Link>
            </Stack>
          </Container>
        </Stack>
      </BackgroundImage>
    );
  }

  return (
    <BackgroundImage>
      <BackButton />
      <Stack
        justify="center"
        align="center"
        h="full"
        position="relative"
        zIndex={1}
      >
        <Container maxW="400px">
          <RecoveryForm
            error={error?.message}
            isLoading={isPending}
            onSubmit={({ email }) => mutate(email)}
          />
        </Container>
      </Stack>
    </BackgroundImage>
  );
}
