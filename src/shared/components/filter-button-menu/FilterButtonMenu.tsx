import {
  Box,
  Button,
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
  IconChevronLeft,
  IconFilter2,
  IconFilterFilled,
  IconX,
} from "@tabler/icons-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export type FilterOption = {
  label: string;
  value: string;
};

export type FilterGroup = {
  key: string;
  label: string;
  icon: React.ReactElement;
  options: FilterOption[];
};

interface FilterButtonMenuProps {
  filterGroups: FilterGroup[];
  appliedFilters: Record<string, string[]>;
  onFilterChange: (key: string, value: string[]) => void;
  onClearFilters: () => void;
  areFiltersActive: boolean;
}

export default function FilterButtonMenu({
  filterGroups,
  appliedFilters,
  onFilterChange,
  onClearFilters,
  areFiltersActive,
}: FilterButtonMenuProps) {
  const { t } = useTranslation();
  const [view, setView] = useState<string>("main");
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (view !== "main") {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [view]);

  const handleViewChange = (newView: string) => {
    setView(newView);
    setSearchTerm("");
  };

  const handleClose = () => {
    setView("main");
    setSearchTerm("");
  };

  const currentGroup = useMemo(() => {
    if (view === "main") return null;
    return filterGroups.find((group) => group.key === view);
  }, [view, filterGroups]);

  const currentOptions = useMemo(() => {
    if (!currentGroup) return [];
    return currentGroup.options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [currentGroup, searchTerm]);

  const renderContent = () => {
    if (view === "main") {
      return (
        <>
          {filterGroups.map((group) => (
            <MenuItem
              key={group.key}
              onClick={() => handleViewChange(group.key)}
              icon={group.icon}
            >
              {group.label}{" "}
              {appliedFilters[group.key]?.length > 0 &&
                `(${appliedFilters[group.key].length})`}
            </MenuItem>
          ))}

          {areFiltersActive && (
            <>
              <MenuDivider />
              <MenuItem
                onClick={onClearFilters}
                color="red.500"
                icon={<IconX size={16} />}
              >
                {t("components.filterButtonMenu.clearAllFilters")}
              </MenuItem>
            </>
          )}
        </>
      );
    }

    if (!currentGroup) return null;

    return (
      <>
        <MenuItem
          icon={<IconChevronLeft size={16} />}
          onClick={() => handleViewChange("main")}
        >
          {t("components.filterButtonMenu.allFilters")}
        </MenuItem>
        <Box px={3} py={1}>
          <Input
            ref={searchInputRef}
            placeholder={t("components.filterButtonMenu.search")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="sm"
          />
        </Box>
        <MenuOptionGroup
          type="checkbox"
          title={currentGroup.label}
          value={appliedFilters[currentGroup.key]}
          onChange={(value) =>
            onFilterChange(currentGroup.key, value as string[])
          }
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
          as={Button}
          aria-label={t("components.filterButtonMenu.filter")}
          leftIcon={<IconFilterFilled size={16} />}
          size="sm"
          borderRightRadius={0}
          color={areFiltersActive ? "red.500" : undefined}
          variant="solid"
        >
          Filter data
        </MenuButton>
      </Box>
      <Portal>
        <MenuList minWidth="240px">{renderContent()}</MenuList>
      </Portal>
    </Menu>
  );
}
