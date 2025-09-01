import { LICENSING_FREE_FEATURES } from "@/shared";
import {
  Card,
  CardBody,
  CardHeader,
  HStack,
  List,
  ListItem,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { IconPentagon } from "@tabler/icons-react";
import LicensingFeatureIcon from "./LicensingFeatureIcon";

export default function FreePlanDetails() {
  return (
    <Card size="sm">
      <CardHeader>
        <HStack justify="space-between">
          <HStack gap={3} alignItems="flex-start">
            <IconPentagon />
            <Stack gap={0}>
              <Text fontWeight="bold">Github Free</Text>
              <Text color="gray.500">The basics for all developers</Text>
            </Stack>
          </HStack>
        </HStack>
      </CardHeader>
      <CardBody>
        <SimpleGrid columns={[1, 1, 1, 2]} gap={5}>
          <List spacing={2}>
            {LICENSING_FREE_FEATURES.included.map((item) => (
              <ListItem key={item.label}>
                <LicensingFeatureIcon type={item.type} color="blue.500" />
                {item.label}
              </ListItem>
            ))}
          </List>
          <Stack>
            <Text color="gray.500">Not included</Text>
            <List spacing={2}>
              {LICENSING_FREE_FEATURES.notIncluded.map((item) => (
                <ListItem key={item.label}>
                  <LicensingFeatureIcon type={item.type} color="red.500" />
                  {item.label}
                </ListItem>
              ))}
            </List>
          </Stack>
        </SimpleGrid>
      </CardBody>
    </Card>
  );
}
