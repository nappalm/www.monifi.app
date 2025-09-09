import {
  Button,
  Input,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
  Portal,
} from "@chakra-ui/react";
import { IconReceiptDollarFilled } from "@tabler/icons-react";
import { useRef, useState } from "react";

interface Account {
  id: string;
  name: string;
}

const initialAccounts: Account[] = [
  {
    id: "1",
    name: "BBVA Credit",
  },
  {
    id: "2",
    name: "BCP Debit",
  },
  {
    id: "3",
    name: "Interbank Debit",
  },
  {
    id: "4",
    name: "Cash",
  },
];

export default function AccountSelect() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const searchInputRef = useRef(null);

  const filteredAccounts = accounts.filter((account) =>
    account.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCreateAccount = () => {
    const newAccount: Account = {
      id: `${accounts.length + 1}`,
      name: searchTerm,
    };
    setAccounts([...accounts, newAccount]);
    setSelectedAccount(newAccount);
    setSearchTerm("");
  };

  const handleSelectAccount = (account: Account) => {
    setSelectedAccount(account);
  };

  return (
    <Menu isLazy initialFocusRef={searchInputRef}>
      <MenuButton
        size="xs"
        variant="unstyled"
        as={Button}
        leftIcon={<IconReceiptDollarFilled size={13} />}
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
        {selectedAccount ? selectedAccount.name : "Account"}
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
          <MenuGroup title="Accounts">
            {filteredAccounts.map((account) => (
              <MenuItem
                key={account.id}
                onClick={() => handleSelectAccount(account)}
              >
                {account.name}
              </MenuItem>
            ))}
            {filteredAccounts.length === 0 && searchTerm && (
              <MenuItem onClick={handleCreateAccount}>
                Create "{searchTerm}"
              </MenuItem>
            )}
          </MenuGroup>
        </MenuList>
      </Portal>
    </Menu>
  );
}
