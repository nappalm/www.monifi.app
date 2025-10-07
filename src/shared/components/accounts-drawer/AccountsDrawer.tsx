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
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
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
  UseDisclosureProps,
} from "@chakra-ui/react";
import {
  IconCheck,
  IconPencil,
  IconTrashFilled,
  IconWallet,
} from "@tabler/icons-react";
import { isEmpty } from "lodash";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

export default function AccountsDrawer({
  isOpen = false,
  onClose,
}: UseDisclosureProps) {
  const { t } = useTranslation();
  const { data: accounts, isLoading } = useAccounts();
  const { user } = useAuthenticatedUser();

  const createAccountMutation = useCreateAccount();
  const updateAccountMutation = useUpdateAccount();
  const deleteAccountMutation = useDeleteAccount();

  const methods = useForm<Tables<"accounts">>();

  const { handleSubmit, reset, watch } = methods;
  const id = watch("id");

  const onLocalSubmit = ({ id, ...data }: Tables<"accounts">) => {
    if (!user?.id) return;

    if (id) {
      updateAccountMutation.mutate(
        { id, account: data },
        {
          onSuccess: () => reset(),
        },
      );
    } else {
      createAccountMutation.mutate(
        {
          ...data,
          user_id: user?.id,
          type: "checking",
        },
        {
          onSuccess: () => reset(),
        },
      );
    }
    reset();
  };

  const handleEdit = (account: Tables<"accounts">) => {
    reset(account);
  };

  const handleDelete = (id: number) => {
    deleteAccountMutation.mutate(id);
  };

  const handleCancelEdit = () => {
    reset({
      id: undefined,
      name: "",
    });
  };

  const renderTableContent = () => {
    if (isLoading) {
      return <TableSkeletonRow cols={3} />;
    }

    if (isEmpty(accounts)) {
      return <TableEmptyRows cols={3} />;
    }

    return accounts?.map((account) => (
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
    ));
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={() => onClose?.()}
      placement="right"
      size="md"
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>{t("onboarding.accountsForm.wallet")}</DrawerHeader>

        <DrawerBody>
          <Stack spacing={6}>
            <FormProvider
              methods={methods}
              onSubmit={handleSubmit(onLocalSubmit)}
            >
              <HStack>
                <RHFInput
                  size="sm"
                  name="name"
                  label={t("onboarding.accountsForm.accountName")}
                  autoFocus
                />
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
                  {t("common.cancelEdition")}
                </Button>
              )}
            </FormProvider>

            <TableContainer>
              <Table size="sm" variant="striped">
                <Thead>
                  <Tr>
                    <Th />
                    <Th>{t("onboarding.accountsForm.wallet")}</Th>
                    <Th isNumeric>{t("common.actions")}</Th>
                  </Tr>
                </Thead>
                <Tbody>{renderTableContent()}</Tbody>
              </Table>
            </TableContainer>
          </Stack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
