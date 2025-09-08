import {
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuOptionGroup,
  MenuItemOption,
  Input,
  Portal,
  Box,
  MenuDivider,
} from "@chakra-ui/react";
import {
  IconFilter2,
  IconChevronLeft,
  IconTags,
  IconMoneybag,
  IconArrowDownDashed,
  IconX,
} from "@tabler/icons-react";
import { useState, useMemo, useRef, useEffect } from "react";
import {
  TransactionFilters,
  useTransactionFilters,
} from "../hooks/useTransactionFilters";

type View = "main" | "category" | "account" | "type";

const categoryOptions = [
  { label: "Food", value: "food" },
  { label: "Transportation", value: "transportation" },
  { label: "Shopping", value: "shopping" },
];

const accountOptions = [
  { label: "Cash", value: "cash" },
  { label: "Credit Card", value: "credit_card" },
  { label: "Debit Card", value: "debit_card" },
];

const typeOptions = [
  { label: "Income", value: "income" },
  { label: "Expense", value: "expense" },
];

const optionsMap = {
  category: categoryOptions,
  account: accountOptions,
  type: typeOptions,
};

interface FilterButtonProps {
  filters: Partial<TransactionFilters>;
  onChange: (filters: TransactionFilters) => void;
}

export default function FilterButton({ filters, onChange }: FilterButtonProps) {
  const [view, setView] = useState<View>("main");
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

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
      <MenuButton
        as={IconButton}
        aria-label="Filter"
        icon={<IconFilter2 size={16} />}
        size="sm"
        borderRightRadius={0}
      />
      <Portal>
        <MenuList minWidth="240px">{renderContent()}</MenuList>
      </Portal>
    </Menu>
  );
}
