import {
  Heading,
  HStack,
  IconButton,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconChevronLeft } from "@tabler/icons-react";

interface PageTitleProps {
  title: string;
  description: string;
  onBack?: VoidFunction;
}

export default function PageTitle({
  title,
  onBack,
  description,
}: PageTitleProps) {
  const borderColor = useColorModeValue("gray.300", "gray.700");
  return (
    <Stack
      w="full"
      gap={1}
      borderBottom="1px dashed"
      borderColor={borderColor}
      py={5}
      mb={3}
    >
      <HStack>
        {onBack && (
          <IconButton
            aria-label="Back button"
            onClick={onBack}
            size="sm"
            icon={<IconChevronLeft />}
          />
        )}
        <Heading fontSize="3xl">{title}</Heading>
      </HStack>
      <Text color="gray.500">{description}</Text>
    </Stack>
  );
}
