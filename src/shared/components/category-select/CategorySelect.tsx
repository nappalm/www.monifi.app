import { Tables } from "@/lib/supabase/database.types";
import { useAuthenticatedUser } from "@/shared/hooks";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
} from "@/shared/hooks/useCategories";
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
import { IconTag, IconTrash } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  defaultValue?: number | null;
  onChange: (category: Tables<"categories"> | null) => void;
};

export default function CategorySelect({ defaultValue, onChange }: Props) {
  const { t } = useTranslation();
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
        leftIcon={<IconTag size={13} />}
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
        {selectedCategory
          ? selectedCategory.name
          : t("components.categorySelect.placeholder")}
      </MenuButton>
      <Portal>
        <MenuList>
          <Input
            ref={searchInputRef}
            mb={1}
            placeholder={t("components.categorySelect.searchOrCreate")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <MenuGroup title={t("components.categorySelect.categories")}>
            {isLoading && (
              <MenuItem>{t("components.categorySelect.loading")}</MenuItem>
            )}
            {filteredCategories.map((category) => (
              <MenuItem
                key={category.id}
                onClick={() => handleSelectCategory(category)}
              >
                <Flex justify="space-between" align="center" w="full">
                  <Text>{category.name}</Text>
                  <IconButton
                    aria-label={t("components.categorySelect.deleteCategory")}
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
                {t("components.categorySelect.create")} "{searchTerm}"
              </MenuItem>
            )}
          </MenuGroup>
        </MenuList>
      </Portal>
    </Menu>
  );
}
