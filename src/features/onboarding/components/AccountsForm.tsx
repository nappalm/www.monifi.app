import { Tables } from "@/lib/supabase/database.types";
import { FormProvider, RHFInput, RHFSelect } from "@/shared";
import {
  useAccounts,
  useCreateAccount,
  useDeleteAccount,
  useUpdateAccount,
} from "@/shared/hooks/useAccounts";
import { Button, HStack, IconButton, Stack, Text } from "@chakra-ui/react";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useForm } from "react-hook-form";

export default function AccountsForm() {
  const { data: accounts, isLoading } = useAccounts();
  const createAccountMutation = useCreateAccount();
  const updateAccountMutation = useUpdateAccount();
  const deleteAccountMutation = useDeleteAccount();

  const methods = useForm<Tables<"accounts">>();

  const { handleSubmit, reset, setValue } = methods;

  const onSubmit = (data: Tables<"accounts">) => {
    if (data.id) {
      updateAccountMutation.mutate({ id: data.id, account: data });
    } else {
      createAccountMutation.mutate(data);
    }
    reset();
  };

  const handleEdit = (account: Tables<"accounts">) => {
    setValue("id", account.id);
    setValue("name", account.name);
    setValue("type", account.type);
    setValue("color", account.color);
  };

  const handleDelete = (id: number) => {
    deleteAccountMutation.mutate(id);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <Stack spacing={6}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4}>
          <RHFInput name="name" label="Account Name" />
          <RHFSelect name="type" label="Account Type">
            <option value="cash">Cash</option>
            <option value="bank">Bank</option>
            <option value="credit_card">Credit Card</option>
          </RHFSelect>
          <RHFInput name="color" label="Color" type="color" />
          <Button type="submit">Save Account</Button>
        </Stack>
      </FormProvider>

      <Stack spacing={4}>
        {accounts?.map((account) => (
          <HStack key={account.id} justify="space-between">
            <Text>{account.name}</Text>
            <Text>{account.type}</Text>
            <HStack>
              <IconButton
                aria-label="Edit account"
                icon={<IconEdit />}
                onClick={() => handleEdit(account)}
              />
              <IconButton
                aria-label="Delete account"
                icon={<IconTrash />}
                onClick={() => handleDelete(account.id)}
              />
            </HStack>
          </HStack>
        ))}
      </Stack>
    </Stack>
  );
}
