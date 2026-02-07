import { Input, useColorModeValue } from "@chakra-ui/react";
import { memo } from "react";

interface FloatingInputProps {
  inputProps:
    | { style: { display: string } }
    | {
        ref: React.RefObject<HTMLInputElement>;
        value: string;
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        onBlur: () => void;
        style: React.CSSProperties;
        shouldShowInput: boolean;
        type: string;
        step: string | undefined;
      };
  cellEditStyle: React.CSSProperties;
}

export const FloatingInput = memo(function FloatingInput({
  inputProps,
  cellEditStyle,
}: FloatingInputProps) {
  const inputBg = useColorModeValue("white", "gray.700");

  if ("shouldShowInput" in inputProps && !inputProps.shouldShowInput) {
    return null;
  }

  return (
    <Input
      {...inputProps}
      size="sm"
      variant="unstyled"
      bg={inputBg}
      fontSize="sm"
      fontWeight="semibold"
      px="3"
      sx={{
        ...inputProps.style,
        ...cellEditStyle,
        boxSizing: "border-box",
        _focus: {
          outline: "none",
        },
      }}
    />
  );
});
