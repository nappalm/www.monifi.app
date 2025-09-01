import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  Text,
  Link,
} from "@chakra-ui/react";
import { useAuth } from "../hooks/useAuth";
import { Link as RouterLink } from "react-router-dom";
import { AUTH_PATHS } from "../router/paths";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signUpWithEmail } = useAuth();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    await signUpWithEmail(email, password);
  };

  return (
    <Box p={8} maxWidth="500px" borderWidth={1} borderRadius={8} boxShadow="lg">
      <Heading mb={4}>Sign Up</Heading>
      <form onSubmit={handleSignUp}>
        <Stack spacing={4}>
          <FormControl id="email">
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <Button type="submit" colorScheme="teal" size="lg" fontSize="md">
            Sign Up
          </Button>
        </Stack>
      </form>
      <Text mt={4} textAlign="center">
        Already have an account?{" "}
        <Link as={RouterLink} to={AUTH_PATHS.signIn} color="teal.500">
          Sign In
        </Link>
      </Text>
    </Box>
  );
}
