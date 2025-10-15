import { Tables } from "@/lib/supabase/database.types";
import {
  FormProvider,
  RHFInput,
  TableSkeletonRow,
  useAuthenticatedUser,
} from "@/shared";
import TableEmptyRows from "@/shared/components/table-empty-rows";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "@/shared/hooks/useCategories";
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
import { yupResolver } from "@hookform/resolvers/yup";
import {
  IconCheck,
  IconPencil,
  IconTag,
  IconTrashFilled,
} from "@tabler/icons-react";
import { isEmpty } from "lodash";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { OnboardingCategoryFormData } from "../utils/types";
import { onboardingCategoryFormSchema } from "../utils/yup";

export default function OnboardingCategoriesForm() {
  const { t } = useTranslation();
  const { data: categories, isLoading } = useCategories();
  const { user } = useAuthenticatedUser();

  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const [editingCategoryId, setEditingCategoryId] = React.useState<
    number | null
  >(null);

  const methods = useForm({
    resolver: yupResolver(onboardingCategoryFormSchema(t)) as any,
    defaultValues: {
      name: "",
    },
  });

  const { handleSubmit, reset } = methods;

  const onLocalSubmit = async (formData: OnboardingCategoryFormData) => {
    if (!user?.id) return;

    if (editingCategoryId) {
      await updateCategoryMutation.mutateAsync({
        id: editingCategoryId,
        category: { name: formData.name },
      });
    } else {
      await createCategoryMutation.mutateAsync({
        name: formData.name,
        user_id: user.id,
      });
    }

    onRestoreForm();
  };

  const handleEdit = (category: Tables<"categories">) => {
    setEditingCategoryId(category.id);
    reset({
      name: category.name,
    } as any);
  };

  const handleDelete = (id: number) => {
    deleteCategoryMutation.mutate(id);
  };

  const onRestoreForm = () => {
    setEditingCategoryId(null);
    reset({
      name: "",
    });
  };

  const renderTableContent = () => {
    if (isLoading) {
      return <TableSkeletonRow cols={3} />;
    }

    if (isEmpty(categories)) {
      return <TableEmptyRows cols={3} />;
    }

    return categories?.map((category) => (
      <Tr key={category.id}>
        <Td w="10px" opacity={0.5}>
          <IconTag size={18} />
        </Td>
        <Td>{category.name}</Td>
        <Td isNumeric w="10px">
          <ButtonGroup size="xs" spacing={1}>
            <IconButton
              aria-label="Edit"
              icon={<IconPencil size={15} />}
              variant="ghost"
              onClick={() => handleEdit(category)}
            />
            <IconButton
              aria-label="Delete"
              icon={<IconTrashFilled size={15} />}
              variant="ghost"
              onClick={() => handleDelete(category.id)}
            />
          </ButtonGroup>
        </Td>
      </Tr>
    ));
  };

  return (
    <Stack spacing={6}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onLocalSubmit)}>
        <HStack>
          <RHFInput
            name="name"
            label={t("onboarding.categoriesForm.categoryName")}
            autoFocus
          />
          <IconButton
            aria-label="Add Category Button"
            type="submit"
            w="fit-content"
            icon={<IconCheck size={18} />}
            size="lg"
          />
        </HStack>
        {editingCategoryId && (
          <Button
            p={2}
            size="xs"
            variant="unstyled"
            textAlign="left"
            color="red.600"
            onClick={onRestoreForm}
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
              <Th>{t("onboarding.categoriesForm.category")}</Th>
              <Th isNumeric>{t("common.actions")}</Th>
            </Tr>
          </Thead>
          <Tbody>{renderTableContent()}</Tbody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
