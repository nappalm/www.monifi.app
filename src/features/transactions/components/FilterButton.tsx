import {
  Button,
  ButtonGroup,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { IconFilter2 } from "@tabler/icons-react";

export default function FilterButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <IconButton
        aria-label="Filter"
        icon={<IconFilter2 size={16} />}
        size="sm"
        borderRightRadius={0}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <ModalHeader>Filters</ModalHeader>
            <ModalBody>
              <Stack>
                <Text>In this view show records</Text>
                <HStack>
                  <Text>Where</Text>
                  <Input />
                  <Select>
                    <option value="option1">contains</option>
                  </Select>
                  <Input placeholder="Enter value" />
                </HStack>
                <HStack justify="space-between">
                  <Button>Add filter</Button>
                  <Button>Clear all filters</Button>
                </HStack>
              </Stack>
            </ModalBody>
          </ModalBody>
          <ModalFooter>
            <ButtonGroup size="sm">
              <Button>Cancel</Button>
              <Button colorScheme="green">Apply</Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
