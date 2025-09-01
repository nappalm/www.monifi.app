import { useAuthenticatedUser } from "@/shared/hooks";
import {
  Avatar,
  AvatarBadge,
  Box,
  Heading,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import { IconDiamondFilled } from "@tabler/icons-react";
import { keyframes } from "@emotion/react";

const popInAnimation = keyframes`
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

export default function UserInformation() {
  const { user, profile, isFree } = useAuthenticatedUser();

  const userName = profile?.name || user?.user_metadata?.name;
  const userEmail = user?.email;

  return (
    <HStack gap={5}>
      <Box
        bg={
          isFree
            ? "transparent"
            : "linear-gradient(135deg, #006FEE 30%, #000 100%)"
        }
        p="3px"
        borderRadius="2xl"
      >
        <Avatar size="md" src={user?.user_metadata?.avatar_url}>
          {!isFree && (
            <AvatarBadge
              boxSize="1.5em"
              bg="linear-gradient(135deg, #006FEE 30%, #000 100%)"
              color="white"
              borderRadius="full"
            >
              <Box animation={`${popInAnimation} 0.4s ease-out forwards`}>
                <IconDiamondFilled size={15} />
              </Box>
            </AvatarBadge>
          )}
        </Avatar>
      </Box>
      <Stack gap={0}>
        <Heading size="lg">{userName || userEmail}</Heading>
        <Text color="gray.500">Your personal account</Text>
      </Stack>
    </HStack>
  );
}
