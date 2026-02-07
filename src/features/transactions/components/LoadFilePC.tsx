import {
  Card,
  CardBody,
  HStack,
  IconButton,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { IconFileTypePdf, IconTrash, IconUpload } from "@tabler/icons-react";
import type { ChangeEvent, DragEvent } from "react";
import { useCallback, useRef, useState } from "react";

const ACCEPTED_TYPES = ["application/pdf"];

interface LoadFilePCProps {
  onFileSelect?: (file: File | null) => void;
}

export default function LoadFilePC({ onFileSelect }: LoadFilePCProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const validateFile = (file: File): boolean => {
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
  };

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (!file || !validateFile(file)) return;
      setSelectedFile(file);
      onFileSelect?.(file);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [validateFile],
  );

  const handleRemoveFile = () => {
    setSelectedFile(null);
    onFileSelect?.(null);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragEnter = () => {
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleFile(file);
    e.target.value = "";
  };

  if (selectedFile) {
    return (
      <Card>
        <CardBody>
          <HStack justify="space-between">
            <HStack spacing={3}>
              <IconFileTypePdf size={24} />
              <VStack align="start" gap={0}>
                <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                  {selectedFile.name}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </Text>
              </VStack>
            </HStack>
            <IconButton
              aria-label="Eliminar archivo"
              icon={<IconTrash size={16} />}
              size="sm"
              variant="ghost"
              colorScheme="red"
              onClick={handleRemoveFile}
            />
          </HStack>
        </CardBody>
      </Card>
    );
  }

  return (
    <>
      <Card
        cursor="pointer"
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        <CardBody>
          <VStack gap={0}>
            {isDragging ? (
              <IconFileTypePdf size={18} />
            ) : (
              <IconUpload size={18} />
            )}

            <br />
            <Text>Arrastra tu archivo PDF aquí</Text>
            <Text fontSize="sm" color="gray.500">
              o haz clic para seleccionarlo
            </Text>
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
