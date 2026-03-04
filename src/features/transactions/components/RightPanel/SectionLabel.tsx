import { Text, TextProps } from "@chakra-ui/react";

export function SectionLabel({ children, ...rest }: TextProps) {
  return (
    <Text
      fontSize="10px"
      fontWeight="bold"
      letterSpacing="widest"
      textTransform="uppercase"
      color="gray.500"
      {...rest}
    >
      {children}
    </Text>
  );
}
