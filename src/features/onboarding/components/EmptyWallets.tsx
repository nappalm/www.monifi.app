import {
  Box,
  Card,
  CardBody,
  HStack,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react";
import { Card as CardIcon, Circle, Tangent } from "pixelarticons/react";

export default function EmptyWallets() {
  return (
    <Stack position="relative">
      <Stack position="relative" mb={20}>
        <Card variant="solid" color="gray.500" opacity={0.5}>
          <CardBody>
            <HStack justify="space-between">
              <Stack>
                <HStack>
                  <CardIcon width={20} height={20} />
                  <Text>My debit card</Text>
                </HStack>
              </Stack>
            </HStack>
          </CardBody>
        </Card>
        <Card
          variant="solid"
          color="gray.500"
          position="absolute"
          bottom={-8}
          w="full"
          mt={5}
          transform="rotate(-2deg)"
          boxShadow="lg"
        >
          <CardBody>
            <HStack justify="space-between">
              <Stack>
                <HStack>
                  <CardIcon />
                  <Text>My credi card</Text>
                </HStack>
              </Stack>
              <Tangent />
            </HStack>
          </CardBody>
        </Card>
      </Stack>

      {/* Dotted connector */}
      <Box
        position="absolute"
        right="200px"
        bottom="30px"
        width="80px"
        height="calc(100% - 120px)"
        borderLeft="2px dashed"
        borderBottom="2px dashed"
        borderColor="gray.800"
        borderBottomLeftRadius="12px"
      />

      <Stack w="full" align="end" mb={5}>
        <HStack>
          <Circle style={{ opacity: 0.5 }} />
          <Tag fontFamily="Geist Mono">expenses or income</Tag>
        </HStack>
      </Stack>
    </Stack>
  );
}
