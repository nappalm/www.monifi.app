import { Box, Container, Stack } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

import { TopnavBar } from "../../topnavbar";

export default function Layout() {
  return (
    <Stack>
      <Box as="main">
        <TopnavBar onMenuClick={() => {}} />
        <Container maxW="1400px" py={10}>
          <Outlet />
        </Container>
      </Box>
    </Stack>
  );
}
