import {
  Badge,
  Box,
  Card,
  CardBody,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import { ChevronRight2, Invoice } from "pixelarticons/react";

export function UploadCard() {
  return (
    <Card borderRadius={0} ml="-1px" cursor="pointer">
      <CardBody pr={2}>
        <HStack justify="space-between">
          <HStack color="gray.500" gap={3}>
            <Invoice height={18} width={18} />
            <Stack gap={0}>
              <Text fontSize="md">UPLOAD TRANSACTIONS</Text>
            </Stack>
          </HStack>
          <Stack gap={0} align="end">
            <HStack gap={1}>
              <Badge>PDF</Badge>
              <Text color="gray.500">/</Text>
              <Badge>XLS</Badge>
              <Box color="gray.500">
                <ChevronRight2 />
              </Box>
            </HStack>
          </Stack>
        </HStack>
      </CardBody>
    </Card>
  );
}
