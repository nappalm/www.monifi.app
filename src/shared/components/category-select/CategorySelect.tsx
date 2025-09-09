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
import { useRef, useState } from "react";

interface Category {
  id: string;
  name: string;
}

const initialCategories: Category[] = [
  {
    id: "1",
    name: "Transporte",
  },
  {
    id: "2",
    name: "Comida",
  },
  {
    id: "3",
    name: "Finanzas",
  },
  {
    id: "4",
    name: "Control de gastos",
  },
];

export default function CategorySelect() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const searchInputRef = useRef(null);

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCreateCategory = () => {
    const newCategory: Category = {
      id: `${categories.length + 1}`,
      name: searchTerm,
    };
    setCategories([...categories, newCategory]);
    setSelectedCategory(newCategory);
    setSearchTerm("");
  };

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
  };

  const handleDeleteCategory = (
    e: React.MouseEvent,
    categoryToDelete: Category,
  ) => {
    e.stopPropagation();
    setCategories(
      categories.filter((category) => category.id !== categoryToDelete.id),
    );
    if (selectedCategory?.id === categoryToDelete.id) {
      setSelectedCategory(null);
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
