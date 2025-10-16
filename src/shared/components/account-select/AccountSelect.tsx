import _colors from "@/lib/chakra-ui/_colors";
import { Tables } from "@/lib/supabase/database.types";
import { useAuthenticatedUser } from "@/shared/hooks";
import { useAccounts, useCreateAccount } from "@/shared/hooks/useAccounts";
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
import { IconCircleFilled } from "@tabler/icons-react";
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

  return (
    <Menu isLazy initialFocusRef={searchInputRef} placement="right-start">
      <MenuButton
        size="xs"
        variant="unstyled"
        as={Button}
        leftIcon={
          <IconCircleFilled
            color={selectedAccount?.color ?? _colors.gray[500]}
            size={10}
          />
        }
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
                icon={
                  <IconCircleFilled
                    color={account?.color ?? _colors.gray[500]}
                    size={10}
                  />
                }
                key={account.id}
                onClick={() => handleSelectAccount(account)}
              >
                {account.name}
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
