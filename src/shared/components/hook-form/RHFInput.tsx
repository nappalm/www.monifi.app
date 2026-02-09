import {
  Box,
  Input,
  InputGroup,
  InputGroupProps,
  InputLeftElement,
  InputProps,
  InputRightElement,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { type FocusEvent, type ReactNode, type RefObject } from "react";
import { Controller, useFormContext } from "react-hook-form";
import RHFError from "./RHFError";

type Props = {
  label?: string;
  description?: string;
  name?: string;
  icon?: ReactNode;
  rightElement?: ReactNode;
  inputGroup?: InputGroupProps;
  size?: "sm" | "md";
  inputRef?:
    | RefObject<HTMLInputElement>
    | ((node: HTMLInputElement | null) => void);
} & Omit<InputProps, "icon" | "name" | "ref" | "type" | "size"> & {
    type?: InputProps["type"] | "amount";
  };

export default function RHFInput({
  label,
  icon,
  name = "field",
  description,
  inputGroup,
  inputRef,
  isRequired,
  rightElement,
  onFocus,
  onBlur,
  size = "md",
  ...inputProps
}: Props) {
  const { control } = useFormContext();

  const bg = useColorModeValue("gray.200", "gray.900");
  const height = size === "sm" ? "40px" : "48px";
  const labelFontSize = size === "sm" ? "xs" : "sm";

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const { ref: fieldRef, onBlur: fieldOnBlur, ...restField } = field;

        const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
          onFocus?.(e);
        };

        const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
          fieldOnBlur();
          onBlur?.(e);
        };

        const setRefs = (node: HTMLInputElement | null) => {
          fieldRef(node);
          if (inputRef) {
            if (typeof inputRef === "function") {
              inputRef(node);
            } else {
              (
                inputRef as React.MutableRefObject<HTMLInputElement | null>
              ).current = node;
            }
          }
        };

        return (
          <Stack w="full" spacing={1}>
            {label && (
              <Text
                as="label"
                htmlFor={name}
                fontSize={labelFontSize}
                color={error ? "red.500" : "gray.500"}
                fontFamily="Geist Mono"
                textTransform="uppercase"
                px="1"
              >
                {label}
                {isRequired && " *"}
              </Text>
            )}

            <Box
              w="full"
              borderRadius="xl"
              bg={error ? "#F3126050" : bg}
              height={height}
              lineHeight={height}
              transition="background 500ms cubic-bezier(0.4, 0, 0.2, 1)"
            >
              <InputGroup {...inputGroup}>
                {icon && (
                  <InputLeftElement pointerEvents="none">
                    {icon}
                  </InputLeftElement>
                )}
                <Input
                  id={name}
                  bg="transparent"
                  variant="unstyled"
                  px={4}
                  height={height}
                  {...restField}
                  {...inputProps}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  ref={setRefs}
                />
                {rightElement && (
                  <InputRightElement pointerEvents="none">
                    {rightElement}
                  </InputRightElement>
                )}
              </InputGroup>
            </Box>

            <RHFError error={error?.message} />

            {description && (
              <Text fontSize="10px" opacity="0.8">
                {description}
              </Text>
            )}
          </Stack>
        );
      }}
    />
  );
}
