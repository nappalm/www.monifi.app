import { Stack, Td, Text, Tr } from "@chakra-ui/react";
import { IconMugFilled } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

interface TableEmptyRowsProps {
  cols: number;
}
export default function TableEmptyRows({ cols }: TableEmptyRowsProps) {
  const { t } = useTranslation();

  return (
    <Tr>
      <Td colSpan={cols} color="gray.500" pointerEvents="none">
        <Stack w="full" justify="center" align="center" py={10}>
          <IconMugFilled />
          <Text fontSize="xs">{t("components.tableEmptyRows.noResults")}</Text>
        </Stack>
      </Td>
    </Tr>
  );
}
