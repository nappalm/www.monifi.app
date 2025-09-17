import {
  Button,
  Flex,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
  Portal,
  Text,
} from "@chakra-ui/react";
import { IconTagFilled, IconTrash } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
} from "@/shared/hooks/useCategories";
import { useAuthenticatedUser } from "@/shared/hooks";
import { Tables } from "@/lib/supabase/database.types";

type Props = {
  defaultValue?: number | null;
  onChange: (category: Tables<"categories"> | null) => void;
};

export default function CategorySelect({ defaultValue, onChange }: Props) {
  const { data: categories = [], isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();
  const { user } = useAuthenticatedUser();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] =
    useState<Tables<"categories"> | null>(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (defaultValue && categories.length) {
      const defaultCategory = categories.find((c) => c.id === defaultValue);
      setSelectedCategory(defaultCategory || null);
    }
  }, [defaultValue, categories]);

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCreateCategory = () => {
    if (!user) return;
    createCategory.mutate(
      {
        name: searchTerm,
        user_id: user.id,
      },
      {
        onSuccess: (newCategory) => {
          setSelectedCategory(newCategory);
          onChange(newCategory);
        },
      },
    );
    setSearchTerm("");
  };

  const handleSelectCategory = (category: Tables<"categories">) => {
    setSelectedCategory(category);
    onChange(category);
  };

  const handleDeleteCategory = (
    e: React.MouseEvent,
    categoryToDelete: Tables<"categories">,
  ) => {
    e.stopPropagation();
    deleteCategory.mutate(categoryToDelete.id);
    if (selectedCategory?.id === categoryToDelete.id) {
      setSelectedCategory(null);
      onChange(null);
    }
  };

  return (
    <Menu isLazy initialFocusRef={searchInputRef}>
      <MenuButton
        size="xs"
        variant="unstyled"
        as={Button}
        leftIcon={<IconTagFilled size={13} />}
        w="full"
        textAlign="left"
        pl={2}
        borderRadius="inherit"
        fontWeight="semibold"
        _focus={{
          outline: "none",
          boxShadow: "none",
        }}
      >
        {selectedCategory ? selectedCategory.name : "Category"}
      </MenuButton>
      <Portal>
        <MenuList>
          <Input
            ref={searchInputRef}
            mb={1}
            placeholder="Search or create"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <MenuGroup title="Categories">
            {isLoading && <MenuItem>Loading...</MenuItem>}
            {filteredCategories.map((category) => (
              <MenuItem
                key={category.id}
                onClick={() => handleSelectCategory(category)}
              >
                <Flex justify="space-between" align="center" w="full">
                  <Text>{category.name}</Text>
                  <IconButton
                    aria-label="delete category"
                    icon={<IconTrash size={16} />}
                    size="xs"
                    variant="ghost"
                    onClick={(e) => handleDeleteCategory(e, category)}
                  />
                </Flex>
              </MenuItem>
            ))}
            {filteredCategories.length === 0 && searchTerm && (
              <MenuItem onClick={handleCreateCategory}>
                Create "{searchTerm}"
              </MenuItem>
            )}
          </MenuGroup>
        </MenuList>
      </Portal>
    </Menu>
  );
}
