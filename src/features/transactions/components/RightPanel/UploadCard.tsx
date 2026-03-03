import { Badge, Card, CardBody, HStack, Stack, Text } from "@chakra-ui/react";

export function UploadCard() {
  return (
    <Card borderRadius={0} ml="-1px" cursor="pointer">
      <CardBody>
        <HStack justify="space-between">
          <Stack gap={0}>
            <Text fontSize="lg">UPLOAD TRANSACTIONS</Text>
            <Text fontSize="sm" color="gray.500">
              Click to upload file
            </Text>
          </Stack>
          <Stack gap={0} align="end">
            <HStack gap={1}>
              <Badge>PDF</Badge>
              <Text color="gray.500">/</Text>
              <Badge>XLS</Badge>
            </HStack>
          </Stack>
        </HStack>
      </CardBody>
    </Card>
  );
}
