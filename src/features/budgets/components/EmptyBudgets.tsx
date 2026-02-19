import { Box, Button, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { IconBucket, IconPlus } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

type Props = {
  onNew: VoidFunction;
};

export default function EmptyBudgets({ onNew }: Props) {
  const { t } = useTranslation();
  const hatchBg = useColorModeValue(
    "var(--chakra-colors-gray-100)",
    "var(--chakra-colors-gray-900)",
  );
  const hatchStroke = useColorModeValue(
    "var(--chakra-colors-gray-300)",
    "var(--chakra-colors-gray-700)",
  );
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Stack align="center" justify="center" h="calc(100vh - 55px)" gap={4}>
      <Box
        p={5}
        borderRadius="xl"
        border="1px dashed"
        borderColor={borderColor}
        position="relative"
        overflow="hidden"
      >
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <defs>
            <pattern
              id="empty-hatch"
              patternUnits="userSpaceOnUse"
              width="5"
              height="5"
              patternTransform="rotate(45)"
            >
              <rect width="5" height="5" fill={hatchBg} />
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="5"
                stroke={hatchStroke}
                strokeWidth="2"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#empty-hatch)" />
        </svg>
        <Box position="relative" color="gray.400">
          <IconBucket size={40} />
        </Box>
      </Box>

      <Stack align="center" gap={1}>
        <Text fontSize="md" fontWeight="semibold" color="gray.500">
          {t("budgets.empty.title")}
        </Text>
        <Text fontSize="sm" color="gray.400">
          {t("budgets.empty.description")}
        </Text>
      </Stack>

      <Button
        size="sm"
        leftIcon={<IconPlus size={16} />}
        colorScheme="teal"
        variant="solid"
        onClick={onNew}
      >
        {t("budgets.empty.create")}
      </Button>
    </Stack>
  );
}
