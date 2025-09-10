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
import { IconReceiptDollarFilled, IconTrash } from "@tabler/icons-react";
import { useRef, useState } from "react";
import {
  useAccounts,
  useCreateAccount,
  useDeleteAccount,
} from "@/shared/hooks/useAccounts";
import { useAuthenticatedUser } from "@/shared/hooks";
import { Tables } from "@/lib/supabase/database.types";

export default function AccountSelect() {
  const { data: accounts = [], isLoading } = useAccounts();
  const createAccount = useCreateAccount();
  const deleteAccount = useDeleteAccount();
  const { user } = useAuthenticatedUser();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedAccount, setSelectedAccount] =
    useState<Tables<"accounts"> | null>(null);
  const searchInputRef = useRef(null);

  const filteredAccounts = accounts.filter((account) =>
    account.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCreateAccount = () => {
    if (!user) return;
    createAccount.mutate(
      {
        name: searchTerm,
        user_id: user.id,
        type: "checking", // default type
      },
      {
        onSuccess: (newAccount) => {
          setSelectedAccount(newAccount);
        },
      },
    );
    setSearchTerm("");
  };

  const handleSelectAccount = (account: Tables<"accounts">) => {
    setSelectedAccount(account);
  };

  const handleDeleteAccount = (
    e: React.MouseEvent,
    accountToDelete: Tables<"accounts">,
  ) => {
    e.stopPropagation();
    deleteAccount.mutate(accountToDelete.id);
    if (selectedAccount?.id === accountToDelete.id) {
      setSelectedAccount(null);
    }
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
            {isLoading && <MenuItem>Loading...</MenuItem>}
            {filteredAccounts.map((account) => (
              <MenuItem
                key={account.id}
                onClick={() => handleSelectAccount(account)}
              >
                <Flex justify="space-between" align="center" w="full">
                  <Text>{account.name}</Text>
                  <IconButton
                    aria-label="delete account"
                    icon={<IconTrash size={16} />}
                    size="xs"
                    variant="ghost"
                    onClick={(e) => handleDeleteAccount(e, account)}
                  />
                </Flex>
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
