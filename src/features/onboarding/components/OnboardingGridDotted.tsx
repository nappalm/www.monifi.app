import { Box, useColorModeValue } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

export default function OnboardingGridDotted({ children }: PropsWithChildren) {
  const gridColor = useColorModeValue("gray.200", "gray.900");

  return (
    <Box
      minH="100vh"
      sx={{
        backgroundImage: `radial-gradient(${gridColor} 1px, transparent 1px)`,
        backgroundSize: "30px 30px",
        maskImage:
          "radial-gradient(circle at center, black 60%, transparent 100%)",
      }}
    >
      {children}
    </Box>
  );
}
