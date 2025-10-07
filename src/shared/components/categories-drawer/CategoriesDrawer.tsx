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
  IconTag,
  IconTrashFilled,
} from "@tabler/icons-react";
import { isEmpty } from "lodash";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

export default function CategoriesDrawer({
  isOpen = false,
  onClose,
}: UseDisclosureProps) {
  const { t } = useTranslation();
  const { data: categories, isLoading } = useCategories();
  const { user } = useAuthenticatedUser();

  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const methods = useForm<Tables<"categories">>();

  const { handleSubmit, reset, watch } = methods;
  const id = watch("id");

  const onLocalSubmit = ({ id, ...data }: Tables<"categories">) => {
    if (!user?.id) return;

    if (id) {
      updateCategoryMutation.mutate(
        { id, category: data },
        {
          onSuccess: () => reset(),
        },
      );
    } else {
      createCategoryMutation.mutate(
        {
          ...data,
          user_id: user?.id,
        },
        {
          onSuccess: () => reset(),
        },
      );
    }
    reset();
  };

  const handleEdit = (category: Tables<"categories">) => {
    reset(category);
  };

  const handleDelete = (id: number) => {
    deleteCategoryMutation.mutate(id);
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
    <Drawer
      isOpen={isOpen}
      onClose={() => onClose?.()}
      placement="right"
      size="md"
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>{t("onboarding.categoriesForm.category")}</DrawerHeader>

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
                  label={t("onboarding.categoriesForm.categoryName")}
                  autoFocus
                />
                <IconButton
                  aria-label="Add Category Button"
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
                    <Th>{t("onboarding.categoriesForm.category")}</Th>
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
