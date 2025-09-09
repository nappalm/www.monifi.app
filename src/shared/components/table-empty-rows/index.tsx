import { Stack, Td, Text, Tr } from "@chakra-ui/react";
import { IconMugFilled } from "@tabler/icons-react";

interface TableEmptyRowsProps {
  cols: number;
}
export default function TableEmptyRows({ cols }: TableEmptyRowsProps) {
  return (
    <Tr>
      <Td colSpan={cols} color="gray.500" pointerEvents="none">
        <Stack w="full" justify="center" align="center" py={10}>
          <IconMugFilled />
          <Text fontSize="xs">No results found. Start by adding...</Text>
        </Stack>
      </Td>
    </Tr>
  );
}
