import { Logo } from "@/shared";
import { Heading, Stack, Text } from "@chakra-ui/react";

interface PageTitleProps {
  title: string;
  description: string;
}

export default function PageTitle({ title, description }: PageTitleProps) {
  return (
    <Stack align="center" pt="30%" justify="center" w="full" gap={0}>
      <Logo w="40px" h="40px" />
      <Heading variant="onboarding-title" size="md">
        {title}
      </Heading>
      <Text color="gray.500" textAlign="center">
        {description}
      </Text>
    </Stack>
  );
}
