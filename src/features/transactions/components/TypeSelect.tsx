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
import { useState } from "react";

const types = [
  {
    value: "income",
    label: "Income",
    icon: <IconChevronsUp size={13} color={_colors.cyan[500]} />,
    color: _colors.cyan[500],
  },
  {
    value: "expense",
    label: "Expense",
    icon: <IconChevronsDown size={13} color={_colors.red[500]} />,
    color: _colors.red[500],
  },
];

export default function TypeSelect() {
  const [type, setType] = useState("expense");
  const selected = types.find((t) => t.value === type);
  return (
    <Menu isLazy>
      <MenuButton
        size="xs"
        variant="unstyled"
        as={Button}
        leftIcon={selected?.icon}
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
              onClick={() => setType(t.value)}
            >
              {t.label}
            </MenuItem>
          ))}
        </MenuList>
      </Portal>
    </Menu>
  );
}
