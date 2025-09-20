import { useAccounts } from "@/shared/hooks/useAccounts";
import { useCategories } from "@/shared/hooks/useCategories";
import {
  Box,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Portal,
} from "@chakra-ui/react";
import {
  IconArrowDownDashed,
  IconChevronLeft,
  IconFilter2,
  IconMoneybag,
  IconTags,
  IconX,
} from "@tabler/icons-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  TransactionFilters,
  useTransactionFilters,
} from "../hooks/useTransactionFilters";

type View = "main" | "category" | "account" | "type";

interface FilterButtonProps {
  filters: Partial<TransactionFilters>;
  onChange: (filters: TransactionFilters) => void;
}

export default function FilterButton({ filters, onChange }: FilterButtonProps) {
  const [view, setView] = useState<View>("main");
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { data: categories } = useCategories();
  const { data: accounts } = useAccounts();

  const categoryOptions = useMemo(
    () =>
      categories?.map((category) => ({
        label: category.name,
        value: category.id.toString(),
      })) || [],
    [categories],
  );

  const accountOptions = useMemo(
    () =>
      accounts?.map((account) => ({
        label: account.name,
        value: account.id.toString(),
      })) || [],
    [accounts],
  );

  const typeOptions = [
    { label: "Income", value: "income" },
    { label: "Expense", value: "expense" },
  ];

  const optionsMap = {
    category: categoryOptions,
    account: accountOptions,
    type: typeOptions,
  };

  const {
    filters: appliedFilters,
    setCategories,
    setAccounts,
    setTypes,
    clearFilters,
  } = useTransactionFilters(filters);

  useEffect(() => {
    onChange(appliedFilters);
  }, [appliedFilters, onChange]);

  useEffect(() => {
    if (view !== "main") {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [view]);

  const handleViewChange = (newView: View) => {
    setView(newView);
    setSearchTerm("");
  };

  const handleClose = () => {
    setView("main");
    setSearchTerm("");
  };

  const areFiltersActive =
    appliedFilters.categories.length > 0 ||
    appliedFilters.accounts.length > 0 ||
    appliedFilters.types.length > 0;

  const currentOptions = useMemo(() => {
    if (view === "main") return [];
    return optionsMap[view].filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, searchTerm]);

  const renderContent = () => {
    if (view === "main") {
      return (
        <>
          <MenuItem
            onClick={() => handleViewChange("category")}
            icon={<IconTags size={16} />}
          >
            Category{" "}
            {appliedFilters.categories.length > 0 &&
              `(${appliedFilters.categories.length})`}
          </MenuItem>
          <MenuItem
            onClick={() => handleViewChange("account")}
            icon={<IconMoneybag size={16} />}
          >
            Account{" "}
            {appliedFilters.accounts.length > 0 &&
              `(${appliedFilters.accounts.length})`}
          </MenuItem>
          <MenuItem
            onClick={() => handleViewChange("type")}
            icon={<IconArrowDownDashed size={16} />}
          >
            Type{" "}
            {appliedFilters.types.length > 0 &&
              `(${appliedFilters.types.length})`}
          </MenuItem>

          {areFiltersActive && (
            <>
              <MenuDivider />
              <MenuItem
                onClick={clearFilters}
                color="red.500"
                icon={<IconX size={16} />}
              >
                Clear all filters
              </MenuItem>
            </>
          )}
        </>
      );
    }

    const title = view.charAt(0).toUpperCase() + view.slice(1);

    let value: string[];
    let onChange: (value: any) => void;

    if (view === "category") {
      value = appliedFilters.categories;
      onChange = setCategories;
    } else if (view === "account") {
      value = appliedFilters.accounts;
      onChange = setAccounts;
    } else {
      // type
      value = appliedFilters.types;
      onChange = setTypes;
    }

    return (
      <>
        <MenuItem
          icon={<IconChevronLeft size={16} />}
          onClick={() => handleViewChange("main")}
        >
          All Filters
        </MenuItem>
        <Box px={3} py={1}>
          <Input
            ref={searchInputRef}
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="sm"
          />
        </Box>
        <MenuOptionGroup
          type="checkbox"
          title={title}
          value={value}
          onChange={onChange}
        >
          {currentOptions.map((option) => (
            <MenuItemOption key={option.value} value={option.value}>
              {option.label}
            </MenuItemOption>
          ))}
        </MenuOptionGroup>
      </>
    );
  };

  return (
    <Menu
      closeOnSelect={false}
      isLazy
      initialFocusRef={searchInputRef}
      onClose={handleClose}
    >
      <Box position="relative">
        <MenuButton
          as={IconButton}
          aria-label="Filter"
          icon={<IconFilter2 size={16} />}
          size="sm"
          borderRightRadius={0}
          color={areFiltersActive ? "red.500" : undefined}
        ></MenuButton>
      </Box>
      <Portal>
        <MenuList minWidth="240px">{renderContent()}</MenuList>
      </Portal>
    </Menu>
  );
}
