import { Text } from "@chakra-ui/react";

export function SectionLabel({ children }: { children: string }) {
  return (
    <Text
      fontSize="10px"
      fontWeight="bold"
      letterSpacing="widest"
      textTransform="uppercase"
      color="gray.500"
    >
      {children}
    </Text>
  );
}
