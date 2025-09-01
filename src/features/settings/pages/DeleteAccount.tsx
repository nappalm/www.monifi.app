import { Heading, Stack } from "@chakra-ui/react";
import DeleteAccountForm from "../components/delete-account/DeleteAccountForm";
import { useDeleteAccount } from "../hooks/useAccount";
import { useEffect } from "react";
import { useSignOut } from "@/shared";

export default function DeleteAccount() {
  const { mutate: signOut } = useSignOut();
  const { mutate, isPending, isSuccess } = useDeleteAccount();

  useEffect(() => {
    if (isSuccess) signOut();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  return (
    <Stack w={["100%", "100%", "100%", "50%"]}>
      <Heading fontWeight={500} size="lg">
        Delete Account
      </Heading>
      <DeleteAccountForm onSubmit={() => mutate()} isLoading={isPending} />
    </Stack>
  );
}
