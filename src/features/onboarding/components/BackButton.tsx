import { HStack, IconButton, IconButtonProps, Text } from "@chakra-ui/react";
import { IconArrowLeft } from "@tabler/icons-react";

type Props = {
  step: number;
  total: number;
} & Omit<IconButtonProps, "aria-label">;

export default function BackButton(props: Props) {
  const { step, total, ...buttonProps } = props;

  const label = step + "/" + total;
  return (
    <HStack position="absolute" top={5} left={5}>
      <IconButton
        aria-label="Previous step"
        icon={<IconArrowLeft size={16} />}
        size="sm"
        {...buttonProps}
      />
      <Text color="gray.500" letterSpacing="tight">
        {label}
      </Text>
    </HStack>
  );
}
