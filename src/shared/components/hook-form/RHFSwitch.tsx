import { Switch, SwitchProps } from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";

type Props = {
  label: string;
  name: string;
} & SwitchProps;

export default function RHFSwitch({ label, name, ...rest }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange, onBlur, ref } }) => (
        <Switch
          isChecked={value}
          onChange={onChange}
          onBlur={onBlur}
          ref={ref}
          {...rest}
          display="flex"
          alignItems="center"
        >
          {label}
        </Switch>
      )}
    />
  );
}
