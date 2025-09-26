import { Box, Container, Stack } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import ToggleThemeButton from "../../topnavbar/ToggleThemeButton";

export default function Layout() {
  return (
    <Stack>
      <Box as="main">
        <ToggleThemeButton position="absolute" right={5} top={5} />
        <Container maxW="1400px">
          <Outlet />
        </Container>
      </Box>
    </Stack>
  );
}
