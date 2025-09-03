import {
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import {
  IconChevronsDown,
  IconChevronsUp,
  IconDots,
} from "@tabler/icons-react";

export default function TransactionsTable() {
  return (
    <TableContainer border="1px solid" borderColor="gray.800" borderRadius="xl">
      <Table variant="striped" size="sm">
        <Thead>
          <Tr>
            <Th w="10px" />
            <Th w="10px" />
            <Th>Date</Th>
            <Th>Category</Th>
            <Th>Account</Th>
            <Th>Type</Th>
            <Th>Notes</Th>
            <Th isNumeric>Amount</Th>
            <Th w="10px" />
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td opacity={0.5}>#1</Td>
            <Td color="red.500">
              <IconChevronsDown size={16} />
            </Td>
            <Td>Jun 13, 2025</Td>
            <Td>Plans</Td>
            <Td>BBVA credit card</Td>
            <Td>Expense</Td>
            <Td></Td>
            <Td isNumeric>$2590,99.4</Td>
            <Td p={0} opacity={0.5}>
              <IconButton
                w="full"
                aria-label="Row options"
                size="xs"
                variant="unstyled"
                pl="7px"
                icon={<IconDots size={15} />}
              />
            </Td>
          </Tr>
          <Tr>
            <Td opacity={0.5}>#2</Td>
            <Td color="red.500">
              <IconChevronsDown size={16} />
            </Td>
            <Td>Jun 13, 2025</Td>
            <Td>Plans</Td>
            <Td>BBVA credit card</Td>
            <Td>Expense</Td>

            <Td></Td>
            <Td isNumeric>$2590,99.4</Td>
            <Td p={0} opacity={0.5}>
              <IconButton
                w="full"
                aria-label="Row options"
                size="xs"
                variant="unstyled"
                pl="7px"
                icon={<IconDots size={15} />}
              />
            </Td>
          </Tr>
          <Tr>
            <Td opacity={0.5}>#3</Td>
            <Td color="red.500">
              <IconChevronsDown size={16} />
            </Td>
            <Td>Jun 13, 2025</Td>
            <Td>Plans</Td>
            <Td>BBVA credit card</Td>
            <Td>Expense</Td>

            <Td></Td>
            <Td isNumeric>$2590,99.4</Td>
            <Td p={0} opacity={0.5}>
              <IconButton
                w="full"
                aria-label="Row options"
                size="xs"
                variant="unstyled"
                pl="7px"
                icon={<IconDots size={15} />}
              />
            </Td>
          </Tr>
          <Tr>
            <Td opacity={0.5}>#4</Td>
            <Td color="green.500">
              <IconChevronsUp size={16} />
            </Td>
            <Td>Jun 13, 2025</Td>
            <Td>Plans</Td>
            <Td>BBVA credit card</Td>
            <Td>Expense</Td>

            <Td></Td>
            <Td isNumeric>$2590,99.4</Td>
            <Td p={0} opacity={0.5}>
              <IconButton
                w="full"
                aria-label="Row options"
                size="xs"
                variant="unstyled"
                pl="7px"
                icon={<IconDots size={15} />}
              />
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );
}
