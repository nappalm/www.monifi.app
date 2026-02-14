import {
  Box,
  Stack,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

import { TopnavbarMobile } from "../../topnavbar";
import BottomBar from "../../bottom-bar";

export default function Layout() {
  const menu = useDisclosure();
  const isSmallScreen = useBreakpointValue({ base: true, lg: false });

  return (
    <Stack>
      <Box as="main">
        {/* <TopnavBar onMenuClick={menu.onToggle} /> */}
        {isSmallScreen && <TopnavbarMobile {...menu} />}
        <Outlet />
        <BottomBar />
      </Box>
    </Stack>
  );
}
