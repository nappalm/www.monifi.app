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
import {
  useState,
  type FocusEvent,
  type ReactNode,
  type RefObject,
} from "react";
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
  const [isFocused, setIsFocused] = useState(false);

  const bg = useColorModeValue("gray.200", "gray.900");

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const { ref: fieldRef, onBlur: fieldOnBlur, ...restField } = field;
        const hasValue = field.value?.toString().length > 0;
        const showFloating = isFocused || hasValue;

        let labelColor = "gray.500";
        if (error) {
          labelColor = "red.500";
        } else if (isFocused) {
          labelColor = "inherit";
        }

        const handleFocus = (e: FocusEvent<HTMLSelectElement>) => {
          setIsFocused(true);
          onFocus?.(e);
        };

        const handleBlur = (e: FocusEvent<HTMLSelectElement>) => {
          setIsFocused(false);
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
          <Stack>
            <Box
              position="relative"
              w="full"
              borderRadius="xl"
              bg={error ? "#F3126050" : bg}
              height="56px"
              lineHeight="56px"
              transition="background 500ms cubic-bezier(0.4, 0, 0.2, 1)"
            >
              <Box
                as="label"
                htmlFor={name}
                position="absolute"
                top={showFloating ? "-13px" : "0px"}
                left={icon ? "40px" : "12px"}
                fontSize={showFloating ? "xs" : "sm"}
                color={labelColor}
                px="1"
                transition="all 0.2s ease"
                zIndex="1"
                pointerEvents="none"
              >
                {label}
                {isRequired && " *"}
              </Box>

              <InputGroup {...inputGroup}>
                {icon && (
                  <InputLeftElement pointerEvents="none">
                    {icon}
                  </InputLeftElement>
                )}
                <Select
                  id={name}
                  bg="transparent"
                  variant="unstyled"
                  px={4}
                  height={showFloating ? "20px" : "56px"}
                  mt={showFloating ? "7px" : "0px"}
                  {...restField}
                  {...selectProps}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  ref={setRefs}
                  icon={<IconChevronDown size={18} />}
                >
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
