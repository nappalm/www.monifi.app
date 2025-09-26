import { Navigate, Outlet, useLocation } from "react-router-dom";

import { AUTH_PATHS } from "@/features/auth/router/paths";
import { ONBOARDING_PATHS } from "@/features/onboarding";
import { GridDotted, useAuthenticatedUser } from "@/shared";
import { Box, Image, Stack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useProfile } from "../hooks/useProfile";

export function ProtectedRoute() {
  const { pathname } = useLocation();

  const { user, isLoadingSession, isLoadingProfile } = useAuthenticatedUser();
  const { isOnboarding } = useProfile(user);

  if ((isLoadingSession && user === null) || isLoadingProfile) {
    return (
      <GridDotted>
        <Stack w="full" h="100vh" align="center" justify="center">
          <motion.div
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              repeatType: "loop",
            }}
          >
            <Box>
              <Image src="/logo-v2.png" alt="logo" height="40px" />
            </Box>
          </motion.div>
        </Stack>
      </GridDotted>
    );
  }

  if (!user) {
    return <Navigate to={AUTH_PATHS.signIn} replace />;
  }

  if (!isOnboarding && !Object.values(ONBOARDING_PATHS).includes(pathname)) {
    return <Navigate to={ONBOARDING_PATHS.base} replace />;
  }

  return <Outlet />;
}
