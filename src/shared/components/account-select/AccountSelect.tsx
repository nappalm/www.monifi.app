import { Tables } from "@/lib/supabase/database.types";
import { useAuthenticatedUser } from "@/shared/hooks";
import {
  useAccounts,
  useCreateAccount,
  useDeleteAccount,
} from "@/shared/hooks/useAccounts";
import {
  Button,
  Flex,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Portal,
  Text,
} from "@chakra-ui/react";
import { IconTrash, IconWallet } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  defaultValue?: number | null;
  onChange: (account: Tables<"accounts"> | null) => void;
  onAdmin: VoidFunction;
};

export default function AccountSelect({
  defaultValue,
  onChange,
  onAdmin,
}: Props) {
  const { t } = useTranslation();
  const { data: accounts = [], isLoading } = useAccounts();
  const createAccount = useCreateAccount();
  const deleteAccount = useDeleteAccount();
  const { user } = useAuthenticatedUser();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedAccount, setSelectedAccount] =
    useState<Tables<"accounts"> | null>(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (defaultValue && accounts.length) {
      const defaultAccount = accounts.find((a) => a.id === defaultValue);
      setSelectedAccount(defaultAccount || null);
    }
  }, [defaultValue, accounts]);

  const filteredAccounts = accounts.filter((account) =>
    account.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCreateAccount = () => {
    if (!user) return;
    createAccount.mutate(
      {
        name: searchTerm,
        user_id: user.id,
        type: "checking",
      },
      {
        onSuccess: (newAccount) => {
          setSelectedAccount(newAccount);
          onChange(newAccount);
        },
      },
    );
    setSearchTerm("");
  };

  const handleSelectAccount = (account: Tables<"accounts">) => {
    setSelectedAccount(account);
    onChange(account);
  };

  const handleDeleteAccount = (
    e: React.MouseEvent,
    accountToDelete: Tables<"accounts">,
  ) => {
    e.stopPropagation();
    deleteAccount.mutate(accountToDelete.id);
    if (selectedAccount?.id === accountToDelete.id) {
      setSelectedAccount(null);
      onChange(null);
    }
  };

  return (
    <Menu isLazy initialFocusRef={searchInputRef}>
      <MenuButton
        size="xs"
        variant="unstyled"
        as={Button}
        leftIcon={<IconWallet size={13} />}
        w="full"
        cursor="default"
        textAlign="left"
        pl={2}
        borderRadius="inherit"
        fontWeight="semibold"
        _focus={{
          outline: "none",
          boxShadow: "none",
        }}
      >
        {selectedAccount
          ? selectedAccount.name
          : t("components.accountSelect.placeholder")}
      </MenuButton>
      <Portal>
        <MenuList>
          <Input
            ref={searchInputRef}
            mb={1}
            placeholder={t("components.accountSelect.searchOrCreate")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <MenuGroup title={t("components.accountSelect.accounts")}>
            {isLoading && (
              <MenuItem>{t("components.accountSelect.loading")}</MenuItem>
            )}
            {filteredAccounts.map((account) => (
              <MenuItem
                key={account.id}
                as="div"
                onClick={() => handleSelectAccount(account)}
              >
                <Flex justify="space-between" align="center" w="full">
                  <Text>{account.name}</Text>
                  <IconButton
                    aria-label={t("components.accountSelect.deleteAccount")}
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
                {t("components.accountSelect.create")} "{searchTerm}"
              </MenuItem>
            )}
            <MenuDivider />
            <MenuItem color="gray.500" onClick={onAdmin}>
              {t("components.accountSelect.manageAccounts")}
            </MenuItem>
          </MenuGroup>
        </MenuList>
      </Portal>
    </Menu>
  );
}
