import { Tables } from "@/lib/supabase/database.types";
import { useAuthenticatedUser } from "@/shared/hooks";
import { useCategories, useCreateCategory } from "@/shared/hooks/useCategories";
import {
  Button,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Portal,
} from "@chakra-ui/react";
import { IconTag } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  defaultValue?: number | null;
  onChange: (category: Tables<"categories"> | null) => void;
  onAdmin: VoidFunction;
};

export default function CategorySelect({
  defaultValue,
  onAdmin,
  onChange,
}: Props) {
  const { t } = useTranslation();
  const { data: categories = [], isLoading } = useCategories();
  const createCategory = useCreateCategory();
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

  return (
    <Menu isLazy initialFocusRef={searchInputRef} placement="right-start">
      <MenuButton
        size="xs"
        variant="unstyled"
        as={Button}
        leftIcon={
          !selectedCategory || !/^\p{Emoji}/u.test(selectedCategory.name) ? (
            <IconTag size={13} />
          ) : undefined
        }
        cursor="default"
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
        {selectedCategory ? selectedCategory.name : "-"}
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
                {category.name}
              </MenuItem>
            ))}
            {filteredCategories.length === 0 && searchTerm && (
              <MenuItem onClick={handleCreateCategory}>
                {t("components.categorySelect.create")} "{searchTerm}"
              </MenuItem>
            )}
            <MenuDivider />
            <MenuItem color="gray.500" onClick={onAdmin}>
              {t("components.categorySelect.manageCategories")}
            </MenuItem>
          </MenuGroup>
        </MenuList>
      </Portal>
    </Menu>
  );
}
