import { useAuthenticatedUser } from "@/shared";
import { Alert, AlertIcon, Heading, Stack } from "@chakra-ui/react";
import ProfileForm from "../components/profile/ProfileForm";
import { useUpdateEmail, useUpdateProfile } from "../hooks/useAccount";
import { OnSubmitProfile } from "../utils/types";

export default function MyProfile() {
  const { user } = useAuthenticatedUser();
  const profile = useUpdateProfile();
  const email = useUpdateEmail();

  const handleUpdate = ({ email: newEmail, ...values }: OnSubmitProfile) => {
    if (!user) return;
    if (newEmail !== user.email) {
      email.mutate(newEmail);
    }

    profile.mutate({
      ...values,
      uuid: user.id,
    });
  };

  const isLoading = email.isPending || profile.isPending;

  if (!user) return null;

  return (
    <Stack w={["100%", "100%", "100%", "50%"]}>
      <Heading fontWeight={500} size="lg">
        My profile
      </Heading>

      {profile.isError && (
        <Alert status="error">
          <AlertIcon />
          {profile.error.message}
        </Alert>
      )}

      {email.isError && (
        <Alert status="error">
          <AlertIcon />
          {email.error.message}
        </Alert>
      )}

      <ProfileForm onSubmit={handleUpdate} isLoading={isLoading} />
    </Stack>
  );
}
