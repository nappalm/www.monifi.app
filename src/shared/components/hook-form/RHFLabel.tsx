import { Text } from "@chakra-ui/react";

type Props = {
  label?: string;
  isRequired?: boolean;
  error?: string;
};

export default function RHFLabel({ label, error, isRequired }: Props) {
  if (!label) return null;
  return (
    <Text fontSize="xs" color={error ? "red.500" : "base.100"} as="label">
      {label}
      <Text as="span" color="red.500">
        {isRequired && " *"}
      </Text>
    </Text>
  );
}
