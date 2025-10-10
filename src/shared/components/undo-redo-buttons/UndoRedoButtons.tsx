import { ButtonGroup, IconButton, Tooltip } from "@chakra-ui/react";
import { IconRotate2, IconRotateClockwise2 } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

interface UndoRedoButtonsProps {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export default function UndoRedoButtons({
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: UndoRedoButtonsProps) {
  const { t } = useTranslation();

  return (
    <ButtonGroup spacing="1px">
      <Tooltip label={t("components.undoRedoButtons.undo")}>
        <IconButton
          aria-label="Undo"
          borderRightRadius={0}
          size="sm"
          icon={<IconRotate2 size={18} />}
          onClick={onUndo}
          isDisabled={!canUndo}
        />
      </Tooltip>
      <Tooltip label={t("components.undoRedoButtons.redo")}>
        <IconButton
          aria-label="Redo"
          borderLeftRadius={0}
          size="sm"
          icon={<IconRotateClockwise2 size={18} />}
          onClick={onRedo}
          isDisabled={!canRedo}
        />
      </Tooltip>
    </ButtonGroup>
  );
}
