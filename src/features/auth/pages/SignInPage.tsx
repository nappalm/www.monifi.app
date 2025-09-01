import { HOME_PATHS } from "@/features/home";
import { useSignInWithEmail, useSignInWithOAuth } from "@/shared";
import { Container, Stack } from "@chakra-ui/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SignInForm from "../components/SignInForm";

export default function SignInPage() {
  const navigate = useNavigate();
  const email = useSignInWithEmail();
  const oauth = useSignInWithOAuth();

  useEffect(() => {
    if (email.isSuccess) navigate(HOME_PATHS.base);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email.isSuccess]);

  const isLoading = email.isPending || oauth.isPending;
  return (
    <Stack justify="center" align="center" h="full">
      <Container maxW="400px">
        <SignInForm
          onSubmitOAuth={oauth.mutate}
          onSubmitEmailPassword={email.mutate}
          isLoading={isLoading}
        />
      </Container>
    </Stack>
  );
}
