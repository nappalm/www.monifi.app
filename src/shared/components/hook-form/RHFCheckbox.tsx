import { Checkbox, CheckboxProps } from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";

type Props = {
  label: string;
  name: string;
} & CheckboxProps;

export default function RHFCheckbox({ label, name }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => <Checkbox {...field}>{label}</Checkbox>}
    />
  );
}
