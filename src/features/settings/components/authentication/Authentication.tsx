import { useAuthenticatedUser } from "@/shared";
import { Card, CardBody, HStack, Stack, Tag, Text } from "@chakra-ui/react";
import { IconBrandGoogleFilled, IconMailFilled } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

export default function Authentication() {
  const { t } = useTranslation();
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
                    <Text fontSize="lg">
                      {t("settings.authentication.emailPassword")}
                    </Text>
                    <Tag colorScheme="cyan">
                      {t("settings.authentication.active")}
                    </Tag>
                  </HStack>
                  <Text color="gray.500">
                    {t("settings.authentication.authenticateCredentials")}
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
                    <Text fontSize="lg">
                      {t("settings.authentication.google")}
                    </Text>
                    <Tag colorScheme="cyan">
                      {t("settings.authentication.active")}
                    </Tag>
                  </HStack>
                  <Text color="gray.500">
                    {t("settings.authentication.authenticateGoogle")}
                  </Text>
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
