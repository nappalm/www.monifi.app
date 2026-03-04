import {
  Button,
  Card,
  CardBody,
  CardHeader,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  ArrowBigUp,
  ChevronRight,
  CornerRightDown,
  Database,
  Flag,
  InfoBox,
  SectionMinus,
  SquareAlert,
} from "pixelarticons/react";

export default function RightPanel() {
  return (
    <Stack p={2}>
      <Card size="sm" bg="#000">
        <CardHeader
          borderBottom="1px solid"
          borderColor="gray.900"
          bg="#000"
          p={1}
          textAlign="center"
          color="gray.300"
          fontWeight="semibold"
          fontSize="sm"
        >
          Notifications
        </CardHeader>
        <CardBody color="gray.400">
          <Stack>
            <HStack>
              <InfoBox width={16} height={16} />
              <Text fontSize="sm" fontWeight={500}>
                Cargo inusual de $2,500
              </Text>
            </HStack>
            <HStack>
              <InfoBox width={16} height={16} />
              <Text fontSize="sm" fontWeight={500}>
                30% en meta de ahorro, faltan $4,200
              </Text>
            </HStack>
            <HStack>
              <InfoBox width={16} height={16} />
              <Text fontSize="sm" fontWeight={500}>
                Superaste tu presupuesto en comida
              </Text>
            </HStack>
          </Stack>
        </CardBody>
      </Card>

      <Card size="sm" bg="#000">
        <CardHeader
          borderBottom="1px solid"
          borderColor="gray.900"
          bg="#000"
          p={1}
          textAlign="center"
          color="gray.300"
          fontWeight="semibold"
          fontSize="sm"
        >
          Information
        </CardHeader>
        <CardBody color="gray.400">
          <Stack>
            <HStack>
              <CornerRightDown width={16} height={16} />
              <Text fontSize="sm" fontWeight={500}>
                Tus gastos bajaron 12% vs mes anterior
              </Text>
            </HStack>
            <HStack>
              <ArrowBigUp width={16} height={16} />
              <Text fontSize="sm" fontWeight={500}>
                Mayor gasto: Transporte ($4,500)
              </Text>
            </HStack>
            <HStack>
              <SectionMinus width={16} height={16} />
              <Text fontSize="sm" fontWeight={500}>
                4 suscripciones activas ($1,800/mes)
              </Text>
            </HStack>
          </Stack>
        </CardBody>
      </Card>
      <Text color="gray.500" fontFamily="Geist Mono">
        ACTIONS
      </Text>
      <Stack gap={1}>
        <Button
          justifyContent="space-between"
          rightIcon={<ChevronRight width={16} height={16} />}
          bg="#000"
          size="sm"
        >
          <HStack>
            <SquareAlert width={16} height={16} />
            <Text>8 Transacciones sin categoria</Text>
          </HStack>
        </Button>
        <Button
          justifyContent="space-between"
          rightIcon={<ChevronRight width={16} height={16} />}
          bg="#000"
          size="sm"
        >
          <HStack>
            <Database width={16} height={16} />
            <Text>Comparar con mes anterior</Text>
          </HStack>
        </Button>
        <Button
          justifyContent="space-between"
          rightIcon={<ChevronRight width={16} height={16} />}
          bg="#000"
          size="sm"
        >
          <HStack>
            <Flag width={16} height={16} />
            <Text>Crear meta</Text>
          </HStack>
        </Button>
      </Stack>
    </Stack>
  );
}
