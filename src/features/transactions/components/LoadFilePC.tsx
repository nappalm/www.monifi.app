import { ButtonSound, ButtonSpinner } from "@/shared";
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
  useToast,
  VStack,
} from "@chakra-ui/react";
import { Delete, Files, FileText, Folder, Upload } from "pixelarticons/react";
import type { ChangeEvent, DragEvent } from "react";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const ACCEPTED_TYPES = ["application/pdf"];

interface LoadFilePCProps {
  onContinue: (file: File) => void;
  isLoading: boolean;
}

export default function LoadFilePC({ onContinue, isLoading }: LoadFilePCProps) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const validateFile = useCallback((file: File): boolean => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast({
        title: t("transactions.loadFile.invalidFile.title"),
        description: t("transactions.loadFile.invalidFile.description"),
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
      <Box
        cursor="pointer"
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack gap={0}>
          <Stack position="relative" mb={6}>
            <Files width={40} height={40} />
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
              <Upload width={15} height={15} />
            </Box>
          </Stack>
          <br />
          <Text>{t("transactions.loadFile.dragText")}</Text>
          <Text fontSize="sm" color="gray.500">
            {t("transactions.loadFile.clickText")}
          </Text>
          <Stack width="400px" mt={4}>
            <Collapse in={!selectedFile} style={{ width: "100%" }}>
              <ButtonSound
                w="full"
                variant="solid"
                leftIcon={<Folder width={16} height={16} />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
              >
                {t("transactions.loadFile.selectButton")}
              </ButtonSound>
            </Collapse>
            <Collapse in={!!selectedFile} style={{ width: "100%" }}>
              <Card size="sm" my={3} variant="solid">
                <CardBody>
                  <HStack justify="space-between">
                    <HStack spacing={3}>
                      <FileText width={24} height={24} />
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
                      aria-label={t("transactions.loadFile.removeFile")}
                      icon={<Delete width={16} height={16} />}
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
                loadingText={t("transactions.loadFile.processingText")}
              >
                {t("transactions.loadFile.extractButton")}
              </Button>
            </Collapse>
          </Stack>
        </VStack>
      </Box>

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
