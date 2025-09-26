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
import {
  IconCheck,
  IconPencil,
  IconTag,
  IconTrashFilled,
} from "@tabler/icons-react";
import { isEmpty } from "lodash";
import { useForm } from "react-hook-form";

export default function CategoriesForm() {
  const { data: categories, isLoading } = useCategories();
  const { user } = useAuthenticatedUser();

  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const methods = useForm<Tables<"categories">>();

  const { handleSubmit, reset, setValue, watch } = methods;
  const id = watch("id");

  const onLocalSubmit = ({ id, ...data }: Tables<"categories">) => {
    if (!user?.id) return;

    if (id) {
      updateCategoryMutation.mutate({ id, category: data });
    } else {
      createCategoryMutation.mutate({
        ...data,
        user_id: user?.id,
      });
    }
    reset();
  };

  const handleEdit = (category: Tables<"categories">) => {
    setValue("id", category.id);
    setValue("name", category.name);
  };

  const handleDelete = (id: number) => {
    deleteCategoryMutation.mutate(id);
  };

  const handleCancelEdit = () => {
    setValue("id", "");
    setValue("name", "");
  };

  return (
    <Stack spacing={6}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onLocalSubmit)}>
        <HStack>
          <RHFInput size="sm" name="name" label="Category Name" autoFocus />
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
            Cancel edition
          </Button>
        )}
      </FormProvider>

      <TableContainer>
        <Table size="sm" variant="striped">
          <Thead>
            <Tr>
              <Th />
              <Th>Category</Th>
              <Th isNumeric>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {isLoading ? (
              <TableSkeletonRow cols={3} />
            ) : isEmpty(categories) ? (
              <TableEmptyRows cols={3} />
            ) : (
              categories?.map((category) => (
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
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
