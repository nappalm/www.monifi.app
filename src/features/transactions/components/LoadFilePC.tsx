import { ButtonSpinner } from "@/shared";
import {
  Box,
  Button,
  Card,
  CardBody,
  Collapse,
  HStack,
  IconButton,
  Stack,
  Text,
  VStack,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import {
  IconFileFilled,
  IconFileTypePdf,
  IconPdf,
  IconTrashFilled,
} from "@tabler/icons-react";
import type { ChangeEvent, DragEvent } from "react";
import { useCallback, useRef, useState } from "react";

const ACCEPTED_TYPES = ["application/pdf"];

interface LoadFilePCProps {
  onContinue: (file: File) => void;
  isLoading: boolean;
}

export default function LoadFilePC({ onContinue, isLoading }: LoadFilePCProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const dotColor = useColorModeValue("gray.300", "gray.700");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const validateFile = useCallback((file: File): boolean => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast({
        title: "Archivo inválido",
        description: "Solo se permiten archivos PDF",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    return true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (!file || !validateFile(file)) return;
      setSelectedFile(file);
    },
    [validateFile],
  );

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleFile(file);
    e.target.value = "";
  };

  const handleContinue = () => {
    if (!selectedFile) return;
    onContinue(selectedFile);
  };

  return (
    <>
      <Card
        cursor="pointer"
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        border="none"
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          inset={0}
          pointerEvents="none"
          sx={{
            backgroundImage: `radial-gradient(circle, ${dotColor} 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
            maskImage:
              "radial-gradient(ellipse 60% 60% at 50% 50%, black 20%, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 60% 60% at 50% 50%, black 20%, transparent 70%)",
          }}
        />
        <CardBody py={20} position="relative">
          <VStack gap={0}>
            <Stack position="relative">
              <IconFileFilled size={40} />
              <Box
                position="absolute"
                bg="cyan.500"
                p={1}
                borderRadius="full"
                bottom={-1}
                right={-1}
                border="2px solid"
                borderColor="gray.900"
              >
                <IconPdf size={15} />
              </Box>
            </Stack>
            <br />
            <Text>Arrastra tu archivo PDF aquí</Text>
            <Text fontSize="sm" color="gray.500">
              o haz clic para seleccionarlo
            </Text>
            <Stack width="400px">
              <Collapse in={!!selectedFile} style={{ width: "100%" }}>
                <Card size="sm" my={3} variant="solid">
                  <CardBody>
                    <HStack justify="space-between">
                      <HStack spacing={3}>
                        <IconFileTypePdf size={24} />
                        <VStack align="start" gap={0}>
                          <Text noOfLines={1}>{selectedFile?.name}</Text>
                          <Text fontSize="xs" color="gray.500">
                            {selectedFile &&
                              (selectedFile?.size / 1024).toFixed(1)}{" "}
                            KB
                          </Text>
                        </VStack>
                      </HStack>
                      <IconButton
                        aria-label="Eliminar archivo"
                        icon={<IconTrashFilled size={16} />}
                        size="sm"
                        variant="ghost"
                        colorScheme="red"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile();
                        }}
                      />
                    </HStack>
                  </CardBody>
                </Card>
              </Collapse>
              <Collapse in={!!selectedFile} style={{ width: "100%" }}>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleContinue();
                  }}
                  w="full"
                  variant="solid"
                  colorScheme="cyan"
                  isLoading={isLoading}
                  spinner={<ButtonSpinner />}
                  loadingText="Procesando documento"
                >
                  Extraer información
                </Button>
              </Collapse>
            </Stack>
          </VStack>
        </CardBody>
      </Card>

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        hidden
        onChange={handleChange}
      />
    </>
  );
}
