import { Button, ButtonGroup, HStack } from "@chakra-ui/react";
import { CommmonFormProps } from "../utils/types";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";

export default function FormButtons({
  onSkip,
  onBack,
  onNext,
  isLoading,
}: CommmonFormProps) {
  return (
    <HStack justify="space-between">
      <Button
        onClick={onBack}
        size="sm"
        variant="ghost"
        leftIcon={<IconArrowLeft size={16} />}
      >
        Back
      </Button>
      <ButtonGroup spacing="1px" isDisabled={isLoading} size="sm">
        <Button
          onClick={onSkip}
          variant="ghost"
          isDisabled={isLoading}
          borderRightRadius={0}
        >
          Skip
        </Button>
        <Button
          type="submit"
          borderLeftRadius={0}
          onClick={onNext}
          isLoading={isLoading}
          rightIcon={<IconArrowRight size={16} />}
        >
          Next
        </Button>
      </ButtonGroup>
    </HStack>
  );
}
