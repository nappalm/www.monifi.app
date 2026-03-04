import { ButtonGroup, IconButton, Tooltip } from "@chakra-ui/react";
import { RedoSharp, UndoSharp } from "pixelarticons/react";
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
          variant="ghost"
          aria-label="Undo"
          borderRightRadius={0}
          size="sm"
          icon={<UndoSharp height={16} width={16} />}
          onClick={onUndo}
          isDisabled={!canUndo}
        />
      </Tooltip>
      <Tooltip label={t("components.undoRedoButtons.redo")}>
        <IconButton
          variant="ghost"
          aria-label="Redo"
          borderLeftRadius={0}
          size="sm"
          icon={<RedoSharp height={16} width={16} />}
          onClick={onRedo}
          isDisabled={!canRedo}
        />
      </Tooltip>
    </ButtonGroup>
  );
}
