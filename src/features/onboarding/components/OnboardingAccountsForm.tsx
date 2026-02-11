import {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/lib/supabase/database.types";
import {
  ButtonSpinner,
  FormProvider,
  RHFInput,
  RHFLineColors,
  useAuthenticatedUser,
} from "@/shared";
import {
  useAccounts,
  useCreateAccount,
  useDeleteAccount,
  useUpdateAccount,
} from "@/shared/hooks/useAccounts";
import {
  Box,
  Button,
  Card,
  CardBody,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  IconCardsFilled,
  IconChevronDown,
  IconCreditCardFilled,
  IconPencil,
  IconTrashFilled,
} from "@tabler/icons-react";
import { isEmpty } from "lodash";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { OnboardingAccountFormData } from "../utils/types";
import { onboardingAccountFormSchema } from "../utils/yup";
import EmptyWallets from "./EmptyWallets";

type Props = { onContinue: VoidFunction };
export default function OnboardingAccountsForm({ onContinue }: Props) {
  const { t } = useTranslation();
  const { data: accounts, isLoading } = useAccounts();
  const { user } = useAuthenticatedUser();

  const createAccountMutation = useCreateAccount();
  const updateAccountMutation = useUpdateAccount();
  const deleteAccountMutation = useDeleteAccount();

  const drawer = useDisclosure();

  const [editingAccountId, setEditingAccountId] = React.useState<number | null>(
    null,
  );

  const methods = useForm({
    resolver: yupResolver(onboardingAccountFormSchema(t)) as any,
    defaultValues: {
      name: "",
      color: undefined,
    },
  });

  const { handleSubmit, reset } = methods;

  const onLocalSubmit = async (formData: OnboardingAccountFormData) => {
    if (!user?.id) return;

    if (editingAccountId) {
      const updateData: TablesUpdate<"accounts"> = {
        name: formData.name,
        color: formData.color,
      };

      await updateAccountMutation.mutateAsync({
        id: editingAccountId,
        account: updateData,
      });
    } else {
      const insertData: TablesInsert<"accounts"> = {
        name: formData.name,
        color: formData.color,
        user_id: user.id,
        type: "checking",
      };

      await createAccountMutation.mutateAsync(insertData);
    }

    onRestoreForm();
  };

  const handleEdit = (account: Tables<"accounts">) => {
    setEditingAccountId(account.id);
    reset({
      name: account.name,
      color: account.color ?? undefined,
    } as any);
  };

  const handleDelete = (id: number) => {
    deleteAccountMutation.mutate(id);
  };

  const handleAddNew = () => {
    onRestoreForm();
    drawer.onOpen();
  };

  const onRestoreForm = () => {
    setEditingAccountId(null);
    drawer.onClose();
    reset({
      name: "",
      color: undefined,
    });
  };

  const renderCarouselContent = () => {
    if (isLoading) {
      return (
        <Card variant="solid" size="sm">
          <CardBody>
            <Stack spacing={4}>
              <Skeleton height="60px" borderRadius="md" />
            </Stack>
          </CardBody>
        </Card>
      );
    }

    return accounts?.map((account) => (
      <Card key={account.id} variant="solid" size="sm">
        <CardBody>
          <HStack gap={0} justify="space-between">
            <Flex align="center" gap={2}>
              <IconCardsFilled />
              <HStack gap={2}>
                <Text size="md">{account.name}</Text>
              </HStack>
              <Box
                h="6px"
                w="15px"
                position="absolute"
                bottom={3}
                left="45px"
                borderRadius="full"
                bg={account.color ?? undefined}
              />
            </Flex>
            <Menu>
              <MenuButton
                as={Button}
                size="sm"
                variant="solid"
                rightIcon={<IconChevronDown size={16} />}
              >
                {t("onboarding.accountsForm.wallet")}
              </MenuButton>
              <MenuList>
                <MenuItem
                  icon={<IconPencil size={16} />}
                  onClick={() => {
                    handleEdit(account);
                    drawer.onOpen();
                  }}
                >
                  {t("onboarding.accountsForm.edit")}
                </MenuItem>
                <MenuItem
                  icon={<IconTrashFilled size={16} />}
                  color="red.500"
                  onClick={() => handleDelete(account.id)}
                >
                  {t("onboarding.accountsForm.remove")}
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </CardBody>
      </Card>
    ));
  };

  return (
    <Stack spacing={6}>
      <Drawer {...drawer} size="sm">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{t("onboarding.accountsForm.wallet")}</DrawerHeader>
          <DrawerBody>
            <FormProvider
              methods={methods}
              onSubmit={handleSubmit(onLocalSubmit)}
            >
              <Stack gap={5}>
                <RHFLineColors />
                <RHFInput
                  name="name"
                  label={t("onboarding.accountsForm.accountName")}
                  autoFocus
                  description={t("onboarding.accountsForm.walletDescription")}
                  placeholder="American Express TDC"
                />
                <RHFInput
                  name="amount"
                  label={t("onboarding.accountsForm.accountAmount")}
                  autoFocus
                  type="number"
                  placeholder="$0.00 - current amount"
                />
                <br />
                <Button
                  aria-label="Add Account Button"
                  type="submit"
                  colorScheme="cyan"
                  variant="solid"
                  isLoading={
                    updateAccountMutation.isPending ||
                    createAccountMutation.isPending
                  }
                  spinner={<ButtonSpinner />}
                  loadingText={t("common.save") + "..."}
                >
                  {t("common.save")}
                </Button>
              </Stack>
            </FormProvider>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {isEmpty(accounts) && <EmptyWallets />}
      {!isEmpty(accounts) && (
        <Stack spacing={3}>{renderCarouselContent()}</Stack>
      )}

      <HStack justify="end" gap={2} mt={10}>
        <Button onClick={onContinue} variant="ghost">
          {t("common.continue")}
        </Button>
        <Button
          onClick={handleAddNew}
          variant="solid"
          colorScheme="cyan"
          leftIcon={<IconCreditCardFilled size={16} />}
        >
          {t("onboarding.accountsForm.addNewAccount")}
        </Button>
      </HStack>
    </Stack>
  );
}
