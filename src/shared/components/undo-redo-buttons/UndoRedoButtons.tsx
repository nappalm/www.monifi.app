import { ButtonGroup, IconButton } from "@chakra-ui/react";
import { IconRotate2, IconRotateClockwise2 } from "@tabler/icons-react";

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
  return (
    <ButtonGroup spacing="1px">
      <IconButton
        aria-label="Undo"
        borderRightRadius={0}
        size="sm"
        icon={<IconRotate2 size={18} />}
        onClick={onUndo}
        isDisabled={!canUndo}
      />
      <IconButton
        aria-label="Redo"
        borderLeftRadius={0}
        size="sm"
        icon={<IconRotateClockwise2 size={18} />}
        onClick={onRedo}
        isDisabled={!canRedo}
      />
    </ButtonGroup>
  );
}
