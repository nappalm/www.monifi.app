/* eslint-disable react-refresh/only-export-components */
import type { IconButtonProps } from "@chakra-ui/react";
import { Flex, IconButton, Stack } from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";
import RHFError from "./RHFError";
import RHFLabel from "./RHFLabel";
export const lineColors = [
  "#4e64f2",
  "#3f8ff7",
  "#489fbe",
  "#09bb90",
  "#0eb95b",
  "#ea9e10",
  "#ea3c10",
  "#ea1093",
  "#cc10ea",
  "#8423ff",
  "#5910ea",
];

export default function RHFLineColors() {
  const { control } = useFormContext();

  return (
    <Controller
      name="color"
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Stack spacing="2px">
          <RHFLabel label="Choose your color" error={error?.message} />
          <Flex gap={1}>
            {lineColors.map((c) => (
              <ButtonColor
                isActive={field.value === c}
                onClick={() => field.onChange(c)}
                key={c}
                bg={c}
              />
            ))}
          </Flex>
          <RHFError error={error?.message} />
        </Stack>
      )}
    />
  );
}

interface ButtonColorProps extends Omit<IconButtonProps, "aria-label"> {
  isActive?: boolean;
}
function ButtonColor({ isActive = false, ...props }: ButtonColorProps) {
  return (
    <Flex
      align="center"
      border="2px solid"
      borderColor={isActive ? "black3" : "transparent"}
      borderRadius="full"
      p="2px"
    >
      <IconButton
        aria-label="Color"
        borderRadius="full"
        minW="18px"
        h="18px"
        {...props}
        _hover={{
          opacity: 0.5,
          bg: props.bg,
        }}
      />
    </Flex>
  );
}
