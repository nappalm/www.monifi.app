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

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signInWithEmail, signInWithOAuth } = useAuth();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    await signInWithEmail(email, password);
  };

  return (
    <Box p={8} maxWidth="500px" borderWidth={1} borderRadius={8} boxShadow="lg">
      <Heading mb={4}>Sign In</Heading>
      <form onSubmit={handleSignIn}>
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
            Sign In
          </Button>
        </Stack>
      </form>
      <Text mt={4} textAlign="center">
        Or sign in with:
      </Text>
      <Stack mt={4} direction="row" spacing={4} justify="center">
        <Button onClick={() => signInWithOAuth("github")}>GitHub</Button>
        <Button onClick={() => signInWithOAuth("google")}>Google</Button>
        {/* Add more OAuth providers as needed */}
      </Stack>
      <Text mt={4} textAlign="center">
        Don't have an account?{" "}
        <Link as={RouterLink} to={AUTH_PATHS.signUp} color="teal.500">
          Sign Up
        </Link>
      </Text>
    </Box>
  );
}
