import _colors from "@/lib/chakra-ui/_colors";
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
} from "@chakra-ui/react";
import { IconChevronsDown, IconChevronsUp } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  defaultValue: "income" | "expense";
  value?: "income" | "expense";
  onChange?: (value: "income" | "expense") => void;
};

export default function TypeSelect({ defaultValue, value, onChange }: Props) {
  const { t } = useTranslation();
  const [type, setType] = useState(value || defaultValue);

  const types = useMemo(
    () => [
      {
        value: "income",
        label: t("transactions.types.income"),
        icon: <IconChevronsUp size={13} color={_colors.commons[100]} />,
      },
      {
        value: "expense",
        label: t("transactions.types.expense"),
        icon: <IconChevronsDown size={13} color={_colors.commons[200]} />,
      },
    ],
    [t],
  );

  useEffect(() => {
    if (defaultValue) {
      setType(defaultValue);
    }
  }, [defaultValue]);

  const handleTypeChange = (newType: "income" | "expense") => {
    setType(newType);
    onChange?.(newType);
  };

  const selected = types.find((t) => t.value === type);
  return (
    <Menu isLazy>
      <MenuButton
        size="xs"
        variant="unstyled"
        as={Button}
        leftIcon={selected?.icon}
        cursor="default"
        w="full"
        borderRadius="inherit"
        fontWeight="semibold"
        textAlign="left"
        pl={2}
        _focus={{
          outline: "none",
          boxShadow: "none",
        }}
      >
        {selected?.label}
      </MenuButton>
      <Portal>
        <MenuList>
          {types.map((t) => (
            <MenuItem
              key={t.value}
              icon={t.icon}
              color={t.color}
              onClick={() => handleTypeChange(t.value as "income" | "expense")}
            >
              {t.label}
            </MenuItem>
          ))}
        </MenuList>
      </Portal>
    </Menu>
  );
}
