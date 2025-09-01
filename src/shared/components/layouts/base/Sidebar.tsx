import { Box, Button, Collapse, Divider, Stack, Text } from "@chakra-ui/react";
import {
  IconApps,
  IconAppWindow,
  IconBookUpload,
  IconBrandGithubCopilot,
  IconBrandParsinta,
  IconChevronDown,
  IconChevronUp,
  IconDevicesPc,
  IconGitBranch,
  IconKey,
  IconMail,
  IconMessages,
  IconServer,
  IconSettings,
  IconShape,
  IconShieldCheck,
  IconSquareAsterisk,
  IconTag,
  IconUsers,
  IconWebhook,
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
  size: 17,
  color: "#52525B",
};

const sidebarItems: SidebarItem[] = [
  {
    title: "General",
    icon: <IconSettings {...iconProps} />,
    path: "/home",
  },
  {
    title: "Collaborators",
    icon: <IconUsers {...iconProps} />,
    path: "/settings/collaborators",
  },
  {
    title: "Moderation options",
    icon: <IconMessages {...iconProps} />,
    path: "/settings/moderation-options",
  },
  {
    title: "Code and automatitation",
    isHeader: true,
  },
  {
    title: "Branchs",
    icon: <IconGitBranch {...iconProps} />,
    path: "/settings/branchs",
  },
  {
    title: "Tags",
    icon: <IconTag {...iconProps} />,
    path: "/settings/tags",
  },
  {
    title: "Rules",
    icon: <IconBookUpload {...iconProps} />,
    path: "/settings/rules",
  },
  {
    title: "Actions",
    icon: <IconBrandParsinta {...iconProps} />,
    path: "/settings/actions",
  },
  {
    title: "Models",
    icon: <IconShape {...iconProps} />,
    path: "/settings/models",
  },
  {
    title: "Webhooks",
    icon: <IconWebhook {...iconProps} />,
    path: "/settings/webhooks",
  },
  {
    title: "Copilot",
    icon: <IconBrandGithubCopilot {...iconProps} />,
    path: "/settings/copilot",
    submenu: [
      {
        title: "Code review",
        path: "/settings/copilot/code-review",
      },
      {
        title: "Coding agent",
        path: "/settings/copilot/coding-agent",
      },
    ],
  },
  {
    title: "Environtments",
    icon: <IconServer {...iconProps} />,
    path: "/settings/environtments",
  },
  {
    title: "Codespaces",
    icon: <IconDevicesPc {...iconProps} />,
    path: "/settings/codespaces",
  },
  {
    title: "Pages",
    icon: <IconAppWindow {...iconProps} />,
    path: "/settings/pages",
  },
  {
    title: "Secutiry",
    isHeader: true,
  },
  {
    title: "Advanced Secutiry",
    icon: <IconShieldCheck {...iconProps} />,
    path: "/settings/advanced-security",
  },
  {
    title: "Password authentication",
    icon: <IconKey {...iconProps} />,
    path: "/settings/password-authentication",
  },
  {
    title: "Deploy keys",
    icon: <IconKey {...iconProps} />,
    path: "/settings/deploy-keys",
  },
  {
    title: "Secrets and variables",
    icon: <IconSquareAsterisk {...iconProps} />,
    path: "/settings/secrets-and-variables",
    submenu: [
      {
        title: "Actions",
        path: "/settings/secrets-and-variables/actions",
      },
      {
        title: "Dependabot",
        path: "/settings/secrets-and-variables/dependabot",
      },
      {
        title: "Codespaces",
        path: "/settings/secrets-and-variables/codespaces",
      },
    ],
  },
  {
    title: "Integrations",
    isHeader: true,
  },
  {
    title: "GitHub Apps",
    icon: <IconApps {...iconProps} />,
    path: "/settings/github-apps",
  },
  {
    title: "Email notifications",
    icon: <IconMail {...iconProps} />,
    path: "/settings/email-notifications",
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
