import {
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Portal,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import {
  IconAntennaBars2,
  IconAntennaBars4,
  IconArrowRight,
  IconCancel,
  IconDots,
  IconInfoCircle,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";

export default function BudgetsTable() {
  return (
    <TableContainer border="1px solid" borderColor="gray.800" borderRadius="xl">
      <Table variant="striped" size="sm">
        <Thead>
          <Tr>
            <Th w="10px" />
            <Th>Name</Th>
            <Th>Period</Th>
            <Th isNumeric>Current</Th>
            <Th isNumeric>Limit</Th>
            <Th w="10px" />
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td opacity={0.5}>#1</Td>
            <Td>My period</Td>
            <Td>Every months 01 - 31</Td>
            <Td isNumeric>
              <HStack justifyContent="flex-end">
                <Text as="span">$1998.99</Text>
                <IconAntennaBars2 size={16} />
              </HStack>
            </Td>
            <Td isNumeric>$5,090.99</Td>
            <Td p={0} opacity={0.5}>
              <Menu>
                <MenuButton
                  as={IconButton}
                  w="full"
                  aria-label="Row options"
                  size="xs"
                  variant="unstyled"
                  pl="7px"
                  icon={<IconDots size={15} />}
                />
                <Portal>
                  <MenuList>
                    <MenuItem
                      icon={<IconArrowRight size={16} />}
                      color="green.500"
                    >
                      Config budget
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem icon={<IconPencil size={16} />}>
                      Edit information
                    </MenuItem>
                    <MenuItem icon={<IconInfoCircle size={16} />}>
                      See details
                    </MenuItem>
                    <MenuItem icon={<IconCancel size={16} />}>
                      Disabled
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem icon={<IconTrash size={16} />} color="red.500">
                      Delete budget
                    </MenuItem>
                  </MenuList>
                </Portal>
              </Menu>
            </Td>
          </Tr>
          <Tr>
            <Td opacity={0.5}>#2</Td>
            <Td>Ahorro para mi casa</Td>
            <Td>Jun to Dec 2025</Td>
            <Td isNumeric>
              <HStack justifyContent="flex-end">
                <Text as="span">$1998.99</Text>
                <IconAntennaBars4 size={16} />
              </HStack>
            </Td>
            <Td isNumeric>$500,90.99</Td>

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
