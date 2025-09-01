import { Text } from "@chakra-ui/react";

interface Props {
  error?: string;
}

export default function RHFError({ error }: Props) {
  if (!error) return null;
  return (
    <Text fontSize="12px" color="red.500" px={3}>
      {error}
    </Text>
  );
}
