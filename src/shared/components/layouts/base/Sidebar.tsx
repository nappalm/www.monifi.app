import { Box, Button, Collapse, Divider, Stack, Text } from "@chakra-ui/react";
import {
  IconArrowsExchange2,
  IconChartLine,
  IconChevronDown,
  IconChevronUp,
  IconWallet,
} from "@tabler/icons-react";
import { FC, ReactElement, useState } from "react";
import { Link, useLocation } from "react-router-dom";

type ButtonProps = {
  size: string;
  justifyContent: string;
  variant: string;
};

type IconProps = {
  size: number;
  color: string;
};

type SubmenuItem = {
  title: string;
  path: string;
};

type SidebarItem = {
  title: string;
  icon?: ReactElement;
  isHeader?: boolean;
  submenu?: SubmenuItem[];
  path?: string;
};

const buttonProps: ButtonProps = {
  size: "sm",
  justifyContent: "flex-start",
  variant: "ghost",
};

const iconProps: IconProps = {
  size: 18,
  color: "#52525B",
};

const sidebarItems: SidebarItem[] = [
  {
    title: "Transactions",
    icon: <IconArrowsExchange2 {...iconProps} />,
    path: "/transactions",
  },
  {
    title: "Budgets",
    icon: <IconWallet {...iconProps} />,
    path: "/budgets",
  },
  {
    title: "Statistics",
    icon: <IconChartLine {...iconProps} />,
    path: "/statistics",
  },
];

const Sidebar: FC = () => {
  const { pathname } = useLocation();
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

  const handleToggleSubmenu = (title: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <Stack width="full" gap="1px" position="relative">
      {sidebarItems.map((item, index) => {
        if (item.isHeader) {
          return (
            <div key={index}>
              <Divider my={2} />
              <Text fontWeight="bold" fontSize="xs" color="gray.500" pl={3}>
                {item.title}
              </Text>
            </div>
          );
        }

        if (item.submenu) {
          const isOpen = openSubmenus[item.title];
          return (
            <Box key={index} w="full">
              <Button
                {...buttonProps}
                w="inherit"
                rightIcon={
                  isOpen ? (
                    <IconChevronUp size={16} />
                  ) : (
                    <IconChevronDown size={16} />
                  )
                }
                onClick={() => handleToggleSubmenu(item.title)}
                leftIcon={item.icon}
              >
                <Text as="span" w="full" textAlign="left">
                  {item.title}
                </Text>
              </Button>
              <Collapse in={isOpen}>
                <Stack mt={1} gap="1px">
                  {item.submenu.map((subItem) => (
                    <Button
                      {...buttonProps}
                      w="inherit"
                      key={subItem.title}
                      pl={9}
                      fontSize="xs"
                      variant={pathname === subItem.path ? "solid" : "ghost"}
                    >
                      {subItem.title}
                    </Button>
                  ))}
                </Stack>
              </Collapse>
            </Box>
          );
        }

        const isActive = pathname === item.path;

        return (
          <Box
            key={index}
            position="relative"
            w="full"
            _before={{
              content: "''",
              position: "absolute",
              w: "4px",
              h: "70%",
              bg: "blue.500",
              left: -2,
              top: "10%",
              borderRadius: "full",
              opacity: isActive ? 1 : 0,
              transition: "opacity 0.2s ease-in-out",
            }}
          >
            <Link to={item.path ?? "/"}>
              <Button
                {...buttonProps}
                variant={pathname === item.path ? "solid" : "ghost"}
                leftIcon={item.icon}
                w="full"
              >
                {item.title}
              </Button>
            </Link>
          </Box>
        );
      })}
    </Stack>
  );
};

export default Sidebar;
