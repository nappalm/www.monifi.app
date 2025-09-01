import {
  Alert,
  AlertIcon,
  Button,
  ButtonGroup,
  Checkbox,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";

type Props = {
  onSubmit: VoidFunction;
  isLoading: boolean;
};

export default function DeleteAccountForm({ onSubmit, isLoading }: Props) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [isConfirmed, setIsConfirmed] = useState(false);

  return (
    <Stack>
      <Alert status="warning">
        <AlertIcon />
        Permanently delete account, this action cannot be undone
      </Alert>
      <Text color="gray.500">
        Deleting your account will remove all your personal data, settings, and
        history. Once deleted, this information cannot be recovered.
      </Text>
      <Button w="fit-content" variant="outline" onClick={onOpen} type="button">
        Delete my account
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        closeOnOverlayClick={!isLoading}
        closeOnEsc={!isLoading}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Account</ModalHeader>
          <ModalBody>
            <Stack spacing={4}>
              <Text fontSize="md">
                Deleting your account will{" "}
                <strong>permanently remove all your data</strong> and cannot be
                undone.
              </Text>
              <Checkbox
                colorScheme="red"
                color="red.500"
                isChecked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
              >
                I understand and want to delete my account
              </Checkbox>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <ButtonGroup size="sm" spacing={3}>
              <Button
                onClick={onClose}
                variant="outline"
                isDisabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                colorScheme="red"
                isDisabled={!isConfirmed}
                onClick={onSubmit}
                isLoading={isLoading}
              >
                Delete account
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
}
