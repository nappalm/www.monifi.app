import type { TextareaProps } from "@chakra-ui/react";
import { Stack, Text, Textarea } from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";
import RHFError from "./RHFError";

type Props = {
  label?: string;
  description?: string;
  name?: string;
} & Omit<TextareaProps, "icon" | "name" | "ref">;

export default function RHFTextarea({
  label,
  name = "field",
  description,
  ...select
}: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Stack spacing="2px" w="full">
          {label && <Text fontSize="12px">{label}</Text>}

          <Textarea {...field} {...select} />
          <RHFError error={error?.message} />

          <Text fontSize="10px" opacity="0.8">
            {description}
          </Text>
        </Stack>
      )}
    />
  );
}
