import {
  Box,
  Container,
  Stack,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

import { TopnavBar, TopnavbarMobile } from "../../topnavbar";

export default function Layout() {
  const menu = useDisclosure();
  const isSmallScreen = useBreakpointValue({ base: true, lg: false });

  return (
    <Stack>
      <Box as="main">
        <TopnavBar onMenuClick={menu.onToggle} />
        {isSmallScreen && <TopnavbarMobile {...menu} />}
        <Container maxW="1400px" py={10}>
          <Outlet />
        </Container>
      </Box>
    </Stack>
  );
}
