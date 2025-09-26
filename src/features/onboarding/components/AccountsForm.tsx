import { Tables } from "@/lib/supabase/database.types";
import {
  FormProvider,
  RHFInput,
  TableSkeletonRow,
  useAuthenticatedUser,
} from "@/shared";
import TableEmptyRows from "@/shared/components/table-empty-rows";
import {
  useAccounts,
  useCreateAccount,
  useDeleteAccount,
  useUpdateAccount,
} from "@/shared/hooks/useAccounts";
import {
  Button,
  ButtonGroup,
  HStack,
  IconButton,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import {
  IconCheck,
  IconPencil,
  IconTrashFilled,
  IconWallet,
} from "@tabler/icons-react";
import { isEmpty } from "lodash";
import { useForm } from "react-hook-form";

export default function AccountsForm() {
  const { data: accounts, isLoading } = useAccounts();
  const { user } = useAuthenticatedUser();

  const createAccountMutation = useCreateAccount();
  const updateAccountMutation = useUpdateAccount();
  const deleteAccountMutation = useDeleteAccount();

  const methods = useForm<Tables<"accounts">>({
    defaultValues: {
      name: "",
    },
  });

  const { handleSubmit, reset, setValue, watch } = methods;
  const id = watch("id");

  const onLocalSubmit = ({ id, ...data }: Tables<"accounts">) => {
    if (!user?.id) return;

    if (id) {
      updateAccountMutation.mutate(
        { id, account: data },
        {
          onSuccess: () => handleCancelEdit(),
        },
      );
    } else {
      createAccountMutation.mutate({
        ...data,
        user_id: user?.id,
        type: "checking",
      });
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

  const handleCancelEdit = () => {
    setValue("id", null);
    setValue("name", null);
  };

  return (
    <Stack spacing={6}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onLocalSubmit)}>
        <HStack>
          <RHFInput size="sm" name="name" label="Account Name" autoFocus />
          <IconButton
            aria-label="Add Account Button"
            type="submit"
            w="fit-content"
            icon={<IconCheck size={18} />}
          />
        </HStack>
        {id && (
          <Button
            p={2}
            size="xs"
            variant="unstyled"
            textAlign="left"
            color="red.600"
            onClick={handleCancelEdit}
          >
            Cancel edition
          </Button>
        )}
      </FormProvider>

      <TableContainer>
        <Table size="sm" variant="striped">
          <Thead>
            <Tr>
              <Th />
              <Th>Wallet</Th>
              <Th isNumeric>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {isLoading ? (
              <TableSkeletonRow cols={3} />
            ) : isEmpty(accounts) ? (
              <TableEmptyRows cols={3} />
            ) : (
              accounts?.map((account) => (
                <Tr key={account.id}>
                  <Td w="10px" opacity={0.5}>
                    <IconWallet size={18} color={account.color || "gray"} />
                  </Td>
                  <Td>{account.name}</Td>
                  <Td isNumeric w="10px">
                    <ButtonGroup size="xs" spacing={1}>
                      <IconButton
                        aria-label="Edit"
                        icon={<IconPencil size={15} />}
                        variant="ghost"
                        onClick={() => handleEdit(account)}
                      />
                      <IconButton
                        aria-label="Delete"
                        icon={<IconTrashFilled size={15} />}
                        variant="ghost"
                        onClick={() => handleDelete(account.id)}
                      />
                    </ButtonGroup>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
