import { Box } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { IconLoader } from "@tabler/icons-react";

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

type Props = {
  size?: number;
};

export function ButtonSpinner({ size = 18 }: Props) {
  return (
    <Box animation={`${spin} 1s linear infinite`}>
      <IconLoader size={size} />
    </Box>
  );
}
