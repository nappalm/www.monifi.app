import {
  Box,
  InputGroup,
  InputGroupProps,
  InputLeftElement,
  InputRightElement,
  Select,
  SelectProps,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { type FocusEvent, type ReactNode, type RefObject } from "react";
import { Controller, useFormContext } from "react-hook-form";
import RHFError from "./RHFError";
import { IconChevronDown } from "@tabler/icons-react";

type Props = {
  label?: string;
  description?: string;
  name?: string;
  icon?: ReactNode;
  rightElement?: ReactNode;
  inputGroup?: InputGroupProps;
  inputRef?:
    | RefObject<HTMLSelectElement>
    | ((node: HTMLSelectElement | null) => void);
} & Omit<SelectProps, "icon" | "name" | "ref">;

export default function RHFSelect({
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
  children,
  ...selectProps
}: Props) {
  const { control } = useFormContext();

  const bg = useColorModeValue("gray.200", "gray.900");

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const { ref: fieldRef, onBlur: fieldOnBlur, ...restField } = field;

        const handleFocus = (e: FocusEvent<HTMLSelectElement>) => {
          onFocus?.(e);
        };

        const handleBlur = (e: FocusEvent<HTMLSelectElement>) => {
          fieldOnBlur();
          onBlur?.(e);
        };

        const setRefs = (node: HTMLSelectElement | null) => {
          fieldRef(node);
          if (inputRef) {
            if (typeof inputRef === "function") {
              inputRef(node);
            } else {
              (
                inputRef as React.MutableRefObject<HTMLSelectElement | null>
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
                fontSize="sm"
                color={error ? "red.500" : "gray.500"}
                fontFamily="Geist Mono"
                textTransform="uppercase"
                px="1"
              >
                {label}
                {isRequired && " *"}
              </Text>
            )}

            <Box w="full" borderRadius="xl" height="48px" lineHeight="48px">
              <InputGroup {...inputGroup}>
                {icon && (
                  <InputLeftElement pointerEvents="none">
                    {icon}
                  </InputLeftElement>
                )}
                <Select
                  id={name}
                  height="48px"
                  {...restField}
                  {...selectProps}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  ref={setRefs}
                  icon={<IconChevronDown size={18} />}
                >
                  <option value="" />
                  {children}
                </Select>
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
