import {
  Button,
  ButtonGroup,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { type AlertModalState } from "../context";

type Props = AlertModalState & {
  isOpen: boolean;
  onClose: () => void;
};

export function AlertModal({
  isOpen,
  onClose,
  title,
  description,
  colorScheme = "red",
  onOk,
  onCancel,
  render,
  isLoading = false,
}: Props) {
  const { t } = useTranslation();
  const loading = typeof isLoading === "function" ? isLoading() : isLoading;

  const handleOk = () => {
    onOk?.();
    onClose();
  };

  const handleCancel = () => {
    onCancel?.();
    onClose();
  };

  return (
    <Modal
      size="sm"
      isOpen={isOpen || loading}
      onClose={handleCancel}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        {(render || description) && (
          <ModalBody>
            {render ?? <Text color="gray.500">{description}</Text>}
          </ModalBody>
        )}
        <ModalFooter>
          <ButtonGroup>
            <Button variant="ghost" onClick={handleCancel} isDisabled={loading}>
              {t("common.cancel")}
            </Button>
            <Button
              colorScheme={colorScheme}
              onClick={handleOk}
              isLoading={loading}
              variant="solid"
            >
              {t("common.confirm")}
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
