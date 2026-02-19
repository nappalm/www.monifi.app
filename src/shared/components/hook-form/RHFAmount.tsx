import {
  Input,
  InputGroup,
  InputGroupProps,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import {
  Controller,
  ControllerRenderProps,
  FieldValues,
  useFormContext,
} from "react-hook-form";
import { formatCurrency } from "@/shared/utils/formats";
import RHFError from "./RHFError";

const FORMAT_DELAY = 800;

type InputProps = {
  field: ControllerRenderProps<FieldValues, string>;
  error?: string;
  label?: string;
  placeholder?: string;
  height: string;
  labelFontSize: string;
  name: string;
};

function AmountInput({
  field,
  error,
  label,
  placeholder,
  height,
  labelFontSize,
  name,
}: InputProps) {
  const [displayValue, setDisplayValue] = useState<string>(() =>
    field.value ? formatCurrency(Number(field.value)) : "",
  );
  const isTypingRef = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync when form resets or defaultValues change externally
  useEffect(() => {
    if (!isTypingRef.current) {
      setDisplayValue(field.value ? formatCurrency(Number(field.value)) : "");
    }
  }, [field.value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, "");
    const parsed = raw === "" ? 0 : parseFloat(raw) || 0;

    isTypingRef.current = true;
    field.onChange(parsed);
    setDisplayValue(raw);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      isTypingRef.current = false;
      setDisplayValue(parsed > 0 ? formatCurrency(parsed) : "");
    }, FORMAT_DELAY);
  };

  const handleBlur = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    isTypingRef.current = false;
    field.onBlur();
    const num = Number(field.value) || 0;
    setDisplayValue(num > 0 ? formatCurrency(num) : "");
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
        </Text>
      )}
      <InputGroup>
        <Input
          id={name}
          px={4}
          height={height}
          fontFamily="Geist Mono"
          inputMode="decimal"
          placeholder={placeholder}
          value={displayValue}
          ref={field.ref}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </InputGroup>
      <RHFError error={error} />
    </Stack>
  );
}

type Props = {
  name?: string;
  label?: string;
  placeholder?: string;
  inputGroup?: InputGroupProps;
  size?: "sm" | "md";
};

export default function RHFAmount({
  name = "amount",
  label,
  placeholder = "0",
  size = "md",
}: Props) {
  const { control } = useFormContext();
  const height = size === "sm" ? "40px" : "48px";
  const labelFontSize = size === "sm" ? "xs" : "sm";

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <AmountInput
          field={field}
          error={error?.message}
          label={label}
          placeholder={placeholder}
          height={height}
          labelFontSize={labelFontSize}
          name={name}
        />
      )}
    />
  );
}
