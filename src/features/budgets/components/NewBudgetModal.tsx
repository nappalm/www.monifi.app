import { TablesInsert, TablesUpdate } from "@/lib/supabase/database.types";
import { FormProvider, RHFAmount, RHFInput } from "@/shared";
import {
  Button,
  ButtonGroup,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  UseDisclosureProps,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { IconTrashFilled } from "@tabler/icons-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { newBudgetSchema } from "../utils/yup";

type FormValues = Omit<TablesInsert<"budgets">, "user_id"> & {
  amount: number;
};

type Props = UseDisclosureProps & {
  defaultValues?: Partial<FormValues>;
  isLoading?: boolean;
  isLoadingDelete?: boolean;
  onCreate?: (item: Omit<TablesInsert<"budgets">, "user_id">) => void;
  onUpdate?: (item: Omit<TablesUpdate<"budgets">, "user_id">) => void;
  onDelete?: () => void;
};

export default function NewBudgetModal({
  isOpen = false,
  onClose,
  defaultValues,
  isLoading = false,
  isLoadingDelete = false,
  onCreate,
  onUpdate,
  onDelete,
}: Props) {
  const { t } = useTranslation();
  const methods = useForm<FormValues>({
    resolver: yupResolver(newBudgetSchema(t)) as any,
    defaultValues: {
      name: "",
      amount: 0,
      ...defaultValues,
    },
  });

  useEffect(() => {
    methods.reset({
      name: "",
      amount: 0,
      ...defaultValues,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  const handleSubmit = (values: FormValues) => {
    const payload = {
      name: values.name,
      amount: Number(values.amount) || 0,
    };

    if (defaultValues) {
      onUpdate?.(payload);
    } else {
      onCreate?.(payload);
    }
  };

  return (
    <Modal size="sm" isOpen={isOpen} onClose={() => onClose?.()}>
      <ModalOverlay />
      <ModalContent>
        <FormProvider
          methods={methods}
          onSubmit={methods.handleSubmit(handleSubmit)}
        >
          <ModalHeader>
            {defaultValues
              ? t("budgets.modal.titleEdit")
              : t("budgets.modal.titleCreate")}

            {defaultValues && (
              <Button
                colorScheme="red"
                variant="ghost"
                onClick={onDelete}
                isLoading={isLoadingDelete}
                isDisabled={isLoading}
                leftIcon={<IconTrashFilled size={16} />}
                position="absolute"
                top={2}
                right={2}
              >
                {t("budgets.modal.delete")}
              </Button>
            )}
          </ModalHeader>
          <ModalBody>
            <Stack gap={3}>
              <Text color="gray.500">{t("budgets.modal.description")}</Text>
              <RHFInput
                name="name"
                label={t("budgets.modal.name")}
                placeholder={t("budgets.modal.namePlaceholder")}
              />
              <RHFAmount
                name="amount"
                label={t("budgets.modal.amount")}
                placeholder="$0"
              />
            </Stack>
          </ModalBody>
          <ModalFooter justifyContent="flex-end">
            <ButtonGroup>
              <Button
                onClick={onClose}
                isDisabled={isLoading || isLoadingDelete}
                variant="ghost"
              >
                {t("budgets.modal.cancel")}
              </Button>
              <Button
                colorScheme="teal"
                variant="solid"
                type="submit"
                isLoading={isLoading}
                isDisabled={isLoadingDelete}
              >
                {t("budgets.modal.save")}
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </FormProvider>
      </ModalContent>
    </Modal>
  );
}
