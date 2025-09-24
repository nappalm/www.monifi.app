import { Tables } from "@/lib/supabase/database.types";
import { FormProvider, RHFInput } from "@/shared";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "@/shared/hooks/useCategories";
import { Button, HStack, IconButton, Stack, Text } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function CategoriesForm() {
  const { data: categories, isLoading } = useCategories();
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const methods = useForm<Tables<"categories">>();

  const { handleSubmit, reset, setValue } = methods;

  const onSubmit = (data: Tables<"categories">) => {
    if (data.id) {
      updateCategoryMutation.mutate({ id: data.id, category: data });
    } else {
      createCategoryMutation.mutate(data);
    }
    reset();
  };

  const handleEdit = (category: Tables<"categories">) => {
    setValue("id", category.id);
    setValue("name", category.name);
    setValue("color", category.color);
  };

  const handleDelete = (id: number) => {
    deleteCategoryMutation.mutate(id);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <Stack spacing={6}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4}>
          <RHFInput name="name" label="Category Name" />
          <RHFInput name="color" label="Color" type="color" />
          <Button type="submit">Save Category</Button>
        </Stack>
      </FormProvider>

      <Stack spacing={4}>
        {categories?.map((category) => (
          <HStack key={category.id} justify="space-between">
            <Text>{category.name}</Text>
            <HStack>
              <IconButton
                aria-label="Edit category"
                icon={<FaEdit />}
                onClick={() => handleEdit(category)}
              />
              <IconButton
                aria-label="Delete category"
                icon={<FaTrash />}
                onClick={() => handleDelete(category.id)}
              />
            </HStack>
          </HStack>
        ))}
      </Stack>
    </Stack>
  );
}
