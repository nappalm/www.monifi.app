import { useAuthenticatedUser } from "@/shared";
import { Card, CardBody, HStack, Stack, Tag, Text } from "@chakra-ui/react";
import { IconBrandGoogleFilled, IconMailFilled } from "@tabler/icons-react";

export default function Authentication() {
  const { user } = useAuthenticatedUser();

  const isEmail = user?.app_metadata.providers.includes("email");
  const isGoogle = user?.app_metadata.providers.includes("google");

  return (
    <Stack>
      {isEmail && (
        <Card size="sm">
          <CardBody>
            <HStack justify="space-between">
              <HStack gap={5}>
                <IconMailFilled size={18} />
                <Stack gap={0}>
                  <HStack>
                    <Text fontSize="lg">Email and Password</Text>
                    <Tag colorScheme="blue">Active</Tag>
                  </HStack>
                  <Text color="gray.500">
                    Authenticate with your credentials
                  </Text>
                </Stack>
              </HStack>
              <Text color="gray.500">{user?.email}</Text>
            </HStack>
          </CardBody>
        </Card>
      )}

      {isGoogle && (
        <Card size="sm">
          <CardBody>
            <HStack justify="space-between">
              <HStack gap={5}>
                <IconBrandGoogleFilled size={18} />
                <Stack gap={0}>
                  <HStack>
                    <Text fontSize="lg">Google</Text>
                    <Tag colorScheme="blue">Active</Tag>
                  </HStack>
                  <Text color="gray.500">Authenticate with google</Text>
                </Stack>
              </HStack>
              <Text color="gray.500">{user?.email}</Text>
            </HStack>
          </CardBody>
        </Card>
      )}
    </Stack>
  );
}
