import { ButtonGroup, IconButton } from "@chakra-ui/react";
import { IconRotate2, IconRotateClockwise2 } from "@tabler/icons-react";

export default function UndoRedoButtons() {
  return (
    <ButtonGroup spacing="1px">
      <IconButton
        aria-label="Undo"
        borderRightRadius={0}
        size="sm"
        icon={<IconRotate2 size={18} />}
      />
      <IconButton
        aria-label="Redo"
        borderLeftRadius={0}
        size="sm"
        icon={<IconRotateClockwise2 size={18} />}
      />
    </ButtonGroup>
  );
}
