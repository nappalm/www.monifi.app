import type { SelectProps } from "@chakra-ui/react";
import { Select, Stack, Text } from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";
import RHFError from "./RHFError";
import RHFLabel from "./RHFLabel";

type Props = {
  label?: string;
  description?: string;
  name?: string;
} & Omit<SelectProps, "icon" | "name" | "ref">;

export default function RHFSelect({
  label,
  name = "field",
  description,
  children,
  isRequired,
  ...select
}: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Stack spacing="2px" w="full">
          <RHFLabel
            label={label}
            error={error?.message}
            isRequired={isRequired}
          />
          <Select placeholder="Select option" {...field} {...select}>
            {children}
          </Select>
          <RHFError error={error?.message} />
          <Text fontSize="10px" opacity="0.8">
            {description}
          </Text>
        </Stack>
      )}
    />
  );
}
