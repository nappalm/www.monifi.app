import { Stack, Td, Text, Tr } from "@chakra-ui/react";
import { IconTexture } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

interface TableEmptyRowsProps {
  cols: number;
  height?: string;
}
export default function TableEmptyRows({ cols, height }: TableEmptyRowsProps) {
  const { t } = useTranslation();

  return (
    <Tr sx={{ "& > td": { background: "transparent !important" } }}>
      <Td
        colSpan={cols}
        color="gray.500"
        pointerEvents="none"
        h={height}
        verticalAlign={height ? "middle" : undefined}
      >
        <Stack w="full" justify="center" align="center" py={10}>
          <IconTexture />
          <Text fontSize="xs">{t("components.tableEmptyRows.noResults")}</Text>
        </Stack>
      </Td>
    </Tr>
  );
}
