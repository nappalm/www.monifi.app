import { IconButton } from "@chakra-ui/react";
import { IconFilter2 } from "@tabler/icons-react";

export default function FilterButton() {
  return (
    <IconButton
      aria-label="Filter"
      icon={<IconFilter2 size={16} />}
      size="sm"
      borderRightRadius={0}
    />
  );
}
