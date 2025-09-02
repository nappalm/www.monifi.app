import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Heading,
  HStack,
  IconButton,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { IconX } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { BUDGETS_PATHS } from "../router";

export default function BudgetCategories() {
  return (
    <Stack gap={5}>
      <Stack spacing={0}>
        <HStack justify="space-between">
          <Heading size="lg">My first budget</Heading>
          <Link to={BUDGETS_PATHS.base}>
            <IconButton
              aria-label="Close budget"
              size="sm"
              variant="outline"
              borderRadius="full"
              colorScheme="red"
              icon={<IconX size={18} />}
            />
          </Link>
        </HStack>
        <Breadcrumb color="gray.500">
          <BreadcrumbItem>
            <BreadcrumbLink href={BUDGETS_PATHS.base}>Budgets</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink href="#">Budgets categories</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </Stack>
      <TableContainer
        border="1px solid"
        borderColor="gray.800"
        borderRadius="xl"
      >
        <Table variant="striped" size="sm">
          <Thead>
            <Tr>
              <Th w="10px" />
              <Th>Category</Th>
              <Th>Optional description</Th>
              <Th isNumeric>Budget</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td opacity={0.5}>#1</Td>
              <Td>inches</Td>
              <Td>millimetres (mm)</Td>
              <Td isNumeric>$25.4</Td>
            </Tr>
            <Tr>
              <Td opacity={0.5}>#2</Td>
              <Td>inches</Td>
              <Td>centimetres (cm)</Td>
              <Td isNumeric>$30.48</Td>
            </Tr>
            <Tr>
              <Td opacity={0.5}>#3</Td>
              <Td>inches</Td>
              <Td>metres (m)</Td>
              <Td isNumeric>$0.91444</Td>
            </Tr>
            <Tr>
              <Td opacity={0.5}>#4</Td>
              <Td>inches</Td>
              <Td>metres (m)</Td>
              <Td isNumeric>$0.91444</Td>
            </Tr>
            <Tr>
              <Td opacity={0.5}>#5</Td>
              <Td>inches</Td>
              <Td>metres (m)</Td>
              <Td isNumeric>$0.91444</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
