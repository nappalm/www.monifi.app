import {
  FormProvider,
  RHFAmount,
  RHFCheckbox,
  RHFDayMonth,
  RHFInput,
  RHFSwitch,
} from "@/shared";
import {
  Button,
  ButtonGroup,
  Collapse,
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
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { TablesInsert, TablesUpdate } from "@/lib/supabase/database.types";
import { newBudgetSchema } from "../utils/yup";

type FormValues = Omit<TablesInsert<"budgets">, "user_id"> & {
  includeYear: boolean;
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
      recurrent: true,
      start_day: null,
      start_month: null,
      end_day: null,
      end_month: null,
      includeYear: false,
      specific_year: null,
      ...defaultValues,
    },
  });

  useEffect(() => {
    methods.reset({
      name: "",
      amount: 0,
      recurrent: true,
      start_day: null,
      start_month: null,
      end_day: null,
      end_month: null,
      includeYear: false,
      specific_year: null,
      ...defaultValues,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  const recurrent = methods.watch("recurrent");
  const includeYear = methods.watch("includeYear");

  const handleSubmit = (values: FormValues) => {
    const payload = {
      name: values.name,
      amount: Number(values.amount) || 0,
      recurrent: values.recurrent,
      start_day: values.recurrent ? 1 : Number(values.start_day) || null,
      start_month: values.recurrent ? null : Number(values.start_month) || null,
      end_day: values.recurrent ? null : Number(values.end_day) || null,
      end_month: values.recurrent ? null : Number(values.end_month) || null,
      specific_year:
        !values.recurrent && !values.includeYear ? values.specific_year : null,
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
              <RHFSwitch
                colorScheme="teal"
                name="recurrent"
                label={t("budgets.modal.recurrent")}
              />
              <Collapse in={!recurrent} animateOpacity>
                <Stack gap={3}>
                  <RHFDayMonth
                    label={t("budgets.modal.startDate")}
                    dayName="start_day"
                    monthName="start_month"
                  />
                  <RHFDayMonth
                    label={t("budgets.modal.endDate")}
                    dayName="end_day"
                    monthName="end_month"
                  />
                  <RHFCheckbox
                    name="includeYear"
                    label={t("budgets.modal.repeatEveryYear")}
                  />
                  <Collapse in={!includeYear} animateOpacity>
                    <RHFInput
                      name="specific_year"
                      label={t("budgets.modal.year")}
                      placeholder="2026"
                      type="number"
                    />
                  </Collapse>
                </Stack>
              </Collapse>
            </Stack>
          </ModalBody>
          <ModalFooter justifyContent="space-between">
            {defaultValues ? (
              <Button
                colorScheme="red"
                variant="ghost"
                onClick={onDelete}
                isLoading={isLoadingDelete}
                isDisabled={isLoading}
              >
                {t("budgets.modal.delete")}
              </Button>
            ) : (
              <span />
            )}
            <ButtonGroup>
              <Button
                onClick={onClose}
                isDisabled={isLoading || isLoadingDelete}
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
