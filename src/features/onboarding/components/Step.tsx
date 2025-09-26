import { Box, HStack } from "@chakra-ui/react";

export default function Step() {
  return (
    <HStack gap={1}>
      <Box h="5px" w="10px" bg="cyan.500" borderRadius="full" />
      <Box h="5px" w="10px" bg="gray.500" borderRadius="full" />
      <Box h="5px" w="10px" bg="gray.500" borderRadius="full" />
    </HStack>
  );
}
