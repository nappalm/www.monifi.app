import {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/lib/supabase/database.types";
import {
  FormProvider,
  RHFInput,
  RHFLineColors,
  useAuthenticatedUser,
  Carousel,
} from "@/shared";
import {
  useAccounts,
  useCreateAccount,
  useDeleteAccount,
  useUpdateAccount,
} from "@/shared/hooks/useAccounts";
import {
  Button,
  ButtonGroup,
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
  Skeleton,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { IconWallet } from "@tabler/icons-react";
import { isEmpty } from "lodash";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { OnboardingAccountFormData } from "../utils/types";
import { onboardingAccountFormSchema } from "../utils/yup";

export default function OnboardingAccountsForm() {
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
        <Card w="70%" size="sm">
          <CardBody>
            <Stack spacing={4}>
              <Skeleton height="60px" borderRadius="md" />
            </Stack>
          </CardBody>
        </Card>
      );
    }

    return accounts?.map((account) => (
      <Card key={account.id} w="70%">
        <CardBody>
          <Stack gap={0}>
            <Flex align="center" gap={2}>
              <IconWallet />
              <Text size="md" flex={1}>
                {account.name}
              </Text>
            </Flex>
            <HStack justify="space-between" mt={-1}>
              <Text fontSize="sm" opacity={0.5} ml={8}>
                {t("onboarding.accountsForm.wallet")}
              </Text>
              <ButtonGroup size="sm" spacing={0} variant="ghost">
                <Button
                  aria-label="Edit"
                  onClick={() => {
                    handleEdit(account);
                    drawer.onOpen();
                  }}
                >
                  {t("onboarding.accountsForm.edit")}
                </Button>
                <Button
                  aria-label="Delete"
                  colorScheme="red"
                  onClick={() => handleDelete(account.id)}
                >
                  {t("onboarding.accountsForm.remove")}
                </Button>
              </ButtonGroup>
            </HStack>
          </Stack>
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
              <Stack>
                <RHFLineColors />
                <RHFInput
                  name="name"
                  label={t("onboarding.accountsForm.accountName")}
                  autoFocus
                  description={t("onboarding.accountsForm.walletDescription")}
                />
                <br />
                <Button
                  aria-label="Add Account Button"
                  type="submit"
                  colorScheme="cyan"
                >
                  {t("common.save")}
                </Button>
              </Stack>
            </FormProvider>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {!isEmpty(accounts) && (
        <Carousel
          height="200px"
          showControls={!isEmpty(accounts) && !isLoading}
        >
          {renderCarouselContent()}
        </Carousel>
      )}

      <Button colorScheme="cyan" onClick={handleAddNew}>
        {t("onboarding.accountsForm.addNewAccount")}
      </Button>
    </Stack>
  );
}
