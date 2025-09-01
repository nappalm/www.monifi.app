import {
  Box,
  Container,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Grid,
  Stack,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";

import { TopnavBar } from "../../topnavbar";
import Sidebar from "./Sidebar";

export default function Layout() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isSmallScreen = useBreakpointValue({ base: true, lg: false });
  const { pathname } = useLocation();

  useEffect(() => {
    if (isOpen && isSmallScreen) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Stack>
      <Box as="main">
        <TopnavBar onMenuClick={onOpen} />
        {isSmallScreen && (
          <Drawer
            isOpen={isOpen}
            placement="left"
            onClose={onClose}
            closeOnEsc
            closeOnOverlayClick
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerBody overflowX="hidden" overflowY="auto">
                <Sidebar />
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        )}

        <Container maxW="container.xl">
          <Grid
            gridAutoFlow="column"
            gridTemplateColumns={
              isSmallScreen
                ? "minmax(0, 1fr)"
                : "296px minmax(0, calc(100% - 296px - 24px))"
            }
            gridGap="24px"
            py={5}
          >
            {!isSmallScreen && <Sidebar />}
            <Outlet />
          </Grid>
        </Container>
      </Box>
    </Stack>
  );
}
