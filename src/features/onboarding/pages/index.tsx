import {
  Button,
  Container,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
} from "@chakra-ui/react";
import { IconArrowRight } from "@tabler/icons-react";

export default function Onboarding() {
  return (
    <Container>
      <Stack align="center" pt="50%" justify="center">
        <Heading color="cyan.50">Welcome to Monify</Heading>
        <Text textAlign="center">
          Here you can understand where your money is going and how to improve
          your personal finances.
        </Text>
        <br />
        <Text>Select your language</Text>
        <Menu>
          <MenuButton as={Button}>English</MenuButton>
          <MenuList>
            <MenuItem>English</MenuItem>
            <MenuItem>Spanish</MenuItem>
          </MenuList>
        </Menu>
        <br />
        <Button
          w="fit-content"
          colorScheme="cyan"
          rightIcon={<IconArrowRight size={18} />}
        >
          Continue
        </Button>
      </Stack>
    </Container>
  );
}
