import { SETTINGS_PATHS } from "@/features/settings";
import { useAuthenticatedUser } from "@/shared/hooks";
import {
  Box,
  Button,
  Collapse,
  Divider,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react";
import {
  IconAsterisk,
  IconChevronDown,
  IconChevronUp,
  IconCreditCard,
  IconFingerprint,
  IconForbid,
  IconPlanet,
  IconReceiptDollar,
  IconUserSquareRounded,
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
  path?: string;
};

type SidebarItem = {
  title: string;
  path?: string;
  icon?: ReactElement;
  badge?: string;
  isHeader?: boolean;
  submenu?: SubmenuItem[];
  color?: string;
};

const buttonProps: ButtonProps = {
  size: "sm",
  justifyContent: "flex-start",
  variant: "ghost",
};

const iconProps: IconProps = {
  size: 17,
  color: "#52525B",
};

const sidebarItems = (subscription: string): SidebarItem[] => [
  {
    title: "Profile",
    icon: <IconUserSquareRounded {...iconProps} />,
    path: SETTINGS_PATHS.myProfile,
  },
  {
    title: "Plans and payments",
    isHeader: true,
  },
  {
    title: "Licensing",
    path: SETTINGS_PATHS.licensing,
    icon: <IconPlanet {...iconProps} />,
    badge: subscription,
  },
  {
    title: "Payment information",
    path: SETTINGS_PATHS.paymentInformation,
    icon: <IconCreditCard {...iconProps} />,
  },
  {
    title: "Payment history",
    path: SETTINGS_PATHS.paymentHistory,
    icon: <IconReceiptDollar {...iconProps} />,
  },
  {
    title: "Password and Authentication",
    isHeader: true,
  },
  {
    title: "Authentication",
    path: SETTINGS_PATHS.authentication,
    icon: <IconFingerprint {...iconProps} />,
  },
  {
    title: "Change password",
    path: SETTINGS_PATHS.changePassword,
    icon: <IconAsterisk {...iconProps} />,
  },
  {
    title: "Delete account",
    path: SETTINGS_PATHS.deleteAccount,
    icon: <IconForbid {...iconProps} />,
  },
];

const Sidebar: FC = () => {
  const { pathname } = useLocation();
  const { profile, isFree } = useAuthenticatedUser();
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

  const handleToggleSubmenu = (title: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <Stack width="full" gap="1px" position="relative">
      {sidebarItems(profile?.subscription as string).map((item, index) => {
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
          const isSubmenuActive = item.submenu.some(
            (sub) => sub.path === pathname,
          );
          const isOpen = openSubmenus[item.title] ?? isSubmenuActive;

          return (
            <Box key={index} w="full">
              <Button
                {...buttonProps}
                w="full"
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
                  {item.submenu.map((subItem) => {
                    return (
                      <Link to={subItem.path ?? "/"} key={subItem.title}>
                        <Button
                          {...buttonProps}
                          w="full"
                          pl={9}
                          fontSize="xs"
                          variant={
                            pathname === subItem.path ? "solid" : "ghost"
                          }
                        >
                          {subItem.title}
                        </Button>
                      </Link>
                    );
                  })}
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
                variant={isActive ? "solid" : "ghost"}
                leftIcon={item.icon}
                rightIcon={
                  item.badge ? (
                    <Tag
                      size="sm"
                      colorScheme={isFree ? "gray" : "blue"}
                      position="absolute"
                      right={2}
                      top="50%"
                      transform="translateY(-50%)"
                    >
                      {item?.badge}
                    </Tag>
                  ) : undefined
                }
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
