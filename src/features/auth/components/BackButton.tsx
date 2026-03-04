import { Box, HStack, IconButton, Link, Text } from "@chakra-ui/react";
import { ArrowLeft } from "pixelarticons/react";

export default function BackButton() {
  return (
    <Box position="absolute" top={5} left={5} zIndex={10}>
      <HStack>
        <Link href="https://www.monifi.app/">
          <IconButton
            aria-label="Previous step"
            icon={<ArrowLeft width={16} height={16} />}
            size="sm"
          />
        </Link>
        <Text color="gray.500" letterSpacing="tight" textDecor="none">
          Go to home
        </Text>
      </HStack>
    </Box>
  );
}
