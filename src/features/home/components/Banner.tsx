import { Card, CardBody, Heading, Stack, Text } from "@chakra-ui/react";

export default function Banner() {
  return (
    <Card
      backgroundRepeat="no-repeat"
      backgroundPosition="left"
      backgroundSize="cover"
      backgroundImage="url(https://github.githubassets.com/assets/projects-beta-banner-dark-fc370172a740.png)"
    >
      <CardBody>
        <Stack>
          <Heading size="lg">Welcome to projects</Heading>
          <Text w="50%">
            Built like a spreadsheet, project tables give you a live canvas to
            filter, sort, and group issues and pull requests. Tailor them to
            your needs with custom fields and saved views.
          </Text>
        </Stack>
      </CardBody>
    </Card>
  );
}
