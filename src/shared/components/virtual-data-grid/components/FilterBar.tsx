import { Input, InputGroup, InputLeftElement, Box } from "@chakra-ui/react";
import { memo } from "react";

interface FilterBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const FilterBar = memo(function FilterBar({
  value,
  onChange,
}: FilterBarProps) {
  return (
    <Box pb={2}>
      <InputGroup size="sm">
        <InputLeftElement pointerEvents="none" color="gray.500" fontSize="xs">
          /
        </InputLeftElement>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Filter..."
          variant="filled"
          borderRadius="md"
          fontSize="sm"
        />
      </InputGroup>
    </Box>
  );
});
