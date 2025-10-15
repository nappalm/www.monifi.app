import { TRANSACTIONS_PATHS } from "@/features/transactions";
import { useSignInWithEmail, useSignInWithOAuth } from "@/shared";
import { Container } from "@chakra-ui/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackgroundImage from "../components/BackgroundImage";
import SignInForm from "../components/SignInForm";
import BackButton from "../components/BackButton";

export default function SignInPage() {
  const navigate = useNavigate();
  const email = useSignInWithEmail();
  const oauth = useSignInWithOAuth();

  useEffect(() => {
    if (email.isSuccess) navigate(TRANSACTIONS_PATHS.base);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email.isSuccess]);

  const isLoading = email.isPending || oauth.isPending;
  const error = email.error || oauth.error;

  return (
    <BackgroundImage>
      <BackButton />
      <Container maxW="400px" position="relative" zIndex={1}>
        <SignInForm
          error={error?.message}
          onSubmitOAuth={oauth.mutate}
          onSubmitEmailPassword={email.mutate}
          isLoading={isLoading}
        />
      </Container>
    </BackgroundImage>
  );
}
