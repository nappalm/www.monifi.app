import { ButtonSpinner } from "@/shared";
import { Stack } from "@chakra-ui/react";

export default function PageLoading() {
  return (
    <Stack align="center" justify="center" w="full" h="100vh" opacity={0.5}>
      <ButtonSpinner size={20} />
    </Stack>
  );
}
