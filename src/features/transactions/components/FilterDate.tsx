import { Button } from "@chakra-ui/react";
import { IconCylinder } from "@tabler/icons-react";

export default function FilterDate() {
  return (
    <Button
      leftIcon={<IconCylinder size={16} />}
      size="sm"
      borderLeftRadius={0}
    >
      Jun to Ago 2025
    </Button>
  );
}
