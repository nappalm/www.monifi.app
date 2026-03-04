import {
  Badge,
  Box,
  Card,
  CardBody,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import { ChevronRight2, Invoice } from "pixelarticons/react";
import { useNavigate } from "react-router-dom";
import { TRANSACTIONS_PATHS } from "../../router";
import { useClickSound } from "@/shared";

export function UploadCard() {
  const navigate = useNavigate();
  const playSound = useClickSound();

  const handleClick = () => {
    playSound();
    navigate(TRANSACTIONS_PATHS.extract);
  };

  return (
    <Card borderRadius={0} ml="-1px" cursor="pointer" onClick={handleClick}>
      <CardBody pr={2}>
        <HStack justify="space-between">
          <HStack color="gray.500" gap={3}>
            <Invoice height={18} width={18} />
            <Stack gap={0}>
              <Text fontSize="md">UPLOAD TRANSACTIONS</Text>
            </Stack>
          </HStack>
          <Stack gap={0} align="end">
            <HStack gap={1}>
              <Badge>PDF</Badge>
              <Box color="gray.500">
                <ChevronRight2 />
              </Box>
            </HStack>
          </Stack>
        </HStack>
      </CardBody>
    </Card>
  );
}
