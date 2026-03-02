import { ButtonSpinner } from "@/shared";
import { Stack, StackProps } from "@chakra-ui/react";

export function PageLoading(props: StackProps) {
  return (
    <Stack
      align="center"
      justify="center"
      w="full"
      h="100vh"
      opacity={0.5}
      {...props}
    >
      <ButtonSpinner size={20} />
    </Stack>
  );
}
