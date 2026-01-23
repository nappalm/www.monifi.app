import { useRef, useState, useCallback } from "react";
import { Box, Card, CardBody, Text, VStack, useToast } from "@chakra-ui/react";
import { IconUpload, IconFileTypePdf } from "@tabler/icons-react";

const ACCEPTED_TYPES = ["application/pdf"];

export default function LoadFilePC({ onFileSelect }) {
  const inputRef = useRef(null);
  const toast = useToast();

  const [isDragging, setIsDragging] = useState(false);

  const validateFile = (file) => {
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
    (file) => {
      if (!file || !validateFile(file)) return;
      onFileSelect?.(file);
    },
    [onFileSelect],
  );

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const handleDragOver = (e) => {
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

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
    e.target.value = "";
  };

  return (
    <>
      <Card
        cursor="pointer"
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        variant="solid"
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
