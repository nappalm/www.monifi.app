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
import { useTranslation } from "react-i18next";

type Props = {
  onSubmit: VoidFunction;
  isLoading: boolean;
};

export default function DeleteAccountForm({ onSubmit, isLoading }: Props) {
  const { t } = useTranslation();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [isConfirmed, setIsConfirmed] = useState(false);

  return (
    <Stack>
      <Alert status="warning">
        <AlertIcon />
        {t("settings.deleteAccount.warning")}
      </Alert>
      <Text color="gray.500">{t("settings.deleteAccount.description")}</Text>
      <Button w="fit-content" variant="outline" onClick={onOpen} type="button">
        {t("settings.deleteAccount.button")}
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
          <ModalHeader>{t("settings.deleteAccount.modal.title")}</ModalHeader>
          <ModalBody>
            <Stack spacing={4}>
              <Text
                fontSize="md"
                dangerouslySetInnerHTML={{
                  __html: t("settings.deleteAccount.modal.message"),
                }}
              />
              <Checkbox
                colorScheme="red"
                color="red.500"
                isChecked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
              >
                {t("settings.deleteAccount.modal.confirmation")}
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
                {t("settings.deleteAccount.modal.cancel")}
              </Button>
              <Button
                colorScheme="red"
                isDisabled={!isConfirmed}
                onClick={onSubmit}
                isLoading={isLoading}
              >
                {t("settings.deleteAccount.modal.delete")}
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
}
